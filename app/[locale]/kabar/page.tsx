import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { createPublicClient } from "@/lib/supabase/public";
import { Pagination } from "@/components/Pagination";
import { getOptimizedUrl } from "@/lib/image";

export const revalidate = 3600;

const ITEMS_PER_PAGE = 12;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return {
    title: "Kabar",
    description: pickLocale(settings.section_headings.kabar?.subtitle, locale),
  };
}

export default async function NewsListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;
  const supabase = createPublicClient();
  const t = (field: any) => pickLocale(field, locale);

  const currentPage = page ? parseInt(page, 10) : 1;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  const result = await supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, to) as unknown as { data: any[] | null; count: number | null };
  const news = result.data;
  const count = result.count;

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <section style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="sec-head">
          <h2>Kabar & Kegiatan Terbaru</h2>
        </div>

        {news && news.length > 0 ? (
          <>
            <div className="grid grid-3">
              {news.map((item) => (
                <article key={item.id} className="news-card">
                  {item.cover_url && (
                    <div className="ph tall" style={{ backgroundImage: `url(${getOptimizedUrl(item.cover_url)})`, backgroundSize: "cover" }} />
                  )}
                  <div className="news-body">
                    <span className="date">{item.published_at}</span>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.excerpt)}</p>
                    <Link href={`/kabar/${item.slug}`} className="btn btn-ghost text-sm">Lihat Detail</Link>
                  </div>
                </article>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/kabar" />
          </>
        ) : (
          <div className="empty-state">
            <p>noNews</p>
          </div>
        )}
      </div>
    </section>
  );
}
