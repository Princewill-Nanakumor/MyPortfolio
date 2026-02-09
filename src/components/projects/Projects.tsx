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
  link: string;
  year: string;
}

const projects: Project[] = [
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
    name: "CRM",
    description:
      "A modern CRM platform designed for seamless Excel/CSV lead management, powerful analytics, and team collaboration. Built as a full-stack web application with advanced importing, role-based access, and a sleek, responsive interface.",
    technology:
      "Next.js, MongoDB, Tailwind CSS, TypeScript, NextAuth.js, React Query, Zustand",
    github: "https://github.com/Princewill-Nanakumor/Zodashield",
    link: "https://zodashield.com",
    year: "2025",
  },

  {
    image: "/myportfolio.png",
    name: "My portfolio",
    description: "Built my porfolio",
    technology: "React, Nodemailer, nextjs, tailwind, react-toast",
    github: "https://github.com/Princewill-Nanakumor/MyPortfolio",
    link: "http://www.princewillnanakumor.com/",
    year: "2023",
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      className="min-h-[80vh] w-full flex items-center bg-bg-primary scroll-mt-20 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-r from-secondary-indigo/5 to-accent-emerald/5 blur-3xl"></div>
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
              <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-transparent to-secondary-indigo"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-secondary-indigo to-transparent"></div>
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
                    <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-br from-secondary-indigo/10 to-accent-emerald/10 rounded-2xl blur-xl group-hover:blur-2xl"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-large">
                      <Image
                        src={project.image}
                        alt={project.name}
                        width={500}
                        height={300}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100"></div>
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
                    <Link
                      href={project.link}
                      target="_blank"
                      className="flex items-center justify-center space-x-2 btn-secondary"
                    >
                      <BsArrowUpRightSquare className="text-lg" />
                      <span>Live Demo</span>
                    </Link>
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
