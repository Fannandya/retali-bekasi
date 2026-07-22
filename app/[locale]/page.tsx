import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { PackageCard } from "@/components/PackageCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { createClient } from "@/lib/supabase/server";
import { TestimonialEmbed } from "@/components/TestimonialEmbed";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const settings = await getSiteSettings();
  const t = (field: any) => pickLocale(field, locale);
  const supabase = await createClient();

  const featuredRes = await supabase
    .from("packages")
    .select("*")
    .eq("is_featured", true)
    .order("departure_date")
    .limit(4) as unknown as { data: any[] | null };
  const newsRes = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3) as unknown as { data: any[] | null };
  const testimoniRes = await supabase
    .from("testimonials")
    .select("*")
    .order("order_index")
    .limit(3) as unknown as { data: any[] | null };

  const featuredPackages = featuredRes.data || [];
  const newsItems = newsRes.data || [];
  const testimonials = testimoniRes.data || [];

  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ paddingTop: "70px" }}>
        <div className="wrap">
          <div>
            <span className="eyebrow">{t(settings.hero.eyebrow)}</span>
            <h1 dangerouslySetInnerHTML={{ __html: t(settings.hero.title) }} />
            <p className="lead">{t(settings.hero.subtitle)}</p>
            <div className="hero-cta">
              <Link href={settings.hero.primary_cta.href} className="btn btn-gold">
                {t(settings.hero.primary_cta.label)}
              </Link>
              <WhatsAppButton settings={settings} label={t(settings.hero.secondary_cta.label)} />
            </div>
            <div className="trust">
              {settings.hero_stats
                .sort((a, b) => a.order - b.order)
                .map((stat, i) => (
                  <div key={i} className="t-item">
                    <b>{stat.value}</b>
                    <span>{t(stat.label)}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="hero-card">
            <HeroCarousel images={settings.hero.images || []} />
          </div>
        </div>
      </section>

      {/* PAKET UNGGULAN */}
      <section id="paket">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{t(settings.section_headings.paket?.eyebrow)}</span>
            <h2>{t(settings.section_headings.paket?.title)}</h2>
            <p>{t(settings.section_headings.paket?.subtitle)}</p>
          </div>
          <div className="grid grid-4">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} locale={locale} />
            ))}
          </div>
          <div className="sec-actions">
            <Link href="/umroh" className="btn btn-primary seemore">
              Lihat Semua Paket Umroh <SeeMoreIcon />
            </Link>
            <Link href="/haji" className="btn btn-gold seemore">
              Lihat Semua Paket Haji <SeeMoreIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section id="about" className="about">
        <div className="wrap">
          {settings.about_content?.image_url ? (
            <div className="ph" style={{ backgroundImage: `url(${settings.about_content.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          ) : (
            <div className="ph" />
          )}
          <div>
            <span className="eyebrow">Tentang Kami</span>
            <h2>{t(settings.section_headings.about?.title) || "Tentang Kami"}</h2>
            <p>{t(settings.about_content.snippet)}</p>
            <div className="legal">
              {settings.about_content.legal.map((item, i) => (
                <span key={i} className="chip">
                  ✔ <b>{item.label}</b> No. {item.number}
                </span>
              ))}
            </div>
            <Link href="/about" className="btn btn-ghost seemore">
              Lihat Detail <SeeMoreIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* KABAR */}
      <section id="kabar">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{t(settings.section_headings.kabar?.eyebrow)}</span>
            <h2>{t(settings.section_headings.kabar?.title)}</h2>
            <p>{t(settings.section_headings.kabar?.subtitle)}</p>
          </div>
          <div className="grid grid-3">
            {newsItems.map((item) => (
              <article key={item.id} className="news-card">
                {item.cover_url && (
                  <div className="ph" style={{ backgroundImage: `url(${item.cover_url})`, backgroundSize: "cover" }} />
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
          <div className="sec-actions">
            <Link href="/kabar" className="btn btn-primary seemore">
              Lihat Semua Kabar <SeeMoreIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section id="testimoni" className="testi">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{t(settings.section_headings.testimoni?.eyebrow)}</span>
            <h2>{t(settings.section_headings.testimoni?.title)}</h2>
            <p>{t(settings.section_headings.testimoni?.subtitle)}</p>
          </div>
          <div className="grid grid-3">
            {testimonials.map((item) => (
              <TestimonialEmbed
                key={item.id}
                type={item.type}
                platform={item.platform || "youtube"}
                videoUrl={item.youtube_url}
                youtubeId={item.youtube_id}
                imageUrl={item.image_url}
                title={t(item.title) || item.jamaah_name || ""}
              />
            ))}
          </div>
          <div className="sec-actions">
            <Link href="/testimoni" className="btn btn-gold seemore">
              Lihat Testimoni Lainnya <SeeMoreIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="wrap">
          <h2>{t(settings.cta_band.title)}</h2>
          <p>{t(settings.cta_band.subtitle)}</p>
          <WhatsAppButton settings={settings} label={t(settings.cta_band.cta_label)} className="btn btn-primary" />
        </div>
      </section>
    </>
  );
}

function SeeMoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

