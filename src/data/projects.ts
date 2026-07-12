export const SITE_URL = "https://princewillnanakumor.com";
export const SITE_NAME = "Nanakumor Princewill";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/myPhoto.jpg`;

export interface Project {
  slug: string;
  image: string;
  name: string;
  /** Short blurb for homepage / index cards */
  summary: string;
  /** Longer overview unique to the detail page */
  overview: string;
  /** Concrete features / outcomes shown only on the detail page */
  highlights: string[];
  technology: string;
  github: string;
  link?: string;
  linkLabel?: string;
  year: string;
  /** Extra phrases so search/AI don't confuse this with unrelated “Helix” brands */
  searchTerms?: string[];
}

export const projects: Project[] = [
  {
    slug: "helix-ticketing-app",
    image: "/helix_homepage_img.png",
    name: "Helix Ticketing App",
    summary:
      "Production-inspired customer support platform with tickets, roles, and admin tooling — built with Next.js 16 and PostgreSQL by Nanakumor Princewill.",
    overview:
      "Helix Ticketing App is Nanakumor Princewill’s full-stack helpdesk / customer-support system (not related to other products named Helix). Users open and discuss tickets; admins manage users, priorities, and system activity from a dedicated console. The goal was to practice enterprise patterns: auth, RBAC, audit trails, and soft deletes — not just a CRUD demo.",
    highlights: [
      "JWT authentication with role-based access for users and admins",
      "Ticket conversations, priority, and status management",
      "Activity logging and soft deletes for safer data handling",
      "Responsive admin and user interfaces for day-to-day support work",
      "PostgreSQL + Prisma data layer with structured validation (Zod)",
      "Error monitoring wired with Sentry for production readiness",
    ],
    technology:
      "Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Tailwind CSS, JWT, bcrypt, Zod, Sentry",
    github: "https://github.com/Princewill-Nanakumor/ticketing_app",
    link: "https://hilex-ticketing-app.netlify.app",
    year: "2026",
    searchTerms: [
      "Helix Ticketing App Nanakumor Princewill",
      "Next.js helpdesk",
      "Next.js ticketing app",
      "PostgreSQL Prisma JWT ticketing",
      "customer support platform Next.js 16",
    ],
  },
  {
    slug: "counter-strike-2-demo-analyzer",
    image: "/counter-strike-2-pc-mac-game-steam-cover.jpg",
    name: "Counter Strike 2 Demo Analyzer",
    summary:
      "CLI-style Node.js tool that parses CS2 demos, ranks high-impact deaths, and emits JSON for coaching and replay pipelines.",
    overview:
      "This analyzer turns raw Counter-Strike 2 demo files into structured insight. It focuses on death events and spatial context so coaches or tooling can surface moments where awareness (or the lack of it) mattered most — then export that ranking as JSON for downstream replay or AI-assisted review.",
    highlights: [
      "Parses CS2 demo files with @laihoe/demoparser2",
      "Spatial calculations around player deaths and positioning",
      "Ranks high-impact moments by awareness-oriented signals",
      "Outputs structured JSON for replay rendering and analytics",
      "Built as a TypeScript Node.js pipeline suitable for tooling / CI use",
    ],
    technology:
      "Node.js, TypeScript, @laihoe/demoparser2, Counter-Strike 2 Demo Parser",
    github: "https://github.com/Princewill-Nanakumor/-cs2-demo-analyzer",
    year: "2026",
  },
  {
    slug: "aws-s3bucket-image-upload-app",
    image: "/aws_image_upload_app.png",
    name: "AWS S3 Image Upload App",
    summary:
      "Image gallery app with direct S3 uploads via presigned URLs, validation, pagination, and signed downloads.",
    overview:
      "A cloud storage–focused Next.js app that keeps large files off the app server when possible. Browsers upload straight to S3 with presigned URLs, with a server-side fallback path when needed. The gallery uses cursor pagination and signed download URLs so access stays controlled without making the API a bottleneck.",
    highlights: [
      "Direct browser-to-S3 uploads using presigned URLs",
      "Automatic server-side fallback upload path",
      "Secure file-type validation before objects are accepted",
      "Cursor-based pagination for scalable gallery browsing",
      "Signed download URLs for controlled access to objects",
      "Responsive image gallery UI on Next.js 16 App Router",
    ],
    technology:
      "React, TypeScript, Next.js 16 (App Router), Tailwind CSS 4, AWS S3, AWS SDK for JavaScript (v3), file-type, S3 Presigned URLs, Vercel",
    github: "https://github.com/Princewill-Nanakumor/aws_s3bucket_image_upload",
    link: "https://s3imageupload.netlify.app",
    year: "2026",
  },
  {
    slug: "kyiv-electricity-survey-app",
    image: "/Screenshot_2026-02-08_at_8.22.17_PM_optimized_5000.png",
    name: "Kyiv Electricity Survey App",
    summary:
      "Multi-step survey collecting Kyiv electricity availability, with responses delivered live via Telegram.",
    overview:
      "Built as a civic data tool: residents walk through a guided, carousel-style form about electricity availability across Kyiv. Validated answers are sent to organizers through a Telegram bot so field data arrives in near real time without a heavy custom ops stack.",
    highlights: [
      "Guided multi-step / carousel survey UX",
      "Zod validation for reliable structured responses",
      "Telegram Bot API integration for instant delivery to organizers",
      "Designed for low-friction mobile participation",
      "Shows how web apps can pair with simple messaging ops tooling",
    ],
    technology:
      "React, TypeScript, Next.js, Tailwind CSS, Telegram Bot API, Zod",
    github:
      "https://github.com/Princewill-Nanakumor/MultipleStepForm_TelegramBot",
    link: "https://electricysurverybot.netlify.app/",
    year: "2026",
  },
  {
    slug: "motherland-crm-solutions",
    image: "/crm.png",
    name: "Motherland CRM Solutions",
    summary:
      "Multi-tenant SaaS CRM for high-volume lead sales teams — import, assign, collaborate, and track performance in real time.",
    overview:
      "Motherland replaces spreadsheet-driven lead handling with a collaborative CRM. Admins import and assign leads; agents work from shared views with live updates. Subscriptions, activity tracking, and dashboards sit on a multi-tenant Next.js + MongoDB stack aimed at real sales throughput.",
    highlights: [
      "Multi-tenant SaaS architecture for separate teams / orgs",
      "Lead import, assignment, and agent workflows",
      "Real-time collaboration via Ably",
      "Auth with NextAuth; forms and validation with RHF + Zod",
      "Data-heavy UI with TanStack Table, React Query, and Zustand",
      "Email via Resend; drag-and-drop flows with dnd-kit",
    ],
    technology:
      "Next.js 15, React 19, TypeScript, MongoDB, Mongoose, Tailwind CSS v4, NextAuth, TanStack React Query, Zustand, Ably, Framer Motion, TanStack Table, dnd-kit, React Hook Form, Zod, Resend, Netlify",
    github: "https://github.com/Princewill-Nanakumor/MotherlandCrmSolutions",
    link: "https://motherlandcrmsolutions.com/",
    year: "2025",
  },
  {
    slug: "my-portfolio",
    image: "/myportfolio.png",
    name: "My Portfolio",
    summary:
      "This site — portfolio, SEO blog CMS, project pages, and admin publishing on Next.js + MongoDB.",
    overview:
      "The portfolio is both a marketing site and a small CMS. Public pages are built for crawlability (SSR blog posts, sitemap, JSON-LD). An authenticated admin area creates and publishes structured blog content with image/video uploads to Cloudinary. Project pages give each build its own URL for search and sharing.",
    highlights: [
      "Server-rendered blog posts with semantic headings and paragraphs",
      "Admin CMS: drafts, publish flow, content blocks, Cloudinary media",
      "Dedicated /projects and /projects/[slug] pages for SEO",
      "Dynamic sitemap and robots rules for major crawlers",
      "Contact form email via Nodemailer",
      "JWT-protected admin routes on Vercel",
    ],
    technology:
      "Next.js, React, TypeScript, Tailwind CSS, Framer Motion, MongoDB, Mongoose, Cloudinary, Vercel",
    github: "https://github.com/Princewill-Nanakumor/MyPortfolio",
    link: "https://princewillnanakumor.com/",
    year: "2023",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectImageUrl(project: Project): string {
  if (project.image.startsWith("http")) return project.image;
  return `${SITE_URL}${project.image}`;
}

/** Comma-separated tech string → chips */
export function getProjectTechList(project: Project): string[] {
  return project.technology
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
