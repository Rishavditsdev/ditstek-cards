export interface CardCategory {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
}

interface FieldBase {
  /** Key used to store the field's value and to bind it to the card preview. */
  readonly key: string;
  readonly label: string;
}

export interface TextField extends FieldBase {
  readonly type: "text";
  /**
   * Carried over from the PHP config. As in the PHP editor, text inputs start
   * empty (so the card shows its placeholder) and this value is not applied.
   */
  readonly default: string;
}

export interface TextareaField extends FieldBase {
  readonly type: "textarea";
  readonly default: string;
}

export interface SelectOption {
  /** Public path of the image this option swaps into the card. */
  readonly value: string;
  readonly label: string;
}

export interface SelectField extends FieldBase {
  readonly type: "select";
  readonly default: string;
  readonly options: readonly SelectOption[];
}

export interface ImageField extends FieldBase {
  readonly type: "image";
  /** Public path of the placeholder shown until a photo is uploaded. */
  readonly default: string;
}

export type CardField = TextField | TextareaField | SelectField | ImageField;

export interface CardTemplate {
  /** URL-safe identifier. Also selects the card component (see `components/cards`). */
  readonly id: string;
  readonly title: string;
  /** Slug of the category this template belongs to. */
  readonly category: string;
  readonly description: string;
  /** Public path of the gallery preview image. */
  readonly preview: string;
  readonly fields: readonly CardField[];
}

/**
 * Current value of every editable field, keyed by `CardField.key`.
 * A key that is absent (`undefined`) has never been edited, so the card shows
 * its placeholder text; an empty string means the user cleared the field.
 */
export type CardValues = Readonly<Record<string, string | undefined>>;
