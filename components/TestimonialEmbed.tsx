"use client";

import { useState, useEffect } from "react";
import { getYoutubeThumbnail } from "@/lib/youtube";

type Props = {
  platform?: string;
  videoUrl?: string;
  youtubeId?: string;
  imageUrl?: string;
  type?: string;
  title?: string;
  description?: string;
};

function InstagramCard({ postUrl, shortcode, title }: { postUrl: string; shortcode: string | null; title?: string }) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!shortcode) return;
    fetch(`https://api.instagram.com/oembed?url=https://www.instagram.com/p/${shortcode}/`)
      .then((r) => r.json())
      .then((d) => { if (d.thumbnail_url) setThumb(d.thumbnail_url); })
      .catch(() => {});
  }, [shortcode]);

  if (thumb) {
    return (
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="video"
      >
        <img src={thumb} alt={title || ""} />
        <div className="play">
          <InstagramIcon dark />
        </div>
        {title && <span className="vcap">{title}</span>}
      </a>
    );
  }

  return (
    <a
      href={postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="video ig-card"
    >
      <InstagramIcon />
      {title && <span className="vcap">{title}</span>}
      <span className="ig-label">Buka di Instagram</span>
    </a>
  );
}

function InstagramIcon({ dark }: { dark?: boolean }) {
  const c = dark ? "#0f5132" : "#fff";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill={c} stroke="none" />
    </svg>
  );
}

export function TestimonialEmbed({ platform, videoUrl, youtubeId, imageUrl, type, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (type === "image" && imageUrl) {
    return (
      <div className="video">
        <img src={imageUrl} alt={title || ""} />
        {title && <span className="vcap">{title}</span>}
      </div>
    );
  }

  if (platform === "youtube" && youtubeId) {
    if (playing) {
      return (
        <div className="video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title || "YouTube"}
            allow="autoplay; encrypted-media"
            allowFullScreen
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

  if (platform === "instagram") {
    const shortcode = extractInstagramShortcode(videoUrl || "");
    const postUrl = shortcode
      ? `https://www.instagram.com/p/${shortcode}/`
      : videoUrl || "";

    return <InstagramCard postUrl={postUrl} shortcode={shortcode} title={title} />;
  }

  if (platform === "tiktok") {
    const videoId = extractTikTokId(videoUrl || "");
    const embedUrl = videoId
      ? `https://www.tiktok.com/embed/v2/${videoId}`
      : videoUrl || "";

    return (
      <div className="video">
        <iframe
          src={embedUrl}
          title={title || "TikTok"}
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </div>
    );
  }

  return (
    <div className="video">
      <iframe
        src={videoUrl || ""}
        title={title || "Video"}
        allowFullScreen
      />
    </div>
  );
}

function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function extractTikTokId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (match) return match[1];
  const vmMatch = url.match(/vm\.tiktok\.com\/([\w]+)/);
  if (vmMatch) return vmMatch[1];
  return null;
}
