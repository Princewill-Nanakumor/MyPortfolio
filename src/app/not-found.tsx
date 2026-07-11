"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft } from "react-icons/hi";

const NotFoundPage = (): React.JSX.Element => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-accent">
      {/* Atmospheric background — matches hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full top-10 -left-20 sm:top-20 sm:-left-40 sm:w-80 sm:h-80 bg-secondary-indigo/10 blur-3xl animate-float" />
        <div
          className="absolute w-48 h-48 rounded-full bottom-10 -right-20 sm:bottom-20 sm:-right-40 sm:w-96 sm:h-96 bg-accent-emerald/10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[560px] lg:h-[560px] bg-gradient-to-r from-secondary-indigo/5 to-accent-emerald/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 mx-auto text-center sm:px-8">
        <motion.p
          className="mb-6 text-sm font-semibold tracking-wide uppercase sm:text-base text-secondary-indigo"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          Princewill Nanakumor
        </motion.p>

        <motion.div
          className="relative mb-4"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
        >
          <h1 className="font-display text-[clamp(6.5rem,24vw,13rem)] font-bold leading-none tracking-tight select-none">
            <span className="gradient-text">404</span>
          </h1>
          <div className="absolute inset-0 -translate-y-4 bg-gradient-to-r from-secondary-indigo to-accent-emerald rounded-full blur-3xl opacity-25 -z-10" />
        </motion.div>

        <motion.div
          className="flex items-center justify-center mb-6 space-x-2 sm:mb-8 sm:space-x-4"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-transparent to-secondary-indigo" />
          <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo" />
          <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-secondary-indigo to-transparent" />
        </motion.div>

        <motion.h2
          className="mb-4 heading-2 text-text-primary"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
        >
          Page not found
        </motion.h2>

        <motion.p
          className="max-w-xl mx-auto mb-10 body-hero"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        >
          This route doesn&apos;t exist — or it may have moved. Head home, or
          explore the blog and projects instead.
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 mb-8 sm:flex-row"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
        >
          <Link href="/" className="w-full btn-primary sm:w-auto">
            <span className="inline-flex items-center gap-2">
              <HiHome className="w-5 h-5" />
              Back to Home
            </span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full btn-secondary sm:w-auto"
          >
            <span className="inline-flex items-center gap-2">
              <HiArrowLeft className="w-5 h-5" />
              Go Back
            </span>
          </button>
        </motion.div>

        <motion.nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-secondary"
          aria-label="Helpful links"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.75 }}
        >
          <Link
            href="/blog"
            className="transition-colors hover:text-secondary-indigo"
          >
            Blog
          </Link>
          <span className="text-gray-300" aria-hidden>
            ·
          </span>
          <Link
            href="/projects"
            className="transition-colors hover:text-secondary-indigo"
          >
            Projects
          </Link>
          <span className="text-gray-300" aria-hidden>
            ·
          </span>
          <Link
            href="/#contact"
            className="transition-colors hover:text-secondary-indigo"
          >
            Contact
          </Link>
        </motion.nav>
      </div>
    </div>
  );
};

export default NotFoundPage;
