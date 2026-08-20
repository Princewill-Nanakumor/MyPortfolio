import type { ContentBlock } from "@/types/Blog";

const VALID_BLOCK_TYPES = new Set<ContentBlock["type"]>([
  "paragraph",
  "h1",
  "h2",
  "h3",
  "code",
  "list",
  "image",
  "video",
]);

/** Legacy / pasted aliases → schema enum values */
const TYPE_ALIASES: Record<string, ContentBlock["type"]> = {
  heading: "h2",
  header: "h2",
  title: "h1",
  text: "paragraph",
  p: "paragraph",
  para: "paragraph",
  ul: "list",
  ol: "list",
  bullet: "list",
  bullets: "list",
  img: "image",
  photo: "image",
  picture: "image",
};

function resolveBlockType(
  rawType: unknown,
  block: Record<string, unknown>
): ContentBlock["type"] {
  const key = String(rawType ?? "")
    .trim()
    .toLowerCase();

  if (VALID_BLOCK_TYPES.has(key as ContentBlock["type"])) {
    return key as ContentBlock["type"];
  }

  if (key && TYPE_ALIASES[key]) {
    return TYPE_ALIASES[key];
  }

  if (Array.isArray(block.items) && block.items.length > 0) return "list";
  if (typeof block.imageUrl === "string" && block.imageUrl.trim()) return "image";
  if (typeof block.videoUrl === "string" && block.videoUrl.trim()) return "video";

  return "paragraph";
}

/**
 * Strips Mongo subdoc ids and maps invalid/legacy block types
 * (e.g. `heading`) onto schema-allowed values so updates validate.
 */
export function normalizeContentBlocks(content: unknown): ContentBlock[] {
  if (!Array.isArray(content)) return [];

  return content.map((raw) => {
    if (!raw || typeof raw !== "object") {
      return { type: "paragraph", text: "", items: [] };
    }

    const block = raw as Record<string, unknown>;
    const {
      _id: _ignoredId,
      __v: _ignoredV,
      type: rawType,
      text,
      items,
      imageUrl,
      videoUrl,
    } = block;

    const normalized: ContentBlock = {
      type: resolveBlockType(rawType, block),
      text: typeof text === "string" ? text : "",
      items: Array.isArray(items)
        ? items.filter((item): item is string => typeof item === "string")
        : [],
    };

    if (typeof imageUrl === "string" && imageUrl.trim()) {
      normalized.imageUrl = imageUrl;
    }
    if (typeof videoUrl === "string" && videoUrl.trim()) {
      normalized.videoUrl = videoUrl;
    }

    return normalized;
  });
}
