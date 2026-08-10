"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Single app-wide loading overlay for client navigations.
 * Starts on internal link click; clears after the route has settled.
 */
export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const pendingPathRef = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const samePath =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (samePath) return;

      pendingPathRef.current = url.pathname;
      setLoading(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!loading || !pendingPathRef.current) return;
    if (pathname !== pendingPathRef.current) return;

    // Route reached — let the new page paint, then hide.
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        if (!cancelled) {
          pendingPathRef.current = null;
          setLoading(false);
        }
      }, 120);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, loading]);

  useEffect(() => {
    if (!loading) return;
    const timeout = window.setTimeout(() => {
      pendingPathRef.current = null;
      setLoading(false);
    }, 10000);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-primary/80 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div
        className="absolute top-0 left-0 h-1 overflow-hidden w-full bg-secondary-indigo/15"
        aria-hidden
      >
        <div className="h-full w-1/3 rounded-full bg-secondary-indigo animate-nav-progress" />
      </div>

      <div className="flex flex-col items-center gap-3 px-6">
        <div
          className="w-10 h-10 border-2 rounded-full border-secondary-indigo/25 border-t-secondary-indigo animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium text-text-secondary">Loading…</p>
      </div>
    </div>
  );
}
