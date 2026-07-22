"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const other = locale === "id" ? "en" : "id";

  return (
    <div className="lang">
      <Link href={pathname} locale="id" className={`${locale === "id" ? "active" : ""}`}>
        ID
      </Link>
      <Link href={pathname} locale="en" className={`${locale === "en" ? "active" : ""}`}>
        EN
      </Link>
    </div>
  );
}
