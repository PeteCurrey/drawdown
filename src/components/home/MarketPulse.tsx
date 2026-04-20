"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Newspaper, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface NewsItem {
  source: string;
  title: string;
  publishedAt: string;
  url: string;
  categories: string[];
  instruments?: string[];
}

export function MarketPulse() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news/feed");
        const data = await res.json();
        setNews(data.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error("News fetch error:", err);
      }
    }
    fetchNews();
  }, []);

  return (
    <section className="py-24 bg-background-primary relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold">
              // MARKET PULSE
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-profit/10 border border-profit/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-profit uppercase tracking-widest">LIVE</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase">
            What the World <br /> Is Talking About.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <a 
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#111318] border border-border-slate p-8 hover:border-accent/50 transition-premium flex flex-col justify-between h-full relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-text-tertiary">
                    {item.source}
                  </span>
                  <span className="text-[9px] font-mono text-text-tertiary">
                    {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <h3 className="text-xl font-display font-bold uppercase leading-tight mb-6 group-hover:text-accent transition-colors line-clamp-3">
                  {item.title}
                </h3>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 items-center mt-auto">
                {item.categories?.slice(0, 2).map((cat) => (
                  <span key={cat} className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-background-elevated border border-border-slate text-text-tertiary">
                    {cat}
                  </span>
                ))}
                {item.instruments?.slice(0, 2).map((inst) => (
                  <span key={inst} className="text-[8px] font-mono font-bold text-accent">
                    ${inst}
                  </span>
                ))}
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-accent" />
              </div>
            </div>
          ))}

          {/* CTA Card */}
          <Link 
            href="/markets/pulse"
            className="group bg-accent/5 border border-accent/20 p-8 hover:bg-accent/10 transition-premium flex flex-col justify-center items-center text-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <Newspaper className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-display font-bold uppercase group-hover:text-accent transition-colors">
              Explore <br /> Market Pulse
            </h3>
            <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed">
              Live news, economic calendar, sentiment & AI analysis
            </p>
            <ArrowUpRight className="w-5 h-5 text-accent mt-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
