import { CARD_GENERATOR_PATH, editorPath, templatesPath } from "@/lib/site";

/** The PHP pages fell back to this template when no `category`/`template` was given. */
export const DEFAULT_LEGACY_TEMPLATE = "work-anniversary";

/** Legacy PHP URL -> its Next.js path. The original query string is dropped. */
const redirects = {
  "/card-generator/index.php": () => CARD_GENERATOR_PATH,
  "/card-generator/templates.php": (query: URLSearchParams) =>
    templatesPath(encodeURIComponent(query.get("category") || DEFAULT_LEGACY_TEMPLATE)),
  "/card-generator/editor.php": (query: URLSearchParams) =>
    editorPath(encodeURIComponent(query.get("template") || DEFAULT_LEGACY_TEMPLATE)),
};

/** Every legacy path that redirects; `proxy.ts` has to match exactly these. */
export const LEGACY_PATHS: readonly string[] = Object.keys(redirects);

/**
 * Maps a legacy PHP URL (`templates.php?category=birthday`, ...) to its
 * Next.js path, or returns `null` when the path is not a legacy URL.
 */
export function getLegacyRedirectPath(pathname: string, query: URLSearchParams): string | null {
  return Object.hasOwn(redirects, pathname)
    ? redirects[pathname as keyof typeof redirects](query)
    : null;
}
