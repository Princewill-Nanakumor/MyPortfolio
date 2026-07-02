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
        // Modern Color Palette
        "primary-slate": "#0f172a", // Deep slate for primary text
        "secondary-indigo": "#4f46e5", // Vibrant indigo for accents
        "accent-emerald": "#10b981", // Fresh emerald for highlights

        // Neutral System
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

        // Semantic Colors
        "text-primary": "#0f172a",
        "text-secondary": "#475569",
        "text-muted": "#64748b",
        "bg-primary": "#ffffff",
        "bg-secondary": "#f8fafc",
        "bg-accent": "#f1f5f9",

        // Gradient Colors
        "gradient-from": "#4f46e5",
        "gradient-to": "#10b981",
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
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
