"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiCalendar, HiClock, HiPlus } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";

interface BlogListClientProps {
  posts: BlogPost[];
}

const BlogListClient = ({ posts }: BlogListClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories: string[] = [
    "All",
    ...new Set(posts.map((post) => post.category).filter(Boolean)),
  ];

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

  return (
    <>
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
                    src={post.image || "/myPhoto.jpg"}
                    alt={post.title}
                    width={400}
                    height={192}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/20"></div>
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="px-2 py-1 text-xs font-medium text-white rounded-full backdrop-blur-sm bg-secondary-indigo/80 sm:px-3 sm:text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center mb-2 space-x-3 text-xs text-text-muted sm:mb-3 sm:space-x-4 sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <HiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {formatDate(post.createdAt || post.date || "")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="mb-2 text-base font-semibold transition-colors duration-300 cursor-pointer text-text-primary hover:underline sm:mb-3 sm:text-lg lg:text-xl line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mb-3 text-xs text-text-secondary line-clamp-3 sm:mb-4 sm:text-sm lg:text-base">
                    {post.excerpt}
                  </p>

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
    </>
  );
};

export default BlogListClient;
