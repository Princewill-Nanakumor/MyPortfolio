"use client";
import { useEffect, useState } from "react";
import { getVideoInfo, getYouTubeEmbedUrl } from "@/utils/videoUtils";

interface VideoEmbedProps {
  videoUrl: string;
  caption?: string;
  className?: string;
}

const VideoEmbed = ({ videoUrl, caption, className = "" }: VideoEmbedProps) => {
  const [hasError, setHasError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const info = getVideoInfo(videoUrl);

  useEffect(() => {
    setHasError(false);

    if (!info) {
      setEmbedUrl(null);
      return;
    }

    if (info.type === "youtube") {
      const youtubeId = info.embedUrl.match(/embed\/([^?]+)/)?.[1];
      setEmbedUrl(
        youtubeId
          ? getYouTubeEmbedUrl(youtubeId, window.location.origin)
          : info.embedUrl
      );
      return;
    }

    setEmbedUrl(info.embedUrl);
  }, [videoUrl, info]);

  if (!info) return null;

  if (hasError) {
    return (
      <div
        className={`p-4 text-center border border-red-200 rounded-xl bg-red-50 ${className}`}
      >
        <p className="text-sm text-red-700">Unable to load this video.</p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-secondary-indigo underline"
        >
          Open video in new tab
        </a>
      </div>
    );
  }

  const resolvedEmbedUrl = embedUrl || info.embedUrl;

  return (
    <div className={`not-prose break-inside-avoid ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-xl bg-black lg:rounded-2xl"
        style={{ aspectRatio: "16 / 9", minHeight: "200px" }}
      >
        {info.type === "direct" ? (
          <video
            key={resolvedEmbedUrl}
            src={resolvedEmbedUrl}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain bg-black"
            onError={() => setHasError(true)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            key={resolvedEmbedUrl}
            src={resolvedEmbedUrl}
            title={caption || "Embedded video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
      {caption && (
        <p className="mt-2 text-xs italic text-center text-gray-600 sm:text-sm lg:text-base">
          {caption}
        </p>
      )}
    </div>
  );
};

export default VideoEmbed;
