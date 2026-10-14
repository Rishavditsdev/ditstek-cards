import { describe, expect, it } from "vitest";
import { getDownloadFileName, splitDate } from "@/lib/card-format";
import { getTemplate } from "@/lib/templates";

describe("splitDate", () => {
  it("shows the placeholder while the field has never been edited", () => {
    expect(splitDate(undefined)).toEqual({ day: "Date", month: "" });
  });

  it("splits a day and month", () => {
    expect(splitDate("12th August")).toEqual({ day: "12th", month: "August" });
  });

  it("copes with extra whitespace", () => {
    expect(splitDate("  2nd    May  ")).toEqual({ day: "2nd", month: "May" });
  });

  it("puts a single word in the day", () => {
    expect(splitDate("Today")).toEqual({ day: "Today", month: "" });
  });

  it("falls back to the placeholder day when the field is cleared", () => {
    expect(splitDate("")).toEqual({ day: "Date", month: "" });
    expect(splitDate("   ")).toEqual({ day: "Date", month: "" });
  });

  it("only uses the first two words, as the badge on the card has room for two", () => {
    expect(splitDate("12th August 2025")).toEqual({ day: "12th", month: "August" });
  });
});

describe("getDownloadFileName", () => {
  const wedding = getTemplate("wedding-anniversary")!;
  const birthday = getTemplate("birthday")!;
  const work = getTemplate("work-anniversary")!;

  it("joins every name field", () => {
    expect(getDownloadFileName(wedding, { male_name: "Rahul", female_name: "Neha" })).toBe(
      "rahul-neha.png",
    );
  });

  it("uses a single name", () => {
    expect(getDownloadFileName(birthday, { name: "Priya Sharma" })).toBe("priya-sharma.png");
  });

  it("collapses punctuation and trims separators", () => {
    expect(getDownloadFileName(work, { name: "  --O'Brien, Jr.!  " })).toBe("o-brien-jr.png");
  });

  it("skips name fields that are empty or untouched", () => {
    expect(getDownloadFileName(wedding, { male_name: "Rahul", female_name: "  " })).toBe(
      "rahul.png",
    );
  });

  it("falls back to a generic name when no name has been entered", () => {
    expect(getDownloadFileName(birthday, {})).toBe("ditstek-card.png");
    expect(getDownloadFileName(birthday, { name: "!!!" })).toBe("ditstek-card.png");
  });

  it("ignores fields that are not names", () => {
    expect(getDownloadFileName(work, { designation: "Engineer", date: "2nd May" })).toBe(
      "ditstek-card.png",
    );
  });
});
