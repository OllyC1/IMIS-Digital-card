import "server-only";

import { createHash, createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

const COOKIE_NAME = "imis_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
const MAX_ATTEMPTS = 6;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
type SessionPayload = { role: "admin"; exp: number };

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createToken() {
  const payload: SessionPayload = { role: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function verifyToken(token: string | undefined) {
  if (!token) return null;
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return null;
  const expected = Buffer.from(sign(encoded));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionPayload;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  return verifyToken((await cookies()).get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function createAdminSession() {
  (await cookies()).set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  (await cookies()).set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

async function verifyPassword(password: string) {
  const [algorithm, n, r, p, salt, expectedHash] = (process.env.ADMIN_PASSWORD_HASH ?? "").split("$");
  if (algorithm !== "scrypt" || !n || !r || !p || !salt || !expectedHash) return false;
  const expected = Buffer.from(expectedHash, "base64url");
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, expected.length, { N: Number(n), r: Number(r), p: Number(p) }, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}:${getSessionSecret()}`).digest("hex");
}

export async function authenticateAdmin(email: string, password: string, ip: string) {
  const ipHash = hashIp(ip || "unknown");
  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - ATTEMPT_WINDOW_MS).toISOString();
  await supabase.from("admin_login_attempts").delete().lt("attempted_at", cutoff);
  const { count, error } = await supabase.from("admin_login_attempts").select("id", { head: true, count: "exact" }).eq("ip_hash", ipHash).gte("attempted_at", cutoff);
  if (error) throw new Error(`Unable to check login security: ${error.message}`);
  if ((count ?? 0) >= MAX_ATTEMPTS) return { ok: false, rateLimited: true } as const;

  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const valid = Boolean(expectedEmail) && email.trim().toLowerCase() === expectedEmail && (await verifyPassword(password));
  if (!valid) {
    await supabase.from("admin_login_attempts").insert({ ip_hash: ipHash });
    return { ok: false, rateLimited: false } as const;
  }
  await supabase.from("admin_login_attempts").delete().eq("ip_hash", ipHash);
  return { ok: true, email: expectedEmail! } as const;
}
