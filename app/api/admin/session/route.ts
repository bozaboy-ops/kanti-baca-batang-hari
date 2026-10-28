import { NextResponse } from "next/server";
import { parseJson } from "@/lib/api/respond";
import { createOwnerSession, OWNER_COOKIE, OWNER_SESSION_MAX_AGE } from "@/lib/admin/session";
import {
  LOGIN_LIMIT,
  LOGIN_WINDOW_MS,
  getAdminPasswordHash,
  getAdminUsername,
  loginAllowed,
  recordFailedLogin,
  verifyAdminCredentials,
  type LoginAttemptStore,
} from "@/lib/admin/credentials";
import { isOwnerRequest } from "@/lib/admin/guard";

const attempts: LoginAttemptStore = new Map();

function cookieHeader(value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${OWNER_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function GET(req: Request) {
  return NextResponse.json({ ok: isOwnerRequest(req) });
}

export async function POST(req: Request) {
  const username = getAdminUsername();
  const passwordHash = getAdminPasswordHash();
  if (!username || !passwordHash) {
    return NextResponse.json({ error: "Fungsi pemilik belum dikonfigurasi di server" }, { status: 503 });
  }
  const ip = clientIp(req);
  const now = Date.now();
  if (!loginAllowed(attempts, ip, now)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Tunggu sebentar." }, { status: 429 });
  }
  const body = await parseJson(req);
  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  if (!verifyAdminCredentials(record.username, record.password, username, passwordHash)) {
    recordFailedLogin(attempts, ip, now);
    return NextResponse.json({ error: "Username atau sandi belum tepat" }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookieHeader(createOwnerSession(passwordHash), OWNER_SESSION_MAX_AGE));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookieHeader("", 0));
  return res;
}

export { LOGIN_LIMIT, LOGIN_WINDOW_MS };
