import {
  FaRegLightbulb,
  FaMoon,
  FaPaintBrush,
  FaNewspaper,
  FaBolt,
} from "react-icons/fa";
import { ReactElement } from "react";

export interface DesignStyle {
  name: string;
  icon: () => ReactElement;
  colors: {
    bg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentBg: string;
    border: string;
  };
  font: string;
  prose: string;
  layout: string;
}

export interface LayoutOption {
  name: string;
  proseClass: string;
  containerClass: string;
  contentLayout: string;
}

export const designStyles: Record<string, DesignStyle> = {
  minimalist: {
    name: "Minimalist & Clean",
    icon: () => <FaRegLightbulb className="w-full h-full" />,
    colors: {
      bg: "bg-white",
      textPrimary: "text-gray-800",
      textSecondary: "text-gray-500",
      accent: "text-blue-600",
      accentBg: "bg-blue-50",
      border: "border-gray-200",
    },
    font: "font-sans",
    prose:
      "prose-p:text-lg prose-p:leading-relaxed prose-h2:text-2xl prose-h2:font-bold prose-code:bg-gray-100 prose-ul:list-none prose-li:before:content-[''] prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-blue-600 prose-li:before:rounded-full prose-li:before:mr-2 prose-li:before:inline-block",
    layout: "space-y-12",
  },
  darkMode: {
    name: "Dark Mode",
    icon: () => <FaMoon className="w-full h-full" />,
    colors: {
      bg: "bg-[#1A1A1A]",
      textPrimary: "text-gray-100",
      textSecondary: "text-gray-400",
      accent: "text-violet-400",
      accentBg: "bg-violet-900/40",
      border: "border-gray-700",
    },
    font: "font-sans",
    prose:
      "prose-invert prose-p:text-lg prose-p:leading-relaxed prose-h2:text-2xl prose-h2:font-bold prose-code:bg-gray-800/80 prose-ul:list-none prose-li:before:content-[''] prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-violet-400 prose-li:before:rounded-full prose-li:before:mr-2 prose-li:before:inline-block",
    layout: "space-y-12",
  },
  playful: {
    name: "Playful & Colorful",
    icon: () => <FaPaintBrush className="w-full h-full" />,
    colors: {
      bg: "bg-pink-50",
      textPrimary: "text-gray-800",
      textSecondary: "text-gray-600",
      accent: "text-purple-600",
      accentBg: "bg-purple-200/50",
      border: "border-purple-300",
    },
    font: "font-inter",
    prose:
      "prose-p:text-lg prose-p:leading-relaxed prose-h2:text-3xl prose-h2:font-extrabold prose-code:bg-purple-100 prose-ul:space-y-3 prose-li:before:content-[''] prose-li:before:text-purple-600 prose-li:before:mr-2 prose-li:before:inline-block",
    layout: "space-y-10",
  },
  editorial: {
    name: "Editorial & Serif",
    icon: () => <FaNewspaper className="w-full h-full" />,
    colors: {
      bg: "bg-[#ecf2ef]",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      accent: "text-blue-600",
      accentBg: "bg-blue-50",
      border: "border-gray-300",
    },
    font: "font-serif",
    prose:
      "prose-lg prose-p:leading-relaxed prose-h2:text-3xl prose-h2:font-serif prose-h2:font-normal prose-code:bg-gray-200 prose-ul:list-disc prose-li:pl-1",
    layout: "space-y-16",
  },
  bold: {
    name: "Modern & Bold",
    icon: () => <FaBolt className="w-full h-full" />,
    colors: {
      bg: "bg-gray-950",
      textPrimary: "text-gray-50",
      textSecondary: "text-gray-300",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900/30",
      border: "border-gray-800",
    },
    font: "font-inter",
    prose:
      "prose-invert prose-p:text-lg prose-p:leading-relaxed prose-h2:text-4xl prose-h2:font-extrabold prose-h2:tracking-tight prose-code:bg-gray-800 prose-ul:list-none",
    layout: "space-y-14",
  },
};

export const layoutOptions: Record<string, LayoutOption> = {
  default: {
    name: "Default",
    proseClass: "",
    containerClass: "max-w-4xl",
    contentLayout: "space-y-6",
  },
  wide: {
    name: "Wide",
    proseClass: "",
    containerClass: "max-w-6xl",
    contentLayout: "space-y-8",
  },
  narrow: {
    name: "Narrow",
    proseClass: "",
    containerClass: "max-w-2xl",
    contentLayout: "space-y-5",
  },

  magazine: {
    name: "Magazine",
    proseClass: "columns-1 lg:columns-2 gap-8",
    containerClass: "max-w-7xl",
    contentLayout: "space-y-6",
  },
};
