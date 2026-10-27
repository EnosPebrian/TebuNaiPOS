import type { Order } from "./Order";

export const orderStatuses = ["pending-merchant-confirmation", "confirmed", "preparing", "ready", "picked-up", "completed", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export const kitchenStatuses: readonly OrderStatus[] = ["confirmed", "preparing", "ready"];
export const statusLabels: Record<OrderStatus, string> = {
  "pending-merchant-confirmation": "Awaiting confirmation", confirmed: "Confirmed", preparing: "Preparing",
  ready: "Ready", "picked-up": "Out for delivery", completed: "Completed", cancelled: "Cancelled",
};

export interface OrderUpdate {
  readonly version: number;
  readonly status?: OrderStatus;
  readonly deliveryFee?: number;
  readonly paymentStatus?: "paid";
  readonly note: string;
}
export interface OrderEvent {
  readonly at: string;
  readonly actor: string;
  readonly status: OrderStatus;
  readonly paymentStatus: "unpaid" | "paid";
  readonly deliveryFee: number | null;
  readonly total: number | null;
  readonly note: string;
}
export interface ManagedOrder {
  readonly order: Order;
  readonly version: number;
  readonly updatedAt: string;
  readonly history: readonly OrderEvent[];
}

export function nextStatuses(order: Order): OrderStatus[] {
  switch (order.status) {
    case "pending-merchant-confirmation": return ["confirmed", "cancelled"];
    case "confirmed": return ["preparing", "cancelled"];
    case "preparing": return ["ready", "cancelled"];
    case "ready": return [order.fulfillment.method === "delivery" ? "picked-up" : "completed", "cancelled"];
    case "picked-up": return ["completed"];
    default: return [];
  }
}

/** Produce a new snapshot; never alter the original purchase configuration. */
export function updateOrder(order: Order, update: OrderUpdate): Order {
  if (["completed", "cancelled"].includes(order.status)) throw new Error("This order is already closed.");
  if (update.status !== undefined && !nextStatuses(order).includes(update.status)) throw new Error("That status change is not allowed.");
  if (update.status === "cancelled" && !update.note.trim()) throw new Error("Enter a reason for cancellation.");
  let deliveryFee = order.deliveryFee;
  if (update.deliveryFee !== undefined) {
    if (order.fulfillment.method !== "delivery" || order.status !== "pending-merchant-confirmation") throw new Error("Delivery fees can only be set before confirming a delivery order.");
    if (!Number.isSafeInteger(update.deliveryFee) || update.deliveryFee < 0 || update.deliveryFee > 1_000_000) throw new Error("Enter a valid delivery fee.");
    deliveryFee = update.deliveryFee;
  }
  const status = update.status ?? order.status;
  if (status === "confirmed" && deliveryFee === null) throw new Error("Quote the delivery fee before confirming this order.");
  const total = deliveryFee === null ? null : order.subtotal + deliveryFee;
  let paymentStatus = order.paymentStatus;
  if (update.paymentStatus) {
    if (order.paymentStatus === "paid" || order.status === "pending-merchant-confirmation" || status === "cancelled" || total === null) throw new Error("Payment can only be recorded once for a confirmed order with a final total.");
    paymentStatus = "paid";
  }
  if (status === "completed" && paymentStatus !== "paid") throw new Error("Record payment received before completing this order.");
  if (update.status === undefined && update.deliveryFee === undefined && update.paymentStatus === undefined) throw new Error("Choose an order change.");
  return Object.freeze({ ...order, status, paymentStatus, deliveryFee, total });
}
