export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

export function extractTikTokId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (m) return m[1];
  const vm = url.match(/vm\.tiktok\.com\/([\w]+)/);
  if (vm) return vm[1];
  return null;
}

export function getYoutubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
