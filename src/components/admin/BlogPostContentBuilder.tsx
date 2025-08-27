"use client";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiArrowUp,
  HiArrowDown,
  HiUpload,
  HiX,
  HiPencil,
  HiCheck,
  HiLink,
} from "react-icons/hi";
import { BlogPost, ContentBlock } from "@/types/Blog";

interface BlogPostContentBuilderProps {
  formData: Partial<BlogPost>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
}

interface NewContentItem {
  type: "paragraph" | "heading" | "code" | "list" | "image";
  text: string;
  items: string[];
  imageUrl?: string;
}

// Define the ref interface
export interface BlogPostContentBuilderRef {
  autoSaveContent: () => void;
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
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [hasUnsavedContent, setHasUnsavedContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<NewContentItem>({
    type: "paragraph",
    text: "",
    items: [],
    imageUrl: "",
  });
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if there's unsaved content
  useEffect(() => {
    const hasContent =
      newContentItem.text.trim() ||
      newContentItem.items.length > 0 ||
      newContentItem.imageUrl;
    setHasUnsavedContent(!!hasContent);
  }, [newContentItem]);

  const addContentItem = useCallback((): void => {
    if (
      newContentItem.text.trim() ||
      newContentItem.items.length > 0 ||
      newContentItem.imageUrl
    ) {
      const contentBlock: ContentBlock = {
        type: newContentItem.type,
        text: newContentItem.text,
        items: newContentItem.items,
        ...(newContentItem.imageUrl && {
          imageUrl: newContentItem.imageUrl,
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
      });
    }
  }, [newContentItem, setFormData]);

  // Auto-save function
  const autoSaveContent = useCallback((): void => {
    if (hasUnsavedContent) {
      addContentItem();
    }
  }, [hasUnsavedContent, addContentItem]);

  // Expose auto-save function to parent component
  useImperativeHandle(
    ref,
    () => ({
      autoSaveContent,
    }),
    [autoSaveContent]
  );

  // Function to convert URLs to links in text
  const convertUrlsToLinks = (text: string): JSX.Element => {
    if (!text) return <></>;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <>
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {part}
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  // Function to insert link into text
  const insertLink = (): void => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const currentText =
        editingIndex !== null ? editingContent.text : newContentItem.text;
      const cursorPosition =
        (document.activeElement as HTMLTextAreaElement)?.selectionStart ||
        currentText.length;

      const newText =
        currentText.slice(0, cursorPosition) +
        linkMarkdown +
        currentText.slice(cursorPosition);

      if (editingIndex !== null) {
        setEditingContent((prev) => ({ ...prev, text: newText }));
      } else {
        setNewContentItem((prev) => ({ ...prev, text: newText }));
      }

      setLinkUrl("");
      setLinkText("");
      setShowLinkInput(false);
    }
  };

  // Start editing a content block
  const startEditing = (index: number): void => {
    const content = formData.content?.[index];
    if (content) {
      setEditingIndex(index);
      setEditingContent({
        type: content.type,
        text: content.text || "",
        items: content.items || [],
        imageUrl: content.imageUrl || "",
      });
    }
  };

  // Save edited content
  const saveEdit = (): void => {
    if (editingIndex !== null) {
      const contentBlock: ContentBlock = {
        type: editingContent.type,
        text: editingContent.text,
        items: editingContent.items,
        ...(editingContent.imageUrl && {
          imageUrl: editingContent.imageUrl,
        }),
      };

      setFormData((prev) => ({
        ...prev,
        content: (prev.content || []).map((item, index) =>
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

  // Cancel editing
  const cancelEdit = (): void => {
    setEditingIndex(null);
    setEditingContent({
      type: "paragraph",
      text: "",
      items: [],
      imageUrl: "",
    });
    setShowLinkInput(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to your API endpoint
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.success && data.imageUrl) {
        // Update the new content item with the image URL
        if (editingIndex !== null) {
          setEditingContent((prev) => ({
            ...prev,
            imageUrl: data.imageUrl,
          }));
        } else {
          setNewContentItem((prev) => ({
            ...prev,
            imageUrl: data.imageUrl,
          }));
        }

        setUploadProgress(100);

        // Reset progress after a moment
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (): void => {
    if (editingIndex !== null) {
      setEditingContent((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    } else {
      setNewContentItem((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const removeContentItem = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      content: (prev.content || []).filter((_, i) => i !== index),
    }));
  };

  const moveContentItem = (index: number, direction: "up" | "down"): void => {
    const newContent = [...(formData.content || [])];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newContent.length) {
      [newContent[index], newContent[newIndex]] = [
        newContent[newIndex],
        newContent[index],
      ];
      setFormData((prev) => ({
        ...prev,
        content: newContent,
      }));
    }
  };

  const addListItem = (): void => {
    const itemText = prompt("Enter list item:");
    if (itemText) {
      if (editingIndex !== null) {
        setEditingContent((prev) => ({
          ...prev,
          items: [...prev.items, itemText],
        }));
      } else {
        setNewContentItem((prev) => ({
          ...prev,
          items: [...prev.items, itemText],
        }));
      }
    }
  };

  const removeListItem = (itemIndex: number): void => {
    if (editingIndex !== null) {
      setEditingContent((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== itemIndex),
      }));
    } else {
      setNewContentItem((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== itemIndex),
      }));
    }
  };

  const renderContentPreview = (item: ContentBlock): JSX.Element | null => {
    switch (item.type) {
      case "heading":
        return <h3 className="text-lg font-bold">{item.text}</h3>;
      case "code":
        return (
          <pre className="p-3 overflow-x-auto text-xs text-green-400 bg-gray-800 rounded">
            <code>{item.text}</code>
          </pre>
        );
      case "list":
        return (
          <ul className="space-y-1 list-disc list-inside">
            {item.items?.map((listItem, i) => (
              <li key={i} className="text-sm">
                {convertUrlsToLinks(listItem)}
              </li>
            ))}
          </ul>
        );
      case "image":
        return item.imageUrl ? (
          <div className="relative">
            <Image
              src={item.imageUrl}
              alt={item.text || "Content image"}
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
              unoptimized={true}
            />
            {item.text && (
              <p className="mt-2 text-sm italic text-gray-600">
                {convertUrlsToLinks(item.text)}
              </p>
            )}
          </div>
        ) : null;
      default:
        return <p className="text-sm">{convertUrlsToLinks(item.text || "")}</p>;
    }
  };
  const renderContentInput = (
    content: NewContentItem,
    isEditing: boolean = false
  ) => {
    const currentContent = isEditing ? content : newContentItem;
    const setCurrentContent = isEditing ? setEditingContent : setNewContentItem;

    return (
      <div className="space-y-4">
        {/* Content Type Selector */}
        <select
          value={currentContent.type}
          onChange={(e) =>
            setCurrentContent((prev) => ({
              ...prev,
              type: e.target.value as
                | "paragraph"
                | "heading"
                | "code"
                | "list"
                | "image",
              text: "",
              items: [],
              imageUrl: "",
            }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading">Heading</option>
          <option value="code">Code Block</option>
          <option value="list">List</option>
          <option value="image">Image</option>
        </select>

        {/* Link Input Modal */}
        {showLinkInput && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-3">
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
              />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="URL (https://example.com)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
              />
              <div className="flex gap-2">
                <button
                  onClick={insertLink}
                  className="px-3 py-1 text-sm text-white rounded bg-secondary-indigo hover:bg-secondary-indigo/80"
                >
                  Insert Link
                </button>
                <button
                  onClick={() => {
                    setShowLinkInput(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Input Based on Type */}
        {currentContent.type === "image" ? (
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {!currentContent.imageUrl ? (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="w-full px-4 py-3 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-secondary-indigo hover:bg-secondary-indigo/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center space-y-2">
                    {isUploading ? (
                      <>
                        <div className="w-8 h-8 border-2 rounded-full border-secondary-indigo border-t-transparent animate-spin"></div>
                        <span className="text-sm text-secondary-indigo">
                          Uploading... {uploadProgress}%
                        </span>
                      </>
                    ) : (
                      <>
                        <HiUpload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </>
                    )}
                  </div>
                </button>
              ) : (
                <div className="relative group">
                  <div className="relative w-full h-48 overflow-hidden border border-gray-200 rounded-lg">
                    <Image
                      src={currentContent.imageUrl}
                      alt="Preview"
                      width={400}
                      height={192}
                      className="object-cover w-full h-full"
                      priority={false}
                      unoptimized={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                        title="Remove image"
                      >
                        <HiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image Caption */}
            <input
              type="text"
              value={currentContent.text}
              onChange={(e) =>
                setCurrentContent((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
              placeholder="Image caption (optional)"
            />
          </div>
        ) : currentContent.type === "list" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={addListItem}
                className="px-3 py-1 text-sm border rounded text-secondary-indigo border-secondary-indigo hover:bg-secondary-indigo/10"
              >
                Add List Item
              </button>
            </div>
            {currentContent.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...currentContent.items];
                    newItems[index] = e.target.value;
                    setCurrentContent((prev) => ({
                      ...prev,
                      items: newItems,
                    }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
                  placeholder="List item text"
                />
                <button
                  onClick={() => removeListItem(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Text Input with Link Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="p-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                title="Add link"
              >
                <HiLink className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={currentContent.text}
              onChange={(e) =>
                setCurrentContent((prev) => ({ ...prev, text: e.target.value }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
              placeholder={
                currentContent.type === "heading"
                  ? "Enter heading text..."
                  : currentContent.type === "code"
                    ? "Enter code..."
                    : "Enter paragraph text... (URLs will automatically become links)"
              }
            />
          </div>
        )}

        {/* Action Buttons */}
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <HiCheck className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addContentItem}
            disabled={
              !newContentItem.text.trim() &&
              newContentItem.items.length === 0 &&
              !newContentItem.imageUrl
            }
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-secondary-indigo hover:bg-secondary-indigo/80 disabled:opacity-50"
          >
            <HiPlus className="w-4 h-4" />
            Add Block
          </button>
        )}
      </div>
    );
  };

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
      {(formData.content || []).length > 0 && (
        <div className="space-y-4">
          {(formData.content || []).map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-medium text-white rounded bg-secondary-indigo">
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    Block {index + 1}
                  </span>
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
                    disabled={index === (formData.content || []).length - 1}
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
                renderContentInput(editingContent, true)
              ) : (
                <div className="text-sm">{renderContentPreview(item)}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Content */}
      <div className="p-4 border-2 border-gray-300 border-dashed rounded-xl">
        {renderContentInput(newContentItem, false)}
      </div>
    </div>
  );
});

BlogPostContentBuilder.displayName = "BlogPostContentBuilder";

export default BlogPostContentBuilder;
