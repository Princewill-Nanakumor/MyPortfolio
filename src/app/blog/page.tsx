"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiCalendar,
  HiClock,
  HiTag,
  HiPlus,
} from "react-icons/hi";
import { blogService } from "@/services/blogService";
import { BlogPost } from "@/types/Blog";

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const fetchedPosts = await blogService.getAllPosts({ published: true });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load blog posts from database");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from blog posts
  const categories: string[] = [
    "All",
    ...new Set(posts.map((post) => post.category)),
  ];

  // Filter posts based on selected category
  const filteredPosts: BlogPost[] =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-bg-primary sm:pt-20">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-12">
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-3 border-2 rounded-full animate-spin border-secondary-indigo border-t-transparent sm:w-12 sm:h-12 sm:mb-4"></div>
              <p className="text-sm text-text-secondary sm:text-base">
                Loading blog posts...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-bg-primary sm:pt-20">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-12">
        <div className="py-8 sm:py-12 lg:py-16">
          {/* Error Message */}
          {error && (
            <motion.div
              className="p-3 mb-4 border border-red-200 bg-red-50 rounded-xl sm:p-4 sm:mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 text-red-600 sm:w-5 sm:h-5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-red-800 sm:text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            className="mb-8 text-center sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl text-text-primary">
              Blog <span className="gradient-text">Articles</span>
            </h1>
            <div className="flex items-center justify-center mb-3 space-x-1 sm:mb-4 sm:space-x-2 lg:space-x-4">
              <div className="w-4 h-px bg-gradient-to-r from-transparent sm:w-8 lg:w-16 to-secondary-indigo"></div>
              <div className="w-1.5 h-1.5 rounded-full sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-secondary-indigo"></div>
              <div className="w-4 h-px bg-gradient-to-r to-transparent sm:w-8 lg:w-16 from-secondary-indigo"></div>
            </div>
            <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-text-secondary">
              Explore insights and thoughts on modern web development
            </p>
          </motion.div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-8 sm:gap-3 sm:mb-12 lg:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 text-xs rounded-full font-medium transition-all duration-300 sm:px-4 sm:py-2.5 sm:text-sm lg:px-6 lg:py-3 lg:text-base ${
                    selectedCategory === category
                      ? "bg-secondary-indigo text-white shadow-glow"
                      : "bg-white text-text-secondary border border-gray-200 hover:border-secondary-indigo hover:text-secondary-indigo"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post._id || index}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="overflow-hidden transition-all duration-500 bg-white border border-gray-200 rounded-2xl shadow-soft hover:shadow-large lg:rounded-3xl">
                    {/* Post Image */}
                    <div className="relative h-40 overflow-hidden sm:h-48 lg:h-52">
                      <Image
                        src={post.image || "/placeholder-image.jpg"}
                        alt={post.title}
                        width={400}
                        height={192}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        unoptimized={true}
                        onError={(e) => {
                          console.error("Failed to load image:", post.image);
                          console.error("Error details:", e);
                          // Log additional info for production debugging
                          if (typeof window !== "undefined") {
                            console.log("Current URL:", window.location.href);
                            console.log("Environment:", process.env.NODE_ENV);
                          }
                        }}
                        onLoad={() => {
                          console.log("Successfully loaded image:", post.image);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/20"></div>
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="px-2 py-1 text-xs font-medium text-white rounded-full backdrop-blur-sm bg-secondary-indigo/80 sm:px-3 sm:text-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      {/* Meta */}
                      <div className="flex items-center mb-2 space-x-3 text-xs text-text-muted sm:mb-3 sm:space-x-4 sm:text-sm">
                        <div className="flex items-center space-x-1">
                          <HiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            {formatDate(post.createdAt || post.date || "")}
                          </span>
                          <span className="sm:hidden">
                            {new Date(
                              post.createdAt || post.date || ""
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="mb-2 text-base font-semibold transition-colors duration-300 cursor-pointer text-text-primary hover:underline sm:mb-3 sm:text-lg lg:text-xl line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="mb-3 text-xs text-text-secondary line-clamp-3 sm:mb-4 sm:text-sm lg:text-base">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3 sm:gap-2 sm:mb-4">
                        {post.tags?.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-600 bg-gray-100 rounded sm:px-2 sm:py-1"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 2 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 rounded sm:px-2 sm:py-1">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Read More */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center space-x-1 font-medium transition-colors duration-300 text-secondary-indigo hover:text-secondary-indigo/80 group sm:space-x-2"
                      >
                        <span className="text-xs sm:text-sm">Read Article</span>
                        <HiArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              className="py-8 text-center sm:py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 text-gray-400 sm:w-16 sm:h-16 sm:mb-4">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold text-text-primary sm:text-lg lg:text-xl">
                {posts.length === 0 ? "No blog posts yet" : "No posts found"}
              </h3>
              <p className="text-sm text-text-secondary sm:text-base lg:text-lg">
                {posts.length === 0
                  ? "Blog posts will appear here once they are created in the admin panel."
                  : `No posts found in the "${selectedCategory}" category.`}
              </p>
              {posts.length === 0 && (
                <div className="mt-4 sm:mt-6">
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-4 py-2 text-sm text-white transition-colors rounded-xl bg-secondary-indigo hover:bg-secondary-indigo/80 sm:px-6 sm:py-3 sm:text-base"
                  >
                    <HiPlus className="w-3 h-3 mr-2 sm:w-4 sm:h-4" />
                    Create Your First Post
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Refresh Button */}
          <motion.div
            className="mt-8 text-center sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => {
                void loadPosts().catch((error) => {
                  console.error("Failed to reload posts:", error);
                });
              }}
              className="inline-flex items-center px-4 py-2 text-sm transition-colors border rounded-xl text-secondary-indigo border-secondary-indigo hover:bg-secondary-indigo/10 sm:px-6 sm:py-3 sm:text-base"
            >
              <svg
                className="w-3 h-3 mr-2 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Posts
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
