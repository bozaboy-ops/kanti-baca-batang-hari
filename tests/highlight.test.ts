import { describe, it, expect } from "vitest";
import { highlightWords } from "../lib/reading/highlight";
import { normalizeToken } from "../lib/reading/evaluate";

describe("normalizeToken", () => {
  it("lowercases and strips punctuation", () => {
    expect(normalizeToken("Hutan,")).toBe("hutan");
    expect(normalizeToken("MEMBACA!")).toBe("membaca");
  });
});

describe("highlightWords", () => {
  it("marks matched transcript words correct=true in order", () => {
    expect(highlightWords("Alif membaca buku cerita", "alif membaca buku")).toEqual([
      { word: "Alif", correct: true },
      { word: "membaca", correct: true },
      { word: "buku", correct: true },
      { word: "cerita", correct: false },
    ]);
  });

  it("Jambi -o transcript marks -a target correct", () => {
    expect(highlightWords("Anak membaca cerita", "anak membaco cerito")).toEqual([
      { word: "Anak", correct: true },
      { word: "membaca", correct: true },
      { word: "cerita", correct: true },
    ]);
  });

  it("empty transcript marks all incorrect and empty text returns []", () => {
    expect(highlightWords("Alif membaca", "")).toEqual([
      { word: "Alif", correct: false },
      { word: "membaca", correct: false },
    ]);
    expect(highlightWords("", "alif")).toEqual([]);
  });

  it("consumes each transcript word at most once", () => {
    expect(highlightWords("Alif Alif membaca", "alif membaca")).toEqual([
      { word: "Alif", correct: true },
      { word: "Alif", correct: false },
      { word: "membaca", correct: true },
    ]);
  });

  it("is case and punctuation insensitive for matching", () => {
    expect(highlightWords("Hutan, sungai!", "hutan sungai")).toEqual([
      { word: "Hutan,", correct: true },
      { word: "sungai!", correct: true },
    ]);
  });
});