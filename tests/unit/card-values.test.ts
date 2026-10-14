import { describe, expect, it } from "vitest";
import { DEFAULT_USER_IMAGE } from "@/data/card-templates";
import { getEditorFields, getInitialValues } from "@/lib/card-values";
import { getTemplate } from "@/lib/templates";

describe("getInitialValues", () => {
  it("leaves text inputs untouched so the card shows its placeholders", () => {
    const values = getInitialValues(getTemplate("birthday")!);

    expect(values).not.toHaveProperty("name");
    expect(values).not.toHaveProperty("date");
  });

  it("starts the image field on the default avatar", () => {
    expect(getInitialValues(getTemplate("birthday")!).main_image).toBe(DEFAULT_USER_IMAGE);
  });

  it("pre-fills textareas, selects and images with their defaults", () => {
    const values = getInitialValues(getTemplate("work-anniversary")!);

    expect(values.sub_content).toMatch(/^Congratulations on completing 1 year with us\./);
    expect(values.main_image).toBe(
      "/assets/images/templates/work-anniversary/first-work-anniversary.svg",
    );
    expect(values.profile_image).toBe(DEFAULT_USER_IMAGE);
    expect(values).not.toHaveProperty("name");
    expect(values).not.toHaveProperty("designation");
    expect(values).not.toHaveProperty("date");
  });

  it("pre-fills the wedding message but not the names or date", () => {
    const values = getInitialValues(getTemplate("wedding-anniversary")!);

    expect(values.wish).toMatch(/^Wishing you both a beautiful anniversary/);
    expect(values).not.toHaveProperty("male_name");
    expect(values).not.toHaveProperty("female_name");
    expect(values).not.toHaveProperty("date");
  });
});

describe("getEditorFields", () => {
  it("lists the anniversary year select first, then the other fields in order", () => {
    const keys = getEditorFields(getTemplate("work-anniversary")!).map((field) => field.key);

    expect(keys).toEqual(["main_image", "sub_content", "name", "designation", "date", "profile_image"]);
  });

  it("keeps the configured order when there is no select", () => {
    const keys = getEditorFields(getTemplate("wedding-anniversary")!).map((field) => field.key);

    expect(keys).toEqual(["male_name", "female_name", "date", "wish", "profile_image"]);
  });
});
