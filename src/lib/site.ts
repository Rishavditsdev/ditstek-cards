export const siteConfig = {
  name: "Ditstek Cards",
  description:
    "Design personalised birthday, work anniversary and wedding anniversary cards, edit the details live and download them as PNG images.",
  /** Public origin, used for canonical URLs, Open Graph and the sitemap. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Entry point of the card generator; the site root redirects here. */
export const CARD_GENERATOR_PATH = "/card-generator";

export const templatesPath = (categorySlug: string) =>
  `${CARD_GENERATOR_PATH}/templates/${categorySlug}`;

export const editorPath = (templateId: string) => `${CARD_GENERATOR_PATH}/editor/${templateId}`;
