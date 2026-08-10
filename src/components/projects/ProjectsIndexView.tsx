"use client";

import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { useDesignTheme } from "@/context/DesignThemeContext";
import { getProjectTechList, type Project } from "@/data/projects";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

interface ProjectsIndexViewProps {
  projects: Project[];
}

function gridClassForLayout(layout: string): string {
  switch (layout) {
    case "narrow":
      return "grid grid-cols-1 gap-6 sm:gap-8";
    case "wide":
      return "grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 xl:grid-cols-3";
    case "magazine":
      return "grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 xl:grid-cols-3";
    default:
      // Match Latest Blog Posts card layout
      return "grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 xl:grid-cols-3";
  }
}

export default function ProjectsIndexView({ projects }: ProjectsIndexViewProps) {
  const { currentLayout, designStyle } = useDesignTheme();
  const s = designStyle.colors;

  return (
    <div
      className={`min-h-screen pt-24 transition-colors duration-300 bg-bg-primary sm:pt-28 ${designStyle.font}`}
    >
      <main className="w-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-12">
        <div className="py-8 sm:py-12 lg:py-16">
          <Link
            href="/"
            className="inline-flex items-center mb-6 space-x-2 text-sm transition-colors duration-300 text-secondary-indigo hover:text-secondary-indigo/80 group sm:mb-8 sm:text-base"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 sm:w-5 sm:h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <header className="mb-10 text-center sm:mb-14">
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl text-text-primary">
              Featured <span className="text-secondary-indigo">Projects</span>
            </h1>
            <div
              className="flex items-center justify-center mb-3 space-x-2"
              aria-hidden
            >
              <div className="w-8 h-px bg-secondary-indigo/40" />
              <div className="w-2 h-2 rounded-full bg-secondary-indigo" />
              <div className="w-8 h-px bg-secondary-indigo/40" />
            </div>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-text-secondary">
              Full-stack apps, cloud tooling, and backend systems built by{" "}
              {SITE_NAME}. {projects.length} featured projects — including Helix
              Ticketing App, Motherland CRM, and AWS S3 Image Upload.
            </p>
          </header>

          <div
            className={`transition-all duration-300 ${gridClassForLayout(currentLayout)}`}
          >
            {projects.map((project) => {
              const techList = getProjectTechList(project);

              return (
                <article
                  key={project.slug}
                  className="overflow-hidden transition-all duration-500 border rounded-2xl shadow-soft hover:shadow-large surface-card lg:rounded-3xl"
                  itemScope
                  itemType="https://schema.org/SoftwareApplication"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative block h-48 overflow-hidden sm:h-56"
                    aria-label={`View ${project.name} details`}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.name} — project by ${SITE_NAME}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                      itemProp="image"
                    />
                  </Link>

                  <div className="p-5 sm:p-6">
                    <p className="mb-2">
                      <span className="inline-block px-2.5 py-1 text-xs font-bold text-white rounded-full bg-secondary-indigo">
                        <time dateTime={project.year}>{project.year}</time>
                      </span>
                    </p>

                    <h2
                      className="mb-3 text-xl font-semibold text-text-primary"
                      itemProp="name"
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className={`transition-colors hover:underline ${s.accent}`}
                      >
                        {project.name}
                      </Link>
                    </h2>

                    <p
                      className="mb-4 text-sm leading-relaxed sm:text-base text-text-secondary"
                      itemProp="description"
                    >
                      {project.summary}
                    </p>

                    <h3 className="mb-2 text-sm font-semibold tracking-wide uppercase text-text-primary">
                      Tech Stack
                    </h3>
                    <ul
                      className="flex flex-wrap gap-2 mb-4"
                      aria-label={`${project.name} tech stack`}
                    >
                      {techList.map((tech) => (
                        <li key={tech}>
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border sm:text-sm ${s.accent} ${s.accentBg}`}
                            itemProp="keywords"
                          >
                            {tech}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p className="sr-only" itemProp="keywords">
                      {project.technology}
                    </p>

                    <p>
                      <Link
                        href={`/projects/${project.slug}`}
                        className={`text-sm font-medium hover:underline ${s.accent}`}
                      >
                        View {project.name} details
                      </Link>
                    </p>

                    <a
                      href={project.github}
                      className="sr-only"
                      itemProp="codeRepository"
                    >
                      {project.name} source code on GitHub
                    </a>
                    <meta
                      itemProp="url"
                      content={`${SITE_URL}/projects/${project.slug}`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
