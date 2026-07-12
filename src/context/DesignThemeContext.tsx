"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  designStyles,
  layoutOptions,
  type DesignStyle,
  type LayoutOption,
} from "@/components/blog/DesignConfig";
import DesignSwitcher from "@/components/blog/DesignSwitcher";

export const DESIGN_STORAGE_KEY = "blogDesign";
export const LAYOUT_STORAGE_KEY = "blogLayout";

interface DesignThemeContextValue {
  currentDesign: string;
  currentLayout: string;
  setCurrentDesign: (design: string) => void;
  setCurrentLayout: (layout: string) => void;
  designStyle: DesignStyle;
  layoutStyle: LayoutOption;
}

const DesignThemeContext = createContext<DesignThemeContextValue | null>(null);

export function useDesignTheme(): DesignThemeContextValue {
  const ctx = useContext(DesignThemeContext);
  if (!ctx) {
    throw new Error("useDesignTheme must be used within DesignThemeProvider");
  }
  return ctx;
}

/** Safe hook when provider might be missing during SSR edge cases */
export function useDesignThemeOptional(): DesignThemeContextValue | null {
  return useContext(DesignThemeContext);
}

function readStoredDesign(): string {
  try {
    const saved = localStorage.getItem(DESIGN_STORAGE_KEY);
    if (saved && designStyles[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "minimalist";
}

function readStoredLayout(): string {
  try {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (saved && layoutOptions[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "default";
}

export default function DesignThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentDesign, setDesignState] = useState("minimalist");
  const [currentLayout, setLayoutState] = useState("default");
  const [ready, setReady] = useState(false);

  // Sync React state to the theme already applied by the blocking <head> script,
  // before the browser paints — avoids a flash of the SSR default theme.
  useLayoutEffect(() => {
    const design = readStoredDesign();
    const layout = readStoredLayout();
    setDesignState(design);
    setLayoutState(layout);
    document.documentElement.setAttribute("data-design", design);
    document.documentElement.setAttribute("data-layout", layout);
    setReady(true);
  }, []);

  const setCurrentDesign = useCallback((design: string) => {
    setDesignState(design);
    localStorage.setItem(DESIGN_STORAGE_KEY, design);
    document.documentElement.setAttribute("data-design", design);
  }, []);

  const setCurrentLayout = useCallback((layout: string) => {
    setLayoutState(layout);
    localStorage.setItem(LAYOUT_STORAGE_KEY, layout);
    document.documentElement.setAttribute("data-layout", layout);
  }, []);

  const designStyle = designStyles[currentDesign] ?? designStyles.minimalist;
  const layoutStyle = layoutOptions[currentLayout] ?? layoutOptions.default;

  const value = useMemo(
    () => ({
      currentDesign,
      currentLayout,
      setCurrentDesign,
      setCurrentLayout,
      designStyle,
      layoutStyle,
    }),
    [
      currentDesign,
      currentLayout,
      setCurrentDesign,
      setCurrentLayout,
      designStyle,
      layoutStyle,
    ]
  );

  return (
    <DesignThemeContext.Provider value={value}>
      {children}
      {ready && (
        <DesignSwitcher
          currentDesign={currentDesign}
          setCurrentDesign={setCurrentDesign}
          currentLayout={currentLayout}
          setCurrentLayout={setCurrentLayout}
        />
      )}
    </DesignThemeContext.Provider>
  );
}
