import { describe, it, expect } from "vitest";
import { parseSettings, DEFAULT_SETTINGS } from "../lib/settings";

describe("parseSettings", () => {
  it("returns defaults for empty or invalid input", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("nope")).toEqual(DEFAULT_SETTINGS);
  });
  it("keeps known disabled themes, drops unknown slugs, clamps weekly target", () => {
    const parsed = parseSettings({ disabledThemes: ["mersam", "tidak-ada", "mersam"], weeklyTarget: 500 });
    expect(parsed.disabledThemes).toEqual(["mersam"]);
    expect(parsed.weeklyTarget).toBe(50);
    expect(parseSettings({ weeklyTarget: 0 }).weeklyTarget).toBe(1);
    expect(parseSettings({ weeklyTarget: 12.8 }).weeklyTarget).toBe(12);
  });
});