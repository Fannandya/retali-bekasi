import sanitizeHtml from "sanitize-html";

const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u", "s",
    "a", "img",
    "blockquote", "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "width", "height"],
    "*": ["class", "style"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export function sanitize(html: string): string {
  return sanitizeHtml(html, defaultOptions);
}
