"use client";

import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";
import { getOptimizedUrl } from "@/lib/image";

type Props = {
  brochureUrl: string | null;
  itineraryUrl: string | null;
  packageName: string;
};

export function PackageImageButtons({ brochureUrl, itineraryUrl, packageName }: Props) {
  const bUrl = getOptimizedUrl(brochureUrl, { quality: 100 });
  const iUrl = getOptimizedUrl(itineraryUrl, { quality: 100 });
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  if (!bUrl && !iUrl) return null;

  return (
    <>
      <div className="flex gap-3 mt-4">
        {iUrl && (
          <button
            onClick={() => setLightbox({ src: iUrl, alt: `Itinerary ${packageName}` })}
            className="btn btn-ghost"
          >
            Lihat Itinerary
          </button>
        )}
        {bUrl && (
          <button
            onClick={() => setLightbox({ src: bUrl, alt: `Brosur ${packageName}` })}
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
