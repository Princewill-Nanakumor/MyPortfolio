// src/components/blog/BlogPostFooter.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { HiShare, HiOutlineHeart, HiHeart } from "react-icons/hi";

interface BlogPostFooterProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  handleShare: () => void;
}

const BlogPostFooter: React.FC<BlogPostFooterProps> = ({
  isLiked,
  setIsLiked,
  handleShare,
}) => {
  return (
    <div className="max-w-4xl px-6 mx-auto mb-4 sm:px-8 lg:px-12">
      <motion.footer
        className="pt-8 mt-16 border-t border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-gray-50 text-text-secondary border border-gray-200 hover:border-red-200 hover:text-red-500"
              }`}
            >
              {isLiked ? (
                <HiHeart className="w-5 h-5" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
              <span>Like this post</span>
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-all duration-300 rounded-full bg-secondary-indigo hover:bg-secondary-indigo/90"
          >
            <HiShare className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </motion.footer>
    </div>
  );
};

export default BlogPostFooter;
