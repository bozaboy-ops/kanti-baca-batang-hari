import { createHmac, timingSafeEqual } from "crypto";

// Sesi pemilik tunggal tanpa state server: cookie bertanda tangan HMAC.
// Rahasia hanya ada di server (env OWNER_KEY), tidak pernah ke peramban.
export const OWNER_COOKIE = "kanti_owner";
const VERSION = "v1";
export const OWNER_SESSION_MAX_AGE = 12 * 60 * 60;

function b64urlEncode(raw: Buffer): string {
  return raw.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): Buffer | null {
  try {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(padded, "base64");
  } catch {
    return null;
  }
}

function signature(secret: string, payload: string): Buffer {
  return createHmac("sha256", secret).update(payload, "utf8").digest();
}

export function createOwnerSession(secret: string, maxAgeSec = OWNER_SESSION_MAX_AGE): string {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec;
  const payload = `${VERSION}.${exp}`;
  const sig = b64urlEncode(signature(secret, payload));
  return `${payload}.${sig}`;
}

export function verifyOwnerSession(cookieValue: string | null | undefined, secret: string): boolean {
  if (!cookieValue || !secret) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 3 || parts[0] !== VERSION) return false;
  const exp = Number(parts[1]);
  if (!Number.isInteger(exp) || exp * 1000 <= Date.now()) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const provided = b64urlDecode(parts[2]);
  if (!provided) return false;
  const expected = signature(secret, payload);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
