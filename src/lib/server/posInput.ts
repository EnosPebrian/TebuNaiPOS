import "server-only";
import { z } from "zod";
import { createCheckoutOrder } from "@/domain/checkout";
import { createCartItem } from "@/domain/order/cart";
import { updateOrder } from "@/domain/order/lifecycle";
import { checkoutInput } from "./orderInput";
import { HttpError } from "./http";

export const posInput = z.object({
  items: checkoutInput.shape.items,
  name: z.string().trim().min(2).max(100),
  phone: z.string().max(30),
  notes: z.string().max(500),
  paymentReceived: z.boolean(),
}).strict();

export function counterOrder(input: z.infer<typeof posInput>, id: string, createdAt: string) {
  try {
    const order = createCheckoutOrder(input.items.map((item) => createCartItem(item.configuredProduct, item.quantity)), { name: input.name, phone: input.phone, notes: input.notes, method: "pickup", address: "" }, { id, createdAt }, "counter");
    return input.paymentReceived ? updateOrder(order, { version: 0, note: "Payment received at counter.", paymentStatus: "paid" }) : order;
  } catch (error) { throw new HttpError(400, error instanceof Error ? error.message : "Review the counter order."); }
}
