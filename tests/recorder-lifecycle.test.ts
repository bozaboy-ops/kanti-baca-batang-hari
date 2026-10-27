import { describe, expect, it, vi } from "vitest";
import { attachRecognitionEndHandlers, mergeTranscriptSegments, tryStartRecognition } from "../lib/recorder/recognitionLifecycle";

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
describe("mergeTranscriptSegments", () => {
  it("joins recognition segments with a single space", () => {
    expect(mergeTranscriptSegments(["Alif berdiri", "di tepi sungai"])).toBe("Alif berdiri di tepi sungai");
  });
  it("drops empty segments and collapses whitespace", () => {
    expect(mergeTranscriptSegments(["  halo ", "", "  dunia  "])).toBe("halo dunia");
  });
});

describe("tryStartRecognition", () => {
  it("returns true when start succeeds", () => {
    const onError = vi.fn();
    expect(tryStartRecognition({ start: () => undefined }, onError)).toBe(true);
    expect(onError).not.toHaveBeenCalled();
  });
  it("returns false and reports when start throws", () => {
    const onError = vi.fn();
    const bad = { start: () => { throw new Error("not allowed"); } };
    expect(tryStartRecognition(bad, onError)).toBe(false);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});