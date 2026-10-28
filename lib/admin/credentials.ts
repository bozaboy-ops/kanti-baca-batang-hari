import { scryptSync, timingSafeEqual } from "crypto";

// Kredensial satu-satunya admin pemilik. Sandi tidak pernah disimpan
// sebagai teks: yang disimpan di env (ADMIN_PASSWORD_HASH) adalah hash
// scrypt berformat "scrypt$saltHex$hashHex".
const HASH_PREFIX = "scrypt";

export function hashAdminPassword(username: string, password: string, saltHex?: string): string {
  const salt = saltHex ?? `${username}:${Date.now()}:${Math.random()}`;
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${HASH_PREFIX}$${Buffer.from(salt, "utf8").toString("hex")}$${hash}`;
}

export function verifyAdminCredentials(
  username: unknown,
  password: unknown,
  expectedUsername: string,
  expectedHash: string,
): boolean {
  if (typeof username !== "string" || typeof password !== "string") return false;
  if (username.length === 0 || password.length === 0) return false;
  if (username !== expectedUsername) return false;
  const parts = expectedHash.split("$");
  if (parts.length !== 3 || parts[0] !== HASH_PREFIX) return false;
  let salt: string;
  try {
    salt = Buffer.from(parts[1], "hex").toString("utf8");
  } catch {
    return false;
  }
  const expected = Buffer.from(parts[2], "hex");
  const actual = scryptSync(password, salt, 64);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function getAdminUsername(): string | null {
  const username = process.env.ADMIN_USERNAME ?? "";
  return username.length >= 3 ? username : null;
}

export function getAdminPasswordHash(): string | null {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  return hash.startsWith(`${HASH_PREFIX}$`) ? hash : null;
}

// Pembatas brute force sederhana di memori: 5x gagal per IP per menit.
export interface LoginAttemptState {
  count: number;
  resetAt: number;
}
export type LoginAttemptStore = Map<string, LoginAttemptState>;

export const LOGIN_LIMIT = 5;
export const LOGIN_WINDOW_MS = 60_000;

export function loginAllowed(store: LoginAttemptStore, ip: string, now: number): boolean {
  const state = store.get(ip);
  if (!state) return true;
  if (now >= state.resetAt) {
    store.delete(ip);
    return true;
  }
  return state.count < LOGIN_LIMIT;
}

export function recordFailedLogin(store: LoginAttemptStore, ip: string, now: number): void {
  const state = store.get(ip);
  if (!state || now >= state.resetAt) {
    store.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  state.count += 1;
}
