"use client";

import { useEffect, useState } from "react";
import { Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function MarketPulse() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPulse() {
      try {
        const res = await fetch("/api/news/feed");
        const data = await res.json();
        setNews(data.slice(0, 5));
      } catch (err) {
        console.error("Pulse Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPulse();
    const interval = setInterval(fetchPulse, 180000); // 3 mins update
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="market-pulse" className="py-24 bg-background-primary border-y border-border-slate overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-profit animate-pulse">
              <Radio className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Live Feed Active</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tight">
              Market <span className="text-accent underline decoration-accent/20">Pulse.</span>
            </h2>
          </div>
          <p className="text-sm text-text-tertiary font-mono uppercase tracking-widest max-w-sm">
            Institutional headlines and real-time news aggregation for UK traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-0 shadow-2xl shadow-background-primary/50 border border-border-slate">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-background-surface border-r border-border-slate animate-pulse" />
            ))
          ) : (
            <>
              {news.map((item, i) => (
                <a 
                  key={i} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative p-8 bg-background-surface border-r border-border-slate flex flex-col justify-between h-[320px] transition-all duration-500 overflow-hidden",
                    "hover:bg-background-elevated lg:col-span-1"
                  )}
                >
                  <div className="z-10">
                    <span className="text-[8px] font-mono text-accent uppercase tracking-widest block mb-4">
                      {item.source} // {item.publishedAt.split(' ')[0]}
                    </span>
                    <h3 className="text-sm font-bold uppercase leading-tight group-hover:text-accent transition-colors line-clamp-4">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="z-10">
                    <p className="text-[10px] text-text-tertiary leading-relaxed line-clamp-2 mb-4 group-hover:text-text-secondary">
                      {item.excerpt}
                    </p>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-2 transition-all" />
                  </div>

                  {/* Aesthetic Background Grid Overlay */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff,transparent_1px)] [background-size:20px_20px]" />
                </a>
              ))}
              
              {/* Explore CTA Card */}
              <Link 
                href="/markets"
                className="lg:col-span-1 p-8 bg-accent flex flex-col items-center justify-center text-center group"
              >
                <div className="text-background-primary space-y-4">
                  <div className="w-12 h-12 rounded-full border border-background-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-display font-bold uppercase leading-none">Explore Hub</h4>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-70">
                    Full Scanner & News Dashboard
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
