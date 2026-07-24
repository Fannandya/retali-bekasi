export const R2_CATEGORIES = {
  brochures: { mimeTypes: ["image/jpeg", "image/webp", "image/png"], maxSize: 5 * 1024 * 1024 },
  "news-images": { mimeTypes: ["image/jpeg", "image/webp", "image/png"], maxSize: 5 * 1024 * 1024 },
  hero: { mimeTypes: ["image/jpeg", "image/webp", "image/png"], maxSize: 5 * 1024 * 1024 },
  about: { mimeTypes: ["image/jpeg", "image/webp", "image/png"], maxSize: 5 * 1024 * 1024 },
  logos: { mimeTypes: ["image/png", "image/svg+xml", "image/webp"], maxSize: 5 * 1024 * 1024 },
  testimoni: { mimeTypes: ["image/jpeg", "image/png", "image/webp"], maxSize: 5 * 1024 * 1024 },
} as const;

export type R2Category = keyof typeof R2_CATEGORIES;

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export function extFromMime(mime: string): string {
  return EXT_MAP[mime] || "bin";
}
