"use client";

import { useEffect, useState } from "react";
import { Radio, ArrowRight, TrendingUp, Globe2, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dummy logos for visual aesthetic
const dataPartners = [
  "REUTERS", "BLOOMBERG", "FINANCIAL TIMES", "CNBC", "TWELVEDATA", "FINNHUB"
];

// Fallback technical images for news cards if none provided
const fallbackImages = [
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
  "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800",
  "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=800"
];

export function MarketPulse() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState(74); // institutional score

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-profit transition-all">
               <div className="w-8 h-[1px] bg-profit" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">Live_Intelligence_Feed</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight">
              Market <span className="text-accent underline decoration-accent/20">Pulse.</span>
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
            {/* Sentiment Gauge Widget */}
            <div className="flex items-center gap-6 p-6 bg-background-surface border border-border-slate shadow-xl">
               <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * sentiment) / 100} className="text-profit" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">
                     {sentiment}%
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Sentiment Index</p>
                  <h4 className="text-sm font-bold uppercase text-profit">Extreme Greed</h4>
               </div>
            </div>

            <div className="space-y-4 max-w-sm">
              <p className="text-sm text-text-secondary leading-relaxed uppercase tracking-wide font-mono opacity-80">
                Institutional headlines and real-time news aggregation for Drawdown traders.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono text-text-tertiary uppercase tracking-widest bg-background-elevated px-4 py-2 border border-border-slate">
                 <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-profit" /> VIX: 18.2</span>
                 <span className="w-px h-3 bg-border-slate" />
                 <span className="flex items-center gap-1"><Globe2 className="w-3 h-3 text-accent" /> Macro: High</span>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px bg-border-slate border border-border-slate overflow-hidden shadow-2xl shadow-accent/5">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] bg-background-surface animate-pulse" />
            ))
          ) : (
            <>
              {news.map((item, i) => (
                <a 
                  key={i} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative bg-background-surface flex flex-col justify-end h-[450px] transition-all duration-700 overflow-hidden"
                >
                  <div 
                     className="absolute inset-0 z-0 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 scale-110 group-hover:scale-100 bg-cover bg-center"
                     style={{ backgroundImage: `url(${item.imageUrl || fallbackImages[i % fallbackImages.length]})` }}
                  />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-elevated via-background-primary/95 to-transparent" />
                  
                  <div className="relative z-20 p-8 flex flex-col h-full justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span className="text-[8px] font-mono text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 border border-accent/20">
                            {item.source}
                          </span>
                       </div>
                       <h3 className="text-sm md:text-md font-bold uppercase leading-tight text-text-primary group-hover:text-accent transition-colors line-clamp-5">
                         {item.title}
                       </h3>
                     </div>
                     
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                       <p className="text-[10px] text-text-tertiary leading-relaxed line-clamp-3 mb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         {item.excerpt}
                       </p>
                       <div className="flex items-center gap-3 text-text-primary group-hover:text-accent transition-all text-[10px] font-bold uppercase tracking-[0.2em]">
                          Analyze Intel <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                       </div>
                     </div>
                  </div>
                </a>
              ))}
              
              <Link 
                href="/markets"
                className="lg:col-span-1 bg-accent flex flex-col items-center justify-center text-center group relative overflow-hidden h-[450px]"
              >
                <div className="absolute inset-0 bg-background-elevated z-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                <div className="relative z-10 text-background-primary group-hover:text-accent space-y-8 transition-colors duration-700">
                  <div className="w-20 h-20 rounded-full border border-current flex items-center justify-center mx-auto mb-4 group-hover:rotate-45 transition-transform duration-700">
                    <Activity className="w-10 h-10" />
                  </div>
                  <div>
                     <h4 className="text-3xl font-display font-black uppercase leading-none mb-3">Intelligence Hub</h4>
                     <p className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-80 max-w-[150px] mx-auto border-t border-current pt-4">
                       Full Scanner & Data Suite
                     </p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Data Partners Branding Section */}
        <div className="mt-20 pt-12 border-t border-border-slate">
           <div className="flex flex-col space-y-12">
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-text-tertiary shrink-0">Institutional_Partnerships</span>
                 <div className="h-px w-full bg-border-slate" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                 {dataPartners.map((partner, idx) => (
                    <div key={idx} className="flex justify-center group">
                       <span className="text-sm md:text-lg font-display font-black tracking-[0.3em] uppercase text-text-secondary group-hover:text-text-primary transition-colors cursor-default">
                          {partner}
                       </span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
