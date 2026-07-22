-- ============================================================
-- RLS Policies untuk bucket 'about', 'hero', & 'logos'
-- Jalankan di Supabase SQL Editor setelah bucket dibuat
-- Catatan: SELECT policy tidak perlu untuk public bucket
-- (file bisa diakses langsung via URL)
-- ============================================================

-- === BUCKET: about ===
-- Hapus SELECT policy sebelumnya jika ada
drop policy if exists "about_select_public" on storage.objects;
drop policy if exists "about_insert_anon" on storage.objects;
drop policy if exists "about_delete_anon" on storage.objects;

create policy "about_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'about'
  and auth.role() in ('anon', 'authenticated')
  and storage."extension"(name) in ('jpg', 'jpeg', 'png', 'webp')
);

create policy "about_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'about'
  and auth.role() in ('anon', 'authenticated')
);

-- === BUCKET: hero ===
drop policy if exists "hero_select_public" on storage.objects;
drop policy if exists "hero_insert_anon" on storage.objects;
drop policy if exists "hero_delete_anon" on storage.objects;

create policy "hero_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'hero'
  and auth.role() in ('anon', 'authenticated')
  and storage."extension"(name) in ('jpg', 'jpeg', 'png', 'webp')
);

create policy "hero_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'hero'
  and auth.role() in ('anon', 'authenticated')
);

-- === BUCKET: logos ===
drop policy if exists "logos_insert_anon" on storage.objects;
drop policy if exists "logos_delete_anon" on storage.objects;

create policy "logos_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'logos'
  and auth.role() in ('anon', 'authenticated')
  and storage."extension"(name) in ('png', 'svg', 'webp')
);

create policy "logos_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'logos'
  and auth.role() in ('anon', 'authenticated')
);

-- === BUCKET: testimonials ===
insert into storage.buckets (id, name, public) values ('testimoni','testimoni', true)
  on conflict (id) do nothing;

drop policy if exists "testimoni_insert_anon" on storage.objects;
drop policy if exists "testimoni_delete_anon" on storage.objects;

create policy "testimoni_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'testimoni'
  and auth.role() in ('anon', 'authenticated')
  and storage."extension"(name) in ('jpg', 'jpeg', 'png', 'webp')
);

create policy "testimoni_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'testimoni'
  and auth.role() in ('anon', 'authenticated')
);
