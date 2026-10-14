import { expect, test, type Page } from "@playwright/test";
import { trackProblems } from "./helpers";

const templates = [
  { category: "birthday", id: "birthday", preview: "/assets/images/templates/birthday/birthday-card.svg" },
  {
    category: "work-anniversary",
    id: "work-anniversary",
    preview: "/assets/images/templates/work-anniversary/work-anniversary.svg",
  },
  {
    category: "wedding-anniversary",
    id: "wedding-anniversary",
    preview: "/assets/images/templates/wedding-anniversary/wedding-anniversary.svg",
  },
];

/** Clicks the middle of an element the way a visitor would, even if an overlay is on top of it. */
async function clickCentre(page: Page, selector: string) {
  const target = page.locator(selector).first();
  // Raw mouse coordinates are viewport-relative, so bring cards below the fold into view first.
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (!box) {
    throw new Error(`${selector} is not visible`);
  }
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test.describe("template cards", () => {
  for (const { category, preview } of templates) {
    test(`${category}: the thumbnail is still the original artwork and renders`, async ({ page }) => {
      await page.goto(`/card-generator/templates/${category}`);

      const thumbnail = page.locator(".template-card-preview img");
      await expect(thumbnail).toHaveAttribute("src", preview);
      await expect
        .poll(() => thumbnail.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);

      // Shown as a full 16:9 frame, as before the redesign.
      const box = await thumbnail.boundingBox();
      expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
    });
  }

  test("clicking the thumbnail opens the editor, not just the button", async ({ page }) => {
    await page.goto("/card-generator/templates/work-anniversary");

    await clickCentre(page, ".template-card-preview img");

    await expect(page).toHaveURL(/\/card-generator\/editor\/work-anniversary$/);
  });

  test("the button works from the keyboard", async ({ page }) => {
    await page.goto("/card-generator/templates/birthday");

    // Logo, "Back to categories", then the template's button.
    const button = page.getByRole("link", { name: /Use Template/ });
    for (let presses = 0; presses < 5 && !(await button.evaluate((el) => el === document.activeElement)); presses++) {
      await page.keyboard.press("Tab");
    }

    await expect(button).toBeFocused();
    // The whole card shows the focus ring, since the button's overlay covers it.
    await expect(page.locator(".template-card")).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/card-generator\/editor\/birthday$/);
  });
});

test.describe("category cards", () => {
  for (const { category } of templates) {
    test(`clicking anywhere on the ${category} card opens its templates`, async ({ page }) => {
      await page.goto("/card-generator");

      await clickCentre(page, `.category-card[data-category="${category}"]`);

      await expect(page).toHaveURL(new RegExp(`/card-generator/templates/${category}$`));
    });
  }

  test("each category has its own icon", async ({ page }) => {
    await page.goto("/card-generator");

    const icons = await page.locator(".category-icon svg").evaluateAll((nodes) => nodes.map((n) => n.innerHTML));

    expect(icons).toHaveLength(3);
    expect(new Set(icons).size).toBe(3);
  });
});

test.describe("layout", () => {
  for (const path of [
    "/card-generator",
    ...templates.map(({ category }) => `/card-generator/templates/${category}`),
  ]) {
    test(`${path} has no horizontal scroll and no problems`, async ({ page }) => {
      const problems = trackProblems(page);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      expect(problems).toEqual([]);
    });
  }

  test("the page background does not tile into horizontal bands", async ({ page }) => {
    await page.goto("/card-generator");

    const { bodyImage, layer } = await page.evaluate(() => ({
      bodyImage: getComputedStyle(document.body).backgroundImage,
      layer: {
        position: getComputedStyle(document.body, "::before").position,
        pointerEvents: getComputedStyle(document.body, "::before").pointerEvents,
      },
    }));

    // The glows sit on a fixed, click-through layer rather than the repeating body background.
    expect(bodyImage).toBe("none");
    expect(layer).toEqual({ position: "fixed", pointerEvents: "none" });
  });
});
