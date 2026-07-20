"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, TrendingUp, Newspaper, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  excerpt: string;
  categories: string[];
  imageUrl?: string;
}

const TARGET_SOURCES = ["Sky News", "CNN", "Fox News", "BBC"];
const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";

const TOP_MOVER_SYMBOLS = ["EURUSD", "GBPUSD", "BTCUSD"];

interface MoverItem {
  symbol: string;
  price?: number;
  changePercent?: number;
}
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
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return "Live";
  }
}

export function LiveNewsSection() {
  const cardClasses = "bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-300";
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [topMovers, setTopMovers] = useState<MoverItem[]>(
    TOP_MOVER_SYMBOLS.map(sym => ({ symbol: sym }))
  );
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  // Fetch news feed on mount
  useEffect(() => {
    let active = true;
    async function loadNews() {
      try {
        const res = await fetch("/api/news/feed");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        if (Array.isArray(data) && active) {
          const filtered = data.filter(item => isTargetSource(item.source));
          setNews(filtered);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load live news", err);
        if (active) setLoading(false);
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
    
    // Poll movers every 30s
    const moversInterval = setInterval(loadMovers, 30000);

    return () => {
      active = false;
      clearInterval(moversInterval);
    };
  }, []);

  // Rotate items every 10 seconds
  useEffect(() => {
    if (news.length <= 4) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [news.length]);

  // Compute active 4 items shown currently
  const activeItems = useMemo(() => {
    if (news.length === 0) return [];
    const items: NewsItem[] = [];
    for (let i = 0; i < Math.min(news.length, 4); i++) {
      items.push(news[(startIndex + i) % news.length]);
    }
    return items;
  }, [news, startIndex]);

  // Initialize TradingView widget
  useEffect(() => {
    if (!calendarContainerRef.current) return;

    calendarContainerRef.current.innerHTML = "";

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
      width: "100%",
      height: 550
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";

    const copyrightDiv = document.createElement("div");
    copyrightDiv.className = "tradingview-widget-copyright text-center text-[10px] text-mkt-i3 mt-2";
    
    const copyrightLink = document.createElement("a");
    copyrightLink.href = "https://www.tradingview.com/economic-calendar/";
    copyrightLink.rel = "noopener nofollow";
    copyrightLink.target = "_blank";
    
    const spanBlue = document.createElement("span");
    spanBlue.className = "blue-text text-accent hover:underline";
    spanBlue.textContent = "Economic Calendar";
    
    const spanTrademark = document.createElement("span");
    spanTrademark.className = "trademark text-text-tertiary";
    spanTrademark.textContent = " by TradingView";
    
    copyrightLink.appendChild(spanBlue);
    copyrightDiv.appendChild(copyrightLink);
    copyrightDiv.appendChild(spanTrademark);

    calendarContainerRef.current.appendChild(widgetDiv);
    calendarContainerRef.current.appendChild(copyrightDiv);
    calendarContainerRef.current.appendChild(script);
  }, []);

  const renderLeftColumn = () => {
    if (loading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="bg-neutral-100 border border-mkt-bd rounded-[14px] h-[450px] relative overflow-hidden flex flex-col justify-end p-6">
            <div className="space-y-4 w-full">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-8 w-3/4 bg-neutral-200 rounded" />
              <div className="h-4 w-5/6 bg-neutral-200 rounded" />
              <div className="h-4 w-2/3 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-100 border border-mkt-bd rounded-[14px] h-[128px] p-5 flex flex-col justify-end">
                <div className="space-y-2 w-full">
                  <div className="h-3.5 w-32 bg-neutral-200 rounded" />
                  <div className="h-5 w-5/6 bg-neutral-200 rounded" />
                  <div className="h-3.5 w-2/3 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (news.length === 0) {
      return (
        <div className="bg-neutral-50 border border-mkt-bd rounded-[14px] p-12 text-center text-mkt-i3 font-sans h-[450px] flex items-center justify-center">
          No live world news from Sky News, CNN, Fox News or BBC available right now.
        </div>
      );
    }

    const featuredNews = activeItems[0];
    const listNews = activeItems.slice(1);

    return (
      <div className="space-y-6">
        {/* Featured news card */}
        <div className={cn(cardClasses, "p-0 overflow-hidden group relative h-[450px] flex flex-col justify-end bg-black border border-mkt-bd shadow-sm")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredNews.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-between"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${featuredNews.imageUrl || fallbackImage})` }}
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/35 z-0" />
              
              <div className="flex justify-between items-center z-10 p-6">
                <span className="text-[10px] font-bold text-white bg-mkt-grn px-2.5 py-1 rounded-sm uppercase tracking-wider font-sans shadow-md">
                  BREAKING
                </span>
                <Newspaper className="w-5 h-5 text-white/70 drop-shadow" />
              </div>
              
              <div className="z-10 p-6 space-y-3">
                <div>
                  <p className="text-[10px] font-mono text-neutral-350 uppercase tracking-widest">
                    {formatPubDate(featuredNews.publishedAt)} &bull; {featuredNews.source}
                  </p>
                  <h3 className="text-xl md:text-2xl font-sans font-extrabold text-white mt-1.5 leading-tight tracking-tight drop-shadow-md">
                    {featuredNews.title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans line-clamp-3">
                  {featuredNews.excerpt}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-neutral-450 uppercase font-bold tracking-widest">
                    {featuredNews.categories?.[0] || "GLOBAL NEWS"}
                  </span>
                  <a 
                    href={featuredNews.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-bold text-white hover:text-mkt-grn hover:underline transition-colors flex items-center gap-1"
                  >
                    Read coverage <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Three news list items */}
        <div className="space-y-4">
          {listNews.map((item, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-[14px] border border-mkt-bd min-h-[128px] h-[128px] bg-black group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <AnimatePresence mode="wait">
                <motion.a 
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 p-6 flex flex-col justify-end"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.imageUrl || fallbackImage})` }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/35 z-0 transition-opacity duration-300 group-hover:opacity-95" />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-1 pr-6">
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] font-mono text-neutral-350 uppercase tracking-widest">
                        {formatPubDate(item.publishedAt)} &bull; {item.source}
                      </p>
                    </div>
                    <h4 className="text-sm md:text-base font-sans font-bold text-white group-hover:text-mkt-grn transition-colors duration-150 leading-tight line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-300 leading-normal font-sans line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                  
                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <ArrowUpRight className="w-4 h-4 text-mkt-grn" />
                  </div>
                </motion.a>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // LIVE MARKET BRIEFING
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Market Pulse & Intelligence
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Real-time sentiment monitoring, macro calendars, and raw professional data feeds.
          </p>
          <p className="text-xs text-mkt-i4 max-w-2xl mx-auto font-sans mt-4 leading-relaxed border-t border-neutral-100 pt-4">
            This panel aggregates global news coverages from Sky News, CNN, Fox News, and BBC, alongside the real-time Economic Calendar and top currency movers. By matching political headlines and central bank speeches with price charts, traders can pinpoint high-impact volatility windows and sentiment shifts.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (News feed: 7 cols) */}
          <div className="lg:col-span-7">
            {renderLeftColumn()}
          </div>

          {/* Right Column (Sidebar: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Economic Calendar Card */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-base font-sans font-bold text-mkt-ink flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-mkt-i3" /> Economic Calendar
                </h3>
                <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">TODAY</span>
              </div>
              
              <div className="w-full overflow-hidden">
                <div className="overflow-x-auto w-full flex justify-center">
                  <div ref={calendarContainerRef} className="tradingview-widget-container min-w-[320px] w-full flex flex-col items-center" />
                </div>
              </div>
            </div>

            {/* Top Movers Card */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-base font-sans font-bold text-mkt-ink flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-mkt-i3" /> Top Movers
                </h3>
                <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">24H RANGE</span>
              </div>
              
              <div className="space-y-3">
                {topMovers.map((mvr, idx) => {
                  const hasData = mvr.price !== undefined;
                  const isPositive = mvr.changePercent !== undefined && mvr.changePercent >= 0;
                  
                  // Format price
                  let displayPrice = "--";
                  if (hasData) {
                    if (mvr.symbol.includes("BTC")) {
                      displayPrice = mvr.price!.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    } else {
                      displayPrice = mvr.price!.toFixed(4);
                    }
                  }

                  // Format change
                  let displayChange = "";
                  if (hasData && mvr.changePercent !== undefined) {
                    displayChange = `${isPositive ? "▲" : "▼"} ${Math.abs(mvr.changePercent).toFixed(2)}%`;
                  }

                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-b-0 last:pb-0"
                    >
                      <span className="text-xs font-mono font-bold text-mkt-ink">{mvr.symbol}</span>
                      <span className="text-xs font-mono text-mkt-i3">{displayPrice}</span>
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
