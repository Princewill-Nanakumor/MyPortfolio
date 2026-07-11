"use client";
// src/components/projects/Projects.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsArrowUpRightSquare } from "react-icons/bs";
import { motion } from "framer-motion";

interface Project {
  image: string;
  name: string;
  description: string;
  technology: string;
  github: string;
  link?: string;
  linkLabel?: string;
  year: string;
}

const projects: Project[] = [
  {
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
    image: "/counter-strike-2-pc-mac-game-steam-cover.jpg",
    name: "Counter Strike 2 Demo Analyzer",
    description:
      "A Node.js and TypeScript application that parses Counter-Strike 2 demo files, analyzes player deaths using spatial calculations, ranks high-impact moments based on player awareness, and generates structured JSON output for replay rendering, AI-assisted coaching and analytics pipelines.",
    technology:
      "Node.js, Typescript, , @laihoe/demoparser2, Counter-Strike 2 Demo Parser",
    github: "https://github.com/Princewill-Nanakumor/-cs2-demo-analyzer",
    year: "2026",
  },
  {
    image: "/aws_image_upload_app.png",
    name: "AWS S3BUCKET IMAGE UPLOAD APP",
    description:
      "A production-ready image management application built with Next.js 16, React 19, TypeScript, and AWS S3. The application uses direct browser-to-S3 uploads with presigned URLs, automatic server-side fallback uploads, secure file validation, cursor-based pagination, signed download URLs, and a responsive image gallery. It demonstrates scalable cloud storage architecture, modern file handling patterns, and production-focused engineering practices.",
    technology:
      "React, Typescript, Next.js 16 (App Router), Tailwind CSS 4, AWS S3, AWS SDK for JavaScript (v3), file-type, S3 Presigned URLs, @aws-sdk/client-s3, Vercel",
    github: "https://github.com/Princewill-Nanakumor/aws_s3bucket_image_upload",
    link: "https://s3imageupload.netlify.app",
    year: "2026",
  },
  {
    image: "/Screenshot_2026-02-08_at_8.22.17_PM_optimized_5000.png",
    name: "KYIV ELECTRICITY SURVEY APP",
    description:
      "A multi-step web survey that collects real-time electricity availability data across Kyiv, Ukraine. It combines a guided, carousel-style form with a Telegram bot integration so survey responses are delivered instantly to organizers. The project shows how a civic tool can be built with modern web technologies and low-code external integrations.",
    technology: "React, typescript, nextjs, tailwind, telegram_Bot_Api, zod",
    github:
      "https://github.com/Princewill-Nanakumor/MultipleStepForm_TelegramBot",
    link: "https://electricysurverybot.netlify.app/",
    year: "2026",
  },
  {
    image: "/crm.png",
    name: "Motherland CRM Solutions",
    description:
      "This is a full-stack, multi-tenant SaaS CRM built for sales teams managing high volumes of leads. The platform replaces spreadsheet-based workflows with a real-time collaborative system where admins can import leads, assign them to agents, track activity, manage subscriptions, and monitor team performance from a centralized dashboard",
    technology:
      "“Next.js 15, React 19, TypeScript, MongoDB, Mongoose, Tailwind CSS v4, NextAuth, TanStack React Query, Zustand, Ably, Framer Motion, TanStack Table, dnd-kit, React Hook Form, Zod, Resend, Netlify",
    github: "https://github.com/Princewill-Nanakumor/MotherlandCrmSolutions",
    link: "https://motherlandcrmsolutions.com/",
    year: "2025",
  },

  {
    image: "/myportfolio.png",
    name: "My portfolio",
    description:
      "My Portfolio Website is a modern, responsive web app built to showcase my projects, technical skills, and development journey. It features smooth animations, clean UI sections, and interactive project cards with live demo and source code links, creating a professional experience for recruiters and clients. The site is designed for performance, maintainability, and clear storytelling of my work as a full-stack developer.",
    technology:
      "Next.js, React, TypeScript, Tailwind CSS,lucide-react, Chakra UI, Framer Motion, Aos, React-simple-typewriter, Nodemailer, React Hot Toast, Zod, MongoDB, Mongoose, Cloudinary, Nodemailer,vercel ",
    github: "https://github.com/Princewill-Nanakumor/MyPortfolio",
    link: "http://www.princewillnanakumor.com/",
    year: "2023",
  },
];

const SITE_URL = "https://princewillnanakumor.com";

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Featured Projects by Nanakumor Princewill",
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.description,
      codeRepository: project.github,
      programmingLanguage: project.technology,
      dateCreated: project.year,
      ...(project.link ? { url: project.link } : {}),
      author: {
        "@type": "Person",
        name: "Nanakumor Princewill",
        url: SITE_URL,
      },
    },
  })),
};

const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      className="min-h-[80vh] w-full flex items-center bg-bg-primary scroll-mt-20 relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <div className="absolute inset-0">
        <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r blur-3xl sm:w-80 sm:h-80 md:w-96 md:h-96 from-secondary-indigo/5 to-accent-emerald/5"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto sm:px-8 lg:px-12">
        <div className="py-12 sm:py-16">
          <motion.div
            className="mb-8 text-center sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 heading-2 text-text-primary">
              Featured Projects
            </h2>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent sm:w-16 to-secondary-indigo"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px bg-gradient-to-r to-transparent sm:w-16 from-secondary-indigo"></div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-6 sm:gap-8`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-br rounded-2xl blur-xl from-secondary-indigo/10 to-accent-emerald/10 group-hover:blur-2xl"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-large">
                      <Image
                        src={project.image}
                        alt={project.name}
                        width={500}
                        height={300}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t to-transparent from-black/20 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-4 lg:w-1/2">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <span className="px-3 py-1 text-xs font-bold text-white rounded-full sm:px-4 sm:py-2 sm:text-sm bg-secondary-indigo w-fit">
                      {project.year}
                    </span>
                    <h3 className="heading-3 text-text-primary">
                      {project.name}
                    </h3>
                  </div>
                  <p className="body-medium text-text-secondary">
                    {project.description}
                  </p>
                  <p className="text-xs font-medium sm:text-sm text-secondary-indigo">
                    {project.technology}
                  </p>

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <Link
                      href={project.github}
                      target="_blank"
                      className="flex items-center justify-center space-x-2 btn-primary"
                    >
                      <BsGithub className="text-lg" />
                      <span>View Code</span>
                    </Link>
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        className="flex items-center justify-center space-x-2 btn-secondary"
                      >
                        <BsArrowUpRightSquare className="text-lg" />
                        <span>{project.linkLabel || "Live Demo"}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
