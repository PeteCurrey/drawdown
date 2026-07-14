"use client";

import { useEffect, useState } from "react";
import { Gauge, Calendar, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function PulseSidebar() {
  const [calendar, setCalendar] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch("/api/market/calendar"),
          fetch("/api/market/sentiment")
        ]);
        const cData = await cRes.json();
        const sData = await sRes.json();
        setCalendar(cData.slice(0, 5));
        setSentiment(sData);
      } catch (err) {
        console.error("Sidebar data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Sentiment Snapshot */}
      <div className="p-8 bg-[#F7F7F7] border border-mkt-bd relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Gauge className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-mkt-i4">
            <Gauge className="w-3 h-3 text-accent" />
            Institutional Sentiment
          </div>
          
          <div className="text-center py-4">
            <span className="text-6xl font-sans font-black text-accent">{sentiment?.fearGreed || "74"}</span>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-grn mt-2 font-bold">{sentiment?.label || "Extreme Greed"}</p>
          </div>

          <div className="w-full h-1 bg-border-slate/30 relative">
             <div 
               className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000" 
               style={{ width: `${sentiment?.fearGreed || 74}%` }} 
             />
          </div>

          <p className="text-[10px] text-mkt-i4 font-sans leading-relaxed uppercase tracking-wide">
            Sentiment is calculated via a proprietary mix of VIX volatility, volume trends, and institutional order flow delta.
          </p>
        </div>
      </div>

      {/* Economic Calendar Sidebar */}
      <div className="bg-[#F7F7F7] border border-mkt-bd p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-mkt-i4">
            <Calendar className="w-3 h-3 text-accent" />
            Key Events Today
          </div>
          <Link href="/markets?tab=calendar" className="text-[9px] font-bold uppercase text-accent hover:underline tracking-widest">
            Full View
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="h-12 bg-white/50 animate-pulse" />
             ))
          ) : calendar.length > 0 ? (
            calendar.map((event, i) => (
              <div key={i} className="group flex flex-col gap-1 p-3 bg-white/30 border border-mkt-bd/50 hover:border-mkt-bds/40 transition-colors">
                <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
                  <span className="text-mkt-i4">{event.time} // {event.currency}</span>
                  {event.impact === "High" && <AlertTriangle className="w-2.5 h-2.5 text-red-500 animate-pulse" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight text-mkt-ink group-hover:text-accent transition-colors truncate">
                  {event.event}
                </span>
                <div className="flex gap-3 text-[8px] font-mono text-mkt-i4">
                  <span>Actual: <span className="text-mkt-ink">{event.actual || "---"}</span></span>
                  <span>Forecast: <span>{event.forecast || "---"}</span></span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] font-mono text-mkt-i4 uppercase text-center py-4 border border-dashed border-mkt-bd">No High Impact Events</p>
          )}
        </div>
      </div>

      {/* Intelligence CTA */}
      <div className="p-8 bg-accent/5 border border-accent/20 relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold">
            <Info className="w-3 h-3" />
            Advanced Signal Suite
          </div>
          <p className="text-xs text-mkt-i2 leading-relaxed">
            Unlock the full technical consensus scanner, detailed sector heatmaps, and AI-driven news explanation for every major headline.
          </p>
          <Link 
            href="/signup" 
            className="block w-full py-4 bg-mkt-ink text-white text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors"
          >
            Launch Intelligence Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
