// src/app/page.tsx
import React from "react";
import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import ProjectsSection from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import BlogSection from "@/components/blog/BlogSection";
import AOSInit from "@/components/common/AOSInit";
import { getPublishedPosts } from "@/lib/blogData";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} | Next.js Web Developer`,
  },
  description:
    "Nanakumor Princewill builds modern web applications with Next.js, React, and TypeScript — including SaaS CRMs, cloud upload apps, CLI tools, and data pipelines.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | Next.js Web Developer`,
    description:
      "Nanakumor Princewill builds modern web applications with Next.js, React, and TypeScript — SaaS, cloud apps, and backend tooling.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Next.js Web Developer`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Next.js Developer`,
    description:
      "Nanakumor Princewill builds modern web applications with Next.js, React, and TypeScript.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function Home(): Promise<React.JSX.Element> {
  const posts = await getPublishedPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <main className="bg-bg-primary">
      <AOSInit />
      <Hero />
      <About />
      <Skills />
      <ProjectsSection />
      <BlogSection posts={recentPosts} />
      <Contact />
    </main>
  );
}
