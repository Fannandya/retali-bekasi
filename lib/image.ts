const STORAGE_PREFIX = "/storage/v1/object/public/";
const RENDER_PREFIX = "/storage/v1/render/image/public/";

export function getOptimizedUrl(
  url: string | null | undefined,
  options?: { width?: number; quality?: number }
): string | null {
  if (!url) return null;
  if (!url.includes(STORAGE_PREFIX)) return url;

  const renderUrl = url.replace(STORAGE_PREFIX, RENDER_PREFIX);
  const params = new URLSearchParams();
  if (options?.width) params.set("width", String(options.width));
  params.set("quality", String(options?.quality ?? 75));

  return `${renderUrl}?${params.toString()}`;
}
