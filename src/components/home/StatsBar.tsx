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
      // Immediate check in case it's already in view on mount
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

export function StatsBar() {
  const { region } = useRegion();
  const phases = useCountUp(6);
  const modules = useCountUp(60);
  const tools = useCountUp(5);
  const brokers = useCountUp(3);

  const getBrokerLabel = (r: string) => {
    switch (r) {
      case "au": return "ASIC Brokers";
      case "us": return "NFA Brokers";
      case "sg": return "MAS Brokers";
      case "hk": return "SFC Brokers";
      case "ca": return "IIROC Brokers";
      case "de": return "BaFin Brokers";
      case "ae": return "DFSA Brokers";
      case "in": return "SEBI Brokers";
      case "my": return "SC Brokers";
      case "ph": return "SEC Brokers";
      default: return "FCA Brokers";
    }
  };

  return (
    <section className="w-full bg-white z-20 select-none">
      <div className="max-w-7xl mx-auto px-6 py-8 border-y border-mkt-bd">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
          
          {/* 6 Phases */}
          <div ref={phases.elementRef} className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
            >
              {phases.count}
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              Phases
            </span>
          </div>

          {/* 60+ Modules */}
          <div ref={modules.elementRef} className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
            >
              {modules.count}+
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              Modules
            </span>
          </div>

          {/* 5 AI Tools */}
          <div ref={tools.elementRef} className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
            >
              {tools.count}
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              AI Tools
            </span>
          </div>

          {/* 3 FCA Brokers */}
          <div ref={brokers.elementRef} className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
            >
              {brokers.count}
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              {getBrokerLabel(region)}
            </span>
          </div>

          {/* LIVE Market Data */}
          <div className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-grn font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
            >
              LIVE
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              Market Data
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

