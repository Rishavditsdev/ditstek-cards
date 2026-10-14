# Ditstek Cards

A card generator for birthdays, work anniversaries and wedding anniversaries.
Pick a category, choose a template, edit the details with a live preview,
crop a photo, and download the finished card as a PNG.

Built with Next.js (App Router), React, TypeScript, Bootstrap and Sass.
Everything happens in the browser: there is no database or API, and the pages
are prerendered at build time.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

| Script                  | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Development server                                    |
| `npm run build`         | Production build                                      |
| `npm start`             | Serve the production build                            |
| `npm run lint`          | ESLint                                                |
| `npm run typecheck`     | TypeScript                                            |
| `npm test`              | Unit and component tests (Vitest)                     |
| `npm run test:e2e`      | End-to-end tests (Playwright, builds the app itself)  |
| `npm run optimize:svgs` | Shrinks the template SVGs, see [Assets](#assets)      |

### Configuration

Copy `.env.example` to `.env.local` and set the public address of the site.
It is used for canonical URLs, Open Graph tags and the sitemap, and defaults to
`http://localhost:3000`.

```bash
NEXT_PUBLIC_SITE_URL=https://cards.example.com
```

## Routes

| Route                                  | Page                                   |
| -------------------------------------- | -------------------------------------- |
| `/`                                    | Redirects to `/card-generator`         |
| `/card-generator`                      | Category gallery                       |
| `/card-generator/templates/[category]` | Templates in a category                |
| `/card-generator/editor/[template]`    | Live editor and PNG download           |
| `/sitemap.xml`, `/robots.txt`          | Generated for search engines           |

Unknown categories and templates return a 404.

URLs from the old PHP site still work and redirect permanently to the new ones
(`src/proxy.ts`): `index.php`, `templates.php?category=...` and
`editor.php?template=...`. As before, `templates.php` and `editor.php` without a
parameter open the work anniversary.

## Project structure

```
src/
  app/                  Routes, layout, metadata, 404 and error pages
  components/
    cards/              One component per card design (the PHP "partials")
    editor/             Editor, form fields and the photo cropper dialog
  data/card-templates.ts  Categories, templates and their editable fields
  lib/                  Template lookups, field values, date and file name rules
  styles/globals.scss   All custom styles (loaded after Bootstrap)
  proxy.ts              Redirects for legacy PHP URLs
public/assets/images/   Logo, icons and the card artwork
scripts/                Asset optimisation
tests/                  unit/ (Vitest) and e2e/ (Playwright)
database/schema.sql     Draft schema, see the note below
```

## Adding a template

1. Put the artwork in `public/assets/images/templates/{category}/`.
2. Add an entry to `cardTemplates` in `src/data/card-templates.ts`. The editor
   form is generated from its `fields`.
3. Create the card component in `src/components/cards/` and register it in
   `src/components/cards/index.ts`. The registry is typed against the template
   ids, so a missing component is a compile error.
4. Add the card's styles to `src/styles/globals.scss`.

A new category goes in `cardCategories`. On the category page it gets an icon
from `src/components/icons.tsx` and an accent colour from the
`.category-card[data-category="..."]` rules in `globals.scss`. Without them it
shows its initial letter in the default blue, so nothing breaks.

Give each editable element in the card a `data-preview-field` (text) or
`data-preview-image` (photo) attribute matching the field's `key`; the tests
check that every field has one.

## How the editor behaves

- Text fields start empty and the card shows placeholders ("Name", "Date", ...).
  Clearing a field you typed in leaves that text blank on the card.
- Choosing a photo shows it on the card immediately and opens the cropper,
  which crops to the shape of the frame it will fill. *Apply Photo* places the
  crop; *Cancel* keeps the uncropped photo.
- *Download PNG* renders the card at 2x with html2canvas. The file is named
  after the name fields (`rahul-neha.png`), or `ditstek-card.png`.
- The wedding card shows the first two words of the date as day and month.

## Testing

```bash
npm test              # unit and component tests
npm run test:e2e      # builds, starts a server on port 3100 and runs Playwright
```

The end-to-end tests run in Chromium at desktop and mobile widths and cover
navigation, the legacy redirects, metadata and the sitemap, an accessibility
scan (axe), live editing, the crop dialog, and the PNG export, including
checking that an uploaded photo ends up in the exported pixels. To use an
installed Chrome instead of downloading Chromium, set `PW_CHANNEL=chrome`;
otherwise run `npx playwright install chromium` once.

## Assets

The card artwork is exported from Figma as SVG with the photographic layers
embedded as base64 PNG/JPEG, which made a few files 25-29 MB. `npm run
optimize:svgs` re-encodes those embedded images as WebP (quality 88) without
touching the SVG markup. That takes the four heavy files from 64 MB to 9.7 MB
and the whole image folder from 74 MB to 20 MB. Rendered at full 4K size, the
result matches the originals to 45 dB PSNR or better, with no visibly different
pixels. The script only rewrites PNG/JPEG data, so running it again changes
nothing. To redo it at another quality, restore the original SVGs from git first
and set `WEBP_QUALITY`.

## Notes

- `database/schema.sql` is a draft schema carried over from the PHP project.
  Neither the PHP site nor this app connects to a database.
- The birthday card's CSS names `gilroy-semibold` and `gilroy-medium`, but the
  Gilroy font files were never part of the repository, so those headings render
  in the default sans-serif, as they did before. To use Gilroy, add the licensed
  files with `next/font/local`.
