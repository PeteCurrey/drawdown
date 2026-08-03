"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/news";
import { ArrowRight, Clock, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PulseHeroProps {
  story: NewsItem | null;
  loading: boolean;
}

export function PulseHero({ story, loading }: PulseHeroProps) {
  const [snapshots, setSnapshots] = useState<Record<string, any>>({});

  useEffect(() => {
    let active = true;

    async function loadSnapshots() {
      try {
        const res = await fetch("/api/market/polygon-snapshot?symbols=GBPUSD,XAUUSD,BTCUSD,SPX,EURUSD");
        if (!active) return;
        if (res.ok) {
          const json = await res.json();
          if (json.snapshots) setSnapshots(json.snapshots);
        }
      } catch (e) {
        console.error("PulseHero snapshot error:", e);
      }
    }

    loadSnapshots();
    const interval = setInterval(loadSnapshots, 30000); // 30s high frequency polling

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] md:aspect-[24/7] bg-white animate-pulse border border-mkt-bd" />
    );
  }

  if (!story) return null;

  const tickerList = [
    { key: "GBPUSD", label: "GBP/USD" },
    { key: "XAUUSD", label: "XAU/USD" },
    { key: "BTCUSD", label: "BTC/USD" },
    { key: "SPX", label: "S&P 500" },
    { key: "EURUSD", label: "EUR/USD" },
  ];

  return (
    <div className="space-y-4">
      {/* Real-time 5-Instrument Price Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border border-mkt-bd p-2 bg-[#F9F9F9]">
        {tickerList.map(({ key, label }) => {
          const snap = snapshots[key];
          const isPos = snap ? snap.changePercent >= 0 : true;

          return (
            <div key={key} className="bg-white border border-mkt-bd/50 px-3 py-1.5 flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-mkt-ink">{label}</span>
              {snap ? (
                <div className="text-right">
                  <span className="font-bold text-mkt-ink block">{snap.price}</span>
                  <span className={cn("text-[9px] font-semibold flex items-center gap-0.5 justify-end", isPos ? "text-mkt-grn" : "text-mkt-red")}>
                    {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {isPos ? "+" : ""}{snap.changePercent}%
                  </span>
                </div>
              ) : (
                <span className="text-mkt-i4">...</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative w-full aspect-[21/9] md:aspect-[24/7] border border-mkt-bd bg-white group overflow-hidden">
        {/* Background Image with Reveal */}
        <div className="absolute inset-0 z-0">
          {story.imageUrl ? (
            <Image 
              src={story.imageUrl} 
              alt={story.title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 opacity-20 group-hover:opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 to-transparent opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background-surface via-background-surface/80 to-transparent z-10" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-20 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-bold uppercase tracking-widest">
              {story.source}
            </span>
            <span className="flex items-center gap-1.5 text-mkt-i4 text-[10px] font-mono uppercase tracking-widest">
              <Clock className="w-3 h-3" /> {story.publishedAt}
            </span>
            <span className="flex items-center gap-1.5 text-mkt-grn text-[10px] font-mono uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3 h-3" /> Polygon.io & FRED Sync
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black uppercase tracking-tight leading-[0.9] group-hover:text-accent transition-colors duration-500">
            {story.title}
          </h1>

          <p className="text-sm md:text-base text-mkt-i2 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none opacity-80">
            {story.excerpt}
          </p>

          <a 
            href={story.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest group/btn"
          >
            <span className="border-b border-accent py-1">Read Full Intelligence Report</span>
            <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover/btn:translate-x-2" />
          </a>
        </div>

        {/* Aesthetic Border Highlights */}
        <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-accent/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-accent/50 to-transparent" />
      </div>
    </div>
  );
}
