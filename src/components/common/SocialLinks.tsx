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

  return (
    <div
      className={`flex items-center justify-center gap-4 sm:gap-6 ${className}`}
    >
      <Link
        href="https://www.linkedin.com/in/princewill-nanakumor-0a68b824a/"
        target="_blank"
        rel="noreferrer"
        className="group"
      >
        <div
          className={`flex items-center justify-center text-white transition-all duration-300 ease-out shadow-soft bg-secondary-indigo rounded-2xl hover:shadow-glow hover:scale-110 hover:-translate-y-1 ${iconSizeClass}`}
        >
          <FaLinkedinIn />
        </div>
      </Link>

      <Link
        href="https://github.com/Princewill-Nanakumor"
        target="_blank"
        rel="noreferrer"
        className="group"
      >
        <div
          className={`flex items-center justify-center text-white transition-all duration-300 ease-out shadow-soft bg-primary-slate rounded-2xl hover:shadow-medium hover:scale-110 hover:-translate-y-1 ${iconSizeClass}`}
        >
          <FaGithub />
        </div>
      </Link>

      {showSkills && (
        <Link href="#skills" className="group">
          <div
            className={`flex items-center justify-center text-white transition-all duration-300 ease-out shadow-soft bg-accent-emerald rounded-2xl hover:shadow-glow-emerald hover:scale-110 hover:-translate-y-1 ${iconSizeClass}`}
          >
            <BsFillPersonLinesFill />
          </div>
        </Link>
      )}

      {showEmail && (
        <Link href="#contact" className="group">
          <div
            className={`flex items-center justify-center text-white transition-all duration-300 ease-out shadow-soft bg-gradient-to-r from-secondary-indigo to-accent-emerald rounded-2xl hover:shadow-large hover:scale-110 hover:-translate-y-1 ${iconSizeClass}`}
          >
            <AiOutlineMail />
          </div>
        </Link>
      )}
    </div>
  );
};

export default SocialLinks;
