import { createHash, randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/server/admin";
import { counterOrder, posInput } from "@/lib/server/posInput";
import { enforceLimit } from "@/lib/server/database";
import { failure, HttpError, json, readJson, requireOrigin } from "@/lib/server/http";
import { orderRepository } from "@/lib/server/mongoOrderRepository";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const actor = await requireAdmin();
    requireOrigin(request);
    const key = request.headers.get("idempotency-key") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) throw new HttpError(400, "A valid counter request key is required.");
    const input = await readJson(request, posInput);
    const order = counterOrder(input, randomUUID(), new Date().toISOString());
    await enforceLimit("counter-orders", 120, 60_000);
    const fingerprint = createHash("sha256").update(JSON.stringify({ items: order.items, customer: order.customer, notes: order.notes, paymentStatus: order.paymentStatus, source: order.source })).digest("hex");
    const requestKey = createHash("sha256").update(`counter:${actor}:${key}`).digest("hex");
    return json({ order: await orderRepository.create(order, requestKey, fingerprint, actor) }, 201);
  } catch (error) { return failure(error); }
}
