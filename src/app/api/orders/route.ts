import { createHash, randomUUID } from "node:crypto";
import { checkoutInput, serverOrder } from "@/lib/server/orderInput";
import { enforceLimit } from "@/lib/server/database";
import { failure, HttpError, json, readJson, requireOrigin } from "@/lib/server/http";
import { orderRepository } from "@/lib/server/mongoOrderRepository";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const key = request.headers.get("idempotency-key") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) throw new HttpError(400, "A valid checkout request key is required.");
    const input = await readJson(request, checkoutInput);
    const order = serverOrder(input, randomUUID(), new Date().toISOString());
    await enforceLimit("checkout", 120, 60_000);
    const fingerprint = createHash("sha256").update(JSON.stringify({ items: order.items, customer: order.customer, fulfillment: order.fulfillment, notes: order.notes })).digest("hex");
    const saved = await orderRepository.create(order, createHash("sha256").update(key).digest("hex"), fingerprint);
    return json({ order: saved }, 201);
  } catch (error) { return failure(error); }
}
