export interface RecognitionEndTarget {
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

export interface RecognitionEndHandlers {
  onError: () => void;
  stopAll: () => void;
}

/**
 * Recognition can end or error spontaneously (silence timeout, browser stop).
 * Both paths must run the same full teardown as the deliberate stop button:
 * stop recognition, stop MediaRecorder/stream tracks, and clear the
 * recording state. stopAll is idempotent, so the deliberate path (stop()
 * triggers onend) stays safe.
 */
export function attachRecognitionEndHandlers(
  recognition: RecognitionEndTarget,
  handlers: RecognitionEndHandlers,
): void {
  recognition.onerror = () => {
    handlers.onError();
    handlers.stopAll();
  };
  recognition.onend = () => {
    handlers.stopAll();
  };
}
/** Segments arrive per result; joining without a space merges words
 *  ("berdiri" + "di tepi" -> "berdiridi") and fabricates tricky words. */
export function mergeTranscriptSegments(segments: string[]): string {
  return segments
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}

export interface StartableRecognition {
  start: () => void;
}

/** start() can throw (mic denied at OS level). Callers must only enter the
 *  recording state when this returns true. */
export function tryStartRecognition(recognition: StartableRecognition, onError: () => void): boolean {
  try {
    recognition.start();
    return true;
  } catch {
    onError();
    return false;
  }
}