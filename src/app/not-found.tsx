"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft } from "react-icons/hi";

const NotFoundPage = (): React.JSX.Element => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-bg-primary">
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
          <h1 className="font-display text-[clamp(6.5rem,24vw,13rem)] font-bold leading-none tracking-tight select-none text-secondary-indigo">
            404
          </h1>
        </motion.div>

        <motion.div
          className="flex items-center justify-center mb-6 space-x-2 sm:mb-8 sm:space-x-4"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40" />
          <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo" />
          <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40" />
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
