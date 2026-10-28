import type { OrderStatus } from "./lifecycle";

const dayMs = 86_400_000;
export interface ReportRange { from: string; to: string; start: string; end: string }
export interface ReportRecord {
  id: string; createdAt: string; source?: "counter"; status: OrderStatus; paymentStatus: "paid" | "unpaid";
  subtotal: number; deliveryFee: number | null; total: number | null;
  history: readonly { at: string; paymentStatus: "paid" | "unpaid"; total: number | null }[];
}
export interface ReportRow extends Omit<ReportRecord, "history"> { firstPaidAt: string | null; createdInPeriod: boolean; receivedInPeriod: boolean; receivedAmount: number | null }
export interface SalesReport {
  range: ReportRange; created: number; counter: number; online: number; completed: number; completedValue: number;
  cancelled: number; active: number; pendingQuotes: number; receipts: number; receivedValue: number;
  cancelledReceipts: number; cancelledReceivedValue: number; rows: ReportRow[];
}
export function wibToday(now = new Date()): string { return new Date(now.getTime() + 7 * 3_600_000).toISOString().slice(0, 10); }
export function reportRange(from: string, to: string): ReportRange {
  function midnight(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "2000-01-01" || value > "2099-12-31") throw new Error("Choose valid dates between 2000 and 2099.");
    const date = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error("Choose valid calendar dates.");
    return date.getTime();
  }
  const first = midnight(from); const last = midnight(to);
  if (last < first || last - first >= 31 * dayMs) throw new Error("Choose a date range of 1 to 31 days.");
  return { from, to, start: new Date(first - 7 * 3_600_000).toISOString(), end: new Date(last + dayMs - 7 * 3_600_000).toISOString() };
}
export function summarizeOrders(records: readonly ReportRecord[], range: ReportRange): SalesReport {
  const report: SalesReport = { range, created: 0, counter: 0, online: 0, completed: 0, completedValue: 0, cancelled: 0, active: 0, pendingQuotes: 0, receipts: 0, receivedValue: 0, cancelledReceipts: 0, cancelledReceivedValue: 0, rows: [] };
  const inPeriod = (at: string) => at >= range.start && at < range.end;
  for (const record of records) {
    const paid = record.history.filter((event) => event.paymentStatus === "paid").toSorted((a, b) => a.at.localeCompare(b.at))[0];
    const createdInPeriod = inPeriod(record.createdAt);
    const receivedInPeriod = Boolean(paid && paid.total !== null && inPeriod(paid.at));
    if (!createdInPeriod && !receivedInPeriod) continue;
    if (createdInPeriod) {
      report.created++;
      if (record.source === "counter") report.counter++; else report.online++;
      if (record.status === "completed") { report.completed++; report.completedValue += record.total ?? 0; }
      else if (record.status === "cancelled") report.cancelled++;
      else report.active++;
      if (record.total === null && !["completed", "cancelled"].includes(record.status)) report.pendingQuotes++;
    }
    if (receivedInPeriod) {
      report.receipts++; report.receivedValue += paid.total!;
      if (record.status === "cancelled") { report.cancelledReceipts++; report.cancelledReceivedValue += paid.total!; }
    }
    const { history: _history, ...order } = record;
    void _history;
    report.rows.push({ ...order, firstPaidAt: paid?.at ?? null, createdInPeriod, receivedInPeriod, receivedAmount: receivedInPeriod ? paid.total : null });
  }
  report.rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
  return report;
}
export function reportCsv(report: SalesReport): string {
  const cell = (value: unknown) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^\s*[=+@-]/.test(text)) text = "'" + text;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const header = ["Reference", "Created UTC", "Source", "Current status", "Current payment", "Items IDR", "Delivery IDR", "Total IDR", "First payment recorded UTC", "Created in WIB period", "Payment in WIB period", "Recorded payment IDR", "Period from WIB", "Period to WIB"];
  const rows = report.rows.map((row) => [row.id, row.createdAt, row.source ?? "online", row.status, row.paymentStatus, row.subtotal, row.deliveryFee, row.total, row.firstPaidAt, row.createdInPeriod, row.receivedInPeriod, row.receivedAmount, report.range.from, report.range.to]);
  return "\uFEFF" + [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
