import type { Order } from "./Order";
import type { ManagedOrder, OrderEvent, OrderStatus } from "./lifecycle";
import type { ReportRange, SalesReport } from "./report";
import type { OrderFilters } from "./query";

export interface OrderRepository {
  create(order: Order, key: string, fingerprint: string, actor?: string): Promise<Order>;
  get(id: string): Promise<ManagedOrder | null>;
  report(range: ReportRange): Promise<SalesReport>;
  list(page: number, status?: OrderStatus, view?: "orders" | "kitchen", filters?: OrderFilters): Promise<{ orders: ManagedOrder[]; total: number; page: number }>;
  update(id: string, version: number, order: Order, event: OrderEvent): Promise<ManagedOrder | null>;
}
