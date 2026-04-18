"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Globe, AlertCircle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { expertAnalysis } from "@/data/analysis";

export function OverviewTab() {
  const [prices, setPrices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const latestAnalysis = expertAnalysis[0]; // Get the most recent take

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, eRes, nRes, sRes] = await Promise.all([
          fetch("/api/market/prices?symbols=FTSE,SPX,NDX,GBP/USD,EUR/USD,BTC/USD,Gold"),
          fetch("/api/market/calendar"),
          fetch("/api/news/feed"),
          fetch("/api/market/sentiment")
        ]);

        const [pData, eData, nData, sData] = await Promise.all([
          pRes.json(), eRes.json(), nRes.json(), sRes.json()
        ]);

        setPrices(pData);
        setEvents(eData.slice(0, 5));
        setNews(nData.slice(0, 4));
        setSentiment(sData);
      } catch (err) {
        console.error("Overview Fetch Error:", err);
      } finally {
        setLoading(setLoading(false) as any);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* 1. Market Status Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {prices.map((item) => (
          <div key={item.symbol} className="p-4 bg-background-surface border border-border-slate">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{item.symbol}</span>
              {item.change >= 0 
                ? <ArrowUpRight className="w-3 h-3 text-profit" /> 
                : <ArrowDownRight className="w-3 h-3 text-loss" />
              }
            </div>
            <p className="text-xl font-mono font-bold">{item.price.toFixed(2)}</p>
            <p className={cn(
              "text-[9px] font-mono",
              item.change >= 0 ? "text-profit" : "text-loss"
            )}>
              {item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 2. Today's Key Events */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-border-slate pb-4">
            <h3 className="text-lg font-display font-bold uppercase flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" /> Key Events Today
            </h3>
            <Link href="/markets?tab=calendar" className="text-[10px] font-mono uppercase text-accent hover:underline">Full Calendar →</Link>
          </div>

          <div className="space-y-4">
            {events.length > 0 ? events.map((event, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background-elevated/30 border-l-2 border-accent">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-text-tertiary">{event.time}</span>
                  <span className="text-sm font-bold uppercase tracking-tight">{event.event}</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <span className="text-[10px] block font-mono text-text-tertiary uppercase">Forecast</span>
                    <span className="text-xs font-mono">{event.forecast || "---"}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-loss" title="High Impact" />
                </div>
              </div>
            )) : (
              <p className="text-sm text-text-tertiary italic">No high-impact events scheduled for today.</p>
            )}
          </div>

          {/* 3. Latest News */}
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border-slate pb-4">
              <h3 className="text-lg font-display font-bold uppercase flex items-center gap-2">
                <Radio className="w-5 h-5 text-accent" /> Market Intelligence
              </h3>
              <Link href="/markets?tab=news" className="text-[10px] font-mono uppercase text-accent hover:underline">View All News →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="p-6 bg-background-surface border border-border-slate hover:border-accent transition-colors group">
                  <span className="text-[9px] font-mono text-text-tertiary uppercase mb-2 block">{item.source} // {item.publishedAt}</span>
                  <h4 className="text-sm font-bold uppercase leading-tight group-hover:text-accent transition-colors line-clamp-2">{item.title}</h4>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Sidebar Sentiment & Pete's Take */}
        <div className="space-y-12">
          {/* Sentiment Gauge Card */}
          <div className="p-8 bg-background-elevated border border-border-slate">
            <h3 className="text-sm font-display font-bold uppercase mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent" /> Market Sentiment
            </h3>
            <div className="text-center py-6">
              <span className="text-6xl font-display font-black text-accent">{sentiment?.fearGreed || "--"}</span>
              <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mt-2">{sentiment?.label || "Calculating..."}</p>
            </div>
            <div className="w-full h-1 bg-border-slate mt-6 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000" 
                style={{ width: `${sentiment?.fearGreed || 50}%` }}
              />
            </div>
          </div>

          {/* Pete's Take Preview */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Pete&apos;s Current Bias</p>
            <div className="p-6 bg-accent/5 border border-accent/20 italic text-sm text-text-secondary leading-relaxed">
              "{latestAnalysis.excerpt}"
            </div>
            <Link href={`/markets/analysis/${latestAnalysis.slug}`} className="text-[10px] font-bold uppercase text-accent hover:underline tracking-widest block">Read Full Daily Brief →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
