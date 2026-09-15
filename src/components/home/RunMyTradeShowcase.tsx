"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldCheck
} from "lucide-react";
import { AnimatedMetric } from "@/components/ui/AnimatedMetric";

interface DemoPreset {
  pair: string;
  name: string;
  entry: number;
  stop: number;
  target: number;
  pipFactor: number;
  decimals: number;
  unit: string;
}

const PRESETS: Record<string, DemoPreset> = {
  GBPUSD: { pair: "GBP/USD", name: "Cable", entry: 1.2850, stop: 1.2810, target: 1.2950, pipFactor: 10000, decimals: 4, unit: "pips" },
  EURUSD: { pair: "EUR/USD", name: "Fiber", entry: 1.0820, stop: 1.0790, target: 1.0895, pipFactor: 10000, decimals: 4, unit: "pips" },
  XAUUSD: { pair: "XAU/USD", name: "Spot Gold", entry: 2920.0, stop: 2905.0, target: 2965.0, pipFactor: 1, decimals: 1, unit: "pts" },
  SPX:    { pair: "US500",   name: "S&P 500", entry: 5850.0, stop: 5820.0, target: 5940.0, pipFactor: 1, decimals: 1, unit: "pts" },
  BTCUSD: { pair: "BTC/USD", name: "Bitcoin",  entry: 68500, stop: 67100, target: 72000, pipFactor: 1, decimals: 0, unit: "pts" },
};

export function RunMyTradeShowcase() {
  const [selectedKey, setSelectedKey] = useState<string>("GBPUSD");
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [accountSize, setAccountSize] = useState<number>(25000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);

  const preset = PRESETS[selectedKey];

  // Dynamic calculations based on state
  const math = useMemo(() => {
    const riskAmount = (accountSize * riskPercent) / 100;
    const stopDistance = Math.abs(preset.entry - preset.stop);
    const stopPips = stopDistance * preset.pipFactor;
    const targetDistance = Math.abs(preset.target - preset.entry);
    const targetPips = targetDistance * preset.pipFactor;

    const rrRatio = stopDistance > 0 ? (targetDistance / stopDistance).toFixed(2) : "0.00";
    const potentialProfit = riskAmount * Number(rrRatio);

    // Approximate lot calculation for demonstration
    // 1 standard lot = $10 / pip on standard FX pair
    let lotSize = "0.00";
    if (selectedKey === "GBPUSD" || selectedKey === "EURUSD") {
      const pipValueStandardLot = 7.8; // ~£7.80 per pip in GBP account
      lotSize = stopPips > 0 ? (riskAmount / (stopPips * pipValueStandardLot)).toFixed(2) : "0.00";
    } else if (selectedKey === "XAUUSD") {
      lotSize = stopDistance > 0 ? (riskAmount / (stopDistance * 10)).toFixed(2) : "0.00";
    } else {
      lotSize = stopDistance > 0 ? (riskAmount / stopDistance).toFixed(2) : "0.00";
    }

    const drawdownImpact = ((riskAmount / accountSize) * 100).toFixed(1);

    return {
      riskAmount: riskAmount.toFixed(2),
      stopPips: stopPips.toFixed(selectedKey === "GBPUSD" || selectedKey === "EURUSD" ? 1 : 0),
      targetPips: targetPips.toFixed(selectedKey === "GBPUSD" || selectedKey === "EURUSD" ? 1 : 0),
      rrRatio,
      potentialProfit: potentialProfit.toFixed(2),
      lotSize,
      drawdownImpact,
    };
  }, [accountSize, riskPercent, preset, selectedKey]);

  return (
    <section
      className="w-full py-24 md:py-32 border-b select-none relative"
      style={{
        backgroundColor: "var(--paper-0)",
        borderColor: "var(--line-200)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--ink-950)]" 
            style={{ 
              backgroundColor: "#FFFFFF", 
              borderColor: "var(--line-200)",
              borderRadius: "5px",
              boxShadow: "0 1px 2px rgba(11, 14, 18, 0.02)"
            }}
          >
            <Zap size={12} className="text-amber-500 fill-amber-500" />
            Interactive Product Demonstration
          </div>
          <h2
            className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] tracking-[-0.02em] font-semibold"
            style={{ color: "var(--ink-950)" }}
          >
            RUN MY TRADE: The Aha Moment.
          </h2>
          <p
            className="text-[17px] leading-[1.6] font-sans"
            style={{ color: "var(--graphite-600)" }}
          >
            Never place an unquantified trade again. Enter your idea, see your exact mathematical lot size, verify the risk-to-reward ratio, and lock your plan before opening your broker terminal.
          </p>
        </div>

        {/* Interactive Simulator Shell (LEVEL 1 Structural Chassis) */}
        <div
          className="border overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "var(--line-200)",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(11, 14, 18, 0.04), 0 12px 36px -10px rgba(11, 14, 18, 0.08)",
          }}
        >
          {/* Top Bar / Terminal Header */}
          <div
            className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4"
            style={{ 
              backgroundColor: "var(--paper-100)",
              borderColor: "var(--line-200)" 
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-gray-900 tracking-wider">
                RUN_MY_TRADE // LIVE DEMO ENGINE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] font-mono uppercase px-2 py-0.5 border rounded-[4px] font-medium"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "var(--line-200)",
                  color: "var(--graphite-600)"
                }}
              >
                Deterministic Sizing Engine · Real-time Math
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: "var(--line-200)" }}>
            {/* Left Controls Column (LEVEL 2 Input Layer) */}
            <div 
              className="lg:col-span-5 p-6 md:p-8 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 249, 0.6)" }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--line-200)" }}>
                <span className="text-[10px] font-mono uppercase tracking-[0.1em] font-bold text-gray-500">
                  Step 1 · Input Parameters
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  PRE-TRADE
                </span>
              </div>

              {/* 1. Instrument Selector */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-2 font-bold">
                  Select Instrument
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {Object.keys(PRESETS).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelectedKey(k)}
                      className={`px-3 py-2 text-xs font-mono font-bold border transition-all duration-150 rounded-[5px] active:translate-y-0.5 ${
                        selectedKey === k
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50/80"
                      }`}
                    >
                      {PRESETS[k].pair}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Direction Toggle */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-2 font-bold">
                  Trade Bias
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDirection("LONG")}
                    className={`flex items-center justify-center gap-2 py-2.5 border font-mono text-xs font-bold transition-all duration-150 rounded-[5px] active:translate-y-0.5 ${
                      direction === "LONG"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <TrendingUp size={14} /> LONG
                  </button>
                  <button
                    onClick={() => setDirection("SHORT")}
                    className={`flex items-center justify-center gap-2 py-2.5 border font-mono text-xs font-bold transition-all duration-150 rounded-[5px] active:translate-y-0.5 ${
                      direction === "SHORT"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <TrendingDown size={14} /> SHORT
                  </button>
                </div>
              </div>

              {/* 3. Account Capital */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-2 font-bold">
                  Account Equity (GBP)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10000, 25000, 50000, 100000].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setAccountSize(cap)}
                      className={`py-2 text-xs font-mono border font-bold transition-all duration-150 rounded-[5px] active:translate-y-0.5 ${
                        accountSize === cap
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      £{(cap / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Risk Per Trade */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                    Risk Percentage
                  </label>
                  <span className="font-mono text-xs font-bold text-gray-900 tabular-nums">
                    {riskPercent.toFixed(1)}% (<AnimatedMetric value={`£${math.riskAmount}`} />)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1.0, 1.5, 2.0].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setRiskPercent(pct)}
                      className={`py-2 text-xs font-mono border font-bold transition-all duration-150 rounded-[5px] active:translate-y-0.5 ${
                        riskPercent === pct
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Planned Price Levels (Inset Precision Monitor) */}
              <div 
                className="p-4 border text-xs font-mono space-y-2 rounded-[6px]" 
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "var(--line-200)",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.02)"
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold pb-1 border-b" style={{ borderColor: "var(--line-200)" }}>
                  Structural Price Levels
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Planned Entry:</span>
                  <span className="font-bold text-gray-900 tabular-nums">{preset.entry.toFixed(preset.decimals)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Stop Loss ({math.stopPips} {preset.unit}):</span>
                  <span className="font-bold tabular-nums">{preset.stop.toFixed(preset.decimals)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Target 1 ({math.targetPips} {preset.unit}):</span>
                  <span className="font-bold tabular-nums">{preset.target.toFixed(preset.decimals)}</span>
                </div>
              </div>
            </div>

            {/* Right Output / Result Dashboard (LEVEL 3 Validated Output Layer) */}
            <div className="lg:col-span-7 p-6 md:p-8 bg-white flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--line-200)" }}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                      Step 2 · Validated Trade Plan Output
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900">
                      Calculated Position Parameters
                    </h3>
                  </div>
                  <div 
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-[4px] border"
                    style={{
                      backgroundColor: "var(--paper-100)",
                      borderColor: "var(--line-200)",
                      color: "var(--signal-navy)"
                    }}
                  >
                    <ShieldCheck size={12} /> Model Validated
                  </div>
                </div>

                {/* 4 Metric Cards with Level 3 Depth */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div 
                    className="p-4 border rounded-[8px] transition-all duration-200" 
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--line-200)",
                      boxShadow: "0 1px 3px rgba(11, 14, 18, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Calculated Lot Size</span>
                    <div className="font-mono text-2xl md:text-3xl font-black text-gray-900 block leading-tight">
                      <AnimatedMetric value={math.lotSize} /> <span className="text-xs font-normal text-gray-500">lots</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 mt-1 block">
                      Normalized for £{math.riskAmount} risk
                    </span>
                  </div>

                  <div 
                    className="p-4 border rounded-[8px] transition-all duration-200" 
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--line-200)",
                      boxShadow: "0 1px 3px rgba(11, 14, 18, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Reward / Risk Ratio</span>
                    <div className="font-mono text-2xl md:text-3xl font-black text-emerald-600 block leading-tight">
                      1 : <AnimatedMetric value={math.rrRatio} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 mt-1 block">
                      Potential Gain: +£<AnimatedMetric value={math.potentialProfit} />
                    </span>
                  </div>

                  <div 
                    className="p-4 border rounded-[8px] transition-all duration-200" 
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--line-200)",
                      boxShadow: "0 1px 3px rgba(11, 14, 18, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Max Drawdown Impact</span>
                    <div className="font-mono text-xl md:text-2xl font-bold text-gray-900 block leading-tight">
                      -<AnimatedMetric value={math.drawdownImpact} />%
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 mt-1 block">
                      Safe buffer on capital
                    </span>
                  </div>

                  <div 
                    className="p-4 border rounded-[8px] transition-all duration-200" 
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--line-200)",
                      boxShadow: "0 1px 3px rgba(11, 14, 18, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Discipline Score</span>
                    <span className="font-mono text-xl md:text-2xl font-bold text-emerald-600 block flex items-center gap-1.5 leading-tight">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> PASS
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 mt-1 block">
                      Pre-trade rules satisfied
                    </span>
                  </div>
                </div>

                {/* Pre-Trade Validation Checklist (Restrained Confirmation Frame) */}
                <div 
                  className="p-4 border space-y-2 rounded-[8px] transition-all duration-200" 
                  style={{ 
                    backgroundColor: "var(--paper-100)",
                    borderColor: "var(--line-200)",
                    boxShadow: "0 1px 2px rgba(11, 14, 18, 0.02)"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-600 block font-bold">
                      Pre-Trade Discipline Checklist
                    </span>
                    <span className="text-[9px] font-mono uppercase font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-[3px]">
                      Validated State
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono text-gray-700">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                      <span>Stop loss is at structural invalidation point (not arbitrary)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                      <span>R:R exceeds minimum 1 : 1.5 rule ({math.rrRatio} R:R confirmed)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                      <span>Account exposure strictly limited to {riskPercent}% max drawdown</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Row (LEVEL 4 Action Trigger) */}
              <div 
                className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" 
                style={{ borderColor: "var(--line-200)" }}
              >
                <div className="text-[11px] font-mono text-gray-500">
                  ℹ️ Decision-support infrastructure. Does not predict trade outcome.
                </div>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-all duration-150 rounded-[6px] active:translate-y-0.5"
                  style={{
                    boxShadow: "0 1px 2px rgba(11, 14, 18, 0.08), 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                  }}
                >
                  Run My Trade in Free Account <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
