import { adminSession } from "@/lib/server/admin";
import { failure, json, requireOrigin } from "@/lib/server/http";
export async function POST(request: Request) {
  try { requireOrigin(request); (await adminSession()).destroy(); return json({ ok: true }); }
  catch (error) { return failure(error); }
}
