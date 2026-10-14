/* eslint-disable @next/next/no-img-element --
   Cards are rasterised with html2canvas and show user-supplied data URLs, so
   they need plain <img> elements rather than next/image. */
import { DEFAULT_USER_IMAGE } from "@/data/card-templates";
import type { CardProps } from "./types";

const FIRST_YEAR_IMAGE = "/assets/images/templates/work-anniversary/first-work-anniversary.svg";

export function WorkAnniversaryCard({ values, ref }: CardProps) {
  return (
    <div className="work-card" id="cardPreview" ref={ref}>
      <div className="work-copy">
        <img
          data-preview-image="main_image"
          src={values.main_image ?? FIRST_YEAR_IMAGE}
          alt="Work anniversary celebration"
        />
        <p data-preview-field="sub_content">{values.sub_content ?? "Your message"}</p>
      </div>
      <div className="work-person-frame">
        <img
          data-preview-image="profile_image"
          src={values.profile_image ?? DEFAULT_USER_IMAGE}
          alt="Profile image"
        />
        <div className="work-person-meta">
          <img src="/assets/images/templates/work-anniversary/user.svg" alt="Employee profile" />
          <div className="work-person-details">
            <h2 data-preview-field="name">{values.name ?? "Name"}</h2>
            <h5 data-preview-field="designation">{values.designation ?? "Job Title"}</h5>
            <div className="d-flex align-items-center gap-1">
              <img className="calendar-icon" src="/assets/images/calendar.svg" alt="Calendar icon" />
              <h6 data-preview-field="date">{values.date ?? "Date"}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
