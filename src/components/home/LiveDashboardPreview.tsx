"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Newspaper, 
  Calendar,
  ChevronRight,
  Circle,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

interface MarketItem {
  symbol: string;
  price: number;
  changePercent: number;
  sparkline: number[];
}

interface NewsItem {
  source: string;
  title: string;
  timeAgo: string;
  url: string;
}

interface EconomicEvent {
  time: string;
  event: string;
  country: string;
  impact: 'High' | 'Medium' | 'Low';
  forecast: string;
  previous: string;
}



export function LiveDashboardPreview() {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [nextEvent, setNextEvent] = useState<EconomicEvent | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchData() {
      try {
        const [marketRes, newsRes, calendarRes] = await Promise.all([
          fetch("/api/market/prices?symbols=GBPUSD,EURUSD,FTSE,S&P500,NASDAQ,BTCUSD,ETHUSD,XAUUSD,WTIOil,USDJPY", { signal: controller.signal }),
          fetch("/api/news/feed", { signal: controller.signal }),
          fetch("/api/market/calendar", { signal: controller.signal })
        ]);

        const marketsData = await marketRes.json();
        const newsData = await newsRes.json();
        const calendarData = await calendarRes.json();

        if (!marketsData || marketsData.length === 0 || !newsData || newsData.length === 0) {
          setError(true);
        } else {
          setMarkets(marketsData.slice(0, 10));
          setNews(newsData.slice(0, 5).map((item: any) => ({
            source: item.source,
            title: item.title,
            timeAgo: "15m ago",
            url: item.url
          })));

          if (calendarData.length > 0) {
            setNextEvent(calendarData[0]);
            setUpcomingEvents(calendarData.slice(1, 4));
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Dashboard preview fetch error:", err);
        setError(true);
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  if (error) return null;

  return (
    <section className="py-20 bg-background-primary relative z-10 -mt-20">
      <div className="container mx-auto px-6">
        <div className={cn(
          "bg-background-surface border border-border-slate rounded-2xl overflow-hidden shadow-2xl transition-all duration-700",
          loading ? "opacity-50 blur-sm" : "opacity-100 blur-0"
        )}>
          <div className="grid grid-cols-1 lg:grid-cols-10 divide-y lg:divide-y-0 lg:divide-x divide-border-slate/50">
            
            {/* Column 1: Markets Now */}
            <div className="lg:col-span-3 p-8 space-y-8 bg-background-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                    SESSION ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-tertiary">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">LIVE FEED</span>
                </div>
              </div>

              <div className="space-y-4">
                {markets.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -m-2 transition- premium active:scale-95">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-tighter">{item.symbol}</span>
                      <span className="text-[8px] text-text-tertiary font-mono uppercase">Live Market</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <svg width="40" height="16" className="hidden sm:block opacity-40 group-hover:opacity-100 transition-opacity">
                        <polyline
                          fill="none"
                          stroke={item.changePercent >= 0 ? "#00E676" : "#FF3D57"}
                          strokeWidth="2"
                          points={item.sparkline?.map((v, i) => `${(i / (item.sparkline.length - 1)) * 40},${16 - (v / 100) * 16}`).join(" ")}
                        />
                      </svg>
                      
                      <div className="text-right flex flex-col">
                        <span className="text-sm font-bold font-mono text-text-primary tracking-tighter">
                          {item.price > 100 ? item.price.toFixed(2) : item.price.toFixed(5)}
                        </span>
                        <span className={cn(
                          "text-[9px] font-mono font-bold flex items-center justify-end gap-0.5",
                          item.changePercent >= 0 ? "text-profit" : "text-loss"
                        )}>
                          {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/markets" className="flex items-center justify-center gap-2 py-4 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all">
                Full Intelligence Hub <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 2: Latest News */}
            <div className="lg:col-span-4 p-10 flex flex-col h-full bg-background-surface">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-2.5 bg-accent/10 rounded-none border border-accent/20">
                  <Newspaper className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">Global Flux.</h3>
                  <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Real-time Intelligence Feed</p>
                </div>
              </div>

              <div className="flex-grow space-y-8">
                {news.map((item, i) => (
                  <a 
                    key={i} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group relative"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-tighter text-accent">
                        {item.source}
                      </span>
                      <span className="text-[9px] font-mono text-text-tertiary uppercase">
                        {item.timeAgo}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                  </a>
                ))}
              </div>

              <div className="pt-10 mt-10 border-t border-border-slate/50">
                <Link href="/markets" className="text-[10px] font-black uppercase tracking-widest text-accent hover:opacity-80 flex items-center justify-between group">
                  EXPLORE MARKET PULSE <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Column 3: Economic Calendar */}
            <div className="lg:col-span-3 p-10 space-y-10 bg-background-primary/30">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-accent/10 rounded-none border border-accent/20">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">Volatility.</h3>
                  <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Critical Macro Events</p>
                </div>
              </div>

              {nextEvent && (
                <div className="p-8 bg-background-elevated border-l-4 border-l-loss border border-border-slate space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Calendar className="w-12 h-12" />
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest font-bold px-2 py-0.5 bg-loss/10 text-loss">HIGH IMPACT</span>
                  </div>
                  
                  <div className="space-y-2 relative z-10">
                    <p className="text-sm font-black uppercase text-text-primary leading-tight">{nextEvent.event}</p>
                    <p className="text-[10px] font-mono text-text-secondary">{nextEvent.time} GMT • {nextEvent.country}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-border-slate/50 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-text-tertiary uppercase font-bold tracking-tighter">Consensus</span>
                      <span className="text-xs font-mono font-bold text-text-primary">{nextEvent.forecast || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-text-tertiary uppercase font-bold tracking-tighter">Previous</span>
                      <span className="text-xs font-mono text-text-secondary">{nextEvent.previous || "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest font-black border-b border-border-slate pb-2">Upcoming Intelligence</p>
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase text-text-secondary group-hover:text-text-primary transition-colors">{event.event}</span>
                      <span className="text-[9px] font-mono text-text-tertiary uppercase">{event.time}</span>
                    </div>
                    <span className="text-xs font-mono font-black text-accent">{event.country}</span>
                  </div>
                ))}
              </div>

              <Link href="/markets?tab=calendar" className="flex items-center justify-center gap-2 py-4 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all mt-auto">
                Full Economic Matrix <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest flex items-center justify-center gap-4">
             <Link href="/signup" className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-all font-bold">Launch Full Terminal &rarr;</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
