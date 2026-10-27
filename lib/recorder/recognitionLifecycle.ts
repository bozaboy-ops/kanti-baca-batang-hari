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