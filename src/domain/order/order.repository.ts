import type { Order } from "./Order";
import type { ManagedOrder, OrderEvent, OrderStatus } from "./lifecycle";
import type { ReportRange, SalesReport } from "./report";

export interface OrderRepository {
  create(order: Order, key: string, fingerprint: string, actor?: string): Promise<Order>;
  get(id: string): Promise<ManagedOrder | null>;
  report(range: ReportRange): Promise<SalesReport>;
  list(page: number, status?: OrderStatus, view?: "orders" | "kitchen"): Promise<{ orders: ManagedOrder[]; total: number }>;
  update(id: string, version: number, order: Order, event: OrderEvent): Promise<ManagedOrder | null>;
}
