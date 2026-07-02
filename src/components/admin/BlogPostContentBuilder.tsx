"use client";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { BlogPost, ContentBlock } from "@/types/Blog";
import ContentBlockEditor from "./ContentBlockEditor";
import ContentBlockList, { ContentBlockListRef } from "./ContentBlockList";
import { NewContentItem } from "./../../types/Blog";

// Define the ref interface
export interface BlogPostContentBuilderRef {
  autoSaveContent: () => void;
  getPendingContentBlock: () => ContentBlock | null;
}

interface BlogPostContentBuilderProps {
  formData: Partial<BlogPost>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
}

const BlogPostContentBuilder = forwardRef<
  BlogPostContentBuilderRef,
  BlogPostContentBuilderProps
>(({ formData, setFormData }, ref) => {
  const [newContentItem, setNewContentItem] = useState<NewContentItem>({
    type: "paragraph",
    text: "",
    items: [],
    imageUrl: "",
    videoUrl: "",
  });
  const [hasUnsavedContent, setHasUnsavedContent] = useState<boolean>(false);
  const contentBlockListRef = useRef<ContentBlockListRef>(null);

  // Check if there's unsaved content
  useEffect(() => {
    const hasContent =
      newContentItem.text.trim() ||
      newContentItem.items.length > 0 ||
      newContentItem.imageUrl ||
      newContentItem.videoUrl;
    setHasUnsavedContent(!!hasContent);
  }, [newContentItem]);

  const addContentItem = useCallback((): void => {
    const hasExistingH1 = (formData.content || []).some(
      (block) => block.type === "h1"
    );

    if (newContentItem.type === "h1" && hasExistingH1) {
      alert("Only one H1 is allowed per post.");
      return;
    }

    if (
      newContentItem.text.trim() ||
      newContentItem.items.length > 0 ||
      newContentItem.imageUrl ||
      newContentItem.videoUrl
    ) {
      const contentBlock: ContentBlock = {
        type: newContentItem.type,
        text: newContentItem.text,
        items: newContentItem.items,
        ...(newContentItem.imageUrl && {
          imageUrl: newContentItem.imageUrl,
        }),
        ...(newContentItem.videoUrl && {
          videoUrl: newContentItem.videoUrl,
        }),
      };

      setFormData((prev) => ({
        ...prev,
        content: [...(prev.content || []), contentBlock],
      }));

      // Reset form
      setNewContentItem({
        type: "paragraph",
        text: "",
        items: [],
        imageUrl: "",
        videoUrl: "",
      });
    }
  }, [newContentItem, setFormData, formData.content]);

  // Auto-save function
  const autoSaveContent = useCallback((): void => {
    contentBlockListRef.current?.flushEditingChanges();
    if (hasUnsavedContent) {
      addContentItem();
    }
  }, [hasUnsavedContent, addContentItem]);

  const getPendingContentBlock = useCallback((): ContentBlock | null => {
    if (
      !newContentItem.text.trim() &&
      newContentItem.items.length === 0 &&
      !newContentItem.imageUrl &&
      !newContentItem.videoUrl
    ) {
      return null;
    }

    return {
      type: newContentItem.type,
      text: newContentItem.text,
      items: newContentItem.items,
      ...(newContentItem.imageUrl && {
        imageUrl: newContentItem.imageUrl,
      }),
      ...(newContentItem.videoUrl && {
        videoUrl: newContentItem.videoUrl,
      }),
    };
  }, [newContentItem]);

  // Expose auto-save function to parent component
  useImperativeHandle(
    ref,
    () => ({
      autoSaveContent,
      getPendingContentBlock,
    }),
    [autoSaveContent, getPendingContentBlock]
  );

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-text-primary">
        Content Blocks
      </label>

      {/* Unsaved Content Warning */}
      {hasUnsavedContent && (
        <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-yellow-800">
              You have unsaved content. Click &ldquo;Add Block&rdquo; to save
              it, or it will be auto-saved when you proceed.
            </p>
          </div>
        </div>
      )}

      {/* Existing Content */}
      <ContentBlockList
        ref={contentBlockListRef}
        content={formData.content || []}
        setFormData={setFormData}
      />

      {/* Add New Content */}
      <div className="p-4 border-2 border-gray-300 border-dashed rounded-xl">
        <ContentBlockEditor
          content={newContentItem}
          setContent={setNewContentItem}
          onSave={addContentItem}
          isEditing={false}
          hasExistingH1={(formData.content || []).some(
            (block) => block.type === "h1"
          )}
        />
      </div>
    </div>
  );
});

BlogPostContentBuilder.displayName = "BlogPostContentBuilder";

export default BlogPostContentBuilder;
