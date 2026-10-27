import type { Customer } from "@/domain/customer/customer";
import type { Fulfillment } from "@/domain/fulfillment/fulfillment";
import type { OrderItem } from "./OrderItem";
import type { OrderStatus } from "./lifecycle";

/** An immutable checkout snapshot; the merchant must still confirm this order. */
export interface Order {
  readonly id: string;
  readonly createdAt: string;
  readonly customer: Customer;
  readonly fulfillment: Fulfillment;
  readonly notes: string;
  readonly items: readonly OrderItem[];
  readonly subtotal: number;
  /** Null means the merchant must quote delivery before a total is agreed. */
  readonly deliveryFee: number | null;
  readonly total: number | null;
  readonly status: OrderStatus;
  readonly paymentStatus: "unpaid" | "paid";
}
