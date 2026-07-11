import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Featured projects by Nanakumor Princewill — SaaS CRMs, cloud apps, CLI tools, surveys, and full-stack Next.js products.",
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: `Projects | ${SITE_NAME}`,
    description:
      "Featured projects by Nanakumor Princewill — SaaS CRMs, cloud apps, CLI tools, surveys, and full-stack Next.js products.",
    url: `${SITE_URL}/projects`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${SITE_NAME}`,
    description:
      "Featured projects by Nanakumor Princewill — SaaS CRMs, cloud apps, CLI tools, and full-stack Next.js products.",
    images: [DEFAULT_OG_IMAGE],
  },
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
    url: `${SITE_URL}/projects`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/projects/${project.slug}`,
        name: project.name,
      })),
    },
  };

  return (
    <div className="min-h-screen pt-16 bg-bg-primary sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-12">
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="mb-10 text-center sm:mb-14">
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl text-text-primary">
              Featured <span className="gradient-text">Projects</span>
            </h1>
            <div className="flex items-center justify-center mb-3 space-x-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-secondary-indigo" />
              <div className="w-2 h-2 rounded-full bg-secondary-indigo" />
              <div className="w-8 h-px bg-gradient-to-r from-secondary-indigo to-transparent" />
            </div>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-text-secondary">
              Full-stack apps, cloud tooling, and backend systems built by{" "}
              {SITE_NAME}.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-2xl shadow-soft hover:shadow-large"
              >
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden sm:h-56">
                    <Image
                      src={project.image}
                      alt={`${project.name} — project by ${SITE_NAME}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 text-xs font-bold text-white rounded-full bg-secondary-indigo">
                        {project.year}
                      </span>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-text-primary hover:underline">
                      {project.name}
                    </h2>
                    <p className="mb-3 text-sm text-text-secondary line-clamp-3">
                      {project.description}
                    </p>
                    <p className="text-xs font-medium text-secondary-indigo line-clamp-2">
                      {project.technology}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsIndexPage;
