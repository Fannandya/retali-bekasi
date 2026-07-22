import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { createClient } from "@/lib/supabase/server";
import { PackageCard } from "@/components/PackageCard";
import { MonthFilter } from "@/components/MonthFilter";
import { Pagination } from "@/components/Pagination";

export const revalidate = 3600;

const ITEMS_PER_PAGE = 12;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bulan?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return {
    title: "Paket Haji",
    description: pickLocale(settings.section_headings.paket?.subtitle, locale),
    alternates: { canonical: `/${locale}/haji` },
  };
}

export default async function HajjListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { bulan, page } = await searchParams;
  const settings = await getSiteSettings();
  const supabase = await createClient();

  const currentMonth = bulan ? parseInt(bulan, 10) : null;
  const currentPage = page ? parseInt(page, 10) : 1;

  if (currentMonth !== null && (isNaN(currentMonth) || currentMonth < 1 || currentMonth > 12)) {
    notFound();
  }

  let query = supabase
    .from("packages")
    .select("*", { count: "exact" })
    .eq("type", "haji")
    .order("departure_date");

  if (currentMonth) {
    query = query.eq("departure_month", currentMonth);
  }

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  const result = await query.range(from, to) as unknown as { data: any[] | null; count: number | null };
  const packages = result.data;
  const count = result.count;

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  const { data: monthsData } = await supabase
    .from("packages")
    .select("departure_month")
    .eq("type", "haji") as unknown as { data: { departure_month: number }[] | null };

  const availableMonths = [...new Set((monthsData || []).map((r) => r.departure_month))].sort();

  if (currentMonth && !availableMonths.includes(currentMonth)) {
    return (
      <section style={{ paddingTop: "80px" }}>
        <div className="wrap">
          <div className="sec-head"><h2>Paket Haji</h2></div>
          <MonthFilter locale={locale} currentMonth={currentMonth} availableMonths={availableMonths} basePath="/haji" />
          <div className="empty-state">
            <p>monthEmpty</p>
            <a href="/haji" className="btn btn-primary">seeAll</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="sec-head"><h2>Paket Haji</h2></div>

        <MonthFilter locale={locale} currentMonth={currentMonth} availableMonths={availableMonths} basePath="/haji" />

        {packages && packages.length > 0 ? (
          <>
            <div className="grid grid-4">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} locale={locale} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/haji"
              searchParams={currentMonth ? { bulan: String(currentMonth) } : {}}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>No packages available yet. Contact us for more information.</p>
          </div>
        )}
      </div>
    </section>
  );
}
