"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const KECAMATAN = ["Muara Bulian", "Muara Tembesi", "Maro Sebo Ulu", "Maro Sebo Ilir", "Batin XXIV", "Pemayung", "Bajubang", "Mersam"] as const;

export default function DaftarPage() {
  const router = useRouter();
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("7");
  const [subdistrict, setSubdistrict] = useState<string>(KECAMATAN[0]);
  const [readingLevel, setReadingLevel] = useState("Pemula");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [doneName, setDoneName] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName, age: Number(age), subdistrict, readingLevel, parentName, parentPhone }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Pendaftaran belum bisa disimpan");
      window.localStorage.setItem("bacca.currentUserId", data.user.id as string);
      setDoneName(data.user.childName as string);
      setDoneId(data.user.id as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran belum bisa disimpan");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1.5 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-emerald-950 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  if (doneName) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
        <section className="lux-card rounded-[2rem] px-6 py-10 text-center">
          <span className="gold-rule mx-auto block h-1.5 w-20 rounded-full" aria-hidden="true" />
          <h1 className="font-display mt-5 text-4xl font-semibold text-emerald-950">Pendaftaran Berhasil</h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-emerald-800">Selamat datang, <strong>{doneName}</strong>. Profil anak sudah tersimpan dan terpilih. Sekarang ajak anak memilih cerita pertamanya.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => router.push("/")} className="rounded-full bg-emerald-700 px-6 py-3 font-display text-lg font-semibold text-white hover:bg-emerald-800">Mulai Membaca</button>
            <button type="button" onClick={() => { setDoneName(null); setDoneId(null); setChildName(""); }} className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50">Daftarkan Anak Lain</button>
          </div>
          {doneId && <p className="mt-4 text-sm text-emerald-600">Kode profil tersimpan di perangkat ini.</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <header className="lux-panel rounded-[2rem] px-6 py-8 sm:px-8">
        <span className="gold-rule block h-1 w-14 rounded-full" aria-hidden="true" />
        <h1 className="font-display mt-4 text-4xl font-semibold">Daftarkan Anak untuk Membaca</h1>
        <p className="mt-2 text-lg text-emerald-50">Untuk orang tua: isi data ini sekali. Setelah itu anak tinggal memilih namanya dan mulai membaca.</p>
      </header>

      <form onSubmit={handleSubmit} className="lux-card mt-6 space-y-7 rounded-[1.75rem] p-6 sm:p-8">
        <fieldset>
          <legend className="font-display text-xl font-semibold text-emerald-950">Data Orang Tua</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-emerald-900">Nama orang tua
              <input value={parentName} onChange={(e) => setParentName(e.target.value)} required placeholder="Contoh: Ibu Sari" className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Nomor HP / WA (boleh kosong)
              <input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} inputMode="tel" placeholder="08..." className={inputClass} />
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-display text-xl font-semibold text-emerald-950">Data Anak</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-emerald-900">Nama anak
              <input value={childName} onChange={(e) => setChildName(e.target.value)} required placeholder="Contoh: Alif" className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Usia (6-10 tahun)
              <input value={age} onChange={(e) => setAge(e.target.value)} type="number" min={6} max={10} step={1} required className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Kecamatan tempat tinggal
              <select value={subdistrict} onChange={(e) => setSubdistrict(e.target.value)} className={inputClass}>
                {KECAMATAN.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-emerald-900">Level membaca anak
              <select value={readingLevel} onChange={(e) => setReadingLevel(e.target.value)} className={inputClass}>
                <option value="Pemula">Pemula - baru belajar membaca</option>
                <option value="Lancar">Lancar - sudah bisa membaca kalimat</option>
              </select>
            </label>
          </div>
        </fieldset>
        {error && <p role="alert" className="rounded-xl bg-amber-100 px-4 py-3 font-medium text-amber-900">{error}</p>}
        <button type="submit" disabled={saving} className="w-full rounded-2xl bg-emerald-700 px-5 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40">
          {saving ? "Menyimpan..." : "Daftarkan & Mulai Membaca"}
        </button>
        <p className="text-center text-sm text-emerald-700">Data tersimpan di aplikasi Kanti Baca Batang Hari pada perangkat ini.</p>
      </form>
      <p className="mt-5 text-center"><Link href="/" className="font-semibold text-emerald-700 hover:text-emerald-900">Kembali ke Beranda</Link></p>
    </main>
  );
}