"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { speakIndonesian } from "@/lib/reading/speech";

interface DeckWord { word: string; syllables: string; gentleTip: string; count: number }
interface SummaryEntry {
  user: { id: string; childName: string };
  trickyWordDeck: DeckWord[];
}

export default function LatihanPage() {
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = window.localStorage.getItem("bacca.currentUserId");
        if (!stored) throw new Error("Pilih profil anak di Beranda dulu, ya.");
        const res = await fetch(`/api/summary?userId=${encodeURIComponent(stored)}`);
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error ?? "Latihan belum bisa dimuat");
        const users = (Array.isArray(data.users) ? data.users : []) as SummaryEntry[];
        setEntries(users);
        setSelectedId(users.some((u) => u.user.id === stored) ? stored : users[0]?.user.id ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Latihan belum bisa dimuat");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
    if (!selectedId) { setMastered(new Set()); return; }
    try {
      const raw = window.localStorage.getItem(`kanti.mastered.${selectedId}`);
      setMastered(new Set(raw ? (JSON.parse(raw) as string[]) : []));
    } catch { setMastered(new Set()); }
  }, [selectedId]);

  const entry = entries.find((e) => e.user.id === selectedId) ?? null;
  const deck = useMemo(() => (entry ? entry.trickyWordDeck.filter((w) => !mastered.has(w.word.toLowerCase())) : []), [entry, mastered]);
  const totalWords = entry?.trickyWordDeck.length ?? 0;
  const card = deck[Math.min(index, Math.max(deck.length - 1, 0))] ?? null;

  function markMastered() {
    if (!card || !selectedId) return;
    const next = new Set(mastered);
    next.add(card.word.toLowerCase());
    setMastered(next);
    window.localStorage.setItem(`kanti.mastered.${selectedId}`, JSON.stringify([...next]));
    setShowAnswer(false);
  }

  function nextCard() {
    setShowAnswer(false);
    setIndex((i) => (deck.length === 0 ? 0 : (i + 1) % deck.length));
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <header className="lux-panel rounded-[2rem] px-6 py-8 sm:px-8">
        <span className="gold-rule block h-1 w-14 rounded-full" aria-hidden="true" />
        <h1 className="font-display mt-4 text-4xl font-semibold">Latihan Kata Sulit</h1>
        <p className="mt-2 max-w-xl text-lg text-emerald-50">Kartu kata dari bacaan yang masih sering sulit. Baca kata, dengarkan contohnya, lalu tandai bila sudah bisa.</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 font-semibold text-emerald-800 hover:bg-amber-300 hover:text-emerald-950 print:hidden">Kembali ke Beranda</Link>
      </header>

      {loading && <p className="mt-8 text-emerald-800">Memuat latihan...</p>}
      {error && <p role="alert" className="mt-8 rounded-xl bg-amber-100 px-4 py-3 font-medium text-amber-900">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className="mt-8 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800">Belum ada profil anak. Buat profil dan mulai membaca dulu, ya.</p>
      )}

      {entry && (
        <>
          <label className="mt-6 block text-sm font-semibold text-emerald-900">Latihan untuk
            <select value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value)} className="mt-1.5 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-emerald-950 focus:border-emerald-600 focus:outline-none sm:w-auto sm:min-w-64">
              {entries.map((e) => <option key={e.user.id} value={e.user.id}>{e.user.childName}</option>)}
            </select>
          </label>

          <p className="mt-4 font-medium text-emerald-800" aria-live="polite">
            Sudah dikuasai: {totalWords - deck.length} dari {totalWords} kata
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-emerald-100" aria-hidden="true">
            <div className="gold-rule h-full rounded-full" style={{ width: `${totalWords === 0 ? 0 : ((totalWords - deck.length) / totalWords) * 100}%` }} />
          </div>

          {card ? (
            <section aria-label="Kartu kata" className="lux-card mt-6 rounded-[2rem] px-6 py-10 text-center">
              <p className="text-sm font-bold text-amber-600">KATA KE-{Math.min(index + 1, deck.length)} DARI {deck.length}</p>
              <h2 className="font-display mt-3 text-5xl font-semibold text-emerald-950">{card.word}</h2>
              <p className="mt-2 text-emerald-700">Muncul {card.count}x sebagai kata sulit</p>
              {showAnswer ? (
                <div className="mt-6">
                  <p className="font-display text-3xl font-semibold text-amber-600">{card.syllables}</p>
                  <p className="mx-auto mt-2 max-w-md text-emerald-800">{card.gentleTip}</p>
                </div>
              ) : (
                <button type="button" onClick={() => setShowAnswer(true)} className="mt-6 rounded-full border-2 border-emerald-700 px-5 py-2.5 font-semibold text-emerald-800 hover:bg-emerald-50">Lihat Suku Kata</button>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => speakIndonesian(card.word)} className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Dengarkan Kata</button>
                <button type="button" onClick={markMastered} className="rounded-full bg-amber-500 px-5 py-3 font-display font-semibold text-white hover:bg-amber-600">Sudah Bisa</button>
                <button type="button" onClick={nextCard} className="rounded-full border-2 border-emerald-700 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-50">Kata Berikutnya</button>
              </div>
            </section>
          ) : (
            <section className="lux-card mt-6 rounded-[2rem] px-6 py-10 text-center">
              <h2 className="font-display text-3xl font-semibold text-emerald-950">{totalWords === 0 ? "Belum Ada Kata Sulit" : "Semua Kata Sudah Dikuasai"}</h2>
              <p className="mx-auto mt-2 max-w-md text-emerald-800">{totalWords === 0 ? "Baca satu cerita dulu. Kata yang sulit akan muncul di sini sebagai kartu latihan." : "Hebat! Baca cerita baru untuk menemukan kata-kata baru."}</p>
              <Link href="/" className="mt-5 inline-block rounded-full bg-emerald-700 px-6 py-3 font-display font-semibold text-white hover:bg-emerald-800">Pilih Cerita</Link>
            </section>
          )}
        </>
      )}
    </main>
  );
}