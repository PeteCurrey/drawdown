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
  Circle
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

  useEffect(() => {
    async function fetchData() {
      try {
        const [marketRes, newsRes, calendarRes] = await Promise.all([
          fetch("/api/market/prices?symbols=GBPUSD,EURUSD,FTSE,S&P500,NASDAQ,BTCUSD,ETHUSD,XAUUSD,WTIOil,USDJPY"),
          fetch("/api/news/feed"),
          fetch("/api/market/calendar")
        ]);

        const marketsData = await marketRes.json();
        const newsData = await newsRes.json();
        const calendarData = await calendarRes.json();

        setMarkets(marketsData.slice(0, 10));
        
        // Transform and slice news
        setNews(newsData.slice(0, 5).map((item: any) => ({
          source: item.source,
          title: item.title,
          timeAgo: "15m ago", // Simplified for preview
          url: item.url
        })));

        // Economic Calendar
        if (calendarData.length > 0) {
          setNextEvent(calendarData[0]);
          setUpcomingEvents(calendarData.slice(1, 4));
        }

        setLoading(false);
      } catch (err) {
        console.error("Dashboard preview fetch error:", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 minute refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-background-primary relative z-10 -mt-20">
      <div className="container mx-auto px-6">
        <div className="bg-[#111318] border border-border-slate rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-10 divide-y lg:divide-y-0 lg:divide-x divide-border-slate/50">
            
            {/* Column 1: Markets Now */}
            <div className="lg:col-span-3 p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-primary">
                    LONDON SESSION OPEN
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-tertiary">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">08:42:15 GMT</span>
                </div>
              </div>

              <div className="space-y-4">
                {markets.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -m-2 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-mono text-text-primary uppercase">{item.symbol}</span>
                      <span className="text-[10px] text-text-tertiary font-mono">Forex</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* Mini Sparkline SVG */}
                      <svg width="60" height="20" className="hidden sm:block">
                        <polyline
                          fill="none"
                          stroke={item.changePercent >= 0 ? "#00E676" : "#FF3D57"}
                          strokeWidth="1.5"
                          points={item.sparkline?.map((v, i) => `${(i / (item.sparkline.length - 1)) * 60},${20 - (v / 100) * 20}`).join(" ")}
                        />
                      </svg>
                      
                      <div className="text-right flex flex-col">
                        <span className="text-sm font-bold font-mono text-text-primary">
                          {item.price.toFixed(5)}
                        </span>
                        <span className={cn(
                          "text-[9px] font-mono font-bold flex items-center justify-end gap-0.5",
                          item.changePercent >= 0 ? "text-profit" : "text-loss"
                        )}>
                          {item.changePercent >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          {Math.abs(item.changePercent).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/markets" className="flex items-center justify-center gap-2 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
                View All Markets <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Column 2: Latest News */}
            <div className="lg:col-span-4 p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Newspaper className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase">Live Intelligence.</h3>
              </div>

              <div className="flex-grow space-y-6">
                {news.map((item, i) => (
                  <a 
                    key={i} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary px-1.5 py-0.5 border border-border-slate">
                        {item.source}
                      </span>
                      <span className="text-[9px] font-mono text-text-tertiary">
                        {item.timeAgo}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                  </a>
                ))}
              </div>

              <div className="pt-8 mt-8 border-t border-border-slate/30">
                <Link href="/markets/pulse" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
                  Explore Market Pulse <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Column 3: Economic Calendar */}
            <div className="lg:col-span-3 p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase">Economic.</h3>
              </div>

              {nextEvent && (
                <div className="p-6 bg-background-elevated border border-border-slate rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">NEXT HIGH IMPACT</span>
                    <Circle className="w-2 h-2 fill-loss text-loss" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-mono font-bold text-accent tracking-tight">2h 14m 33s</p>
                    <p className="text-sm font-bold uppercase">{nextEvent.event}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border-slate/30">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-text-tertiary uppercase">Time</span>
                      <span className="text-xs font-mono">{nextEvent.time}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-text-tertiary uppercase">Impact</span>
                      <span className="text-xs font-mono text-loss">HIGH</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">UPCOMING TODAY</p>
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border-slate/30 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase truncate max-w-[150px]">{event.event}</span>
                      <span className="text-[9px] font-mono text-text-tertiary">{event.time}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-text-primary">{event.country}</span>
                  </div>
                ))}
              </div>

              <Link href="/markets?tab=calendar" className="flex items-center justify-center gap-2 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
                Full Calendar <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
            This is what your dashboard looks like. Imagine it personalised to your watchlist. <Link href="/signup" className="text-accent hover:underline ml-2">Start Free &rarr;</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
