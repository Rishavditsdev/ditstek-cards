import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLegacyRedirectPath } from "@/lib/legacy-redirects";

/**
 * Keeps bookmarks to the old PHP site working. A proxy is used rather than
 * `redirects` in next.config because that always forwards the original query
 * string, which would leave `?category=...` behind on the new clean URLs.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const destination = getLegacyRedirectPath(pathname, searchParams);

  if (!destination) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(destination, request.url), 308);
}

// Next.js reads the matcher statically, so it has to be a literal. It must list
// every path handled by `getLegacyRedirectPath` (a unit test enforces this).
export const config = {
  matcher: [
    "/card-generator/index.php",
    "/card-generator/templates.php",
    "/card-generator/editor.php",
  ],
};
