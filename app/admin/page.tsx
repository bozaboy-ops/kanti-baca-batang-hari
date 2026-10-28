"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { THEMES } from "@/lib/content/themes";
import { parseSettings, type AppSettings } from "@/lib/settings";

const KECAMATAN = ["Muara Bulian", "Muara Tembesi", "Maro Sebo Ulu", "Maro Sebo Ilir", "Batin XXIV", "Pemayung", "Bajubang", "Mersam"];

interface AdminUser {
  id: string; childName: string; age: number; subdistrict: string; readingLevel: string;
  parentName: string | null; parentPhone: string | null; createdAt: string;
}
interface AdminEntry {
  user: AdminUser; storyCount: number; completedCount: number; totalStars: number;
  badges: { slug: string; name: string }[]; averageScore: number | null;
  frequentTrickyWords: { word: string; count: number }[];
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [entries, setEntries] = useState<AdminEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ disabledThemes: [], weeklyTarget: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json().catch(() => null);
        setUnlocked(res.ok && data?.ok === true);
      } catch {
        setUnlocked(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, settingsRes] = await Promise.all([fetch("/api/summary"), fetch("/api/settings")]);
      const summaryData = await summaryRes.json().catch(() => null);
      if (!summaryRes.ok) throw new Error(summaryData?.error ?? "Data admin belum bisa dimuat");
      setEntries(Array.isArray(summaryData.users) ? summaryData.users : []);
      const settingsData = await settingsRes.json().catch(() => null);
      if (settingsRes.ok && settingsData?.settings) setSettings(parseSettings(settingsData.settings));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Data admin belum bisa dimuat");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (unlocked) void loadAll(); }, [unlocked, loadAll]);

  async function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Username atau sandi belum tepat");
      setUsernameInput("");
      setPasswordInput("");
      setUnlocked(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Username atau sandi belum tepat");
    }
  }

  async function handleLock() {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } catch { /* sesi lokal tetap dikunci */ }
    setUnlocked(false);
  }

  async function saveProfile(user: AdminUser, patch: Partial<AdminUser>) {
    setError(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: user.childName, age: user.age, subdistrict: user.subdistrict, readingLevel: user.readingLevel, parentName: user.parentName ?? "", parentPhone: user.parentPhone ?? "", ...patch }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Profil belum bisa diubah");
      setSavedNote(`Profil ${user.childName} tersimpan.`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil belum bisa diubah");
    }
  }

  async function handleDelete(user: AdminUser) {
    setError(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Profil belum bisa dihapus");
      setConfirmDeleteId(null);
      setSavedNote(`Profil ${user.childName} dihapus.`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil belum bisa dihapus");
    }
  }

  async function saveSettings(next: AppSettings) {
    setSettings(next);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      if (!res.ok) throw new Error("Pengaturan belum bisa disimpan");
      setSavedNote("Pengaturan aplikasi tersimpan.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pengaturan belum bisa disimpan");
    }
  }

  function toggleTheme(slug: string, enabled: boolean) {
    const disabledThemes = enabled ? settings.disabledThemes.filter((s) => s !== slug) : [...settings.disabledThemes, slug];
    void saveSettings({ ...settings, disabledThemes });
  }

  function exportCsv() {
    const header = "Nama Anak,Usia,Kecamatan,Level,Nama Orang Tua,HP Orang Tua,Cerita,Tamat,Bintang,Skor Rata-rata,Tanggal Daftar";
    const rows = entries.map((e) => [e.user.childName, e.user.age, e.user.subdistrict, e.user.readingLevel, e.user.parentName ?? "", e.user.parentPhone ?? "", e.storyCount, e.completedCount, e.totalStars, e.averageScore ?? "", new Date(e.user.createdAt).toLocaleDateString("id-ID")].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pendaftar-kanti-baca.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalStories = entries.reduce((n, e) => n + e.storyCount, 0);
  const totalCompleted = entries.reduce((n, e) => n + e.completedCount, 0);
  const inputClass = "mt-1.5 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-emerald-950 focus:border-emerald-600 focus:outline-none";

  if (checking) return <main className="mx-auto max-w-3xl px-4 py-12 text-emerald-800">Menyiapkan admin...</main>;

  if (!unlocked) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
        <section className="lux-card rounded-[2rem] p-6 sm:p-8">
          <span className="gold-rule block h-1 w-14 rounded-full" aria-hidden="true" />
          <h1 className="font-display mt-4 text-3xl font-semibold text-emerald-950">Login Admin Pemilik</h1>
          <p className="mt-2 text-emerald-800">Halaman khusus pemilik. Masukkan username dan sandi admin — hanya pemilik yang memilikinya.</p>
          <form onSubmit={handleUnlock} className="mt-5 space-y-3">
            <label className="block text-sm font-semibold text-emerald-900">Username
              <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} type="text" autoComplete="username" className={inputClass} placeholder="Username admin" />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Sandi
              <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type="password" autoComplete="current-password" className={inputClass} placeholder="Sandi admin" />
            </label>
            {loginError && <p role="alert" className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">{loginError}</p>}
            <button type="submit" className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-display text-lg font-semibold text-white hover:bg-emerald-800">Masuk sebagai Admin</button>
          </form>
          <p className="mt-4 text-center"><Link href="/" className="font-semibold text-emerald-700">Kembali ke Beranda</Link></p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="lux-panel flex flex-wrap items-start justify-between gap-4 rounded-[2rem] px-6 py-8 sm:px-8">
        <div>
          <span className="gold-rule block h-1 w-14 rounded-full" aria-hidden="true" />
          <h1 className="font-display mt-4 text-4xl font-semibold">Admin Pemilik</h1>
          <p className="mt-2 max-w-xl text-emerald-50">Lihat pendaftar, kelola profil anak, atur cerita yang tampil, dan ubah target misi dari sini.</p>
        </div>
        <span className="flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={exportCsv} className="rounded-full bg-white px-5 py-2.5 font-semibold text-emerald-800 hover:bg-amber-300 hover:text-emerald-950">Unduh CSV Pendaftar</button>
          <button type="button" onClick={() => void handleLock()} className="rounded-full border border-white/50 px-5 py-2.5 font-semibold text-white hover:bg-white/10">Kunci Admin</button>
          <Link href="/" className="rounded-full border border-white/50 px-5 py-2.5 font-semibold text-white hover:bg-white/10">Beranda</Link>
        </span>
      </header>

      {loading && <p className="mt-6 text-emerald-800">Memuat data admin...</p>}
      {error && <p role="alert" className="mt-6 rounded-xl bg-amber-100 px-4 py-3 font-medium text-amber-900">{error}</p>}
      {savedNote && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-800" aria-live="polite">{savedNote}</p>}

      <section aria-label="Ringkasan pemilik" className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Anak Terdaftar", value: entries.length },
          { label: "Total Cerita Dibuka", value: totalStories },
          { label: "Cerita Tamat", value: totalCompleted },
          { label: "Cerita Aktif", value: THEMES.length - settings.disabledThemes.length },
        ].map((stat) => (
          <div key={stat.label} className="lux-card rounded-[1.25rem] px-5 py-4 text-center">
            <span className="font-display block text-3xl font-semibold text-emerald-800">{stat.value}</span>
            <span className="text-sm font-semibold text-emerald-700">{stat.label}</span>
          </div>
        ))}
      </section>

      <section aria-label="Pengaturan aplikasi" className="lux-card mt-6 rounded-[1.75rem] p-5 sm:p-6">
        <h2 className="font-display text-2xl font-semibold text-emerald-950">Pengaturan Aplikasi</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="block text-sm font-semibold text-emerald-900">Target misi mingguan (halaman)
            <input type="number" min={1} max={50} value={settings.weeklyTarget} onChange={(e) => setSettings({ ...settings, weeklyTarget: Number(e.target.value) })} className="mt-1.5 w-32 rounded-xl border border-emerald-900/20 px-4 py-2.5 focus:border-emerald-600 focus:outline-none" />
          </label>
          <button type="button" onClick={() => void saveSettings(parseSettings(settings))} className="rounded-full bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800">Simpan Target</button>
        </div>
        <h3 className="font-display mt-6 text-lg font-semibold text-emerald-950">Cerita yang Tampil untuk Anak</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme) => {
            const active = !settings.disabledThemes.includes(theme.slug);
            return (
              <li key={theme.slug} className="flex items-center justify-between gap-3 rounded-xl border border-emerald-900/10 px-4 py-2.5">
                <span className="min-w-0"><span className="block truncate font-semibold text-emerald-950">{theme.title}</span><span className="text-xs text-emerald-700">{active ? "Tampil" : "Disembunyikan"}</span></span>
                <button type="button" role="switch" aria-checked={active} aria-label={`Tampilkan cerita ${theme.title}`} onClick={() => toggleTheme(theme.slug, !active)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${active ? "bg-emerald-600" : "bg-emerald-200"}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${active ? "left-6" : "left-1"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Daftar anak terdaftar" className="mt-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-emerald-950">Anak Terdaftar ({entries.length})</h2>
        {entries.length === 0 && !loading && <p className="rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800">Belum ada anak terdaftar. Bagikan halaman Daftar Anak kepada orang tua.</p>}
        {entries.map((entry) => (
          <article key={entry.user.id} className="lux-card rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-semibold text-emerald-950">{entry.user.childName}</h3>
                <p className="text-emerald-700">{entry.user.age} tahun · {entry.user.subdistrict} · Level {entry.user.readingLevel}</p>
                <p className="text-sm text-emerald-600">Orang tua: {entry.user.parentName ?? "-"} {entry.user.parentPhone ? `· ${entry.user.parentPhone}` : ""} · Daftar {new Date(entry.user.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
              <p className="flex flex-wrap gap-2 text-sm font-semibold">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{entry.storyCount} cerita</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{entry.completedCount} tamat</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">{entry.totalStars} bintang</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Skor {entry.averageScore ?? "-"}</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <label className="block text-sm font-semibold text-emerald-900">Kecamatan
                <select defaultValue={entry.user.subdistrict} id={`kec-${entry.user.id}`} className="mt-1 block rounded-xl border border-emerald-900/20 px-3 py-2 focus:border-emerald-600 focus:outline-none">
                  {KECAMATAN.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-emerald-900">Level
                <select defaultValue={entry.user.readingLevel} id={`lvl-${entry.user.id}`} className="mt-1 block rounded-xl border border-emerald-900/20 px-3 py-2 focus:border-emerald-600 focus:outline-none">
                  <option value="Pemula">Pemula</option>
                  <option value="Lancar">Lancar</option>
                </select>
              </label>
              <button type="button" onClick={() => {
                const kec = (document.getElementById(`kec-${entry.user.id}`) as HTMLSelectElement).value;
                const lvl = (document.getElementById(`lvl-${entry.user.id}`) as HTMLSelectElement).value;
                void saveProfile(entry.user, { subdistrict: kec, readingLevel: lvl });
              }} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Simpan Perubahan</button>
              {confirmDeleteId === entry.user.id ? (
                <span className="flex gap-2">
                  <button type="button" onClick={() => void handleDelete(entry.user)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Ya, Hapus {entry.user.childName}</button>
                  <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Batal</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmDeleteId(entry.user.id)} className="rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">Hapus Profil</button>
              )}
            </div>
            {entry.badges.length > 0 && <p className="mt-3 text-sm text-emerald-700">Lencana: {entry.badges.map((b) => b.name).join(", ")}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}