import type { Page } from "@playwright/test";
import sharp from "sharp";

export interface Photo {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

/** A 800x600 test photo, wide enough that cropping it to a frame is visible. */
export async function createPhoto(name = "photo.png"): Promise<Photo> {
  const buffer = await sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 214, g: 92, b: 60 } },
  })
    .png()
    .toBuffer();

  return { name, mimeType: "image/png", buffer };
}

/**
 * Collects anything that would show up as a problem for a visitor: script
 * errors, console errors and failed requests (the favicon is ignored, the app
 * does not ship one).
 */
export function trackProblems(page: Page): string[] {
  const problems: string[] = [];

  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    // The browser logs a generic line for every failed resource; those are
    // reported with their URL by the response listener below.
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      problems.push(`console.error: ${message.text()}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) {
      problems.push(`${response.status()} ${response.url()}`);
    }
  });

  return problems;
}

/** Width and height of a PNG, read from its IHDR chunk. */
export function pngSize(buffer: Buffer): { width: number; height: number } {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Not a PNG file");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
