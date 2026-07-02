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
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
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
    const playbackUrl = trimmed.includes("res.cloudinary.com") &&
      trimmed.includes("/video/upload/")
      ? trimmed.replace("/video/upload/", "/video/upload/f_mp4/")
      : trimmed;

    return {
      type: "direct",
      embedUrl: playbackUrl,
      originalUrl: trimmed,
    };
  }

  return null;
}

export function isValidVideoUrl(url: string): boolean {
  return getVideoInfo(url) !== null;
}
