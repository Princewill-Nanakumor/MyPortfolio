// src/components/blog/BlogPostHeader.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiArrowLeft,
  HiCalendar,
  HiClock,
  HiShare,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";
import { BlogPost } from "@/types/Blog";

interface BlogPostHeaderProps {
  post: BlogPost;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  handleShare: () => void;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  post,
  isLiked,
  setIsLiked,
  handleShare,
}) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {/* Back Button */}
      <div className="max-w-4xl px-6 pt-8 mx-auto sm:px-8 lg:px-12">
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 transition-colors duration-300 text-secondary-indigo hover:text-secondary-indigo/80 group"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-medium">Back to Blog</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl px-6 py-8 mx-auto sm:px-8 lg:px-12">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-4 py-2 text-sm font-medium rounded-full text-secondary-indigo bg-secondary-indigo/10">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 heading-1 text-text-primary">{post.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-text-secondary">
            <div className="flex items-center space-x-2">
              <HiCalendar className="w-5 h-5" />
              <span>{formatDate(post.date || post.createdAt || "")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiClock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-2 transition-colors duration-300 hover:text-red-500"
            >
              {isLiked ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
              <span>Like</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 transition-colors duration-300 hover:text-secondary-indigo"
            >
              <HiShare className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium rounded-md text-secondary-indigo bg-secondary-indigo/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.header>
      </div>
    </>
  );
};

export default BlogPostHeader;
