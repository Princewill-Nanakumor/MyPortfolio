"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  HiArrowLeft,
  HiCalendar,
  HiClock,
  HiShare,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";
import { blogService } from "@/services/blogService";
import { BlogPost as BlogPostType, ContentBlock } from "../../../types/Blog";
import ScrollToTop from "@/components/common/ScrollToTop";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

const BlogPost = ({ params }: BlogPostProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(
    null
  );

  // Resolve params when component mounts
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Update the loadPost function in src/app/blog/[slug]/page.tsx
  const loadPost = useCallback(async (): Promise<void> => {
    if (!resolvedParams) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedPost = await blogService.getPost(resolvedParams.slug);
      console.log("Fetched post:", fetchedPost);

      setPost(fetchedPost);
      // Ensure likes is a number, default to 0 if undefined
      const likesCount =
        typeof fetchedPost.likes === "number" ? fetchedPost.likes : 0;
      setLikeCount(likesCount);
      console.log("Setting like count to:", likesCount);

      // Check if user has liked this post
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      const isPostLiked = likedPosts.includes(fetchedPost._id);
      setIsLiked(isPostLiked);
      console.log("Is post liked:", isPostLiked);
    } catch (error) {
      console.error("Error loading post:", error);
      setError(error instanceof Error ? error.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams]);

  useEffect(() => {
    if (resolvedParams) {
      loadPost();
    }
  }, [loadPost, resolvedParams]);

  // Update the handleLike function in src/app/blog/[slug]/page.tsx
  const handleLike = useCallback(async (): Promise<void> => {
    if (!post) return;

    try {
      const method = isLiked ? "DELETE" : "POST";
      console.log(
        `Attempting to ${isLiked ? "unlike" : "like"} post:`,
        post._id
      );

      const response = await fetch(`/api/blog/${post._id}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        setLikeCount(data.data.likes);
        setIsLiked(!isLiked);

        // Update localStorage
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "[]"
        );
        if (isLiked) {
          const updatedLikedPosts = likedPosts.filter(
            (id: string) => id !== post._id
          );
          localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
        } else {
          likedPosts.push(post._id);
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to update like:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  }, [post, isLiked]);

  const formatDate = useCallback((dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const handleShare = useCallback(async (): Promise<void> => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      }
    }
  }, [post]);

  // Update the renderContent function in src/app/blog/[slug]/page.tsx
  const renderContent = useCallback((contentBlock: ContentBlock) => {
    switch (contentBlock.type) {
      case "heading":
        return (
          <h2 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl lg:text-3xl">
            {contentBlock.text}
          </h2>
        );
      case "paragraph":
        return (
          <p className="mb-4 text-sm leading-relaxed text-text-secondary sm:text-base lg:text-lg">
            {contentBlock.text}
          </p>
        );
      case "code":
        return (
          <pre className="p-3 mb-6 overflow-x-auto text-xs text-green-400 bg-gray-900 rounded-xl sm:p-4 sm:text-sm">
            <code className="break-words whitespace-pre-wrap">
              {contentBlock.text}
            </code>
          </pre>
        );
      case "list":
        return (
          <ul className="mb-6 space-y-2 list-disc list-inside">
            {contentBlock.items?.map((item, index) => (
              <li
                key={index}
                className="text-sm text-text-secondary sm:text-base lg:text-lg"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      case "image":
        return contentBlock.imageUrl ? (
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-xl">
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
              <p className="mt-2 text-xs italic text-center text-gray-600 sm:text-sm">
                {contentBlock.text}
              </p>
            )}
          </div>
        ) : null;
      default:
        return null;
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-primary sm:pt-20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 border-b-2 rounded-full animate-spin border-secondary-indigo sm:w-32 sm:h-32"></div>
          <p className="text-sm text-text-secondary sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-primary sm:pt-20">
        <div className="max-w-sm mx-auto text-center sm:max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500 sm:w-16 sm:h-16">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-lg font-bold text-text-primary sm:text-xl">
            Post Not Found
          </h2>
          <p className="mb-6 text-sm text-text-secondary sm:text-base">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={loadPost}
              className="w-full px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 sm:text-base"
            >
              Try Again
            </button>
            <Link
              href="/blog"
              className="block w-full px-4 py-2 text-sm transition-colors border text-secondary-indigo border-secondary-indigo rounded-xl hover:bg-secondary-indigo/10 sm:text-base"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Post not found - call notFound() for proper 404 handling
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-16 bg-bg-primary sm:pt-20">
      {/* Back Button */}
      <div className="max-w-4xl px-4 pt-6 mx-auto sm:px-6 sm:pt-8 lg:px-12">
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-sm transition-colors duration-300 text-secondary-indigo hover:text-secondary-indigo/80 group sm:text-base"
        >
          <HiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 sm:w-5 sm:h-5" />
          <span className="font-medium">Back to Blog</span>
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl px-4 py-6 mx-auto sm:px-6 sm:py-8 lg:px-12">
        <motion.header
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Category Badge */}
          <div className="mb-3 sm:mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full text-secondary-indigo bg-secondary-indigo/10 sm:px-4 sm:py-2 sm:text-sm">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl sm:mb-6 lg:text-4xl xl:text-5xl">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-text-muted sm:gap-6 sm:mb-6 sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <HiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{formatDate(post.createdAt || "")}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <HiClock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 transition-colors hover:text-red-500 sm:space-x-2"
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                {isLiked ? (
                  <HiHeart className="w-4 h-4 text-red-500 sm:w-5 sm:h-5" />
                ) : (
                  <HiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="text-xs font-medium sm:text-sm">
                  {likeCount}
                </span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 transition-colors hover:text-secondary-indigo sm:space-x-2"
                aria-label="Share post"
              >
                <HiShare className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative mb-6 overflow-hidden rounded-2xl shadow-large sm:mb-8 lg:rounded-3xl">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="object-cover w-full h-48 sm:h-64 lg:h-80 xl:h-96"
              priority
              onError={() => {
                console.error("Failed to load image:", post.image);
              }}
            />
          </div>

          {/* Excerpt */}
          <div className="p-4 mb-6 bg-gray-50 rounded-xl sm:p-6 sm:mb-8 lg:rounded-2xl">
            <p className="text-sm text-text-secondary sm:text-base lg:text-lg">
              {post.excerpt}
            </p>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          className="prose max-w-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {post.content?.map((contentBlock, index) => (
            <div key={index}>{renderContent(contentBlock)}</div>
          ))}
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            className="pt-6 mt-8 border-t border-gray-200 sm:pt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="mb-3 text-base font-semibold text-text-primary sm:text-lg sm:mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full sm:px-3 sm:text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Posts or Navigation */}
        <motion.div
          className="pt-6 mt-8 border-t border-gray-200 sm:pt-8 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 sm:px-6 sm:py-3 sm:text-base"
            >
              <HiArrowLeft className="w-3 h-3 mr-2 sm:w-4 sm:h-4" />
              All Posts
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center px-4 py-2 text-sm transition-colors border border-secondary-indigo text-secondary-indigo rounded-xl hover:bg-secondary-indigo/10 sm:px-6 sm:py-3 sm:text-base"
            >
              <HiShare className="w-3 h-3 mr-2 sm:w-4 sm:h-4" />
              Share Article
            </button>
          </div>
        </motion.div>
      </article>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default BlogPost;
