"use client";

import { useEffect, useState } from "react";
import { Gauge, Calendar, AlertTriangle, Info, Flame, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function PulseSidebar() {
  const [calendar, setCalendar] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [macroIndicators, setMacroIndicators] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [cRes, sRes, mRes, eRes] = await Promise.all([
          fetch("/api/market/calendar"),
          fetch("/api/market/sentiment"),
          fetch("/api/macro/indicators"),
          fetch("/api/market/energy")
        ]);
        if (!active) return;

        const cData = await cRes.json();
        const sData = await sRes.json();
        const mData = await mRes.json();
        const eData = await eRes.json();

        setCalendar(cData.slice(0, 5));
        setSentiment(sData);
        if (mData.list) setMacroIndicators(mData.list);
        if (eData.energy) setEnergyData(eData.energy);
      } catch (err) {
        console.error("Sidebar data fetch error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s high frequency polling

    return () => {
      active = false;
      clearInterval(interval);
    };
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
            Market Sentiment
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
            Sentiment is calculated via a proprietary mix of VIX volatility, volume trends, and professional order flow delta.
          </p>
        </div>
      </div>

      {/* FRED® Macro Vitals Widget */}
      <div className="bg-[#F7F7F7] border border-mkt-bd p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-mkt-ink font-bold">
            <Landmark className="w-3.5 h-3.5 text-accent" />
            FRED® Central Bank Vitals
          </div>
          <span className="text-[8px] font-mono text-mkt-i4 uppercase">Live API</span>
        </div>

        <div className="space-y-2">
          {macroIndicators.slice(0, 4).map((item) => (
            <div key={item.key} className="flex items-center justify-between p-2.5 bg-white border border-mkt-bd/60 text-xs font-mono">
              <span className="text-mkt-i3 font-sans font-medium text-[11px]">{item.name}</span>
              <div className="text-right">
                <span className="font-bold text-mkt-ink">{item.value}{item.unit}</span>
                <span className={cn("text-[9px] block font-semibold", item.change >= 0 ? "text-mkt-grn" : "text-mkt-red")}>
                  {item.change >= 0 ? `+${item.change}` : item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EIA® Energy Snapshot Widget */}
      {energyData && (
        <div className="bg-[#F7F7F7] border border-mkt-bd p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-mkt-ink font-bold">
              <Flame className="w-3.5 h-3.5 text-[#F9771D]" />
              EIA® Energy Snapshot
            </div>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">Daily EIA</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="bg-white p-3 border border-mkt-bd/60">
              <span className="text-[9px] text-mkt-i4 uppercase block">WTI Crude</span>
              <span className="text-sm font-bold text-mkt-ink">${energyData.wti_crude?.price}</span>
              <span className="text-[8px] text-mkt-i4 block">/bbl</span>
            </div>
            <div className="bg-white p-3 border border-mkt-bd/60">
              <span className="text-[9px] text-mkt-i4 uppercase block">Natural Gas</span>
              <span className="text-sm font-bold text-mkt-ink">${energyData.nat_gas?.price}</span>
              <span className="text-[8px] text-mkt-i4 block">/MMBtu</span>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
