import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectImageUrl,
  getProjectTechList,
  projects,
} from "@/data/projects";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
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

  const description = project.summary;
  const canonicalUrl = `${SITE_URL}/projects/${project.slug}`;
  const imageUrl = getProjectImageUrl(project);
  const keywords = [
    ...getProjectTechList(project),
    ...(project.searchTerms || []),
    SITE_NAME,
    "portfolio project",
  ];

  return {
    title: `${project.name} — Project by ${SITE_NAME}`,
    description,
    keywords,
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
    "@type": "SoftwareApplication",
    name: project.name,
    alternateName: project.searchTerms || undefined,
    description: project.overview,
    image: imageUrl,
    url: canonicalUrl,
    dateCreated: project.year,
    applicationCategory: "DeveloperApplication",
    creator: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: [project.technology, ...(project.searchTerms || [])].join(", "),
    codeRepository: project.github,
    ...(project.link
      ? { sameAs: [project.link, project.github] }
      : { sameAs: [project.github] }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectDetailView project={project} />
    </>
  );
};

export default ProjectDetailPage;
