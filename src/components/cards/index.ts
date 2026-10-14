import type { ComponentType } from "react";
import type { TemplateId } from "@/data/card-templates";
import { BirthdayCard } from "./BirthdayCard";
import { WeddingAnniversaryCard } from "./WeddingAnniversaryCard";
import { WorkAnniversaryCard } from "./WorkAnniversaryCard";
import type { CardProps } from "./types";

/**
 * Card component for each template id. `satisfies Record<TemplateId, ...>`
 * makes adding a template to the data without a component here a compile error.
 */
export const cardComponents = {
  birthday: BirthdayCard,
  "wedding-anniversary": WeddingAnniversaryCard,
  "work-anniversary": WorkAnniversaryCard,
} satisfies Record<TemplateId, ComponentType<CardProps>>;

export type { CardProps } from "./types";
