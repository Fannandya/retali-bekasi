-- ============================================================
-- MIGRATION: 00002 — Align to v1.7
-- Menghapus package_brochures, menambah kolom brochure & itinerary
-- ============================================================

-- Hapus tabel package_brochures dan dependensinya
drop table if exists public.package_brochures cascade;

-- Hapus kolom rundown (diganti gambar itinerary)
alter table public.packages drop column if exists rundown;

-- Tambah kolom brosur & itinerary
alter table public.packages add column if not exists brochure_url text;
alter table public.packages add column if not exists brochure_path text;
alter table public.packages add column if not exists itinerary_url text;
alter table public.packages add column if not exists itinerary_path text;
