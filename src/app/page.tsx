// src/app/page.tsx
import React from "react";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import ProjectsSection from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import BlogSection from "@/components/blog/BlogSection";
import AOSInit from "@/components/common/AOSInit";
import { getPublishedPosts } from "@/lib/blogData";

export const dynamic = "force-dynamic";

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
