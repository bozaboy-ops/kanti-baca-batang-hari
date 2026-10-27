import { describe, it, expect } from "vitest";
import { computeStreak, weeklyPageCount, recordActivity } from "../lib/reading/streak";

describe("streak helpers", () => {
  it("counts consecutive days ending today, tolerating a missing today", () => {
    expect(computeStreak(["2026-10-25", "2026-10-26", "2026-10-27"], "2026-10-27")).toBe(3);
    expect(computeStreak(["2026-10-25", "2026-10-26"], "2026-10-27")).toBe(2);
    expect(computeStreak(["2026-10-20"], "2026-10-27")).toBe(0);
    expect(computeStreak([], "2026-10-27")).toBe(0);
  });
  it("sums pages read in the last 7 days including today", () => {
    const activity = { "2026-10-27": 3, "2026-10-22": 4, "2026-10-20": 9, "2026-10-19": 5 };
    expect(weeklyPageCount(activity, "2026-10-27")).toBe(7);
  });
  it("records activity immutably per day", () => {
    const next = recordActivity({ "2026-10-27": 1 }, "2026-10-27");
    expect(next["2026-10-27"]).toBe(2);
    expect(recordActivity({}, "2026-10-27")["2026-10-27"]).toBe(1);
  });
});