"use client";

import Image from "next/image";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useDesignTheme } from "@/context/DesignThemeContext";
import { getProjectTechList, type Project } from "@/data/projects";
import { SITE_NAME } from "@/lib/seo";

interface ProjectDetailViewProps {
  project: Project;
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 break-inside-avoid">
      <h2 className="mb-3 text-lg font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm sm:text-base text-text-secondary"
        >
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-indigo"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Project detail UI — themes/layouts come from global DesignThemeProvider.
 */
export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const { designStyle, layoutStyle } = useDesignTheme();
  const techList = getProjectTechList(project);
  const s = designStyle.colors;

  return (
    <div
      className={`min-h-screen pt-24 transition-colors duration-300 sm:pt-28 ${designStyle.font}`}
    >
      <article
        className={`relative z-10 content-shell px-4 py-8 transition-all duration-300 sm:px-6 sm:py-12 lg:px-8 xl:px-12 ${layoutStyle.containerClass} ${layoutStyle.contentLayout}`}
      >
        <div className={layoutStyle.proseClass}>
          <Link
            href="/projects"
            className={`relative z-10 inline-flex items-center gap-2 px-1 py-2 -ml-1 mb-8 text-sm transition-colors ${s.accent} hover:opacity-80 group`}
          >
            <HiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to All Projects
          </Link>

          <header className="mb-8 break-inside-avoid">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-secondary-indigo">
              {project.year}
            </span>
            <h1 className="mb-4 heading-2 text-text-primary">{project.name}</h1>
            <p className={`mb-2 text-sm font-medium ${s.accent}`}>
              Portfolio project by {SITE_NAME}
            </p>
            <p className="text-base sm:text-lg text-text-secondary">
              {project.summary}
            </p>
          </header>

          <div className="relative mb-10 overflow-hidden break-inside-avoid rounded-2xl shadow-large aspect-[16/10]">
            <Image
              src={project.image}
              alt={`${project.name} — project screenshot by ${SITE_NAME}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              quality={75}
            />
          </div>

          <DetailSection title="Built for">
            <p className="text-sm leading-relaxed sm:text-base text-text-secondary">
              {project.builtFor}
            </p>
          </DetailSection>

          <DetailSection title="Problem">
            <p className="text-sm leading-relaxed sm:text-base text-text-secondary">
              {project.problem}
            </p>
          </DetailSection>

          <DetailSection title="Overview">
            <p className="text-sm leading-relaxed sm:text-base text-text-secondary">
              {project.overview}
            </p>
          </DetailSection>

          <DetailSection title="Capabilities">
            <BulletList items={project.capabilities} />
          </DetailSection>

          <DetailSection title="Architecture notes">
            <BulletList items={project.architecture} />
          </DetailSection>

          <DetailSection title="Outcomes">
            <BulletList items={project.outcomes} />
          </DetailSection>

          <DetailSection title="Tech stack">
            <ul className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <li
                  key={tech}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg sm:text-sm ${s.accent} ${s.accentBg}`}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </DetailSection>

          <div className="flex flex-col gap-3 break-inside-avoid sm:flex-row">
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 btn-primary"
            >
              <BsGithub className="text-lg" />
              View Code
            </Link>

            {project.blogSlug && (
              <Link
                href={`/blog/${project.blogSlug}`}
                className="inline-flex items-center justify-center gap-2 btn-secondary"
              >
                <HiArrowRight className="text-lg" />
                {project.blogLabel || "Read Blog"}
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
