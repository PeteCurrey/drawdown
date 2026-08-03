"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Newspaper, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";
import { cn } from "@/lib/utils";

interface NewsItem {
  source: string;
  title: string;
  publishedAt: string;
  url: string;
  categories: string[];
  instruments?: string[];
  imageUrl?: string;
}

function getSourceBrandColor(source: string): string {
  const colors: Record<string, string> = {
    "BBC Business": "#BB1919",
    "BBC": "#BB1919",
    "Yahoo Finance": "#720099",
    "ForexLive": "#007a99",
    "Sky News Business": "#CC0000",
    "Investing.com": "#006400",
    "CNN Business": "#CC0000",
    "Fox Business": "#003380",
    "Bloomberg": "#000000",
    "Reuters": "#FF8000",
  };
  return colors[source] || "var(--signal-navy)";
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const brandColor = getSourceBrandColor(item.source);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group border flex flex-col justify-between relative overflow-hidden min-h-[190px] p-6 transition-all duration-300"
      style={{
        backgroundColor: "var(--paper-0)",
        borderColor: isHovered ? brandColor : "var(--line-200)",
        borderRadius: 0,
        boxShadow: isHovered ? `0 0 20px ${brandColor}15, inset 0 0 10px ${brandColor}05` : "none",
      }}
    >
      {/* Background Article Image - Subtle full bleed luminosity layer */}
      {item.imageUrl && !imgError && (
        <img
          src={item.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none z-0"
          style={{
            opacity: isHovered ? 0.12 : 0.03,
            mixBlendMode: "luminosity",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          aria-hidden="true"
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        {/* Header: Logo + Time */}
        <div className="flex items-center justify-between mb-4">
          <NewsSourceLogo
            source={item.source}
            size="sm"
            monochrome={true}
            showText={true}
          />
          <span className="text-[9px] font-mono" style={{ color: "var(--graphite-600)" }}>
            {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 
            className="text-[14px] font-sans font-bold uppercase leading-tight line-clamp-2 transition-colors duration-300"
            style={{ color: isHovered ? brandColor : "var(--ink-950)" }}
          >
            {item.title}
          </h3>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {item.categories?.slice(0, 1).map((cat) => (
            <span 
              key={cat} 
              className="text-[8px] font-mono uppercase px-2 py-0.5 border"
              style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)", backgroundColor: "var(--paper-100)", borderRadius: 0 }}
            >
              {cat}
            </span>
          ))}
          {item.instruments?.slice(0, 2).map((inst) => (
            <span key={inst} className="text-[8px] font-mono font-bold" style={{ color: "var(--signal-navy)" }}>
              ${inst}
            </span>
          ))}
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <ArrowUpRight className="w-4 h-4" style={{ color: brandColor }} />
      </div>
    </a>
  );
}

function CalendarWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      isTransparent: true,
      locale: "en",
      countryFilter: "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
      importanceFilter: "-1,0,1",
      width: "100%",
      height: 480
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full h-full";

    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div 
      className="border p-5 flex flex-col justify-between h-full"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--line-200)" }}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
          <span className="text-[12px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--ink-950)" }}>
            Macro Economic Releases
          </span>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
          TradingView Feed
        </span>
      </div>

      <div className="w-full h-[410px] overflow-hidden" ref={containerRef}>
        <div className="tradingview-widget-container__widget w-full h-full" />
      </div>
    </div>
  );
}

function PulseSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 4, 5].map((i) => (
        <div 
          key={i} 
          className="animate-pulse min-h-[190px] border p-6 flex flex-col justify-between"
          style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}
        >
          <div className="h-4 w-24 bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-neutral-200" />
            <div className="h-4 w-3/4 bg-neutral-200" />
          </div>
          <div className="h-4 w-16 bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

export function MarketPulse() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    async function fetchNews() {
      try {
        const res = await fetch("/api/news/feed", { signal: controller.signal });
        const data = await res.json();
        if (data && data.length > 0) {
          setNews(data.slice(0, 4));
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("News fetch error:", err);
        setError(true);
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    }
    fetchNews();
    return () => controller.abort();
  }, []);

  return (
    <section 
      className="py-24 border-b select-none relative overflow-hidden"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="text-[11px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--graphite-600)" }}
            >
              Macro Pulse & Global Intelligence
            </span>
            <span 
              className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border"
              style={{
                color: "var(--mkt-grn)",
                borderColor: "var(--mkt-gbd)",
                backgroundColor: "var(--mkt-gbg)",
                borderRadius: 0
              }}
            >
              Live News & Events
            </span>
          </div>
          
          <h2 
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-4"
            style={{ color: "var(--ink-950)" }}
          >
            Market Pulse & Economic Calendar
          </h2>
          <p 
            className="text-[15px] leading-relaxed font-sans max-w-xl"
            style={{ color: "var(--graphite-600)" }}
          >
            Real-time macroeconomic intelligence pairing verified global news stories with central bank and economic indicators.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: News Grid (lg:col-span-7 or 8) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b mb-4" style={{ borderColor: "var(--line-200)" }}>
              <span className="text-[12px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--ink-950)" }}>
                Latest Financial Feeds
              </span>
              <span className="text-[10px] font-mono" style={{ color: "var(--graphite-600)" }}>
                Auto-updates every 10m
              </span>
            </div>

            {loading ? (
              <PulseSkeleton />
            ) : error || news.length === 0 ? (
              <div 
                className="p-8 border text-center text-xs"
                style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--graphite-600)" }}
              >
                Failed to load live news. Reconnecting to global feeds...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.map((item, i) => (
                  <NewsCard key={i} item={item} index={i} />
                ))}
              </div>
            )}

            {/* CTA to News Hub */}
            <div 
              className="border p-6 flex items-center justify-between transition-all duration-300"
              style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border flex items-center justify-center bg-white" style={{ borderColor: "var(--line-200)" }}>
                  <Newspaper className="w-5 h-5" style={{ color: "var(--signal-navy)" }} />
                </div>
                <div>
                  <h4 className="text-[12px] font-sans font-bold uppercase" style={{ color: "var(--ink-950)" }}>
                    Deep Technical Markets Hub
                  </h4>
                  <p className="text-[11px] font-sans" style={{ color: "var(--graphite-600)" }}>
                    Consolidated technical scans, news bias accumulation, and algorithmic feeds.
                  </p>
                </div>
              </div>
              <Link
                href="/markets"
                className="px-4 py-2 text-[10px] font-mono font-bold uppercase border bg-white hover:bg-neutral-50 transition-colors"
                style={{ borderColor: "var(--line-200)", color: "var(--ink-950)", borderRadius: 0 }}
              >
                Enter Hub
              </Link>
            </div>
          </div>

          {/* Right Column: Calendar Widget (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <CalendarWidget />
          </div>

        </div>

      </div>
    </section>
  );
}

