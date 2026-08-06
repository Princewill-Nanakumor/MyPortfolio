import { describe, it, expect } from "vitest";
import {
  contentBlockMatchesSearch,
  getContentBlockSummary,
  getMatchingBlockIndices,
} from "./contentBlockSearch";
import type { ContentBlock } from "@/types/Blog";

const blocks: ContentBlock[] = [
  { type: "h2", text: "Deploy to Vercel" },
  { type: "paragraph", text: "Use Next.js App Router" },
  { type: "code", text: "npm run build" },
  { type: "list", items: ["MongoDB", "Mongoose"] },
  { type: "image", imageUrl: "https://cdn.example.com/shot.png" },
];

describe("contentBlockMatchesSearch", () => {
  it("matches case-insensitively", () => {
    expect(contentBlockMatchesSearch(blocks[0], "vercel")).toBe(true);
  });

  it("returns true for empty query", () => {
    expect(contentBlockMatchesSearch(blocks[0], "   ")).toBe(true);
  });

  it("matches list item text", () => {
    expect(contentBlockMatchesSearch(blocks[3], "mongoose")).toBe(true);
  });

  it("returns false when nothing matches", () => {
    expect(contentBlockMatchesSearch(blocks[1], "python")).toBe(false);
  });
});

describe("getMatchingBlockIndices", () => {
  it("returns indices of matching blocks", () => {
    expect(getMatchingBlockIndices(blocks, "next")).toEqual([1]);
  });

  it("returns empty array for empty query", () => {
    expect(getMatchingBlockIndices(blocks, "")).toEqual([]);
  });
});

describe("getContentBlockSummary", () => {
  it("summarizes text blocks", () => {
    expect(getContentBlockSummary(blocks[0])).toBe("Deploy to Vercel");
  });

  it("summarizes list blocks with count", () => {
    expect(getContentBlockSummary(blocks[3])).toBe("MongoDB (+1 more items)");
  });

  it("summarizes image blocks", () => {
    expect(getContentBlockSummary(blocks[4])).toBe("Image block");
  });

  it("labels empty blocks", () => {
    expect(getContentBlockSummary({ type: "paragraph" })).toBe("Empty block");
  });
});
