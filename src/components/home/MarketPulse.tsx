"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { ArrowUpRight, Newspaper, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  source: string;
  title: string;
  publishedAt: string;
  url: string;
  categories: string[];
  excerpt: string;
  imageUrl?: string;
}

interface MoverItem {
  symbol: string;
  price?: number;
  changePercent?: number;
}

const TARGET_SOURCES = ["Sky News", "CNN", "Fox News", "BBC"];
const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
const TOP_MOVER_SYMBOLS = ["EURUSD", "GBPUSD", "BTCUSD"];

function isTargetSource(source: string): boolean {
  const s = source.toLowerCase();
  return TARGET_SOURCES.some(target => s.includes(target.toLowerCase()));
}

function formatPubDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${Math.max(1, diffMins)} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return "Live";
  }
}

function getSourceBrandColor(source: string): string {
  const colors: Record<string, string> = {
    "BBC Business": "#BB1919",
    "BBC": "#BB1919",
    "Yahoo Finance": "#720099",
    "ForexLive": "#007a99",
    "Sky News Business": "#CC0000",
    "Sky News": "#CC0000",
    "Investing.com": "#006400",
    "CNN Business": "#CC0000",
    "CNN": "#CC0000",
    "Fox Business": "#003380",
    "Fox News": "#003380",
    "Bloomberg": "#000000",
    "Reuters": "#FF8000",
  };
  return colors[source] || "var(--signal-navy)";
}

export function MarketPulse() {
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [topMovers, setTopMovers] = useState<MoverItem[]>(
    TOP_MOVER_SYMBOLS.map(sym => ({ symbol: sym }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Fetch news feed and target Sky News, CNN, Fox News, BBC preferentially
  useEffect(() => {
    let active = true;
    async function loadNews() {
      try {
        const res = await fetch("/api/news/feed");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        if (Array.isArray(data) && active) {
          const filtered = data.filter(item => isTargetSource(item.source));
          setNews(filtered.length > 0 ? filtered : data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load news feed", err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    }

    async function loadMovers() {
      try {
        const res = await fetch(`/api/market/prices?symbols=${TOP_MOVER_SYMBOLS.join(",")}`);
        if (res.ok) {
          const prices = await res.json();
          if (Array.isArray(prices) && active) {
            setTopMovers(prices);
          }
        }
      } catch (err) {
        console.error("Failed to load movers", err);
      }
    }

    loadNews();
    loadMovers();

    const moversInterval = setInterval(loadMovers, 30000);
    return () => {
      active = false;
      clearInterval(moversInterval);
    };
  }, []);

  // Rotate items list slowly every 10 seconds to keep news alive
  useEffect(() => {
    if (news.length <= 4) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [news.length]);

  const activeItems = useMemo(() => {
    if (news.length === 0) return [];
    const items: NewsItem[] = [];
    for (let i = 0; i < Math.min(news.length, 4); i++) {
      items.push(news[(startIndex + i) % news.length]);
    }
    return items;
  }, [news, startIndex]);

  // Embed TradingView calendar widget
  useEffect(() => {
    if (!calendarContainerRef.current) return;
    calendarContainerRef.current.innerHTML = "";

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

    calendarContainerRef.current.appendChild(widgetDiv);
    calendarContainerRef.current.appendChild(script);
  }, []);

  const featuredNews = activeItems[0];
  const listNews = activeItems.slice(1);

  return (
    <section 
      className="py-24 border-b select-none relative overflow-hidden"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span 
            className="text-[11px] font-sans font-bold uppercase tracking-widest block mb-4"
            style={{ color: "var(--graphite-600)" }}
          >
            // LIVE MARKET BRIEFING
          </span>
          <h2 
            className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight mb-4"
            style={{ color: "var(--ink-950)" }}
          >
            Market Pulse & Intelligence
          </h2>
          <p 
            className="text-base max-w-xl mx-auto font-sans"
            style={{ color: "var(--graphite-600)" }}
          >
            Real-time sentiment monitoring, macro calendars, and raw professional data feeds.
          </p>
          <p 
            className="text-xs max-w-2xl mx-auto font-sans mt-4 leading-relaxed border-t pt-4"
            style={{ color: "var(--graphite-500)", borderColor: "var(--line-100)" }}
          >
            This panel aggregates global news coverages from Sky News, CNN, Fox News, and BBC, alongside the real-time Economic Calendar and top currency movers. By matching political headlines and central bank speeches with price charts, traders can pinpoint high-impact volatility windows and sentiment shifts.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (News feed: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="bg-neutral-100 border h-[380px] flex flex-col justify-end p-6" style={{ borderColor: "var(--line-200)" }}>
                  <div className="space-y-4 w-full">
                    <div className="h-4 w-24 bg-neutral-200" />
                    <div className="h-8 w-3/4 bg-neutral-200" />
                    <div className="h-4 w-5/6 bg-neutral-200" />
                  </div>
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="bg-neutral-100 border h-[110px] p-5 flex flex-col justify-end" style={{ borderColor: "var(--line-200)" }}>
                    <div className="space-y-2 w-full">
                      <div className="h-3.5 w-32 bg-neutral-200" />
                      <div className="h-5 w-5/6 bg-neutral-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error || news.length === 0 ? (
              <div 
                className="p-12 border text-center text-xs"
                style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--graphite-600)" }}
              >
                No live world news from Sky News, CNN, Fox News, or BBC available right now. Reconnecting to global feeds...
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Large Featured News Card (Full background image) */}
                {featuredNews && (
                  <div 
                    className="relative overflow-hidden border group h-[380px] flex flex-col justify-end bg-black transition-all duration-300"
                    style={{ 
                      borderColor: "var(--line-200)",
                      borderRadius: 0,
                    }}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${featuredNews.imageUrl || fallbackImage})` }}
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-0" />
                    
                    {/* Breaking Pill and News Icon */}
                    <div className="flex justify-between items-center z-10 p-6 absolute top-0 left-0 right-0">
                      <span className="text-[10px] font-bold text-white bg-mkt-red px-2.5 py-1 uppercase tracking-wider font-sans">
                        BREAKING
                      </span>
                      <Newspaper className="w-5 h-5 text-white/70" />
                    </div>
                    
                    {/* Bottom overlay text contents */}
                    <div className="z-10 p-6 space-y-3">
                      <div>
                        <p className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest">
                          {formatPubDate(featuredNews.publishedAt)} &bull; {featuredNews.source}
                        </p>
                        <h3 className="text-xl md:text-2xl font-sans font-extrabold text-white mt-1.5 leading-tight tracking-tight">
                          {featuredNews.title}
                        </h3>
                      </div>
                      <p className="text-xs md:text-sm text-neutral-250 leading-relaxed font-sans line-clamp-2">
                        {featuredNews.excerpt}
                      </p>
                      
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-widest">
                          {featuredNews.categories?.[0] || "MARKET INTELLIGENCE"}
                        </span>
                        <a 
                          href={featuredNews.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs font-bold text-white hover:underline transition-colors flex items-center gap-1"
                        >
                          Read coverage <ArrowUpRight className="w-3.5 h-3.5 text-mkt-grn" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. List of Small news cards with full-bleed background images */}
                <div className="space-y-4">
                  {listNews.map((item, idx) => {
                    return (
                      <a 
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block overflow-hidden border min-h-[110px] h-[110px] bg-black group transition-all duration-300"
                        style={{ 
                          borderColor: "var(--line-200)",
                          borderRadius: 0,
                        }}
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${item.imageUrl || fallbackImage})` }}
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30 z-0" />
                        
                        {/* Content overlay */}
                        <div className="relative z-10 p-5 flex flex-col justify-end h-full pr-12">
                          <div className="space-y-1">
                            <p className="text-[9px] font-mono text-neutral-300 uppercase tracking-widest">
                              {formatPubDate(item.publishedAt)} &bull; {item.source}
                            </p>
                            <h4 className="text-sm md:text-base font-sans font-bold text-white group-hover:text-mkt-grn transition-colors duration-150 leading-tight line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-neutral-250 leading-normal font-sans line-clamp-1">
                              {item.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Hover arrow indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-20">
                          <ArrowUpRight className="w-4 h-4 text-mkt-grn" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar widgets: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Economic Calendar */}
            <div 
              className="border p-5 flex flex-col justify-between"
              style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--line-200)" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
                  <span className="text-[12px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--ink-950)" }}>
                    Economic Calendar
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
                  TODAY
                </span>
              </div>

              <div className="w-full h-[410px] overflow-hidden" ref={calendarContainerRef}>
                <div className="tradingview-widget-container__widget w-full h-full" />
              </div>
            </div>

            {/* 2. Top Movers */}
            <div 
              className="border p-5 flex flex-col justify-between"
              style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--line-200)" }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
                  <span className="text-[12px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--ink-950)" }}>
                    Top Movers
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
                  24H RANGE
                </span>
              </div>

              <div className="space-y-3">
                {topMovers.map((mvr, idx) => {
                  const hasData = mvr.price !== undefined;
                  const isPositive = mvr.changePercent !== undefined && mvr.changePercent >= 0;
                  
                  let displayPrice = "--";
                  if (hasData) {
                    if (mvr.symbol.includes("BTC")) {
                      displayPrice = mvr.price!.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    } else {
                      displayPrice = mvr.price!.toFixed(4);
                    }
                  }

                  let displayChange = "";
                  if (hasData && mvr.changePercent !== undefined) {
                    displayChange = `${isPositive ? "▲" : "▼"} ${Math.abs(mvr.changePercent).toFixed(2)}%`;
                  }

                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between py-2.5 border-b last:border-b-0 last:pb-0"
                      style={{ borderColor: "var(--line-100)" }}
                    >
                      <span className="text-xs font-mono font-bold" style={{ color: "var(--ink-950)" }}>{mvr.symbol}</span>
                      <span className="text-xs font-mono" style={{ color: "var(--graphite-600)" }}>{displayPrice}</span>
                      {hasData && (
                        <span className={cn(
                          "text-xs font-mono font-bold",
                          isPositive ? "text-mkt-grn" : "text-mkt-red"
                        )}>
                          {displayChange}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
