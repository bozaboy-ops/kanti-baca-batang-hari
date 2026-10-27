"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/content/themes";
import { computeStreak, todayLocal, weeklyPageCount, type ActivityMap } from "@/lib/reading/streak";
import { parseSettings, type AppSettings } from "@/lib/settings";

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
  const [error, setError] = useState<string | null>(null);
  const [busyTheme, setBusyTheme] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filter, setFilter] = useState<string>("Semua");
  const [lastStory, setLastStory] = useState<{ storyId: string; title: string; pageNumber: number } | null>(null);
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [activity, setActivity] = useState<ActivityMap>({});
  const [appSettings, setAppSettings] = useState<AppSettings>({ disabledThemes: [], weeklyTarget: 10 });

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json().catch(() => null);
        if (res.ok && data?.settings) setAppSettings(parseSettings(data.settings));
      } catch { /* default settings apply */ }
    })();
  }, []);
  const [downloadAllState, setDownloadAllState] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) { setActivity({}); return; }
    try { setActivity(JSON.parse(window.localStorage.getItem(`kanti.activity.${selectedId}`) ?? "{}") as ActivityMap); } catch { setActivity({}); }
  }, [selectedId]);

  async function handleDownloadAll() {
    setDownloadAllState("Menyiapkan semua cerita...");
    try {
      if (!("caches" in window)) throw new Error("unsupported");
      const res = await fetch("/api/themes");
      const data = await res.json();
      const urls: string[] = ["/", "/latihan", "/api/themes"];
      for (const theme of data.themes as { artUrls: string[] }[]) urls.push(...theme.artUrls);
      const cache = await caches.open("kanti-stories-v3");
      await cache.addAll(urls);
      setDownloadAllState(`Semua ${data.themes.length} cerita tersimpan untuk dibuka tanpa internet.`);
    } catch { setDownloadAllState("Belum bisa mengunduh semua cerita di peramban ini."); }
  }


  useEffect(() => {
    if (!selectedId) { setCompletedSlugs(new Set()); return; }
    void (async () => {
      try {
        const res = await fetch("/api/summary");
        const data = await res.json().catch(() => null);
        const entry = Array.isArray(data?.users) ? data.users.find((u: { user: { id: string } }) => u.user.id === selectedId) : null;
        setCompletedSlugs(new Set(entry ? (entry.badges as { slug: string }[]).map((b) => b.slug) : []));
      } catch { setCompletedSlugs(new Set()); }
    })();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) { setLastStory(null); return; }
    try {
      const raw = window.localStorage.getItem(`kanti.lastStory.${selectedId}`);
      setLastStory(raw ? (JSON.parse(raw) as { storyId: string; title: string; pageNumber: number }) : null);
    } catch { setLastStory(null); }
  }, [selectedId]);

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
  const visibleThemes = THEMES.filter((theme) => !appSettings.disabledThemes.includes(theme.slug)).filter((theme) => filter === "Semua" || THEME_KECAMATAN[theme.slug] === filter);
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
        <span className="flex gap-2">
          <Link href="/latihan" className="rounded-full border-2 border-amber-500 px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-500 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500">Latihan Kata</Link>
          <Link href="/ringkasan" className="rounded-full border-2 border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-800 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400">Ringkasan Bacaan</Link>
        </span>
      </nav>

      <section className="lux-panel mt-6 rounded-[2rem] px-5 py-8 sm:px-10 sm:py-12">
        <span className="gold-rule block h-1 w-16 rounded-full" aria-hidden="true" />
        <h1 className="font-display mt-5 max-w-2xl text-4xl leading-tight font-semibold sm:text-6xl">Kanti Baca Batang Hari</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-50">Cerita anak dari sungai, hutan, danau, pasar, dan sawah di Kabupaten Batang Hari. Baca dengan suara, dengarkan koreksi lembut, lalu ciptakan halaman berikutnya.</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="h-full rounded-2xl border border-white/20 bg-white/10 p-4">
              <span className="font-display flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-base font-bold text-emerald-950">{i + 1}</span>
              <h2 className="font-display mt-3 text-lg font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-emerald-50">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {selectedUser && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 font-medium text-emerald-950" aria-live="polite">
          <span className="flex-1">Siap membaca sebagai <strong>{selectedUser.childName}</strong> · {selectedUser.age} tahun · {selectedUser.subdistrict} · Level {selectedUser.readingLevel}. Sekarang pilih ceritanya di bawah. Misi minggu ini: {Math.min(weeklyPageCount(activity, todayLocal()), appSettings.weeklyTarget)} dari {appSettings.weeklyTarget} halaman · {computeStreak(Object.keys(activity), todayLocal())} hari beruntun.</span>
          {lastStory && (
            <button type="button" onClick={() => router.push(`/baca/${lastStory.storyId}`)} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400">
              Lanjutkan: {lastStory.title} (Halaman {lastStory.pageNumber})
            </button>
          )}
        </div>
      )}

      {error && (
        <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-amber-100 px-5 py-3.5 font-medium text-amber-900">
          <span className="flex-1">{error}</span>
          {loadFailed && <button type="button" onClick={() => { setError(null); setLoadingUsers(true); void loadUsers(); }} className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600">Coba Lagi</button>}
        </div>
      )}

      <section aria-label="Pilih cerita lewat peta Batang Hari" className="lux-card mt-8 overflow-hidden rounded-[1.75rem]">
        <div className="px-5 pt-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">Peta Petualangan Batang Hari</h2>
              <p className="mt-1 text-emerald-800">Ikuti sungai, ketuk tempat berwarna, lalu pilih ceritanya. Ayo berpetualang bersama Alif!</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">8 TEMPAT · 13 CERITA</span>
          </div>
        </div>
        <div className="relative mx-5 mt-5 h-[26rem] overflow-hidden rounded-[1.25rem] border border-emerald-900/10 bg-[#e8f6ec] sm:mx-6 sm:h-[28rem]">
          <svg viewBox="0 0 800 460" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
            <circle cx="712" cy="58" r="34" fill="#ffd93d" />
            <circle cx="712" cy="58" r="52" fill="#ffd93d" opacity="0.25" />
            <g fill="#ffffff" opacity="0.95">
              <ellipse className="map-cloud" cx="150" cy="58" rx="58" ry="20" />
              <ellipse className="map-cloud" cx="430" cy="38" rx="44" ry="16" />
              <ellipse className="map-cloud" cx="610" cy="105" rx="50" ry="17" />
            </g>
            <path d="M-20 330 C150 275, 260 355, 410 285 S660 165, 830 215" fill="none" stroke="#74c0fc" strokeWidth="42" strokeLinecap="round" opacity="0.8" />
            <path d="M-20 330 C150 275, 260 355, 410 285 S660 165, 830 215" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeDasharray="14 18" opacity="0.8" />
            <path d="M130 -20 C190 120, 145 245, 245 480" fill="none" stroke="#a5d8ff" strokeWidth="20" strokeLinecap="round" opacity="0.7" />
            <ellipse cx="672" cy="272" rx="72" ry="42" fill="#a5d8ff" opacity="0.85" />
            <g fill="#95d5a2" opacity="0.9">
              <circle cx="88" cy="150" r="64" /><circle cx="742" cy="392" r="70" /><circle cx="88" cy="408" r="56" />
            </g>
            <g className="map-boat">
              <path d="M352 292 h84 l-14 22 h-56 z" fill="#8a5a2b" />
              <rect x="388" y="256" width="7" height="36" fill="#6f4518" />
              <path d="M395 256 l30 28 h-30 z" fill="#ffffff" />
              <circle cx="382" cy="282" r="9" fill="#f4a261" />
            </g>
          </svg>
          {[
            { name: "Maro Sebo Ulu", left: "12%", top: "31%", color: "#40916c", icon: "M3 15h18l-2.2 4.5H6L3 15Zm9-9v8m0-8 5 5h-5" },
            { name: "Batin XXIV", left: "36%", top: "23%", color: "#2d6a4f", icon: "M12 2 18 10h-3.5L19 16H5l4.5-6H6L12 2Zm-1.2 14h2.4l.8 6h-4l.8-6Z" },
            { name: "Bajubang", left: "77%", top: "26%", color: "#bc6c25", icon: "M4 20 14 8l6 6M14 8v12M5 20h15M14 8l4.5-3.5" },
            { name: "Muara Bulian", left: "43%", top: "40%", color: "#065f46", icon: "M12 2 18 10h-3.5L19 16H5l4.5-6H6L12 2Zm-1.2 14h2.4l.8 6h-4l.8-6Z" },
            { name: "Muara Tembesi", left: "61%", top: "53%", color: "#9c6644", icon: "M4 21V9h3V6h3v3h4V6h3v3h3v12h-6v-5a2 2 0 0 0-4 0v5H4Z" },
            { name: "Mersam", left: "86%", top: "42%", color: "#bc4749", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0v4m6.5 2-3.5 2m3.5 7-3.5-2M5.5 20l3.5-2M5.5 9l3.5 2" },
            { name: "Maro Sebo Ilir", left: "79%", top: "70%", color: "#e07a5f", icon: "M4 17c-1.2-4.5 1.8-8 5.5-7C10.7 7.8 14 6.7 16 8l3.2-1.2L17.6 9.6c1.1 1.2 1.6 2.8 1 4.4-1 2.8-4.6 4.4-8.6 3.8L4 17Z" },
            { name: "Pemayung", left: "51%", top: "79%", color: "#7fb069", icon: "M12 22V10m0 0c0-4-3-6-7-7 0 4 3 7 7 7Zm0 0c0-4 3-6 7-7 0 4-3 7-7 7Zm0 6c0-4-3-6-7-7 0 4 3 7 7 7Zm0 0c0-4 3-6 7-7 0 4-3 7-7 7Z" },
          ].map((node, nodeIndex) => {
            const count = THEMES.filter((t) => THEME_KECAMATAN[t.slug] === node.name).length;
            const active = filter === node.name;
            return (
              <button
                key={node.name}
                type="button"
                onClick={() => { setFilter(node.name); document.getElementById("daftar-cerita")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                aria-pressed={active}
                aria-label={`${node.name}, ${count} cerita`}
                className="map-pin group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus:outline-none"
                style={{ left: node.left, top: node.top, animationDelay: `${nodeIndex * 0.35}s` }}
              >
                <span className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-white shadow-lg sm:h-16 sm:w-16 map-pin-icon ${active ? "ring-4 ring-amber-400" : ""}`} style={{ backgroundColor: node.color }}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={node.icon} /></svg>
                  <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-display text-sm font-bold text-emerald-950">{count}</span>
                </span>
                <span className={`mt-1.5 rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap shadow-sm sm:text-xs ${active ? "bg-emerald-800 text-white" : "bg-white/95 text-emerald-900"}`}>{node.name}</span>
              </button>
            );
          })}
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800">Sungai Batanghari mengalir dari hulu ke hilir</span>
          <span className="absolute right-3 bottom-3 z-10 hidden rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white sm:block">Ketuk penanda untuk melihat ceritanya</span>
        </div>
        {filter !== "Semua" && filter !== "Semua Wilayah" && (
          <div className="px-5 py-5 sm:px-6" aria-live="polite">
            <h3 className="font-display text-xl font-semibold text-emerald-950">Cerita dari {filter}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {visibleThemes.map((theme) => (
                <article key={theme.slug} className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/60 px-4 py-3">
                  <span className="h-10 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: theme.palette.accent }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="font-display block truncate text-lg font-semibold text-emerald-950">{theme.title}</span>
                    <span className="block truncate text-sm text-emerald-700">{theme.subtitle}</span>
                  </span>
                  <button type="button" disabled={!selectedId || busyTheme !== null} onClick={() => void handleStart(theme.slug)} className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40">
                    {busyTheme === theme.slug ? "Membuat..." : "Mulai Baca"}
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[380px_1fr]">
        <section aria-label="Siapa yang membaca" className="lux-card rounded-[1.75rem] p-5 sm:p-6 lg:sticky lg:top-6">
          <p className="text-xs font-bold tracking-wide text-amber-600">MODE ANAK</p>
          <h2 className="font-display mt-1 text-2xl font-semibold text-emerald-950">Siapa yang Membaca?</h2>
          <p className="mt-1 text-sm text-emerald-700">Ketuk namamu untuk mulai. Pendaftaran dan pengaturan ada di area orang tua.</p>
          {loadingUsers ? (
            <p className="mt-4 text-emerald-700">Memuat nama...</p>
          ) : users.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-4">
              <p className="font-medium text-emerald-900">Belum ada anak terdaftar di perangkat ini.</p>
              <Link href="/daftar" className="mt-3 inline-block rounded-full bg-emerald-700 px-5 py-2.5 font-display font-semibold text-white hover:bg-emerald-800">Daftarkan Anak (Orang Tua)</Link>
            </div>
          ) : (
            <ul className="mt-4 grid gap-3">
              {users.map((user) => {
                const selected = user.id === selectedId;
                return (
                  <li key={user.id}>
                    <button type="button" onClick={() => selectUser(user.id)} aria-pressed={selected} className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-900/10 bg-white hover:border-emerald-600"}`}>
                      <span className={`font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${selected ? "bg-amber-400 text-emerald-950" : "bg-emerald-100 text-emerald-800"}`} aria-hidden="true">{user.childName.trim().charAt(0).toUpperCase() || "A"}</span>
                      <span className="min-w-0">
                        <span className="font-display block truncate text-xl font-semibold">{user.childName}</span>
                        <span className={`text-sm ${selected ? "text-emerald-50" : "text-emerald-700"}`}>{user.age} tahun · {user.subdistrict} · {user.readingLevel}</span>
                        {selected && <span className="block text-sm font-semibold text-amber-300">Kamu dipilih - pilih cerita di samping</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-6 space-y-2 border-t border-emerald-900/10 pt-4 text-sm">
            <Link href="/daftar" className="block font-semibold text-emerald-700 hover:text-emerald-900">Daftarkan anak baru (orang tua)</Link>
            <Link href="/admin" className="block font-semibold text-emerald-700 hover:text-emerald-900">Admin Pemilik</Link>
          </div>
        </section>
        <section aria-label="Pilih tema cerita" id="daftar-cerita" className="scroll-mt-6">
          <p className="text-xs font-bold tracking-wide text-amber-600">LANGKAH 2</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-emerald-950">Pilih Cerita Batang Hari</h2>
            <p className="text-sm font-medium text-emerald-700">{visibleThemes.length} cerita · masing-masing 6 halaman</p>
          </div>
          {!selectedId && <p className="mt-3 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-medium text-amber-900">Buat atau pilih profil anak dulu di Langkah 1 agar tombol Mulai Baca aktif.</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => void handleDownloadAll()} className="rounded-full bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400">Unduh Semua Cerita</button>
            {downloadAllState && <span className="text-sm font-medium text-emerald-800" aria-live="polite">{downloadAllState}</span>}
          </div>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Saring cerita per kecamatan">
            {FILTERS.map((name) => (
              <button key={name} type="button" data-active={filter === name} aria-pressed={filter === name} onClick={() => setFilter(name)} className="chip-filter rounded-full px-4 py-2 text-sm font-semibold">{name}</button>
            ))}
          </div>

          <div className="mt-5 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleThemes.map((theme) => (
              <article key={theme.slug} className="lux-card flex h-full flex-col overflow-hidden rounded-[1.5rem]">
                <div className="flex h-52 flex-col px-5 pt-5" style={{ backgroundColor: theme.palette.sky }}>
                  <span className="gold-rule block h-1 w-12 shrink-0 rounded-full" aria-hidden="true" />
                  <h3 className="font-display mt-3 line-clamp-2 text-2xl leading-snug font-semibold text-emerald-950">{theme.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-emerald-800">{theme.subtitle}</p>
                </div>
                <div className="flex flex-1 flex-col px-5 py-4">
                  <p className="flex h-7 flex-nowrap items-center gap-2 overflow-hidden text-xs font-bold text-emerald-700">
                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 whitespace-nowrap">6 HALAMAN</span>
                    <span className="truncate rounded-full bg-amber-50 px-3 py-1 whitespace-nowrap text-amber-700">{THEME_KECAMATAN[theme.slug].toUpperCase()}</span>
                    {completedSlugs.has(theme.slug) && <span className="shrink-0 rounded-full bg-emerald-700 px-3 py-1 whitespace-nowrap text-white">SUDAH TAMAT</span>}
                  </p>
                  <p className="mt-3 text-sm text-emerald-700">Sekitar {theme.pages.reduce((total, page) => total + page.text.split(/\s+/).filter(Boolean).length, 0)} kata bacaan</p>
                  <span className="min-h-4 flex-1" aria-hidden="true" />
                  <button type="button" disabled={!selectedId || busyTheme !== null} onClick={() => void handleStart(theme.slug)} className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-display text-base font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40">
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
