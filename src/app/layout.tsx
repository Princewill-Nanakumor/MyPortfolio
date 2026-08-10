import React from "react";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import DesignThemeProvider from "@/context/DesignThemeContext";
import CustomCursorGate from "@/components/common/CustomCursorGate";
import ScrollToTop from "@/components/common/ScrollToTop";
import ScrollToTopOnRouteChange from "@/components/common/ScrollToTopOnRouteChange";
import Footer from "@/components/common/Footer";
import { ReactNode } from "react";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  personJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Next.js Web Developer`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Portfolio of Nanakumor Princewill — Next.js developer building modern web apps, SaaS products, cloud engineering tools, and backend systems with React, TypeScript, and MongoDB.",
  keywords: [
    "Nanakumor Princewill",
    "Nanakumor Prince",
    "Prince Nanakumor",
    "Princewill Nanakumor",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Full Stack Developer",
    "Cloud Engineering",
    "Web Development",
    "Portfolio",
  ].join(", "),
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(`${SITE_URL}/`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Next.js Web Developer`,
    description:
      "Portfolio of Nanakumor Princewill — Next.js developer building modern web apps, SaaS products, and cloud engineering tools.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Next.js Web Developer`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Next.js Developer`,
    description:
      "Portfolio of Nanakumor Princewill — Next.js developer building modern web apps, SaaS products, and cloud engineering tools.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      "google-site-verification=PkMRZNBrIxjh7weOqOBJb9mTtrqlvjKssfVEFfsSws0",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

/** Runs before first paint so saved theme/layout apply without a flash. */
const themeInitScript = `(function(){try{var d=localStorage.getItem("blogDesign");var l=localStorage.getItem("blogLayout");var r=document.documentElement;var D={minimalist:1,darkMode:1,playful:1,editorial:1,bold:1};var L={default:1,wide:1,narrow:1,magazine:1};if(d&&D[d])r.setAttribute("data-design",d);if(l&&L[l])r.setAttribute("data-layout",l);}catch(e){}})();`;

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html
      lang="en"
      className="!scroll-smooth"
      data-scroll-behavior="smooth"
      data-design="minimalist"
      data-layout="default"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd()),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ToastProvider>
          <DesignThemeProvider>
            <CustomCursorGate />
            <ScrollToTopOnRouteChange />
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
            <SpeedInsights />
          </DesignThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
