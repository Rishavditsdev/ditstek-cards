/* eslint-disable @next/next/no-img-element --
   Cards are rasterised with html2canvas and show user-supplied data URLs, so
   they need plain <img> elements rather than next/image. */
import { DEFAULT_USER_IMAGE } from "@/data/card-templates";
import { splitDate } from "@/lib/card-format";
import type { CardProps } from "./types";

const IMAGES = "/assets/images/templates/wedding-anniversary";

export function WeddingAnniversaryCard({ values, ref }: CardProps) {
  const { day, month } = splitDate(values.date);

  return (
    <div className="wedding-card" id="cardPreview" ref={ref}>
      <div className="card-copy">
        <h2>
          <span data-preview-field="male_name">{values.male_name ?? "Male Name"}</span>
          <span className="ampersand" aria-hidden="true">
            &amp;
          </span>
          <span data-preview-field="female_name">{values.female_name ?? "Female Name"}</span>
        </h2>
        <div className="frames-container">
          <img className="frames" src={`${IMAGES}/frame-up.svg`} alt="" />
          <small className="date" data-preview-date>
            <strong data-preview-date-day>{day}</strong>
            <span data-preview-date-month>{month}</span>
          </small>
          <img className="frames" src={`${IMAGES}/frame.svg`} alt="" />
        </div>
        <p data-preview-field="wish" className="wish">
          {values.wish ?? "Your anniversary message"}
        </p>
      </div>
      <div className="person-frame">
        <img
          data-preview-image="profile_image"
          src={values.profile_image ?? DEFAULT_USER_IMAGE}
          alt="Couple image"
        />
      </div>
    </div>
  );
}
