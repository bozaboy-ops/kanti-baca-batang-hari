import { NextResponse } from "next/server";

export function dbUnavailable() {
  return NextResponse.json({ error: "Database sedang tidak tersedia" }, { status: 503 });
}
export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
export function notFound(error = "Tidak ditemukan") {
  return NextResponse.json({ error }, { status: 404 });
}
export async function parseJson(req: Request): Promise<unknown> {
  try { return await req.json(); } catch { return null; }
}
export function formatSyllables(syllables: string): string {
  if (!syllables) return syllables;
  const joined = syllables.split("-").map((s) => s.trim()).filter(Boolean).join(" - ");
  return joined ? joined.charAt(0).toUpperCase() + joined.slice(1) : joined;
}
export interface ApiTrickyWord { word: string; syllables: string; gentle_tip: string }
export function toApiTrickyWord(w: { word: string; syllables: string; gentleTip?: string; gentle_tip?: string }): ApiTrickyWord {
  const syllables = formatSyllables(w.syllables);
  const gentle_tip = `Hampir tepat! Yuk coba ucapkan pelan-pelan: ${syllables}.`;
  return { word: w.word, syllables, gentle_tip };
}
export function normalizeStoredTrickyWords(raw: unknown): ApiTrickyWord[] {
  if (!Array.isArray(raw)) return [];
  const out: ApiTrickyWord[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;
    const word = typeof r.word === "string" ? r.word : "";
    if (!word) continue;
    const syllablesRaw = typeof r.syllables === "string" ? r.syllables : "";
    // stored syllables may already be display form "Tem - be - si": strip spaces then reformat
    const hyphen = syllablesRaw.replace(/\s*-\s*/g, "-");
    const syllables = formatSyllables(hyphen);
    out.push({ word, syllables, gentle_tip: `Hampir tepat! Yuk coba ucapkan pelan-pelan: ${syllables}.` });
  }
  return out;
}