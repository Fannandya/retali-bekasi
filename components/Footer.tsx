"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { pickLocale } from "@/lib/pickLocale";
import { WhatsAppIcon } from "./WhatsAppButton";
import type { SiteSettings } from "@/lib/site-settings";

export function Footer({
  settings,
  locale,
}: {
  settings: SiteSettings;
  locale: string;
}) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer id="kontak">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <div className="fbrand">
              {settings.branding.logo_url ? (
                <img src={settings.branding.logo_url} alt={settings.branding.brand_name} className="logo-img" />
              ) : (
                <span className="logo">☾</span>
              )}
              {settings.branding.brand_name}
            </div>
            <p>{pickLocale(settings.footer.about_text, locale)}</p>
          </div>
          <div>
            <h4>{t("links")}</h4>
            <Link href="/umroh">Umroh</Link>
            <Link href="/haji">Haji</Link>
            <Link href="/about">{t("about") || "Tentang"}</Link>
            <Link href="/kabar">{t("news") || "Kabar"}</Link>
          </div>
          <div>
            <h4>{t("contact")}</h4>
            <a href={`https://wa.me/${settings.contact.whatsapp_number}`} className="wa-link"><WhatsAppIcon /> {settings.contact.phone}</a>
            <a href={`mailto:${settings.contact.email}`}>✉ {settings.contact.email}</a>
            <a href="#">📍 {pickLocale(settings.contact.address, locale)}</a>
          </div>
          <div>
            <h4>{t("followUs") || "Ikuti Kami"}</h4>
            {settings.socials.instagram && (
              <a href={`https://instagram.com/${settings.socials.instagram}`} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {settings.socials.facebook && (
              <a href={`https://facebook.com/${settings.socials.facebook}`} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {settings.socials.tiktok && (
              <a href={`https://tiktok.com/@${settings.socials.tiktok}`} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            )}
            {settings.socials.youtube && (
              <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            )}
          </div>
        </div>
        <div className="fbot">
          © {year} {settings.branding.brand_name}. {pickLocale(settings.footer.copyright, locale)}
        </div>
      </div>
    </footer>
  );
}

// bagasganteng
