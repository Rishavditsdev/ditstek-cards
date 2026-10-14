import type { MetadataRoute } from "next";
import { CARD_GENERATOR_PATH, editorPath, siteConfig, templatesPath } from "@/lib/site";
import { getCategories, getTemplates } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    CARD_GENERATOR_PATH,
    ...getCategories().map((category) => templatesPath(category.slug)),
    ...getTemplates().map((template) => editorPath(template.id)),
  ];

  return paths.map((path) => ({ url: `${siteConfig.url}${path}` }));
}
