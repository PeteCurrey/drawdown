"use client";

import { useEffect, useState } from "react";
import { Gauge, Info, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SentimentTab() {
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSentiment() {
      try {
        const res = await fetch("/api/market/sentiment");
        const data = await res.json();
        setSentiment(data);
      } catch (err) {
        console.error("Sentiment Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSentiment();
  }, []);

  const getSentimentColor = (value: number) => {
    if (value > 75) return "text-mkt-grn";
    if (value > 55) return "text-accent";
    if (value > 45) return "text-mkt-ink";
    if (value > 25) return "text-red-500";
    return "text-red-500 font-black";
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Main Gauge Column */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-sans font-bold uppercase tracking-tight flex items-center gap-3">
              <Gauge className="w-6 h-6 text-accent" /> Market Sentiment Index
            </h3>
            <p className="text-[10px] font-mono uppercase text-mkt-i4 tracking-widest leading-loose">
              Composite Psychology Indicator // Global Sentiment
            </p>
          </div>

          <div className="p-12 md:p-20 bg-white border border-mkt-bd relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Background Accent Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#00E67605_0%,transparent_70%)]" />
            
            {loading ? (
               <div className="animate-pulse flex flex-col items-center gap-4">
                 <div className="w-32 h-32 rounded-full bg-border-slate/20" />
                 <div className="w-48 h-8 bg-border-slate/10" />
               </div>
            ) : (
              <>
                <span className={cn(
                  "text-8xl md:text-9xl font-sans font-black leading-none mb-6",
                  getSentimentColor(sentiment.fearGreed)
                )}>
                  {sentiment.fearGreed}
                </span>
                <h4 className="text-2xl font-sans font-bold uppercase tracking-tight text-mkt-ink mb-4">
                  {sentiment.label}
                </h4>
                <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">
                  Last Updated: {new Date(sentiment.updatedAt).toLocaleTimeString()} UTC
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-[#F7F7F7]/30 border border-mkt-bd">
                <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 block mb-2">VIX Index</span>
                <span className="text-2xl font-mono font-bold">{loading ? "--" : sentiment.vix.toFixed(2)}</span>
                <p className="text-[10px] font-mono text-mkt-i4 mt-1 uppercase">Volatility Gauge</p>
             </div>
             <div className="p-6 bg-[#F7F7F7]/30 border border-mkt-bd">
                <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 block mb-2">Momentum</span>
                <span className="text-2xl font-mono font-bold text-mkt-grn">BULLISH</span>
                <p className="text-[10px] font-mono text-mkt-i4 mt-1 uppercase">Daily Consensus</p>
             </div>
          </div>
        </div>

        {/* Narrative / Context Column */}
        <div className="space-y-8">
           <div className="space-y-6">
              <h4 className="text-sm font-sans font-bold uppercase border-b border-mkt-bd pb-4">Understanding This Signal</h4>
              <div className="space-y-4">
                <div className="flex gap-4 p-6 bg-white/50 border border-mkt-bd">
                   <Info className="w-5 h-5 text-accent shrink-0" />
                   <div>
                     <p className="text-xs font-bold uppercase tracking-widest mb-2">Contrarian Signal</p>
                     <p className="text-sm text-mkt-i2 leading-relaxed">
                       In institutional trading, "Extreme Fear" can be a powerful buy signal, while "Extreme Greed" often signals a market top. Use this to gauge if retail positioning is overextended.
                     </p>
                   </div>
                </div>
                <div className="flex gap-4 p-6 bg-white/50 border border-mkt-bd">
                   <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                   <div>
                     <p className="text-xs font-bold uppercase tracking-widest mb-2">Volatility Watch</p>
                     <p className="text-sm text-mkt-i2 leading-relaxed">
                        A rising VIX (above 20) indicates increasing panic and broad market uncertainty. During these periods, correlations break down and risk management is paramount.
                     </p>
                   </div>
                </div>
              </div>
           </div>

           <div className="p-10 bg-accent/5 border border-accent/20 relative overflow-hidden">
              <TrendingUp className="absolute bottom-0 right-0 w-32 h-32 text-accent/10 -mb-8 -mr-8" />
              <div className="relative z-10">
                <h4 className="text-lg font-sans font-bold uppercase text-accent mb-4">Pete&apos;s Psychological Take</h4>
                <p className="text-sm text-mkt-i2 leading-relaxed italic mb-6">
                  "The crowd is currently leaning heavily into the long side on USD, but technical exhaustion is screaming at us from the weekly charts. When everyone is in the same boat, its much easier to capsize. Wait for the squeeze."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white border border-mkt-bd flex items-center justify-center">
                    <span className="text-xs font-sans font-bold text-accent">P</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Senior Strategist // Drawdown</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
