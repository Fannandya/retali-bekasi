import { sanitize } from "@/lib/sanitize";

export function RichText({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div
      className="rich-text"
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}
