export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    dateStyle: "long",
  }).format(date);
}

export function formatDuration(departure: string, returnDate: string): number {
  const d1 = new Date(departure);
  const d2 = new Date(returnDate);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

export function getMonthName(month: number, locale: string): string {
  const date = new Date(2000, month - 1, 1);
  return new Intl.DateTimeFormat(locale === "en" ? "en" : "id-ID", {
    month: "long",
  }).format(date);
}
