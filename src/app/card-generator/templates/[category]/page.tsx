import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { TemplateCard } from "@/components/TemplateCard";
import { CARD_GENERATOR_PATH, templatesPath } from "@/lib/site";
import { getCategories, getCategory, getTemplatesByCategory } from "@/lib/templates";

type Props = PageProps<"/card-generator/templates/[category]">;

// Only the configured categories exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) {
    return {};
  }

  return {
    title: `${category.name} Templates`,
    description: category.description,
    alternates: { canonical: templatesPath(category.slug) },
  };
}

export default async function TemplatesPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) {
    notFound();
  }

  const templates = getTemplatesByCategory(category.slug);

  return (
    <section className="section-wrap">
      <div className="container">
        <Link className="back-link" href={CARD_GENERATOR_PATH}>
          <ArrowIcon direction="left" />
          Back to categories
        </Link>
        <div className="page-heading">
          <p className="eyebrow">Templates</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>

        {templates.length === 0 && (
          <div className="empty-state">No templates found for this category yet.</div>
        )}

        <div className="row g-4">
          {templates.map((template, index) => (
            <div className="col-md-6 col-xl-4" key={template.id}>
              <TemplateCard template={template} eager={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
