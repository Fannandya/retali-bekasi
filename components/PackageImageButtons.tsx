"use client";

import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

type Props = {
  brochureUrl: string | null;
  itineraryUrl: string | null;
  packageName: string;
};

export function PackageImageButtons({ brochureUrl, itineraryUrl, packageName }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  if (!brochureUrl && !itineraryUrl) return null;

  return (
    <>
      <div className="flex gap-3 mt-4">
        {itineraryUrl && (
          <button
            onClick={() => setLightbox({ src: itineraryUrl, alt: `Itinerary ${packageName}` })}
            className="btn btn-ghost"
          >
            Lihat Itinerary
          </button>
        )}
        {brochureUrl && (
          <button
            onClick={() => setLightbox({ src: brochureUrl, alt: `Brosur ${packageName}` })}
            className="btn btn-ghost"
          >
            Lihat Brosur
          </button>
        )}
      </div>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
