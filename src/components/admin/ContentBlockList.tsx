"use client";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ContentBlock } from "@/types/Blog";
import { HiPencil, HiArrowUp, HiArrowDown, HiTrash } from "react-icons/hi";
import ContentBlockEditor from "./ContentBlockEditor";
import ContentBlockPreview from "./ContentBlockPreview";
import { NewContentItem } from "./../../types/Blog";

interface ContentBlockListProps {
  content: ContentBlock[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export interface ContentBlockListRef {
  flushEditingChanges: () => void;
}

const ContentBlockList = forwardRef<ContentBlockListRef, ContentBlockListProps>(
  ({ content, setFormData }, ref) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<NewContentItem>({
    type: "paragraph",
    text: "",
    items: [],
    imageUrl: "",
  });

  // Start editing a content block
  const startEditing = (index: number): void => {
    const contentBlock = content[index];
    if (contentBlock) {
      setEditingIndex(index);
      setEditingContent({
        type: contentBlock.type,
        text: contentBlock.text || "",
        items: contentBlock.items || [],
        imageUrl: contentBlock.imageUrl || "",
      });
    }
  };

  // Save edited content
  const saveEdit = (): void => {
    if (editingIndex !== null) {
      const hasOtherH1 = content.some(
        (block, index) => block.type === "h1" && index !== editingIndex
      );

      if (editingContent.type === "h1" && hasOtherH1) {
        alert("Only one H1 is allowed per post.");
        return;
      }

      const contentBlock: ContentBlock = {
        type: editingContent.type,
        text: editingContent.text,
        items: editingContent.items,
        ...(editingContent.imageUrl && {
          imageUrl: editingContent.imageUrl,
        }),
      };

      setFormData((prev: any) => ({
        ...prev,
        content: (prev.content || []).map(
          (item: ContentBlock, index: number) =>
            index === editingIndex ? contentBlock : item
        ),
      }));

      setEditingIndex(null);
      setEditingContent({
        type: "paragraph",
        text: "",
        items: [],
        imageUrl: "",
      });
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      flushEditingChanges: saveEdit,
    }),
    [saveEdit]
  );

  // Cancel editing
  const cancelEdit = (): void => {
    setEditingIndex(null);
    setEditingContent({
      type: "paragraph",
      text: "",
      items: [],
      imageUrl: "",
    });
  };

  const removeContentItem = (index: number): void => {
    setFormData((prev: any) => ({
      ...prev,
      content: (prev.content || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const moveContentItem = (index: number, direction: "up" | "down"): void => {
    const newContent = [...content];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newContent.length) {
      [newContent[index], newContent[newIndex]] = [
        newContent[newIndex],
        newContent[index],
      ];
      setFormData((prev: any) => ({
        ...prev,
        content: newContent,
      }));
    }
  };

  if (content.length === 0) return null;

  return (
    <div className="space-y-4">
      {content.map((item, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 bg-gray-50 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium text-white rounded bg-secondary-indigo">
                {item.type}
              </span>
              <span className="text-sm text-gray-500">Block {index + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEditing(index)}
                className="p-1 text-blue-400 hover:text-blue-600"
                title="Edit block"
              >
                <HiPencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveContentItem(index, "up")}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <HiArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveContentItem(index, "down")}
                disabled={index === content.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <HiArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeContentItem(index)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {editingIndex === index ? (
            <ContentBlockEditor
              content={editingContent}
              setContent={setEditingContent}
              onSave={saveEdit}
              onCancel={cancelEdit}
              isEditing={true}
              hasExistingH1={content.some(
                (block, blockIndex) =>
                  block.type === "h1" && blockIndex !== index
              )}
            />
          ) : (
            <ContentBlockPreview item={item} />
          )}
        </div>
      ))}
    </div>
  );
});

ContentBlockList.displayName = "ContentBlockList";

export default ContentBlockList;
