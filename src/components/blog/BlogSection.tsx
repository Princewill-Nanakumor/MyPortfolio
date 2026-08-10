"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiCalendar, HiClock } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";

interface BlogSectionProps {
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section
      id="blog"
      className="min-h-[60vh] flex items-center bg-bg-secondary scroll-mt-20 sm:min-h-[80vh]"
    >
      <div className="w-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-12">
        <div className="py-8 sm:py-12 lg:py-16">
          {/* Section Header */}
          <motion.div
            className="mb-6 text-center sm:mb-8 lg:mb-16"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-3 text-2xl font-bold text-text-primary sm:text-3xl sm:mb-4 lg:text-4xl xl:text-5xl">
              Latest <span className="text-secondary-indigo">Blog Posts</span>
            </h2>
            <div className="flex items-center justify-center mb-3 space-x-1 sm:mb-4 sm:space-x-2 lg:space-x-4">
              <div className="w-4 h-px sm:w-8 lg:w-16 bg-secondary-indigo/40"></div>
              <div className="w-1.5 h-1.5 rounded-full sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-secondary-indigo"></div>
              <div className="w-4 h-px sm:w-8 lg:w-16 bg-secondary-indigo/40"></div>
            </div>
            <p className="max-w-2xl mx-auto text-sm text-text-secondary sm:text-base lg:text-lg">
              Insights and thoughts on web development, Next.js, React, and the
              latest technologies.
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id || index}
                  className="group"
                  initial={{ y: 30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="overflow-hidden transition-all duration-500 border rounded-2xl shadow-soft hover:shadow-large surface-card lg:rounded-3xl">
                    {/* Post Image */}
                    <div className="relative h-40 overflow-hidden sm:h-48">
                      <Image
                        src={post.image || "/myPhoto.jpg"}
                        alt={post.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={true}
                        onError={() => {
                          console.error("Failed to load image:", post.image);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-secondary-indigo/80 backdrop-blur-sm sm:px-3 sm:text-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      {/* Meta */}
                      <div className="flex items-center justify-between mb-2 text-xs text-text-muted sm:mb-3 sm:text-sm">
                        <div className="flex items-center space-x-1">
                          <HiCalendar className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="whitespace-nowrap">
                            {formatDate(post.createdAt || post.date || "")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiClock className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="whitespace-nowrap">
                            {post.readTime}
                          </span>
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
                            className="inline-flex items-center px-1.5 py-0.5 text-xs rounded text-text-secondary bg-bg-accent sm:px-2 sm:py-1"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 2 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 text-xs rounded text-text-muted bg-bg-accent sm:px-2 sm:py-1">
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
            <div className="py-8 text-center sm:py-12">
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
                No blog posts yet
              </h3>
              <p className="text-sm text-text-secondary sm:text-base lg:text-lg">
                Check back soon for new content
              </p>
            </div>
          )}

          {/* View All Posts Button */}
          {posts.length > 0 && (
            <motion.div
              className="mt-8 text-center sm:mt-12"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out rounded-xl bg-secondary-indigo hover:bg-indigo-600 hover:shadow-glow hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:px-8 sm:py-4 sm:text-base lg:rounded-2xl"
              >
                <span>View All Posts</span>
                <HiArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
