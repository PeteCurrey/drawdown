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

const TARGET_SOURCES = ["Sky News", "CNN", "Fox Business", "Fox News", "BBC"];
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
  return colors[source] || "var(--accent)";
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
    const container = calendarContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full h-full";
    container.appendChild(widgetDiv);

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
      height: 450
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  const featuredNews = activeItems[0];
  const listNews = activeItems.slice(1);

  return (
    <section
      id="market-pulse"
      className="py-20 md:py-28 border-b relative select-none"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span 
            className="type-label uppercase block mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            MARKET BRIEFING
          </span>
          <h2 
            className="type-display-lg font-normal mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Market Pulse & Intelligence
          </h2>
          <p 
            className="type-body-lg font-normal max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Real-time sentiment monitoring, macro calendars, and raw professional data feeds.
          </p>
          <p 
            className="text-xs max-w-2xl mx-auto font-sans mt-4 leading-relaxed border-t pt-4"
            style={{ color: "var(--text-tertiary)", borderColor: "var(--border-subtle)" }}
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
                <div className="border h-[380px] flex flex-col justify-end p-6" style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div className="space-y-4 w-full">
                    <div className="h-4 w-24" style={{ backgroundColor: "var(--surface-overlay)", borderRadius: "var(--radius-sm)" }} />
                    <div className="h-8 w-3/4" style={{ backgroundColor: "var(--surface-overlay)", borderRadius: "var(--radius-sm)" }} />
                    <div className="h-4 w-5/6" style={{ backgroundColor: "var(--surface-overlay)", borderRadius: "var(--radius-sm)" }} />
                  </div>
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="border h-[110px] p-5 flex flex-col justify-end" style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                    <div className="space-y-2 w-full">
                      <div className="h-3.5 w-32" style={{ backgroundColor: "var(--surface-overlay)", borderRadius: "var(--radius-sm)" }} />
                      <div className="h-5 w-5/6" style={{ backgroundColor: "var(--surface-overlay)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : error || news.length === 0 ? (
              <div 
                className="p-12 border text-center text-xs"
                style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-secondary)", borderRadius: "var(--radius-md)" }}
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
                      borderColor: "var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
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
                      <span className="text-[10px] font-bold text-white px-2.5 py-1 uppercase tracking-wider font-sans" style={{ backgroundColor: "var(--market-down)" }}>
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
                          Read coverage <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "var(--market-up)" }} />
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
                          borderColor: "var(--border-subtle)",
                          borderRadius: "var(--radius-md)",
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
                            <h4 className="text-sm md:text-base font-sans font-bold text-white transition-colors duration-150 leading-tight line-clamp-1 group-hover:opacity-80">
                              {item.title}
                            </h4>
                            <p className="text-xs text-neutral-300 leading-normal font-sans line-clamp-1">
                              {item.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Hover arrow indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-20">
                          <ArrowUpRight className="w-4 h-4" style={{ color: "var(--market-up)" }} />
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
              style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span className="text-[12px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                    Economic Calendar
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  TODAY
                </span>
              </div>

              <div className="tradingview-widget-container w-full h-[450px] overflow-hidden" ref={calendarContainerRef}>
                <div className="tradingview-widget-container__widget w-full h-full" />
              </div>
            </div>

            {/* 2. Top Movers */}
            <div 
              className="border p-5 flex flex-col justify-between"
              style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span className="text-[12px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                    Top Movers
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
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
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <span className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>{mvr.symbol}</span>
                      <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{displayPrice}</span>
                      {hasData && (
                        <span 
                          className="text-xs font-mono font-bold"
                          style={{ color: isPositive ? "var(--market-up)" : "var(--market-down)" }}
                        >
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
