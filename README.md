# Travel Umroh & Haji Retali Bekasi

Bilingual (id/en) travel website with Supabase backend and admin CMS panel.

## Developer

Fannandya Sutan Sakti Pratama

## Tech Stack

- **Framework**: Next.js 16.2.11 (Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase SSR
- **Deployment**: Vercel

## Getting Started

```bash
pnpm install
cp .env.example .env.local  # isi dengan kredensial Supabase
pnpm dev
```

## Environment Variables

Lihat `.env.example` untuk daftar variabel yang dibutuhkan.

## Database

Migrasi ada di `supabase/migrations/`, jalankan berurutan di Supabase SQL Editor.

## Project Structure

```
app/
  [locale]/          # Halaman publik (umroh, haji, testimoni, kontak, dll)
  admin/             # CMS panel (login + protected routes)
components/          # Komponen shared
lib/                 # Utility, Supabase client, revalidation
supabase/            # Migrasi SQL + storage policies
types/               # TypeScript types untuk database
```
