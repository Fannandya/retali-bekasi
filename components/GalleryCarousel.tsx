"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOptimizedUrl } from "@/lib/image";

type Props = {
  images: Array<{ url: string; path: string }>;
};

const AUTO_SCROLL_MS = 4000;

export function GalleryCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);
  const count = images?.length || 0;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_SCROLL_MS);
  }, [count]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  if (count === 0) return null;

  const prev = () => {
    setIndex((i) => (i === 0 ? count - 1 : i - 1));
    startTimer();
  };
  const next = () => {
    setIndex((i) => (i + 1) % count);
    startTimer();
  };

  return (
    <div className="gallery-carousel">
      {images.map((img, i) => (
        <img
          key={img.path || i}
          src={getOptimizedUrl(img.url, { width: 1400 }) ?? ""}
          alt=""
          className={`gallery-slide ${i === index ? "active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}

      {count > 1 && (
        <>
          <button onClick={prev} className="gallery-nav-btn gallery-nav-prev" aria-label="Sebelumnya">
            {"<"}
          </button>
          <button onClick={next} className="gallery-nav-btn gallery-nav-next" aria-label="Selanjutnya">
            {">"}
          </button>
        </>
      )}
    </div>
  );
}
