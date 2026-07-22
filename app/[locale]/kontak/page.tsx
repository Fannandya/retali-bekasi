import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Kontak",
    description: "Hubungi kami untuk informasi paket umroh & haji.",
  };
}

export default async function KontakPage({ params }: Props) {
  const { locale } = await params;
  const settings = await getSiteSettings();
  const t = (field: any) => pickLocale(field, locale);

  return (
    <section style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="sec-head">
          <h2>Kontak</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <a href={`https://wa.me/${settings.contact.whatsapp_number}`} className="contact-item" target="_blank" rel="noopener noreferrer">
              <strong>✆ WhatsApp</strong>
              <span>{settings.contact.whatsapp_number}</span>
            </a>
            <a href={`tel:${settings.contact.phone}`} className="contact-item">
              <strong>✆ Telepon</strong>
              <span>{settings.contact.phone}</span>
            </a>
            <a href={`mailto:${settings.contact.email}`} className="contact-item">
              <strong>✉ Email</strong>
              <span>{settings.contact.email}</span>
            </a>
            <div className="contact-item">
              <strong>📍 Alamat</strong>
              <span>{t(settings.contact.address)}</span>
            </div>

            <div className="contact-item wa-card">
              <WhatsAppButton settings={settings} className="btn btn-wa btn-lg" />
            </div>
          </div>

          {settings.contact.map_embed_url && (
            <iframe
              src={settings.contact.map_embed_url}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "var(--radius)" }}
              allowFullScreen
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
}
