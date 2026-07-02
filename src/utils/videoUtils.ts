export type VideoSourceType = "youtube" | "vimeo" | "direct";

export interface VideoInfo {
  type: VideoSourceType;
  embedUrl: string;
  originalUrl: string;
}

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/;

export function getVideoInfo(url: string): VideoInfo | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return {
        type: "youtube",
        embedUrl: getYouTubeEmbedUrl(match[1]),
        originalUrl: trimmed,
      };
    }
  }

  const vimeoMatch = trimmed.match(VIMEO_PATTERN);
  if (vimeoMatch?.[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed,
    };
  }

  if (/^https?:\/\/.+/i.test(trimmed)) {
    return {
      type: "direct",
      embedUrl: getDirectPlaybackUrl(trimmed),
      originalUrl: trimmed,
    };
  }

  return null;
}

export function isValidVideoUrl(url: string): boolean {
  return getVideoInfo(url) !== null;
}

function getDirectPlaybackUrl(url: string): string {
  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes("/video/upload/")
  ) {
    return url;
  }

  if (url.includes("/video/upload/f_mp4/")) {
    return url;
  }

  return url.replace("/video/upload/", "/video/upload/f_mp4/");
}

export function getYouTubeEmbedUrl(videoId: string, origin?: string): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  if (origin) {
    params.set("origin", origin);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
