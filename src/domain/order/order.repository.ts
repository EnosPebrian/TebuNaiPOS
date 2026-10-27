import type { Order } from "./Order";
import type { ManagedOrder, OrderEvent, OrderStatus } from "./lifecycle";

export interface OrderRepository {
  create(order: Order, key: string, fingerprint: string): Promise<Order>;
  get(id: string): Promise<ManagedOrder | null>;
  list(page: number, status?: OrderStatus, view?: "orders" | "kitchen"): Promise<{ orders: ManagedOrder[]; total: number }>;
  update(id: string, version: number, order: Order, event: OrderEvent): Promise<ManagedOrder | null>;
}
