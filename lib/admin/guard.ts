import { NextResponse } from "next/server";
import { OWNER_COOKIE, verifyOwnerSession } from "./session";
import { getAdminPasswordHash, getAdminUsername } from "./credentials";

export function readOwnerCookie(req: Request): string | null {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === OWNER_COOKIE) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

export function isOwnerRequest(req: Request): boolean {
  const secret = getAdminPasswordHash();
  if (!secret || !getAdminUsername()) return false;
  return verifyOwnerSession(readOwnerCookie(req), secret);
}

// Fail closed: tanpa kredensial admin di server, semua fungsi admin menolak.
export function ownerRequired(req: Request): NextResponse | null {
  if (!getAdminUsername() || !getAdminPasswordHash()) {
    return NextResponse.json({ error: "Fungsi pemilik belum dikonfigurasi di server" }, { status: 503 });
  }
  if (!isOwnerRequest(req)) {
    return NextResponse.json({ error: "Perlu kunci pemilik" }, { status: 401 });
  }
  return null;
}
