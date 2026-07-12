import type { Metadata } from "next";
import { getProjectTechList, projects } from "@/data/projects";
import ProjectsIndexView from "@/components/projects/ProjectsIndexView";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  breadcrumbJsonLd,
} from "@/lib/seo";

const allTechKeywords = Array.from(
  new Set(projects.flatMap((project) => getProjectTechList(project)))
);

const pageDescription = `Featured projects by ${SITE_NAME}: ${projects
  .map((p) => p.name)
  .join(", ")}. Tech stacks include ${allTechKeywords.slice(0, 12).join(", ")}, and more.`;

export const metadata: Metadata = {
  title: "Projects",
  description: pageDescription,
  keywords: [
    SITE_NAME,
    "portfolio projects",
    "Next.js developer",
    ...projects.map((p) => p.name),
    ...allTechKeywords,
  ],
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: `Projects | ${SITE_NAME}`,
    description: pageDescription,
    url: `${SITE_URL}/projects`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${SITE_NAME}`,
    description: pageDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const ProjectsIndexPage = () => {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Projects", url: `${SITE_URL}/projects` },
  ]);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Projects | ${SITE_NAME}`,
    description: pageDescription,
    url: `${SITE_URL}/projects`,
    about: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.name,
          description: project.summary,
          url: `${SITE_URL}/projects/${project.slug}`,
          image: project.image.startsWith("http")
            ? project.image
            : `${SITE_URL}${project.image}`,
          keywords: project.technology,
          applicationCategory: "DeveloperApplication",
          creator: {
            "@type": "Person",
            name: SITE_NAME,
            url: SITE_URL,
          },
          codeRepository: project.github,
          ...(project.link ? { sameAs: [project.link] } : {}),
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <ProjectsIndexView projects={projects} />
    </>
  );
};

export default ProjectsIndexPage;
