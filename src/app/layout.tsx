import type { Metadata } from "next";
import { Caramel, Manrope } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";
import { SiteNavbar } from "@/components/SiteNavbar";
import { siteConfig } from "@/lib/site";

const manrope = Manrope({
  // Latin Extended keeps names with accents (e.g. "Łukasz") in the brand typeface.
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

// Script face used only by the wedding card, so it is not preloaded on every page.
const caramel = Caramel({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--font-caramel",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${caramel.variable}`}>
      <body>
        <SiteNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
