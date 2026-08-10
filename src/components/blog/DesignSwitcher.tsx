"use client";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const showLayoutSwitcher = pathname !== "/";

  return (
    <div
      className="fixed z-[90] flex items-center gap-1 p-1.5 border shadow-lg bottom-4 right-4 rounded-full bg-bg-primary/95 border-[rgb(var(--card-border))] backdrop-blur-md sm:gap-2 sm:p-3 safe-bottom"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {/* Theme buttons — compact on mobile */}
      <div className="flex items-center gap-1 sm:gap-2">
        {Object.entries(designStyles).map(([key, style]) => (
          <button
            key={key}
            type="button"
            onClick={() => setCurrentDesign(key)}
            className={`flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent w-8 h-8 sm:w-12 sm:h-12 ${
              currentDesign === key
                ? "bg-blue-600 text-white shadow-md scale-105 sm:scale-110"
                : "bg-bg-accent text-text-primary active:bg-secondary-indigo/20"
            }`}
            aria-label={`Switch to ${style.name}`}
            title={style.name}
          >
            <div className="w-3.5 h-3.5 sm:w-6 sm:h-6 [&>svg]:w-full [&>svg]:h-full">
              {style.icon()}
            </div>
          </button>
        ))}
      </div>

      {/* Layout width — hide on homepage (sections don't use content-shell) */}
      {showLayoutSwitcher && (
        <div className="relative hidden sm:block">
          <label htmlFor="layout-switcher" className="sr-only">
            Content width layout
          </label>
          <select
            id="layout-switcher"
            value={currentLayout}
            onChange={(e) => setCurrentLayout(e.target.value)}
            className="w-36 px-3 py-2 pr-8 text-sm font-medium appearance-none rounded-full cursor-pointer bg-bg-accent text-text-primary border border-[rgb(var(--card-border))] focus:outline-none focus:ring-2 focus:ring-secondary-indigo"
          >
            {Object.entries(layoutOptions).map(([key, layout]) => (
              <option key={key} value={key} className="bg-white text-gray-900">
                {layout.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-text-primary">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
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
      )}
    </div>
  );
};

export default DesignSwitcher;
