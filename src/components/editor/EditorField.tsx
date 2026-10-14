"use client";

import type { CardField } from "@/types/cards";
import { UploadIcon } from "../icons";

interface EditorFieldProps {
  field: CardField;
  /** Current value; `undefined` while a text field has not been edited. */
  value: string | undefined;
  onChange: (key: string, value: string) => void;
  onImageSelected: (key: string, input: HTMLInputElement) => void;
}

export function EditorField({ field, value, onChange, onImageSelected }: EditorFieldProps) {
  const common = {
    id: field.key,
    name: field.key,
    className: "form-control",
    "data-editor-field": field.key,
  };
  const placeholder = `Enter ${field.label.toLowerCase()}`;

  const control = (() => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...common}
            rows={2}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
        );
      case "select":
        return (
          <select
            {...common}
            value={value ?? field.default}
            onChange={(event) => onChange(field.key, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "image": {
        const hintId = `${field.key}-hint`;
        const hasPhoto = value !== undefined && value !== field.default;

        // The native file input is stretched invisibly over the whole drop area,
        // so a click or a dropped file anywhere in it reaches the real control.
        return (
          <span className="upload-field">
            <span
              className="upload-thumb"
              aria-hidden="true"
              style={value ? { backgroundImage: `url(${JSON.stringify(value)})` } : undefined}
            />
            <span className="upload-copy">
              <span className="upload-title" aria-hidden="true">
                {hasPhoto ? "Change photo" : "Upload a photo"}
              </span>
              <span className="upload-hint" id={hintId}>
                Crop it after choosing.
              </span>
            </span>
            <span className="upload-action" aria-hidden="true">
              <UploadIcon />
            </span>
            <input
              {...common}
              type="file"
              accept="image/*"
              aria-describedby={hintId}
              onChange={(event) => onImageSelected(field.key, event.currentTarget)}
            />
          </span>
        );
      }
      case "text":
        return (
          <input
            {...common}
            type="text"
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
        );
    }
  })();

  return (
    <div className="editor-field">
      <label className="form-label" htmlFor={field.key}>
        {field.label}
      </label>
      {control}
    </div>
  );
}
