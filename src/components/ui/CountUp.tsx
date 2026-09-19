/**
 * CountUp — animates a number from 0 to `value` when scrolled into view.
 * Renders the raw formatted value immediately for users with reduced motion
 * or when JS hasn't hydrated yet.
 *
 * Props:
 *   value     — target number to count up to
 *   decimals  — decimal places (default 0)
 *   prefix    — string prepended to the number (e.g. "$")
 *   suffix    — string appended to the number (e.g. "%", "K")
 *   duration  — animation duration in seconds (default 1.5)
 *   delay     — start delay in seconds (default 0)
 *   once      — only animate once (default true)
 *   className — applied to the wrapping span
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.5,
  delay = 0,
  once = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  // Prefer reduced motion — just show the final value
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) {
      setDisplay(value.toFixed(decimals));
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(latest.toFixed(decimals));
      },
    });

    return controls.stop;
  }, [isInView, value, decimals, duration, delay, motionValue, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
