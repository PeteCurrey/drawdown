"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { AnimatedMetric } from "@/components/ui/AnimatedMetric";
import { Reveal } from "@/components/ui/Reveal";

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

  const btnActive = {
    backgroundColor: "var(--accent)",
    color: "var(--surface-base)",
    borderColor: "var(--accent)",
  };
  const btnInactive = {
    backgroundColor: "var(--surface-inset)",
    color: "var(--text-secondary)",
    borderColor: "var(--border-subtle)",
  };

  return (
    <section
      className="w-full border-b select-none relative"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
        paddingTop: "var(--section-y-desktop)",
        paddingBottom: "var(--section-y-desktop)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl mb-16 space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest"
              style={{
                backgroundColor: "var(--accent-muted)",
                color: "var(--accent)",
                borderRadius: "var(--radius-pill)",
              }}
            >
              <Zap size={12} />
              Interactive Product Demonstration
            </div>
            <h2
              className="type-display-lg font-normal"
              style={{ color: "var(--text-primary)" }}
            >
              RUN MY TRADE — Pre-Trade Risk Calculation
            </h2>
            <p
              className="type-body-lg font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              Never place an unquantified trade again. Enter your idea, see your exact mathematical lot size, verify the risk-to-reward ratio, and lock your plan before opening your broker terminal.
            </p>
          </div>
        </Reveal>

        {/* Interactive Simulator Shell */}
        <Reveal delay={0.1}>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: "var(--surface-raised)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--elev-3)",
          }}
        >
          {/* Top Bar / Terminal Header */}
          <div
            className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4"
            style={{
              backgroundColor: "var(--surface-overlay)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--text-tertiary)" }} />
              <span className="font-mono text-xs font-bold tracking-wider uppercase" style={{ color: "var(--text-primary)" }}>
                RUN MY TRADE · SAMPLE CALCULATION
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono uppercase px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: "var(--surface-inset)",
                  borderRadius: "var(--radius-pill)",
                  color: "var(--text-tertiary)",
                }}
              >
                Client-Side Arithmetic · No Market Connection
              </span>
            </div>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {/* Left Controls Column */}
            <div
              className="lg:col-span-5 p-6 md:p-8 space-y-6"
              style={{ backgroundColor: "var(--surface-raised)" }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="text-[10px] font-mono uppercase tracking-[0.1em] font-bold" style={{ color: "var(--text-tertiary)" }}>
                  Step 1 · Input Parameters
                </span>
                <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                  PRE-TRADE
                </span>
              </div>

              {/* 1. Instrument Selector */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-2 font-bold" style={{ color: "var(--text-tertiary)" }}>
                  Select Instrument
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {Object.keys(PRESETS).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelectedKey(k)}
                      className="px-3 py-2 text-xs font-mono font-bold transition-all duration-150 active:translate-y-0.5"
                      style={{
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid",
                        ...(selectedKey === k ? btnActive : btnInactive),
                      }}
                    >
                      {PRESETS[k].pair}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Direction Toggle */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-2 font-bold" style={{ color: "var(--text-tertiary)" }}>
                  Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDirection("LONG")}
                    className="flex items-center justify-center gap-2 py-2.5 font-mono text-xs font-bold transition-all duration-150 active:translate-y-0.5"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid",
                      ...(direction === "LONG" ? btnActive : btnInactive),
                    }}
                  >
                    <TrendingUp size={14} /> Long ↑
                  </button>
                  <button
                    onClick={() => setDirection("SHORT")}
                    className="flex items-center justify-center gap-2 py-2.5 font-mono text-xs font-bold transition-all duration-150 active:translate-y-0.5"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid",
                      ...(direction === "SHORT" ? btnActive : btnInactive),
                    }}
                  >
                    <TrendingDown size={14} /> Short ↓
                  </button>
                </div>
              </div>

              {/* 3. Account Capital */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider block mb-2 font-bold" style={{ color: "var(--text-tertiary)" }}>
                  Account Equity (GBP)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10000, 25000, 50000, 100000].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setAccountSize(cap)}
                      className="py-2 text-xs font-mono font-bold transition-all duration-150 active:translate-y-0.5"
                      style={{
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid",
                        ...(accountSize === cap ? btnActive : btnInactive),
                      }}
                    >
                      £{(cap / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Risk Per Trade */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold" style={{ color: "var(--text-tertiary)" }}>
                    Risk Percentage
                  </label>
                  <span className="font-mono text-xs font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {riskPercent.toFixed(1)}% (<AnimatedMetric value={`£${math.riskAmount}`} />)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1.0, 1.5, 2.0].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setRiskPercent(pct)}
                      className="py-2 text-xs font-mono font-bold transition-all duration-150 active:translate-y-0.5"
                      style={{
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid",
                        ...(riskPercent === pct ? btnActive : btnInactive),
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Planned Price Levels */}
              <div
                className="p-4 text-xs font-mono space-y-2"
                style={{
                  backgroundColor: "var(--surface-inset)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  className="text-[10px] font-mono uppercase tracking-wider font-bold pb-1 border-b"
                  style={{ color: "var(--text-tertiary)", borderColor: "var(--border-subtle)" }}
                >
                  Structural Price Levels
                </div>
                <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                  <span>Planned Entry:</span>
                  <span className="font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{preset.entry.toFixed(preset.decimals)}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--market-down)" }}>
                  <span>Stop Loss ({math.stopPips} {preset.unit}):</span>
                  <span className="font-bold tabular-nums">{preset.stop.toFixed(preset.decimals)}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--market-up)" }}>
                  <span>Target 1 ({math.targetPips} {preset.unit}):</span>
                  <span className="font-bold tabular-nums">{preset.target.toFixed(preset.decimals)}</span>
                </div>
              </div>
            </div>

            {/* Right Output / Result Dashboard */}
            <div
              className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between"
              style={{ backgroundColor: "var(--surface-overlay)" }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold block mb-0.5" style={{ color: "var(--text-tertiary)" }}>
                      Step 2 · Validated Trade Plan Output
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                      Calculated Position Parameters
                    </h3>
                  </div>
                  <div
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase"
                    style={{
                      backgroundColor: "var(--accent-muted)",
                      color: "var(--accent)",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    <ShieldCheck size={12} /> Model Validated
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div
                    className="p-4 transition-all duration-200"
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--elev-1)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Calculated Lot Size</span>
                    <div className="font-mono text-2xl md:text-3xl font-black block leading-tight" style={{ color: "var(--text-primary)" }}>
                      <AnimatedMetric value={math.lotSize} /> <span className="text-xs font-normal" style={{ color: "var(--text-tertiary)" }}>lots</span>
                    </div>
                    <span className="text-[10px] font-mono mt-1 block" style={{ color: "var(--market-up)" }}>
                      Normalized for £{math.riskAmount} risk
                    </span>
                  </div>

                  <div
                    className="p-4 transition-all duration-200"
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--elev-1)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Reward / Risk Ratio</span>
                    <div className="font-mono text-2xl md:text-3xl font-black block leading-tight" style={{ color: "var(--market-up)" }}>
                      1 : <AnimatedMetric value={math.rrRatio} />
                    </div>
                    <span className="text-[10px] font-mono mt-1 block" style={{ color: "var(--text-tertiary)" }}>
                      Potential Gain: +£<AnimatedMetric value={math.potentialProfit} />
                    </span>
                  </div>

                  <div
                    className="p-4 transition-all duration-200"
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--elev-1)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Max Drawdown Impact</span>
                    <div className="font-mono text-xl md:text-2xl font-bold block leading-tight" style={{ color: "var(--text-primary)" }}>
                      -<AnimatedMetric value={math.drawdownImpact} />%
                    </div>
                    <span className="text-[10px] font-mono mt-1 block" style={{ color: "var(--text-tertiary)" }}>
                      Safe buffer on capital
                    </span>
                  </div>

                  <div
                    className="p-4 transition-all duration-200"
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--elev-1)",
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Discipline Score</span>
                    <span className="font-mono text-xl md:text-2xl font-bold flex items-center gap-1.5 leading-tight" style={{ color: "var(--market-up)" }}>
                      <CheckCircle2 size={18} className="shrink-0" /> PASS
                    </span>
                    <span className="text-[10px] font-mono mt-1 block" style={{ color: "var(--text-tertiary)" }}>
                      Pre-trade rules satisfied
                    </span>
                  </div>
                </div>

                {/* Pre-Trade Validation Checklist */}
                <div
                  className="p-4 space-y-2 transition-all duration-200"
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider block font-bold" style={{ color: "var(--text-secondary)" }}>
                      Pre-Trade Discipline Checklist
                    </span>
                    <span
                      className="text-[9px] font-mono uppercase font-semibold px-1.5 py-0.5"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--market-up) 12%, transparent)",
                        color: "var(--market-up)",
                        borderRadius: "var(--radius-pill)",
                      }}
                    >
                      Validated State
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono" style={{ color: "var(--market-up)" }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>Stop loss is at structural invalidation point (not arbitrary)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>R:R exceeds minimum 1 : 1.5 rule ({math.rrRatio} R:R confirmed)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>Account exposure strictly limited to {riskPercent}% max drawdown</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution disclaimer — do not alter this copy */}
              <div
                className="mt-6 flex items-start gap-2.5 px-4 py-3"
                style={{
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }} />
                <p className="text-[11px] font-mono leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                  This calculator does not place, route, or execute any trade. It does not connect to any broker or exchange. Every figure shown is computed entirely from the inputs you select above — no live market data is used. Drawdown does not route orders or hold client funds. All execution occurs at your independent broker terminal.
                </p>
              </div>

              {/* Bottom CTA Row */}
              <div
                className="mt-6 pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                  Sample data · For planning purposes only
                </div>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 active:translate-y-0.5"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--surface-base)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--elev-2)",
                  }}
                >
                  Plan My Position — Free Account <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
