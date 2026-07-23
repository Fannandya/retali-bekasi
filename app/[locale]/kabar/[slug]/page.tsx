import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { pickLocale } from "@/lib/pickLocale";
import { createPublicClient } from "@/lib/supabase/public";
import { RichText } from "@/components/RichText";
import { formatDate } from "@/lib/format";
import { getOptimizedUrl } from "@/lib/image";
import type { Database } from "@/types/database";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const getNewsBySlug = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as Database["public"]["Tables"]["news"]["Row"] | null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) return { title: "Not Found" };
  return {
    title: pickLocale(item.title, locale),
    description: pickLocale(item.excerpt, locale),
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = (field: any) => pickLocale(field, locale);

  const item = await getNewsBySlug(slug);

  if (!item) notFound();

  return (
    <article style={{ paddingTop: "80px", paddingBottom: "64px" }}>
      <div className="wrap" style={{ maxWidth: "800px" }}>
        {item.cover_url && (
          <img
            src={getOptimizedUrl(item.cover_url, { width: 800 }) ?? ""}
            alt=""
            style={{ width: "100%", borderRadius: "var(--radius)", marginBottom: "24px" }}
            loading="eager"
            decoding="async"
          />
        )}
        <span className="date">{item.published_at ? formatDate(item.published_at, locale) : ""}</span>
        <h1>{t(item.title)}</h1>
        {item.content && <RichText html={t(item.content)} />}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t(item.title),
            description: t(item.excerpt),
            datePublished: item.published_at,
          }),
        }}
      />
    </article>
  );
}
