import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsGithub, BsArrowUpRightSquare } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";
import {
  getProjectBySlug,
  getProjectImageUrl,
  projects,
} from "@/data/projects";
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
} from "@/lib/seo";

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
  const description = project.description;
  const canonicalUrl = `${SITE_URL}/projects/${project.slug}`;
  const imageUrl = getProjectImageUrl(project);

  return {
    title,
    description,
    keywords: project.technology.split(",").map((t) => t.trim()),
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

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Projects", url: `${SITE_URL}/projects` },
    { name: project.name, url: canonicalUrl },
  ]);

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
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
    <div className="min-h-screen pt-16 bg-bg-primary sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <article className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-12 py-8 sm:py-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors text-secondary-indigo hover:text-secondary-indigo/80"
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
            {project.description}
          </p>
        </header>

        <div className="relative mb-8 overflow-hidden rounded-2xl shadow-large aspect-[16/10]">
          <Image
            src={project.image}
            alt={`${project.name} — project screenshot by ${SITE_NAME}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-text-primary">
            Tech Stack
          </h2>
          <p className="text-sm sm:text-base text-secondary-indigo">
            {project.technology}
          </p>
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
