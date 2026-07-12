"use client";
import { HiShare } from "react-icons/hi";
import { BlogPost as BlogPostType } from "@/types/Blog";
import { DesignStyle, LayoutOption } from "./DesignConfig";
import BlogArticleBody from "./BlogArticleBody";

interface BlogContentProps {
  post: BlogPostType;
  designStyle: DesignStyle;
  layoutStyle: LayoutOption;
  currentLayout?: string;
  /** Server-rendered body; falls back to BlogArticleBody if omitted */
  children?: React.ReactNode;
}

const BlogContent = ({
  post,
  designStyle,
  layoutStyle,
  currentLayout,
  children,
}: BlogContentProps) => {
  const s = designStyle.colors;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    }
  };

  const handleShareClick = (): void => {
    void handleShare().catch((error) => {
      console.error("Share failed:", error);
    });
  };

  return (
    <div className={`transition-all duration-300 ${layoutStyle.contentLayout}`}>
      <div className={`prose max-w-none transition-colors duration-300 ${designStyle.prose} ${s.textPrimary}`}>
        {children ?? <BlogArticleBody post={post} omitTitle />}
      </div>

      {currentLayout !== "split" && (
        <footer className={`pt-6 mt-8 border-t ${s.border} sm:pt-8 sm:mt-12 lg:pt-10 lg:mt-16`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-start sm:gap-4 lg:gap-6">
            <button
              onClick={handleShareClick}
              className="inline-flex items-center justify-center px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-4 lg:text-lg"
            >
              <HiShare className="w-3 h-3 mr-2 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              Share Article
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default BlogContent;
