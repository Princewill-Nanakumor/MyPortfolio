// src/app/page.tsx
import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import { getPublishedPosts } from "@/lib/blogData";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const About = dynamic(() => import("@/components/about/About"));
const Skills = dynamic(() => import("@/components/skills/Skills"));
const ProjectsSection = dynamic(() => import("@/components/projects/Projects"));
const BlogSection = dynamic(() => import("@/components/blog/BlogSection"));
const Contact = dynamic(() => import("@/components/contact/Contact"));

/** Cache homepage HTML briefly so Mongo isn't on the critical path every request. */
export const revalidate = 60;

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
      <Hero />
      <About />
      <Skills />
      <ProjectsSection />
      <BlogSection posts={recentPosts} />
      <Contact />
    </main>
  );
}
