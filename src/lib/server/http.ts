import "server-only";
import { z } from "zod";

export class HttpError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
export function appOrigin(): URL | null {
  try {
    const url = new URL(process.env.APP_ORIGIN ?? "");
    if (url.username || url.password || url.origin !== (process.env.APP_ORIGIN ?? "").replace(/\/$/, "")) return null;
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))) return null;
    return url;
  } catch { return null; }
}
export function requireOrigin(request: Request): void {
  const origin = appOrigin();
  if (!origin) throw new HttpError(503, "Online order management has not been configured.");
  if (request.headers.get("origin") !== origin.origin) throw new HttpError(403, "This request is not allowed.");
}
export async function readJson<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new HttpError(415, "Send a JSON request.");
  if (Number(request.headers.get("content-length") ?? 0) > 65_536) throw new HttpError(413, "This request is too large.");
  // Limit the stream as well: Content-Length can be omitted or untrusted.
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A request body is required.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 65_536) { await reader.cancel(); throw new HttpError(413, "This request is too large."); }
    chunks.push(value);
  }
  let value: unknown;
  try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new HttpError(400, "Invalid request body."); }
  const result = schema.safeParse(value);
  if (!result.success) throw new HttpError(400, "Check the submitted fields and try again.");
  return result.data;
}
export function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Vary": "Cookie, Origin" } });
}
export function failure(error: unknown): Response {
  // Connection strings, database errors and authentication internals stay server-side.
  return error instanceof HttpError ? json({ error: error.message }, error.status) : json({ error: "Service temporarily unavailable. Please try again." }, 503);
}
