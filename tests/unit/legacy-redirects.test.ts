// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { getLegacyRedirectPath, LEGACY_PATHS } from "@/lib/legacy-redirects";
import { config, proxy } from "@/proxy";

const redirectPath = (url: string) => {
  const { pathname, searchParams } = new URL(url, "http://localhost");
  return getLegacyRedirectPath(pathname, searchParams);
};

describe("getLegacyRedirectPath", () => {
  it("maps index.php to the category gallery", () => {
    expect(redirectPath("/card-generator/index.php")).toBe("/card-generator");
  });

  it("maps templates.php?category=... to the template gallery", () => {
    expect(redirectPath("/card-generator/templates.php?category=birthday")).toBe(
      "/card-generator/templates/birthday",
    );
  });

  it("maps editor.php?template=... to the editor", () => {
    expect(redirectPath("/card-generator/editor.php?template=wedding-anniversary")).toBe(
      "/card-generator/editor/wedding-anniversary",
    );
  });

  it("falls back to the work anniversary like the PHP pages did", () => {
    expect(redirectPath("/card-generator/templates.php")).toBe(
      "/card-generator/templates/work-anniversary",
    );
    expect(redirectPath("/card-generator/editor.php")).toBe("/card-generator/editor/work-anniversary");
    expect(redirectPath("/card-generator/editor.php?template=")).toBe(
      "/card-generator/editor/work-anniversary",
    );
  });

  it("drops unrelated query parameters", () => {
    expect(redirectPath("/card-generator/templates.php?utm_source=x&category=birthday&a=1")).toBe(
      "/card-generator/templates/birthday",
    );
  });

  it("encodes the value so it cannot escape its path segment", () => {
    expect(redirectPath("/card-generator/editor.php?template=../../admin")).toBe(
      "/card-generator/editor/..%2F..%2Fadmin",
    );
    expect(redirectPath("/card-generator/editor.php?template=//evil.com")).toBe(
      "/card-generator/editor/%2F%2Fevil.com",
    );
  });

  it("ignores everything that is not a legacy URL", () => {
    expect(redirectPath("/card-generator")).toBeNull();
    expect(redirectPath("/card-generator/editor/birthday")).toBeNull();
    expect(redirectPath("/other.php")).toBeNull();
  });
});

describe("proxy", () => {
  it("redirects legacy URLs permanently, without the old query string", () => {
    const response = proxy(
      new NextRequest("http://localhost:3000/card-generator/templates.php?category=birthday"),
    );

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("http://localhost:3000/card-generator/templates/birthday");
  });

  it("lets other requests through", () => {
    const response = proxy(new NextRequest("http://localhost:3000/card-generator"));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("matches exactly the paths that get redirected", () => {
    expect(LEGACY_PATHS.length).toBeGreaterThan(0);
    expect([...config.matcher].sort()).toEqual([...LEGACY_PATHS].sort());
  });
});
