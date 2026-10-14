import type { CardTemplate, CardValues } from "@/types/cards";

const FALLBACK_FILE_NAME = "ditstek-card";

/**
 * Splits a date such as "12th August" into the day and month shown on the
 * wedding card. Only the first two words are used, and the day falls back to
 * "Date" while the field is untouched or empty.
 */
export function splitDate(value: string | undefined): { day: string; month: string } {
  if (value === undefined) {
    return { day: "Date", month: "" };
  }

  const [day, month] = value.trim().split(/\s+/, 2);

  return { day: day || "Date", month: month || "" };
}

/**
 * File name for the downloaded PNG, built from the name fields (`name` and
 * `*_name`), e.g. "rahul-neha.png".
 */
export function getDownloadFileName(template: CardTemplate, values: CardValues): string {
  const slug = template.fields
    .filter((field) => field.key === "name" || field.key.endsWith("_name"))
    .map((field) => (values[field.key] ?? "").trim())
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || FALLBACK_FILE_NAME}.png`;
}
