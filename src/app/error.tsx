"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-wrap">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Error</p>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred while loading this page.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          Try again
        </button>
      </div>
    </section>
  );
}
