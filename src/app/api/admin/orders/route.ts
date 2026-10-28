import { requireAdmin } from "@/lib/server/admin";
import { kitchenStatuses, orderStatuses, type OrderStatus } from "@/domain/order/lifecycle";
import { failure, HttpError, json } from "@/lib/server/http";
import { orderRepository } from "@/lib/server/mongoOrderRepository";
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const params = new URL(request.url).searchParams;
    const page = Number(params.get("page") ?? 1);
    const status = params.get("status") ?? undefined;
    const view = params.get("view") ?? "orders";
    if (!Number.isInteger(page) || page < 1 || page > 1000 || (status && !orderStatuses.includes(status as OrderStatus))) throw new HttpError(400, "Choose a valid page and status filter.");
    if (!["orders", "kitchen"].includes(view) || (view === "kitchen" && status && !kitchenStatuses.includes(status as OrderStatus))) throw new HttpError(400, "Choose an active kitchen status.");
    return json({ ...await orderRepository.list(page, status as OrderStatus | undefined, view as "orders" | "kitchen"), page });
  } catch (error) { return failure(error); }
}
