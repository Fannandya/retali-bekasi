/**
 * Google Maps "share" links (maps.app.goo.gl, maps.google.com/maps/place/...) send
 * X-Frame-Options and refuse to render inside an <iframe> — only the dedicated
 * "Share > Embed a map" URL (containing /maps/embed or output=embed) works there.
 * Most admins paste the share link instead, so fall back to an address-based
 * embed (no API key required) whenever the stored URL isn't actually embeddable.
 */
export function getMapEmbedSrc(mapUrl: string | null | undefined, address: string): string | null {
  if (mapUrl && (mapUrl.includes("/maps/embed") || mapUrl.includes("output=embed"))) {
    return mapUrl;
  }
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }
  return null;
}
