"use client";

/* eslint-disable @next/next/no-img-element --
   Cropper.js operates on a plain <img> that holds a local blob URL. */
import type Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";

/** Width, in pixels, of the cropped photo that is placed on the card. */
const OUTPUT_WIDTH = 1000;

interface ImageCropperModalProps {
  show: boolean;
  imageUrl: string | null;
  /** Width / height of the frame on the card that the photo has to fill. */
  aspectRatio: number;
  /** Called with the cropped photo as a JPEG data URL. */
  onApply: (dataUrl: string) => void;
  onClose: () => void;
}

export function ImageCropperModal({
  show,
  imageUrl,
  aspectRatio,
  onApply,
  onClose,
}: ImageCropperModalProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  // Cropper measures its container, so it is created once the modal has finished animating in.
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (!isShown || !image) {
      return;
    }

    let cancelled = false;
    let instance: Cropper | undefined;

    // Cropper.js touches `window` on import, so it is loaded in the browser only.
    import("cropperjs").then(({ default: CropperClass }) => {
      if (cancelled) {
        return;
      }
      instance = new CropperClass(image, {
        aspectRatio,
        viewMode: 1,
        dragMode: "move",
        autoCropArea: 0.9,
        responsive: true,
        background: false,
      });
      cropperRef.current = instance;
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      cropperRef.current = null;
    };
  }, [isShown, imageUrl, aspectRatio]);

  function handleApply() {
    const canvas = cropperRef.current?.getCroppedCanvas({
      width: OUTPUT_WIDTH,
      height: Math.round(OUTPUT_WIDTH / aspectRatio),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (canvas) {
      onApply(canvas.toDataURL("image/jpeg", 0.92));
    }
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      onEntered={() => setIsShown(true)}
      onExited={() => setIsShown(false)}
      size="lg"
      centered
      className="image-cropper-modal"
      aria-labelledby="imageCropperTitle"
    >
      <Modal.Header closeButton closeLabel="Close image editor">
        <div>
          <span className="cropper-kicker">Image editor</span>
          <h2 className="modal-title" id="imageCropperTitle">
            Adjust your photo
          </h2>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="cropper-stage">
          <img
            id="cropperImage"
            ref={imageRef}
            src={imageUrl ?? undefined}
            alt="Photo ready to crop"
          />
        </div>
        <p className="cropper-help">
          Drag to reposition and use the controls to zoom your photo inside the card frame.
        </p>
      </Modal.Body>
      <Modal.Footer className="gap-1">
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" id="applyCrop" onClick={handleApply}>
          Apply Photo
        </button>
      </Modal.Footer>
    </Modal>
  );
}
