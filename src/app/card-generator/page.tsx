import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { getCategories, getTemplatesByCategory } from "@/lib/templates";
import { CARD_GENERATOR_PATH } from "@/lib/site";

const description =
  "Select the event category, choose a template, edit the details, and download the final card.";

export const metadata: Metadata = {
  title: "Choose Card Category",
  description,
  alternates: { canonical: CARD_GENERATOR_PATH },
};

export default function CardGeneratorPage() {
  return (
    <section className="section-wrap">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Card Generator</p>
          <h1>Choose a card type</h1>
          <p>{description}</p>
        </div>

        <div className="row g-4">
          {getCategories().map((category) => (
            <div className="col-md-6 col-xl-4" key={category.slug}>
              <CategoryCard
                category={category}
                templateCount={getTemplatesByCategory(category.slug).length}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
