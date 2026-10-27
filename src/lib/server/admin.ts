import "server-only";
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getIronSession } from "iron-session";
import { appOrigin, HttpError } from "./http";

interface AdminSession { username?: string; credentialVersion?: string }
export function adminConfigured(): boolean {
  return Boolean(appOrigin() && /^[a-zA-Z0-9_.-]{1,64}$/.test(process.env.ADMIN_USERNAME ?? "") && /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.ADMIN_PASSWORD_HASH ?? "") && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}
function version() { return createHash("sha256").update(process.env.ADMIN_PASSWORD_HASH ?? "").digest("hex"); }
export function verifyAdmin(username: string, password: string): boolean {
  if (!adminConfigured() || password.length > 128) return false;
  const [, salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  const actual = scryptSync(password, salt, 64);
  const validPassword = timingSafeEqual(actual, Buffer.from(hash, "hex"));
  const candidate = createHash("sha256").update(username).digest();
  const expected = createHash("sha256").update(process.env.ADMIN_USERNAME!).digest();
  return timingSafeEqual(candidate, expected) && validPassword;
}
export async function adminSession() {
  if (!adminConfigured()) throw new HttpError(503, "Admin access has not been configured.");
  return getIronSession<AdminSession>(await cookies(), { cookieName: "tebunai-admin", password: process.env.ADMIN_SESSION_SECRET!, ttl: 8 * 60 * 60, cookieOptions: { httpOnly: true, sameSite: "strict", secure: appOrigin()!.protocol === "https:", path: "/" } });
}
export async function currentAdmin(): Promise<string | null> {
  // Hosting credentials may be supplied after the build; never freeze this check.
  await connection();
  if (!adminConfigured()) return null;
  const session = await adminSession();
  return session.username === process.env.ADMIN_USERNAME && session.credentialVersion === version() ? session.username ?? null : null;
}
export async function requireAdmin(): Promise<string> {
  const username = await currentAdmin();
  if (!username) throw new HttpError(401, "Sign in to manage orders.");
  return username;
}
export async function signIn(username: string) {
  const session = await adminSession();
  session.username = username; session.credentialVersion = version();
  await session.save();
}
