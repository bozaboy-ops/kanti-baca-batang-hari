"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface SummaryUser {
  user: { id: string; childName: string; age: number; subdistrict: string; readingLevel: string };
  storyCount: number;
  averageScore: number | null;
  frequentTrickyWords: { word: string; count: number }[];
  recentPages: { storyTitle: string; pageNumber: number; accuracyScore: number | null; createdAt: string }[];
}

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function RingkasanPage() {
  const [users, setUsers] = useState<SummaryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/summary");
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Ringkasan belum bisa dimuat");
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ringkasan belum bisa dimuat");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSummary(); }, [loadSummary]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="lux-panel flex flex-wrap items-start justify-between gap-4 rounded-[2rem] px-6 py-8 sm:px-8">
        <div>
          <span className="gold-rule block h-1 w-14 rounded-full" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold tracking-wide text-amber-300 uppercase">Kanti Baca</p>
          <h1 className="font-display mt-1 text-4xl font-semibold">Ringkasan Bacaan</h1>
          <p className="mt-2 max-w-xl text-lg text-emerald-50">Lihat kemajuan membaca setiap anak di sini: cerita yang dibaca, skor, dan kata yang masih sering sulit.</p>
        </div>
        <Link href="/" className="rounded-full bg-white px-5 py-2.5 font-semibold text-emerald-800 transition-colors hover:bg-amber-300 hover:text-emerald-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400">Kembali ke Beranda</Link>
      </header>

      {loading && <p className="mt-8 text-emerald-800">Memuat ringkasan...</p>}
      {error && (
        <div role="alert" className="mt-8 flex flex-wrap items-center gap-3 rounded-xl bg-amber-100 px-4 py-3 font-medium text-amber-900">
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => void loadSummary()} className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600">Coba Lagi</button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <section className="mt-8 rounded-3xl border-2 border-emerald-100 bg-white p-8 text-center shadow-sm">
          <svg viewBox="0 0 24 24" className="mx-auto h-12 w-12 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" strokeLinecap="round" /></svg>
          <h2 className="font-display mt-3 text-2xl font-semibold text-emerald-950">Belum ada bacaan</h2>
          <p className="mx-auto mt-2 max-w-md text-emerald-800">Belum ada profil anak. Buat profil dan mulai cerita pertama agar ringkasannya muncul di sini.</p>
          <Link href="/" className="mt-5 inline-block rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">Mulai Baca</Link>
        </section>
      )}

      <div className="mt-8 space-y-6">
        {users.map((entry, idx) => (
          <section key={entry.user.id} aria-label={`Ringkasan ${entry.user.childName}`} className="lux-card rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-emerald-950">{entry.user.childName}</h2>
                <p className="text-sm text-emerald-700">{entry.user.age} tahun · {entry.user.subdistrict} · {entry.user.readingLevel}</p>
              </div>
              <div className="flex gap-2.5">
                <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-emerald-700">{entry.storyCount}</span><span className="text-xs font-semibold text-emerald-800">Cerita</span></span>
                <span className="rounded-2xl bg-amber-100 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-amber-700">{entry.averageScore ?? "—"}</span><span className="text-xs font-semibold text-amber-900">Rata-rata Skor</span></span>
              </div>
            </div>

            <h3 className="font-display mt-5 text-lg font-semibold text-emerald-950">Kata yang Sering Sulit</h3>
            {entry.frequentTrickyWords.length === 0 ? (
              <p className="mt-1.5 text-emerald-800">Belum ada kata sulit yang berulang. Terus berlatih, ya.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {entry.frequentTrickyWords.map((tw) => (
                  <li key={tw.word} className="rounded-full border border-amber-400 bg-white px-3.5 py-1.5 text-sm font-semibold text-emerald-900">{tw.word} <span className="text-amber-600">×{tw.count}</span></li>
                ))}
              </ul>
            )}

            <h3 className="font-display mt-5 text-lg font-semibold text-emerald-950">Halaman Terakhir Dibaca</h3>
            {entry.recentPages.length === 0 ? (
              <p className="mt-1.5 text-emerald-800">Belum ada halaman yang dibaca.</p>
            ) : (
              <ul className="mt-2 divide-y divide-emerald-100">
                {entry.recentPages.map((p, i) => (
                  <li key={`${p.storyTitle}-${p.pageNumber}-${i}`} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                    <span className="text-emerald-900"><span className="font-semibold">{p.storyTitle}</span> · Halaman {p.pageNumber}</span>
                    <span className="flex items-center gap-3 text-sm text-emerald-700">
                      {formatDate(p.createdAt)}
                      <span className="rounded-full bg-emerald-600 px-3 py-1 font-semibold text-white">{p.accuracyScore ?? "—"}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}