"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Recorder from "./Recorder";
import { highlightWords } from "@/lib/reading/highlight";

interface StoryData {
  id: string;
  title: string;
  themeSlug: string;
}
interface PageData {
  id: string;
  pageNumber: number;
  storyText: string;
  imageUrl: string | null;
  interactiveQuestion: string | null;
}
interface TrickyWord {
  word: string;
  syllables: string;
  gentle_tip: string;
}
interface Evaluation {
  accuracy_score: number;
  tricky_words: TrickyWord[];
  praise_message: string;
}

const STEPS = ["Voice Transcribe", "Muse Spark", "Muse Image"] as const;

export default function StoryBook({ storyId }: { storyId: string }) {
  const router = useRouter();
  const [story, setStory] = useState<StoryData | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [checking, setChecking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [imagination, setImagination] = useState("");
  const [continuing, setContinuing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [provider, setProvider] = useState<string | null>(null);

  const loadStory = useCallback(async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Cerita tidak ditemukan");
      setStory(data.story);
      setPages(Array.isArray(data.pages) ? data.pages : []);
      return data as { story: StoryData; pages: PageData[] };
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Cerita belum bisa dibuka");
      return null;
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => { void loadStory(); }, [loadStory]);

  useEffect(() => {
    setImgLoaded(false);
    setTranscript("");
    setEvaluation(null);
    setImagination("");
    setActionError(null);
  }, [pageIndex]);

  useEffect(() => {
    if (!continuing) { setStepIndex(0); return; }
    const timer = setInterval(() => setStepIndex((i) => (i + 1) % STEPS.length), 700);
    return () => clearInterval(timer);
  }, [continuing]);

  const page = pages[pageIndex] ?? null;

  async function handleEvaluate() {
    if (!page) return;
    setActionError(null);
    setChecking(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber: page.pageNumber, transcript }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Bacaan belum bisa diperiksa");
      setEvaluation(data.reading_evaluation as Evaluation);
      if (typeof data.provider === "string") setProvider(data.provider);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Bacaan belum bisa diperiksa");
    } finally {
      setChecking(false);
    }
  }

  async function handleContinue() {
    if (!page) return;
    setActionError(null);
    setContinuing(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber: page.pageNumber, imagination }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Halaman baru belum bisa dibuat");
      if (typeof data.provider === "string") setProvider(data.provider);
      const nextNumber = data.next_story_segment?.page_number as number | undefined;
      const fresh = await loadStory();
      const target = fresh && nextNumber ? fresh.pages.findIndex((p) => p.pageNumber === nextNumber) : -1;
      if (target >= 0) {
        setPageIndex(target);
      } else {
        setActionError("Halaman barumu sudah dibuat, tapi belum bisa dibuka. Tekan Buat Halaman Baru sekali lagi atau muat ulang halaman ini, ya.");
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Halaman baru belum bisa dibuat");
    } finally {
      setContinuing(false);
    }
  }

  if (loading) {
    return <main className="mx-auto w-full max-w-3xl px-4 py-10"><p className="text-center text-emerald-800">Membuka cerita...</p></main>;
  }
  if (loadError || !story || !page) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p role="alert" className="rounded-2xl bg-amber-100 px-4 py-3 font-medium text-amber-900">{loadError ?? "Cerita tidak ditemukan"}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => { setLoading(true); setLoadError(null); void loadStory(); }} className="rounded-full bg-amber-500 px-5 py-2.5 font-semibold text-white hover:bg-amber-600">Coba Lagi</button>
          <Link href="/" className="inline-block rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">Kembali ke Beranda</Link>
        </div>
      </main>
    );
  }

  const highlighted = highlightWords(page.storyText, transcript);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold tracking-wide text-amber-600 uppercase">BaccaAI</p>
          <h1 className="font-display text-3xl font-semibold text-emerald-950">{story.title}</h1>
          <p className="text-sm text-emerald-700">Halaman {page.pageNumber} dari {pages.length}</p>
        </div>
        <button type="button" onClick={() => router.push("/ringkasan")} className="rounded-full bg-amber-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500">
          Selesai
        </button>
      </header>

      {provider === "local-fallback" && (
        <p className="mb-4 rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">Mode demo lokal: cerita dan gambar dibuat tanpa layanan AI eksternal.</p>
      )}

      <section aria-label="Ilustrasi dan cerita" className="overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white shadow-sm">
        {page.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={page.id}
            src={page.imageUrl}
            alt={`Ilustrasi halaman ${page.pageNumber} cerita ${story.title}`}
            onLoad={() => setImgLoaded(true)}
            className={`aspect-[16/9] w-full object-cover transition-[filter] duration-500 motion-reduce:transition-none ${imgLoaded ? "blur-0" : "blur-md"}`}
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-emerald-50 text-emerald-700">Ilustrasi belum tersedia</div>
        )}
        <div className="p-5 sm:p-7">
          <p className="font-display text-2xl leading-relaxed font-medium text-emerald-950 sm:text-3xl">
            {highlighted.map((item, i) => (
              <span key={`${i}-${item.word}`} className={item.correct ? "font-semibold text-emerald-600" : undefined}>
                {item.word}{i < highlighted.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" disabled={pageIndex <= 0} onClick={() => setPageIndex((i) => Math.max(0, i - 1))} className="rounded-full border-2 border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-40">Halaman Sebelumnya</button>
            <button type="button" disabled={pageIndex >= pages.length - 1} onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))} className="rounded-full border-2 border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-40">Halaman Berikutnya</button>
          </div>
        </div>
      </section>

      <section aria-label="Rekam bacaan" className="mt-5 rounded-[1.75rem] border-2 border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display mb-4 text-xl font-semibold text-emerald-950">Baca dengan Suara</h2>
        <Recorder value={transcript} onChange={setTranscript} />
        {transcript.trim() && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900"><span className="font-semibold">Yang terdengar: </span>{transcript}</p>
        )}
        <button type="button" onClick={handleEvaluate} disabled={checking || !transcript.trim()} className="mt-5 w-full rounded-2xl bg-emerald-600 px-5 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40 sm:w-auto">
          {checking ? "Memeriksa..." : "Periksa Bacaan"}
        </button>
        {actionError && <p role="alert" className="mt-3 rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">{actionError}</p>}
        {evaluation && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-500 px-4 py-1.5 font-display text-lg font-semibold text-white">Skor {evaluation.accuracy_score}</span>
              <p className="font-medium text-emerald-900">{evaluation.praise_message}</p>
            </div>
            {evaluation.tricky_words.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {evaluation.tricky_words.map((tw) => (
                  <article key={tw.word} className="rounded-2xl border border-amber-300 bg-white p-4">
                    <h3 className="font-display text-lg font-semibold text-emerald-950">{tw.word}</h3>
                    <p className="mt-1 font-semibold text-amber-600">{tw.syllables}</p>
                    <p className="mt-1 text-sm text-emerald-800">{tw.gentle_tip}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section aria-label="Imajinasi" className="mt-5 rounded-lg border-2 border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Giliran Imajinasimu</h2>
        {page.interactiveQuestion && <p className="mt-2 text-lg text-emerald-900">{page.interactiveQuestion}</p>}
        <label className="mt-4 block text-sm font-semibold text-emerald-900">
          Jawabanmu
          <textarea value={imagination} onChange={(e) => setImagination(e.target.value)} rows={2} maxLength={300} placeholder="Ceritakan idemu di sini" className="mt-1.5 w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 py-3 text-base font-normal text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-500 focus:outline-none" />
        </label>
        <div className="mt-4">
          <Recorder value={imagination} onChange={setImagination} compact textareaLabel="Ketik jawabanmu di sini" />
        </div>
        {continuing && (
          <ol className="mt-5 flex flex-wrap gap-2" aria-live="polite" aria-label="Membuat halaman baru">
            {STEPS.map((step, i) => (
              <li key={step} className={`rounded-full px-4 py-2 text-sm font-semibold ${i === stepIndex ? "bg-emerald-600 text-white motion-safe:animate-pulse" : i < stepIndex ? "bg-emerald-100 text-emerald-800" : "bg-white text-emerald-500 border border-emerald-200"}`}>{step}</li>
            ))}
          </ol>
        )}
        <button type="button" onClick={handleContinue} disabled={continuing || !imagination.trim()} className="mt-5 w-full rounded-2xl bg-amber-500 px-5 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-40 sm:w-auto">
          {continuing ? "Membuat Halaman Baru..." : "Buat Halaman Baru"}
        </button>
      </section>
    </main>
  );
}