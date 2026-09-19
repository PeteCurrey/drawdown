/**
 * RevealGroup — wraps multiple children with staggered Reveal animations.
 * Each direct child receives an incrementing delay.
 *
 * Props:
 *   stagger   — seconds between each child's animation start (default 0.08)
 *   baseDelay — initial delay before the first child animates (default 0)
 *   y         — initial vertical offset in px (default 20)
 *   duration  — animation duration per child (default 0.5)
 *   once      — only animate once (default true)
 */
"use client";

import React from "react";
import { Reveal } from "./Reveal";

interface RevealGroupProps {
  children: React.ReactNode;
  stagger?: number;
  baseDelay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function RevealGroup({
  children,
  stagger = 0.08,
  baseDelay = 0,
  y = 20,
  duration = 0.5,
  once = true,
  className,
}: RevealGroupProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal
          key={i}
          delay={baseDelay + i * stagger}
          duration={duration}
          y={y}
          once={once}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}
