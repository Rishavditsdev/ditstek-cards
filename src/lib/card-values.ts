import type { CardField, CardTemplate, CardValues } from "@/types/cards";

/**
 * Starting values for a template's editor.
 *
 * Text inputs start empty, so the card shows its placeholder ("Name", "Date",
 * ...). Textareas, selects and images start with their configured default.
 */
export function getInitialValues(template: CardTemplate): CardValues {
  const values: Record<string, string> = {};

  for (const field of template.fields) {
    if (field.type !== "text") {
      values[field.key] = field.default;
    }
  }

  return values;
}

/** Selects (e.g. the anniversary year) are listed first in the editor panel. */
export function getEditorFields(template: CardTemplate): CardField[] {
  const isSelect = (field: CardField) => field.type === "select";

  return [
    ...template.fields.filter(isSelect),
    ...template.fields.filter((field) => !isSelect(field)),
  ];
}
