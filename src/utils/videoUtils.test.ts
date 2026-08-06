import { describe, it, expect } from "vitest";
import {
  getVideoInfo,
  getYouTubeEmbedUrl,
  isValidVideoUrl,
} from "./videoUtils";

describe("getVideoInfo", () => {
  it("parses YouTube watch URLs", () => {
    const info = getVideoInfo("https://www.youtube.com/watch?v=dQw4w9wgXcQ");
    expect(info?.type).toBe("youtube");
    expect(info?.embedUrl).toContain("youtube.com/embed/dQw4w9wgXcQ");
  });

  it("parses youtu.be short links", () => {
    const info = getVideoInfo("https://youtu.be/dQw4w9wgXcQ");
    expect(info?.type).toBe("youtube");
  });

  it("parses Vimeo URLs", () => {
    const info = getVideoInfo("https://vimeo.com/123456789");
    expect(info).toEqual({
      type: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456789",
      originalUrl: "https://vimeo.com/123456789",
    });
  });

  it("treats other https URLs as direct", () => {
    const info = getVideoInfo("https://cdn.example.com/clip.mp4");
    expect(info?.type).toBe("direct");
    expect(info?.embedUrl).toBe("https://cdn.example.com/clip.mp4");
  });

  it("rewrites Cloudinary video uploads to f_mp4", () => {
    const info = getVideoInfo(
      "https://res.cloudinary.com/demo/video/upload/v1/sample.mp4"
    );
    expect(info?.embedUrl).toContain("/video/upload/f_mp4/");
  });

  it("returns null for empty input", () => {
    expect(getVideoInfo("")).toBeNull();
    expect(getVideoInfo("   ")).toBeNull();
  });
});

describe("isValidVideoUrl", () => {
  it("returns true for youtube urls", () => {
    expect(isValidVideoUrl("https://youtu.be/dQw4w9wgXcQ")).toBe(true);
  });

  it("returns false for plain text", () => {
    expect(isValidVideoUrl("not-a-url")).toBe(false);
  });
});

describe("getYouTubeEmbedUrl", () => {
  it("builds embed url with defaults", () => {
    const url = getYouTubeEmbedUrl("dQw4w9wgXcQ");
    expect(url).toContain("https://www.youtube.com/embed/dQw4w9wgXcQ?");
    expect(url).toContain("rel=0");
    expect(url).toContain("modestbranding=1");
  });

  it("includes origin when provided", () => {
    const url = getYouTubeEmbedUrl("dQw4w9wgXcQ", "https://example.com");
    expect(url).toContain("origin=https%3A%2F%2Fexample.com");
  });
});
