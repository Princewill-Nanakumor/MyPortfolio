"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(hash: string): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, "")).trim();
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/**
 * Scrolls to top on client-side route changes, unless the URL has a hash
 * (e.g. /#contact from /blog) — then scrolls to that section after render.
 */
export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    let cancelled = false;
    const tryScroll = () => {
      if (!cancelled) scrollToHash(hash);
    };

    // Homepage sections may mount after the route effect runs.
    requestAnimationFrame(tryScroll);
    const timers = [50, 200, 500].map((ms) => window.setTimeout(tryScroll, ms));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash) {
        scrollToHash(window.location.hash);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
