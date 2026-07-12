"use client";
import React from "react";
import { HiArrowDown } from "react-icons/hi";
import Link from "next/link";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";
import SocialLinks from "@/components/common/SocialLinks";

const Hero: React.FC = () => {
  const [typeEffect] = useTypewriter({
    words: ["Princewill", "React", "TypeScript"],
    loop: true, // Changed from {} to true for infinite loop
    typeSpeed: 100,
    deleteSpeed: 150,
  });

  return (
    <section
      id="hero"
      className="flex overflow-hidden relative justify-center items-center pt-16 min-h-screen bg-gradient-to-br sm:pt-20 from-bg-primary via-bg-secondary to-bg-secondary"
    >
      {/* Soft atmosphere — low opacity so default stays white, not lavender/pink */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 -left-20 w-40 h-40 rounded-full blur-3xl sm:top-20 sm:-left-40 sm:w-80 sm:h-80 bg-secondary-indigo/[0.04] animate-float"></div>
        <div
          className="absolute bottom-10 -right-20 w-48 h-48 rounded-full blur-3xl sm:bottom-20 sm:-right-40 sm:w-96 sm:h-96 bg-accent-emerald/[0.04] animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-secondary-indigo/[0.03] to-accent-emerald/[0.03] rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-6 mx-auto w-full max-w-6xl sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] text-center">
          <div className="mx-auto space-y-6 max-w-4xl sm:space-y-8">
            {/* Greeting — same upward motion as other hero text (not from top) */}
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 backdrop-blur-sm sm:px-6 sm:py-3 label-medium text-secondary-indigo bg-white/80 shadow-soft"
              animate={{ y: 0 }}
              initial={{ y: 30 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              Welcome to my portfolio
            </motion.div>

            {/* Main Heading — always visible in HTML for crawlers (no opacity:0) */}
            <motion.div
              className="space-y-2"
              animate={{ y: 0 }}
              initial={{ y: 50 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            >
              <h1 className="heading-hero">
                <span className="sr-only">
                  Nanakumor Princewill, Princewill Nanakumor, Prince Nanakumor —
                  Next.js Developer
                </span>
                {/* Mobile: Split into two lines */}
                <span className="block md:hidden" aria-hidden="true">
                  Hi, I&lsquo;m
                </span>
                <span className="block relative md:hidden" aria-hidden="true">
                  <span className="gradient-text">
                    {typeEffect}
                    <Cursor cursorColor="#4f46e5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-20 blur-2xl from-secondary-indigo to-accent-emerald -z-10"></div>
                </span>

                {/* Desktop: Keep on one line */}
                <span className="hidden md:inline" aria-hidden="true">
                  Hi, I&lsquo;m{" "}
                </span>
                <span className="hidden relative md:inline" aria-hidden="true">
                  <span className="gradient-text">
                    {typeEffect}
                    <Cursor cursorColor="#4f46e5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-20 blur-2xl from-secondary-indigo to-accent-emerald -z-10"></div>
                </span>
              </h1>
              <h2 className="heading-2 text-text-primary">Next.js Developer</h2>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              className="flex justify-center items-center space-x-2 sm:space-x-4"
              animate={{ scaleX: 1 }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-8 h-px bg-gradient-to-r from-transparent sm:w-16 to-secondary-indigo"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px bg-gradient-to-r to-transparent sm:w-16 from-secondary-indigo"></div>
            </motion.div>

            {/* Description */}
            <motion.p
              className="px-4 mx-auto max-w-2xl body-hero"
              animate={{ y: 0 }}
              initial={{ y: 30 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
            >
              I build modern web applications with Next.js and React.
              Specializing in creating seamless user experiences with clean
              code, responsive design, and cutting-edge web technologies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col gap-4 justify-center items-center px-4 sm:gap-6 sm:flex-row"
              animate={{ y: 0 }}
              initial={{ y: 30 }}
              transition={{ type: "spring", stiffness: 100, delay: 1.0 }}
            >
              <Link href="#projects" className="w-full btn-primary sm:w-auto">
                View My Projects
              </Link>
              <Link href="#contact" className="w-full btn-secondary sm:w-auto">
                Let&lsquo;s Connect
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              animate={{ y: 0 }}
              initial={{ y: 30 }}
              transition={{ type: "spring", stiffness: 100, delay: 1.2 }}
            >
              <SocialLinks />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="py-4"
              animate={{ y: 0 }}
              initial={{ y: 30 }}
              transition={{ type: "spring", stiffness: 100, delay: 1.4 }}
            >
              <Link
                href="#about"
                className="inline-flex flex-col items-center group"
              >
                <span className="mb-2 label-medium text-text-muted">
                  Scroll to explore
                </span>
                <div className="flex justify-center items-center w-10 h-10 rounded-full border-2 border-gray-300 transition-all duration-300 sm:w-12 sm:h-12 group-hover:border-secondary-indigo group-hover:shadow-glow">
                  <HiArrowDown className="text-lg transition-all duration-300 animate-bounce sm:text-xl text-text-muted group-hover:text-secondary-indigo" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
