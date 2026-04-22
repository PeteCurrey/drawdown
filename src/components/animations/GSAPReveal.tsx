"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  stagger?: number;
}

export function GSAPReveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 1, 
  distance = 50,
  className,
  stagger = 0
}: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
    const y = direction === "up" ? distance : direction === "down" ? -distance : 0;

    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        x,
        y,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, stagger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
