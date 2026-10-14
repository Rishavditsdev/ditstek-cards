import type { Metadata } from "next";
import Link from "next/link";
import { CARD_GENERATOR_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="section-wrap">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p>The page or template you are looking for does not exist.</p>
        </div>
        <Link className="btn btn-primary" href={CARD_GENERATOR_PATH}>
          Back to the card generator
        </Link>
      </div>
    </section>
  );
}
