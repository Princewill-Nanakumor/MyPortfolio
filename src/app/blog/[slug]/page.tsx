"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";
import { blogService } from "@/services/blogService";
import { BlogPost as BlogPostType } from "../../../types/Blog";
import ScrollToTop from "@/components/common/ScrollToTop";
import DesignSwitcher from "@/components/blog/DesignSwitcher";
import MessageModal from "@/components/blog/MessageModal";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import { designStyles, layoutOptions } from "@/components/blog/DesignConfig";

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

  // Design switcher states with localStorage persistence
  const [currentDesign, setCurrentDesign] = useState<string>("minimalist");
  const [currentLayout, setCurrentLayout] = useState<string>("default");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedDesign = localStorage.getItem("blogDesign");
    const savedLayout = localStorage.getItem("blogLayout");

    if (savedDesign && designStyles[savedDesign]) {
      setCurrentDesign(savedDesign);
    }

    if (savedLayout && layoutOptions[savedLayout]) {
      setCurrentLayout(savedLayout);
    }
  }, []);

  // Resolve params when component mounts
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const loadPost = useCallback(async (): Promise<void> => {
    if (!resolvedParams) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedPost = await blogService.getPost(resolvedParams.slug);

      setPost(fetchedPost);
      const likesCount =
        typeof fetchedPost.likes === "number" ? fetchedPost.likes : 0;
      setLikeCount(likesCount);

      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      const isPostLiked = likedPosts.includes(fetchedPost._id);
      setIsLiked(isPostLiked);
    } catch (error) {
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

  const handleLike = useCallback(async (): Promise<void> => {
    if (!post) return;

    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/blog/${post._id}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.data.likes);
        setIsLiked(!isLiked);

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
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  }, [post, isLiked]);

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
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setModalMessage("Link copied to clipboard!");
        setIsModalVisible(true);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setModalMessage("Link copied to clipboard!");
        setIsModalVisible(true);
      }
    }
  }, [post]);

  const handleLikeClick = (): void => {
    void handleLike().catch((error) => {
      console.error("Like failed:", error);
    });
  };

  const handleShareClick = (): void => {
    void handleShare().catch((error) => {
      console.error("Share failed:", error);
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-primary sm:pt-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-b-2 rounded-full animate-spin border-secondary-indigo sm:w-24 sm:h-24 lg:w-32 lg:h-32"></div>
          <p className="text-sm text-text-secondary sm:text-base lg:text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-primary sm:pt-20">
        <div className="max-w-sm mx-auto text-center sm:max-w-md lg:max-w-lg">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
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
          <h2 className="mb-4 text-lg font-bold text-text-primary sm:text-xl lg:text-2xl">
            Post Not Found
          </h2>
          <p className="mb-6 text-sm text-text-secondary sm:text-base lg:text-lg">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                void loadPost().catch((error) => {
                  console.error("Failed to reload post:", error);
                });
              }}
              className="w-full px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 sm:text-base lg:text-lg"
            >
              Try Again
            </button>
            <Link
              href="/blog"
              className="block w-full px-4 py-2 text-sm transition-colors border text-secondary-indigo border-secondary-indigo rounded-xl hover:bg-secondary-indigo/10 sm:text-base lg:text-lg"
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

  const designStyle = designStyles[currentDesign];
  const layoutStyle = layoutOptions[currentLayout];

  return (
    <div
      className={`min-h-screen pt-16 ${designStyle.font} ${designStyle.colors.bg} sm:pt-20 lg:pt-24`}
    >
      <MessageModal
        message={modalMessage}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />

      {/* Back Button */}
      <div
        className={`px-4 pt-6 mx-auto sm:px-6 sm:pt-8 lg:px-8 xl:px-12 ${layoutStyle.containerClass}`}
      >
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-sm transition-colors duration-300 text-secondary-indigo hover:text-secondary-indigo/80 group sm:text-base lg:text-lg"
        >
          <HiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          <span className="font-medium">Back to Blog</span>
        </Link>
      </div>

      {/* Article Layout */}
      <BlogPostLayout
        post={post}
        designStyle={designStyle}
        layoutStyle={layoutStyle}
        currentLayout={currentLayout}
        isLiked={isLiked}
        likeCount={likeCount}
        onLike={handleLikeClick}
        onShare={handleShareClick}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Design Switcher */}
      <DesignSwitcher
        currentDesign={currentDesign}
        setCurrentDesign={setCurrentDesign}
        currentLayout={currentLayout}
        setCurrentLayout={setCurrentLayout}
      />
    </div>
  );
};

export default BlogPost;
