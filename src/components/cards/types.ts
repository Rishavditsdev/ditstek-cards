import type { Ref } from "react";
import type { CardValues } from "@/types/cards";

export interface CardProps {
  values: CardValues;
  /** Root element of the card; the editor captures it to export a PNG. */
  ref?: Ref<HTMLDivElement>;
}
