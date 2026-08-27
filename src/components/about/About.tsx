"use client";
// src/components/about/About.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ImageItem {
  src: string;
  alt: string;
}

const HIGHLIGHTS = [
  {
    title: "Scalable",
    subtitle: "Built for Growth",
    description: "Designed for growing data, users, and workloads.",
    iconBg: "bg-secondary-indigo/10",
    iconColor: "text-secondary-indigo",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
  },
  {
    title: "Production Ready",
    subtitle: "Built to Last",
    description: "Auth, validation, monitoring, and solid error handling.",
    iconBg: "bg-accent-emerald/10",
    iconColor: "text-accent-emerald",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    title: "Real-Time",
    subtitle: "Always in Sync",
    description:
      "Real-time updates that keep users, interfaces, and data synchronized.",
    iconBg: "bg-secondary-indigo/10",
    iconColor: "text-secondary-indigo",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
  },
  {
    title: "Tested",
    subtitle: "Confidence in Every Release",
    description:
      "Unit, API, component, and E2E tests — plus load testing when it matters.",
    iconBg: "bg-accent-emerald/10",
    iconColor: "text-accent-emerald",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    ),
  },
] as const;

const PROOF_METRICS = [
  "200+ source files",
  "15,000+ lines of TypeScript",
  "237+ automated tests",
  "100k+ records load-tested",
] as const;

const About: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add your images here
  const images: ImageItem[] = [
    {
      src: "/myPhoto.jpg",
      alt: "Princewill - Full-Stack Software Engineer",
    },
    {
      src: "/image2.jpg", // Add your second image
      alt: "Working on projects",
    },
    {
      src: "/image3.jpeg", // Add your third image
      alt: "Team collaboration",
    },
    // Add more images as needed
  ];

  // Function to start the auto-advance timer
  const startTimer = useCallback((): void => {
    // Clear any existing timers first
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
  }, [images.length]);

  // Function to stop the auto-advance timer
  const stopTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  // Function to pause timer and resume after 8 seconds
  const pauseAndResume = useCallback((): void => {
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Set a new pause timer
    pauseTimerRef.current = setTimeout(() => {
      startTimer();
    }, 8000); // Resume after 8 seconds
  }, [startTimer]);

  // Auto-advance slider
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [startTimer]);

  const nextImage = (): void => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    pauseAndResume();
  };

  const prevImage = (): void => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    pauseAndResume();
  };

  const goToImage = (index: number): void => {
    setCurrentImageIndex(index);
    pauseAndResume();
  };

  return (
    <section
      id="about"
      className="min-h-[80vh] flex items-center bg-bg-secondary scroll-mt-20"
    >
      <div className="px-6 mx-auto w-full max-w-6xl sm:px-8 lg:px-12">
        <div className="py-12 sm:py-16">
          {/* Section Header */}
          <motion.div
            className="mb-8 text-center sm:mb-12"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 heading-2 text-text-primary">About Me</h2>
            <div className="flex justify-center items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40"></div>
              <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
              <div className="w-8 h-px sm:w-16 bg-secondary-indigo/40"></div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-8 items-center lg:gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              className="order-2 space-y-6 lg:order-1"
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="mb-4 heading-3 text-text-primary">
                  Engineering Modern SaaS{" "}
                  <span className="text-secondary-indigo">
                    & Web Applications
                  </span>
                </h3>

                <div className="space-y-4 body-medium">
                  <p>
                    I&apos;m a Full-Stack Software Engineer building scalable,
                    production-ready applications — from intuitive interfaces
                    and secure APIs to databases, authentication, multi-tenant
                    architecture, real-time systems, background jobs, and
                    automated testing.
                  </p>

                  <p>
                    My work covers RBAC, resilient data-import pipelines,
                    performance optimization, and production-focused
                    architecture. I focus on building software that is secure,
                    maintainable, and reliable under real-world usage — whether
                    shipping a SaaS platform from scratch or improving an
                    existing product.
                  </p>

                  <p className="text-sm text-text-muted">
                    I use AI tools to speed up research and iteration, while
                    keeping architecture, quality, and security decisions in
                    human hands.
                  </p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                {HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl border shadow-soft surface-card"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${item.iconBg}`}
                      >
                        <svg
                          className={`w-4 h-4 ${item.iconColor}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {item.icon}
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary">
                          {item.title}
                        </h4>
                        <p className="text-xs font-medium text-secondary-indigo">
                          {item.subtitle}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="pt-4 text-xs leading-relaxed text-center text-text-muted sm:text-sm sm:text-left">
                {PROOF_METRICS.join(" · ")}
              </p>
            </motion.div>

            {/* Image Slider Section */}
            <motion.div
              className="relative order-1 lg:order-2"
              initial={{ x: 50 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Image Slider Container */}
                <div
                  className="overflow-hidden relative rounded-3xl shadow-large"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-full min-w-full flex-shrink-0 basis-full aspect-[4/5]"
                      >
                        <Image
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          quality={80}
                          className="object-cover object-center"
                          alt={image.alt}
                          src={image.src}
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className={`absolute z-10 flex items-center justify-center w-10 h-10 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-white/80 hover:bg-white hover:scale-110 ${
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }`}
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className={`absolute z-10 flex items-center justify-center w-10 h-10 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-white/80 hover:bg-white hover:scale-110 ${
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    }`}
                  >
                    <ChevronRight />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => goToImage(index)}
                      aria-label={`Go to image ${index + 1}`}
                      aria-current={
                        index === currentImageIndex ? "true" : undefined
                      }
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? "bg-secondary-indigo w-8"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full blur-xl sm:w-16 sm:h-16 sm:-top-4 sm:-right-4 bg-secondary-indigo/10 animate-float"></div>
                <div
                  className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full blur-xl sm:w-12 sm:h-12 sm:-bottom-4 sm:-left-4 bg-accent-emerald/10 animate-float"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-2 -left-2 p-2 rounded-xl border sm:p-3 sm:-bottom-4 sm:-left-4 shadow-large surface-card">
                <div className="text-center">
                  <div className="text-lg font-bold sm:text-xl text-secondary-indigo">
                    3+
                  </div>
                  <div className="text-xs font-medium text-text-secondary">
                    Years Experience
                  </div>
                </div>
              </div>

              {/* Full-Stack Badge */}
              <div className="absolute -top-2 -right-2 p-2 rounded-xl border sm:p-3 sm:-top-4 sm:-right-4 shadow-large surface-card">
                <div className="text-center">
                  <div className="text-xs font-bold text-secondary-indigo">
                    FULL-STACK
                  </div>
                  <div className="text-xs font-medium text-text-secondary">
                    Engineer
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
