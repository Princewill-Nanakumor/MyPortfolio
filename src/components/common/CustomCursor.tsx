"use client";

import React, { useState, useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor], [data-cursor="pointer"], [data-cursor="expand"]';

function isInteractiveElement(el: Element | null): boolean {
  if (!el || el === document.body) return false;
  // Check element and ancestors so hovering a child of a link still counts
  return (
    el.matches(INTERACTIVE_SELECTOR) ||
    el.closest(
      "a, button, [role='button'], input, textarea, select, [data-cursor]",
    ) !== null
  );
}

export default function CustomCursor(): React.JSX.Element | null {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const positionRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const lerp = (start: number, end: number, factor: number): number =>
    start + (end - start) * factor;

  useEffect(() => {
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const touchOnly = !hasHover && !hasFinePointer;
    if (touchOnly) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMove = (e: MouseEvent): void => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      const target = document.elementFromPoint(e.clientX, e.clientY);
      setIsHovering(isInteractiveElement(target));
    };

    const handleLeave = (): void => setIsVisible(false);
    const handleEnter = (): void => setIsVisible(true);

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.body.addEventListener("mouseleave", handleLeave);
    document.body.addEventListener("mouseenter", handleEnter);

    // Show cursor as soon as we know we're on a pointer device (so user sees it before first move)
    setIsVisible(true);

    const animateRing = (): void => {
      const pos = positionRef.current;
      const factor = 0.15;
      const nextX = lerp(ringRef.current.x, pos.x, factor);
      const nextY = lerp(ringRef.current.y, pos.y, factor);
      ringRef.current = { x: nextX, y: nextY };
      setRing({ x: nextX, y: nextY });
      rafRef.current = requestAnimationFrame(animateRing);
    };
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseleave", handleLeave);
      document.body.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    document.documentElement.classList.add("custom-cursor-active");
    return () =>
      document.documentElement.classList.remove("custom-cursor-active");
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  const showCustomCursor = isVisible && !isHovering;

  return (
    <div
      className="custom-cursor-wrapper"
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <div
        className="custom-cursor-dot"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: showCustomCursor ? 1 : 0,
        }}
      />
      <div
        className={`custom-cursor-ring ${isHovering ? "custom-cursor-ring--hover" : ""}`}
        style={{
          transform: `translate(${ring.x}px, ${ring.y}px)`,
          opacity: showCustomCursor ? 1 : 0,
        }}
      />
    </div>
  );
}
