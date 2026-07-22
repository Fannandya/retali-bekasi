-- ============================================================
-- MIGRATION: 00001 Init — Website Travel Umroh & Haji
-- Sumber: PANDUAN-EKSEKUSI Bagian 8 (v1.7)
-- ============================================================

create extension if not exists pgcrypto;

-- ==================== FUNCTIONS ====================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ==================== TABLES ====================

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles p
                 where p.id = auth.uid() and p.role = 'admin');
$$;

-- PACKAGES (Umroh & Haji)
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('umroh','haji')),
  slug text not null,
  name jsonb not null,
  departure_date date not null,
  return_date date not null,
  price numeric(14,2) not null,
  price_includes jsonb,
  brochure_url text,
  brochure_path text,
  itinerary_url text,
  itinerary_path text,
  facilities jsonb,
  total_quota int,
  remaining_quota int,
  departure_month smallint generated always as (extract(month from departure_date)::int) stored,
  status text not null default 'available' check (status in ('available','full','closed')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packages_type_slug_key unique (type, slug),
  constraint packages_date_chk check (return_date >= departure_date),
  constraint packages_quota_chk check (
    (total_quota is null or total_quota >= 0) and
    (remaining_quota is null or remaining_quota >= 0) and
    (remaining_quota is null or total_quota is null or remaining_quota <= total_quota)
  )
);
create index packages_type_idx on public.packages(type);
create index packages_featured_idx on public.packages(is_featured) where is_featured = true;
create index packages_dep_month_idx on public.packages(type, departure_month);
create trigger packages_set_updated before update on public.packages
  for each row execute function public.set_updated_at();

-- NEWS
create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null,
  excerpt jsonb,
  content jsonb,
  cover_url text,
  cover_path text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_pub_idx on public.news(is_published, published_at desc);
create trigger news_set_updated before update on public.news
  for each row execute function public.set_updated_at();

-- TESTIMONIALS
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  jamaah_name text,
  title jsonb,
  youtube_url text not null,
  youtube_id text not null,
  description jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index testimonials_order_idx on public.testimonials(order_index);
create trigger testi_set_updated before update on public.testimonials
  for each row execute function public.set_updated_at();

-- SITE SETTINGS
create table public.site_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);
create trigger settings_set_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ==================== ROW LEVEL SECURITY ====================

alter table public.profiles          enable row level security;
alter table public.packages          enable row level security;
alter table public.news              enable row level security;
alter table public.testimonials      enable row level security;
alter table public.site_settings     enable row level security;

create policy "profiles self read" on public.profiles for select using (auth.uid() = id);

create policy "packages read"  on public.packages for select using (true);
create policy "packages write" on public.packages for all using (public.is_admin()) with check (public.is_admin());

create policy "news read published" on public.news for select using (is_published = true);
create policy "news admin all"      on public.news for all using (public.is_admin()) with check (public.is_admin());

create policy "testi read"  on public.testimonials for select using (true);
create policy "testi write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

create policy "settings read"  on public.site_settings for select using (true);
create policy "settings write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- ==================== STORAGE ====================

insert into storage.buckets (id, name, public) values ('brochures','brochures', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('news-images','news-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-assets','site-assets', true)
  on conflict (id) do nothing;

create policy "storage public read" on storage.objects
  for select using (bucket_id in ('brochures','news-images','site-assets'));
create policy "storage admin write" on storage.objects
  for all using (bucket_id in ('brochures','news-images','site-assets') and public.is_admin())
  with check (bucket_id in ('brochures','news-images','site-assets') and public.is_admin());

-- ==================== SEED DATA ====================

insert into public.site_settings (key, value) values
  ('contact', '{"whatsapp_number":"6280000000000","phone":"+62 800-0000-0000","email":"info@namatravel.com","address":{"id":"Alamat kantor","en":"Office address"},"map_embed_url":""}'),
  ('hero', '{"eyebrow":{"id":"Melayani dengan Amanah","en":"Serving with Trust"},"title":{"id":"Wujudkan Ibadah <span>Umroh & Haji</span> Impian Anda","en":"Realize Your Dream <span>Umroh & Hajj</span> Journey"},"subtitle":{"id":"Paket lengkap dengan bimbingan berpengalaman, jadwal jelas, dan pelayanan terbaik dari keberangkatan hingga kepulangan.","en":"Complete packages with experienced guidance, clear schedules, and the best service from departure to return."},"image_url":"","image_path":"","primary_cta":{"label":{"id":"Lihat Paket","en":"View Packages"},"href":"/umroh"},"secondary_cta":{"label":{"id":"Konsultasi Gratis","en":"Free Consultation"},"href":"wa"}}'),
  ('hero_stats', '[{"value":"12+","label":{"id":"Tahun Pengalaman","en":"Years of Experience"},"order":1},{"value":"8.500+","label":{"id":"Jamaah Terlayani","en":"Pilgrims Served"},"order":2},{"value":"PPIU","label":{"id":"Resmi Izin Kemenag","en":"Official Kemenag License"},"order":3}]'),
  ('about_content', '{"snippet":{"id":"Kami adalah biro perjalanan umroh & haji resmi berizin Kemenag yang telah dipercaya ribuan jamaah. Dengan pembimbing berpengalaman dan pelayanan menyeluruh, kami memastikan ibadah Anda khusyuk dan nyaman.","en":"We are an official Kemenag-licensed umroh & hajj travel agency trusted by thousands of pilgrims. With experienced guides and comprehensive service, we ensure your worship is solemn and comfortable."},"full":{"id":"Kami adalah biro perjalanan umroh & haji resmi berizin Kemenag yang telah dipercaya ribuan jamaah. Dengan pembimbing berpengalaman dan pelayanan menyeluruh, kami memastikan ibadah Anda khusyuk dan nyaman.","en":"We are an official Kemenag-licensed umroh & hajj travel agency trusted by thousands of pilgrims. With experienced guides and comprehensive service, we ensure your worship is solemn and comfortable."},"legal":[{"label":"PPIU","number":"000/2014"},{"label":"PIHK","number":"000/2016"}]}'),
  ('section_headings', '{"paket":{"eyebrow":{"id":"Paket Pilihan","en":"Featured"},"title":{"id":"Paket Umroh & Haji Unggulan","en":"Featured Packages"},"subtitle":{"id":"Sebagian paket populer kami. Lihat selengkapnya di halaman paket.","en":"A selection of our popular packages. See all on the packages page."}},"kabar":{"eyebrow":{"id":"Kabar Jamaah","en":"Pilgrim News"},"title":{"id":"Kabar & Kegiatan Terbaru","en":"Latest News & Activities"},"subtitle":{"id":"Dokumentasi keberangkatan, manasik, dan informasi terkini.","en":"Departure documentation, manasik, and latest info."}},"testimoni":{"eyebrow":{"id":"Testimoni","en":"Testimonials"},"title":{"id":"Cerita Jamaah Kami","en":"Our Pilgrims Stories"},"subtitle":{"id":"Pengalaman nyata jamaah dalam bentuk video.","en":"Real pilgrim experiences in video."}}}'),
  ('cta_band', '{"title":{"id":"Siap Menunaikan Ibadah?","en":"Ready for Your Pilgrimage?"},"subtitle":{"id":"Konsultasikan rencana umroh & haji Anda bersama tim kami sekarang.","en":"Consult your umroh & hajj plans with our team now."},"cta_label":{"id":"Hubungi via WhatsApp","en":"Contact via WhatsApp"}}'),
  ('socials', '{"instagram":"","facebook":"","tiktok":"","youtube":""}'),
  ('branding', '{"brand_name":"Nama Travel","tagline":{"id":"Umroh & Haji Terpercaya","en":"Trusted Umroh & Hajj"},"logo_url":"","logo_path":"","og_image_url":""}'),
  ('footer', '{"about_text":{"id":"Biro perjalanan umroh & haji resmi berizin Kemenag. Melayani dengan amanah sejak 2014.","en":"Official Kemenag-licensed umroh & hajj agency. Serving with trust since 2014."},"copyright":{"id":"Semua hak dilindungi.","en":"All rights reserved."}}')
on conflict (key) do update set value = excluded.value;
