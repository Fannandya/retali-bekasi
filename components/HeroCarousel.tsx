"use client";

import { useEffect, useRef, useState } from "react";
import { getOptimizedUrl } from "@/lib/image";

type Props = {
  images: Array<{ url: string; path: string }>;
};

const AUTO_SCROLL_MS = 5000;

export function HeroCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);
  const count = images?.length || 0;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (count <= 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_SCROLL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  if (count === 0) {
    return <div className="hero-bg hero-bg-empty" aria-hidden="true" />;
  }

  return (
    <div className="hero-bg" aria-hidden="true">
      {images.map((img, i) => (
        <img
          key={img.path || i}
          src={getOptimizedUrl(img.url, { width: 1600 }) ?? ""}
          alt=""
          className={`hero-bg-slide ${i === index ? "active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
        />
      ))}
      <div className="hero-bg-overlay" />
    </div>
  );
}
