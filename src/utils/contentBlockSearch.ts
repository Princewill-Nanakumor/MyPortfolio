import { ContentBlock } from "@/types/Blog";

export function getContentBlockSearchText(block: ContentBlock): string {
  return [
    block.type,
    block.text || "",
    ...(block.items || []),
    block.imageUrl || "",
    block.videoUrl || "",
  ]
    .join(" ")
    .toLowerCase();
}

export function contentBlockMatchesSearch(
  block: ContentBlock,
  query: string
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return getContentBlockSearchText(block).includes(normalized);
}

export function getMatchingBlockIndices(
  content: ContentBlock[],
  query: string
): number[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return content.reduce<number[]>((matches, block, index) => {
    if (contentBlockMatchesSearch(block, normalized)) {
      matches.push(index);
    }
    return matches;
  }, []);
}

export function getContentBlockSummary(block: ContentBlock): string {
  if (block.text?.trim()) {
    return block.text.trim().replace(/\s+/g, " ").slice(0, 140);
  }

  if (block.items?.length) {
    const firstItem = block.items.find((item) => item.trim()) || block.items[0];
    const itemCount = block.items.length;
    return `${firstItem}${itemCount > 1 ? ` (+${itemCount - 1} more items)` : ""}`;
  }

  if (block.imageUrl) return `Image block`;
  if (block.videoUrl) return `Video block`;
  return "Empty block";
}
