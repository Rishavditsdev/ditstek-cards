#!/usr/bin/env node
/**
 * Shrinks the template SVGs.
 *
 * The SVGs exported from Figma embed their photographic layers as base64 PNG
 * and JPEG data URIs, which makes some of them 25-29 MB. This script re-encodes
 * those embedded images as WebP. The SVG markup and file names are untouched,
 * so nothing that references them has to change.
 *
 * Usage:  npm run optimize:svgs [-- <directory>]
 * Env:    WEBP_QUALITY (default 88)
 *
 * Only PNG/JPEG data URIs are rewritten, so running it again is a no-op. To
 * redo it at a different quality, restore the original SVGs from git first.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const QUALITY = Number(process.env.WEBP_QUALITY ?? 88);
/** Images below this size are not worth re-encoding. */
const MIN_BYTES = 20 * 1024;
/** Keep the original unless WebP saves at least this fraction. */
const MIN_SAVING = 0.2;

const DATA_URI = /data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/=]+)/g;

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.name.endsWith(".svg")) {
      yield fullPath;
    }
  }
}

async function toWebp(base64) {
  const original = Buffer.from(base64, "base64");
  if (original.length < MIN_BYTES) {
    return null;
  }

  const webp = await sharp(original)
    .webp({ quality: QUALITY, alphaQuality: 100, effort: 6 })
    .toBuffer();

  return webp.length <= original.length * (1 - MIN_SAVING) ? webp : null;
}

async function optimizeFile(file) {
  const svg = await readFile(file, "utf8");
  const parts = [];
  let cursor = 0;
  let converted = 0;

  for (const match of svg.matchAll(DATA_URI)) {
    const webp = await toWebp(match[1]);
    if (!webp) {
      continue;
    }
    parts.push(svg.slice(cursor, match.index), `data:image/webp;base64,${webp.toString("base64")}`);
    cursor = match.index + match[0].length;
    converted += 1;
  }

  if (converted === 0) {
    return null;
  }

  parts.push(svg.slice(cursor));
  const optimized = parts.join("");
  await writeFile(file, optimized);

  return { converted, before: Buffer.byteLength(svg), after: Buffer.byteLength(optimized) };
}

const root = path.resolve(process.argv[2] ?? "public/assets/images");
await stat(root);

const mb = (bytes) => `${(bytes / 1e6).toFixed(2)} MB`;
let totalBefore = 0;
let totalAfter = 0;

for await (const file of walk(root)) {
  const result = await optimizeFile(file);
  if (!result) {
    continue;
  }
  totalBefore += result.before;
  totalAfter += result.after;
  console.log(
    `${path.relative(root, file).padEnd(62)} ${mb(result.before).padStart(10)} -> ${mb(result.after).padStart(9)}  (${result.converted} images)`,
  );
}

console.log(
  totalBefore === 0
    ? "Nothing to optimize."
    : `\nTotal: ${mb(totalBefore)} -> ${mb(totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`,
);
