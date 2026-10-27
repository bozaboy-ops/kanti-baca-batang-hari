"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PARENT_PIN_KEY, PARENT_UNLOCK_KEY, hashPin, isValidPinFormat, verifyPin } from "@/lib/parent/pin";

interface SummaryUser {
  user: { id: string; childName: string; age: number; subdistrict: string; readingLevel: string };
  storyCount: number;
  completedCount: number;
  totalStars: number;
  badges: { slug: string; name: string }[];
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
  const [pinHash, setPinHash] = useState<string | null | undefined>(undefined);
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    setPinHash(window.localStorage.getItem(PARENT_PIN_KEY));
    setUnlocked(window.sessionStorage.getItem(PARENT_UNLOCK_KEY) === "1");
  }, []);

  function unlock() {
    window.sessionStorage.setItem(PARENT_UNLOCK_KEY, "1");
    setUnlocked(true);
  }

  function handleSetupPin(event: React.FormEvent) {
    event.preventDefault();
    setPinError(null);
    if (!isValidPinFormat(pinInput)) { setPinError("PIN harus 4-6 angka."); return; }
    if (pinInput !== pinConfirm) { setPinError("PIN dan ulangi PIN belum sama."); return; }
    window.localStorage.setItem(PARENT_PIN_KEY, hashPin(pinInput));
    setPinHash(hashPin(pinInput));
    setPinInput(""); setPinConfirm("");
    unlock();
  }

  function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    setPinError(null);
    if (!verifyPin(pinInput, pinHash)) { setPinError("PIN belum tepat. Coba lagi, ya."); return; }
    setPinInput("");
    unlock();
  }

  function lockAgain() {
    window.sessionStorage.removeItem(PARENT_UNLOCK_KEY);
    setUnlocked(false);
  }

  function resetPin() {
    window.localStorage.removeItem(PARENT_PIN_KEY);
    window.sessionStorage.removeItem(PARENT_UNLOCK_KEY);
    setPinHash(null);
    setUnlocked(false);
    setPinInput(""); setPinConfirm(""); setPinError(null);
  }

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

  useEffect(() => { if (unlocked) void loadSummary(); }, [loadSummary, unlocked]);

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

      {pinHash === undefined && <p className="mt-8 text-emerald-800">Menyiapkan area orang tua...</p>}

      {pinHash === null && (
        <section aria-label="Buat PIN orang tua" className="lux-card mx-auto mt-8 max-w-md rounded-[1.75rem] p-6">
          <h2 className="font-display text-2xl font-semibold text-emerald-950">Area Orang Tua & Guru</h2>
          <p className="mt-2 text-emerald-800">Buat PIN 4-6 angka agar ringkasan hanya dibuka orang tua atau guru di perangkat ini. Ini kunci layar lokal, bukan kata sandi akun.</p>
          <form onSubmit={handleSetupPin} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-emerald-900">PIN baru
              <input value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" type="password" autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-emerald-900/20 px-4 py-3 focus:border-emerald-600 focus:outline-none" placeholder="Contoh: 2580" />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Ulangi PIN
              <input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" type="password" autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-emerald-900/20 px-4 py-3 focus:border-emerald-600 focus:outline-none" />
            </label>
            {pinError && <p role="alert" className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">{pinError}</p>}
            <button type="submit" className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-display text-lg font-semibold text-white hover:bg-emerald-800">Simpan PIN & Buka Ringkasan</button>
          </form>
        </section>
      )}

      {pinHash && !unlocked && (
        <section aria-label="Buka PIN orang tua" className="lux-card mx-auto mt-8 max-w-md rounded-[1.75rem] p-6">
          <h2 className="font-display text-2xl font-semibold text-emerald-950">Area Orang Tua & Guru Terkunci</h2>
          <p className="mt-2 text-emerald-800">Masukkan PIN untuk melihat ringkasan bacaan.</p>
          <form onSubmit={handleUnlock} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-emerald-900">PIN
              <input value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" type="password" autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-emerald-900/20 px-4 py-3 focus:border-emerald-600 focus:outline-none" />
            </label>
            {pinError && <p role="alert" className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">{pinError}</p>}
            <button type="submit" className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-display text-lg font-semibold text-white hover:bg-emerald-800">Buka Ringkasan</button>
            <button type="button" onClick={resetPin} className="w-full rounded-xl border border-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50">Lupa PIN? Atur Ulang di Perangkat Ini</button>
          </form>
        </section>
      )}

      {unlocked && (
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <button type="button" onClick={() => window.print()} className="rounded-full bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800">Cetak Laporan</button>
          <button type="button" onClick={lockAgain} className="rounded-full border-2 border-emerald-700 px-5 py-2.5 font-semibold text-emerald-800 hover:bg-emerald-50">Kunci Lagi</button>
        </div>
      )}

      {unlocked && loading && <p className="mt-8 text-emerald-800">Memuat ringkasan...</p>}
      {error && (
        <div role="alert" className="mt-8 flex flex-wrap items-center gap-3 rounded-xl bg-amber-100 px-4 py-3 font-medium text-amber-900">
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => void loadSummary()} className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600">Coba Lagi</button>
        </div>
      )}

      {unlocked && !loading && !error && users.length === 0 && (
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
              <div className="flex flex-wrap gap-2.5">
                <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-emerald-700">{entry.storyCount}</span><span className="text-xs font-semibold text-emerald-800">Cerita</span></span>
                <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-emerald-700">{entry.completedCount}</span><span className="text-xs font-semibold text-emerald-800">Tamat</span></span>
                <span className="rounded-2xl bg-amber-100 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-amber-700">{entry.totalStars}</span><span className="text-xs font-semibold text-amber-900">Bintang</span></span>
                <span className="rounded-2xl bg-amber-100 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-amber-700">{entry.averageScore ?? "—"}</span><span className="text-xs font-semibold text-amber-900">Rata-rata Skor</span></span>
                <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-center"><span className="font-display block text-xl font-semibold text-emerald-700">{entry.recentPages.filter((page) => Date.now() - new Date(page.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length}</span><span className="text-xs font-semibold text-emerald-800">Halaman 7 Hari</span></span>
              </div>
            </div>

            <h3 className="font-display mt-5 text-lg font-semibold text-emerald-950">Bintang & Lencana</h3>
            {entry.badges.length === 0 ? (
              <p className="mt-1.5 text-emerald-800">Belum ada lencana. Tamatkan satu cerita untuk mengumpulkan bintang pertama.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {entry.badges.map((badge) => (
                  <li key={badge.slug} className="flex items-center gap-1.5 rounded-full bg-emerald-800 px-3.5 py-1.5 text-sm font-semibold text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
                    {badge.name}
                  </li>
                ))}
              </ul>
            )}

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