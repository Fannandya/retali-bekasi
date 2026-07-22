"use client";

import { useState } from "react";
import { getYoutubeThumbnail } from "@/lib/youtube";

export function YouTubeEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title || "YouTube video"}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div
      className="video"
      onClick={() => setPlaying(true)}
      onKeyDown={(e) => e.key === "Enter" && setPlaying(true)}
      tabIndex={0}
      role="button"
      aria-label={title || "Play video"}
    >
      <img
        src={getYoutubeThumbnail(youtubeId)}
        alt={title || ""}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="play">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f5132">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      {title && <span className="vcap">{title}</span>}
    </div>
  );
}
