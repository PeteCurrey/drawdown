"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

interface NewsItem {
  source: string;
  title: string;
  publishedAt: string;
  url: string;
  categories: string[];
  instruments?: string[];
  imageUrl?: string;
}

// Category-based fallback gradient backgrounds
function getSourceGradient(source: string): string {
  const gradients: Record<string, string> = {
    "Bloomberg": "linear-gradient(135deg, #1a0066 0%, #2800D8 100%)",
    "Reuters": "linear-gradient(135deg, #663300 0%, #FF8000 100%)",
    "Financial Times": "linear-gradient(135deg, #4a1a00 0%, #c2693a 100%)",
    "FT": "linear-gradient(135deg, #4a1a00 0%, #c2693a 100%)",
    "BBC Business": "linear-gradient(135deg, #4a0a0a 0%, #BB1919 100%)",
    "BBC": "linear-gradient(135deg, #4a0a0a 0%, #BB1919 100%)",
    "CNBC Markets": "linear-gradient(135deg, #001a33 0%, #005596 100%)",
    "CNBC": "linear-gradient(135deg, #001a33 0%, #005596 100%)",
    "WSJ Markets": "linear-gradient(135deg, #0d0d0d 0%, #333333 100%)",
    "WSJ": "linear-gradient(135deg, #0d0d0d 0%, #333333 100%)",
    "MarketWatch": "linear-gradient(135deg, #1a0f0a 0%, #3B2E2A 100%)",
    "Yahoo Finance": "linear-gradient(135deg, #1a0033 0%, #720099 100%)",
    "ForexLive": "linear-gradient(135deg, #002233 0%, #007a99 100%)",
    "Sky News Business": "linear-gradient(135deg, #330000 0%, #CC0000 100%)",
  };
  return gradients[source] || "linear-gradient(135deg, #0a0b0e 0%, #1a1f2e 100%)";
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const hasImage = !!item.imageUrl && !imgError;

  return (
    <a
      ref={cardRef}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group border border-border-slate hover:border-accent/50 transition-premium flex flex-col justify-between relative overflow-hidden min-h-[320px]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {/* Source-specific gradient always present as base */}
        <div
          className="absolute inset-0"
          style={{ background: getSourceGradient(item.source) }}
        />
        {/* News article image on top if available */}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              imgLoaded ? "opacity-30 group-hover:opacity-40" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            aria-hidden="true"
          />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8">
        {/* Header: Logo + Time */}
        <div className="flex items-center justify-between mb-6">
          <NewsSourceLogo
            source={item.source}
            size="md"
            monochrome={false}
            showText={true}
          />
          <span className="text-[9px] font-mono text-white/60 bg-black/30 px-2 py-0.5">
            {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Spacer to push title down */}
        <div className="flex-grow" />

        {/* Title */}
        <div>
          <h3 className="text-lg font-display font-bold uppercase leading-tight mb-4 text-white group-hover:text-accent transition-colors line-clamp-3">
            {item.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {item.categories?.slice(0, 2).map((cat) => (
              <span key={cat} className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-white/10 border border-white/10 text-white/60 backdrop-blur-sm">
                {cat}
              </span>
            ))}
            {item.instruments?.slice(0, 2).map((inst) => (
              <span key={inst} className="text-[8px] font-mono font-bold text-accent">
                ${inst}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <ArrowUpRight className="w-4 h-4 text-accent" />
      </div>
    </a>
  );
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    source: "Bloomberg",
    title: "Global Equity Markets Stabilize as Inflation Fears Recede",
    publishedAt: new Date().toISOString(),
    url: "#",
    categories: ["Equities", "Macro"],
    instruments: ["SPX", "NDX"]
  },
  {
    source: "Reuters",
    title: "Central Bank Sentiment Index Shows Shift in Global Outlook",
    publishedAt: new Date().toISOString(),
    url: "#",
    categories: ["Global", "Macro"],
    instruments: ["DXY", "XAUUSD"]
  },
  {
    source: "Financial Times",
    title: "Eurozone GDP Growth Exceeds Analyst Expectations in Q1",
    publishedAt: new Date().toISOString(),
    url: "#",
    categories: ["Europe", "Economy"],
    instruments: ["EURUSD", "DAX"]
  },
  {
    source: "CNBC",
    title: "Tech Giants Rally on Strong AI Infrastructure Spending",
    publishedAt: new Date().toISOString(),
    url: "#",
    categories: ["Tech", "Nasdaq"],
    instruments: ["NVDA", "AAPL"]
  },
  {
    source: "WSJ",
    title: "Oil Prices Under Pressure Amid Rising Global Stocks",
    publishedAt: new Date().toISOString(),
    url: "#",
    categories: ["Commodities", "Energy"],
    instruments: ["OIL", "XTI"]
  },
  {
    source: "MarketWatch",
    title: "US Treasury Yields Flatten Ahead of Key Employment Data",
    publishedAt: new Date().toISOString(),
    url: "#",
    categories: ["Bonds", "US"],
    instruments: ["US10Y"]
  }
];

function PulseSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-background-elevated border border-border-slate animate-pulse min-h-[320px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="p-8 space-y-6 relative z-10">
            <div className="h-4 w-32 bg-white/10" />
            <div className="space-y-3">
              <div className="h-6 w-full bg-white/10" />
              <div className="h-6 w-3/4 bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MarketPulse() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchNews() {
      try {
        const res = await fetch("/api/news/feed", { signal: controller.signal });
        const data = await res.json();
        if (data && data.length > 0) {
          setNews(data.slice(0, 6));
        } else {
          setNews(FALLBACK_NEWS);
        }
        setLoading(false);
      } catch (err) {
        console.error("News fetch error, using fallbacks:", err);
        setNews(FALLBACK_NEWS);
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    }
    fetchNews();
    return () => controller.abort();
  }, []);

  // Intersection Observer for card entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background-primary relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold">
              // GLOBAL INTELLIGENCE
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-profit/10 border border-profit/20">
              <div className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-profit uppercase tracking-widest">LIVE PULSE</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-8xl font-display font-bold uppercase text-text-primary leading-tight">
            Institutional <br /><span className="text-accent underline decoration-accent/10">Pulse.</span>
          </h2>
        </div>

        {loading ? (
          <PulseSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <div
                key={i}
                className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <NewsCard item={item} index={i} />
              </div>
            ))}

            {/* CTA Card */}
            <Link
              href="/markets"
              className={`group border border-accent/20 hover:border-accent/40 transition-premium flex flex-col justify-center items-center text-center gap-4 min-h-[320px] relative overflow-hidden ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                background: "linear-gradient(135deg, #00C2FF08, #00C2FF15)",
                transitionDelay: `${news.length * 100}ms`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 space-y-6 p-10">
                <div className="w-20 h-20 bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Newspaper className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-3xl font-display font-bold uppercase group-hover:text-accent transition-colors leading-tight">
                  Enter The <br /> Hub
                </h3>
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed">
                  Consolidated technical analysis, news, and AI scanning.
                </p>
                <div className="flex items-center justify-center gap-2 text-accent font-bold uppercase text-[10px] tracking-widest mt-4">
                  Full View <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
