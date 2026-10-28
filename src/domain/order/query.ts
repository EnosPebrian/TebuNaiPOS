import { kitchenStatuses, orderStatuses, type OrderStatus } from "./lifecycle";
import { reportRange } from "./report";

export interface OrderFilters {
  status?: OrderStatus; reference?: string; payment?: "paid" | "unpaid";
  source?: "counter" | "online"; method?: "pickup" | "delivery"; from?: string; to?: string;
  driver?: "assigned" | "unassigned";
}
export interface OrderQuery { page: number; view: "orders" | "kitchen"; filters: OrderFilters }
const filterKeys = ["status", "reference", "payment", "source", "method", "driver", "from", "to"] as const;
export function parseOrderQuery(params: URLSearchParams): OrderQuery {
  if (["page", "view", ...filterKeys].some((key) => params.getAll(key).length > 1)) throw new Error("Choose one value for each order filter.");
  const pageText = params.get("page") ?? "1";
  const page = Number(pageText);
  if (!/^\d+$/.test(pageText) || !Number.isInteger(page) || page < 1 || page > 1000) throw new Error("Choose a page between 1 and 1,000.");
  const view = params.get("view") ?? "orders";
  if (view !== "orders" && view !== "kitchen") throw new Error("Choose a valid order view.");
  const status = params.get("status") || undefined;
  if (status && !orderStatuses.includes(status as OrderStatus)) throw new Error("Choose a valid order status.");
  if (view === "kitchen" && status && !kitchenStatuses.includes(status as OrderStatus)) throw new Error("Choose an active kitchen status.");
  const reference = params.get("reference")?.trim().toLowerCase() || undefined;
  if (reference && !/^[a-f0-9]{8}[a-f0-9-]{0,28}$/.test(reference)) throw new Error("Enter an order reference or its first 8 or more characters.");
  const payment = params.get("payment") || undefined;
  const source = params.get("source") || undefined;
  const method = params.get("method") || undefined;
  if (payment && payment !== "paid" && payment !== "unpaid") throw new Error("Choose a valid payment filter.");
  if (source && source !== "counter" && source !== "online") throw new Error("Choose a valid order source.");
  if (method && method !== "pickup" && method !== "delivery") throw new Error("Choose pickup or delivery.");
  const driver = params.get("driver") || undefined;
  if (driver && driver !== "assigned" && driver !== "unassigned") throw new Error("Choose a valid driver assignment filter.");
  if (driver && method === "pickup") throw new Error("Driver filters apply to delivery orders only.");
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  if (Boolean(from) !== Boolean(to)) throw new Error("Choose both dates, or clear both dates.");
  if (from && to) reportRange(from, to);
  const filters: OrderFilters = {};
  if (status) filters.status = status as OrderStatus;
  if (reference) filters.reference = reference;
  if (payment === "paid" || payment === "unpaid") filters.payment = payment;
  if (source === "counter" || source === "online") filters.source = source;
  if (method === "pickup" || method === "delivery") filters.method = method;
  if (driver === "assigned" || driver === "unassigned") filters.driver = driver;
  if (from && to) { filters.from = from; filters.to = to; }
  return { page, view, filters };
}
export function orderQueryParams(page: number, view: OrderQuery["view"], filters: OrderFilters): URLSearchParams {
  const params = new URLSearchParams({ page: String(page), view });
  for (const key of filterKeys) { const value = filters[key]; if (value) params.set(key, value); }
  return params;
}
