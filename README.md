# BaccaAI — Kanti Baca Batang Hari

Tutor membaca dan cerita interaktif untuk anak SD usia 6–10 tahun di Kabupaten
Batang Hari, Jambi. Anak membaca cerita lokal dengan suara keras, mendapat
koreksi lembut per suku kata dari "Kanti Baca", lalu menentukan kelanjutan
cerita dengan imajinasinya dan halaman baru beserta ilustrasinya muncul.

Dibangun dari PRD `D:\aplikasi untuk meta.md` (Meta Global AI Developer
Hackathon, jalur Indie Developer, tema Build for Your World).

## Menjalankan (semua di drive D)

```powershell
cd D:\bacca-ai
powershell -File scripts\db-init.ps1   # pertama kali: buat + start cluster Postgres aplikasi
powershell -File scripts\db-start.ps1  # start saja bila sudah pernah dibuat
node scripts\migrate.mjs               # buat tabel (idempotent)
npm run dev                            # http://localhost:3000
```

Untuk mode produksi: `npm run build` lalu `npm run start`.

Menghentikan database aplikasi: `powershell -File scripts\db-stop.ps1`

## Di mana data disimpan (hanya drive D)

| Isi | Lokasi |
| --- | --- |
| Kode aplikasi | `D:\bacca-ai` |
| Database PostgreSQL aplikasi (port 5433, terpisah dari service Postgres bawaan port 5432) | `D:\bacca-ai\pgdata` |
| Ilustrasi hasil generate | `D:\bacca-ai\storage` |
| Rahasia & konfigurasi lokal (tidak masuk git) | `D:\bacca-ai\.env.local` |
| Backup | `D:\bacca-ai\backups` |

Audio anak **tidak pernah disimpan** sebagai berkas — hanya transkrip teksnya
yang masuk database, demi privasi anak dan hemat kuota.

Backup database:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h 127.0.0.1 -p 5433 -U bacca -d bacca_ai -f D:\bacca-ai\backups\bacca_ai.sql
```

## Mode Meta: fallback lokal vs Meta asli

Saat ini aplikasi berjalan dalam **mode demo lokal** (`provider: "local-fallback"`):

- Transkripsi: Web Speech API `id-ID` di peramban (atau ketik manual).
- Evaluasi membaca: heuristik lokal yang toleran logat Melayu Jambi
  (akhiran -o tidak dinilai salah) dengan koreksi per suku kata.
- Cerita lanjutan + prompt gambar: templat lokal berkonteks Batang Hari.
- Ilustrasi: SVG storybook lokal per tema, disimpan di `storage`.

Seluruh alur memakai kontrak JSON yang sama dengan PRD §6.2, jadi
mengaktifkan Meta asli nanti tidak mengubah UI/API:

1. Dapatkan dokumentasi & kunci resmi Meta Model API (Voice Transcribe,
   Muse Spark, Muse Image).
2. Isi di `D:\bacca-ai\.env.local`: `META_VOICE_TRANSCRIBE_URL`,
   `META_SPARK_URL`, `META_IMAGE_URL`, `META_API_TOKEN`.
3. Sesuaikan pemetaan request/response di `lib/meta/provider.ts` mengikuti
   dokumentasi resmi tersebut. Sampai langkah ini dilakukan, provider HTTP
   adalah kerangka yang tidak aktif — aplikasi **tidak** mengklaim sudah
   terhubung ke Meta.

## Alur penggunaan

1. Beranda: buat profil anak (nama, usia 6–10, kecamatan, level membaca),
   pilih satu dari 4 tema cerita Bumi Serentak Bak Regam.
2. Halaman baca: tekan tombol mikrofon besar, baca dengan suara keras —
   kata yang benar menyala hijau. Tanpa mikrofon/suara, ketik manual.
3. Periksa Bacaan: skor, pujian Kanti, dan kartu suku kata untuk kata sulit.
4. Jawab pertanyaan imajinasi Kanti (suara/ketik), buat halaman baru.
5. `/ringkasan`: perkembangan per anak untuk orang tua/guru — jumlah cerita,
   rata-rata skor, kata yang sering sulit, riwayat halaman.

## Skenario demo 2 menit (PRD §7)

- 0:00 Buka beranda, jelaskan konteks Batang Hari.
- 0:25 Baca halaman 1 tema Hutan Senami dengan satu kata terbata; tunjukkan
  transkripsi dan koreksi suku kata Kanti.
- 1:00 Jawab pertanyaan imajinasi: "gajah Sumatera kecil yang membawa
  lentera"; tunjukkan langkah Voice Transcribe → Muse Spark → Muse Image
  dan halaman 2 bergambar.
- 1:40 Buka `/ringkasan`, tutup dengan dampak literasi + kearifan lokal.

## Pengujian

```powershell
npm test        # vitest: evaluator, provider, validasi API, highlight, recorder
npm run build
```

## Struktur singkat

- `app/` — halaman (`/`, `/baca/[id]`, `/ringkasan`) dan route API.
- `lib/reading/evaluate.ts` — evaluator toleran aksen + pemecah suku kata.
- `lib/content/themes.ts` — 4 tema & cerita pembuka Batang Hari.
- `lib/meta/` — adapter provider Meta (fallback lokal + kerangka HTTP) dan
  generator ilustrasi SVG.
- `lib/db/` — skema Drizzle (`users`, `stories`, `story_pages`).