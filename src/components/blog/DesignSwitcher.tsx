"use client";
import { designStyles, layoutOptions } from "./DesignConfig";

interface DesignSwitcherProps {
  currentDesign: string;
  setCurrentDesign: (design: string) => void;
  currentLayout: string;
  setCurrentLayout: (layout: string) => void;
}

const DesignSwitcher = ({
  currentDesign,
  setCurrentDesign,
  currentLayout,
  setCurrentLayout,
}: DesignSwitcherProps) => {
  return (
    <div className="fixed z-50 flex-wrap hidden gap-2 p-3 border border-gray-200 rounded-full shadow-lg md:flex bottom-4 right-4 bg-white/80 backdrop-blur-md">
      {/* Design Theme Buttons */}
      <div className="flex gap-2">
        {Object.entries(designStyles).map(([key, style]) => (
          <button
            key={key}
            onClick={() => setCurrentDesign(key)}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white sm:w-12 sm:h-12 ${
              currentDesign === key
                ? "bg-blue-600 text-white shadow-lg scale-110"
                : "bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
            aria-label={`Switch to ${style.name}`}
            title={style.name}
          >
            <div className="w-4 h-4 sm:w-6 sm:h-6">{style.icon()}</div>
          </button>
        ))}
      </div>

      {/* Layout Selector */}
      <div className="relative">
        <select
          value={currentLayout}
          onChange={(e) => setCurrentLayout(e.target.value)}
          className="w-32 px-3 py-2 pr-8 text-xs font-medium text-gray-700 bg-gray-100 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-40 sm:text-sm"
        >
          {Object.entries(layoutOptions).map(([key, layout]) => (
            <option key={key} value={key}>
              {layout.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DesignSwitcher;
