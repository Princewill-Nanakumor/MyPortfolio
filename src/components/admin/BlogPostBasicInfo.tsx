// src/components/admin/BlogPostBasicInfo.tsx
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { HiUpload, HiX } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";

interface BlogPostBasicInfoProps {
  formData: Partial<BlogPost>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  availableImages?: Array<{ value: string; label: string }>;
}

const BlogPostBasicInfo: React.FC<BlogPostBasicInfoProps> = ({
  formData,
  handleInputChange,
  availableImages = [],
}) => {
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

      // Create a synthetic event for the image URL update
      const syntheticEvent = {
        target: {
          name: "image",
          value: data.imageUrl,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(syntheticEvent);

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
    // Create a synthetic event for removing the image
    const syntheticEvent = {
      target: {
        name: "image",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Title and Slug */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-text-primary">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-text-primary">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder="Auto-generated from title"
          />
        </div>
      </div>

      {/* Featured Image and Category */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-text-primary">
            Featured Image *
          </label>

          {/* Image Upload Area */}
          <div className="space-y-4">
            {/* Upload Button */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="w-full px-4 py-3 transition-colors border-2 border-gray-300 border-dashed rounded-xl hover:border-secondary-indigo hover:bg-secondary-indigo/5 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Click to upload image or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Image Preview */}
            {formData.image && !isUploading && (
              <div className="relative group">
                <div className="relative w-full h-48 overflow-hidden border border-gray-200 rounded-xl">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="object-cover w-full h-full"
                    priority={false}
                    unoptimized={true}
                    onError={() => {
                      console.log("Image failed to load:", formData.image);
                    }}
                  />

                  {/* Remove Button Overlay */}
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

                {/* Image URL Display */}
                <div className="p-2 mt-2 text-xs text-gray-600 border rounded bg-gray-50">
                  <span className="font-medium">Image URL:</span>{" "}
                  {formData.image}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-text-primary">
              Category *
            </label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            >
              <option value="">Select category</option>
              <option value="Next.js">Next.js</option>
              <option value="React">React</option>
              <option value="CSS">CSS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Backend">Backend</option>
              <option value="Git">Git</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-text-primary">
              Read Time
            </label>
            <input
              type="text"
              name="readTime"
              value={formData.readTime || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-colors border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
              placeholder="5 min read"
            />
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block mb-2 text-sm font-medium text-text-primary">
          Excerpt *
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt || ""}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-4 py-3 transition-colors border border-gray-200 resize-none rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
          placeholder="Brief description of the post"
        />
        <div className="mt-1 text-xs text-gray-500">
          {(formData.excerpt || "").length}/200 characters
        </div>
      </div>
    </div>
  );
};

export default BlogPostBasicInfo;
