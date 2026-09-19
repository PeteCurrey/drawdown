/**
 * BarFill — an animated progress bar that fills from 0% to `pct` on scroll entry.
 * Used for stat bars, consensus ratios, sentiment meters, etc.
 *
 * Props:
 *   pct      — target fill percentage 0–100
 *   color    — bar fill color (CSS value, default var(--accent))
 *   trackColor — background track color (default var(--border-subtle) at 40% opacity)
 *   height   — bar height in px (default 4)
 *   radius   — border-radius (CSS value, default var(--radius-pill))
 *   delay    — start delay in seconds (default 0)
 *   duration — animation duration in seconds (default 0.9)
 *   once     — only animate once (default true)
 *   className
 */
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BarFillProps {
  pct: number;
  color?: string;
  trackColor?: string;
  height?: number;
  radius?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function BarFill({
  pct,
  color = "var(--accent)",
  trackColor = "color-mix(in srgb, var(--border-subtle) 40%, transparent)",
  height = 4,
  radius = "var(--radius-pill)",
  delay = 0,
  duration = 0.9,
  once = true,
  className,
}: BarFillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });

  // Clamp to 0–100
  const target = Math.min(100, Math.max(0, pct));

  return (
    <div
      ref={ref}
      className={`w-full overflow-hidden ${className ?? ""}`}
      style={{ height, backgroundColor: trackColor, borderRadius: radius }}
    >
      <motion.div
        initial={{ width: "0%" }}
        animate={isInView ? { width: `${target}%` } : { width: "0%" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          height: "100%",
          backgroundColor: color,
          borderRadius: radius,
        }}
      />
    </div>
  );
}
