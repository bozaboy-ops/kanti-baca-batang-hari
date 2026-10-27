# BaccaAI — Kanti Baca Batang Hari — Design

**Spec:** `D:\aplikasi untuk meta.md` (PRD BaccaAI, Meta Global AI Developer Hackathon, 26 Okt-4 Nov 2026)
**Status:** Draft for user approval. No product code until approved.
**Product location:** `D:\bacca-ai` — project, database, storage, env, and backups all on drive D only.

## Intent

Bantu anak SD usia 6-10 tahun di Kabupaten Batang Hari berlatih membaca keras
dalam Bahasa Indonesia lewat cerita lokal Bumi Serentak Bak Regam. Anak membaca,
aplikasi mendengarkan, memberi koreksi lembut per suku kata tanpa menghakimi
aksen Melayu Jambi, lalu anak menentukan kelanjutan cerita dengan suaranya dan
halaman baru beserta ilustrasinya muncul saat itu juga.

Pengguna: anak (HP Android orang tua, entry-level), orang tua (mengubah screen
time pasif menjadi belajar aktif), guru SD/penggerak literasi (alat mulok dan
pantau perkembangan).

## Goals (all of the PRD)

1. Katalog 4 tema: Sungai Batanghari, Tahura Senami (Sultan Thaha Syaifuddin),
   Benteng Tembesi & Danau Letang, Kuliner & Tradisi Lokal.
2. Alur inti Read-Listen-Imagine-Generate: halaman buku huruf besar ramah anak,
   baca keras dengan kata menyala hijau, koreksi "Kanti Baca" per suku kata,
   pertanyaan imajinasi di akhir halaman, halaman baru instan.
3. Orkestrasi Meta: Voice Transcribe -> Muse Spark (evaluator + pendongeng +
   prompt director, kontrak JSON ketat PRD 6.2) -> Muse Image.
4. Profil anak (nama, usia, kecamatan Batang Hari, level Pemula/Lancar),
   cerita dan halaman tersimpan, skor akurasi dan kata sulit tercatat.
5. Ringkasan perkembangan untuk orang tua/guru: riwayat cerita, skor per
   halaman, kata yang sering sulit.
6. Mode Hemat Kuota Desa: audio WebM/Opus bit-rate rendah, gambar WebP dengan
   blur-up placeholder, PWA ringan (manifest + offline shell), mobile-first.

## Non-goals / anti-goals

- Bukan aplikasi native; web/PWA saja.
- Tidak ada login akun dewasa, pembayaran, atau hosting awan pada versi ini.
- Tanpa kunci Meta, aplikasi tidak boleh mati: mode fallback lokal wajib
  membuat seluruh alur tetap bisa didemokan (keputusan pengguna 27 Okt 2026).
- Menghakimi aksen Melayu Jambi sebagai kesalahan adalah kegagalan produk.

## Constraints

- Stack PRD: Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL +
  Drizzle ORM.
- Semua data di drive D komputer ini: kode `D:\bacca-ai`, cluster PostgreSQL
  khusus aplikasi di `D:\bacca-ai\pgdata` (port 5433, terpisah dari service
  PostgreSQL 17 bawaan di port 5432), file hasil generate di
  `D:\bacca-ai\storage`, backup di `D:\bacca-ai\backups`, rahasia hanya di
  `D:\bacca-ai\.env.local` (tidak masuk git).
- Palet PRD: hijau Bulian #10B981/#065F46, putih #FFFFFF, emas Jambi
  #F59E0B; tipografi Plus Jakarta Sans / Fredoka; tombol rekam besar bawah.
- Node v24.22.1, npm 11.19.1, biner PostgreSQL 17 tersedia di
  `C:\Program Files\PostgreSQL\17\bin`.
- Kunci Meta belum ada. Kontrak provider tidak boleh bocor ke UI: satu adapter
  MetaProvider dengan implementasi HttpMetaProvider (aktif bila env
  META_VOICE_TRANSCRIBE_URL, META_SPARK_URL, META_IMAGE_URL + token ada)
  dan LocalFallbackProvider (default tanpa kunci).

## Approaches considered

1. **Next.js + PostgreSQL cluster D + Meta adapter with local fallback
   (dipilih pengguna, dengan fallback karena kunci belum ada).** Persis stack
   dan kontrak PRD; demo tetap jalan tanpa kunci; saat kunci Meta tiba,
   cukup isi .env.local, tanpa ubah UI/API. Biaya: harus mengelola cluster
   Postgres lokal sendiri.
2. Next.js + PostgreSQL + Meta wajib tanpa fallback. Paling murni, tetapi
   hari ini tidak bisa didemokan sama sekali karena kunci belum ada.
   Ditolak oleh fakta, bukan selera.
3. PWA statis vanilla + penyimpanan browser. Paling ringan, tetapi membuang
   stack PRD, Drizzle/PostgreSQL, dan orkestrasi server; sulit naik kelas.
   Ditolak pengguna.

## Architecture (keputusan)

- `app/` Next.js: `/` beranda+profil anak, `/tema` katalog, `/baca/[storyId]`
  pembaca buku, `/ringkasan` dashboard orang tua/guru, `/api/*` route handler.
- `lib/meta/` adapter provider: `transcribe(audio)`, `evaluateAndContinue(input)`
  mengembalikan JSON persis PRD 6.2, `generateImage(prompt)`. Fallback lokal:
  transkripsi dari Web Speech API id-ID di browser (atau ketik bila tidak
  didukung), evaluator heuristik kata-per-kata toleran aksen (normalisasi
  ejaan Melayu Jambi umum, mis. akhiran -o), ilustrasi SVG storybook lokal
  yang digenerate per tema+prompt dan disimpan sebagai file di storage.
- `lib/db/` Drizzle schema sesuai PRD 6.3: `users`, `stories`, `story_pages`
  (kolom PRD apa adanya; `theme_slug` mencakup 4 tema katalog 5.1).
- Perekaman `MediaRecorder` WebM/Opus; kata target dibandingkan token
  transkrip untuk highlight hijau; evaluasi disimpan per halaman.
- Service worker + manifest: shell offline, aset tema lokal, gambar blur-up.

## Data flow (satu halaman)

Baca keras -> audio+teks target ke `/api/evaluate` -> provider mengembalikan
JSON 6.2 -> UI menampilkan skor, praise, kartu suku kata -> anak menjawab
pertanyaan imajinasi -> `/api/continue` -> halaman baru + gambar disimpan
(`story_pages`, file storage) -> buku maju; ringkasan membaca dari DB.

## Failure behavior

- Mikrofon ditolak/tidak ada: mode ketik jawaban selalu tersedia.
- Speech recognition tidak didukung: ketik yang dibaca, evaluasi tetap jalan.
- Meta HTTP gagal/timeout: otomatis fallback lokal, banner kecil "mode demo
  lokal"; tidak ada layar error untuk anak.
- Gambar gagal: placeholder blur tema tetap tampil, teks cerita tidak hilang.
- DB mati: API mengembalikan 503 JSON jelas; UI anak menampilkan pesan ramah
  dan tombol coba lagi; tidak ada data ditulis ke C atau awan sebagai pelarian.

## Testing

- Unit: evaluator toleransi aksen, pemecah suku kata, validasi JSON 6.2,
  pemetaan tema.
- Integrasi: route evaluate/continue dengan provider fallback, tulis-baca
  Drizzle ke cluster D.
- E2E manual/demo: skenario PRD 7 (baca terbata -> koreksi; jawab imajinasi
  "gajah Sumatera kecil membawa lentera" -> halaman 2 bergambar).

## Calls made by the builder (to check while reading)

- Port Postgres aplikasi 5433 dan cluster sendiri di D agar janji "data di D
  saja" benar secara fisik, bukan sekadar folder proyek.
- Tema ke-4 `kuliner-tradisi` dimasukkan walau contoh slug 6.3 hanya 3,
  karena katalog 5.1 mendaftar 4 tema.
- Fallback ilustrasi berupa SVG lokal, bukan gambar stok unduhan, agar demo
  offline dan hemat kuota.

## Amendment — keputusan builder hasil builder-check (27 Okt 2026)

Keputusan berikut mengikat implementasi agar tidak ada tebakan. Yang ditandai
"owner" sengaja TIDAK diputuskan karena buktinya belum ada.

- **Kontrak Meta nyata = owner (belum ada kunci/dokumentasi).** Sampai kunci
  tiba, `HttpMetaProvider` mengimplementasikan kontrak generik terdokumentasi:
  POST JSON ke env URL masing-masing, `Authorization: Bearer $META_API_TOKEN`
  (satu token bersama), output Spark wajib JSON PRD 6.2. Provider HTTP nonaktif
  secara default; fallback lokal adalah jalur yang diuji. Mengaktifkan Meta
  asli adalah tugas konfigurasi terpisah setelah dokumentasi resmi diterima,
  bukan tebakan hari ini.
- **Satu kontrak, dua route.** `/api/evaluate` dan `/api/continue` sama-sama
  mengonsumsi/menghasilkan JSON PRD 6.2: evaluate mengisi
  `reading_evaluation`, continue mengisi `next_story_segment` +
  `muse_image_prompt`. Method POST; error `{ "error": string }` dengan
  400 untuk input tidak valid, 503 untuk DB mati, 200 fallback lokal dengan
  field `"provider": "local-fallback"`.
- **Skema diperluas (menambal PRD 6.3 agar datanya tidak hilang):** semua `id`
  uuid PK; `stories.user_id` FK, `story_pages.story_id` FK; `created_at`
  timestamptz default now; `users.age` integer 6-10 (ditegakkan); `subdistrict`
  enum 8 kecamatan PRD: Muara Bulian, Muara Tembesi, Maro Sebo Ulu, Maro Sebo
  Ilir, Batin XXIV, Pemayung, Bajubang, Mersam; tambah di `story_pages`:
  `tricky_words jsonb`, `praise_message text`, `interactive_question text`,
  `muse_image_prompt text`. Audio anak TIDAK disimpan sebagai file; hanya
  transkrip yang disimpan (privasi anak + hemat kuota).
- **Identitas tanpa login:** profil anak per perangkat lokal ini; boleh banyak
  profil; `/ringkasan` terbuka lokal tanpa PIN (demo lokal D), menampilkan
  semua profil; hapus profil menghapus cerita+halaman anak itu.
- **Pedagogi terukur:** `accuracy_score` = kata benar / total kata target x
  100 (pembulatan); kata target yang hilang/salah masuk `tricky_words` (maks 3,
  urutan kemunculan); suku kata heuristik vokal Indonesia + kamus pengecualian
  nama lokal (Tem-be-si, Bu-li-an, Se-na-mi, Ba-tang-ha-ri); toleransi aksen:
  normalisasi akhiran -o -> -a dan e->a lemah hanya untuk pencocokan, tidak
  untuk menilai salah; reading_level Pemula = kalimat <=6 kata/halaman awal,
  Lancar = <=12 kata.
- **Konten seed ditulis builder:** 4 tema x 1 cerita pembuka, halaman 1-2
  tetap, karakter konsisten "Alif" (PRD memakai Budi dan Alif bergantian;
  dipilih Alif dari contoh cerita lanjutan PRD). Cerita berlanjut tanpa batas
  halaman lewat continue; tombol "Selesai" mengakhiri ke ringkasan.
- **Ringkasan terdefinisi:** per anak: jumlah cerita, rata-rata skor, daftar
  kata sulit dengan frekuensi >=2 sebagai "sering sulit", riwayat halaman.
  Tanpa ekspor pada versi ini.
- **Kinerja hemat kuota terukur:** gambar fallback SVG < 50 KB, placeholder
  blur CSS; audio dibatasi 30 detik per bacaan; timeout Meta 20 detik lalu
  fallback.
- **Perangkat uji:** Chrome Android modern sebagai target demo; browser tanpa
  Web Speech/MediaRecorder WebM memakai mode ketik (didukung resmi, bukan
  di luar scope).
- **Rilis:** lokal di D saja untuk sekarang (keputusan pengguna); URL publik
  untuk submission adalah keputusan owner terpisah nanti.
