import "server-only";
import { reportRange, wibToday } from "@/domain/order/report";
import { HttpError } from "./http";

export function parseReportRange(params: URLSearchParams) {
  if (["from", "to", "format"].some((key) => params.getAll(key).length > 1)) throw new HttpError(400, "Choose one value for each report filter.");
  try { return reportRange(params.get("from") ?? wibToday(), params.get("to") ?? wibToday()); }
  catch (error) { throw new HttpError(400, error instanceof Error ? error.message : "Choose valid dates."); }
}
