import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsGithub, BsArrowUpRightSquare } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";
import {
  getProjectBySlug,
  getProjectImageUrl,
  getProjectTechList,
  projects,
} from "@/data/projects";
import { SITE_NAME, SITE_URL, breadcrumbJsonLd } from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = project.name;
  const description = project.summary;
  const canonicalUrl = `${SITE_URL}/projects/${project.slug}`;
  const imageUrl = getProjectImageUrl(project);

  return {
    title,
    description,
    keywords: getProjectTechList(project),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${project.name} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.name} — project by ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

const ProjectDetailPage = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/projects/${project.slug}`;
  const imageUrl = getProjectImageUrl(project);
  const techList = getProjectTechList(project);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Projects", url: `${SITE_URL}/projects` },
    { name: project.name, url: canonicalUrl },
  ]);

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.overview,
    image: imageUrl,
    url: canonicalUrl,
    dateCreated: project.year,
    creator: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: project.technology,
    codeRepository: project.github,
    ...(project.link ? { sameAs: [project.link, project.github] } : {}),
  };

  return (
    <div className="relative z-0 min-h-screen pt-24 bg-bg-primary sm:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <article className="relative z-10 max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-12 sm:py-12">
        <Link
          href="/projects"
          className="relative z-10 inline-flex items-center gap-2 px-1 py-2 -ml-1 mb-8 text-sm transition-colors text-secondary-indigo hover:text-secondary-indigo/80"
        >
          <HiArrowLeft className="w-4 h-4" />
          All Projects
        </Link>

        <header className="mb-8">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-secondary-indigo">
            {project.year}
          </span>
          <h1 className="mb-4 heading-2 text-text-primary">{project.name}</h1>
          <p className="text-base sm:text-lg text-text-secondary">
            {project.summary}
          </p>
        </header>

        <div className="relative mb-10 overflow-hidden rounded-2xl shadow-large aspect-[16/10]">
          <Image
            src={project.image}
            alt={`${project.name} — project screenshot by ${SITE_NAME}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-text-primary">
            Overview
          </h2>
          <p className="text-sm leading-relaxed sm:text-base text-text-secondary">
            {project.overview}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            What it includes
          </h2>
          <ul className="space-y-3">
            {project.highlights.map((item) => (
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
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Tech Stack
          </h2>
          <ul className="flex flex-wrap gap-2">
            {techList.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1.5 text-xs font-medium rounded-lg sm:text-sm text-secondary-indigo bg-secondary-indigo/10"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 btn-primary"
          >
            <BsGithub className="text-lg" />
            View Code
          </Link>
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 btn-secondary"
            >
              <BsArrowUpRightSquare className="text-lg" />
              {project.linkLabel || "Live Demo"}
            </Link>
          )}
        </div>
      </article>
    </div>
  );
};

export default ProjectDetailPage;
