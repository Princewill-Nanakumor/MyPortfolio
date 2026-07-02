import React from "react";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import CustomCursor from "@/components/common/CustomCursor";
import { ReactNode } from "react";

// Primary Font: Inter - Modern, clean, highly readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Secondary Font: Poppins - Modern geometric font (Google Fonts alternative to Satoshi)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Mono Font: JetBrains Mono - Clean developer font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Nanakumor Princewill | Next.js Web Developer",
    template: "%s | Nanakumor Princewill",
  },
  description:
    "Building sleek, responsive, and high-performance web applications with React, Next.js, Tailwind CSS and TypeScript ",
  keywords: [
    "Nanakumor Princewill",
    "Nanakumor Prince",
    "Prince Nanakumor",
    "Princewill Nanakumor",
    "nanakumor princewill",
    "nanakumor prince",
    "prince nanakumor",
    "princewill nanakumor",
    "Nanakumor Princewill Wosowei",
    "Nanakumor Princewill",
    "nanakumor princewill",
    "Princewill Nanakumor",
    "princewill nanakumor",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Web Developer",
    "JavaScript Developer",
    "Full Stack Developer",
    "React.js",
    "Next.js",
    "Tailwind css",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Frontend Development",
    "Modern Web Applications",
    "Responsive Design",
    "Clean Code",
    "Portfolio",
    "Developer Portfolio",
  ].join(", "),
  authors: [{ name: "Nanakumor Princewill" }],
  creator: "Nanakumor Princewill",
  publisher: "Nanakumor Princewill",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://princewillnanakumor.com/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nanakumor Princewill | Next.js Web Developer",
    description:
      "Building sleek, responsive, and high-performance web applications with React, Next.js, Tailwind CSS and TypeScript",
    url: "https://princewillnanakumor.com/",
    siteName: "Princewill Portfolio",
    images: [
      {
        url: "https://princewillnanakumor.com/myPhoto.jpg",
        width: 1200,
        height: 630,
        alt: "Princewill - Web Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanakumor Princewill | Next.js Developer",
    description:
      "Building sleek, responsive, and high-performance web applications with React, Next.js, Tailwind CSS and TypeScript",
    images: ["/myPhoto.jpg"],
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
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
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
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />

        {/* Structured Data for better search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Nanakumor Princewill",
              alternateName: [
                "Nanakumor Prince",
                "Prince Nanakumor",
                "Princewill Nanakumor",
              ],
              jobTitle: "Frontend Developer",
              description:
                "Crafting modern web experiences with clean code and innovative design",
              url: "https://princewillnanakumor.com/",
              sameAs: [
                "https://github.com/Princewill-Nanakumor",
                "https://linkedin.com/in/princewill-nanakumor-0a68b824a/",
                // "https://twitter.com/your-twitter",
              ],
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Web Development",
                "Frontend Development",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
            }),
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
