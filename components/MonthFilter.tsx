"use client";

import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { getMonthName } from "@/lib/format";

export function MonthFilter({
  locale,
  currentMonth,
  availableMonths,
  basePath,
}: {
  locale: string;
  currentMonth: number | null;
  availableMonths: number[];
  basePath: string;
}) {
  const searchParams = useSearchParams();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const buildHref = (month: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (month) {
      params.set("bulan", String(month));
    } else {
      params.delete("bulan");
    }
    params.delete("page");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="month-filter">
      <Link
        href={buildHref(null)}
        className={`month-btn ${currentMonth === null ? "active" : ""}`}
        aria-pressed={currentMonth === null}
      >
        all
      </Link>
      {months.map((m) => {
        const disabled = !availableMonths.includes(m);
        return (
          <Link
            key={m}
            href={buildHref(m)}
            className={`month-btn ${currentMonth === m ? "active" : ""} ${disabled ? "disabled" : ""}`}
            aria-pressed={currentMonth === m}
            aria-disabled={disabled}
            onClick={disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
          >
            {getMonthName(m, locale)}
          </Link>
        );
      })}
    </div>
  );
}
