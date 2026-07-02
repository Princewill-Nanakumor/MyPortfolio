// src/components/admin/BlogPostTagManager.tsx
"use client";
import React, { useState } from "react";
import { HiX, HiPlus } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";
import {
  BACKEND_WORK_TAGS,
  HOBBY_BLOG_TAGS,
  WEB_DEV_TAGS,
} from "@/constants/blog";

interface BlogPostTagManagerProps {
  formData: Partial<BlogPost>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
}

const BlogPostTagManager: React.FC<BlogPostTagManagerProps> = ({
  formData,
  setFormData,
}) => {
  const [newTag, setNewTag] = useState<string>("");

  const addTag = (): void => {
    if (newTag.trim() && !(formData.tags || []).includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addPopularTag = (tag: string): void => {
    if (!(formData.tags || []).includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
    }
  };

  const renderTagSuggestions = (
    label: string,
    tags: readonly string[],
    limit = 8
  ) => (
    <div>
      <p className="mb-2 text-xs text-gray-500">{label}</p>
      <div className="flex flex-wrap gap-1">
        {tags
          .filter((tag) => !(formData.tags || []).includes(tag))
          .slice(0, limit)
          .map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addPopularTag(tag)}
              className="px-2 py-1 text-xs text-gray-600 transition-colors bg-gray-100 rounded hover:bg-gray-200"
            >
              + {tag}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-text-primary">
        Tags
      </label>

      <div className="flex flex-wrap gap-2 mb-4">
        {(formData.tags || []).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-secondary-indigo/10 text-secondary-indigo"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 transition-colors text-secondary-indigo/60 hover:text-secondary-indigo"
            >
              <HiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        {(formData.tags || []).length === 0 && (
          <span className="text-sm italic text-gray-400">
            No tags added yet
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTag(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 transition-colors border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
            placeholder="Add a tag (press Enter)"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!newTag.trim()}
            className="px-4 py-2 text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {renderTagSuggestions(
            "Backend & CLI (parsing, pipelines, tooling):",
            BACKEND_WORK_TAGS,
            BACKEND_WORK_TAGS.length
          )}
          {renderTagSuggestions("Web dev:", WEB_DEV_TAGS)}
          {renderTagSuggestions("Hobbies (drone, etc.):", HOBBY_BLOG_TAGS)}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Use <span className="font-medium">Backend</span> or{" "}
        <span className="font-medium">CLI Tools</span> categories for parsing and
        pipeline work. Use <span className="font-medium">Drone</span> for hobby
        videos.
      </div>
    </div>
  );
};

export default BlogPostTagManager;
