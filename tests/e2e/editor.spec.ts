import { expect, test, type Locator, type Page } from "@playwright/test";
import sharp from "sharp";
import { createPhoto, pngSize, trackProblems } from "./helpers";

// The colour of the test photo made by createPhoto(); it must reach the exported PNG.
const PHOTO_COLOUR = { r: 214, g: 92, b: 60 };

// Exact matching: "Male Name" would otherwise also match the "Female Name" label.
const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });
const preview = (page: Page) => page.locator("#cardPreview");
const previewText = (page: Page, field: string) => page.locator(`[data-preview-field="${field}"]`);
const previewImage = (page: Page, field: string) => page.locator(`[data-preview-image="${field}"]`);

async function uploadPhoto(page: Page, fieldId: string) {
  await page.locator(`#${fieldId}`).setInputFiles(await createPhoto());
  await expect(page.getByRole("dialog", { name: "Adjust your photo" })).toBeVisible();
  await expect(page.locator(".cropper-container")).toBeVisible();
}

async function applyPhoto(page: Page) {
  await page.getByRole("button", { name: "Apply Photo" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}

async function download(page: Page) {
  const [file] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PNG" }).click(),
  ]);
  const { createReadStream } = await import("node:fs");
  const chunks: Buffer[] = [];
  for await (const chunk of createReadStream((await file.path())!)) {
    chunks.push(chunk as Buffer);
  }
  return { filename: file.suggestedFilename(), buffer: Buffer.concat(chunks) };
}

/** RGB of one pixel of the exported PNG, given a point in CSS pixels relative to the card. */
async function exportedPixel(png: Buffer, cardWidth: number, x: number, y: number) {
  const scale = pngSize(png).width / cardWidth;
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const offset = (Math.round(y * scale) * info.width + Math.round(x * scale)) * info.channels;
  return { r: data[offset], g: data[offset + 1], b: data[offset + 2] };
}

function expectCloseTo(actual: { r: number; g: number; b: number }, expected: typeof actual, tolerance = 14) {
  expect(Math.abs(actual.r - expected.r), `red of ${JSON.stringify(actual)}`).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.g - expected.g), `green of ${JSON.stringify(actual)}`).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.b - expected.b), `blue of ${JSON.stringify(actual)}`).toBeLessThanOrEqual(tolerance);
}

async function centreOf(element: Locator, relativeTo: Locator) {
  const box = (await element.boundingBox())!;
  const card = (await relativeTo.boundingBox())!;
  return { x: box.x - card.x + box.width / 2, y: box.y - card.y + box.height / 2, cardWidth: card.width };
}

test.describe("birthday card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/card-generator/editor/birthday");
  });

  test("shows placeholders, then follows the form", async ({ page }) => {
    await expect(previewText(page, "name")).toHaveText("Name");
    await expect(previewText(page, "date")).toHaveText("Date");

    await field(page, "Name").fill("priya sharma");
    await field(page, "Date").fill("14 october");

    await expect(previewText(page, "name")).toHaveText("priya sharma");
    await expect(previewText(page, "date")).toHaveText("14 october");
    await expect(previewText(page, "name")).toHaveCSS("text-transform", "capitalize");
  });

  test("shows an empty field as empty rather than as its placeholder", async ({ page }) => {
    await field(page, "Name").fill("Priya");
    await field(page, "Name").fill("");

    await expect(previewText(page, "name")).toHaveText("");
  });

  test("exports a PNG named after the person, at twice the card size", async ({ page }) => {
    await field(page, "Name").fill("Priya Sharma");
    await field(page, "Date").fill("14 October");
    const card = (await preview(page).boundingBox())!;

    const { filename, buffer } = await download(page);

    expect(filename).toBe("priya-sharma.png");
    const { width, height } = pngSize(buffer);
    expect(Math.abs(width - card.width * 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(height - card.height * 2)).toBeLessThanOrEqual(2);
    expect((await sharp(buffer).stats()).channels[0].stdev).toBeGreaterThan(10);
  });

  test("falls back to a generic file name when no name is entered", async ({ page }) => {
    expect((await download(page)).filename).toBe("ditstek-card.png");
  });

  test("the photo area opens the file picker from anywhere in it, then shows the photo", async ({ page }) => {
    const area = page.locator(".upload-field");
    await expect(area).toContainText("Upload a photo");

    // Click the thumbnail rather than the middle: the whole area is the control.
    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      area.click({ position: { x: 20, y: 20 } }),
    ]);
    await chooser.setFiles(await createPhoto());
    await expect(page.getByRole("dialog", { name: "Adjust your photo" })).toBeVisible();
    await applyPhoto(page);

    await expect(area).toContainText("Change photo");
    await expect(area.locator(".upload-thumb")).toHaveCSS("background-image", /^url\("data:image\/jpeg;base64,/);
  });

  test("puts the cropped photo on the card and into the export", async ({ page }) => {
    await uploadPhoto(page, "main_image");
    await applyPhoto(page);

    const frame = previewImage(page, "main_image");
    await expect(frame).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
    const { x, y, cardWidth } = await centreOf(frame, preview(page));
    const { buffer } = await download(page);

    expectCloseTo(await exportedPixel(buffer, cardWidth, x, y), PHOTO_COLOUR);
  });
});

test.describe("work anniversary card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/card-generator/editor/work-anniversary");
  });

  test("starts with the first anniversary and a pre-written message", async ({ page }) => {
    await expect(previewImage(page, "main_image")).toHaveAttribute("src", /first-work-anniversary\.svg$/);
    await expect(previewText(page, "sub_content")).toContainText("Congratulations on completing 1 year with us.");
    await expect(field(page, "Message")).toHaveValue(/^Congratulations on completing 1 year with us\./);
  });

  test("offers nine anniversary years and swaps the artwork", async ({ page }) => {
    const year = field(page, "Anniversary Year");
    await expect(year.locator("option")).toHaveCount(9);

    await year.selectOption({ label: "9th Work Anniversary" });

    await expect(previewImage(page, "main_image")).toHaveAttribute("src", /ninth-work-anniversary\.svg$/);
    await expect(previewImage(page, "main_image")).toBeVisible();
  });

  test("follows every text field", async ({ page }) => {
    await field(page, "Message").fill("Thanks for everything!");
    await field(page, "Name").fill("rohan rana");
    await field(page, "Job Title").fill("senior developer");
    await field(page, "Date").fill("2nd may");

    await expect(previewText(page, "sub_content")).toHaveText("Thanks for everything!");
    await expect(previewText(page, "name")).toHaveText("rohan rana");
    await expect(previewText(page, "designation")).toHaveText("senior developer");
    await expect(previewText(page, "date")).toHaveText("2nd may");
  });

  test("lists the year first and the photo last, then the download button", async ({ page }) => {
    const labels = await page.locator("#cardEditorForm label").allTextContents();

    expect(labels).toEqual(["Anniversary Year", "Message", "Name", "Job Title", "Date", "Profile Image"]);
    await expect(page.locator("#cardEditorForm > button")).toHaveText("Download PNG");
  });

  test("exports the chosen year, named after the person", async ({ page }) => {
    await field(page, "Anniversary Year").selectOption({ label: "2nd Work Anniversary" });
    await field(page, "Name").fill("Rohan Rana");

    const { filename, buffer } = await download(page);

    expect(filename).toBe("rohan-rana.png");
    expect(pngSize(buffer).width).toBeGreaterThan(1500);
  });

  test("puts the cropped photo in the export", async ({ page }) => {
    await uploadPhoto(page, "profile_image");
    await applyPhoto(page);

    const frame = previewImage(page, "profile_image");
    const { x, y, cardWidth } = await centreOf(frame, preview(page));
    const { buffer } = await download(page);

    expectCloseTo(await exportedPixel(buffer, cardWidth, x, y), PHOTO_COLOUR);
  });
});

test.describe("wedding anniversary card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/card-generator/editor/wedding-anniversary");
  });

  test("shows placeholders and a pre-written wish", async ({ page }) => {
    await expect(previewText(page, "male_name")).toHaveText("Male Name");
    await expect(previewText(page, "female_name")).toHaveText("Female Name");
    await expect(page.locator("[data-preview-date-day]")).toHaveText("Date");
    await expect(previewText(page, "wish")).toContainText("Wishing you both a beautiful anniversary");
  });

  test("follows the names and splits the date into day and month", async ({ page }) => {
    await field(page, "Male Name").fill("Rahul");
    await field(page, "Female Name").fill("Neha");
    await field(page, "Date").fill("12th August");
    await field(page, "Anniversary Message").fill("Many happy returns!");

    await expect(previewText(page, "male_name")).toHaveText("Rahul");
    await expect(previewText(page, "female_name")).toHaveText("Neha");
    await expect(page.locator("[data-preview-date-day]")).toHaveText("12th");
    await expect(page.locator("[data-preview-date-month]")).toHaveText("August");
    await expect(previewText(page, "wish")).toHaveText("Many happy returns!");
  });

  test("renders the names in the Caramel script font", async ({ page }) => {
    await field(page, "Male Name").fill("Rahul");

    await expect(page.locator(".wedding-card h2")).toHaveCSS("font-family", /Caramel/);
    expect(await page.evaluate(() => document.fonts.check("40px Caramel", "Rahul"))).toBe(true);
  });

  test("exports a PNG named after both partners", async ({ page }) => {
    await field(page, "Male Name").fill("Rahul");
    await field(page, "Female Name").fill("Neha");

    const { filename, buffer } = await download(page);

    expect(filename).toBe("rahul-neha.png");
    expect(pngSize(buffer).width).toBeGreaterThan(1500);
  });

  test("puts the cropped photo in the export", async ({ page }) => {
    await uploadPhoto(page, "profile_image");
    await applyPhoto(page);

    const frame = previewImage(page, "profile_image");
    const { x, y, cardWidth } = await centreOf(frame, preview(page));
    const { buffer } = await download(page);

    expectCloseTo(await exportedPixel(buffer, cardWidth, x, y), PHOTO_COLOUR);
  });
});

test.describe("photo cropper", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/card-generator/editor/wedding-anniversary");
  });

  test("shows the photo on the card at once, then crops it to the frame's shape", async ({ page }) => {
    const problems = trackProblems(page);
    const frame = previewImage(page, "profile_image");
    const box = (await frame.boundingBox())!;

    await uploadPhoto(page, "profile_image");
    await expect(frame).toHaveAttribute("src", /^blob:/);
    await applyPhoto(page);

    await expect(frame).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
    const [width, height] = await frame.evaluate((img: HTMLImageElement) => [img.naturalWidth, img.naturalHeight]);
    // Cropper.js keeps the crop box's exact ratio, so it may be a pixel off the requested 1000 wide.
    expect(Math.abs(width - 1000)).toBeLessThanOrEqual(1);
    expect(Math.abs(height - Math.round(1000 / (box.width / box.height)))).toBeLessThanOrEqual(1);
    expect(problems).toEqual([]);
  });

  test("labels the dialog and the photo", async ({ page }) => {
    await uploadPhoto(page, "profile_image");

    await expect(page.getByText("Image editor", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Adjust your photo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close image editor" })).toBeVisible();
    await expect(page.getByText("Drag to reposition and use the controls to zoom your photo")).toBeVisible();
  });

  test("the dialog is fully opaque and the area outside the crop box is not dimmed", async ({ page }) => {
    // Cropper.js has its own `.cropper-modal` class (a dimming mask); the app's dialog must not share it.
    await uploadPhoto(page, "profile_image");

    await expect(page.locator(".modal.image-cropper-modal")).toHaveCSS("opacity", "1");
    await expect(page.locator(".modal-content")).toHaveCSS("background-color", "rgb(17, 24, 43)");
    const mask = page.locator(".cropper-container .cropper-modal");
    await expect(mask).toHaveCSS("opacity", "1");
    await expect(mask).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("cancelling keeps the uncropped photo on the card", async ({ page }) => {
    await uploadPhoto(page, "profile_image");

    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(previewImage(page, "profile_image")).toHaveAttribute("src", /^blob:/);
  });

  test("the close button and Escape also dismiss the dialog", async ({ page }) => {
    await uploadPhoto(page, "profile_image");
    await page.getByRole("button", { name: "Close image editor" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await uploadPhoto(page, "profile_image");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("the same photo can be chosen again after it was applied", async ({ page }) => {
    await uploadPhoto(page, "profile_image");
    await applyPhoto(page);
    await expect(page.locator("#profile_image")).toHaveValue("");

    await uploadPhoto(page, "profile_image");
    await applyPhoto(page);

    await expect(previewImage(page, "profile_image")).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
  });

  test("the download button is usable again after the dialog closes", async ({ page }) => {
    await uploadPhoto(page, "profile_image");
    await applyPhoto(page);

    await expect(page.getByRole("button", { name: "Download PNG" })).toBeEnabled();
    expect((await download(page)).filename).toBe("ditstek-card.png");
  });
});
