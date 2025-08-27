"use client";
import React from "react";
import { HiArrowDown } from "react-icons/hi";
import Link from "next/link";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";
import SocialLinks from "@/components/common/SocialLinks";

const Hero: React.FC = () => {
  const [typeEffect] = useTypewriter({
    words: ["<Princewill/>", "<React/>", "<Typescript/>"],
    loop: true, // Changed from {} to true for infinite loop
    typeSpeed: 100,
    deleteSpeed: 150,
  });

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-screen pt-16 overflow-hidden sm:pt-20 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-accent"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-40 h-40 rounded-full top-10 -left-20 sm:top-20 sm:-left-40 sm:w-80 sm:h-80 bg-secondary-indigo/10 blur-3xl animate-float"></div>
        <div
          className="absolute w-48 h-48 rounded-full bottom-10 -right-20 sm:bottom-20 sm:-right-40 sm:w-96 sm:h-96 bg-accent-emerald/10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-secondary-indigo/5 to-accent-emerald/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Greeting */}
            <motion.div
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-full sm:px-6 sm:py-3 label-medium text-secondary-indigo bg-white/80 backdrop-blur-sm shadow-soft"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              Welcome to my portfolio
            </motion.div>

            {/* Main Heading */}
            <motion.div
              className="space-y-2"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            >
              <h1 className="heading-hero">
                {/* Mobile: Split into two lines */}
                <span className="block md:hidden">Hi, I&lsquo;m</span>
                <span className="relative block md:hidden">
                  <span className="gradient-text">
                    {typeEffect}
                    <Cursor cursorColor="#4f46e5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-indigo to-accent-emerald rounded-2xl blur-2xl opacity-20 -z-10"></div>
                </span>

                {/* Desktop: Keep on one line */}
                <span className="hidden md:inline">Hi, I&lsquo;m </span>
                <span className="relative hidden md:inline">
                  <span className="gradient-text">
                    {typeEffect}
                    <Cursor cursorColor="#4f46e5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-indigo to-accent-emerald rounded-2xl blur-2xl opacity-20 -z-10"></div>
                </span>
              </h1>
              <h2 className="heading-2 text-text-primary">Next.js Developer</h2>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              className="flex items-center justify-center space-x-2 sm:space-x-4"
              animate={{ scaleX: 1, opacity: 1 }}
              initial={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-transparent to-secondary-indigo"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-secondary-indigo to-transparent"></div>
            </motion.div>

            {/* Description */}
            <motion.p
              className="max-w-2xl px-4 mx-auto body-hero"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
            >
              I build modern web applications with Next.js and React.
              Specializing in creating seamless user experiences with clean
              code, responsive design, and cutting-edge web technologies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col items-center justify-center gap-4 px-4 sm:gap-6 sm:flex-row"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 30, opacity: 0 }}
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
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 1.2 }}
            >
              <SocialLinks />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="py-4"
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 1.4 }}
            >
              <Link
                href="#about"
                className="inline-flex flex-col items-center group"
              >
                <span className="mb-2 label-medium text-text-muted">
                  Scroll to explore
                </span>
                <div className="flex items-center justify-center w-10 h-10 transition-all duration-300 border-2 border-gray-300 rounded-full sm:w-12 sm:h-12 group-hover:border-secondary-indigo group-hover:shadow-glow">
                  <HiArrowDown className="text-lg transition-all duration-300 sm:text-xl text-text-muted group-hover:text-secondary-indigo animate-bounce" />
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
