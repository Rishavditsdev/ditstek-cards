import Image from "next/image";
import Link from "next/link";
import { CARD_GENERATOR_PATH, siteConfig } from "@/lib/site";

export function SiteNavbar() {
  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container">
        <Link className="navbar-brand" href={CARD_GENERATOR_PATH}>
          <Image
            src="/assets/images/logo.svg"
            alt={siteConfig.name}
            width={107}
            height={46}
            loading="eager"
          />
        </Link>
      </div>
    </nav>
  );
}
