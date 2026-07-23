import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/pickLocale";
import { formatDate, formatDuration, formatRupiah } from "@/lib/format";
import { QuotaIndicator } from "./QuotaIndicator";
import { getOptimizedUrl } from "@/lib/image";
import type { Database } from "@/types/database";

type Package = Database["public"]["Tables"]["packages"]["Row"] & {
  brochure_url?: string | null;
};

export function PackageCard({
  pkg,
  locale,
}: {
  pkg: Package;
  locale: string;
}) {
  const duration = formatDuration(pkg.departure_date, pkg.return_date);
  const thumbnail = getOptimizedUrl(pkg.brochure_url);

  return (
    <div className="card">
      <div className="ph tall" style={thumbnail ? { backgroundImage: `url(${thumbnail})`, backgroundSize: "cover" } : {}}>
        <span className={`badge ${pkg.type === "haji" ? "haji" : ""}`}>
          {pkg.type === "haji" ? "haji" : "umroh"}
        </span>
        <span className="status">{pkg.status}</span>
      </div>
      <div className="card-body">
        <h3>{pickLocale(pkg.name, locale)}</h3>
        <div className="meta">
          <div className="row">
            🛫 {formatDate(pkg.departure_date, locale)}
          </div>
          <div className="row">
            🛬 {formatDate(pkg.return_date, locale)}
          </div>
          <div className="row">
            ⏱ {duration} {duration > 1 ? "days" : "day"}
          </div>
        </div>

        <QuotaIndicator
          total={pkg.total_quota}
          remaining={pkg.remaining_quota}
          locale={locale}
        />

        <div className="price">
          {formatRupiah(pkg.price)}
          <small>mulai / orang</small>
        </div>

        <Link href={`/${pkg.type}/${pkg.slug}`} className="btn btn-ghost">
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
