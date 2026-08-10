/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme tokens (RGB CSS vars — follow DesignThemeProvider)
        "primary-slate": "rgb(var(--primary-slate) / <alpha-value>)",
        "secondary-indigo": "rgb(var(--secondary-indigo) / <alpha-value>)",
        "accent-emerald": "rgb(var(--accent-emerald) / <alpha-value>)",

        // Neutral System (static)
        "gray-50": "#f8fafc",
        "gray-100": "#f1f5f9",
        "gray-200": "#e2e8f0",
        "gray-300": "#cbd5e1",
        "gray-400": "#94a3b8",
        "gray-500": "#64748b",
        "gray-600": "#475569",
        "gray-700": "#334155",
        "gray-800": "#1e293b",
        "gray-900": "#0f172a",

        // Semantic Colors (themeable)
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
        "bg-primary": "rgb(var(--bg-primary) / <alpha-value>)",
        "bg-secondary": "rgb(var(--bg-secondary) / <alpha-value>)",
        "bg-accent": "rgb(var(--bg-accent) / <alpha-value>)",

        // Gradient Colors
        "gradient-from": "rgb(var(--gradient-from) / <alpha-value>)",
        "gradient-to": "rgb(var(--gradient-to) / <alpha-value>)",
      },
      fontFamily: {
        // Primary: Inter - Modern, clean, highly readable
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Secondary: Poppins - Modern geometric font (Google Fonts)
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        // Mono: JetBrains Mono - Developer-focused, clean code font
        mono: ["var(--font-jetbrains)", "Consolas", "monospace"],
      },
      fontSize: {
        // Refined Typography Scale
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.015em" }],
        base: ["1rem", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.7", letterSpacing: "0.005em" }],
        xl: ["1.25rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "2xl": ["1.5rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "1.4", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "7xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.035em" }],
      },
      spacing: {
        // Enhanced Spacing System
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      boxShadow: {
        // Modern Shadow System
        soft: "0 2px 8px -2px rgba(15, 23, 42, 0.08)",
        medium: "0 8px 24px -4px rgba(15, 23, 42, 0.12)",
        large: "0 16px 40px -8px rgba(15, 23, 42, 0.16)",
        glow: "0 0 24px rgba(79, 70, 229, 0.2)",
        "glow-emerald": "0 0 24px rgba(16, 185, 129, 0.2)",
      },
      animation: {
        // Smooth Animations
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in-down": "fadeInDown 0.8s ease-out",
        "slide-in-left": "slideInLeft 0.8s ease-out",
        "slide-in-right": "slideInRight 0.8s ease-out",
        "scale-in": "scaleIn 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        "nav-progress": "navProgress 1.1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        navProgress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
