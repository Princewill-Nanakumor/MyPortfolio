import type { Metadata } from "next";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { getPublishedPosts } from "@/lib/blogData";
import BlogListClient from "./BlogListClient";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Articles",
  description:
    "Articles by Nanakumor Princewill on web development, Next.js, React, TypeScript, backend engineering, CLI tools, cloud engineering, and data pipelines.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog Articles | ${SITE_NAME}`,
    description:
      "Articles by Nanakumor Princewill on web development, Next.js, React, TypeScript, backend engineering, CLI tools, and cloud engineering.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog Articles | ${SITE_NAME}`,
    description:
      "Articles by Nanakumor Princewill on web development, Next.js, React, TypeScript, and cloud engineering.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const BlogPage = async () => {
  const posts = await getPublishedPosts();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} — Blog`,
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      image: post.image || DEFAULT_OG_IMAGE,
    })),
  };

  return (
    <div className="pt-16 min-h-screen bg-bg-primary sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-12">
        <div className="py-8 sm:py-12 lg:py-16">
          <Link
            href="/projects"
            className="inline-flex items-center mb-6 space-x-2 text-sm transition-colors duration-300 text-secondary-indigo hover:text-secondary-indigo/80 group sm:mb-8 sm:text-base"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 sm:w-5 sm:h-5" />
            <span className="font-medium">Back to Projects</span>
          </Link>

          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl text-text-primary">
              Blog <span className="text-secondary-indigo">Articles</span>
            </h1>
            <div className="flex justify-center items-center mb-3 space-x-1 sm:mb-4 sm:space-x-2 lg:space-x-4">
              <div className="w-4 h-px sm:w-8 lg:w-16 bg-secondary-indigo/40"></div>
              <div className="w-1.5 h-1.5 rounded-full sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-secondary-indigo"></div>
              <div className="w-4 h-px sm:w-8 lg:w-16 bg-secondary-indigo/40"></div>
            </div>
            <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-text-secondary">
              Explore insights and thoughts on modern web development
            </p>
          </div>

          <BlogListClient posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
