"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, ComposedChart, Area,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid,
} from "recharts";
import { TrendingUp, BarChart3, Cpu, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary border-b border-border-slate/30 pb-2 flex items-center gap-1.5">{children}</h4>;
}

function StatCard({ label, value, sub, cls }: { label: string; value: string; sub?: string; cls?: string }) {
  return (
    <div className="bg-background-primary border border-border-slate/40 rounded-lg p-3 text-center">
      <p className="text-[8px] font-mono text-text-tertiary uppercase mb-1">{label}</p>
      <p className={cn("text-lg font-bold font-mono", cls ?? "text-text-primary")}>{value}</p>
      {sub && <p className="text-[8px] font-mono text-text-tertiary">{sub}</p>}
    </div>
  );
}

function mapSession(dateStr: string): string {
  const d = new Date(dateStr);
  const h = d.getUTCHours();
  if (h < 7) return "Asian";
  if (h < 12) return "London";
  if (h < 17) return "Overlap";
  if (h < 22) return "New York";
  return "Asian";
}

interface PerformanceTabProps {
  balance: number;
  sym: string;
  currency: string;
}

export function PerformanceTab({ balance, sym, currency }: PerformanceTabProps) {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiScore, setAiScore] = useState<{ score: number; label: string; observations: string[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/journal/entries?user_id=${user.id}&limit=50`)
      .then(r => r.json())
      .then(d => { setTrades(d.entries ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  // ─── Core stats ──────────────────────────────────────────────────────────────
  const total = trades.length;
  const wins = trades.filter(t => (t.pnl_amount ?? 0) > 0).length;
  const losses = trades.filter(t => (t.pnl_amount ?? 0) < 0).length;
  const winRate = total > 0 ? (wins / total) * 100 : 0;
  const totalWins = trades.filter(t => (t.pnl_amount ?? 0) > 0).reduce((s, t) => s + t.pnl_amount, 0);
  const totalLosses = trades.filter(t => (t.pnl_amount ?? 0) < 0).reduce((s, t) => s + t.pnl_amount, 0);
  const avgWin = wins > 0 ? totalWins / wins : 0;
  const avgLoss = losses > 0 ? Math.abs(totalLosses / losses) : 0;
  const expectancy = total > 0 ? (wins / total * avgWin) - (losses / total * avgLoss) : 0;
  const profitFactor = totalLosses !== 0 ? Math.abs(totalWins / totalLosses) : 0;
  const largestWin = Math.max(0, ...trades.map(t => t.pnl_amount ?? 0));
  const largestLoss = Math.min(0, ...trades.map(t => t.pnl_amount ?? 0));
  const avgRisk = total > 0 ? trades.reduce((s, t) => s + Math.abs(t.pnl_amount ?? 0), 0) / total : 0;

  // Instrument P&L breakdown
  const instrumentMap: Record<string, { pnl: number; count: number }> = {};
  trades.forEach(t => {
    const sym_t = t.symbol ?? t.instrument ?? "Unknown";
    if (!instrumentMap[sym_t]) instrumentMap[sym_t] = { pnl: 0, count: 0 };
    instrumentMap[sym_t].pnl += t.pnl_amount ?? 0;
    instrumentMap[sym_t].count++;
  });
  const instrumentData = Object.entries(instrumentMap)
    .map(([name, { pnl, count }]) => ({ name, pnl: parseFloat(pnl.toFixed(2)), count }))
    .sort((a, b) => b.pnl - a.pnl);
  const worstInstrument = instrumentData[instrumentData.length - 1];

  // Session performance
  const sessionMap: Record<string, { pnl: number; count: number }> = {};
  trades.forEach(t => {
    const session = mapSession(t.date ?? t.created_at ?? new Date().toISOString());
    if (!sessionMap[session]) sessionMap[session] = { pnl: 0, count: 0 };
    sessionMap[session].pnl += t.pnl_amount ?? 0;
    sessionMap[session].count++;
  });
  const sessionData = ["Asian", "London", "Overlap", "New York"].map(name => ({
    name, pnl: parseFloat((sessionMap[name]?.pnl ?? 0).toFixed(2)), count: sessionMap[name]?.count ?? 0,
  }));
  const bestSession = sessionData.reduce((a, b) => a.pnl > b.pnl ? a : b, sessionData[0]);

  // Equity curve
  const sorted = [...trades].sort((a, b) => new Date(a.date ?? a.created_at ?? "").getTime() - new Date(b.date ?? b.created_at ?? "").getTime());
  let runningBal = balance;
  let peak = balance;
  const equityData = [{ trade: 0, balance: runningBal, drawdown: 0 }];
  sorted.forEach((t, i) => {
    runningBal += t.pnl_amount ?? 0;
    if (runningBal > peak) peak = runningBal;
    const dd = peak > 0 ? ((peak - runningBal) / peak) * 100 : 0;
    equityData.push({ trade: i + 1, balance: parseFloat(runningBal.toFixed(2)), drawdown: parseFloat(dd.toFixed(2)) });
  });

  async function handleDisciplineScore() {
    if (!user) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/intelligence/discipline-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trades, userId: user.id }),
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setAiScore(d);
    } catch (e: any) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  }

  // SVG gauge for discipline score
  function ScoreGauge({ score }: { score: number }) {
    const r = 40, cx = 50, cy = 50, sw = 10;
    const C = 2 * Math.PI * r, half = C / 2;
    const fill = (score / 100) * half;
    const color = score < 40 ? "#ef4444" : score < 60 ? "#f59e0b" : score < 80 ? "#3b82f6" : "#22c55e";
    return (
      <svg viewBox="0 0 100 60" className="w-32">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={sw}
          strokeDasharray={`${half} ${C}`} strokeLinecap="round" transform={`rotate(180 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${fill} ${C}`} strokeLinecap="round" transform={`rotate(180 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="900" fill={color} fontFamily="monospace">{score}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill={color} fontFamily="monospace" fontWeight="bold">/100</text>
      </svg>
    );
  }

  if (loading) {
    return <div className="text-center py-12 text-text-tertiary font-mono text-sm">Loading trade history…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Trade Log + Stats */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <SectionHeader><BarChart3 className="w-3.5 h-3.5" /> Performance Overview</SectionHeader>
        {total === 0 ? (
          <div className="text-center py-8 text-text-tertiary font-mono text-sm">
            No trades logged yet. Save calculations to your journal to see analytics.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <StatCard label="Total Trades" value={total.toString()} />
              <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} cls={winRate >= 50 ? "text-emerald-600" : "text-amber-500"} />
              <StatCard label="Profit Factor" value={profitFactor > 0 ? profitFactor.toFixed(2) : "—"} cls={profitFactor >= 1.5 ? "text-emerald-600" : profitFactor >= 1 ? "text-amber-500" : "text-red-500"} />
              <StatCard label="Expectancy" value={`${expectancy >= 0 ? "+" : ""}${sym}${expectancy.toFixed(2)}`} sub="per trade" cls={expectancy >= 0 ? "text-emerald-600" : "text-red-500"} />
              <StatCard label="Avg Risk" value={`${sym}${avgRisk.toFixed(0)}`} />
              <StatCard label="Largest Win" value={`${sym}${largestWin.toFixed(0)}`} cls="text-emerald-600" />
              <StatCard label="Largest Loss" value={`${sym}${Math.abs(largestLoss).toFixed(0)}`} cls="text-red-500" />
              <StatCard label="Total P&L" value={`${totalWins + totalLosses >= 0 ? "+" : ""}${sym}${(totalWins + totalLosses).toFixed(0)}`} cls={totalWins + totalLosses >= 0 ? "text-emerald-600" : "text-red-500"} />
            </div>

            {/* Trade table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-border-slate/30 text-text-tertiary uppercase text-[9px]">
                    {["Date", "Symbol", "Dir", "Entry", "Stop", "Risk", "P&L", "RR"].map(h => (
                      <th key={h} className="py-2 text-left font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/10">
                  {trades.slice(0, 20).map((t, i) => {
                    const pnl = t.pnl_amount ?? 0;
                    return (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="py-1.5 text-text-tertiary">{(t.date ?? t.created_at ?? "").slice(0, 10)}</td>
                        <td className="py-1.5 font-bold text-text-primary">{t.symbol ?? t.instrument}</td>
                        <td className={cn("py-1.5 font-bold", t.type === "BUY" ? "text-emerald-600" : "text-red-500")}>{t.type}</td>
                        <td className="py-1.5 text-text-secondary">{t.entry_price}</td>
                        <td className="py-1.5 text-text-secondary">{t.exit_price}</td>
                        <td className="py-1.5 text-text-secondary">{sym}{Math.abs(pnl).toFixed(0)}</td>
                        <td className={cn("py-1.5 font-bold", pnl >= 0 ? "text-emerald-600" : "text-red-500")}>
                          {pnl >= 0 ? "+" : ""}{sym}{Math.abs(pnl).toFixed(0)}
                        </td>
                        <td className="py-1.5 text-text-secondary">{t.rr_ratio ? `1:${Number(t.rr_ratio).toFixed(1)}` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {total > 20 && <p className="text-[9px] font-mono text-text-tertiary text-center mt-2">Showing 20 of {total} trades.</p>}
            </div>
          </>
        )}
      </div>

      {/* Section 2: Risk Discipline Score */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <SectionHeader><Cpu className="w-3.5 h-3.5" /> AI Risk Discipline Score</SectionHeader>
        {!aiScore ? (
          <div className="mt-4">
            <button
              onClick={handleDisciplineScore}
              disabled={aiLoading || total === 0}
              className="w-full flex items-center justify-center gap-2 py-3 bg-background-elevated/50 border border-border-slate/50 rounded-lg text-[10px] font-mono uppercase text-text-secondary hover:border-accent hover:text-accent transition-all disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              {aiLoading ? "Analysing your trades…" : total === 0 ? "No trades to analyse" : "Analyse My Risk Discipline"}
            </button>
            {aiError && <p className="text-[9px] font-mono text-red-400 mt-2">{aiError}</p>}
          </div>
        ) : (
          <div className="mt-4 flex gap-6 items-start">
            <div className="shrink-0">
              <ScoreGauge score={aiScore.score} />
              <p className={cn("text-[10px] font-mono font-black text-center mt-1",
                aiScore.label === "EXCELLENT" ? "text-emerald-600" :
                aiScore.label === "GOOD" ? "text-blue-500" :
                aiScore.label === "DEVELOPING" ? "text-amber-500" : "text-red-500"
              )}>{aiScore.label}</p>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-2">Observations</p>
              {aiScore.observations.filter(Boolean).map((obs, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] font-mono text-text-secondary">
                  <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                  <span>{obs}</span>
                </div>
              ))}
              <button
                onClick={handleDisciplineScore}
                disabled={aiLoading}
                className="flex items-center gap-1 text-[9px] font-mono text-text-tertiary hover:text-accent transition-colors mt-2"
              >
                <RefreshCw className="w-3 h-3" /> Re-analyse
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Instrument P&L */}
      {instrumentData.length > 0 && (
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <SectionHeader><BarChart3 className="w-3.5 h-3.5" /> Instrument P&L Breakdown</SectionHeader>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instrumentData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 8, fontFamily: "monospace" }} tickFormatter={v => `${sym}${v}`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 8, fontFamily: "monospace" }} width={55} />
                <Tooltip formatter={(v: any) => [`${sym}${Number(v).toFixed(0)}`, "P&L"]} contentStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                <Bar dataKey="pnl" radius={[0, 3, 3, 0]}>
                  {instrumentData.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {worstInstrument && worstInstrument.pnl < 0 && (
            <p className="text-[9px] font-mono text-amber-500 mt-2">
              ⚠️ Your worst-performing instrument is <strong>{worstInstrument.name}</strong> ({sym}{worstInstrument.pnl.toFixed(0)} over {worstInstrument.count} trades). Consider reviewing your approach on this pair.
            </p>
          )}
        </div>
      )}

      {/* Section 4: Session Performance */}
      {sessionData.some(s => s.count > 0) && (
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <SectionHeader><TrendingUp className="w-3.5 h-3.5" /> Session Performance</SectionHeader>
          <div className="h-36 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData} margin={{ left: 10, right: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 8, fontFamily: "monospace" }} />
                <YAxis tick={{ fontSize: 8, fontFamily: "monospace" }} tickFormatter={v => `${sym}${v}`} />
                <Tooltip formatter={(v: any) => [`${sym}${Number(v).toFixed(0)}`, "P&L"]} contentStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {sessionData.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {bestSession && bestSession.count > 0 && (
            <p className="text-[9px] font-mono text-emerald-500 mt-2">
              ✅ Your best session is <strong>{bestSession.name}</strong> ({sym}{bestSession.pnl.toFixed(0)} across {bestSession.count} trades).
            </p>
          )}
        </div>
      )}

      {/* Section 5: Equity Curve */}
      {equityData.length > 1 && (
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <SectionHeader><TrendingUp className="w-3.5 h-3.5" /> Equity Curve & Drawdown</SectionHeader>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={equityData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="trade" tick={{ fontSize: 8, fontFamily: "monospace" }} label={{ value: "Trades", position: "insideBottomRight", fontSize: 9 }} />
                <YAxis yAxisId="balance" tick={{ fontSize: 8, fontFamily: "monospace" }} tickFormatter={v => `${sym}${Math.round(v / 1000)}k`} />
                <YAxis yAxisId="dd" orientation="right" tick={{ fontSize: 8, fontFamily: "monospace" }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ fontSize: 10, fontFamily: "monospace" }}
                  formatter={(val: any, name: string) => name === "balance" ? [`${sym}${Number(val).toFixed(0)}`, "Balance"] : [`${Number(val).toFixed(1)}%`, "Drawdown"]}
                />
                <Area yAxisId="dd" dataKey="drawdown" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" name="drawdown" isAnimationActive={false} />
                <Line yAxisId="balance" dataKey="balance" stroke="#00e5cc" strokeWidth={2} dot={false} isAnimationActive={false} name="balance" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-2 text-[9px] font-mono text-text-tertiary">
            <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-accent inline-block" /> Balance</span>
            <span className="flex items-center gap-1.5"><span className="w-6 h-2 bg-red-400/30 inline-block" /> Drawdown</span>
          </div>
        </div>
      )}
    </div>
  );
}
