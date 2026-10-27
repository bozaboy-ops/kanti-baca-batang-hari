export const TEXT_SIZE_CLASSES = [
  "text-xl leading-relaxed sm:text-2xl sm:leading-relaxed",
  "text-2xl leading-relaxed sm:text-3xl sm:leading-relaxed",
  "text-3xl leading-relaxed sm:text-4xl sm:leading-relaxed",
] as const;

export function clampTextSizeIndex(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(TEXT_SIZE_CLASSES.length - 1, Math.max(0, Math.trunc(value)));
}

export function cleanTextForSpeech(text: string): string {
  return (text ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

export function speakIndonesian(text: string): boolean {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned || typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = "id-ID";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}