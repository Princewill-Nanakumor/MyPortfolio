"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { BlogPost as BlogPostType } from "@/types/Blog";
import ScrollToTop from "@/components/common/ScrollToTop";
import DesignSwitcher from "@/components/blog/DesignSwitcher";
import MessageModal from "@/components/blog/MessageModal";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import { designStyles, layoutOptions } from "@/components/blog/DesignConfig";

interface BlogPostClientProps {
  initialPost: BlogPostType;
}

const BlogPostClient = ({ initialPost }: BlogPostClientProps) => {
  const [post] = useState<BlogPostType>(initialPost);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(
    typeof initialPost.likes === "number" ? initialPost.likes : 0
  );

  const [currentDesign, setCurrentDesign] = useState<string>("minimalist");
  const [currentLayout, setCurrentLayout] = useState<string>("default");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setIsLiked(likedPosts.includes(post._id));
  }, [post._id]);

  const handleLike = useCallback(async (): Promise<void> => {
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
  }, [post._id, isLiked]);

  const handleShare = useCallback(async (): Promise<void> => {
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
  }, [post.title, post.excerpt]);

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

      <ScrollToTop />

      <DesignSwitcher
        currentDesign={currentDesign}
        setCurrentDesign={setCurrentDesign}
        currentLayout={currentLayout}
        setCurrentLayout={setCurrentLayout}
      />
    </div>
  );
};

export default BlogPostClient;
