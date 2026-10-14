import { expect, test } from "@playwright/test";

const pages = [
  { path: "/card-generator", title: "Choose Card Category | Ditstek Cards" },
  { path: "/card-generator/templates/birthday", title: "Birthdays Templates | Ditstek Cards" },
  { path: "/card-generator/templates/work-anniversary", title: "Work Anniversaries Templates | Ditstek Cards" },
  { path: "/card-generator/templates/wedding-anniversary", title: "Wedding Anniversaries Templates | Ditstek Cards" },
  { path: "/card-generator/editor/birthday", title: "Edit Birthday Celebration | Ditstek Cards" },
  { path: "/card-generator/editor/work-anniversary", title: "Edit Work Anniversary | Ditstek Cards" },
  { path: "/card-generator/editor/wedding-anniversary", title: "Edit Wedding Anniversary | Ditstek Cards" },
];

test.describe("page metadata", () => {
  for (const { path, title } of pages) {
    test(path, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(title);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /width=device-width/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
      await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Ditstek Cards");
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }

  test("every image has alternative text", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      const missing = await page.locator("img:not([alt])").count();
      expect(missing, path).toBe(0);
    }
  });

  test("404 pages are kept out of search results", async ({ page }) => {
    await page.goto("/card-generator/templates/unknown");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("crawler files", () => {
  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toMatch(/Allow: \//);
    expect(body).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  });

  test("sitemap.xml lists every public page, and each one exists", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const locations = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

    expect(response.status()).toBe(200);
    expect(locations.map((url) => new URL(url).pathname).sort()).toEqual(
      pages.map(({ path }) => path).sort(),
    );

    for (const url of locations) {
      const { pathname } = new URL(url);
      expect((await request.get(pathname)).status(), pathname).toBe(200);
    }
  });
});
