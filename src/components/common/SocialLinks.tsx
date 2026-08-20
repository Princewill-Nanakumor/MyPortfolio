"use client";
import React from "react";
import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

interface SocialLinksProps {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  showEmail?: boolean;
  showSkills?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  className = "",
  iconSize = "md",
  showEmail = true,
  showSkills = true,
}) => {
  const getIconSize = () => {
    switch (iconSize) {
      case "sm":
        return "w-10 h-10 text-base";
      case "lg":
        return "w-16 h-16 text-2xl";
      default:
        return "w-12 h-12 text-lg sm:w-14 sm:h-14 sm:text-xl";
    }
  };

  const iconSizeClass = getIconSize();

  const links = [
    {
      href: "https://www.linkedin.com/in/princewill-nanakumor-0a68b824a/",
      label: "LinkedIn",
      external: true,
      icon: <FaLinkedinIn />,
      className:
        "bg-secondary-indigo hover:shadow-glow hover:scale-110 hover:-translate-y-1",
    },
    {
      href: "https://github.com/Princewill-Nanakumor",
      label: "GitHub",
      external: true,
      icon: <FaGithub />,
      className:
        "bg-gray-900 hover:bg-gray-800 hover:shadow-medium hover:scale-110 hover:-translate-y-1",
    },
    ...(showSkills
      ? [
          {
            href: "#skills",
            label: "Tech Stack",
            external: false,
            icon: <BsFillPersonLinesFill />,
            className:
              "bg-accent-emerald hover:shadow-glow-emerald hover:scale-110 hover:-translate-y-1",
          },
        ]
      : []),
    ...(showEmail
      ? [
          {
            href: "#contact",
            label: "Contact",
            external: false,
            icon: <AiOutlineMail />,
            className:
              "bg-secondary-indigo hover:shadow-large hover:scale-110 hover:-translate-y-1",
          },
        ]
      : []),
  ];

  return (
    <div
      className={`flex items-center justify-center gap-4 sm:gap-6 ${className}`}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          aria-label={link.label}
          className="relative group"
        >
          <div
            className={`flex items-center justify-center text-white transition-all duration-300 ease-out shadow-soft rounded-2xl ${iconSizeClass} ${link.className}`}
          >
            {link.icon}
          </div>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-soft transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 translate-y-1"
          >
            {link.label}
            <span
              className="absolute left-1/2 bottom-full -mb-px -translate-x-1/2 border-4 border-transparent border-b-gray-900"
              aria-hidden
            />
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;
