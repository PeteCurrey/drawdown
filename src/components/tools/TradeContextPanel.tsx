"use client";
import { useState, useEffect, useRef } from "react";
import { Cpu, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_MAP: Record<string, { optimal: string[]; avoid: string[]; note: string }> = {
  EURUSD: { optimal: ["LONDON", "NY", "OVERLAP"], avoid: ["ASIA"], note: "Best liquidity during London and NY sessions." },
  GBPUSD: { optimal: ["LONDON", "NY", "OVERLAP"], avoid: ["ASIA"], note: "GBP pairs most active during London hours." },
  USDJPY: { optimal: ["ASIA", "LONDON", "OVERLAP"], avoid: [], note: "Active during Asian and London sessions." },
  GBPJPY: { optimal: ["LONDON", "OVERLAP"], avoid: ["ASIA"], note: "Most liquid during London open." },
  XAGUSD: { optimal: ["NY", "OVERLAP"], avoid: ["ASIA"], note: "Silver most active during NY session." },
  BTCUSDT: { optimal: ["24/7"], avoid: [], note: "Crypto trades 24/7 — no session restriction." },
  ETHUSDT: { optimal: ["24/7"], avoid: [], note: "Crypto trades 24/7 — no session restriction." },
  XRPUSDT: { optimal: ["24/7"], avoid: [], note: "Crypto trades 24/7 — no session restriction." },
  UKX: { optimal: ["LONDON"], avoid: ["NY", "ASIA"], note: "FTSE 100 is most liquid during London hours only." },
  SPX: { optimal: ["NY", "OVERLAP"], avoid: ["ASIA", "LONDON"], note: "S&P 500 active from 13:30–22:00 UTC." },
  NDX: { optimal: ["NY", "OVERLAP"], avoid: ["ASIA", "LONDON"], note: "Nasdaq most active during NY session." },
  DJI: { optimal: ["NY", "OVERLAP"], avoid: ["ASIA", "LONDON"], note: "Dow Jones active during NY hours." },
};

interface Props {
  symbol: string;
  entryPrice: string;
  stopPrice: string;
  direction: "BUY" | "SELL";
  lots: number;
  riskAmt: number;
  liveATR: number | null;
  liveSpread: number | null;
  balance: number;
  instrMult: number;
  sym: string;
}

export function TradeContextPanel({
  symbol, entryPrice, stopPrice, direction, lots, riskAmt,
  liveATR, liveSpread, balance, instrMult, sym,
}: Props) {
  const [panelATR, setPanelATR] = useState<number | null>(liveATR);
  const [events, setEvents] = useState<any[]>([]);
  const [aiAssessment, setAiAssessment] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const atrCacheRef = useRef<Map<string, number>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Update panelATR when prop changes
  useEffect(() => { if (liveATR) setPanelATR(liveATR); }, [liveATR]);

  // Debounce symbol changes — fetch ATR if not cached
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!symbol) return;
    debounceRef.current = setTimeout(async () => {
      if (atrCacheRef.current.has(symbol)) {
        setPanelATR(atrCacheRef.current.get(symbol)!);
        return;
      }
      const k = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
      if (!k) return;
      try {
        const r = await fetch(`https://api.twelvedata.com/atr?symbol=${symbol}&interval=1day&time_period=14&outputsize=1&apikey=${k}`);
        const d = await r.json();
        const val = d?.values?.[0]?.atr ? parseFloat(d.values[0].atr) : null;
        if (val) { setPanelATR(val); atrCacheRef.current.set(symbol, val); }
      } catch {}
    }, 800);
  }, [symbol]);

  // Fetch calendar events
  useEffect(() => {
    if (!symbol) return;
    fetch(`/api/calendar/${symbol}`)
      .then(r => r.json())
      .then(d => setEvents(d.events ?? []))
      .catch(() => {});
  }, [symbol]);

  // Calculations
  const entry = parseFloat(entryPrice) || 0;
  const stop = parseFloat(stopPrice) || 0;
  const stopPips = Math.abs(entry - stop) * instrMult;
  const atrPips = panelATR ? panelATR * instrMult : null;
  const atrRatio = atrPips && stopPips > 0 ? stopPips / atrPips : null;
  const spreadPips = liveSpread ? liveSpread * instrMult : null;
  const spreadCostEstimate = spreadPips && stopPips > 0 && riskAmt > 0 ? (spreadPips / stopPips) * riskAmt : null;
  const spreadPctOfRisk = spreadCostEstimate && riskAmt > 0 ? (spreadCostEstimate / riskAmt) * 100 : null;

  // Session detection
  const hourUTC = new Date().getUTCHours();
  const currentSession =
    hourUTC >= 22 || hourUTC < 7 ? "ASIA" :
    hourUTC < 12 ? "LONDON" :
    hourUTC < 17 ? "OVERLAP" :
    hourUTC < 22 ? "NY" : "ASIA";
  const sessionInfo = SESSION_MAP[symbol] ?? { optimal: [], avoid: [], note: "Monitor liquidity for this instrument." };
  const isOptimalSession = sessionInfo.optimal.includes(currentSession) || sessionInfo.optimal.includes("24/7");
  const isAvoidSession = sessionInfo.avoid.includes(currentSession);

  // News urgency
  const highImpactEvents = events.filter(e => e.impact === "high");
  const nextHighImpact = highImpactEvents[0];
  const minsToNextHigh = nextHighImpact?.time ? (() => {
    const parts = nextHighImpact.time.split(":");
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || "0", 10);
    const evt = new Date();
    evt.setUTCHours(h, m, 0, 0);
    if (evt < new Date()) evt.setUTCDate(evt.getUTCDate() + 1);
    return Math.round((evt.getTime() - Date.now()) / 60000);
  })() : null;
  const newsUrgent = minsToNextHigh !== null && minsToNextHigh < 120;

  async function handleAIAssess() {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/intelligence/trade-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol, direction, entry, stop, lots, riskAmount: riskAmt,
          atr: panelATR, spread: liveSpread, session: currentSession,
          newsEvents: events, balance,
        }),
      });
      const d = await res.json();
      setAiAssessment(d.assessment ?? d.error ?? "No assessment returned.");
    } catch (e: any) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  }

  // ATR ratio colour
  const atrColour = !atrRatio ? "text-text-tertiary" :
    atrRatio < 0.5 ? "text-red-400" :
    atrRatio < 1 ? "text-amber-400" :
    atrRatio < 1.5 ? "text-emerald-400" : "text-blue-400";
  const atrLabel = !atrRatio ? "—" :
    atrRatio < 0.5 ? "TOO TIGHT" :
    atrRatio < 1 ? "REASONABLE" :
    atrRatio < 1.5 ? "WELL-PLACED" : "WIDE STOP";
  const atrMessage = !atrRatio ? "Enter entry and stop prices to assess." :
    atrRatio < 0.5 ? "Stop too tight — high chance of being stopped out by normal noise." :
    atrRatio < 1 ? "Reasonable stop for this volatility." :
    atrRatio < 1.5 ? "Well-placed stop with room to breathe." :
    "Wide stop — reduces position size significantly but reduces noise-out risk.";

  return (
    <div className="bg-background-surface border border-border-slate/50 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-slate/30 bg-background-elevated/30">
        <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-accent">// TRADE CONTEXT</h3>
        <p className="text-[9px] font-mono text-text-tertiary mt-0.5">Should you take this trade right now?</p>
      </div>

      <div className="p-4 space-y-5">
        {/* A: Volatility */}
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2 border-b border-border-slate/20 pb-1">A · Volatility</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-2">
            <div>
              <span className="text-text-tertiary">ATR(14) Daily</span>
              <p className="font-bold text-text-primary">{atrPips ? atrPips.toFixed(1) + " pips" : "—"}</p>
            </div>
            <div>
              <span className="text-text-tertiary">Your Stop</span>
              <p className="font-bold text-text-primary">{stopPips > 0 ? stopPips.toFixed(1) + " pips" : "—"}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-text-tertiary">Stop vs ATR</span>
            <span className={cn("text-[10px] font-mono font-bold", atrColour)}>{atrRatio ? atrRatio.toFixed(2) + "× ATR" : "—"}</span>
          </div>
          {atrRatio !== null && (
            <div className="h-1.5 bg-background-elevated rounded-full overflow-hidden mb-1">
              <div
                className={cn("h-full rounded-full transition-all",
                  atrRatio < 0.5 ? "bg-red-400" : atrRatio < 1 ? "bg-amber-400" : atrRatio < 1.5 ? "bg-emerald-400" : "bg-blue-400"
                )}
                style={{ width: `${Math.min(100, (atrRatio / 2) * 100)}%` }}
              />
            </div>
          )}
          <p className={cn("text-[9px] font-mono font-bold mt-1", atrColour)}>{atrLabel}</p>
          <p className="text-[8px] font-mono text-text-tertiary/80 leading-snug">{atrMessage}</p>
        </div>

        {/* B: Spread Cost */}
        {spreadPips !== null && (
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2 border-b border-border-slate/20 pb-1">B · Spread Cost</p>
            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Current Spread</span>
                <span className="font-bold text-text-primary">{spreadPips.toFixed(1)} pips</span>
              </div>
              {spreadCostEstimate !== null && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Cost in {sym}</span>
                  <span className="font-bold text-text-primary">{sym}{spreadCostEstimate.toFixed(2)}</span>
                </div>
              )}
              {spreadPctOfRisk !== null && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">% of Risk Budget</span>
                  <span className={cn("font-bold",
                    spreadPctOfRisk > 25 ? "text-red-400" : spreadPctOfRisk > 10 ? "text-amber-400" : "text-emerald-400"
                  )}>{spreadPctOfRisk.toFixed(1)}%</span>
                </div>
              )}
              {spreadPctOfRisk !== null && spreadPctOfRisk > 10 && (
                <div className={cn("text-[8px] font-mono p-2 rounded border leading-snug",
                  spreadPctOfRisk > 25 ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"
                )}>
                  {spreadPctOfRisk > 25
                    ? "🔴 Spread cost is very high relative to risk — this trade is expensive to enter."
                    : "⚠️ High spread cost. Consider widening stop or waiting for tighter spread."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* C: Session */}
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2 border-b border-border-slate/20 pb-1">C · Session</p>
          <div className="flex items-center gap-2 mb-1.5">
            <div className={cn("w-2 h-2 rounded-full",
              isAvoidSession ? "bg-amber-400" : isOptimalSession ? "bg-emerald-400" : "bg-text-tertiary/40"
            )} />
            <span className="text-[10px] font-mono font-bold text-text-primary">{currentSession} SESSION</span>
          </div>
          <p className="text-[9px] font-mono text-text-tertiary leading-snug">{sessionInfo.note}</p>
          {isAvoidSession && (
            <p className="text-[9px] font-mono text-amber-500 mt-1">⚠️ This instrument typically has low liquidity during {currentSession} session.</p>
          )}
          {isOptimalSession && !isAvoidSession && (
            <p className="text-[9px] font-mono text-emerald-500 mt-1">✅ Optimal session for this instrument.</p>
          )}
        </div>

        {/* D: News */}
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2 border-b border-border-slate/20 pb-1">D · Upcoming News</p>
          {newsUrgent && minsToNextHigh !== null && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2 text-[9px] font-mono text-red-700">
              ⚠️ HIGH-IMPACT NEWS IN {minsToNextHigh < 60 ? `${minsToNextHigh}m` : `${Math.floor(minsToNextHigh / 60)}h ${minsToNextHigh % 60}m`}. Many prop firms prohibit trading through major news.
            </div>
          )}
          {events.length === 0 ? (
            <p className="text-[9px] font-mono text-emerald-500">✅ No high-impact events in next 4 hours. Clear window for entry.</p>
          ) : (
            <div className="space-y-1.5">
              {events.slice(0, 2).map((e, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1",
                    e.impact === "high" ? "bg-red-400 animate-pulse" : e.impact === "medium" ? "bg-amber-400" : "bg-border-slate/60"
                  )} />
                  <div>
                    <p className="text-[9px] font-mono font-bold text-text-primary">{e.event}</p>
                    <p className="text-[8px] font-mono text-text-tertiary">{e.time} UTC · {e.country} · {e.impact?.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* E: AI Assessment */}
        <div className="border-t border-border-slate/20 pt-4">
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">E · AI Risk View</p>
          {!aiAssessment ? (
            <button
              onClick={handleAIAssess}
              disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-background-elevated/50 border border-border-slate/50 rounded-lg text-[9px] font-mono uppercase text-text-secondary hover:border-accent hover:text-accent transition-all disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5" />
              {aiLoading ? "Analysing…" : "Get AI View on This Trade"}
            </button>
          ) : (
            <div className="bg-background-elevated/30 border border-border-slate/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-accent flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> AI RISK ASSESSMENT
                </span>
                <button onClick={() => setAiAssessment(null)} className="text-text-tertiary hover:text-text-primary">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[10px] font-mono text-text-secondary leading-relaxed">&ldquo;{aiAssessment}&rdquo;</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[7px] font-mono text-text-tertiary/60 uppercase tracking-widest">NOT FINANCIAL ADVICE · AI GENERATED</span>
                <button
                  onClick={handleAIAssess}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-[8px] font-mono text-accent hover:text-accent/70 transition-colors"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Re-assess
                </button>
              </div>
            </div>
          )}
          {aiError && <p className="text-[9px] font-mono text-red-400 mt-1">{aiError}</p>}
        </div>
      </div>
    </div>
  );
}
