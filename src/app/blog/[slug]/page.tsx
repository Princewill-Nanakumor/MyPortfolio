import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blogData";
import BlogArticleBody from "@/components/blog/BlogArticleBody";
import BlogPostClient from "./BlogPostClient";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

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
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = post.title;
  const description =
    post.excerpt?.trim() ||
    "Read software engineering articles by Nanakumor Princewill.";
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image?.trim() || DEFAULT_OG_IMAGE;

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
      title: `${post.title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_NAME}`,
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
  const imageUrl = post.image?.trim() || DEFAULT_OG_IMAGE;

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: canonicalUrl },
  ]);

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
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostClient initialPost={post}>
        <BlogArticleBody post={post} omitTitle />
      </BlogPostClient>
    </>
  );
};

export default BlogPostPage;
