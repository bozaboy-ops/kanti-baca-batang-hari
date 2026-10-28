import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { parseJson } from "@/lib/api/respond";
import { OWNER_COOKIE, OWNER_SESSION_MAX_AGE, createOwnerSession, getOwnerSecret } from "@/lib/admin/session";
import { isOwnerRequest } from "@/lib/admin/guard";

export async function GET(req: Request) {
  return NextResponse.json({ ok: isOwnerRequest(req) });
}

function cookieHeader(value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${OWNER_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function keysMatch(provided: unknown, secret: string): boolean {
  if (typeof provided !== "string" || provided.length === 0) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(secret, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = getOwnerSecret();
  if (!secret) {
    return NextResponse.json({ error: "Fungsi pemilik belum dikonfigurasi di server" }, { status: 503 });
  }
  const body = await parseJson(req);
  const key = typeof body === "object" && body !== null ? (body as Record<string, unknown>).key : null;
  if (!keysMatch(key, secret)) {
    return NextResponse.json({ error: "Kunci pemilik belum tepat" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookieHeader(createOwnerSession(secret), OWNER_SESSION_MAX_AGE));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookieHeader("", 0));
  return res;
}
