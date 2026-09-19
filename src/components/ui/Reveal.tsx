"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.4,
  y = 12,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    // If reduced motion is requested or browser lacks IntersectionObserver, stay immediately visible
    if (shouldReduceMotion || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // Safety fallback: any element not revealed within 1500ms of mount is forced visible
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // If already in or above viewport on mount, reveal immediately without arming hidden state
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setIsVisible(true);
      clearTimeout(safetyTimer);
      return;
    }

    // Element is genuinely below the fold: arm JS hidden state for animation
    setIsArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin: "50px", threshold: 0.05 }
    );

    observer.observe(el);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [once, shouldReduceMotion]);

  // Hidden state is applied ONLY by client-side JS after mount (isArmed === true).
  // Default CSS / SSR has no inline styles or hidden classes, guaranteeing 100% visibility if JS fails or is disabled.
  const style = isArmed
    ? {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : `translateY(${y}px)`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }
    : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
