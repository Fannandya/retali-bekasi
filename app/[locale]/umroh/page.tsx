import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { createClient } from "@/lib/supabase/server";
import { PackageCard } from "@/components/PackageCard";
import { MonthFilter } from "@/components/MonthFilter";
import { SortFilter } from "@/components/SortFilter";
import { Pagination } from "@/components/Pagination";

export const revalidate = 3600;

const ITEMS_PER_PAGE = 12;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bulan?: string; page?: string; sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return {
    title: "Paket Umroh",
    description: pickLocale(settings.section_headings.paket?.subtitle, locale),
    alternates: { canonical: `/${locale}/umroh` },
  };
}

export default async function UmrohListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { bulan, page, sort } = await searchParams;
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
    .eq("type", "umroh");

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("departure_date", { ascending: false });
  }

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
    .eq("type", "umroh") as unknown as { data: { departure_month: number }[] | null };

  const availableMonths = [...new Set((monthsData || []).map((r) => r.departure_month))].sort();

  if (currentMonth && !availableMonths.includes(currentMonth)) {
    return (
      <section style={{ paddingTop: "80px" }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Paket Umroh</h2>
          </div>
          <MonthFilter
            locale={locale}
            currentMonth={currentMonth}
            availableMonths={availableMonths}
            basePath="/umroh"
          />
          <div className="empty-state">
            <p>monthEmpty</p>
            <a href="/umroh" className="btn btn-primary">seeAll</a>
          </div>
        </div>
      </section>
    );
  }

  const paginationParams: Record<string, string> = {};
  if (currentMonth) paginationParams.bulan = String(currentMonth);
  if (sort) paginationParams.sort = sort;

  return (
    <section style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="sec-head">
          <h2>Paket Umroh</h2>
        </div>

        <div className="filter-bar">
          <MonthFilter
            locale={locale}
            currentMonth={currentMonth}
            availableMonths={availableMonths}
            basePath="/umroh"
          />
          <SortFilter />
        </div>

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
              basePath="/umroh"
              searchParams={paginationParams}
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
