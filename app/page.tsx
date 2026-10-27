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

const THEME_KECAMATAN: Record<string, string> = {
  "sungai-batanghari": "Semua Wilayah",
  "hutan-senami": "Muara Bulian",
  "benteng-tembesi": "Muara Tembesi",
  "kuliner-tradisi": "Semua Wilayah",
  "aek-meliuk": "Muara Bulian",
  "danau-letang": "Muara Tembesi",
  "pasar-terusan": "Muara Tembesi",
  "sawah-pemayung": "Pemayung",
  "bajubang": "Bajubang",
  "mersam": "Mersam",
  "maro-sebo-ulu": "Maro Sebo Ulu",
  "maro-sebo-ilir": "Maro Sebo Ilir",
  "batin-xxiv": "Batin XXIV",
};

const FILTERS = ["Semua", ...KECAMATAN, "Semua Wilayah"] as const;

interface UserProfile {
  id: string;
  childName: string;
  age: number;
  subdistrict: string;
  readingLevel: string;
  createdAt: string;
}

const STEPS = [
  { title: "Buat profil anak", text: "Isi nama, usia, dan kecamatan." },
  { title: "Pilih cerita", text: "13 cerita dari 8 kecamatan Batang Hari." },
  { title: "Baca dengan suara", text: "Kanti memberi koreksi lembut per kata." },
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
  const [filter, setFilter] = useState<string>("Semua");

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

  const selectedUser = users.find((u) => u.id === selectedId) ?? null;
  const visibleThemes = THEMES.filter((theme) => filter === "Semua" || THEME_KECAMATAN[theme.slug] === filter);
  const inputClass = "mt-1.5 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-emerald-950 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <nav aria-label="Utama" className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-white" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" strokeLinecap="round" /></svg>
          </span>
          <span>
            <span className="font-display block text-xl leading-none font-semibold text-emerald-950">Kanti Baca</span>
            <span className="text-xs font-semibold tracking-wide text-amber-600">BATANG HARI</span>
          </span>
        </span>
        <Link href="/ringkasan" className="rounded-full border-2 border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-800 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400">Ringkasan Bacaan</Link>
      </nav>

      <section className="lux-panel mt-6 rounded-[2rem] px-5 py-8 sm:px-10 sm:py-12">
        <span className="gold-rule block h-1 w-16 rounded-full" aria-hidden="true" />
        <h1 className="font-display mt-5 max-w-2xl text-4xl leading-tight font-semibold sm:text-6xl">Kanti Baca Batang Hari</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-50">Cerita anak dari sungai, hutan, danau, pasar, dan sawah di Kabupaten Batang Hari. Baca dengan suara, dengarkan koreksi lembut, lalu ciptakan halaman berikutnya.</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <span className="font-display flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-base font-bold text-emerald-950">{i + 1}</span>
              <h2 className="font-display mt-3 text-lg font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-emerald-50">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {selectedUser && (
        <p className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 font-medium text-emerald-950" aria-live="polite">
          Siap membaca sebagai <strong>{selectedUser.childName}</strong> · {selectedUser.age} tahun · {selectedUser.subdistrict} · Level {selectedUser.readingLevel}. Sekarang pilih ceritanya di bawah.
        </p>
      )}

      {error && (
        <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-amber-100 px-5 py-3.5 font-medium text-amber-900">
          <span className="flex-1">{error}</span>
          {loadFailed && <button type="button" onClick={() => { setError(null); setLoadingUsers(true); void loadUsers(); }} className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600">Coba Lagi</button>}
        </div>
      )}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[380px_1fr]">
        <section aria-label="Profil anak" className="lux-card rounded-[1.75rem] p-5 sm:p-6 lg:sticky lg:top-6">
          <p className="text-xs font-bold tracking-wide text-amber-600">LANGKAH 1</p>
          <h2 className="font-display mt-1 text-2xl font-semibold text-emerald-950">Profil Anak</h2>
          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-emerald-900">Nama anak
              <input value={nama} onChange={(e) => setNama(e.target.value)} required placeholder="Contoh: Alif" className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Usia (6-10 tahun)
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
            <button type="submit" disabled={saving} className="w-full rounded-2xl bg-emerald-700 px-5 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40">
              {saving ? "Menyimpan..." : "Simpan & Pilih Profil"}
            </button>
          </form>

          <h3 className="font-display mt-8 text-lg font-semibold text-emerald-950">Profil Tersimpan</h3>
          {loadingUsers ? (
            <p className="mt-2 text-emerald-700">Memuat profil...</p>
          ) : users.length === 0 ? (
            <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">Belum ada profil. Buat profil pertama di atas, ya.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {users.map((user) => {
                const selected = user.id === selectedId;
                return (
                  <li key={user.id} className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${selected ? "border-emerald-700 bg-emerald-50" : "border-emerald-900/10 bg-white"}`}>
                    <button type="button" onClick={() => selectUser(user.id)} aria-pressed={selected} className="min-w-0 flex-1 text-left">
                      <span className="font-display block truncate text-lg font-semibold text-emerald-950">{user.childName}</span>
                      <span className="text-sm text-emerald-700">{user.age} tahun · {user.subdistrict} · {user.readingLevel}</span>
                      {selected && <span className="mt-0.5 block text-sm font-semibold text-emerald-700">Profil dipilih - siap memilih cerita</span>}
                    </button>
                    {confirmDeleteId === user.id ? (
                      <span className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={() => void handleDelete(user.id)} aria-label={`Konfirmasi hapus profil ${user.childName}`} className="rounded-full bg-amber-500 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600">Ya, Hapus {user.childName}</button>
                        <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-full border-2 border-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50">Batal</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setConfirmDeleteId(user.id)} aria-label={`Hapus profil ${user.childName}`} className="shrink-0 rounded-full border border-amber-500 px-3.5 py-1.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50">Hapus</button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-label="Pilih tema cerita">
          <p className="text-xs font-bold tracking-wide text-amber-600">LANGKAH 2</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-emerald-950">Pilih Cerita Batang Hari</h2>
            <p className="text-sm font-medium text-emerald-700">{visibleThemes.length} cerita · masing-masing 6 halaman</p>
          </div>
          {!selectedId && <p className="mt-3 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-medium text-amber-900">Buat atau pilih profil anak dulu di Langkah 1 agar tombol Mulai Baca aktif.</p>}

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Saring cerita per kecamatan">
            {FILTERS.map((name) => (
              <button key={name} type="button" data-active={filter === name} aria-pressed={filter === name} onClick={() => setFilter(name)} className="chip-filter rounded-full px-4 py-2 text-sm font-semibold">{name}</button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleThemes.map((theme) => (
              <article key={theme.slug} className="lux-card flex flex-col overflow-hidden rounded-[1.5rem]">
                <div className="px-5 pt-5" style={{ backgroundColor: theme.palette.sky }}>
                  <span className="gold-rule block h-1 w-12 rounded-full" aria-hidden="true" />
                  <h3 className="font-display mt-3 text-2xl leading-snug font-semibold text-emerald-950">{theme.title}</h3>
                  <p className="min-h-12 pb-4 text-sm leading-relaxed text-emerald-800">{theme.subtitle}</p>
                </div>
                <div className="flex flex-1 flex-col px-5 py-4">
                  <p className="flex flex-wrap gap-2 text-xs font-bold text-emerald-700">
                    <span className="rounded-full bg-emerald-50 px-3 py-1">6 HALAMAN</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{THEME_KECAMATAN[theme.slug].toUpperCase()}</span>
                  </p>
                  <button type="button" disabled={!selectedId || busyTheme !== null} onClick={() => void handleStart(theme.slug)} className="mt-4 w-full rounded-xl bg-emerald-700 px-5 py-3 font-display text-base font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40">
                    {busyTheme === theme.slug ? "Membuat Cerita..." : "Mulai Baca"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {visibleThemes.length === 0 && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">Belum ada cerita untuk saringan ini.</p>}
        </section>
      </div>

      <footer className="mt-12 border-t border-emerald-900/10 pt-6 pb-2 text-center text-sm text-emerald-700">
        Kanti Baca Batang Hari - cerita lokal Bumi Serentak Bak Regam untuk anak usia 6-10 tahun.
      </footer>
    </main>
  );
}
