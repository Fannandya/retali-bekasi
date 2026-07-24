import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "retalikabupatenbekasi.my.id" },
    ],
  },
  allowedDevOrigins: ["100.111.250.47"],
};

export default withNextIntl(nextConfig);
