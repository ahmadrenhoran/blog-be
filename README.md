---
title: Backend API
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Blog Backend API

Backend API untuk aplikasi blog sederhana yang dibuat dengan Express.js, TypeScript, PostgreSQL, Drizzle ORM, JWT authentication, upload file ke Hugging Face Datasets, AI writing assistant via OpenRouter, dan deployment ke Hugging Face Spaces menggunakan Docker serta GitHub Actions.

Project ini memakai Hugging Face dengan dua peran berbeda:

- Hugging Face Datasets dipakai sebagai storage file. File yang di-upload dari API disimpan ke repository dataset, lalu API mengembalikan URL publik file tersebut.
- Hugging Face Spaces dipakai sebagai tempat deploy backend. Karena Space menggunakan `sdk: docker`, aplikasi dijalankan dari `Dockerfile`.

Database production menggunakan PostgreSQL dari Aiven. Koneksi database dibaca dari environment variable `DATABASE_URL`, dengan dukungan SSL certificate melalui `DB_CA_CERT`.

## Tech Stack

- Node.js
- Express.js 5
- TypeScript
- PostgreSQL
- Drizzle ORM
- Drizzle Kit
- JWT untuk autentikasi
- bcrypt untuk hashing password
- Zod untuk validasi request auth
- multer untuk menerima upload file multipart
- `@huggingface/hub` untuk upload file ke Hugging Face Datasets
- OpenRouter untuk fitur AI writing assistant
- Docker untuk deployment
- GitHub Actions untuk sync deployment ke Hugging Face Spaces
- Aiven PostgreSQL sebagai managed database

## Fitur

- Health check API
- Register user
- Login user dan generate JWT
- Middleware validasi request dengan Zod
- Middleware autentikasi JWT
- CRUD post berdasarkan user yang login
- Generate slug otomatis dari judul post
- Generate excerpt otomatis dari content
- Upload file ke Hugging Face Datasets sebagai object storage
- Generate bantuan penulisan blog dengan AI
- Limit penggunaan AI harian per user
- Response JSON konsisten
- Global error handler
- Docker-ready untuk Hugging Face Spaces
- Database migration/schema management dengan Drizzle

## Struktur Project

```txt
.
├── .github/workflows/deploy.yml   # GitHub Actions deployment ke Hugging Face Spaces
├── docs/images/                    # Tempat image flow alur integrasi
├── drizzle/                       # File migration Drizzle
├── src/
│   ├── app.ts                     # Setup Express app, middleware, route utama
│   ├── index.ts                   # Entry point server
│   ├── controllers/               # Handler request/response
│   ├── db/                        # Koneksi PostgreSQL + Drizzle
│   ├── middleware/                # Auth, validation, error handler
│   ├── models/                    # Schema tabel Drizzle
│   ├── routes/                    # Definisi routing API
│   ├── schemas/                   # Zod schema
│   ├── services/                  # Business logic
│   ├── types/                     # Type declaration tambahan
│   └── utils/                     # Helper response, error, upload, slug
├── Dockerfile                     # Image Docker untuk Hugging Face Spaces
├── .env.template                  # Template environment variable
├── drizzle.config.ts              # Konfigurasi Drizzle Kit
├── package.json
└── tsconfig.json
```

## Cara Kerja Singkat

1. Client mengakses API Express di `/api/v1`.
2. User melakukan register/login.
3. Saat login berhasil, server membuat JWT berisi `id` dan `email`.
4. Endpoint post dilindungi `authMiddleware`, sehingga request harus membawa header `Authorization: Bearer <token>`.
5. Data user dan post disimpan di PostgreSQL Aiven menggunakan Drizzle ORM.
6. Upload file diterima oleh multer di memory, lalu buffer file dikirim ke Hugging Face Datasets.
7. Hugging Face Datasets mengembalikan file yang bisa diakses melalui URL `https://huggingface.co/datasets/<repo>/resolve/main/<path>`.
8. Endpoint AI writing mengirim prompt terstruktur ke OpenRouter dan mencatat kuota harian user.
9. Aplikasi dideploy ke Hugging Face Spaces memakai Docker.
10. GitHub Actions melakukan sync kode dari GitHub repository ke repository Hugging Face Space setiap ada push ke branch `main`.

## Diagram Alur Integrasi

![alt text](https://huggingface.co/datasets/acaca28/fivespace-storage/resolve/main/uploads/1777540342894-hgcuv682-gemini_generated_image_jdwi5ojdwi5ojdwi-1.png)

## Routing API

Base URL lokal:

```txt
http://localhost:7860
```

Base path API:

```txt
/api/v1
```

### Root

#### GET `/`

Mengecek apakah API berjalan.

Response:

```json
{
  "success": true,
  "message": "Blog API is running"
}
```

#### GET `/health`

Health check sederhana.

Response:

```json
{
  "status": "ok"
}
```

### Auth Routes

Base path:

```txt
/api/v1/auth
```

#### POST `/api/v1/auth/register`

Membuat user baru.

Body:

```json
{
  "name": "Ahmad",
  "email": "ahmad@example.com",
  "password": "password123"
}
```

Validasi:

- `name` wajib diisi.
- `email` harus format email valid.
- `password` minimal 6 karakter.

Response sukses:

```json
{
  "success": true,
  "message": "Successfully created a new user",
  "data": {
    "id": 1,
    "name": "Ahmad",
    "email": "ahmad@example.com"
  }
}
```

#### POST `/api/v1/auth/login`

Login user dan mendapatkan token JWT.

Body:

```json
{
  "email": "ahmad@example.com",
  "password": "password123"
}
```

Response sukses:

```json
{
  "success": true,
  "message": "Successfully login",
  "data": {
    "user": {
      "id": 1,
      "name": "Ahmad",
      "email": "ahmad@example.com"
    },
    "token": "jwt-token"
  }
}
```

### Post Routes

Base path:

```txt
/api/v1/post
```

Semua route post memakai middleware JWT. Tambahkan header:

```txt
Authorization: Bearer <token>
```

#### POST `/api/v1/post`

Membuat post baru untuk user yang sedang login.

Body:

```json
{
  "title": "Belajar Express dan Drizzle",
  "content": "Isi artikel blog...",
  "cover_image": "https://huggingface.co/datasets/username/dataset/resolve/main/uploads/image.jpg"
}
```

Yang dilakukan server:

- Mengambil `userId` dari JWT.
- Membuat `slug` otomatis dari `title`.
- Membuat `excerpt` otomatis dari `content`.
- Menyimpan post ke database.

#### GET `/api/v1/post`

Mengambil daftar post.

Response berisi:

- `data`: daftar post
- `meta.currentPage`
- `meta.pageSize`
- `meta.totalCount`
- `meta.totalPages`

Catatan: service sudah mendukung pagination dan search, tetapi implementasi controller saat ini membaca `page`, `pageSize`, dan `search` dari `req.params`.

#### GET `/api/v1/post/:id`

Mengambil detail post berdasarkan `id`. Post hanya bisa diakses oleh pemiliknya.

#### PUT `/api/v1/post/:id`

Update post berdasarkan `id`. Post hanya bisa diubah oleh pemiliknya.

Body:

```json
{
  "title": "Judul Baru",
  "content": "Konten baru",
  "cover_image": "https://example.com/new-cover.jpg"
}
```

#### DELETE `/api/v1/post/:id`

Menghapus post berdasarkan `id`. Post hanya bisa dihapus oleh pemiliknya.

### Upload Routes

Base path:

```txt
/api/v1/upload
```

#### POST `/api/v1/upload`

Upload file ke Hugging Face Datasets.

Request harus memakai `multipart/form-data`.

Field:

- `file`: file yang akan di-upload.
- `folder`: optional, nama folder tujuan di dataset. Default: `uploads`.

Contoh dengan curl:

```bash
curl -X POST http://localhost:7860/api/v1/upload \
  -F "file=@./cover.jpg" \
  -F "folder=blog-covers"
```

Response sukses:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "path": "blog-covers/1710000000000-abcd1234-cover.jpg",
    "filename": "1710000000000-abcd1234-cover.jpg",
    "originalName": "cover.jpg",
    "mimeType": "image/jpeg",
    "size": 123456,
    "url": "https://huggingface.co/datasets/username/dataset/resolve/main/blog-covers/1710000000000-abcd1234-cover.jpg"
  }
}
```

### AI Writing Routes

Base path:

```txt
/api/v1/ai
```

Semua route AI writing memakai middleware JWT. Tambahkan header:

```txt
Authorization: Bearer <token>
```

#### POST `/api/v1/ai/writing`

Generate bantuan penulisan blog lewat OpenRouter.

Body:

```json
{
  "action": "draft",
  "prompt": "Buat artikel tentang manfaat journaling untuk developer",
  "title": "Journaling untuk Developer",
  "content": "Catatan awal yang ingin dikembangkan..."
}
```

Field:

| Field | Wajib | Keterangan |
| --- | --- | --- |
| `action` | Ya | Salah satu dari `title`, `outline`, `draft`, `improve`, atau `cta`. |
| `prompt` | Tidak | Arahan tambahan dari user, maksimal 4000 karakter. |
| `title` | Tidak | Judul saat ini, maksimal 255 karakter. |
| `content` | Tidak | Konten saat ini, maksimal 20000 karakter. |

Minimal salah satu dari `prompt`, `title`, atau `content` harus diisi.

Response sukses:

```json
{
  "success": true,
  "message": "Successfully generated writing assistance",
  "data": {
    "model": "openrouter/free",
    "text": "Hasil tulisan dari AI",
    "usage": {
      "date": "2026-04-30",
      "used": 1,
      "remaining": 9,
      "limit": 10
    }
  }
}
```

Catatan:

- API key dibaca dari `OPENROUTER_API_KEY`.
- Model default dibaca dari `OPENROUTER_MODEL`, fallback ke `openrouter/free`.
- Limit harian default adalah 10 request per user per hari.

## Database Schema

### `users`

| Column | Type | Keterangan |
| --- | --- | --- |
| `id` | serial | Primary key |
| `email` | varchar(255) | Email user, unique |
| `password` | text | Password yang sudah di-hash |
| `name` | varchar(255) | Nama user |
| `updated_at` | timestamp | Waktu update |
| `created_at` | timestamp | Waktu dibuat |

### `posts`

| Column | Type | Keterangan |
| --- | --- | --- |
| `id` | serial | Primary key |
| `user_id` | integer | Foreign key ke `users.id` |
| `title` | varchar(255) | Judul post |
| `slug` | varchar(255) | Slug unik dari title |
| `status` | enum | `draft` atau `published`, default `draft` |
| `excerpt` | text | Ringkasan content |
| `content` | text | Isi post |
| `cover_image` | varchar | URL gambar cover |
| `updated_at` | timestamp | Waktu update |
| `created_at` | timestamp | Waktu dibuat |

### `ai_generation_usages`

| Column | Type | Keterangan |
| --- | --- | --- |
| `id` | serial | Primary key |
| `user_id` | integer | Foreign key ke `users.id` |
| `usage_date` | date | Tanggal penggunaan sesuai timezone limit |
| `count` | integer | Jumlah generate AI pada tanggal tersebut |
| `updated_at` | timestamp | Waktu update |
| `created_at` | timestamp | Waktu dibuat |

Tabel ini memiliki unique index untuk kombinasi `user_id` dan `usage_date`.

## Environment Variables

Buat file `.env` di root project berdasarkan `.env.template`.

```env
PORT=7860
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require
DB_CA_CERT="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
JWT_SECRET=your-super-secret-jwt-key
HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
HF_REVIEW=username/dataset-name
UPLOAD_MAX_FILE_SIZE=1048576
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openrouter/free
OPENROUTER_SITE_URL=http://localhost:7860
OPENROUTER_APP_NAME=Blog CMS AI Writer
AI_WRITING_DAILY_LIMIT=10
AI_WRITING_LIMIT_TIMEZONE=Asia/Jakarta
```

Keterangan:

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `PORT` | Tidak | Port server. Default `7860`, sesuai default Hugging Face Spaces Docker. |
| `DATABASE_URL` | Ya | Connection string PostgreSQL dari Aiven. |
| `DB_CA_CERT` | Tidak | CA certificate Aiven. Jika valid, koneksi memakai `rejectUnauthorized: true`. |
| `JWT_SECRET` | Ya | Secret untuk sign dan verify JWT. |
| `HF_ACCESS_TOKEN` | Ya untuk upload | Token Hugging Face dengan permission write ke dataset. |
| `HF_REVIEW` | Ya untuk upload | Nama repo dataset Hugging Face, format `username/dataset-name`. |
| `UPLOAD_MAX_FILE_SIZE` | Tidak | Maksimal ukuran file upload dalam byte. Default 1 MB. |
| `OPENROUTER_API_KEY` | Ya untuk AI writing | API key OpenRouter. |
| `OPENROUTER_MODEL` | Tidak | Model OpenRouter yang dipakai. Default `openrouter/free`. |
| `OPENROUTER_SITE_URL` | Tidak | Nilai header `HTTP-Referer` untuk request OpenRouter. Default `http://localhost`. |
| `OPENROUTER_APP_NAME` | Tidak | Nilai header `X-Title` untuk request OpenRouter. Default `Blog CMS AI Writer`. |
| `AI_WRITING_DAILY_LIMIT` | Tidak | Limit generate AI per user per hari. Default `10`. |
| `AI_WRITING_LIMIT_TIMEZONE` | Tidak | Timezone untuk reset limit harian. Default `Asia/Jakarta`. |

## Setup Project Local

### 1. Clone repository

```bash
git clone <repository-url>
cd blog-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

Buat file `.env` dari template:

```bash
cp .env.template .env
```

Lalu isi value sesuai environment lokal.

Minimal untuk menjalankan API dengan database:

```env
PORT=7860
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
```

Tambahkan variable Hugging Face jika ingin memakai endpoint upload:

```env
HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
HF_REVIEW=username/dataset-name
```

Tambahkan variable OpenRouter jika ingin memakai endpoint AI writing:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openrouter/free
AI_WRITING_DAILY_LIMIT=10
```

### 4. Setup database Aiven

1. Buat service PostgreSQL di Aiven.
2. Ambil connection string dari dashboard Aiven.
3. Masukkan connection string ke `DATABASE_URL`.
4. Jika memakai CA certificate, simpan ke `DB_CA_CERT` dengan newline escaped sebagai `\n`.
5. Jalankan schema/migration Drizzle.

Push schema langsung ke database:

```bash
npm run db:push
```

Atau jalankan migration:

```bash
npm run db:migrate
```

### 5. Build TypeScript

```bash
npm run build
```

### 6. Jalankan server

```bash
npm start
```

Server berjalan di:

```txt
http://localhost:7860
```

## Scripts

| Script | Fungsi |
| --- | --- |
| `npm run build` | Compile TypeScript ke folder `dist`. |
| `npm start` | Menjalankan hasil build dari `dist/index.js`. |
| `npm run db:generate` | Generate migration Drizzle dari schema. |
| `npm run db:migrate` | Menjalankan migration ke database. |
| `npm run db:push` | Push schema Drizzle langsung ke database. |

## Menjadikan Hugging Face Datasets sebagai Storage

Project ini tidak menyimpan file upload ke disk server. Alurnya:

1. Client mengirim request `multipart/form-data` ke `/api/v1/upload`.
2. `multer.memoryStorage()` membaca file ke memory.
3. Nama file dibersihkan supaya aman untuk path storage.
4. Server membuat path unik dengan format:

```txt
<folder>/<timestamp>-<random>-<filename>
```

5. Server mengambil nama repo dataset dari `HF_REVIEW`.
6. Server mengambil token dari `HF_ACCESS_TOKEN`.
7. File buffer dikirim ke Hugging Face Datasets dengan `uploadFile` dari package `@huggingface/hub`.
8. API mengembalikan metadata file dan URL publik.

Contoh URL file:

```txt
https://huggingface.co/datasets/username/dataset-name/resolve/main/uploads/file.jpg
```

Dengan cara ini, Hugging Face Datasets berfungsi seperti object storage sederhana untuk file blog, misalnya cover image.

## Deploy ke Hugging Face Spaces dengan Docker

Project ini sudah siap untuk Hugging Face Spaces Docker karena README memiliki metadata:

```yaml
sdk: docker
```

Dockerfile menjalankan langkah berikut:

1. Memakai base image `node:24-alpine`.
2. Set working directory ke `/app`.
3. Install dependency dengan `npm ci`.
4. Copy source code.
5. Build TypeScript dengan `npm run build`.
6. Set `PORT=7860`.
7. Expose port `7860`.
8. Menjalankan aplikasi dengan `node dist/index.js`.

Build Docker lokal:

```bash
docker build -t blog-be .
```

Run Docker lokal:

```bash
docker run --env-file .env -p 7860:7860 blog-be
```

## Deploy Otomatis dengan GitHub Actions

Workflow deployment ada di:

```txt
.github/workflows/deploy.yml
```

Workflow berjalan saat ada push ke branch `main`.

Alur deployment:

1. GitHub Actions checkout repository.
2. Install `rsync`.
3. Clone repository Hugging Face Space:

```txt
https://huggingface.co/spaces/<HF_USERNAME>/<SPACE_NAME>
```

4. Sync isi repository GitHub ke repository Space dengan `rsync`.
5. Folder yang tidak ikut dikirim:

```txt
.git
node_modules
dist
hf-space
```

6. Commit perubahan di repository Space.
7. Push ke Hugging Face Spaces.
8. Hugging Face Spaces build ulang Docker image dari `Dockerfile`.

### GitHub Secrets yang Dibutuhkan

Tambahkan secrets berikut di GitHub repository:

| Secret | Keterangan |
| --- | --- |
| `HF_ACCESS_TOKEN` | Token Hugging Face untuk push ke Space. |
| `HF_USERNAME` | Username Hugging Face. |
| `SPACE_NAME` | Nama Hugging Face Space. |

### Environment Variables di Hugging Face Spaces

Di Hugging Face Space, tambahkan variable berikut melalui Settings:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require
DB_CA_CERT="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
JWT_SECRET=your-super-secret-jwt-key
HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
HF_REVIEW=username/dataset-name
UPLOAD_MAX_FILE_SIZE=1048576
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openrouter/free
OPENROUTER_SITE_URL=https://<HF_USERNAME>-<SPACE_NAME>.hf.space
OPENROUTER_APP_NAME=Blog CMS AI Writer
AI_WRITING_DAILY_LIMIT=10
AI_WRITING_LIMIT_TIMEZONE=Asia/Jakarta
```

Variable ini dibaca saat container berjalan di Hugging Face Spaces.

## Integrasi Aiven PostgreSQL

Project ini menggunakan Aiven sebagai managed PostgreSQL.

Yang dilakukan:

1. Membuat PostgreSQL service di Aiven.
2. Mengambil `DATABASE_URL` dari dashboard Aiven.
3. Mengatur SSL connection.
4. Menghapus parameter `sslmode` dan `sslrootcert` dari connection string di kode, lalu SSL dikonfigurasi lewat object `ssl` milik `pg`.
5. Jika `DB_CA_CERT` valid, koneksi memakai CA certificate.
6. Jika tidak ada CA certificate, koneksi tetap memakai SSL dengan `rejectUnauthorized: false`.
7. Saat server start, aplikasi menjalankan `select 1` untuk memastikan database bisa dikoneksi.

Jika database gagal terkoneksi, server tidak akan start dan akan menampilkan error di log.

## Format Response

Response sukses memakai format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Response error ditangani oleh middleware error handler dan memakai status code sesuai error yang dilempar dari service atau middleware.

## Autentikasi

Route yang membutuhkan login memakai header:

```txt
Authorization: Bearer <jwt-token>
```

Token dibuat saat login dan berlaku selama 1 hari.

Payload token:

```json
{
  "id": 1,
  "email": "ahmad@example.com"
}
```

## Troubleshooting

### `DATABASE_URL is required`

Pastikan `.env` atau environment variable deployment sudah memiliki `DATABASE_URL`.

### `Invalid or expired token`

Token JWT tidak valid, expired, atau `JWT_SECRET` di server berbeda dengan secret saat token dibuat.

### Upload gagal karena `HF_TOKEN_MISSING`

Pastikan `HF_ACCESS_TOKEN` sudah diisi dan token memiliki akses write ke dataset.

### Upload gagal karena `HF_REVIEW_MISSING`

Pastikan `HF_REVIEW` sudah diisi dengan format:

```txt
username/dataset-name
```

### File upload terlalu besar

Naikkan `UPLOAD_MAX_FILE_SIZE` dalam byte. Default project adalah 1 MB.

### AI writing gagal karena `OPENROUTER_KEY_MISSING`

Pastikan `OPENROUTER_API_KEY` sudah diisi di `.env` lokal atau Settings Hugging Face Spaces.

### Limit generate AI harian tercapai

Naikkan `AI_WRITING_DAILY_LIMIT` jika limit default 10 request per user per hari terlalu kecil.

### Hugging Face Space tidak bisa start

Cek log Space dan pastikan:

- `DATABASE_URL` valid.
- Aiven database bisa diakses dari internet.
- `JWT_SECRET` tersedia.
- Docker build berhasil.
- Port yang dipakai adalah `7860`.

## Lisensi

Project ini memiliki file `LICENSE` di repository.
