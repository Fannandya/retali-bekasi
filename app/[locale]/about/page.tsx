import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { RichText } from "@/components/RichText";
import { getOptimizedUrl } from "@/lib/image";
import { getMapEmbedSrc } from "@/lib/maps";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return {
    title: "Tentang Kami",
    description: pickLocale(settings.about_content.snippet, locale),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const settings = await getSiteSettings();
  const t = (field: any) => pickLocale(field, locale);
  const aboutImg = getOptimizedUrl(settings.about_content?.image_url);

  return (
    <section style={{ paddingTop: "80px" }}>
      <div className="wrap about-cards">
        <h2 className="text-2xl font-bold text-center mb-8">Tentang Kami</h2>

        <div className="card-about">
          <div className="card-about-grid">
            {aboutImg ? (
              <div className="ph" style={{ backgroundImage: `url(${aboutImg})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "280px" }} />
            ) : (
              <div className="ph" style={{ minHeight: "280px" }} />
            )}
            <div>
              <RichText html={t(settings.about_content.full)} />
              <div className="legal" style={{ marginTop: "16px" }}>
                {settings.about_content.legal.map((item, i) => (
                  <span key={i} className="chip">
                    ✔ <b>{item.label}</b> No. {item.number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {settings.visi_misi && (
          <div className="visi-misi-grid">
            <div className="card-about">
              <h3 className="card-about-title">Visi</h3>
              <p className="card-about-text">{t(settings.visi_misi.visi)}</p>
            </div>
            <div className="card-about">
              <h3 className="card-about-title">Misi</h3>
              <ol className="misi-list">
                {t(settings.visi_misi.misi).split("\n").filter(Boolean).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {(() => {
          const mapSrc = getMapEmbedSrc(settings.contact.map_embed_url, t(settings.contact.address));
          return mapSrc ? (
            <div className="card-about">
              <h3 className="card-about-title">Lokasi Kantor</h3>
              <iframe
                src={mapSrc}
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "var(--radius)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null;
        })()}
      </div>
    </section>
  );
}
