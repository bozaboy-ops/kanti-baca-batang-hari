"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { attachRecognitionEndHandlers } from "../lib/recorder/recognitionLifecycle";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export interface RecorderProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  textareaLabel?: string;
}

const MAX_SECONDS = 30;

function formatTime(total: number): string {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Recorder({ value, onChange, compact = false, textareaLabel }: RecorderProps) {
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showText, setShowText] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  const stopAll = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch { /* already stopped */ }
    recognitionRef.current = null;
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch { /* already stopped */ }
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setRecording(false);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev + 1 >= MAX_SECONDS) {
          stopAll();
          return MAX_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [recording, stopAll]);

  useEffect(() => () => stopAll(), [stopAll]);

  async function startRecording() {
    setError(null);
    setSeconds(0);
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Ctor) {
      try {
        const recognition = new Ctor();
        recognition.lang = "id-ID";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let text = "";
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          onChangeRef.current(text.trimStart());
        };
        attachRecognitionEndHandlers(recognition, {
          onError: () => setError("Suara belum tertangkap. Coba lagi atau ketik manual, ya."),
          stopAll,
        });
        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        setError("Rekaman suara belum bisa dimulai. Ketik manual saja, ya.");
      }
    }
    // MediaRecorder is only a recording indicator/timer; audio is discarded.
    try {
      if (typeof MediaRecorder !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = () => { /* discarded: never uploaded or stored */ };
        mediaRecorderRef.current = recorder;
        recorder.start();
      }
    } catch {
      // Microphone unavailable: speech recognition / manual typing still works.
    }
    setRecording(true);
  }

  const textareaVisible = !supported || showText;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={recording ? stopAll : startRecording}
          aria-label={recording ? "Berhenti merekam" : "Mulai merekam"}
          aria-pressed={recording}
          className={`${compact ? "h-14 w-14" : "h-20 w-20"} flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400`}
        >
          {recording ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" /></svg>
          )}
        </button>
        <div className="text-sm text-emerald-900">
          <p className="flex items-center gap-2 font-semibold">
            {recording && <span className="h-2.5 w-2.5 rounded-full bg-amber-500 motion-safe:animate-pulse" aria-hidden="true" />}
            {recording ? "Sedang merekam..." : "Tekan tombol untuk membaca dengan suara"}
          </p>
          <p aria-live="polite" className="tabular-nums text-emerald-700">{formatTime(seconds)} / {formatTime(MAX_SECONDS)}</p>
        </div>
      </div>
      {!supported && <p className="text-sm text-emerald-800">Perekam suara tidak tersedia di peramban ini. Ketik bacaanmu di bawah, ya.</p>}
      {supported && (
        <button type="button" onClick={() => setShowText((v) => !v)} className="rounded-full border-2 border-emerald-600 px-4 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50">
          {showText ? "Sembunyikan ketik manual" : "Ketik manual"}
        </button>
      )}
      {error && <p role="alert" className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">{error}</p>}
      {textareaVisible && (
        <label className="w-full text-left text-sm font-semibold text-emerald-900">
          {textareaLabel ?? "Ketik yang kamu baca di sini"}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={compact ? 2 : 3}
            placeholder="Ketik yang kamu baca di sini"
            className="mt-1.5 w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 py-3 text-base font-normal text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-500 focus:outline-none"
          />
        </label>
      )}
    </div>
  );
}