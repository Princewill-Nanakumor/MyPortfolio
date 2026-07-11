import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/data/projects";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Portfolio of Nanakumor Princewill — Next.js developer building modern web apps, backend tools, and cloud engineering projects.",
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    alternateName: [
      "Nanakumor Prince",
      "Prince Nanakumor",
      "Princewill Nanakumor",
    ],
    jobTitle: "Next.js Developer",
    description:
      "Building sleek, responsive, and high-performance web applications with React, Next.js, TypeScript, and cloud tooling.",
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    sameAs: [
      "https://github.com/Princewill-Nanakumor",
      "https://www.linkedin.com/in/princewill-nanakumor-0a68b824a/",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "MongoDB",
      "AWS",
      "Cloud Engineering",
      "Backend Development",
      "Web Development",
    ],
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE };
