"use client";
// src/components/projects/Projects.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsArrowUpRightSquare } from "react-icons/bs";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Featured Projects by ${SITE_NAME}`,
  itemListElement: [] as Array<{
    "@type": "ListItem";
    position: number;
    item: Record<string, unknown>;
  }>,
};

const ProjectsSection: React.FC = () => {
  // Homepage respects manual order from src/data/projects.ts.
  const featuredProjects = projects.slice(0, 4);

  // Keep JSON-LD aligned with what’s actually rendered.
  const featuredProjectsJsonLd = {
    ...projectsJsonLd,
    itemListElement: featuredProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.name,
        description: project.summary,
        url: `${SITE_URL}/projects/${project.slug}`,
        image: project.image.startsWith("http")
          ? project.image
          : `${SITE_URL}${project.image}`,
        codeRepository: project.github,
        dateCreated: project.year,
        ...(project.link ? { sameAs: [project.link] } : {}),
        creator: {
          "@type": "Person",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
    })),
  };

  return (
    <section
      id="projects"
      className="min-h-[80vh] w-full flex items-center bg-bg-primary scroll-mt-20 relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(featuredProjectsJsonLd),
        }}
      />

      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto sm:px-8 lg:px-12">
        <div className="py-12 sm:py-16">
          <motion.div
            className="mb-8 text-center sm:mb-16"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 heading-2 text-text-primary">
              Featured Projects
            </h2>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40"></div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-6 sm:gap-8`}
                initial={{ x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="w-full lg:w-1/2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative block group"
                    aria-label={`View details for ${project.name}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-large">
                      <Image
                        src={project.image}
                        alt={`${project.name} — project by ${SITE_NAME}`}
                        width={500}
                        height={300}
                        sizes="(max-width: 1024px) 100vw, 500px"
                        quality={75}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t to-transparent from-black/20 group-hover:opacity-100"></div>
                    </div>
                  </Link>
                </div>

                <div className="w-full space-y-4 lg:w-1/2">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <span className="px-3 py-1 text-xs font-bold text-white rounded-full sm:px-4 sm:py-2 sm:text-sm bg-secondary-indigo w-fit">
                      {project.year}
                    </span>
                    <h3 className="heading-3 text-text-primary">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="transition-colors hover:text-secondary-indigo"
                      >
                        {project.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="body-medium text-text-secondary">
                    {project.summary}
                  </p>
                  <p className="text-xs font-medium sm:text-sm text-secondary-indigo">
                    {project.technology}
                  </p>

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-center space-x-2 btn-primary"
                    >
                      <span>View Details</span>
                    </Link>
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 btn-secondary"
                      aria-label={`${project.name} source code on GitHub`}
                    >
                      <BsGithub className="text-lg" />
                      <span>View Code</span>
                    </Link>
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 btn-secondary"
                        aria-label={`${project.name} live demo`}
                      >
                        <BsArrowUpRightSquare className="text-lg" />
                        <span>{project.linkLabel || "Live Demo"}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center font-medium transition-colors text-secondary-indigo hover:text-secondary-indigo/80"
            >
              View all projects →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
