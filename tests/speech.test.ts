import { describe, it, expect } from "vitest";
import { cleanTextForSpeech, TEXT_SIZE_CLASSES, clampTextSizeIndex } from "../lib/reading/speech";

describe("cleanTextForSpeech", () => {
  it("collapses whitespace and trims punctuation spacing", () => {
    expect(cleanTextForSpeech("  Alif   pergi\nke sungai . ")).toBe("Alif pergi ke sungai.");
  });
  it("returns empty string for blank input", () => {
    expect(cleanTextForSpeech("   ")).toBe("");
  });
});

describe("text size scale", () => {
  it("has three increasing classes and clamps the index", () => {
    expect(TEXT_SIZE_CLASSES).toHaveLength(3);
    expect(clampTextSizeIndex(-2)).toBe(0);
    expect(clampTextSizeIndex(1)).toBe(1);
    expect(clampTextSizeIndex(9)).toBe(2);
  });
});