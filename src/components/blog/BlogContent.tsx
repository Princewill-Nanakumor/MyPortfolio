"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { HiShare } from "react-icons/hi";
import {
  BlogPost as BlogPostType,
  ContentBlock,
} from "../../../src/types/Blog";
import { DesignStyle, LayoutOption } from "./DesignConfig";
import VideoEmbed from "./VideoEmbed";

interface BlogContentProps {
  post: BlogPostType;
  designStyle: DesignStyle;
  layoutStyle: LayoutOption;
  currentLayout?: string;
}

const BlogContent = ({
  post,
  designStyle,
  layoutStyle,
  currentLayout,
}: BlogContentProps) => {
  const s = designStyle.colors;

  // Function to convert URLs to links in text
  const convertUrlsToLinks = (text: string): JSX.Element => {
    if (!text) return <></>;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <>
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {part}
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        console.log("Link copied to clipboard!");
      }
    } catch (error) {
      // Handle the "Share canceled" error gracefully
      if (error instanceof Error && error.name === "AbortError") {
        // User canceled the share dialog - this is normal behavior
        console.log("Share was canceled by user");
        return;
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        console.log("Link copied to clipboard!");
      } catch (clipboardError) {
        // Final fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        console.log("Link copied to clipboard!");
      }
    }
  };

  const handleShareClick = (): void => {
    void handleShare().catch((error) => {
      console.error("Share failed:", error);
    });
  };

  const renderContentBlock = (contentBlock: ContentBlock, index: number) => {
    switch (contentBlock.type) {
      case "h1":
        return (
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-4 text-2xl font-bold ${s.textPrimary} sm:text-3xl sm:mb-6 lg:text-4xl lg:mb-8 xl:text-5xl`}
          >
            {contentBlock.text}
          </motion.h1>
        );
      case "h2":
        return (
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-4 text-xl font-bold ${s.textPrimary} sm:text-2xl sm:mb-6 lg:text-3xl lg:mb-8 xl:text-4xl`}
          >
            {contentBlock.text}
          </motion.h2>
        );
      case "h3":
        return (
          <motion.h3
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-4 text-lg font-bold ${s.textPrimary} sm:text-xl sm:mb-6 lg:text-2xl lg:mb-8 xl:text-3xl`}
          >
            {contentBlock.text}
          </motion.h3>
        );
      case "paragraph":
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-4 text-sm leading-relaxed ${s.textSecondary} sm:text-base sm:mb-6 lg:text-lg lg:mb-8 xl:text-xl`}
          >
            {convertUrlsToLinks(contentBlock.text || "")}
          </motion.p>
        );
      case "code":
        return (
          <motion.pre
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 mb-6 overflow-x-auto text-xs text-green-400 bg-gray-900 rounded-xl sm:p-4 sm:text-sm sm:mb-8 lg:p-6 lg:text-base lg:mb-10"
          >
            <code className="break-words whitespace-pre-wrap">
              {contentBlock.text}
            </code>
          </motion.pre>
        );
      case "list":
        return (
          <motion.ul
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 space-y-2 list-disc list-inside sm:mb-8 lg:mb-10 lg:space-y-3"
          >
            {contentBlock.items?.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className={`text-sm ${s.textSecondary} sm:text-base lg:text-lg xl:text-xl`}
              >
                {convertUrlsToLinks(item)}
              </li>
            ))}
          </motion.ul>
        );
      case "image":
        return contentBlock.imageUrl ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 sm:mb-8 lg:mb-10"
          >
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl">
              <Image
                src={contentBlock.imageUrl}
                alt={contentBlock.text || "Content image"}
                width={800}
                height={600}
                className="w-full h-auto"
                unoptimized={true}
              />
            </div>
            {contentBlock.text && (
              <p className="mt-2 text-xs italic text-center text-gray-600 sm:text-sm lg:text-base">
                {convertUrlsToLinks(contentBlock.text)}
              </p>
            )}
          </motion.div>
        ) : null;
      case "video":
        return contentBlock.videoUrl ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 sm:mb-8 lg:mb-10"
          >
            <VideoEmbed
              videoUrl={contentBlock.videoUrl}
              caption={contentBlock.text}
            />
          </motion.div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={layoutStyle.contentLayout}>
      {/* Excerpt */}
      <div
        className={`p-4 mb-6 ${s.accentBg} rounded-xl sm:p-6 sm:mb-8 lg:p-8 lg:mb-10 lg:rounded-2xl`}
      >
        <p
          className={`text-sm ${s.textSecondary} sm:text-base lg:text-lg xl:text-xl`}
        >
          {convertUrlsToLinks(post.excerpt || "")}
        </p>
      </div>

      {/* Article Content */}
      <motion.div
        className={`prose max-w-none ${designStyle.prose} ${s.textPrimary}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {post.content?.map((contentBlock, index) =>
          renderContentBlock(contentBlock, index)
        )}
      </motion.div>

      {/* Article Footer - Only show for non-split layouts */}
      {currentLayout !== "split" && (
        <motion.footer
          className={`pt-6 mt-8 border-t ${s.border} sm:pt-8 sm:mt-12 lg:pt-10 lg:mt-16`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-start sm:gap-4 lg:gap-6">
            <button
              onClick={handleShareClick}
              className="inline-flex items-center justify-center px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-4 lg:text-lg"
            >
              <HiShare className="w-3 h-3 mr-2 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              Share Article
            </button>
          </div>
        </motion.footer>
      )}
    </div>
  );
};

export default BlogContent;
