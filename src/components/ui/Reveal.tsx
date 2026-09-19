/**
 * Reveal — fades + slides a single child into view on scroll intersection.
 * Respects prefers-reduced-motion (exits early, renders children statically).
 *
 * Props:
 *   delay    — delay in seconds before the animation begins (default 0)
 *   duration — animation duration in seconds (default 0.55)
 *   y        — initial vertical offset in px (default 24)
 *   once     — only animate once (default true)
 */
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
  duration = 0.55,
  y = 24,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // --ease-out (spring-like deceleration)
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
