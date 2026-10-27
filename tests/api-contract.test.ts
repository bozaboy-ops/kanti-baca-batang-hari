import { describe, it, expect } from "vitest";
import {
  KECAMATAN,
  validateCreateUser,
  validateCreateStory,
  validateEvaluateBody,
  validateContinueBody,
  normalizeImagination,
} from "../lib/api/validate";

const validUser = {
  childName: "Siti",
  age: 8,
  subdistrict: "Muara Bulian",
  readingLevel: "Pemula",
};

describe("KECAMATAN", () => {
  it("contains the 8 Batang Hari subdistricts", () => {
    expect(KECAMATAN).toEqual([
      "Muara Bulian",
      "Muara Tembesi",
      "Maro Sebo Ulu",
      "Maro Sebo Ilir",
      "Batin XXIV",
      "Pemayung",
      "Bajubang",
      "Mersam",
    ]);
  });
});

describe("validateCreateUser", () => {
  it("accepts a valid payload and trims the name", () => {
    const r = validateCreateUser({ ...validUser, childName: "  Siti  " });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.childName).toBe("Siti");
      expect(r.value.age).toBe(8);
      expect(r.value.subdistrict).toBe("Muara Bulian");
      expect(r.value.readingLevel).toBe("Pemula");
    }
  });

  it("accepts boundary ages 6 and 10 and both reading levels", () => {
    expect(validateCreateUser({ ...validUser, age: 6 }).ok).toBe(true);
    expect(validateCreateUser({ ...validUser, age: 10, readingLevel: "Lancar" }).ok).toBe(true);
  });

  it("rejects empty / whitespace / non-string names", () => {
    expect(validateCreateUser({ ...validUser, childName: "" }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, childName: "   " }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, childName: 123 }).ok).toBe(false);
    expect(validateCreateUser({}).ok).toBe(false);
    expect(validateCreateUser(null).ok).toBe(false);
  });

  it("rejects ages outside 6-10, non-integers and non-numbers", () => {
    expect(validateCreateUser({ ...validUser, age: 5 }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, age: 11 }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, age: 7.5 }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, age: "8" }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, age: NaN }).ok).toBe(false);
  });

  it("rejects subdistricts outside the enum and bad reading levels", () => {
    expect(validateCreateUser({ ...validUser, subdistrict: "Jambi" }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, subdistrict: "muara bulian" }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, readingLevel: "Mahir" }).ok).toBe(false);
    expect(validateCreateUser({ ...validUser, readingLevel: "pemula" }).ok).toBe(false);
    for (const subdistrict of KECAMATAN) {
      expect(validateCreateUser({ ...validUser, subdistrict }).ok).toBe(true);
    }
  });

  it("returns an error string on failure", () => {
    const r = validateCreateUser({ ...validUser, age: 3 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.length).toBeGreaterThan(0);
  });
});

describe("validateCreateStory", () => {
  it("accepts userId + themeSlug and rejects missing fields", () => {
    expect(validateCreateStory({ userId: "abc", themeSlug: "hutan-senami" }).ok).toBe(true);
    expect(validateCreateStory({ userId: "", themeSlug: "hutan-senami" }).ok).toBe(false);
    expect(validateCreateStory({ userId: "abc", themeSlug: "" }).ok).toBe(false);
    expect(validateCreateStory(null).ok).toBe(false);
  });
});

describe("validateEvaluateBody", () => {
  it("accepts pageNumber + transcript and trims transcript", () => {
    const r = validateEvaluateBody({ pageNumber: 1, transcript: "  Alif berdiri  " });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.pageNumber).toBe(1);
      expect(r.value.transcript).toBe("Alif berdiri");
    }
  });

  it("rejects empty / whitespace / missing transcript", () => {
    expect(validateEvaluateBody({ pageNumber: 1, transcript: "" }).ok).toBe(false);
    expect(validateEvaluateBody({ pageNumber: 1, transcript: "   " }).ok).toBe(false);
    expect(validateEvaluateBody({ pageNumber: 1 }).ok).toBe(false);
  });

  it("rejects non-integer or non-positive pageNumber", () => {
    expect(validateEvaluateBody({ pageNumber: 1.5, transcript: "halo" }).ok).toBe(false);
    expect(validateEvaluateBody({ pageNumber: 0, transcript: "halo" }).ok).toBe(false);
    expect(validateEvaluateBody({ pageNumber: "1", transcript: "halo" }).ok).toBe(false);
    expect(validateEvaluateBody(null).ok).toBe(false);
  });
});

describe("normalizeImagination / validateContinueBody", () => {
  it("trims imagination", () => {
    expect(normalizeImagination("  gajah kecil  ")).toBe("gajah kecil");
  });

  it("truncates imagination longer than 300 chars to 300", () => {
    const long = "a".repeat(400);
    expect(normalizeImagination(long)).toHaveLength(300);
    const r = validateContinueBody({ pageNumber: 1, imagination: long });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.imagination).toHaveLength(300);
  });

  it("rejects empty / whitespace imagination", () => {
    expect(normalizeImagination("   ")).toBe("");
    expect(validateContinueBody({ pageNumber: 1, imagination: "" }).ok).toBe(false);
    expect(validateContinueBody({ pageNumber: 1, imagination: "   " }).ok).toBe(false);
    expect(validateContinueBody({ pageNumber: 1 }).ok).toBe(false);
  });

  it("rejects non-integer pageNumber", () => {
    expect(validateContinueBody({ pageNumber: 2.5, imagination: "gajah" }).ok).toBe(false);
    const r = validateContinueBody({ pageNumber: 2, imagination: "gajah" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.pageNumber).toBe(2);
  });
});