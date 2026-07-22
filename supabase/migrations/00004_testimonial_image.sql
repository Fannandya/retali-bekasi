-- Tambah kolom untuk mendukung testimonial gambar
alter table public.testimonials
  add column if not exists type text not null default 'video' check (type in ('video', 'image')),
  add column if not exists image_url text,
  add column if not exists image_path text;

-- youtube_url, youtube_id, & platform jadi nullable (tidak required untuk image type)
alter table public.testimonials
  alter column youtube_url drop not null,
  alter column youtube_id drop not null,
  alter column platform drop not null;
