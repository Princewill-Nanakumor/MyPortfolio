// src/components/admin/AdminContent.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { HiPlus } from "react-icons/hi";
import BlogPostList from "./BlogPostList";
import { BlogPost } from "@/types/Blog";

interface AdminContentProps {
  filteredPosts: BlogPost[];
  filterStatus: "all" | "published" | "draft";
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onTogglePublish: (postId: string, published: boolean) => void;
  setIsFormOpen: (open: boolean) => void;
}

const AdminContent: React.FC<AdminContentProps> = ({
  filteredPosts,
  filterStatus,
  onEdit,
  onDelete,
  onTogglePublish,
  setIsFormOpen,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {filteredPosts.length > 0 ? (
        <BlogPostList
          posts={filteredPosts}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
        />
      ) : (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            {filterStatus === "all"
              ? "No blog posts yet"
              : filterStatus === "published"
                ? "No published posts"
                : "No draft posts"}
          </h3>
          <p className="mb-6 body-large text-text-secondary">
            {filterStatus === "all"
              ? "Create your first blog post to get started"
              : filterStatus === "published"
                ? "Publish some posts to see them here"
                : "Create some drafts to see them here"}
          </p>
          {filterStatus === "all" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-6 py-3 text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80"
            >
              <HiPlus className="w-4 h-4 mr-2" />
              Create Your First Post
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminContent;
