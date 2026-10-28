import { describe, it, expect } from "vitest";
import {
  hashAdminPassword,
  verifyAdminCredentials,
  loginAllowed,
  recordFailedLogin,
  type LoginAttemptStore,
} from "../lib/admin/credentials";

describe("verifyAdminCredentials", () => {
  const stored = hashAdminPassword("superadmin", "XRp5RCQp7v3");

  it("menerima username dan sandi yang benar", () => {
    expect(verifyAdminCredentials("superadmin", "XRp5RCQp7v3", "superadmin", stored)).toBe(true);
  });

  it("menolak sandi yang salah", () => {
    expect(verifyAdminCredentials("superadmin", "salah", "superadmin", stored)).toBe(false);
  });

  it("menolak username yang salah", () => {
    expect(verifyAdminCredentials("admin", "XRp5RCQp7v3", "superadmin", stored)).toBe(false);
  });

  it("menolak hash rusak dan input kosong", () => {
    expect(verifyAdminCredentials("superadmin", "XRp5RCQp7v3", "superadmin", "rusak")).toBe(false);
    expect(verifyAdminCredentials("", "", "superadmin", stored)).toBe(false);
  });

  it("hash tidak menyimpan sandi aslinya", () => {
    expect(stored).not.toContain("XRp5RCQp7v3");
  });
});

describe("loginAllowed / recordFailedLogin", () => {
  it("memblokir setelah 5 gagal dalam semenit", () => {
    const store: LoginAttemptStore = new Map();
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) {
      expect(loginAllowed(store, ip, 1000 * i)).toBe(true);
      recordFailedLogin(store, ip, 1000 * i);
    }
    expect(loginAllowed(store, ip, 5000)).toBe(false);
  });

  it("membuka lagi setelah jendela semenit lewat", () => {
    const store: LoginAttemptStore = new Map();
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) recordFailedLogin(store, ip, 0);
    expect(loginAllowed(store, ip, 61_000)).toBe(true);
  });

  it("IP berbeda tidak saling mengunci", () => {
    const store: LoginAttemptStore = new Map();
    for (let i = 0; i < 5; i++) recordFailedLogin(store, "1.2.3.4", 0);
    expect(loginAllowed(store, "5.6.7.8", 1000)).toBe(true);
  });
});
