"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/content/themes";

// Duplicated client-side from the API kecamatan list (Task 4 contract).
const KECAMATAN = [
  "Muara Bulian",
  "Muara Tembesi",
  "Maro Sebo Ulu",
  "Maro Sebo Ilir",
  "Batin XXIV",
  "Pemayung",
  "Bajubang",
  "Mersam",
] as const;

const READING_LEVELS = ["Pemula", "Lancar"] as const;
const STORAGE_KEY = "bacca.currentUserId";

interface UserProfile {
  id: string;
  childName: string;
  age: number;
  subdistrict: string;
  readingLevel: string;
  createdAt: string;
}

const CARD_STYLES = [
  "rounded-3xl border-emerald-200",
  "rounded-[1.75rem] border-amber-300",
  "rounded-2xl border-emerald-300",
  "rounded-[2rem] border-amber-400",
] as const;

export default function HomePage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [usia, setUsia] = useState("7");
  const [kecamatan, setKecamatan] = useState<string>(KECAMATAN[0]);
  const [level, setLevel] = useState<string>(READING_LEVELS[0]);
  const [error, setError] = useState<string | null>(null);
  const [busyTheme, setBusyTheme] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Profil belum bisa dimuat");
      setUsers(Array.isArray(data.users) ? data.users : []);
      setLoadFailed(false);
    } catch (err) {
      setLoadFailed(true);
      setError(err instanceof Error ? err.message : "Profil belum bisa dimuat");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    setSelectedId(window.localStorage.getItem(STORAGE_KEY));
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (loadingUsers || !selectedId) return;
    if (!users.some((u) => u.id === selectedId)) {
      setSelectedId(null);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [users, loadingUsers, selectedId]);

  function selectUser(id: string) {
    setSelectedId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: nama, age: Number(usia), subdistrict: kecamatan, readingLevel: level }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Profil belum bisa disimpan");
      setNama("");
      await loadUsers();
      if (data.user?.id) selectUser(data.user.id as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil belum bisa disimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Profil belum bisa dihapus");
      setConfirmDeleteId(null);
      if (selectedId === id) {
        setSelectedId(null);
        window.localStorage.removeItem(STORAGE_KEY);
      }
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil belum bisa dihapus");
    }
  }

  async function handleStart(themeSlug: string) {
    if (!selectedId) return;
    setError(null);
    setBusyTheme(themeSlug);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedId, themeSlug }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Cerita belum bisa dibuat");
      router.push(`/baca/${data.story.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cerita belum bisa dibuat");
      setBusyTheme(null);
    }
  }

  const inputClass = "mt-1.5 w-full rounded-xl border-2 border-emerald-200 bg-white px-4 py-2.5 text-emerald-950 focus:border-emerald-500 focus:outline-none";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-emerald-950 sm:text-5xl">BaccaAI — Kanti Baca Batang Hari</h1>
          <p className="mt-2 max-w-xl text-lg text-emerald-800">Latihan membaca cerita lokal Batang Hari untuk anak usia 6–10 tahun. Pilih profil, pilih tema, lalu mulai membaca bersama Alif.</p>
        </div>
        <Link href="/ringkasan" className="rounded-full bg-amber-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500">Lihat Ringkasan</Link>
      </header>

      {error && (
        <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-amber-100 px-4 py-3 font-medium text-amber-900">
          <span className="flex-1">{error}</span>
          {loadFailed && <button type="button" onClick={() => { setError(null); setLoadingUsers(true); void loadUsers(); }} className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600">Coba Lagi</button>}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_3fr]">
        <section aria-label="Profil anak" className="rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-emerald-950">Profil Anak</h2>
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <label className="block text-sm font-semibold text-emerald-900">Nama anak
              <input value={nama} onChange={(e) => setNama(e.target.value)} required placeholder="Contoh: Alif" className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Usia (6–10 tahun)
              <input value={usia} onChange={(e) => setUsia(e.target.value)} type="number" min={6} max={10} step={1} required className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Kecamatan
              <select value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} className={inputClass}>
                {KECAMATAN.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Level membaca
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
                {READING_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <button type="submit" disabled={saving} className="w-full rounded-2xl bg-emerald-600 px-5 py-3 font-display text-lg font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40">
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </form>

          <h3 className="font-display mt-7 text-lg font-semibold text-emerald-950">Profil Tersimpan</h3>
          {loadingUsers ? (
            <p className="mt-2 text-emerald-700">Memuat profil...</p>
          ) : users.length === 0 ? (
            <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">Belum ada profil. Buat profil pertama di atas, ya.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {users.map((user) => {
                const selected = user.id === selectedId;
                return (
                  <li key={user.id} className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 ${selected ? "border-emerald-600 bg-emerald-50" : "border-emerald-100 bg-white"}`}>
                    <button type="button" onClick={() => selectUser(user.id)} aria-pressed={selected} className="min-w-0 flex-1 text-left">
                      <span className="font-display block truncate text-lg font-semibold text-emerald-950">{user.childName}</span>
                      <span className="text-sm text-emerald-700">{user.age} tahun · {user.subdistrict} · {user.readingLevel}</span>
                      {selected && <span className="mt-0.5 block text-sm font-semibold text-emerald-600">Profil dipilih</span>}
                    </button>
                    {confirmDeleteId === user.id ? (
                      <span className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={() => void handleDelete(user.id)} aria-label={`Konfirmasi hapus profil ${user.childName}`} className="rounded-full bg-amber-500 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600">Ya, Hapus {user.childName}</button>
                        <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-full border-2 border-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50">Batal</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setConfirmDeleteId(user.id)} aria-label={`Hapus profil ${user.childName}`} className="shrink-0 rounded-full border-2 border-amber-500 px-3.5 py-1.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50">Hapus</button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-label="Pilih tema cerita">
          <h2 className="font-display text-2xl font-semibold text-emerald-950">Pilih Tema Cerita</h2>
          {!selectedId && <p className="mt-2 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-medium text-amber-900">Pilih atau buat profil anak dulu agar tombol Mulai Baca aktif.</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {THEMES.map((theme, i) => (
              <article key={theme.slug} className={`flex flex-col border-2 bg-white p-5 shadow-sm ${CARD_STYLES[i % CARD_STYLES.length]}`}>
                <span className="h-3 w-12 rounded-full" style={{ backgroundColor: theme.palette.accent }} aria-hidden="true" />
                <h3 className="font-display mt-3 text-2xl font-semibold text-emerald-950">{theme.title}</h3>
                <p className="mt-1 flex-1 text-emerald-800">{theme.subtitle}</p>
                <button type="button" disabled={!selectedId || busyTheme !== null} onClick={() => void handleStart(theme.slug)} className="mt-4 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40">
                  {busyTheme === theme.slug ? "Membuat Cerita..." : "Mulai Baca"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}