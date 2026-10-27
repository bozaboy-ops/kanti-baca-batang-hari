import { describe, it, expect } from "vitest";
import { calculateStars } from "../lib/reading/stars";
import { badgeForTheme, computeBadges } from "../lib/content/badges";
import { hashPin, isValidPinFormat, verifyPin } from "../lib/parent/pin";

describe("calculateStars", () => {
  it("awards 3/2/1 stars by average score and 1 for finishing without scores", () => {
    expect(calculateStars(95)).toBe(3);
    expect(calculateStars(90)).toBe(3);
    expect(calculateStars(75)).toBe(2);
    expect(calculateStars(70)).toBe(2);
    expect(calculateStars(40)).toBe(1);
    expect(calculateStars(null)).toBe(1);
  });
});

describe("badges", () => {
  it("maps each Batang Hari theme to a badge name", () => {
    expect(badgeForTheme("hutan-senami")).toContain("Senami");
    expect(badgeForTheme("bajubang")).toContain("Bajubang");
    expect(badgeForTheme("tidak-ada")).toBeNull();
  });
  it("returns one badge per completed theme without duplicates", () => {
    const badges = computeBadges(["mersam", "mersam", "bajubang"]);
    expect(badges).toHaveLength(2);
    expect(badges.map((b) => b.slug)).toEqual(["mersam", "bajubang"]);
  });
});

describe("parent PIN (local screen lock)", () => {
  it("accepts exactly 4-6 digits", () => {
    expect(isValidPinFormat("1234")).toBe(true);
    expect(isValidPinFormat("123456")).toBe(true);
    expect(isValidPinFormat("123")).toBe(false);
    expect(isValidPinFormat("12a4")).toBe(false);
  });
  it("hashes deterministically and verifies", () => {
    const stored = hashPin("2580");
    expect(stored).not.toBe("2580");
    expect(verifyPin("2580", stored)).toBe(true);
    expect(verifyPin("2581", stored)).toBe(false);
  });
});