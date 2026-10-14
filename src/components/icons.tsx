import type { ReactNode } from "react";

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Decorative arrow. It inherits the text colour and scales with the font size. */
export function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg className="icon-arrow" {...strokeProps} strokeWidth={2}>
      {direction === "right" ? (
        <path d="M5 12h14M13 6l6 6-6 6" />
      ) : (
        <path d="M19 12H5M11 6l-6 6 6 6" />
      )}
    </svg>
  );
}

/** Decorative tray-and-arrow glyphs for the editor's download and upload controls. */
export function DownloadIcon() {
  return (
    <svg className="icon-action" {...strokeProps}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg className="icon-action" {...strokeProps}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

const categoryIcons: Record<string, ReactNode> = {
  // Cake
  birthday: (
    <>
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3M12 8v3M17 8v3" />
      <path d="M7 4h.01M12 4h.01M17 4h.01" />
    </>
  ),
  // Award medal
  "work-anniversary": (
    <>
      <path d="m15.48 12.89 1.51 8.53a.5.5 0 0 1-.81.47l-3.58-2.69a1 1 0 0 0-1.2 0l-3.58 2.69a.5.5 0 0 1-.81-.47l1.51-8.53" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
  // Heart
  "wedding-anniversary": (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  ),
};

/**
 * Icon for a category. A category without a drawing of its own (for example a
 * newly added one) falls back to its initial letter.
 */
export function CategoryIcon({ slug, name }: { slug: string; name: string }) {
  const glyph = Object.hasOwn(categoryIcons, slug) ? categoryIcons[slug] : null;

  if (!glyph) {
    return <span className="category-initial">{name.charAt(0).toUpperCase()}</span>;
  }

  return <svg {...strokeProps}>{glyph}</svg>;
}
