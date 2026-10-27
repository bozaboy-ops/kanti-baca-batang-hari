import { normalizeToken } from "./evaluate";

export interface HighlightedWord {
  word: string;
  correct: boolean;
}

function transcriptVariant(normalizedTranscriptToken: string): string {
  if (normalizedTranscriptToken.endsWith("o")) {
    return normalizedTranscriptToken.slice(0, -1) + "a";
  }
  return normalizedTranscriptToken;
}

export function highlightWords(text: string, transcript: string): HighlightedWord[] {
  if (!text) return [];
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const remaining: string[] = (transcript ?? "")
    .split(/\s+/)
    .map((t) => normalizeToken(t))
    .filter((t) => t.length > 0);

  return words.map((word) => {
    const norm = normalizeToken(word);
    if (!norm) return { word, correct: false };
    let idx = remaining.indexOf(norm);
    if (idx === -1) {
      idx = remaining.findIndex((t) => transcriptVariant(t) === norm);
    }
    if (idx === -1) return { word, correct: false };
    remaining.splice(idx, 1);
    return { word, correct: true };
  });
}