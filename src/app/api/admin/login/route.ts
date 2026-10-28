import { z } from "zod";
import { enforceLimit } from "@/lib/server/database";
import { adminConfigured, signIn, verifyAdmin } from "@/lib/server/admin";
import { failure, HttpError, json, readJson, requireOrigin } from "@/lib/server/http";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    if (!adminConfigured()) throw new HttpError(503, "Admin access has not been configured.");
    const input = await readJson(request, z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(128) }).strict());
    // Shared MongoDB bucket prevents spoofed forwarded IPs from bypassing limits.
    await enforceLimit("admin-login", 10, 15 * 60_000);
    if (!verifyAdmin(input.username, input.password)) throw new HttpError(401, "The username or password is incorrect.");
    await signIn(input.username);
    return json({ ok: true });
  } catch (error) { return failure(error); }
}
