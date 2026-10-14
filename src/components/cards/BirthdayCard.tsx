/* eslint-disable @next/next/no-img-element --
   Cards are rasterised with html2canvas and show user-supplied data URLs, so
   they need plain <img> elements rather than next/image. */
import { DEFAULT_USER_IMAGE } from "@/data/card-templates";
import type { CardProps } from "./types";

export function BirthdayCard({ values, ref }: CardProps) {
  return (
    <div className="birthday-card" id="cardPreview" ref={ref}>
      <div className="person-frame">
        <img
          data-preview-image="main_image"
          src={values.main_image ?? DEFAULT_USER_IMAGE}
          alt="Profile image"
        />
      </div>
      <div className="card-copy">
        <h2 data-preview-field="name">{values.name ?? "Name"}</h2>
        <h6 data-preview-field="date">{values.date ?? "Date"}</h6>
      </div>
    </div>
  );
}
