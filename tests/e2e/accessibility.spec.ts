import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/card-generator",
  "/card-generator/templates/birthday",
  "/card-generator/templates/work-anniversary",
  "/card-generator/templates/wedding-anniversary",
  "/card-generator/editor/birthday",
  "/card-generator/editor/work-anniversary",
  "/card-generator/editor/wedding-anniversary",
  "/card-generator/templates/unknown",
];

for (const path of pages) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");

    expect(
      serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
    ).toEqual([]);
  });
}
