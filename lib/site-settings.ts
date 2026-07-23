import "server-only";
import { cache } from "react";
import { createPublicClient } from "./supabase/public";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface SiteSettings {
  branding: {
    brand_name: string;
    tagline: { id: string; en: string };
    logo_url: string;
    logo_path: string;
    og_image_url: string;
  };
  hero: {
    eyebrow: { id: string; en: string };
    title: { id: string; en: string };
    subtitle: { id: string; en: string };
    images: Array<{ url: string; path: string }>;
    primary_cta: { label: { id: string; en: string }; href: string };
    secondary_cta: { label: { id: string; en: string }; href: string };
  };
  hero_stats: Array<{
    value: string;
    label: { id: string; en: string };
    order: number;
  }>;
  section_headings: Record<
    string,
    { eyebrow?: { id: string; en: string }; title?: { id: string; en: string }; subtitle?: { id: string; en: string } }
  >;
  about_content: {
    snippet: { id: string; en: string };
    full: { id: string; en: string };
    legal: Array<{ label: string; number: string }>;
    image_url?: string;
    image_path?: string;
  };
  cta_band: {
    title: { id: string; en: string };
    subtitle: { id: string; en: string };
    cta_label: { id: string; en: string };
  };
  contact: {
    whatsapp_number: string;
    phone: string;
    email: string;
    address: { id: string; en: string };
    map_embed_url: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  };
  footer: {
    about_text: { id: string; en: string };
    copyright: { id: string; en: string };
  };
  visi_misi?: {
    visi: { id: string; en: string };
    misi: { id: string; en: string };
  };
  gallery_link: {
    enabled: boolean;
    label: { id: string; en: string };
    url: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  branding: {
    brand_name: "Nama Travel",
    tagline: { id: "Umroh & Haji Terpercaya", en: "Trusted Umroh & Hajj" },
    logo_url: "",
    logo_path: "",
    og_image_url: "",
  },
  hero: {
    eyebrow: { id: "Melayani dengan Amanah", en: "Serving with Trust" },
    title: { id: "Wujudkan Ibadah Umroh & Haji Impian Anda", en: "Realize Your Dream Umroh & Hajj Journey" },
    subtitle: {
      id: "Paket lengkap dengan bimbingan berpengalaman, jadwal jelas, dan pelayanan terbaik dari keberangkatan hingga kepulangan.",
      en: "Complete packages with experienced guidance, clear schedules, and the best service from departure to return.",
    },
    images: [],
    primary_cta: { label: { id: "Lihat Paket", en: "View Packages" }, href: "/umroh" },
    secondary_cta: { label: { id: "Konsultasi Gratis", en: "Free Consultation" }, href: "wa" },
  },
  hero_stats: [
    { value: "12+", label: { id: "Tahun Pengalaman", en: "Years of Experience" }, order: 1 },
    { value: "8.500+", label: { id: "Jamaah Terlayani", en: "Pilgrims Served" }, order: 2 },
    { value: "PPIU", label: { id: "Resmi Izin Kemenag", en: "Official Kemenag License" }, order: 3 },
  ],
  section_headings: {
    paket: {
      eyebrow: { id: "Paket Pilihan", en: "Featured" },
      title: { id: "Paket Umroh & Haji Unggulan", en: "Featured Packages" },
      subtitle: {
        id: "Sebagian paket populer kami. Lihat selengkapnya di halaman paket.",
        en: "A selection of our popular packages. See all on the packages page.",
      },
    },
    kabar: {
      eyebrow: { id: "Kabar Jamaah", en: "Pilgrim News" },
      title: { id: "Kabar & Kegiatan Terbaru", en: "Latest News & Activities" },
      subtitle: {
        id: "Dokumentasi keberangkatan, manasik, dan informasi terkini.",
        en: "Departure documentation, manasik, and latest info.",
      },
    },
    testimoni: {
      eyebrow: { id: "Testimoni", en: "Testimonials" },
      title: { id: "Cerita Jamaah Kami", en: "Our Pilgrims' Stories" },
      subtitle: {
        id: "Pengalaman nyata jamaah dalam bentuk video.",
        en: "Real pilgrim experiences in video.",
      },
    },
    galeri: {
      eyebrow: { id: "Galeri", en: "Gallery" },
      title: { id: "Galeri Foto", en: "Photo Gallery" },
      subtitle: {
        id: "Dokumentasi kegiatan & momen jamaah kami.",
        en: "Documentation of our pilgrims' activities & moments.",
      },
    },
  },
  about_content: {
    snippet: {
      id: "Kami adalah biro perjalanan umroh & haji resmi berizin Kemenag yang telah dipercaya ribuan jamaah.",
      en: "We are an official Kemenag-licensed umroh & hajj travel agency trusted by thousands of pilgrims.",
    },
    full: {
      id: "Kami adalah biro perjalanan umroh & haji resmi berizin Kemenag yang telah dipercaya ribuan jamaah. Dengan pembimbing berpengalaman dan pelayanan menyeluruh, kami memastikan ibadah Anda khusyuk dan nyaman.",
      en: "We are an official Kemenag-licensed umroh & hajj travel agency trusted by thousands of pilgrims. With experienced guides and comprehensive service, we ensure your worship is solemn and comfortable.",
    },
    legal: [
      { label: "PPIU", number: "000/2014" },
      { label: "PIHK", number: "000/2016" },
    ],
  },
  cta_band: {
    title: { id: "Siap Menunaikan Ibadah?", en: "Ready for Your Pilgrimage?" },
    subtitle: {
      id: "Konsultasikan rencana umroh & haji Anda bersama tim kami sekarang.",
      en: "Consult your umroh & hajj plans with our team now.",
    },
    cta_label: { id: "Hubungi via WhatsApp", en: "Contact via WhatsApp" },
  },
  contact: {
    whatsapp_number: "6280000000000",
    phone: "+62 800-0000-0000",
    email: "info@namatravel.com",
    address: { id: "Alamat kantor", en: "Office address" },
    map_embed_url: "",
  },
  socials: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  },
  footer: {
    about_text: {
      id: "Biro perjalanan umroh & haji resmi berizin Kemenag. Melayani dengan amanah sejak 2014.",
      en: "Official Kemenag-licensed umroh & hajj agency. Serving with trust since 2014.",
    },
    copyright: { id: "Semua hak dilindungi.", en: "All rights reserved." },
  },
  visi_misi: {
    visi: {
      id: "Menjadi biro perjalanan umroh & haji terpercaya yang memberikan pelayanan terbaik dan bimbingan ibadah yang khusyuk sesuai syariah.",
      en: "To become a trusted umroh & hajj travel agency that provides the best service and solemn worship guidance according to sharia.",
    },
    misi: {
      id: "Memberikan pelayanan profesional dan ramah sejak pendaftaran hingga kepulangan.\nMenyediakan paket perjalanan dengan harga terjangkau dan fasilitas terbaik.\nMembimbing jamaah dengan pembimbing berpengalaman dan bersertifikat.\nMenjaga komunikasi dan transparansi informasi kepada jamaah.",
      en: "Providing professional and friendly service from registration to return.\nOffering travel packages at affordable prices with the best facilities.\nGuiding pilgrims with experienced and certified guides.\nMaintaining communication and information transparency with pilgrims.",
    },
  },
  gallery_link: {
    enabled: false,
    label: { id: "Lihat Galeri Lengkap", en: "View Full Gallery" },
    url: "",
  },
};

function deepMerge<T>(defaults: T, overrides: Partial<T>): T {
  if (Array.isArray(defaults)) {
    return overrides as unknown as T;
  }
  const result = { ...defaults };
  for (const key in overrides) {
    const val = overrides[key];
    if (val !== null && val !== undefined) {
      if (typeof val === "object" && !Array.isArray(val) && typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
        result[key] = deepMerge(defaults[key] as any, val as any);
      } else {
        result[key] = val as any;
      }
    }
  }
  return result;
}

export function parseSettings(rows: Array<{ key: string; value: Json }>): SiteSettings {
  const raw: Record<string, Json> = {};
  for (const row of rows) {
    let val = row.value;
    if (typeof val === "string") {
      try { val = JSON.parse(val); } catch { /* keep as string */ }
    }
    raw[row.key] = val;
  }
  const merged: Record<string, any> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (raw[key]) {
      merged[key] = deepMerge((DEFAULT_SETTINGS as any)[key], raw[key] as any);
    } else {
      merged[key] = (DEFAULT_SETTINGS as any)[key];
    }
  }
  return merged as SiteSettings;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  if (!data) return DEFAULT_SETTINGS;

  return parseSettings(data);
});
