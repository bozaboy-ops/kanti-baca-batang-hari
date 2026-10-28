import { describe, it, expect } from "vitest";
import { createOwnerSession, verifyOwnerSession } from "../lib/admin/session";

const SECRET = "test-owner-secret-yang-panjang-1234567890";

describe("createOwnerSession / verifyOwnerSession", () => {
  it("menerima sesi yang baru dibuat dengan rahasia yang sama", () => {
    const cookie = createOwnerSession(SECRET);
    expect(verifyOwnerSession(cookie, SECRET)).toBe(true);
  });

  it("menolak sesi yang dibuat dengan rahasia berbeda", () => {
    const cookie = createOwnerSession("rahasia-lain-yang-berbeda-0987654321");
    expect(verifyOwnerSession(cookie, SECRET)).toBe(false);
  });

  it("menolak cookie yang tanda tangannya diubah", () => {
    const cookie = createOwnerSession(SECRET);
    const tampered = cookie.slice(0, -1) + (cookie.endsWith("A") ? "B" : "A");
    expect(verifyOwnerSession(tampered, SECRET)).toBe(false);
  });

  it("menolak cookie kedaluwarsa", () => {
    const cookie = createOwnerSession(SECRET, -1000);
    expect(verifyOwnerSession(cookie, SECRET)).toBe(false);
  });

  it("menolak nilai kosong dan format rusak", () => {
    expect(verifyOwnerSession("", SECRET)).toBe(false);
    expect(verifyOwnerSession("bukan-cookie", SECRET)).toBe(false);
    expect(verifyOwnerSession("v1.abc", SECRET)).toBe(false);
  });
});
