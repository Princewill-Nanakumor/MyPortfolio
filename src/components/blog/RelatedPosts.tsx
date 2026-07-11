// src/components/blog/RelatedPosts.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/Blog";

interface RelatedPostsProps {
  relatedPosts: BlogPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ relatedPosts }) => {
  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-16 bg-bg-secondary">
      <div className="max-w-6xl px-6 mx-auto sm:px-8 lg:px-12">
        <motion.div
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-8 text-center heading-3 text-text-primary">
            Related Posts
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost, index) => (
              <motion.article
                key={relatedPost._id}
                className="group"
                initial={{ y: 30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/blog/${relatedPost.slug}`}>
                  <div className="overflow-hidden transition-all duration-500 bg-white border border-gray-200 rounded-3xl shadow-soft hover:shadow-large hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 transition-colors duration-300 heading-4 text-text-primary group-hover:text-secondary-indigo">
                        {relatedPost.title}
                      </h3>
                      <p className="body-medium text-text-secondary line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedPosts;
