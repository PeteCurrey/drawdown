"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldAlert, Landmark, Flame, TrendingUp, TrendingDown, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface BarometerItem {
  label: string;
  value: string;
  change: string;
  isUp: boolean;
  note: string;
}

export function PulseBarometer() {
  const [indicators, setIndicators] = useState<Record<string, any>>({});
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [iRes, sRes] = await Promise.all([
          fetch("/api/macro/indicators"),
          fetch("/api/market/sentiment")
        ]);
        if (!active) return;

        const iData = await iRes.json();
        const sData = await sRes.json();

        if (iData.indicators) setIndicators(iData.indicators);
        if (sData) setSentiment(sData);
      } catch (err) {
        console.error("Failed to load Pulse barometer data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 30000); // 30s high frequency polling

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const vix = sentiment?.vix || 16.40;
  const vixRegime = vix > 20 ? "ELEVATED" : vix < 15 ? "CALM" : "NORMAL";
  const vixColor = vix > 20 ? "text-[#CE6969]" : "text-[#18B880]";

  const fed = indicators["fed_rate"];
  const boe = indicators["boe_rate"];
  const wti = indicators["wti_oil"];
  const us10y = indicators["us_10y"];

  // Compute overall market regime
  const fg = sentiment?.fearGreed || 74;
  const regimeLabel = fg >= 60 && vix < 20 ? "RISK-ON ACCUMULATION" : fg <= 40 || vix > 22 ? "RISK-OFF HEDGING" : "TRANSITIONAL FLUX";
  const regimeBadge = fg >= 60 && vix < 20 ? "bg-[#18B880]/15 text-[#18B880] border-[#18B880]/30" : fg <= 40 || vix > 22 ? "bg-[#CE6969]/15 text-[#CE6969] border-[#CE6969]/30" : "bg-amber-500/15 text-amber-600 border-amber-500/30";

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8F135]/10 border border-[#C8F135]/20 flex items-center justify-center text-[#C8F135]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">MACRO REGIME BAROMETER</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-ping" />
            </div>
            <h3 className="text-lg md:text-xl font-display font-extrabold text-white uppercase tracking-tight">
              Real-time Market Conditions
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase text-white/40">Global Regime:</span>
          <div className={cn("px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-2", regimeBadge)}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {regimeLabel}
          </div>
        </div>
      </div>

      {/* Grid of 4 Key Vitals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        {/* Vital 1: Volatility Gauge */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-[#C8F135]/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#C8F135]" /> VIX Volatility Index
            </span>
            <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">{vixRegime}</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={cn("text-2xl font-mono font-bold tracking-tight", vixColor)}>
              {vix}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase">Fear Metric</span>
          </div>
        </div>

        {/* Vital 2: Central Bank Rates */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-[#C8F135]/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#C8F135]" /> Fed vs BoE Policy
            </span>
            <span className="text-[9px] font-mono text-white/40">FRED®</span>
          </div>
          <div className="flex items-baseline justify-between mt-1 font-mono">
            <div>
              <span className="text-xs text-white/50 block">Fed: <strong className="text-white">{fed?.value ?? "5.25"}%</strong></span>
            </div>
            <div>
              <span className="text-xs text-white/50 block">BoE: <strong className="text-white">{boe?.value ?? "5.00"}%</strong></span>
            </div>
          </div>
        </div>

        {/* Vital 3: WTI Energy Spot */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-[#C8F135]/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#F9771D]" /> WTI Crude Spot
            </span>
            <span className="text-[9px] font-mono text-white/40">EIA® API</span>
          </div>
          <div className="flex items-baseline justify-between mt-1 font-mono">
            <span className="text-2xl font-bold text-white tracking-tight">
              ${wti?.value ?? "77.40"}
              <span className="text-xs font-normal text-white/40 ml-1">/bbl</span>
            </span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", (wti?.change ?? 0) >= 0 ? "text-[#18B880] bg-[#18B880]/10" : "text-[#CE6969] bg-[#CE6969]/10")}>
              {(wti?.change ?? 0) >= 0 ? `+${wti?.change ?? 0}` : wti?.change}
            </span>
          </div>
        </div>

        {/* Vital 4: US 10Y Benchmark Yield */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-[#C8F135]/30 transition-all">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C8F135]" /> US 10Y Treasury Yield
            </span>
            <span className="text-[9px] font-mono text-white/40">FRED®</span>
          </div>
          <div className="flex items-baseline justify-between mt-1 font-mono">
            <span className="text-2xl font-bold text-white tracking-tight">
              {us10y?.value ?? "4.18"}%
            </span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", (us10y?.change ?? 0) >= 0 ? "text-[#18B880] bg-[#18B880]/10" : "text-[#CE6969] bg-[#CE6969]/10")}>
              {(us10y?.change ?? 0) >= 0 ? `+${us10y?.change ?? 0}` : us10y?.change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
