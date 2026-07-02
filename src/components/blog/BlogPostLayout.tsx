"use client";
import { BlogPost as BlogPostType } from "../../types/Blog";
import { DesignStyle, LayoutOption } from "./DesignConfig";
import BlogHeader from "./BlogHeader";
import BlogContent from "./BlogContent";
import SocialLinks from "@/components/common/SocialLinks";
import { HiShare } from "react-icons/hi";

interface BlogPostLayoutProps {
  post: BlogPostType;
  designStyle: DesignStyle;
  layoutStyle: LayoutOption;
  currentLayout: string;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
}

const BlogPostLayout = ({
  post,
  designStyle,
  layoutStyle,
  currentLayout,
  isLiked,
  likeCount,
  onLike,
  onShare,
}: BlogPostLayoutProps) => {
  const renderSplitLayout = () => (
    <div className={layoutStyle.proseClass}>
      {/* Main content area (2/3 width) */}
      <div className="lg:col-span-2">
        <BlogHeader
          post={post}
          designStyle={designStyle}
          layoutStyle={layoutStyle}
          isLiked={isLiked}
          likeCount={likeCount}
          onLike={onLike}
          onShare={onShare}
        />

        <BlogContent
          post={post}
          designStyle={designStyle}
          layoutStyle={layoutStyle}
          currentLayout={currentLayout}
        />
      </div>

      {/* Sidebar area (1/3 width) */}
      <div className="p-6 lg:col-span-1 lg:p-8">
        <div className="sticky space-y-6 top-8">
          {/* Author info */}
          <div
            className={`p-6 rounded-xl ${designStyle.colors.accentBg} ${designStyle.colors.border} border`}
          >
            <h3
              className={`text-lg font-semibold mb-3 ${designStyle.colors.accent}`}
            >
              About the Author
            </h3>
            <p className={`text-sm ${designStyle.colors.textSecondary}`}>
              {post.author?.bio ||
                "Passionate developer and writer sharing insights about technology and development."}
            </p>
          </div>

          {/* Social Links */}
          <div
            className={`p-6 rounded-xl ${designStyle.colors.accentBg} ${designStyle.colors.border} border`}
          >
            <SocialLinks iconSize="sm" />
          </div>

          {/* Share button */}
          <div
            className={`p-6 rounded-xl ${designStyle.colors.accentBg} ${designStyle.colors.border} border`}
          >
            <button
              onClick={onShare}
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80"
            >
              <HiShare className="w-4 h-4 mr-2" />
              Share Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMagazineLayout = () => (
    <div className={layoutStyle.proseClass}>
      <BlogHeader
        post={post}
        designStyle={designStyle}
        layoutStyle={layoutStyle}
        isLiked={isLiked}
        likeCount={likeCount}
        onLike={onLike}
        onShare={onShare}
      />

      <BlogContent
        post={post}
        designStyle={designStyle}
        layoutStyle={layoutStyle}
        currentLayout={currentLayout}
      />

      {/* Social Links for Magazine Layout */}
      <div className="pt-8 mt-12 border-t border-gray-200">
        <div className="text-center">
          <SocialLinks />
        </div>
      </div>
    </div>
  );

  const renderDefaultLayout = () => (
    <div>
      <BlogHeader
        post={post}
        designStyle={designStyle}
        layoutStyle={layoutStyle}
        isLiked={isLiked}
        likeCount={likeCount}
        onLike={onLike}
        onShare={onShare}
      />

      <BlogContent
        post={post}
        designStyle={designStyle}
        layoutStyle={layoutStyle}
        currentLayout={currentLayout}
      />

      {/* Social Links for Default Layout */}
      <div className="pt-8 mt-12 border-t border-gray-200">
        <div className="text-center">
          <SocialLinks />
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`px-4 py-6 mx-auto sm:px-6 sm:py-8 lg:px-8 lg:py-12 xl:px-12 ${layoutStyle.containerClass}`}
    >
      {currentLayout === "split"
        ? renderSplitLayout()
        : currentLayout === "magazine"
          ? renderMagazineLayout()
          : renderDefaultLayout()}
    </article>
  );
};

export default BlogPostLayout;
