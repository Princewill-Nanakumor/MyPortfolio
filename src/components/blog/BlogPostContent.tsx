// src/components/blog/BlogPostContent.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/types/Blog";

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  const renderContentBlock = (block: any, index: number) => {
    switch (block.type) {
      case "heading":
        return (
          <h2 key={index} className="mb-4 text-2xl font-bold text-text-primary">
            {block.text}
          </h2>
        );
      case "paragraph":
        return (
          <p key={index} className="mb-4 body-large text-text-secondary">
            {block.text}
          </p>
        );
      case "code":
        return (
          <pre
            key={index}
            className="p-4 mb-4 overflow-x-auto text-sm bg-gray-900 rounded-lg"
          >
            <code className="text-green-400">{block.text}</code>
          </pre>
        );
      case "list":
        return (
          <ul key={index} className="mb-4 space-y-2 list-disc list-inside">
            {block.items?.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="body-medium text-text-secondary">
                {item}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="prose prose-lg max-w-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {post.content?.map((block, index) => renderContentBlock(block, index))}
    </motion.div>
  );
};

export default BlogPostContent;
