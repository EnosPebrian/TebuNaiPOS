import "server-only";
import { z } from "zod";
import { createCheckoutOrder } from "@/domain/checkout";
import { createCartItem } from "@/domain/order/cart";
import { orderStatuses } from "@/domain/order/lifecycle";
import { HttpError } from "./http";

export const checkoutInput = z.object({
  items: z.array(z.object({ configuredProduct: z.object({ productId: z.string().min(1).max(100), configuration: z.object({ packageId: z.string().max(100).optional(), toppingIds: z.array(z.string().max(100)).max(20) }).strict() }).strict(), quantity: z.number().int().min(1).max(99) }).strict()).min(1).max(100),
  details: z.object({ name: z.string().max(100), phone: z.string().max(30), method: z.enum(["pickup", "delivery"]), address: z.string().max(500), notes: z.string().max(500) }).strict(),
}).strict();
export const updateInput = z.object({ version: z.number().int().min(0), status: z.enum(orderStatuses).optional(), deliveryFee: z.number().int().min(0).max(1_000_000).optional(), paymentStatus: z.literal("paid").optional(), note: z.string().trim().max(500) }).strict();
export function serverOrder(input: z.infer<typeof checkoutInput>, id: string, createdAt: string) {
  try { return createCheckoutOrder(input.items.map((item) => createCartItem(item.configuredProduct, item.quantity)), input.details, { id, createdAt }); }
  catch (error) { throw new HttpError(400, error instanceof Error ? error.message : "Review the order details."); }
}
