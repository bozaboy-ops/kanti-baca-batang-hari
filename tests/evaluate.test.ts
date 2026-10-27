import { describe, it, expect } from "vitest";
import { evaluateReading, splitSyllables } from "../lib/reading/evaluate";

describe("evaluateReading", () => {
  it("exact reading scores 100 with Mantap nian praise", () => {
    const r = evaluateReading("Anak membaca buku cerita", "anak membaca buku cerita");
    expect(r.accuracyScore).toBe(100);
    expect(r.correctWords).toEqual(["Anak", "membaca", "buku", "cerita"]);
    expect(r.trickyWords).toEqual([]);
    expect(r.praiseMessage).toBe("Mantap nian! Bacaanmu jelas dan lancar!");
  });

  it("dropping konservasi yields it as tricky with kon-ser-va-si", () => {
    const r = evaluateReading("Kita menjaga konservasi hutan", "kita menjaga hutan");
    expect(r.trickyWords).toHaveLength(1);
    expect(r.trickyWords[0].word).toBe("konservasi");
    expect(r.trickyWords[0].syllables).toBe("kon-ser-va-si");
    expect(r.trickyWords[0].gentleTip).toBe("Hampir tepat! Yuk coba ucapkan pelan-pelan: kon-ser-va-si.");
    expect(r.correctWords).toEqual(["Kita", "menjaga", "hutan"]);
    expect(r.accuracyScore).toBe(75);
    expect(r.praiseMessage).toBe("Hebat! Sedikit lagi, yuk kita ulangi kata yang sulit.");
  });

  it("Jambi trailing -o transcript still scores the -a target word correct", () => {
    const r = evaluateReading("Anak membaca cerita", "anak membaco cerito");
    expect(r.accuracyScore).toBe(100);
    expect(r.correctWords).toEqual(["Anak", "membaca", "cerita"]);
    expect(r.trickyWords).toEqual([]);
  });

  it("empty transcript: score 0, all unmatched, max 3 tricky in order", () => {
    const r = evaluateReading("Satu dua tiga empat lima", "");
    expect(r.accuracyScore).toBe(0);
    expect(r.correctWords).toEqual([]);
    expect(r.trickyWords.map((t) => t.word)).toEqual(["Satu", "dua", "tiga"]);
    expect(r.praiseMessage).toBe("Tidak apa-apa, Kanti temani. Kita coba pelan-pelan, ya.");
  });

  it("empty target scores 0", () => {
    const r = evaluateReading("", "halo");
    expect(r.accuracyScore).toBe(0);
    expect(r.correctWords).toEqual([]);
    expect(r.trickyWords).toEqual([]);
  });

  it("keeps original casing in tricky word, syllables lowercase, praise <60", () => {
    const r = evaluateReading("Tembesi indah sekali", "indah");
    expect(r.trickyWords[0].word).toBe("Tembesi");
    expect(r.trickyWords[0].syllables).toBe("tem-be-si");
    expect(r.trickyWords[0].gentleTip).toBe("Hampir tepat! Yuk coba ucapkan pelan-pelan: tem-be-si.");
    expect(r.accuracyScore).toBe(33);
    expect(r.praiseMessage).toBe("Tidak apa-apa, Kanti temani. Kita coba pelan-pelan, ya.");
  });

  it("strips punctuation and is case-insensitive", () => {
    const r = evaluateReading("Hutan, sungai!", "hutan sungai");
    expect(r.accuracyScore).toBe(100);
    expect(r.correctWords).toEqual(["Hutan", "sungai"]);
  });
});

describe("splitSyllables", () => {
  it("konservasi -> kon-ser-va-si", () => {
    expect(splitSyllables("konservasi")).toBe("kon-ser-va-si");
  });
  it("Tembesi -> tem-be-si", () => {
    expect(splitSyllables("Tembesi")).toBe("tem-be-si");
  });
  it("Bulian -> bu-li-an", () => {
    expect(splitSyllables("Bulian")).toBe("bu-li-an");
  });
  it("senami and batanghari exceptions", () => {
    expect(splitSyllables("senami")).toBe("se-na-mi");
    expect(splitSyllables("batanghari")).toBe("ba-tang-ha-ri");
  });
  it("generic vowel-group splitting", () => {
    expect(splitSyllables("membaca")).toBe("mem-ba-ca");
    expect(splitSyllables("hutan")).toBe("hu-tan");
    expect(splitSyllables("anak")).toBe("a-nak");
  });
});