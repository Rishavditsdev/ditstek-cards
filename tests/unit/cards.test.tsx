import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BirthdayCard } from "@/components/cards/BirthdayCard";
import { WeddingAnniversaryCard } from "@/components/cards/WeddingAnniversaryCard";
import { WorkAnniversaryCard } from "@/components/cards/WorkAnniversaryCard";
import { cardComponents } from "@/components/cards";
import { DEFAULT_USER_IMAGE, cardTemplates } from "@/data/card-templates";
import { getInitialValues } from "@/lib/card-values";

const text = (container: HTMLElement, field: string) =>
  container.querySelector(`[data-preview-field="${field}"]`)?.textContent;
const imageSrc = (container: HTMLElement, field: string) =>
  container.querySelector(`[data-preview-image="${field}"]`)?.getAttribute("src");

describe("BirthdayCard", () => {
  it("shows placeholders until fields are edited", () => {
    const { container } = render(<BirthdayCard values={{}} />);

    expect(text(container, "name")).toBe("Name");
    expect(text(container, "date")).toBe("Date");
    expect(imageSrc(container, "main_image")).toBe(DEFAULT_USER_IMAGE);
  });

  it("shows the entered values", () => {
    const { container } = render(
      <BirthdayCard values={{ name: "Priya", date: "14 October", main_image: "data:image/jpeg;base64,AAAA" }} />,
    );

    expect(text(container, "name")).toBe("Priya");
    expect(text(container, "date")).toBe("14 October");
    expect(imageSrc(container, "main_image")).toBe("data:image/jpeg;base64,AAAA");
  });

  it("shows nothing, not the placeholder, once a field has been cleared", () => {
    const { container } = render(<BirthdayCard values={{ name: "", date: "" }} />);

    expect(text(container, "name")).toBe("");
    expect(text(container, "date")).toBe("");
  });
});

describe("WorkAnniversaryCard", () => {
  it("shows placeholders until fields are edited", () => {
    const { container } = render(<WorkAnniversaryCard values={{}} />);

    expect(text(container, "name")).toBe("Name");
    expect(text(container, "designation")).toBe("Job Title");
    expect(text(container, "date")).toBe("Date");
    expect(text(container, "sub_content")).toBe("Your message");
  });

  it("shows the entered values and chosen year image", () => {
    const { container } = render(
      <WorkAnniversaryCard
        values={{
          name: "Rohan Rana",
          designation: "Engineer",
          date: "2nd May",
          sub_content: "Well done!",
          main_image: "/assets/images/templates/work-anniversary/fifth-work-anniversary.svg",
        }}
      />,
    );

    expect(text(container, "name")).toBe("Rohan Rana");
    expect(text(container, "designation")).toBe("Engineer");
    expect(text(container, "date")).toBe("2nd May");
    expect(text(container, "sub_content")).toBe("Well done!");
    expect(imageSrc(container, "main_image")).toContain("fifth-work-anniversary.svg");
  });
});

describe("WeddingAnniversaryCard", () => {
  it("shows placeholders until fields are edited", () => {
    const { container } = render(<WeddingAnniversaryCard values={{}} />);

    expect(text(container, "male_name")).toBe("Male Name");
    expect(text(container, "female_name")).toBe("Female Name");
    expect(text(container, "wish")).toBe("Your anniversary message");
    expect(container.querySelector("[data-preview-date-day]")?.textContent).toBe("Date");
    expect(container.querySelector("[data-preview-date-month]")?.textContent).toBe("");
  });

  it("splits the date into a day and a month", () => {
    const { container } = render(<WeddingAnniversaryCard values={{ date: "12th August" }} />);

    expect(container.querySelector("[data-preview-date-day]")?.textContent).toBe("12th");
    expect(container.querySelector("[data-preview-date-month]")?.textContent).toBe("August");
  });

  it("joins the two names with an ampersand", () => {
    const { container } = render(<WeddingAnniversaryCard values={{ male_name: "Rahul", female_name: "Neha" }} />);

    expect(container.querySelector("h2")?.textContent).toBe("Rahul&Neha");
  });
});

describe("every template", () => {
  it.each(cardTemplates.map((template) => [template.id, template] as const))(
    "%s has a card element for each of its editable fields",
    (id, template) => {
      const Card = cardComponents[id];
      const { container } = render(<Card values={getInitialValues(template)} />);

      for (const field of template.fields) {
        const isWeddingDate = id === "wedding-anniversary" && field.key === "date";
        const selector = isWeddingDate
          ? "[data-preview-date]"
          : `[data-preview-field="${field.key}"], [data-preview-image="${field.key}"]`;

        expect(container.querySelector(selector), `${id}.${field.key}`).not.toBeNull();
      }
    },
  );

  it.each(cardTemplates.map((template) => [template.id] as const))(
    "%s exposes the card root through the ref prop",
    (id) => {
      const Card = cardComponents[id];
      let root: HTMLDivElement | null = null;
      render(<Card values={{}} ref={(element) => { root = element; }} />);

      expect(root).not.toBeNull();
      expect((root as unknown as HTMLElement).id).toBe("cardPreview");
    },
  );
});
