"use client";
import React from "react";
import { HiArrowDown } from "react-icons/hi";
import Link from "next/link";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import SocialLinks from "@/components/common/SocialLinks";

const TYPEWRITER_WORDS = ["Princewill", "React", "TypeScript"] as const;
const LONGEST_WORD = TYPEWRITER_WORDS.reduce((longest, word) =>
  word.length > longest.length ? word : longest
);

/** Keeps typewriter width stable so shorter words don't collapse the hero layout. */
function TypewriterSlot({ text }: { text: string }) {
  return (
    <span className="relative inline-grid justify-items-start text-left align-baseline">
      <span
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
        aria-hidden="true"
      >
        {LONGEST_WORD}
        <span className="inline-block w-[0.55ch]">|</span>
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap text-secondary-indigo">
        {text}
        <Cursor cursorColor="#4f46e5" />
      </span>
    </span>
  );
}

const Hero: React.FC = () => {
  const [typeEffect] = useTypewriter({
    words: [...TYPEWRITER_WORDS],
    loop: true,
    typeSpeed: 100,
    deleteSpeed: 150,
  });

  return (
    <section
      id="hero"
      className="flex overflow-hidden relative justify-center items-center pt-16 min-h-screen bg-bg-primary sm:pt-20"
    >
      <div className="relative z-10 px-6 mx-auto w-full max-w-6xl sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] text-center">
          <div className="mx-auto space-y-6 max-w-4xl sm:space-y-8">
            <div className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-full border border-gray-200 backdrop-blur-sm sm:px-6 sm:py-3 sm:text-sm text-secondary-indigo bg-white/80 shadow-soft">
              Welcome to my portfolio
            </div>

            <div className="space-y-2">
              <h1 className="heading-hero">
                <span className="sr-only">
                  Nanakumor Princewill, Princewill Nanakumor, Prince Nanakumor —
                  Next.js Developer
                </span>

                <span className="block md:hidden" aria-hidden="true">
                  Hi, I&lsquo;m
                </span>
                <span
                  className="relative flex justify-center md:hidden"
                  aria-hidden="true"
                >
                  <TypewriterSlot text={typeEffect} />
                </span>

                <span className="hidden md:inline" aria-hidden="true">
                  Hi, I&lsquo;m{" "}
                </span>
                <span
                  className="hidden relative md:inline-block align-baseline"
                  aria-hidden="true"
                >
                  <TypewriterSlot text={typeEffect} />
                </span>
              </h1>
              <h2 className="heading-2 text-text-primary">Next.js Developer</h2>
            </div>

            <div className="flex justify-center items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40"></div>
            </div>

            <p className="px-4 mx-auto max-w-2xl body-hero">
              I build modern web applications with Next.js and React.
              Specializing in creating seamless user experiences with clean
              code, responsive design, and cutting-edge web technologies.
            </p>

            <div className="flex flex-col gap-4 justify-center items-center px-4 sm:gap-6 sm:flex-row">
              <Link href="#projects" className="w-full btn-primary sm:w-auto">
                View My Projects
              </Link>
              <Link href="#contact" className="w-full btn-secondary sm:w-auto">
                Let&lsquo;s Connect
              </Link>
            </div>

            <SocialLinks showEmail={false} />

            <div className="py-4">
              <Link
                href="#about"
                className="inline-flex flex-col items-center group"
              >
                <span className="mb-2 label-medium text-text-muted">
                  Scroll to explore
                </span>
                <div className="flex justify-center items-center w-10 h-10 rounded-full border-2 border-gray-300 transition-all duration-300 sm:w-12 sm:h-12 group-hover:border-secondary-indigo group-hover:shadow-glow">
                  <HiArrowDown className="text-lg transition-colors duration-300 sm:text-xl text-text-muted group-hover:text-secondary-indigo" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
