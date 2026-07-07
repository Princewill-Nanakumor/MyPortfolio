import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blogData";
import BlogPostClient from "./BlogPostClient";

export const dynamic = "force-dynamic";

const SITE_URL = "https://princewillnanakumor.com";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Nanakumor Princewill",
      robots: { index: false, follow: false },
    };
  }

  const title = post.title;
  const description =
    post.excerpt?.trim() ||
    "Read software engineering articles by Nanakumor Princewill.";
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image?.trim() || `${SITE_URL}/myPhoto.jpg`;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical: canonicalUrl },
    robots: post.published
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: "Nanakumor Princewill",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image?.trim() || `${SITE_URL}/myPhoto.jpg`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: "Nanakumor Princewill",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Nanakumor Princewill",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: post.tags?.join(", "),
    articleSection: post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostClient initialPost={post} />
    </>
  );
};

export default BlogPostPage;
