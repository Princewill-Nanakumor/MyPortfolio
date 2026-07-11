import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import CustomCursor from "@/components/common/CustomCursor";
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
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
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

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
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
          <CustomCursor />
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
