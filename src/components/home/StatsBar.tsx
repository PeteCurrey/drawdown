"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const counters = gsap.utils.toArray<HTMLElement>("[data-counter]");
      
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute("data-target") || "0");
        const suffix = counter.getAttribute("data-suffix") || "";
        
        // Setup initial state for animation
        counter.innerText = `0${suffix}`;
        
        // Animate counter from 0 to target
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            counter.innerText = `${Math.round(obj.val)}${suffix}`;
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-white z-20 select-none" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 py-8 border-y border-mkt-bd">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
          
          {/* 6 Phases */}
          <div className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
              data-counter
              data-target="13"
            >
              13
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              Phases
            </span>
          </div>

          {/* 60+ Modules */}
          <div className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
              data-counter
              data-target="117"
              data-suffix="+"
            >
              117+
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              Modules
            </span>
          </div>

          {/* 6 AI Tools */}
          <div className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
              data-counter
              data-target="6"
            >
              6
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              AI Tools
            </span>
          </div>

          {/* 24 Regulated Brokers */}
          <div className="flex flex-col items-center md:items-start">
            <span 
              className="text-[30px] text-mkt-ink font-sans tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
              data-counter
              data-target="24"
            >
              24
            </span>
            <span className="text-[11px] font-sans font-medium text-mkt-i4 uppercase mt-1 tracking-wider">
              Regulated Brokers
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

