"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { pickLocale } from "@/lib/pickLocale";
import { WhatsAppIcon } from "./WhatsAppButton";
import type { SiteSettings } from "@/lib/site-settings";

export function Header({
  settings,
  locale,
}: {
  settings: SiteSettings;
  locale: string;
}) {
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/", label: "home" },
    { href: "/umroh", label: "umroh" },
    { href: "/haji", label: "haji" },
    { href: "/about", label: "about" },
    { href: "/kabar", label: "news" },
    { href: "/testimoni", label: "testimonials" },
    { href: "/kontak", label: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur border-b border-line">
      <div className="wrap nav">
        <Link href="/" className="brand">
          {settings.branding.logo_url ? (
            <img src={settings.branding.logo_url} alt={settings.branding.brand_name} className="logo-img" />
          ) : (
            <span className="logo">☾</span>
          )}
          <span>
            {settings.branding.brand_name}
            <small>{pickLocale(settings.branding.tagline, locale)}</small>
          </span>
        </Link>

        <nav className="menu">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <LanguageSwitcher locale={locale} />
          <a
            href={`https://wa.me/${settings.contact.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            title="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
          <button className="hamburger">☰</button>
        </div>
      </div>
    </header>
  );
}
