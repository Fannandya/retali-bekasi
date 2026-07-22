"use client";

import { useEffect, useCallback } from "react";

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

export function ImageLightbox({ src, alt, onClose }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 rounded-full text-white text-xl hover:bg-white/40 transition z-10"
        aria-label="Tutup"
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
