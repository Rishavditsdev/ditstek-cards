import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryCard } from "@/components/CategoryCard";
import { TemplateCard } from "@/components/TemplateCard";
import { cardCategories, cardTemplates } from "@/data/card-templates";

describe("CategoryCard", () => {
  it.each(cardCategories)("links $name to its templates", (category) => {
    render(<CategoryCard category={category} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/card-generator/templates/${category.slug}`);
    expect(link).toHaveAttribute("data-category", category.slug);
    expect(screen.getByText(category.name)).toBeInTheDocument();
    expect(screen.getByText(category.description)).toBeInTheDocument();
  });

  it("names the link after the title and description only", () => {
    render(<CategoryCard category={cardCategories[0]} />);

    // The "Browse templates" prompt is decorative and must not add to the name.
    // (jsdom has no CSS, so the block-level title and description are not
    // separated by a space here the way a browser separates them.)
    expect(screen.getByRole("link")).toHaveAccessibleName(
      new RegExp(`^${cardCategories[0].name}\\s?${cardCategories[0].description}$`),
    );
  });

  it("shows how many templates a category has, in the link's name", () => {
    render(<CategoryCard category={cardCategories[0]} templateCount={9} />);

    expect(screen.getByText("9 templates")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName(/9 templates$/);
  });

  it("uses the singular for one template and omits the count when unknown", () => {
    const { container, rerender } = render(<CategoryCard category={cardCategories[0]} templateCount={1} />);
    expect(container.querySelector(".category-count")).toHaveTextContent(/^1 template$/);

    rerender(<CategoryCard category={cardCategories[0]} />);
    expect(container.querySelector(".category-count")).toBeNull();
  });

  it("draws a different icon for every configured category", () => {
    const icons = cardCategories.map((category) => {
      const { container, unmount } = render(<CategoryCard category={category} />);
      const icon = container.querySelector(".category-icon svg")?.innerHTML;
      unmount();
      return icon;
    });

    expect(icons.every(Boolean)).toBe(true);
    expect(new Set(icons).size).toBe(cardCategories.length);
  });

  it("falls back to the initial for a category without an icon", () => {
    const { container } = render(
      <CategoryCard category={{ name: "Graduations", slug: "graduation", description: "Congratulate graduates." }} />,
    );

    expect(container.querySelector(".category-icon svg")).toBeNull();
    expect(container.querySelector(".category-initial")).toHaveTextContent("G");
  });
});

describe("TemplateCard", () => {
  it.each(cardTemplates)("shows the unchanged preview of $title", (template) => {
    render(<TemplateCard template={template} />);

    const preview = screen.getByRole("img", { name: `${template.title} preview` });
    expect(preview).toHaveAttribute("src", template.preview);
    expect(preview).toHaveAttribute("width", "1600");
    expect(preview).toHaveAttribute("height", "900");
  });

  it.each(cardTemplates)("opens the editor for $title", (template) => {
    render(<TemplateCard template={template} />);

    expect(screen.getByRole("link", { name: /Use Template/ })).toHaveAttribute(
      "href",
      `/card-generator/editor/${template.id}`,
    );
    expect(screen.getByRole("heading", { level: 2, name: template.title })).toBeInTheDocument();
    expect(screen.getByText(template.description)).toBeInTheDocument();
  });

  it("loads the preview lazily unless it is marked eager", () => {
    const { rerender } = render(<TemplateCard template={cardTemplates[0]} />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");

    rerender(<TemplateCard template={cardTemplates[0]} eager />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
  });
});
