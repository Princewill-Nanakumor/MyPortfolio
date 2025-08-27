"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  HiCalendar,
  HiClock,
  HiShare,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";
import { BlogPost as BlogPostType } from "@/types/Blog";
import { DesignStyle, LayoutOption } from "./DesignConfig";

interface BlogHeaderProps {
  post: BlogPostType;
  designStyle: DesignStyle;
  layoutStyle: LayoutOption;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
}

const BlogHeader = ({
  post,
  designStyle,
  isLiked,
  likeCount,
  onLike,
  onShare,
}: BlogHeaderProps) => {
  const s = designStyle.colors;

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
      <motion.header
        className="mb-6 sm:mb-8 lg:mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Category Badge */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${s.accent} ${s.accentBg} sm:px-4 sm:py-2 sm:text-sm lg:text-base`}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`mb-4 text-2xl font-bold ${s.textPrimary} sm:text-3xl sm:mb-6 lg:text-4xl lg:mb-8 xl:text-5xl 2xl:text-6xl`}
        >
          {post.title}
        </h1>

        {/* Meta Information and Action Buttons */}
        <div
          className={`flex flex-wrap items-center gap-3 mb-4 text-xs ${s.textSecondary} sm:gap-4 sm:mb-6 sm:text-sm lg:gap-6 lg:text-base`}
        >
          {/* Date and Read Time */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <HiCalendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>{formatDate(post.createdAt || "")}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <HiClock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>{post.readTime}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Like Button */}
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 transition-colors hover:text-red-500 sm:space-x-2`}
              aria-label={isLiked ? "Unlike post" : "Like post"}
            >
              {isLiked ? (
                <HiHeart className="w-4 h-4 text-red-500 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              ) : (
                <HiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              )}
              <span className="text-xs font-medium sm:text-sm lg:text-base">
                {likeCount}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={onShare}
              className={`flex items-center space-x-1 transition-colors hover:${s.accent} sm:space-x-2`}
              aria-label="Share post"
            >
              <HiShare className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline lg:text-base">Share</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded-full ${s.accent} ${s.accentBg} sm:px-3 sm:text-sm lg:text-base`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.header>

      {/* Featured Image */}
      <motion.div
        className="relative mb-6 overflow-hidden rounded-2xl shadow-large sm:mb-8 lg:mb-12 lg:rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="object-cover w-full h-48 sm:h-64 lg:h-80 xl:h-96 2xl:h-[28rem]"
          priority
          onError={() => {
            console.error("Failed to load image:", post.image);
          }}
        />
      </motion.div>
    </>
  );
};

export default BlogHeader;
