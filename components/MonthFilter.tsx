"use client";

import { Link } from "@/i18n/navigation";
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
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="month-filter">
      <Link
        href={basePath}
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
            href={`${basePath}?bulan=${m}`}
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
