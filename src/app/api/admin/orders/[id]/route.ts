import { requireAdmin } from "@/lib/server/admin";
import { enforceLimit } from "@/lib/server/database";
import { updateInput } from "@/lib/server/orderInput";
import { updateOrder } from "@/domain/order/lifecycle";
import { failure, HttpError, json, readJson, requireOrigin } from "@/lib/server/http";
import { orderRepository } from "@/lib/server/mongoOrderRepository";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    requireOrigin(request);
    const actor = await requireAdmin();
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new HttpError(404, "Order not found.");
    const input = await readJson(request, updateInput);
    await enforceLimit("admin-updates", 120, 60_000);
    const existing = await orderRepository.get(id);
    if (!existing) throw new HttpError(404, "Order not found.");
    if (existing.version !== input.version) throw new HttpError(409, "This order changed in another session. Refresh before editing.");
    let order;
    try { order = updateOrder(existing.order, input); } catch (error) { throw new HttpError(400, error instanceof Error ? error.message : "Invalid order change."); }
    const result = await orderRepository.update(id, input.version, order, { actor, at: new Date().toISOString(), status: order.status, paymentStatus: order.paymentStatus, deliveryFee: order.deliveryFee, total: order.total, note: input.note });
    if (!result) throw new HttpError(409, "This order changed in another session. Refresh before editing.");
    return json(result);
  } catch (error) { return failure(error); }
}
