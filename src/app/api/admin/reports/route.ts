import { requireAdmin } from "@/lib/server/admin";
import { enforceLimit } from "@/lib/server/database";
import { failure, HttpError, json } from "@/lib/server/http";
import { parseReportRange } from "@/lib/server/reportInput";
import { orderRepository } from "@/lib/server/mongoOrderRepository";
import { reportCsv } from "@/domain/order/report";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const params = new URL(request.url).searchParams;
    const range = parseReportRange(params);
    const format = params.get("format") ?? "json";
    if (!["json", "csv"].includes(format)) throw new HttpError(400, "Choose JSON or CSV format.");
    await enforceLimit("reports", 30, 60_000);
    const report = await orderRepository.report(range);
    if (format === "csv") return new Response(reportCsv(report), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="tebunai-orders-${range.from}-${range.to}.csv"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Vary": "Cookie" } });
    return json(report);
  } catch (error) { return failure(error); }
}
