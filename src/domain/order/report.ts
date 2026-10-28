import type { OrderStatus } from "./lifecycle";
import type { OrderItem } from "./OrderItem";

const dayMs = 86_400_000;
export interface ReportRange { from: string; to: string; start: string; end: string }
export interface ReportRecord {
  id: string; createdAt: string; source?: "counter"; status: OrderStatus; paymentStatus: "paid" | "unpaid";
  subtotal: number; deliveryFee: number | null; total: number | null;
  history: readonly { at: string; paymentStatus: "paid" | "unpaid"; total: number | null }[];
  items?: readonly Pick<OrderItem, "productId" | "productName" | "variantId" | "variantLabel" | "quantity" | "unitPrice">[];
}
export interface ReportRow extends Omit<ReportRecord, "history" | "items"> { firstPaidAt: string | null; createdInPeriod: boolean; receivedInPeriod: boolean; receivedAmount: number | null }
export interface ProductSalesRow {
  productId: string; productName: string; variantId: string; variantLabel: string;
  quantity: number; orders: number; itemValue: number;
}
export interface SalesReport {
  range: ReportRange; created: number; counter: number; online: number; completed: number; completedValue: number;
  cancelled: number; active: number; pendingQuotes: number; receipts: number; receivedValue: number;
  cancelledReceipts: number; cancelledReceivedValue: number; rows: ReportRow[];
  products: ProductSalesRow[]; productUnits: number; productValue: number; missingItemOrders: number;
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
  const report: SalesReport = { range, created: 0, counter: 0, online: 0, completed: 0, completedValue: 0, cancelled: 0, active: 0, pendingQuotes: 0, receipts: 0, receivedValue: 0, cancelledReceipts: 0, cancelledReceivedValue: 0, rows: [], products: [], productUnits: 0, productValue: 0, missingItemOrders: 0 };
  const products = new Map<string, ProductSalesRow>();
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
      if (record.status === "completed") {
        if (!record.items?.length) report.missingItemOrders++;
        const counted = new Set<string>();
        for (const item of record.items ?? []) {
          // Saved labels keep historical names and toppings, without consulting today's catalog.
          const key = JSON.stringify([item.productId, item.variantId, item.productName, item.variantLabel]);
          const row = products.get(key) ?? { productId: item.productId, productName: item.productName, variantId: item.variantId, variantLabel: item.variantLabel, quantity: 0, orders: 0, itemValue: 0 };
          row.quantity += item.quantity;
          row.itemValue += item.unitPrice * item.quantity;
          if (!counted.has(key)) { row.orders++; counted.add(key); }
          products.set(key, row);
          report.productUnits += item.quantity;
          report.productValue += item.unitPrice * item.quantity;
        }
      }
    }
    if (receivedInPeriod) {
      report.receipts++; report.receivedValue += paid.total!;
      if (record.status === "cancelled") { report.cancelledReceipts++; report.cancelledReceivedValue += paid.total!; }
    }
    report.rows.push({ id: record.id, createdAt: record.createdAt, source: record.source, status: record.status, paymentStatus: record.paymentStatus, subtotal: record.subtotal, deliveryFee: record.deliveryFee, total: record.total, firstPaidAt: paid?.at ?? null, createdInPeriod, receivedInPeriod, receivedAmount: receivedInPeriod ? paid.total : null });
  }
  report.rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
  report.products = [...products.values()].sort((a, b) => b.quantity - a.quantity || b.itemValue - a.itemValue || a.productName.localeCompare(b.productName) || a.variantLabel.localeCompare(b.variantLabel) || a.variantId.localeCompare(b.variantId));
  return report;
}
function csvRows(rows: readonly (readonly unknown[])[]): string {
  const cell = (value: unknown) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^\s*[=+@-]/.test(text)) text = "'" + text;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
export function reportCsv(report: SalesReport): string {
  const header = ["Reference", "Created UTC", "Source", "Current status", "Current payment", "Items IDR", "Delivery IDR", "Total IDR", "First payment recorded UTC", "Created in WIB period", "Payment in WIB period", "Recorded payment IDR", "Period from WIB", "Period to WIB"];
  const rows = report.rows.map((row) => [row.id, row.createdAt, row.source ?? "online", row.status, row.paymentStatus, row.subtotal, row.deliveryFee, row.total, row.firstPaidAt, row.createdInPeriod, row.receivedInPeriod, row.receivedAmount, report.range.from, report.range.to]);
  return csvRows([header, ...rows]);
}
export function productReportCsv(report: SalesReport): string {
  const header = ["Product ID", "Saved product / toppings", "Saved serving / bottle size", "Configuration ID", "Units", "Completed orders", "Item value IDR", "Period from WIB", "Period to WIB", "Completed orders missing items"];
  const rows = report.products.map((row) => [row.productId, row.productName, row.variantLabel, row.variantId, row.quantity, row.orders, row.itemValue, report.range.from, report.range.to, report.missingItemOrders]);
  return csvRows([header, ...rows]);
}
