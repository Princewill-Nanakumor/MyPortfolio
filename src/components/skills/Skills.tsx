"use client";
// src/components/skills/Skills.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Skill {
  image: string;
  description: string;
  category: string;
}

const skills: Skill[] = [
  { image: "/html.png", description: "HTML", category: "Frontend" },
  { image: "/css.png", description: "CSS", category: "Frontend" },
  { image: "/tailwind.png", description: "Tailwind", category: "Frontend" },
  {
    image: "/javascript.png",
    description: "JavaScript",
    category: "Programming",
  },
  { image: "/react.png", description: "React", category: "Framework" },
  { image: "/nextjs.png", description: "NextJS", category: "Framework" },
  { image: "/mongo.png", description: "MongoDB", category: "Database" },
  { image: "/prisma-ormimg.jpg", description: "Prisma", category: "Database" },
  {
    image: "/postgressimg.jpeg",
    description: "PostgreSQL",
    category: "Database",
  },
  { image: "/github1.png", description: "Github", category: "Tools" },
  { image: "/git.png", description: "Git", category: "Tools" },
  { image: "/cursor-logo.png", description: "Cursor Ai", category: "Tools" },
  { image: "/vercel.png", description: "Vercel", category: "Tools" },
  { image: "/Npm-logo.svg.png", description: "NPM", category: "Tools" },
];

const Skills: React.FC = () => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      id="skills"
      className="min-h-[80vh] w-full flex items-center bg-gradient-to-br from-bg-primary to-bg-secondary scroll-mt-20 relative overflow-hidden"
    >
      {/* Particle Background - Only render on client */}
      {isClient && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full sm:w-2 sm:h-2 bg-secondary-indigo/30"
              animate={{
                x: [0, 150, 0],
                y: [0, -150, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Floating Orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-accent-emerald/20 blur-sm"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-secondary-indigo/5 to-accent-emerald/5 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 py-16 container-custom">
        <motion.div
          className="mb-16 text-center"
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 heading-2 text-text-primary">My Tech Stack</h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-secondary-indigo"></div>
            <div className="w-3 h-3 rounded-full bg-secondary-indigo"></div>
            <div className="w-16 h-px bg-gradient-to-r from-secondary-indigo to-transparent"></div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid max-w-5xl grid-cols-3 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.description}
                className="relative group"
                initial={{ scale: 0.8, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 1,
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.4,
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 },
                }}
              >
                <div className="relative">
                  <div className="flex items-center justify-center w-24 h-24 transition-all duration-500 transform rotate-45 bg-gradient-to-br from-secondary-indigo/10 to-accent-emerald/10 rounded-2xl group-hover:shadow-glow group-hover:bg-gradient-to-br group-hover:from-secondary-indigo/20 group-hover:to-accent-emerald/20">
                    <div className="transform -rotate-45">
                      <Image
                        src={skill.image}
                        width={48}
                        height={48}
                        alt={skill.description}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 transition-opacity duration-300 transform rotate-45 opacity-0 bg-gradient-to-br from-secondary-indigo/20 to-accent-emerald/20 rounded-2xl group-hover:opacity-100"></div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-text-primary sm:text-base">
                    {skill.description}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
