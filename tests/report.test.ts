import { describe, expect, it } from "vitest";
import { reportCsv, reportRange, summarizeOrders, wibToday, type ReportRecord } from "@/domain/order/report";
import { parseReportRange } from "@/lib/server/reportInput";

const range = reportRange("2026-10-28", "2026-10-28");
const record = (overrides: Partial<ReportRecord> = {}): ReportRecord => ({ id: "test-reference", createdAt: "2026-10-28T00:00:00.000Z", source: "counter", status: "confirmed", paymentStatus: "unpaid", subtotal: 19000, deliveryFee: 0, total: 19000, history: [{ at: "2026-10-28T00:00:00.000Z", paymentStatus: "unpaid", total: 19000 }], ...overrides });

describe("WIB reporting boundaries", () => {
  it("uses Jakarta dates and an exclusive next-day boundary", () => {
    expect(range).toMatchObject({ start: "2026-10-27T17:00:00.000Z", end: "2026-10-28T17:00:00.000Z" });
    expect(wibToday(new Date("2026-10-27T17:00:00.000Z"))).toBe("2026-10-28");
    const result = summarizeOrders([record({ id: "start", createdAt: range.start }), record({ id: "end", createdAt: range.end })], range);
    expect(result.created).toBe(1); expect(result.rows[0].id).toBe("start");
  });
  it("rejects invalid dates, reversed ranges and more than 31 inclusive days", () => {
    for (const pair of [["2026-02-30", "2026-03-01"], ["2026-10-29", "2026-10-28"], ["2026-01-01", "2026-02-01"], ["2026-1-01", "2026-01-02"]]) expect(() => reportRange(pair[0], pair[1])).toThrow();
    expect(reportRange("2024-02-29", "2024-03-30").from).toBe("2024-02-29");
  });
  it("rejects repeated filters and preserves explicit empty invalid values", () => {
    expect(() => parseReportRange(new URLSearchParams("from=2026-10-28&from=2026-10-29"))).toThrow();
    expect(() => parseReportRange(new URLSearchParams("from="))).toThrow();
  });
});

describe("order and payment reporting", () => {
  it("separates completed, cancelled, active, source and pending quote counts", () => {
    const result = summarizeOrders([record({ status: "completed", paymentStatus: "paid" }), record({ id: "cancelled", status: "cancelled" }), record({ id: "delivery", source: undefined, total: null, deliveryFee: null })], range);
    expect(result).toMatchObject({ created: 3, completed: 1, completedValue: 19000, cancelled: 1, active: 1, counter: 2, online: 1, pendingQuotes: 1, receivedValue: 0 });
  });
  it("counts only the first paid event, including older orders and paid cancellations", () => {
    const paid = { at: "2026-10-28T01:00:00.000Z", paymentStatus: "paid" as const, total: 19000 };
    const source = record({ createdAt: "2026-10-01T00:00:00.000Z", status: "cancelled", paymentStatus: "paid", history: [paid, { ...paid, at: "2026-10-28T02:00:00.000Z" }] });
    const result = summarizeOrders([source], range);
    expect(result).toMatchObject({ created: 0, receipts: 1, receivedValue: 19000, cancelledReceipts: 1, cancelledReceivedValue: 19000 });
    expect(result.rows[0]).toMatchObject({ createdInPeriod: false, receivedInPeriod: true, firstPaidAt: paid.at });
    expect(source.history).toHaveLength(2);
  });
  it("does not recount an earlier payment when a paid order changes status today", () => {
    const result = summarizeOrders([record({ paymentStatus: "paid", history: [{ at: "2026-10-01T00:00:00.000Z", paymentStatus: "paid", total: 19000 }, { at: "2026-10-28T00:00:00.000Z", paymentStatus: "paid", total: 19000 }] })], range);
    expect(result.receipts).toBe(0); expect(result.receivedValue).toBe(0); expect(result.created).toBe(1);
  });
  it("exports nullable quotes as blank cells and escapes spreadsheet formulas", () => {
    const result = summarizeOrders([record({ id: '=HYPERLINK("x")', deliveryFee: null, total: null })], range);
    const csv = reportCsv(result);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
    expect(csv).toContain('"19000","","",""');
    expect(csv).not.toContain("history"); expect(csv).not.toContain("customer"); expect(csv).toContain("Period from WIB");
  });
});
