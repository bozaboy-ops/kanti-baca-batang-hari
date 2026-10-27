export interface TrickyWord {
  word: string;
  syllables: string;
  gentleTip: string;
}

export interface ReadingEvaluation {
  accuracyScore: number;
  correctWords: string[];
  trickyWords: TrickyWord[];
  praiseMessage: string;
}

const EXCEPTIONS: Record<string, string> = {
  tembesi: "tem-be-si",
  bulian: "bu-li-an",
  senami: "se-na-mi",
  batanghari: "ba-tang-ha-ri",
  konservasi: "kon-ser-va-si",
};

const VOWELS = new Set(["a", "i", "u", "e", "o"]);
const DIPHTHONGS = new Set(["ai", "au", "oi"]);
const DIGRAPHS = ["ng", "ny", "sy", "kh"];

function stripPunctuation(token: string): string {
  return token.replace(/[^\p{L}\p{N}]/gu, "");
}

function tokenizeOriginal(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\s+/)
    .map((t) => stripPunctuation(t))
    .filter((t) => t.length > 0);
}

function normalize(token: string): string {
  return stripPunctuation(token.toLowerCase());
}

export function normalizeToken(token: string): string {
  return normalize(token);
}

function transcriptVariant(normalizedTranscriptToken: string): string {
  if (normalizedTranscriptToken.endsWith("o")) {
    return normalizedTranscriptToken.slice(0, -1) + "a";
  }
  return normalizedTranscriptToken;
}

interface Unit {
  text: string;
  isVowel: boolean;
}

function toUnits(word: string): Unit[] {
  const units: Unit[] = [];
  let i = 0;
  while (i < word.length) {
    const two = word.slice(i, i + 2);
    if (two.length === 2 && DIPHTHONGS.has(two)) {
      units.push({ text: two, isVowel: true });
      i += 2;
      continue;
    }
    if (two.length === 2 && DIGRAPHS.includes(two)) {
      units.push({ text: two, isVowel: false });
      i += 2;
      continue;
    }
    const ch = word[i];
    units.push({ text: ch, isVowel: VOWELS.has(ch) });
    i += 1;
  }
  return units;
}

export function splitSyllables(word: string): string {
  const cleaned = normalize(word);
  if (!cleaned) return "";
  if (EXCEPTIONS[cleaned]) return EXCEPTIONS[cleaned];

  const units = toUnits(cleaned);
  const nucleusIdx: number[] = [];
  units.forEach((u, idx) => {
    if (u.isVowel) nucleusIdx.push(idx);
  });
  if (nucleusIdx.length <= 1) return cleaned;

  const boundaries = new Set<number>();
  for (let n = 0; n < nucleusIdx.length - 1; n++) {
    const cur = nucleusIdx[n];
    const next = nucleusIdx[n + 1];
    const consonantCount = next - cur - 1;
    if (consonantCount === 0) {
      boundaries.add(cur + 1);
    } else if (consonantCount === 1) {
      boundaries.add(cur + 1);
    } else {
      boundaries.add(cur + 2);
    }
  }

  const syllables: string[] = [];
  let current = "";
  units.forEach((u, idx) => {
    if (idx > 0 && boundaries.has(idx)) {
      syllables.push(current);
      current = "";
    }
    current += u.text;
  });
  if (current) syllables.push(current);
  return syllables.join("-");
}

function praiseFor(score: number): string {
  if (score >= 90) return "Mantap nian! Bacaanmu jelas dan lancar!";
  if (score >= 60) return "Hebat! Sedikit lagi, yuk kita ulangi kata yang sulit.";
  return "Tidak apa-apa, Kanti temani. Kita coba pelan-pelan, ya.";
}

export function evaluateReading(target: string, transcript: string): ReadingEvaluation {
  const targetTokens = tokenizeOriginal(target ?? "");
  const totalTarget = targetTokens.length;
  if (totalTarget === 0) {
    return { accuracyScore: 0, correctWords: [], trickyWords: [], praiseMessage: praiseFor(0) };
  }

  const remaining: string[] = tokenizeOriginal(transcript ?? "").map((t) => t.toLowerCase());

  const correctWords: string[] = [];
  const unmatched: string[] = [];

  for (const original of targetTokens) {
    const norm = original.toLowerCase();
    let idx = remaining.indexOf(norm);
    if (idx === -1) {
      idx = remaining.findIndex((t) => transcriptVariant(t) === norm);
    }
    if (idx !== -1) {
      remaining.splice(idx, 1);
      correctWords.push(original);
    } else {
      unmatched.push(original);
    }
  }

  const accuracyScore = Math.round((correctWords.length / totalTarget) * 100);
  const trickyWords: TrickyWord[] = unmatched.slice(0, 3).map((word) => {
    const syllables = splitSyllables(word);
    return {
      word,
      syllables,
      gentleTip: `Hampir tepat! Yuk coba ucapkan pelan-pelan: ${syllables}.`,
    };
  });

  return {
    accuracyScore,
    correctWords,
    trickyWords,
    praiseMessage: praiseFor(accuracyScore),
  };
}