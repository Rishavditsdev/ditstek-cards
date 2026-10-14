import Link from "next/link";
import { templatesPath } from "@/lib/site";
import type { CardCategory } from "@/types/cards";
import { ArrowIcon, CategoryIcon } from "./icons";

interface CategoryCardProps {
  category: CardCategory;
  /** How many templates the category has; the count is left out when not given. */
  templateCount?: number;
}

export function CategoryCard({ category, templateCount }: CategoryCardProps) {
  return (
    <Link className="category-card" data-category={category.slug} href={templatesPath(category.slug)}>
      <span className="category-icon" aria-hidden="true">
        <CategoryIcon slug={category.slug} name={category.name} />
      </span>
      <span className="category-copy">
        <strong>{category.name}</strong>
        <small>{category.description}</small>
      </span>
      <span className="category-footer">
        {/* Decorative: the link's name is the title, description and count. */}
        <span className="category-cta" aria-hidden="true">
          Browse templates
          <span className="category-cta-arrow">
            <ArrowIcon />
          </span>
        </span>
        {templateCount !== undefined && (
          <span className="category-count">
            {templateCount} {templateCount === 1 ? "template" : "templates"}
          </span>
        )}
      </span>
    </Link>
  );
}
