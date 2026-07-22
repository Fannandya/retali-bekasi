import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"] as const,
  defaultLocale: "id",
  localePrefix: "always",
});
