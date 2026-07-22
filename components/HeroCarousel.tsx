"use client";

import { useState } from "react";

type Props = {
  images: Array<{ url: string; path: string }>;
};

export function HeroCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="ph" />;
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="hero-carousel">
      <img src={images[index].url} alt="" className="hero-img" />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hero-carousel-btn hero-carousel-prev"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={next}
            className="hero-carousel-btn hero-carousel-next"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div className="hero-carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`hero-carousel-dot ${i === index ? "active" : ""}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
