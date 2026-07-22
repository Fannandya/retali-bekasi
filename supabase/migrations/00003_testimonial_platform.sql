-- Tambah kolom platform untuk mendukung multi-platform testimonial
alter table public.testimonials add column if not exists platform text not null default 'youtube';
