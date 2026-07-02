"use client";
import { useState } from "react";
import { getVideoInfo } from "@/utils/videoUtils";

interface VideoEmbedProps {
  videoUrl: string;
  caption?: string;
  className?: string;
}

const VideoEmbed = ({ videoUrl, caption, className = "" }: VideoEmbedProps) => {
  const [hasError, setHasError] = useState(false);
  const info = getVideoInfo(videoUrl);

  if (!info) return null;

  if (hasError) {
    return (
      <div className={`p-4 text-center border border-red-200 rounded-xl bg-red-50 ${className}`}>
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

  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden rounded-xl aspect-video bg-black lg:rounded-2xl">
        {info.type === "direct" ? (
          <video
            src={info.embedUrl}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full"
            onError={() => setHasError(true)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={info.embedUrl}
            title={caption || "Embedded video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            onError={() => setHasError(true)}
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
