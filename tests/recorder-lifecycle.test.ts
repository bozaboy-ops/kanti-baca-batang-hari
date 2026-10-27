import { describe, expect, it, vi } from "vitest";
import { attachRecognitionEndHandlers } from "../lib/recorder/recognitionLifecycle";

function fakeRecognition() {
  return {
    onerror: null as (() => void) | null,
    onend: null as (() => void) | null,
  };
}

describe("attachRecognitionEndHandlers", () => {
  it("stops everything when recognition errors spontaneously", () => {
    const recognition = fakeRecognition();
    const onError = vi.fn();
    const stopAll = vi.fn();
    attachRecognitionEndHandlers(recognition, { onError, stopAll });

    recognition.onerror?.();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(stopAll).toHaveBeenCalledTimes(1);
  });

  it("stops everything when recognition ends on its own", () => {
    const recognition = fakeRecognition();
    const onError = vi.fn();
    const stopAll = vi.fn();
    attachRecognitionEndHandlers(recognition, { onError, stopAll });

    recognition.onend?.();

    expect(onError).not.toHaveBeenCalled();
    expect(stopAll).toHaveBeenCalledTimes(1);
  });
});