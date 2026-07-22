type JsonValue = string | number | boolean | null | { [key: string]: JsonValue | undefined } | JsonValue[];

export function pickLocale(
  field: JsonValue | null | undefined,
  locale: string
): string {
  if (!field || typeof field !== "object" || Array.isArray(field)) return "";
  const val = field[locale];
  if (typeof val === "string") return val;
  const fallback = field["id"];
  if (typeof fallback === "string") return fallback;
  return "";
}
