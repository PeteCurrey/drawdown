"use client";

import { useEffect, useRef, useState } from "react";
import { useRegion } from "@/components/layout/RegionalLayout";


function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (currentElement) {
      const rect = currentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        setHasStarted(true);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) observer.unobserve(currentElement);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return { count, elementRef };
}

export function StatsCounters() {
  const { region } = useRegion();
  const phases = useCountUp(6);
  const modules = useCountUp(60);
  const tools = useCountUp(5);

  const regionLabel = region === "uk" ? "UK" : region.toUpperCase();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-8 py-10 border-y border-[#E8E8E8]">
      <div ref={phases.elementRef} className="flex flex-col">
        <span className="text-4xl font-sans font-bold text-[#0A0A0A]">
          {phases.count}
        </span>
        <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-neutral-400 mt-1">
          Phases
        </span>
      </div>
      <div ref={modules.elementRef} className="flex flex-col">
        <span className="text-4xl font-sans font-bold text-[#0A0A0A]">
          {modules.count}+
        </span>
        <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-neutral-400 mt-1">
          Modules
        </span>
      </div>
      <div ref={tools.elementRef} className="flex flex-col">
        <span className="text-4xl font-sans font-bold text-[#0A0A0A]">
          {tools.count}
        </span>
        <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-neutral-400 mt-1">
          AI Tools
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-4xl font-sans font-bold text-emerald-600">
          LIVE
        </span>
        <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-neutral-400 mt-1">
          Market Data
        </span>
      </div>
      <div className="flex flex-col col-span-2 md:col-span-1 lg:col-span-2">
        <span className="text-4xl font-sans font-bold text-[#0A0A0A]">
          100%
        </span>
        <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-neutral-400 mt-1">
          {regionLabel} Focused
        </span>
      </div>
    </div>
  );
}

