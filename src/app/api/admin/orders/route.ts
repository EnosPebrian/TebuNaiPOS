import { requireAdmin } from "@/lib/server/admin";
import { parseOrderQuery } from "@/domain/order/query";
import { failure, HttpError, json } from "@/lib/server/http";
import { orderRepository } from "@/lib/server/mongoOrderRepository";
export async function GET(request: Request) {
  try {
    await requireAdmin();
    let query;
    try { query = parseOrderQuery(new URL(request.url).searchParams); }
    catch (error) { throw new HttpError(400, error instanceof Error ? error.message : "Choose valid order filters."); }
    return json(await orderRepository.list(query.page, query.filters.status, query.view, query.filters));
  } catch (error) { return failure(error); }
}
