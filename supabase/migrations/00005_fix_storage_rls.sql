-- Fix: about/hero/logos/testimoni storage buckets allowed any anon/authenticated
-- visitor to insert and delete objects (no admin check). Restrict to admin only,
-- matching the brochures/news-images/site-assets pattern from 00001_init.sql.

drop policy if exists "about_insert_anon" on storage.objects;
drop policy if exists "about_delete_anon" on storage.objects;
create policy "about_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'about'
  and public.is_admin()
  and storage."extension"(name) in ('jpg', 'jpeg', 'png', 'webp')
);
create policy "about_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'about'
  and public.is_admin()
);

drop policy if exists "hero_insert_anon" on storage.objects;
drop policy if exists "hero_delete_anon" on storage.objects;
create policy "hero_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'hero'
  and public.is_admin()
  and storage."extension"(name) in ('jpg', 'jpeg', 'png', 'webp')
);
create policy "hero_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'hero'
  and public.is_admin()
);

drop policy if exists "logos_insert_anon" on storage.objects;
drop policy if exists "logos_delete_anon" on storage.objects;
create policy "logos_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'logos'
  and public.is_admin()
  and storage."extension"(name) in ('png', 'svg', 'webp')
);
create policy "logos_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'logos'
  and public.is_admin()
);

drop policy if exists "testimoni_insert_anon" on storage.objects;
drop policy if exists "testimoni_delete_anon" on storage.objects;
create policy "testimoni_insert_anon"
on storage.objects for insert
with check (
  bucket_id = 'testimoni'
  and public.is_admin()
  and storage."extension"(name) in ('jpg', 'jpeg', 'png', 'webp')
);
create policy "testimoni_delete_anon"
on storage.objects for delete
using (
  bucket_id = 'testimoni'
  and public.is_admin()
);
