"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiUpload,
  HiX,
  HiCheck,
  HiLink,
} from "react-icons/hi";
import { NewContentItem } from "./../../types/Blog";
import { isValidVideoUrl } from "@/utils/videoUtils";
import { uploadVideoToCloudinary } from "@/utils/cloudinaryUpload";

interface ContentBlockEditorProps {
  content: NewContentItem;
  setContent: React.Dispatch<React.SetStateAction<NewContentItem>>;
  onSave: () => void;
  onCancel?: () => void;
  isEditing: boolean;
  hasExistingH1?: boolean;
}

const ContentBlockEditor = ({
  content,
  setContent,
  onSave,
  onCancel,
  isEditing,
  hasExistingH1 = false,
}: ContentBlockEditorProps) => {
  const isH1SelectionDisabled = hasExistingH1 && content.type !== "h1";

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);

  // Function to insert link into text
  const insertLink = (): void => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const currentText = content.text;
      const cursorPosition =
        (document.activeElement as HTMLTextAreaElement)?.selectionStart ||
        currentText.length;

      const newText =
        currentText.slice(0, cursorPosition) +
        linkMarkdown +
        currentText.slice(cursorPosition);

      setContent((prev) => ({ ...prev, text: newText }));

      setLinkUrl("");
      setLinkText("");
      setShowLinkInput(false);
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    void (async () => {
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

    let progressInterval: ReturnType<typeof setInterval> | null = null;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", file);

      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
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

      if (progressInterval) clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.success && data.imageUrl) {
        setContent((prev) => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));

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
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      event.target.value = "";
    }
    })();
  };

  const removeImage = (): void => {
    setContent((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleVideoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    void (async () => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("Video size should be less than 50MB");
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(0);

    try {
      const videoUrl = await uploadVideoToCloudinary(file, (progress) => {
        setVideoUploadProgress(progress);
      });

      setContent((prev) => ({
        ...prev,
        videoUrl,
      }));
      setVideoUploadProgress(100);

      setTimeout(() => {
        setVideoUploadProgress(0);
        setIsUploadingVideo(false);
      }, 1000);
    } catch (error) {
      console.error("Video upload error:", error);
      alert(
        `Failed to upload video: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    } finally {
      event.target.value = "";
    }
    })();
  };

  const handleVideoUrlChange = (url: string): void => {
    const trimmed = url.trim();
    setContent((prev) => ({
      ...prev,
      videoUrl: isValidVideoUrl(trimmed) ? trimmed : url,
    }));
  };

  const removeVideo = (): void => {
    setContent((prev) => ({
      ...prev,
      videoUrl: "",
    }));
  };

  const triggerVideoInput = (): void => {
    videoInputRef.current?.click();
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const addListItem = (): void => {
    const itemText = prompt("Enter list item:");
    if (itemText) {
      setContent((prev) => ({
        ...prev,
        items: [...prev.items, itemText],
      }));
    }
  };

  const removeListItem = (itemIndex: number): void => {
    setContent((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== itemIndex),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Content Type Selector */}
      <select
        value={content.type}
        onChange={(e) =>
          (() => {
            const nextType = e.target.value as
              | "paragraph"
              | "h1"
              | "h2"
              | "h3"
              | "code"
              | "list"
              | "image"
              | "video";

            if (nextType === "h1" && isH1SelectionDisabled) {
              alert("Only one H1 is allowed per post.");
              return;
            }

            setContent((prev) => ({
              ...prev,
              type: nextType,
              text: "",
              items: [],
              imageUrl: "",
              videoUrl: "",
            }));
          })()
        }
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1" disabled={isH1SelectionDisabled}>
          Heading 1 (H1)
        </option>
        <option value="h2">Heading 2 (H2)</option>
        <option value="h3">Heading 3 (H3)</option>
        <option value="code">Code Block</option>
        <option value="list">List</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
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
      {content.type === "video" ? (
        <div className="space-y-4">
          <input
            type="url"
            value={content.videoUrl || ""}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder="Paste YouTube, Vimeo, or direct video URL"
          />
          {content.videoUrl && !isValidVideoUrl(content.videoUrl) && (
            <p className="text-xs text-amber-600">
              Enter a valid YouTube, Vimeo, or direct video URL
            </p>
          )}
          <p className="text-xs text-gray-500">
            Supports YouTube, Vimeo, or direct MP4/WebM links
          </p>

          <div className="relative">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
              onChange={handleVideoUpload}
              className="hidden"
            />

            {!content.videoUrl ? (
              <button
                type="button"
                onClick={triggerVideoInput}
                disabled={isUploadingVideo}
                className="w-full px-4 py-3 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-secondary-indigo hover:bg-secondary-indigo/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center space-y-2">
                  {isUploadingVideo ? (
                    <>
                      <div className="w-8 h-8 border-2 rounded-full border-secondary-indigo border-t-transparent animate-spin"></div>
                      <span className="text-sm text-secondary-indigo">
                        Uploading... {videoUploadProgress}%
                      </span>
                    </>
                  ) : (
                    <>
                      <HiUpload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Or upload a video file
                      </span>
                      <span className="text-xs text-gray-500">
                        MP4, WebM, MOV up to 50MB
                      </span>
                    </>
                  )}
                </div>
              </button>
            ) : (
              <div className="relative p-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-green-800 truncate">
                    Video added successfully
                  </p>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="p-1 text-red-500 transition-colors rounded hover:bg-red-50"
                    title="Remove video"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={content.text}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder="Video caption (optional)"
          />
        </div>
      ) : content.type === "image" ? (
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

            {!content.imageUrl ? (
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
                    src={content.imageUrl}
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
            value={content.text}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder="Image caption (optional)"
          />
        </div>
      ) : content.type === "list" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={addListItem}
              className="px-3 py-1 text-sm border rounded text-secondary-indigo border-secondary-indigo hover:bg-secondary-indigo/10"
            >
              Add List Item
            </button>
          </div>
          {content.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...content.items];
                  newItems[index] = e.target.value;
                  setContent((prev) => ({
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
            value={content.text}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, text: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder={
              content.type === "h1" ||
              content.type === "h2" ||
              content.type === "h3"
                ? "Enter heading text..."
                : content.type === "code"
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
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <HiCheck className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={onSave}
          disabled={
            content.type === "video"
              ? !isValidVideoUrl(content.videoUrl || "")
              : !content.text.trim() &&
                content.items.length === 0 &&
                !content.imageUrl
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

export default ContentBlockEditor;
