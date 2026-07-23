import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://namatravel.com";
  const supabase = createPublicClient();

  const [packagesRes, newsRes] = await Promise.all([
    supabase.from("packages").select("slug, type, updated_at") as unknown as Promise<{ data: { slug: string; type: string; updated_at: string }[] | null }>,
    supabase.from("news").select("slug, updated_at").eq("is_published", true) as unknown as Promise<{ data: { slug: string; updated_at: string }[] | null }>,
  ]);

  const packages = packagesRes.data || [];
  const news = newsRes.data || [];

  const staticPages = ["/", "/about", "/umroh", "/haji", "/kabar", "/testimoni", "/kontak"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["id", "en"] as const) {
    for (const page of staticPages) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: page === "/" ? 1.0 : 0.8,
      });
    }

    for (const pkg of packages) {
      entries.push({
        url: `${siteUrl}/${locale}/${pkg.type}/${pkg.slug}`,
        lastModified: new Date(pkg.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const item of news) {
      entries.push({
        url: `${siteUrl}/${locale}/kabar/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
