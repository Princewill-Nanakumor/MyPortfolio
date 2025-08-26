"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiCheckCircle, HiArrowLeft, HiHome } from "react-icons/hi";

const SuccessPage = (): JSX.Element => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-accent">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-64 h-64 rounded-full top-20 left-20 bg-secondary-indigo/10 blur-3xl animate-pulse"></div>
        <div
          className="absolute rounded-full w-80 h-80 bottom-20 right-20 bg-accent-emerald/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <motion.div
            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              bounce: 0.4,
            }}
          >
            <HiCheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Message Sent!
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Thank you for reaching out! I&#39;ve received your message and will
            get back to you as soon as possible.
          </motion.p>

          {/* Additional Info */}
          <motion.div
            className="p-4 mb-8 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm text-text-secondary">
              <strong>What happens next?</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-text-secondary">
              <li>• I&#39;ll review your message within 24 hours</li>
              <li>• You&#39;ll receive a response via email</li>
              <li>• We can schedule a call to discuss your project</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/"
              className="flex items-center justify-center px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-secondary-indigo hover:bg-blue-700 hover:shadow-lg hover:scale-105"
            >
              <HiHome className="w-5 h-5 mr-2" />
              Back to Home
            </Link>

            <Link
              href="/#contact"
              className="flex items-center justify-center px-6 py-3 font-medium transition-all duration-300 border-2 rounded-lg text-secondary-indigo border-secondary-indigo hover:bg-secondary-indigo hover:text-white hover:shadow-lg hover:scale-105"
            >
              <HiArrowLeft className="w-5 h-5 mr-2" />
              Send Another Message
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="pt-8 mt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="mb-4 text-sm text-text-secondary">
              Connect with me on social media:
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="https://github.com/Princewill-Nanakumor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 rounded-lg bg-primary-slate hover:bg-gray-800 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>

              <Link
                href="https://www.linkedin.com/in/princewill-nanakumor-0a68b824a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 rounded-lg bg-secondary-indigo hover:bg-blue-700 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
