# ProjectMatch

![Logo ProjectMatch](public/brand/horizontal.svg)

**Temukan rekan. Bentuk tim. Wujudkan ide.**

ProjectMatch adalah platform kolaborasi untuk pelajar dan mahasiswa Indonesia yang ingin membangun proyek atau mengikuti kompetisi bersama. Ide dan kemampuan sering kali sudah ada, tetapi mencari rekan dengan peran, waktu, dan tujuan yang sesuai masih bergantung pada lingkaran pertemanan sendiri.

ProjectMatch memperluas kesempatan tersebut melalui pencarian proyek lintas sekolah dan kampus, pengajuan anggota yang terstruktur, serta pengelolaan tim dari rekrutmen hingga proyek selesai.

## Fitur Utama

- **Jelajah proyek:** cari dan saring peluang berdasarkan kategori, peran, mode kolaborasi, komitmen waktu, dan lokasi.
- **Profil kolaborator:** tampilkan institusi, peran, portofolio, riwayat proyek, dan skor komitmen. Nama peran dapat ditulis sendiri; katalog hanya memberi saran.
- **Verifikasi pelajar dan mahasiswa:** verifikasi melalui email akademik atau dokumen yang ditinjau admin. Akun terverifikasi dapat membuat proyek dan mengajukan diri sebagai anggota.
- **Rekrutmen terarah:** tentukan posisi, kuota anggota, jenjang pendidikan, dan jangkauan peserta; tinjau lalu terima atau tolak pengajuan.
- **Pengelolaan kolaborasi:** kelola anggota, status proyek, serta informasi pertemuan daring, luring, atau hybrid. Detail pertemuan tersedia untuk pemilik dan anggota yang diterima.
- **Rekam jejak kerja sama:** selesaikan proyek dan berikan penilaian komitmen serta umpan balik kepada rekan tim.
- **Administrasi dan pelaporan:** laporkan proyek, tinjau dokumen verifikasi, dan kelola data melalui panel admin.

## Alur Penggunaan

1. Daftar akun, lengkapi profil, dan lakukan verifikasi.
2. Jelajahi proyek lalu ajukan diri pada posisi yang sesuai, atau buat proyek dan buka rekrutmen.
3. Pemilik proyek meninjau pengajuan dan membentuk tim.
4. Anggota mengakses informasi pertemuan dan menjalankan kolaborasi.
5. Setelah proyek selesai, berikan penilaian rekan tim untuk membangun rekam jejak kolaborasi.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Aplikasi | Next.js 16 App Router, React 19, TypeScript |
| Antarmuka | Tailwind CSS 4, Plus Jakarta Sans, Remix Icon |
| Basis data | PostgreSQL, Prisma ORM 7 |
| Autentikasi | Supabase Auth |
| Penyimpanan gambar | Cloudinary |
| Email verifikasi akademik | Resend |
| Validasi dan pengujian | Zod, Vitest, ESLint |

## Menjalankan Secara Lokal

Siapkan **Node.js 22 (minimal 22.12) atau 24**, npm, basis data PostgreSQL, serta akun Supabase, Cloudinary, dan Resend untuk mencoba seluruh fitur.

### 1. Instalasi

Jalankan dari direktori proyek:

```bash
npm ci
cp .env.development.example .env.development
cp .env.local.example .env.local
```

### 2. Konfigurasi Layanan

Isi `.env.local` dengan konfigurasi Supabase. Isi `.env.development` dengan konfigurasi lainnya dan tambahkan `DIRECT_URL`, yang belum tersedia di berkas contoh.

| Variabel | Kegunaan |
| --- | --- |
| `DATABASE_URL` | Koneksi PostgreSQL untuk aplikasi. |
| `DIRECT_URL` | Koneksi PostgreSQL untuk migrasi Prisma; gunakan basis data yang sama dengan `DATABASE_URL`. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase. |
| `CLOUDINARY_URL` | Kredensial unggahan gambar, berformat `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`. |
| `RESEND_API_KEY` | API key Resend untuk email verifikasi akademik. |
| `RESEND_FROM_EMAIL` | Alamat pengirim yang diizinkan oleh Resend. |
| `NEXT_PUBLIC_SITE_URL` | Alamat aplikasi; gunakan `http://localhost:3000` untuk pengembangan. |

Di Supabase Authentication, atur Site URL dan izinkan redirect ke `http://localhost:3000/api/reset-password`. Pertahankan tautan konfirmasi bawaan Supabase pada template email pemulihan; tautan pemulihan dibuka di browser yang digunakan untuk memintanya.

### 3. Persiapan Basis Data

Gunakan basis data pengembangan yang sudah dibuat, lalu jalankan:

```bash
npx dotenv run -f .env.development -- prisma generate --config prisma7.config.ts
npx dotenv run -f .env.development -- prisma migrate deploy --config prisma7.config.ts
npx dotenv run -f .env.development -- prisma db seed --config prisma7.config.ts
```

Konfigurasi Prisma proyek ini berada di `prisma7.config.ts`. Seed mengisi katalog sekolah, perguruan tinggi, saran peran, dan kategori proyek.

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [localhost:3000](http://localhost:3000). Pengunjung dapat menjelajahi proyek; pembuatan proyek dan pengajuan anggota memerlukan akun terverifikasi.

## Pemeriksaan dan Produksi

| Perintah | Kegunaan |
| --- | --- |
| `npm test` | Menjalankan pengujian otomatis dengan Vitest. |
| `npm run lint` | Memeriksa kode dengan ESLint. |
| `npm run build` | Membuat build produksi. |
| `npm start` | Menjalankan hasil build produksi. |

Untuk produksi, isi variabel layanan pada lingkungan hosting, sesuaikan `NEXT_PUBLIC_SITE_URL` dan redirect Supabase dengan domain aplikasi, lalu terapkan migrasi dengan konfigurasi Prisma dan kredensial lingkungan tersebut sebelum menjalankan aplikasi.
