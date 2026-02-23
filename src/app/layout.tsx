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
  title: "Princewill Nanakumor | Nextjs Web Developer",
  description:
    "Building sleek, responsive, and high-performance web applications with React, Next.js, Tailwind CSS and TypeScript ",
  keywords: [
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
  authors: [{ name: "Princewill" }],
  creator: "Princewill ",
  publisher: "Princewill",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://princewillnanakumor.com/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Princewill Nanakumor | Nextjs Web Developer",
    description:
      "Building sleek, responsive, and high-performance web applications with React, Next.js, Tailwind CSS and TypeScript",
    url: "http://princewillnanakumor.com/",
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
    title: "Princewill | Web Developer",
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

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="//favicon.ico" />

        {/* Structured Data for better search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Princewill",
              jobTitle: "Frontend Developer",
              description:
                "Crafting modern web experiences with clean code and innovative design",
              url: "http://princewillnanakumor.com/",
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
