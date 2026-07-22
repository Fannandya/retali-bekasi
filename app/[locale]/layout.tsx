import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppButton";
import { getSiteSettings } from "@/lib/site-settings";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.branding.brand_name} | Umroh & Haji`,
      template: `%s | ${settings.branding.brand_name}`,
    },
    description: settings.branding.tagline[locale as "id" | "en"] || settings.branding.tagline.id,
    openGraph: {
      siteName: settings.branding.brand_name,
      images: settings.branding.og_image_url ? [{ url: settings.branding.og_image_url }] : [],
    },
    alternates: {
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();
  const settings = await getSiteSettings();

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: settings.branding.brand_name,
            description: settings.branding.tagline[locale as "id" | "en"] || settings.branding.tagline.id,
            url: process.env.NEXT_PUBLIC_SITE_URL,
            telephone: settings.contact.phone,
            email: settings.contact.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.contact.address[locale as "id" | "en"] || settings.contact.address.id,
            },
          }),
        }}
      />
      <Header settings={settings} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} locale={locale} />
      <WhatsAppFloat settings={settings} />
      <Analytics />
      <SpeedInsights />
    </NextIntlClientProvider>
  );
}
