"use client";

import { useState, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import type { OutputLanguage, HealthCheckResult } from "@/types/algo-builder";

const C = "var(--tool-accent)";

const TD_INTERVAL: Record<string, string> = {
  "1m": "1min", "5m": "5min", "15m": "15min", "1H": "1h",
  "4H": "4h", "D": "1day", "W": "1week",
};

// Symbol mapping for Twelve Data
function tdSymbol(slug: string): string {
  const MAP: Record<string, string> = {
    GBPUSD: "GBP/USD", EURUSD: "EUR/USD", USDJPY: "USD/JPY",
    GBPJPY: "GBP/JPY", XAGUSD: "XAG/USD", NAS100: "QQQ",
    SPX500: "SPX500", US30: "DJI", BTCUSD: "BTC/USD",
    ETHUSD: "ETH/USD",
  };
  return MAP[slug] ?? slug.replace(/(\w{3})(\w{3})/, "$1/$2");
}

// ─── Client-side signal simulation ───────────────────────────────────────────

function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

function calculateRSI(prices: number[], period = 14): number[] {
  const rsi: number[] = new Array(period).fill(50);
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const d = prices[i] - prices[i - 1];
    if (d > 0) avgGain += d; else avgLoss -= d;
  }
  avgGain /= period;
  avgLoss /= period;
  for (let i = period; i < prices.length - 1; i++) {
    const d = prices[i + 1] - prices[i];
    avgGain = (avgGain * (period - 1) + (d > 0 ? d : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (d < 0 ? -d : 0)) / period;
    rsi.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }
  return rsi;
}

// Parse EMA/SMA/RSI periods from code (simple regex scan)
function parseCodeParams(code: string): { emaFast: number; emaSlow: number; rsiPeriod: number } {
  const ema = (code.match(/(?:ta\.ema|ema\(|EMA\()[\w\s,]*?(\d+)/g) ?? [])
    .map(m => parseInt(m.match(/(\d+)/)![1]))
    .filter(n => n >= 5 && n <= 300)
    .sort((a, b) => a - b);
  const rsiMatch = code.match(/(?:ta\.rsi|rsi\(|RSI\()[\w\s,]*?(\d+)/);
  return {
    emaFast:   ema[0] ?? 20,
    emaSlow:   ema[1] ?? 50,
    rsiPeriod: rsiMatch ? parseInt(rsiMatch[1]) : 14,
  };
}

function simulateSignals(
  closes: number[],
  params: { emaFast: number; emaSlow: number; rsiPeriod: number }
): HealthCheckResult {
  const { emaFast, emaSlow, rsiPeriod } = params;
  const fast = calculateEMA(closes, emaFast);
  const slow = calculateEMA(closes, emaSlow);
  const rsi  = calculateRSI(closes, rsiPeriod);

  const INITIAL = 10_000;
  let equity = INITIAL;
  let inTrade = false;
  let entryPrice = 0;
  let peak = INITIAL;
  let maxDD = 0;
  let wins = 0, losses = 0, grossProfit = 0, grossLoss = 0;
  const curve: { date: string; value: number }[] = [];

  for (let i = emaSlow + 1; i < closes.length - 1; i++) {
    const price = closes[i];
    const crossUp   = fast[i] > slow[i] && fast[i - 1] <= slow[i - 1];
    const crossDown = fast[i] < slow[i] && fast[i - 1] >= slow[i - 1];

    if (!inTrade && crossUp && rsi[i] < 60) {
      inTrade = true;
      entryPrice = price;
    } else if (inTrade && (crossDown || rsi[i] > 75)) {
      const pnlPct = (price - entryPrice) / entryPrice;
      const pnl = equity * 0.01 * (pnlPct / 0.01) * 2; // simplified
      equity += pnl;
      if (pnl > 0) { wins++; grossProfit += pnl; }
      else         { losses++; grossLoss  -= pnl; }
      if (equity > peak) peak = equity;
      const dd = (peak - equity) / peak * 100;
      if (dd > maxDD) maxDD = dd;
      inTrade = false;
    }

    // Record every N bars for chart readability
    if (i % 10 === 0) {
      curve.push({ date: `Bar ${i}`, value: Math.round(equity * 100) / 100 });
    }
  }

  const total = wins + losses;
  return {
    trades:       total,
    winRate:      total > 0 ? Math.round((wins / total) * 100) : 0,
    maxDrawdown:  Math.round(maxDD * 10) / 10,
    profitFactor: grossLoss > 0 ? Math.round((grossProfit / grossLoss) * 100) / 100 : 0,
    equityCurve:  curve,
  };
}

// ─── Metric card ─────────────────────────────────────────────────────────────

function MetricCard({
  label, value, suffix = "", green, amber,
}: { label: string; value: number | string; suffix?: string; green: boolean; amber: boolean }) {
  const color = green ? "#16a34a" : amber ? "#d97706" : "#dc2626"; // AA compliant colors on white/light-grey
  return (
    <div
      className="flex flex-col items-center justify-center p-4 text-center rounded-lg"
      style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
    >
      <span className="text-2xl font-display font-bold" style={{ color }}>
        {value}{suffix}
      </span>
      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

// ─── Main HealthCheck ─────────────────────────────────────────────────────────

interface HealthCheckProps {
  generatedCode: string;
  instrument:    string;
  timeframe:     string;
  language:      OutputLanguage;
  show:          boolean;
  onToggle:      () => void;
}

export function HealthCheck({
  generatedCode, instrument, timeframe, language, show, onToggle,
}: HealthCheckProps) {
  const [result, setResult]     = useState<HealthCheckResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [phase, setPhase]       = useState("");
  const [error, setError]       = useState<string | null>(null);

  const runHealthCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: fetch price data
      setPhase(`Fetching 500 bars from Twelve Data for ${instrument}…`);
      const sym      = encodeURIComponent(tdSymbol(instrument));
      const interval = TD_INTERVAL[timeframe] ?? "1h";
      const key      = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";

      if (!key) throw new Error("Twelve Data key not configured.");

      const res = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${sym}&interval=${interval}&outputsize=500&apikey=${key}`
      );
      const json = await res.json();

      if (json.status === "error" || !json.values?.length) {
        throw new Error(json.message ?? "Could not fetch price data. Check instrument symbol.");
      }

      const closes: number[] = [...json.values]
        .reverse()
        .map((v: any) => parseFloat(v.close))
        .filter(Boolean);

      if (closes.length < 60) throw new Error("Not enough price history for simulation.");

      // Step 2: simulate
      setPhase("Running signal simulation…");
      await new Promise(r => setTimeout(r, 100)); // yield to UI
      const params = parseCodeParams(generatedCode);
      const sim    = simulateSignals(closes, params);

      setResult(sim);
      if (!show) onToggle(); // open panel if not already open
    } catch (e: any) {
      if (e.message?.includes("429") || e.message?.includes("rate")) {
        setError("Market data limit reached — try again in 60 seconds.");
      } else {
        setError(e.message ?? "Health check failed.");
      }
    } finally {
      setLoading(false);
      setPhase("");
    }
  }, [generatedCode, instrument, timeframe, show, onToggle]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "#ffffff", borderBottom: show ? "1px solid #e5e7eb" : "none" }}
      >
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-900">
            Strategy Health Check
          </p>
          <p className="text-[9px] font-mono text-gray-400 mt-0.5">
            Simplified signal simulation on real price history
          </p>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <button
              onClick={onToggle}
              className="text-[9px] font-mono text-gray-400 hover:text-gray-500 transition-colors uppercase tracking-wider"
            >
              {show ? "Hide" : "Show"} results
            </button>
          )}
          <button
            onClick={runHealthCheck}
            disabled={loading}
            className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-white disabled:opacity-50 rounded-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: C }}
          >
            {loading ? "Running…" : result ? "Re-run" : "Run Health Check"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="px-4 py-6 flex flex-col items-center gap-3 bg-white">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: C, animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-[11px] font-mono text-gray-500">{phase}</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="px-4 py-4 bg-white">
          <p className="text-xs font-mono text-red-500">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && show && !loading && (
        <div className="space-y-4 p-4 bg-white">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="Simulated Trades"
              value={result.trades}
              suffix=" trades"
              green={result.trades > 20}
              amber={result.trades >= 10}
            />
            <MetricCard
              label="Win Rate"
              value={result.winRate}
              suffix="%"
              green={result.winRate > 50}
              amber={result.winRate >= 40}
            />
            <MetricCard
              label="Max Drawdown"
              value={result.maxDrawdown}
              suffix="%"
              green={result.maxDrawdown < 10}
              amber={result.maxDrawdown < 25}
            />
            <MetricCard
              label="Profit Factor"
              value={result.profitFactor}
              suffix="×"
              green={result.profitFactor > 1.5}
              amber={result.profitFactor >= 1.0}
            />
          </div>

          {/* Equity curve */}
          {result.equityCurve.length > 3 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <p className="px-4 pt-3 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                Simulated Equity Curve — Starting £10,000
              </p>
              <div className="h-48 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" hide />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fontSize: 9, fill: "#6b7280", fontFamily: "monospace" }}
                      tickFormatter={(v: number) => `£${(v / 1000).toFixed(1)}k`}
                      width={48}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }}
                      labelStyle={{ color: "#6b7280", fontSize: 10 }}
                      formatter={(v: any) => [`£${Number(v).toLocaleString()}`, "Portfolio"]}
                    />
                    <ReferenceLine y={10_000} stroke="#d1d5db" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={C}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div
            className="px-4 py-3 border-l-4 rounded-r-lg"
            style={{ borderLeftColor: C, backgroundColor: `${C}0d` }}
          >
            <p className="text-[10px] font-mono text-gray-600 leading-relaxed flex gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: C }} />
              This is a simplified signal simulation for illustrative purposes only. It does not
              account for slippage, spread, overnight swap, or real execution conditions. Always
              conduct rigorous backtesting in TradingView Strategy Tester or Backtrader before
              trading live. Past simulated performance does not guarantee future results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
