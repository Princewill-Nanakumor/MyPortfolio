export const SITE_URL = "https://princewillnanakumor.com";
export const SITE_NAME = "Nanakumor Princewill";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/myPhoto.jpg`;

export interface Project {
  slug: string;
  image: string;
  name: string;
  description: string;
  technology: string;
  github: string;
  link?: string;
  linkLabel?: string;
  year: string;
}

export const projects: Project[] = [
  {
    slug: "helix-ticketing-app",
    image: "/heliz_homepage_img.png",
    name: "Helix Ticketing App",
    description:
      "Helix is a production-inspired customer support and helpdesk platform built with Next.js 16 and PostgreSQL. The application enables users to create, track, and discuss support tickets while providing administrators with tools to manage tickets, users, and system activity. It features secure JWT authentication, role-based access control, activity logging, soft deletes, ticket conversations, priority and status management, and a modern responsive interface. The project demonstrates enterprise application architecture, business workflow implementation, and full-stack software engineering practices.",
    technology:
      "Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Tailwind CSS, JWT, bcrypt, Zod, Sentry",
    github: "https://github.com/Princewill-Nanakumor/ticketing_app",
    link: "https://hilex-ticketing-app.netlify.app",
    year: "2026",
  },
  {
    slug: "counter-strike-2-demo-analyzer",
    image: "/counter-strike-2-pc-mac-game-steam-cover.jpg",
    name: "Counter Strike 2 Demo Analyzer",
    description:
      "A Node.js and TypeScript application that parses Counter-Strike 2 demo files, analyzes player deaths using spatial calculations, ranks high-impact moments based on player awareness, and generates structured JSON output for replay rendering, AI-assisted coaching and analytics pipelines.",
    technology:
      "Node.js, TypeScript, @laihoe/demoparser2, Counter-Strike 2 Demo Parser",
    github: "https://github.com/Princewill-Nanakumor/-cs2-demo-analyzer",
    year: "2026",
  },
  {
    slug: "aws-s3bucket-image-upload-app",
    image: "/aws_image_upload_app.png",
    name: "AWS S3 Image Upload App",
    description:
      "A production-ready image management application built with Next.js 16, React 19, TypeScript, and AWS S3. The application uses direct browser-to-S3 uploads with presigned URLs, automatic server-side fallback uploads, secure file validation, cursor-based pagination, signed download URLs, and a responsive image gallery. It demonstrates scalable cloud storage architecture, modern file handling patterns, and production-focused engineering practices.",
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
    description:
      "A multi-step web survey that collects real-time electricity availability data across Kyiv, Ukraine. It combines a guided, carousel-style form with a Telegram bot integration so survey responses are delivered instantly to organizers. The project shows how a civic tool can be built with modern web technologies and low-code external integrations.",
    technology: "React, TypeScript, Next.js, Tailwind CSS, Telegram Bot API, Zod",
    github:
      "https://github.com/Princewill-Nanakumor/MultipleStepForm_TelegramBot",
    link: "https://electricysurverybot.netlify.app/",
    year: "2026",
  },
  {
    slug: "motherland-crm-solutions",
    image: "/crm.png",
    name: "Motherland CRM Solutions",
    description:
      "A full-stack, multi-tenant SaaS CRM built for sales teams managing high volumes of leads. The platform replaces spreadsheet-based workflows with a real-time collaborative system where admins can import leads, assign them to agents, track activity, manage subscriptions, and monitor team performance from a centralized dashboard.",
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
    description:
      "A modern, responsive portfolio website built to showcase projects, technical skills, and development journey. It features smooth animations, clean UI sections, and interactive project cards with live demo and source code links, creating a professional experience for recruiters and clients.",
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
