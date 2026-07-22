import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { RichText } from "@/components/RichText";

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

  return (
    <section className="about" style={{ paddingTop: "80px" }}>
      <div className="wrap" style={{ gridTemplateColumns: "1fr 1fr", gap: "44px", display: "grid", alignItems: "center" }}>
        {settings.about_content?.image_url ? (
          <div className="ph" style={{ backgroundImage: `url(${settings.about_content.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        ) : (
          <div className="ph" />
        )}
        <div>
          <span className="eyebrow">Tentang Kami</span>
          <h2>{t(settings.section_headings.about?.title) || "Tentang Kami"}</h2>
          <RichText html={t(settings.about_content.full)} />
          <div className="legal">
            {settings.about_content.legal.map((item, i) => (
              <span key={i} className="chip">
                ✔ <b>{item.label}</b> No. {item.number}
              </span>
            ))}
          </div>
        </div>
      </div>

      {settings.contact.map_embed_url && (
        <div className="wrap" style={{ marginTop: "40px" }}>
          <div className="sec-head" style={{ textAlign: "left", maxWidth: "100%" }}>
            <h2>Lokasi Kantor</h2>
          </div>
          <iframe
            src={settings.contact.map_embed_url}
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "var(--radius)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </section>
  );
}
