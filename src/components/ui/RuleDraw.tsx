/**
 * RuleDraw — a horizontal rule that draws in (width: 0 → full) on scroll entry.
 * Used as a decorative section divider or accent underline.
 *
 * Props:
 *   color    — line color (CSS value, default var(--border-subtle))
 *   height   — line height in px (default 1)
 *   delay    — start delay in seconds (default 0)
 *   duration — animation duration in seconds (default 0.7)
 *   once     — only animate once (default true)
 *   className
 */
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RuleDrawProps {
  color?: string;
  height?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function RuleDraw({
  color = "var(--border-subtle)",
  height = 1,
  delay = 0,
  duration = 0.7,
  once = true,
  className,
}: RuleDrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px 0px" });

  return (
    <div ref={ref} className={`w-full overflow-hidden ${className ?? ""}`} style={{ height }}>
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: color,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
