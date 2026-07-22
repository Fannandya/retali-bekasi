import { formatNumber } from "@/lib/format";

export function QuotaIndicator({
  total,
  remaining,
  locale,
}: {
  total: number | null;
  remaining: number | null;
  locale: string;
}) {
  if (total === null || remaining === null) return null;

  const isFull = remaining === 0;
  const pct = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="quota">
      {isFull ? (
        <span className="quota-full">
          {locale === "en" ? "Fully Booked" : "Kuota Penuh"}
        </span>
      ) : (
        <>
          <span className="quota-text">
            {locale === "en"
              ? `${formatNumber(remaining)} of ${formatNumber(total)} seats left`
              : `Sisa ${formatNumber(remaining)} dari ${formatNumber(total)} kursi`}
          </span>
          <div className="quota-bar">
            <div
              className="quota-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
