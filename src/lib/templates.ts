import { cardCategories, cardTemplates, type TemplateConfig } from "@/data/card-templates";
import type { CardCategory } from "@/types/cards";

export function getCategories(): readonly CardCategory[] {
  return cardCategories;
}

export function getCategory(slug: string): CardCategory | undefined {
  return cardCategories.find((category) => category.slug === slug);
}

export function getTemplates(): readonly TemplateConfig[] {
  return cardTemplates;
}

export function getTemplatesByCategory(categorySlug: string): TemplateConfig[] {
  return cardTemplates.filter((template) => template.category === categorySlug);
}

export function getTemplate(id: string): TemplateConfig | undefined {
  return cardTemplates.find((template) => template.id === id);
}
