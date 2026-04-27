"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiClock } from "react-icons/hi";
import { ImageIcon } from "lucide-react";
import { BlogPost, ContentBlock } from "@/types/Blog";

interface BlogPostPreviewProps {
  formData: Partial<BlogPost>;
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({ formData }) => {
  const [featuredImageFailed, setFeaturedImageFailed] = useState(false);
  const [failedContentImages, setFailedContentImages] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setFeaturedImageFailed(false);
  }, [formData.image]);

  useEffect(() => {
    setFailedContentImages(new Set());
  }, [formData.content]);

  const renderContentPreview = (
    contentBlock: ContentBlock,
    index: number
  ): JSX.Element | null => {
    switch (contentBlock.type) {
      case "h1":
        return (
          <h1 className="mb-4 text-3xl font-bold text-text-primary">
            {contentBlock.text}
          </h1>
        );
      case "h2":
        return (
          <h2 className="mb-4 text-2xl font-bold text-text-primary">
            {contentBlock.text}
          </h2>
        );
      case "h3":
        return (
          <h3 className="mb-4 text-xl font-bold text-text-primary">
            {contentBlock.text}
          </h3>
        );
      case "paragraph":
        return (
          <p className="mb-4 leading-relaxed text-text-secondary">
            {contentBlock.text}
          </p>
        );
      case "code":
        return (
          <pre className="p-4 mb-6 overflow-x-auto text-green-400 bg-gray-900 rounded-xl">
            <code className="break-words whitespace-pre-wrap">
              {contentBlock.text}
            </code>
          </pre>
        );
      case "list":
        return (
          <ul className="mb-6 space-y-2 list-disc list-inside">
            {contentBlock.items?.map((item, index) => (
              <li key={index} className="text-text-secondary">
                {item}
              </li>
            ))}
          </ul>
        );
      case "image":
        return contentBlock.imageUrl && !failedContentImages.has(index) ? (
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={contentBlock.imageUrl}
                alt={contentBlock.text || "Content image"}
                width={800}
                height={600}
                className="w-full h-auto"
                unoptimized={true}
                onError={() => {
                  setFailedContentImages((prev) => {
                    const next = new Set(prev);
                    next.add(index);
                    return next;
                  });
                }}
              />
            </div>
            {contentBlock.text && (
              <p className="mt-2 text-sm italic text-center text-gray-600">
                {contentBlock.text}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 mb-6 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
              <ImageIcon className="w-8 h-8" />
              <p>Image preview unavailable</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          Preview Your Post
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {formData.category && formData.category !== "Draft" && (
            <span className="px-2 py-1 text-xs rounded bg-secondary-indigo/10 text-secondary-indigo">
              {formData.category}
            </span>
          )}
          {formData.readTime && (
            <span className="flex items-center gap-1">
              <HiClock className="w-4 h-4" />
              {formData.readTime}
            </span>
          )}
        </div>
      </div>

      {/* Post Preview */}
      <div className="p-6 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-soft">
        {/* Featured Image */}
        {formData.image && !featuredImageFailed ? (
          <div className="relative w-full h-64 overflow-hidden rounded-xl">
            <Image
              src={formData.image}
              alt={formData.title || "Blog post"}
              width={800}
              height={256}
              className="object-cover w-full h-full"
              priority={false}
              unoptimized={true}
              onError={() => setFeaturedImageFailed(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-64 gap-2 bg-gray-100 rounded-xl">
            <ImageIcon className="w-10 h-10 text-gray-400" />
            <p className="text-gray-500">Featured image preview unavailable</p>
          </div>
        )}

        {/* Post Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">
            {formData.title}
          </h1>

          <p className="text-lg leading-relaxed text-text-secondary">
            {formData.excerpt}
          </p>

          {/* Tags */}
          {(formData.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="mb-4 text-lg font-semibold text-text-primary">
            Content Preview
          </h4>

          {(formData.content || []).length > 0 ? (
            <div className="space-y-4">
              {formData.content?.map((contentBlock, index) => (
                <div key={index}>{renderContentPreview(contentBlock, index)}</div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No content blocks added yet.</p>
            </div>
          )}
        </div>

        {/* Post Summary */}
        <div className="pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Content Blocks:</span>{" "}
              {formData.content?.length || 0}
            </div>
            <div>
              <span className="font-medium">Tags:</span>{" "}
              {formData.tags?.length || 0}
            </div>
            <div>
              <span className="font-medium">Category:</span> {formData.category}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {formData.slug}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="p-4 space-y-2 bg-gray-50 rounded-xl">
        <h4 className="font-medium text-text-primary">Validation Summary</h4>
        <div className="space-y-1 text-sm">
          <div
            className={`flex items-center gap-2 ${
              formData.title ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formData.title ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            Title: {formData.title ? "✓" : "✗ Required"}
          </div>
          <div
            className={`flex items-center gap-2 ${
              formData.category ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formData.category ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            Category: {formData.category ? "✓" : "✗ Required"}
          </div>
          <div
            className={`flex items-center gap-2 ${
              formData.excerpt ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formData.excerpt ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            Excerpt: {formData.excerpt ? "✓" : "✗ Required"}
          </div>
          <div
            className={`flex items-center gap-2 ${
              formData.image ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formData.image ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            Featured Image: {formData.image ? "✓" : "✗ Required"}
          </div>
          <div
            className={`flex items-center gap-2 ${
              (formData.content || []).length > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                (formData.content || []).length > 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            Content:{" "}
            {(formData.content || []).length > 0
              ? `✓ ${(formData.content || []).length} blocks`
              : "✗ Required"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPreview;
