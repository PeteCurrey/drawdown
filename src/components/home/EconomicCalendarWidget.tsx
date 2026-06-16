"use client";

import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export function EconomicCalendarWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up container before inserting script to avoid duplicate renders
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      isTransparent: false,
      locale: "en",
      countryFilter: "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
      importanceFilter: "-1,0,1",
      width: 400,
      height: 550
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    
    const copyrightDiv = document.createElement("div");
    copyrightDiv.className = "tradingview-widget-copyright";
    
    const copyrightLink = document.createElement("a");
    copyrightLink.href = "https://www.tradingview.com/economic-calendar/";
    copyrightLink.rel = "noopener nofollow";
    copyrightLink.target = "_blank";
    
    const spanBlue = document.createElement("span");
    spanBlue.className = "blue-text text-accent hover:underline";
    spanBlue.textContent = "Economic Calendar";
    
    const spanTrademark = document.createElement("span");
    spanTrademark.className = "trademark text-text-tertiary text-xs";
    spanTrademark.textContent = " by TradingView";
    
    copyrightLink.appendChild(spanBlue);
    copyrightDiv.appendChild(copyrightLink);
    copyrightDiv.appendChild(spanTrademark);

    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(copyrightDiv);
    containerRef.current.appendChild(script);
  }, []);

  return (
    <section className="py-12 md:py-20 bg-background-primary relative overflow-hidden text-text-primary">
      {/* Decorative Grid overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(0,194,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(0,194,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
            // ECONOMIC INTELLIGENCE
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase text-text-primary">
            Economic Calendar
          </h2>
        </div>

        {/* Calendar Card Frame */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[480px] bg-background-surface/40 border border-border-slate/50 p-4 sm:p-6 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="overflow-x-auto w-full flex justify-center">
              <div ref={containerRef} className="tradingview-widget-container min-w-[400px] flex flex-col items-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
