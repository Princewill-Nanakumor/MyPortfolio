// src/components/admin/BlogPostList.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiPencil, HiTrash, HiEye, HiCalendar, HiClock } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";

interface BlogPostListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onTogglePublish?: (postId: string, published: boolean) => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  posts,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (posts.length === 0) {
    return (
      <motion.div
        className="py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
          <HiEye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="mb-2 heading-4 text-text-primary">No blog posts yet</h3>
        <p className="body-medium text-text-secondary">
          Create your first blog post to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => {
        // Use _id if available, otherwise fall back to id
        const postId = post._id || post.id?.toString() || `post-${index}`;
        const postDate =
          post.createdAt || post.date || new Date().toISOString();

        return (
          <motion.article
            key={postId}
            className="transition-all duration-300 bg-white border border-gray-200 rounded-3xl shadow-soft hover:shadow-large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="lg:w-1/3">
                <div className="relative h-48 overflow-hidden lg:h-full rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized={true}
                    onError={(e) => {
                      console.error("Failed to load image:", post.image);
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-medium rounded-full text-secondary-indigo bg-secondary-indigo/10">
                        {post.category}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          post.published
                            ? "text-green-600 bg-green-100"
                            : "text-orange-600 bg-orange-100"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                      {post.tags?.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={`${postId}-tag-${tagIndex}`}
                          className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-2 text-gray-400 transition-colors hover:text-secondary-indigo rounded-xl"
                        title="View Post"
                      >
                        <HiEye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onEdit(post)}
                        className="p-2 text-gray-400 transition-colors hover:text-secondary-indigo rounded-xl"
                        title="Edit Post"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(postId)}
                        className="p-2 text-gray-400 transition-colors hover:text-red-500 rounded-xl"
                        title="Delete Post"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="flex-1">
                    <h3 className="mb-3 heading-4 text-text-primary line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mb-4 body-medium text-text-secondary line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-text-muted">
                      <div className="flex items-center space-x-1">
                        <HiCalendar className="w-4 h-4" />
                        <span>{formatDate(postDate)}</span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center space-x-1">
                          <HiClock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-text-muted">
                      {post.content?.length || 0} content blocks
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};

export default BlogPostList;
