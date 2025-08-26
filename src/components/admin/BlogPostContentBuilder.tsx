// src/components/admin/BlogPostContentBuilder.tsx
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiArrowUp,
  HiArrowDown,
  HiUpload,
  HiX,
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

const BlogPostContentBuilder: React.FC<BlogPostContentBuilderProps> = ({
  formData,
  setFormData,
}) => {
  const [newContentItem, setNewContentItem] = useState<NewContentItem>({
    type: "paragraph",
    text: "",
    items: [],
    imageUrl: "",
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Update the new content item with the image URL
      setNewContentItem((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
      }));

      setUploadProgress(100);

      // Reset progress after a moment
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (): void => {
    setNewContentItem((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const addContentItem = (): void => {
    if (
      newContentItem.text.trim() ||
      newContentItem.items.length > 0 ||
      newContentItem.imageUrl
    ) {
      setFormData((prev) => ({
        ...prev,
        content: [
          ...(prev.content || []),
          {
            type: newContentItem.type,
            text: newContentItem.text,
            items: newContentItem.items,
            ...(newContentItem.imageUrl && {
              imageUrl: newContentItem.imageUrl,
            }),
          },
        ],
      }));
      setNewContentItem({
        type: "paragraph",
        text: "",
        items: [],
        imageUrl: "",
      });
    }
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
    if (newContentItem.type === "list") {
      const itemText = prompt("Enter list item:");
      if (itemText) {
        setNewContentItem((prev) => ({
          ...prev,
          items: [...prev.items, itemText],
        }));
      }
    }
  };

  const removeListItem = (itemIndex: number): void => {
    setNewContentItem((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== itemIndex),
    }));
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
                {listItem}
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
              <p className="mt-2 text-sm italic text-gray-600">{item.text}</p>
            )}
          </div>
        ) : null;
      default:
        return <p className="text-sm">{item.text}</p>;
    }
  };

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-text-primary">
        Content Blocks
      </label>

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
              <div className="text-sm">{renderContentPreview(item)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Content */}
      <div className="p-4 border-2 border-gray-300 border-dashed rounded-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <select
              value={newContentItem.type}
              onChange={(e) =>
                setNewContentItem((prev) => ({
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
          </div>

          {/* Content Input Based on Type */}
          {newContentItem.type === "image" ? (
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

                {!newContentItem.imageUrl ? (
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
                        src={newContentItem.imageUrl}
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
                value={newContentItem.text}
                onChange={(e) =>
                  setNewContentItem((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
                placeholder="Image caption (optional)"
              />
            </div>
          ) : newContentItem.type === "list" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={addListItem}
                  className="px-3 py-1 text-sm border rounded text-secondary-indigo border-secondary-indigo hover:bg-secondary-indigo/10"
                >
                  Add List Item
                </button>
              </div>
              {newContentItem.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...newContentItem.items];
                      newItems[index] = e.target.value;
                      setNewContentItem((prev) => ({
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
            <textarea
              value={newContentItem.text}
              onChange={(e) =>
                setNewContentItem((prev) => ({ ...prev, text: e.target.value }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
              placeholder={
                newContentItem.type === "heading"
                  ? "Enter heading text..."
                  : newContentItem.type === "code"
                    ? "Enter code..."
                    : "Enter paragraph text..."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostContentBuilder;
