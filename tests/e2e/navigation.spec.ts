import { expect, test } from "@playwright/test";
import { trackProblems } from "./helpers";

test.describe("browsing the card generator", () => {
  test("the site root forwards to the category gallery", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/card-generator$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a card type");
  });

  test("lists every category", async ({ page }) => {
    await page.goto("/card-generator");

    for (const name of ["Birthdays", "Work Anniversaries", "Wedding Anniversaries"]) {
      await expect(page.getByRole("link", { name: new RegExp(name) })).toBeVisible();
    }
    await expect(page.locator(".category-card")).toHaveCount(3);
  });

  test("walks from a category to a template to the editor and back", async ({ page }) => {
    const problems = trackProblems(page);
    await page.goto("/card-generator");

    await page.getByRole("link", { name: /Work Anniversaries/ }).click();
    await expect(page).toHaveURL(/\/card-generator\/templates\/work-anniversary$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Work Anniversaries");
    await expect(page.getByRole("img", { name: "Work Anniversary preview" })).toBeVisible();

    await page.getByRole("link", { name: /Use Template/ }).click();
    await expect(page).toHaveURL(/\/card-generator\/editor\/work-anniversary$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Work Anniversary");

    await page.getByRole("link", { name: /Back$/ }).click();
    await expect(page).toHaveURL(/\/card-generator\/templates\/work-anniversary$/);

    await page.getByRole("link", { name: /Back to categories/ }).click();
    await expect(page).toHaveURL(/\/card-generator$/);

    expect(problems).toEqual([]);
  });

  test("shows a template for every category", async ({ page }) => {
    const expected = {
      birthday: "Birthday Celebration",
      "work-anniversary": "Work Anniversary",
      "wedding-anniversary": "Wedding Anniversary",
    };

    for (const [slug, title] of Object.entries(expected)) {
      await page.goto(`/card-generator/templates/${slug}`);
      await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
      await expect(page.getByRole("link", { name: /Use Template/ })).toHaveAttribute(
        "href",
        `/card-generator/editor/${slug}`,
      );
    }
  });

  test("the logo links back to the gallery", async ({ page }) => {
    await page.goto("/card-generator/editor/birthday");

    await page.getByRole("link", { name: "Ditstek Cards" }).click();

    await expect(page).toHaveURL(/\/card-generator$/);
  });

  test("each page has its own title", async ({ page }) => {
    await page.goto("/card-generator");
    await expect(page).toHaveTitle("Choose Card Category | Ditstek Cards");

    await page.goto("/card-generator/templates/wedding-anniversary");
    await expect(page).toHaveTitle("Wedding Anniversaries Templates | Ditstek Cards");

    await page.goto("/card-generator/editor/birthday");
    await expect(page).toHaveTitle("Edit Birthday Celebration | Ditstek Cards");
  });

  test("an editor visit starts fresh, as it did on the PHP site", async ({ page }) => {
    await page.goto("/card-generator/editor/birthday");
    await page.getByLabel("Name", { exact: true }).fill("Priya");
    await expect(page.locator('[data-preview-field="name"]')).toHaveText("Priya");

    await page.getByRole("link", { name: /Back$/ }).click();
    await page.getByRole("link", { name: /Use Template/ }).click();

    await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
    await expect(page.locator('[data-preview-field="name"]')).toHaveText("Name");
  });
});

test.describe("unknown pages", () => {
  for (const path of [
    "/card-generator/templates/unknown",
    "/card-generator/editor/unknown",
    "/card-generator/editor/constructor",
    "/does-not-exist",
  ]) {
    test(`${path} is a 404 with a way back`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
      await expect(page.getByRole("link", { name: "Back to the card generator" })).toBeVisible();
    });
  }
});

test.describe("links from the PHP site", () => {
  const cases: [string, string][] = [
    ["/card-generator/index.php", "/card-generator"],
    ["/card-generator/templates.php?category=birthday", "/card-generator/templates/birthday"],
    ["/card-generator/templates.php?category=wedding-anniversary", "/card-generator/templates/wedding-anniversary"],
    ["/card-generator/templates.php", "/card-generator/templates/work-anniversary"],
    ["/card-generator/editor.php?template=birthday", "/card-generator/editor/birthday"],
    ["/card-generator/editor.php?template=wedding-anniversary", "/card-generator/editor/wedding-anniversary"],
    ["/card-generator/editor.php", "/card-generator/editor/work-anniversary"],
    ["/index.php", "/card-generator"],
  ];

  for (const [legacy, current] of cases) {
    test(`${legacy} -> ${current}`, async ({ request, baseURL }) => {
      const response = await request.get(legacy, { maxRedirects: 0 });

      expect([307, 308]).toContain(response.status());
      // `Location` is relative for config redirects and absolute for the proxy; either must land on `current`.
      const location = new URL(response.headers().location, baseURL);
      expect(`${location.pathname}${location.search}`).toBe(current);
    });
  }

  test("a legacy link opens the right page in the browser", async ({ page }) => {
    await page.goto("/card-generator/editor.php?template=wedding-anniversary");

    await expect(page).toHaveURL(/\/card-generator\/editor\/wedding-anniversary$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Wedding Anniversary");
  });
});
