# Deploy BaccaAI ke kantibaca.store (VPS Batang Hari, aaPanel)

Metode aktual: **native mengikuti pola aplikasi lain di server ini** — systemd
`bh-kantibaca.service` + nginx vhost `bh-kantibaca.conf` + PostgreSQL 17 lokal.
Artefak `Dockerfile`/`docker-compose.yml`/`Caddyfile` di repo ini TIDAK dipakai
di VPS ini (tidak ada Docker; port 80/443 milik nginx aaPanel bersama ±26 app
Pemkab) — dipertahankan sebagai alternatif untuk server kosong.

## Peta deploy aktual (2026-10-28)

| Komponen | Lokasi di VPS |
| --- | --- |
| Kode app | `/www/apps/kantibaca/app` (git clone `kanti-baca-batang-hari`, commit `219556d`) |
| Service | `/etc/systemd/system/bh-kantibaca.service`, user `app-kantibaca`, `127.0.0.1:4250` |
| Env (600) | `/www/apps/kantibaca/service.env` (`DATABASE_URL`, `APP_STORAGE_DIR=/www/apps/kantibaca/shared/storage`) |
| Database | PostgreSQL 17 port 5432, db `bacca_ai`, role `bacca` (terpisah dari db app lain) |
| Nginx vhost | `/www/server/panel/vhost/nginx/bh-kantibaca.conf` (HTTP-only sampai TLS terbit) |
| Node | `/www/server/nodejs/v24.21.0/bin/node` |
| Backup | `/usr/local/bin/bh-kantibaca-backup.sh` + `/etc/cron.d/bh-kantibaca-backup` (02:15, retensi 14 hari di `/www/backups/apps/kantibaca/`) |

## Status 2026-10-28: LIVE di https://kantibaca.store

Terverifikasi dari internet publik (validasi sertifikat penuh, tanpa `-k`):

- `https://kantibaca.store/` → 200 (judul "Kanti Baca Batang Hari - Tutor Membaca Anak Batang Hari")
- `https://kantibaca.store/api/themes` → 200, JSON 13 tema + `artUrls`
- `http://kantibaca.store/` → 301 ke `https://kantibaca.store/`
- `https://www.kantibaca.store/` → 301 ke apex
- Sertifikat Let's Encrypt `CN = kantibaca.store`, berlaku s/d 26 Jan 2027,
  renewal otomatis aktif (certbot timer)
- Backup harian 02:15, pertama `bacca_ai-2026-10-28-0852.sql`

Riwayat: CDN/proxy Hostinger sempat mencegat traffic (halaman parkir +
gagal HTTP-01 dua kali) — sembuh setelah pemilik mematikan Proxy/CDN di
hPanel (DNS-only ke `123.253.54.89`), lalu sertifikat terbit sekali jalan.

## Update & rollback (di VPS)

```bash
cd /www/apps/kantibaca/app
git pull --ff-only
export PATH=/www/server/nodejs/v24.21.0/bin:$PATH
NODE_ENV=development npm ci --include=dev --no-audit --no-fund
rm -rf .next   # cache Turbopack basi pernah menggagalkan build
set -a; . /www/apps/kantibaca/service.env; set +a
npm run build
node scripts/migrate.mjs
systemctl restart bh-kantibaca
```

Rollback: `git checkout <commit-lama>` lalu ulangi build + restart di atas.
Jangan `DROP` database — migrasi idempotent dan hanya menambah kolom/tabel.

## Pelajaran build di server ini

- `npm ci` di bawah `NODE_ENV=production` menghilangkan devDependencies
  (`@tailwindcss/postcss`) sehingga build Next gagal — install dengan
  `NODE_ENV=development npm ci --include=dev`.
