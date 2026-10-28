import { describe, expect, it } from "vitest";
import { productReportCsv, reportRange, summarizeOrders, type ReportRecord } from "@/domain/order/report";

const range = reportRange("2026-10-28", "2026-10-28");
const item = { productId: "juice", productName: "Juice + Lime", variantId: "juice-500-lime", variantLabel: "500 ml", quantity: 2, unitPrice: 20000 };
const record = (overrides: Partial<ReportRecord> = {}): ReportRecord => ({ id: "reference", createdAt: range.start, status: "completed", paymentStatus: "paid", subtotal: 40000, deliveryFee: 15000, total: 55000, history: [], items: [item], ...overrides });

describe("completed product sales", () => {
  it("uses saved line prices and quantities, excludes delivery, and does not mutate snapshots", () => {
    const original = Object.freeze({ ...item, unitPrice: 12345 });
    const report = summarizeOrders([record({ items: [original] }), record({ id: "second" })], range);
    expect(report).toMatchObject({ productUnits: 4, productValue: 64690, missingItemOrders: 0 });
    expect(report.products).toEqual([{ productId: "juice", productName: "Juice + Lime", variantId: "juice-500-lime", variantLabel: "500 ml", quantity: 4, orders: 2, itemValue: 64690 }]);
    expect(original.unitPrice).toBe(12345);
  });
  it("excludes active, cancelled, and older orders even when their payment is in this period", () => {
    const paid = { at: range.start, paymentStatus: "paid" as const, total: 55000 };
    const report = summarizeOrders([record({ status: "cancelled", history: [paid] }), record({ status: "ready" }), record({ createdAt: "2026-10-01T00:00:00.000Z", history: [paid] }), record({ createdAt: range.end }), record()], range);
    expect(report.productUnits).toBe(2); expect(report.productValue).toBe(40000);
    expect(report.products[0].orders).toBe(1); expect(report.receipts).toBe(2);
  });
  it("keeps configurations, sizes, and renamed historical labels distinct with stable ranking", () => {
    const report = summarizeOrders([record({ items: [item, { ...item, variantId: "juice-250-lime", variantLabel: "250 ml", quantity: 3, unitPrice: 15000 }, { ...item, productName: "Old label", quantity: 1 }, { ...item, variantId: "juice-500-plain", productName: "Juice", quantity: 2, unitPrice: 17000 }] })], range);
    expect(report.products.map((row) => row.quantity)).toEqual([3, 2, 2, 1]);
    expect(report.products[0].variantLabel).toBe("250 ml");
    expect(report.products[1].itemValue).toBe(40000);
    expect(report.productUnits).toBe(8);
  });
  it("counts each order once per configuration, including repeated lines", () => {
    const report = summarizeOrders([record({ items: [item, item] })], range);
    expect(report.products[0]).toMatchObject({ quantity: 4, orders: 1, itemValue: 80000 });
  });
  it("flags missing legacy items only for included completed orders", () => {
    const report = summarizeOrders([record({ items: undefined }), record({ id: "empty", items: [] }), record({ status: "cancelled", items: undefined })], range);
    expect(report.missingItemOrders).toBe(2); expect(report.products).toEqual([]);
    expect(report.completed).toBe(2); expect(report.productValue).toBe(0);
  });
  it("exports escaped labels and explicit dates without leaking item or order metadata", () => {
    const privateItem = { ...item, productName: '=HYPERLINK("url")', image: "private-image", configuredProduct: { private: "secret" } };
    const report = summarizeOrders([record({ items: [privateItem] })], range);
    const csv = productReportCsv(report);
    expect(csv.startsWith("\uFEFF")).toBe(true); expect(csv).toContain('"\'=HYPERLINK(""url"")"');
    expect(csv).toContain('"2","1","40000","2026-10-28","2026-10-28","0"');
    expect(csv).not.toContain("reference"); expect(csv).not.toContain("private-image");
    expect(JSON.stringify(report)).not.toContain("secret"); expect(report.rows[0]).not.toHaveProperty("items");
  });
});
