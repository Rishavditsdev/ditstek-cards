"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cardComponents } from "@/components/cards";
import type { TemplateConfig } from "@/data/card-templates";
import { getDownloadFileName } from "@/lib/card-format";
import { getEditorFields, getInitialValues } from "@/lib/card-values";
import { getCategory } from "@/lib/templates";
import type { CardValues } from "@/types/cards";
import { ArrowIcon, DownloadIcon } from "../icons";
import { EditorField } from "./EditorField";
import { ImageCropperModal } from "./ImageCropperModal";

/** The photo that is currently being cropped. */
interface CropSession {
  fieldKey: string;
  imageUrl: string;
  aspectRatio: number;
}

interface CardEditorProps {
  template: TemplateConfig;
}

export function CardEditor({ template }: CardEditorProps) {
  const Card = cardComponents[template.id];
  const category = getCategory(template.category);

  const [values, setValues] = useState<CardValues>(() => getInitialValues(template));
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [cropSession, setCropSession] = useState<CropSession | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => () => revokeObjectUrl(), []);

  function revokeObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  function setValue(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleImageSelected(fieldKey: string, input: HTMLInputElement) {
    const file = input.files?.[0];
    const frame = previewRef.current?.querySelector(`[data-preview-image="${fieldKey}"]`);
    if (!file || !frame) {
      return;
    }

    // The photo has to fill the frame it is placed in, so crop to that frame's shape.
    const { width, height } = frame.getBoundingClientRect();
    const aspectRatio = width > 0 && height > 0 ? width / height : 1;

    revokeObjectUrl();
    const imageUrl = URL.createObjectURL(file);
    objectUrlRef.current = imageUrl;
    uploadInputRef.current = input;

    // The card shows the uncropped photo straight away; cropping refines it.
    setValue(fieldKey, imageUrl);
    setCropSession({ fieldKey, imageUrl, aspectRatio });
    setIsCropperOpen(true);
  }

  function handleCropApplied(dataUrl: string) {
    if (!cropSession) {
      return;
    }

    setValue(cropSession.fieldKey, dataUrl);
    // Clearing the input lets the same file be picked again later.
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
    setIsCropperOpen(false);
  }

  async function handleDownload() {
    const preview = previewRef.current;
    if (!preview) {
      return;
    }

    setIsDownloading(true);
    setDownloadFailed(false);

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(preview, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = getDownloadFileName(template, values);
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Could not generate the card PNG", error);
      setDownloadFailed(true);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <section className="editor-shell figma-editor">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-xl-9">
              <Card values={values} ref={previewRef} />
            </div>

            <div className="col-xl-3">
              <aside className="editor-panel figma-editor-panel">
                <div className="panel-inner">
                  <header className="panel-header">
                    <Link className="back-link" href={`/card-generator/templates/${template.category}`}>
                      <ArrowIcon direction="left" />
                      Back
                    </Link>
                    {category && <p className="eyebrow">{category.name}</p>}
                    <h1>{template.title}</h1>
                  </header>

                  <form id="cardEditorForm" onSubmit={(event) => event.preventDefault()}>
                    <div className="editor-fields">
                      {getEditorFields(template).map((field) => (
                        <EditorField
                          key={field.key}
                          field={field}
                          value={values[field.key]}
                          onChange={setValue}
                          onImageSelected={handleImageSelected}
                        />
                      ))}
                    </div>

                    <hr className="editor-divider" />

                    <button
                      className="btn btn-primary btn-download w-100"
                      type="button"
                      id="downloadPng"
                      disabled={isDownloading}
                      onClick={handleDownload}
                    >
                      {isDownloading ? <span className="btn-spinner" aria-hidden="true" /> : <DownloadIcon />}
                      {isDownloading ? "Preparing PNG..." : "Download PNG"}
                    </button>
                    {downloadFailed && (
                      <p className="editor-error" role="alert">
                        The PNG could not be created. Please try again.
                      </p>
                    )}
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <ImageCropperModal
        show={isCropperOpen}
        imageUrl={cropSession?.imageUrl ?? null}
        aspectRatio={cropSession?.aspectRatio ?? 1}
        onApply={handleCropApplied}
        onClose={() => setIsCropperOpen(false)}
      />
    </>
  );
}
