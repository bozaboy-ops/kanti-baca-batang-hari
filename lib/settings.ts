import { THEMES } from "./content/themes";

export interface AppSettings {
  disabledThemes: string[];
  weeklyTarget: number;
}

export const DEFAULT_SETTINGS: AppSettings = { disabledThemes: [], weeklyTarget: 10 };

const KNOWN_SLUGS = new Set(THEMES.map((t) => t.slug));

export function parseSettings(raw: unknown): AppSettings {
  if (typeof raw !== "object" || raw === null) return { ...DEFAULT_SETTINGS };
  const record = raw as Record<string, unknown>;
  const disabledThemes = Array.isArray(record.disabledThemes)
    ? [...new Set(record.disabledThemes.filter((v): v is string => typeof v === "string" && KNOWN_SLUGS.has(v)))]
    : [];
  const rawTarget = typeof record.weeklyTarget === "number" && Number.isFinite(record.weeklyTarget) ? Math.trunc(record.weeklyTarget) : DEFAULT_SETTINGS.weeklyTarget;
  return { disabledThemes, weeklyTarget: Math.min(50, Math.max(1, rawTarget)) };
}