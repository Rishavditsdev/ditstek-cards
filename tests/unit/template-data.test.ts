import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cardComponents } from "@/components/cards";
import { cardCategories, cardTemplates } from "@/data/card-templates";
import { getCategory, getTemplate, getTemplatesByCategory } from "@/lib/templates";

const root = path.resolve(import.meta.dirname, "../..");
const publicFileExists = (publicPath: string) => fs.existsSync(path.join(root, "public", publicPath));

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(fullPath);
    }
    return /\.(tsx?|scss)$/.test(entry.name) ? [fullPath] : [];
  });
}

describe("card data", () => {
  it("has unique category slugs and template ids", () => {
    const slugs = cardCategories.map((category) => category.slug);
    const ids = cardTemplates.map((template) => template.id);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("puts every template in a known category", () => {
    for (const template of cardTemplates) {
      expect(getCategory(template.category), template.id).toBeDefined();
    }
  });

  it("offers at least one template for every category", () => {
    for (const category of cardCategories) {
      expect(getTemplatesByCategory(category.slug).length, category.slug).toBeGreaterThan(0);
    }
  });

  it("registers a card component for exactly the configured templates", () => {
    expect(Object.keys(cardComponents).sort()).toEqual(cardTemplates.map((t) => t.id).sort());
  });

  it("keeps field keys unique within a template", () => {
    for (const template of cardTemplates) {
      const keys = template.fields.map((field) => field.key);
      expect(new Set(keys).size, template.id).toBe(keys.length);
    }
  });

  it("only uses a select default that is one of its options", () => {
    for (const template of cardTemplates) {
      for (const field of template.fields) {
        if (field.type === "select") {
          expect(field.options.map((option) => option.value), field.key).toContain(field.default);
        }
      }
    }
  });

  it("finds templates by id and rejects unknown or inherited keys", () => {
    expect(getTemplate("birthday")?.title).toBe("Birthday Celebration");
    expect(getTemplate("nope")).toBeUndefined();
    expect(getTemplate("constructor")).toBeUndefined();
    expect(getCategory("__proto__")).toBeUndefined();
  });
});

describe("assets", () => {
  it("exist for every image referenced by the template data", () => {
    const paths = cardTemplates.flatMap((template) => [
      template.preview,
      ...template.fields.flatMap((field) => {
        if (field.type === "select") return field.options.map((option) => option.value);
        if (field.type === "image") return [field.default];
        return [];
      }),
    ]);

    expect(paths.length).toBeGreaterThan(0);
    for (const assetPath of paths) {
      expect(publicFileExists(assetPath), assetPath).toBe(true);
    }
  });

  it("exist for every /assets/images path used anywhere in the source", () => {
    const referenced = new Set<string>();
    for (const file of sourceFiles(path.join(root, "src"))) {
      for (const match of fs.readFileSync(file, "utf8").matchAll(/\/assets\/images\/[\w./-]+\.\w+/g)) {
        referenced.add(match[0]);
      }
    }

    expect(referenced.size).toBeGreaterThan(5);
    for (const assetPath of referenced) {
      expect(publicFileExists(assetPath), assetPath).toBe(true);
    }
  });
});
