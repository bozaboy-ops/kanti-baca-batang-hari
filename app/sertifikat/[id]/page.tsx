"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface StoryData { id: string; title: string; themeSlug: string; userId: string; stars: number | null; completedAt: string | null }
interface UserData { id: string; childName: string }

export default function SertifikatPage() {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryData | null>(null);
  const [childName, setChildName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/stories/${params.id}`);
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error ?? "Sertifikat belum bisa dibuka");
        setStory(data.story as StoryData);
        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json().catch(() => null);
        const found = Array.isArray(usersData?.users) ? (usersData.users as UserData[]).find((u) => u.id === (data.story as StoryData).userId) : null;
        setChildName(found?.childName ?? "Pembaca Kecil");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sertifikat belum bisa dibuka");
      }
    })();
  }, [params.id]);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
        <p role="alert" className="rounded-2xl bg-amber-100 px-4 py-3 font-medium text-amber-900">{error}</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-emerald-700 px-5 py-2.5 font-semibold text-white">Kembali ke Beranda</Link>
      </main>
    );
  }
  if (!story) return <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center text-emerald-800">Menyiapkan sertifikat...</main>;

  const dateText = story.completedAt ? new Date(story.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <section className="lux-card rounded-[2rem] border-4 border-double border-amber-500 px-6 py-10 text-center sm:px-12" aria-label="Sertifikat tamat cerita">
        <span className="gold-rule mx-auto block h-1.5 w-24 rounded-full" aria-hidden="true" />
        <p className="mt-5 text-sm font-bold tracking-wide text-amber-600 uppercase">Sertifikat Kanti Baca Batang Hari</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-emerald-950 sm:text-5xl">Selamat, {childName}!</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-emerald-800">
          Telah menamatkan cerita <strong>{story.title}</strong> dari Bumi Serentak Bak Regam, Kabupaten Batang Hari.
        </p>
        <p className="mt-5 flex items-center justify-center gap-1.5" aria-label={`Bintang ${story.stars ?? 1} dari 3`}>
          {[1, 2, 3].map((star) => (
            <svg key={star} viewBox="0 0 24 24" className={`h-11 w-11 ${star <= (story.stars ?? 1) ? "text-amber-500" : "text-emerald-100"}`} fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
          ))}
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-emerald-900">{story.stars ?? 1} dari 3 Bintang</p>
        <p className="mt-5 text-emerald-700">Batang Hari, {dateText}</p>
        <p className="mt-1 text-sm text-emerald-600">Terus membaca, terus bercerita.</p>
      </section>
      <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="rounded-full bg-emerald-700 px-6 py-3 font-display text-lg font-semibold text-white hover:bg-emerald-800">Cetak / Simpan Sertifikat</button>
        <Link href="/ringkasan" className="rounded-full border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 hover:bg-emerald-50">Lihat Ringkasan</Link>
        <Link href="/" className="rounded-full border-2 border-amber-500 px-6 py-3 font-semibold text-amber-700 hover:bg-amber-50">Baca Cerita Lain</Link>
      </div>
    </main>
  );
}