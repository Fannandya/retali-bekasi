import { Link } from "@/i18n/navigation";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className="page-btn">
          prev
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`page-btn ${p === currentPage ? "active" : ""}`}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className="page-btn">
          next
        </Link>
      )}
    </div>
  );
}
