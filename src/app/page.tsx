// src/app/page.tsx
"use client";
import React from "react";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import ProjectsSection from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import BlogSection from "@/components/blog/BlogSection";

export default function Home(): React.JSX.Element {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      duration: 800,
      delay: 100,
      mirror: true,
      anchorPlacement: "top-bottom",
      offset: 120,
    });
    AOS.refresh();
  }, []);

  return (
    <main className="bg-bg-primary">
      <Hero />
      <About />
      <Skills />
      <ProjectsSection />
      <BlogSection />
      <Contact />
    </main>
  );
}
