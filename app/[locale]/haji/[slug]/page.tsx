import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate, formatDuration, formatRupiah } from "@/lib/format";
import { getOptimizedUrl } from "@/lib/image";
import type { Database } from "@/types/database";
import { QuotaIndicator } from "@/components/QuotaIndicator";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PackageImageButtons } from "@/components/PackageImageButtons";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const getHajiBySlug = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("type", "haji")
    .eq("slug", slug)
    .single();
  return data as Database["public"]["Tables"]["packages"]["Row"] | null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const pkg = await getHajiBySlug(slug);

  if (!pkg) return { title: "Not Found" };

  return {
    title: pickLocale(pkg.name, locale),
    description: `Paket ${pickLocale(pkg.name, locale)} - ${formatRupiah(pkg.price)}`,
  };
}

export default async function HajjDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = (field: any) => pickLocale(field, locale);

  const [settings, pkg] = await Promise.all([getSiteSettings(), getHajiBySlug(slug)]);

  if (!pkg) notFound();

  const duration = formatDuration(pkg.departure_date, pkg.return_date);

  return (
    <section style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="detail-layout">
          <div className="detail-main">
            <div className="detail-head">
              <span className="badge haji">{pkg.type}</span>
              <h1>{t(pkg.name)}</h1>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <strong>departure</strong>
                <span>{formatDate(pkg.departure_date, locale)}</span>
              </div>
              <div className="meta-item">
                <strong>return</strong>
                <span>{formatDate(pkg.return_date, locale)}</span>
              </div>
              <div className="meta-item">
                <strong>duration</strong>
                <span>{duration} days</span>
              </div>
            </div>

            <div className="detail-price">
              <span className="price-label">Harga Mulai Dari</span>
              <span className="price-value">{formatRupiah(pkg.price)}</span>
            </div>

            <QuotaIndicator total={pkg.total_quota} remaining={pkg.remaining_quota} locale={locale} />

            <PackageImageButtons
              brochureUrl={pkg.brochure_url}
              itineraryUrl={pkg.itinerary_url}
              packageName={t(pkg.name)}
            />

            <WhatsAppButton
              settings={settings}
              packageName={t(pkg.name)}
              className="btn btn-wa btn-lg"
              soldOut={pkg.remaining_quota === 0}
              locale={locale}
            />

            {pkg.price_includes && (
              <div className="detail-section">
                <h3>priceIncludes</h3>
                <ul>
                  {(JSON.parse(JSON.stringify(pkg.price_includes)) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {pkg.facilities && (
              <div className="detail-section">
                <h3>facilities</h3>
                <ul>
                  {(JSON.parse(JSON.stringify(pkg.facilities)) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="detail-side">
            {pkg.brochure_url && (
              <img
                src={getOptimizedUrl(pkg.brochure_url, { width: 600 }) ?? ""}
                alt=""
                className="w-full rounded-xl shadow-sm"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: t(pkg.name),
            description: `Paket ${pkg.type} - ${formatRupiah(pkg.price)}`,
            offers: {
              "@type": "Offer",
              price: pkg.price,
              priceCurrency: "IDR",
              availability: pkg.remaining_quota && pkg.remaining_quota > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            },
          }),
        }}
      />
    </section>
  );
}
