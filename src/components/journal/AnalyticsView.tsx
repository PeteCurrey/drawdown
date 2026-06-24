"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
} from "recharts";
import type { TradeEntry, EmotionBefore, SetupStat, ConfluenceStat, EmotionStat, InstrumentStat } from "./types";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number | null, prefix = "£") =>
  n == null ? "—" : `${prefix}${Math.abs(n) >= 1000 ? (n < 0 ? "-" : "+") + prefix + Math.abs(n / 1000).toFixed(1) + "k" : (n >= 0 ? "+" : "") + prefix + Math.abs(n).toFixed(0)}`;

const fmtPct = (n: number | null) => n == null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SESSIONS: Array<import("./types").Session> = ["LONDON", "NEW_YORK", "ASIAN", "OVERLAP", "PRE_MARKET"];
const SESSION_LABELS: Record<string, string> = {
  LONDON: "London", NEW_YORK: "New York", ASIAN: "Asian", OVERLAP: "Overlap", PRE_MARKET: "Pre-Market",
};
const EMOTIONS: EmotionBefore[] = ["CONFIDENT", "NERVOUS", "NEUTRAL", "FOMO", "REVENGE", "BORED"];
const EMOTION_EMOJI: Record<EmotionBefore, string> = {
  CONFIDENT: "😤", NERVOUS: "😰", NEUTRAL: "😐", FOMO: "😱", REVENGE: "😡", BORED: "😴",
};

// ─── sub-components ───────────────────────────────────────────────────────────
function SectionCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}>
      <h3 className="text-xs font-black uppercase tracking-widest text-black mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Win rate SVG dial
function WinRateDial({ pct, wins, losses }: { pct: number; wins: number; losses: number }) {
  const r = 44, cx = 56, cy = 56;
  const circumference = Math.PI * r; // semi-circle
  const offset = circumference * (1 - pct / 100);
  return (
    <div className="flex flex-col items-center">
      <svg width="112" height="64" viewBox="0 0 112 64">
        <path d={`M 12 ${cy} A ${r} ${r} 0 0 1 100 ${cy}`} fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
        <path d={`M 12 ${cy} A ${r} ${r} 0 0 1 100 ${cy}`} fill="none" stroke="var(--tool-accent)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <span className="text-3xl font-black text-black -mt-2">{pct.toFixed(1)}%</span>
      <span className="text-xs text-gray-400 mt-1">{wins}W / {losses}L</span>
    </div>
  );
}

// KPI Card
function KpiCard({ label, value, sub, color = "text-black", badge }: {
  label: string; value: React.ReactNode; sub?: string; color?: string; badge?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <div className={`text-2xl font-black ${color} leading-none`}>{value}</div>
      {sub && <p className="text-[10px] text-gray-500 leading-snug">{sub}</p>}
      {badge}
    </div>
  );
}

// Colour bar
function ColorBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.abs(max) > 0 ? (Math.abs(value) / Math.abs(max)) * 100 : 0);
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
export function AnalyticsView({ trades }: { trades: TradeEntry[] }) {
  const [showDrawdown, setShowDrawdown] = useState(false);
  const [setupSort, setSetupSort] = useState<keyof SetupStat>("totalPnL");
  const [setupSortDir, setSetupSortDir] = useState<"asc" | "desc">("desc");

  const closed = useMemo(() => trades.filter(t => t.status === "CLOSED"), [trades]);

  // ── KPI metrics ──────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (!closed.length) return null;
    const wins   = closed.filter(t => (t.pnl_amount ?? 0) > 0);
    const losses = closed.filter(t => (t.pnl_amount ?? 0) < 0);
    const totalPnL    = closed.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
    const grossProfit = wins.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
    const grossLoss   = Math.abs(losses.reduce((s, t) => s + (t.pnl_amount ?? 0), 0));
    const winRate     = (wins.length / closed.length) * 100;
    const avgWin      = wins.length ? grossProfit / wins.length : 0;
    const avgLoss     = losses.length ? grossLoss / losses.length : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;
    const expectancy  = (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss;
    const rrAchieved  = closed.filter(t => t.rr_achieved != null).map(t => t.rr_achieved!);
    const rrPlanned   = closed.filter(t => t.rr_planned != null).map(t => t.rr_planned!);
    const avgRRAchieved = rrAchieved.length ? rrAchieved.reduce((s, v) => s + v, 0) / rrAchieved.length : null;
    const avgRRPlanned  = rrPlanned.length ? rrPlanned.reduce((s, v) => s + v, 0) / rrPlanned.length : null;
    const earlyExitPct  = avgRRAchieved != null && avgRRPlanned != null && avgRRPlanned > 0
      ? ((avgRRPlanned - avgRRAchieved) / avgRRPlanned) * 100 : null;

    // max drawdown
    let peak = 0, running = 0, maxDD = 0;
    [...closed].sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()).forEach(t => {
      running += t.pnl_amount ?? 0;
      if (running > peak) peak = running;
      const dd = peak - running;
      if (dd > maxDD) maxDD = dd;
    });
    const maxDDPct = totalPnL !== 0 ? (maxDD / Math.max(Math.abs(totalPnL), 1)) * 100 : 0;

    return { wins: wins.length, losses: losses.length, totalPnL, profitFactor, winRate,
             expectancy, avgRRAchieved, avgRRPlanned, earlyExitPct, maxDD, maxDDPct };
  }, [closed]);

  // ── Equity curve data ────────────────────────────────────────────────────
  const equityData = useMemo(() => {
    let running = 0, peak = 0;
    return [...closed]
      .sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime())
      .map(t => {
        running += t.pnl_amount ?? 0;
        if (running > peak) peak = running;
        const dd = peak - running;
        return {
          date: new Date(t.entry_time).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          pnl: Math.round(running * 100) / 100,
          tradePnL: t.pnl_amount ?? 0,
          drawdown: -Math.round(dd * 100) / 100,
        };
      });
  }, [closed]);

  // ── P&L by day of week ───────────────────────────────────────────────────
  const dayData = useMemo(() => {
    const map: Record<number, { sum: number; count: number }> = {};
    closed.forEach(t => {
      const d = new Date(t.entry_time).getUTCDay();
      if (!map[d]) map[d] = { sum: 0, count: 0 };
      map[d].sum += t.pnl_amount ?? 0;
      map[d].count++;
    });
    return [1,2,3,4,5].map(d => ({
      day: DAYS[d], avg: map[d] ? map[d].sum / map[d].count : 0, count: map[d]?.count ?? 0,
    }));
  }, [closed]);
  const bestDay = dayData.reduce((b, d) => d.avg > b.avg ? d : b, dayData[0] ?? { day: "—", avg: 0 });

  // ── P&L by session ───────────────────────────────────────────────────────
  const sessionData = useMemo(() => {
    const map: Record<string, { sum: number; count: number }> = {};
    closed.forEach(t => {
      const s = t.session ?? "UNKNOWN";
      if (!map[s]) map[s] = { sum: 0, count: 0 };
      map[s].sum += t.pnl_amount ?? 0;
      map[s].count++;
    });
    return Object.entries(map).map(([s, v]) => ({ session: SESSION_LABELS[s] ?? s, avg: v.sum / v.count, count: v.count }));
  }, [closed]);

  // ── P&L by hour heatmap ──────────────────────────────────────────────────
  const hourData = useMemo(() => {
    const map: Record<number, { sum: number; count: number }> = {};
    closed.forEach(t => {
      const h = new Date(t.entry_time).getUTCHours();
      if (!map[h]) map[h] = { sum: 0, count: 0 };
      map[h].sum += t.pnl_amount ?? 0;
      map[h].count++;
    });
    return Array.from({ length: 24 }, (_, i) => ({ hour: i, avg: map[i] ? map[i].sum / map[i].count : null, count: map[i]?.count ?? 0 }));
  }, [closed]);

  const maxHourAbs = useMemo(() => Math.max(...hourData.map(h => Math.abs(h.avg ?? 0)), 1), [hourData]);

  function hourColor(avg: number | null) {
    if (avg == null) return "#f3f4f6";
    const intensity = Math.min(1, Math.abs(avg) / maxHourAbs);
    if (avg > 0) return `rgba(0,200,83,${0.2 + intensity * 0.7})`;
    return `rgba(239,68,68,${0.2 + intensity * 0.7})`;
  }

  // ── Setup analysis ───────────────────────────────────────────────────────
  const setupStats = useMemo<SetupStat[]>(() => {
    const map: Record<string, SetupStat> = {};
    closed.forEach(t => {
      const s = t.setup_type ?? "Untagged";
      if (!map[s]) map[s] = { setup: s, trades: 0, wins: 0, winRate: 0, avgRR: 0, totalPnL: 0, bestTrade: 0, worstTrade: 0 };
      const st = map[s];
      st.trades++;
      const p = t.pnl_amount ?? 0;
      if (p > 0) { st.wins++; st.bestTrade = Math.max(st.bestTrade, p); }
      else { st.worstTrade = Math.min(st.worstTrade, p); }
      st.totalPnL += p;
      if (t.rr_achieved != null) st.avgRR = (st.avgRR * (st.trades - 1) + t.rr_achieved) / st.trades;
    });
    return Object.values(map).map(s => ({ ...s, winRate: (s.wins / s.trades) * 100 }));
  }, [closed]);

  const sortedSetups = useMemo(() => {
    return [...setupStats].sort((a, b) => {
      const av = a[setupSort] as number, bv = b[setupSort] as number;
      return setupSortDir === "desc" ? bv - av : av - bv;
    });
  }, [setupStats, setupSort, setupSortDir]);

  function toggleSetupSort(col: keyof SetupStat) {
    if (setupSort === col) setSetupSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSetupSort(col); setSetupSortDir("desc"); }
  }

  // ── Confluence analysis ──────────────────────────────────────────────────
  const { confluenceStats, topCombos } = useMemo(() => {
    const map: Record<string, { uses: number; wins: number; sumPnL: number }> = {};
    const comboMap: Record<string, { wins: number; total: number; sumPnL: number }> = {};
    const totalWins = closed.filter(t => (t.pnl_amount ?? 0) > 0).length;

    closed.forEach(t => {
      const tags = t.confluences ?? [];
      tags.forEach(tag => {
        if (!map[tag]) map[tag] = { uses: 0, wins: 0, sumPnL: 0 };
        map[tag].uses++;
        if ((t.pnl_amount ?? 0) > 0) map[tag].wins++;
        map[tag].sumPnL += t.pnl_amount ?? 0;
      });
      // 2-combos
      for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
          const key = [tags[i], tags[j]].sort().join(" + ");
          if (!comboMap[key]) comboMap[key] = { wins: 0, total: 0, sumPnL: 0 };
          comboMap[key].total++;
          if ((t.pnl_amount ?? 0) > 0) comboMap[key].wins++;
          comboMap[key].sumPnL += t.pnl_amount ?? 0;
        }
      }
    });

    const confluenceStats: ConfluenceStat[] = Object.entries(map).map(([tag, v]) => ({
      tag, uses: v.uses, wins: v.wins,
      winRate: (v.wins / v.uses) * 100,
      avgPnL: v.sumPnL / v.uses,
      winShare: totalWins > 0 ? (v.wins / totalWins) * 100 : 0,
    })).sort((a, b) => b.winRate - a.winRate);

    const topCombos = Object.entries(comboMap)
      .filter(([, v]) => v.total >= 5)
      .map(([key, v]) => ({ combo: key, total: v.total, wins: v.wins, winRate: (v.wins / v.total) * 100, avgPnL: v.sumPnL / v.total }))
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3);

    return { confluenceStats, topCombos };
  }, [closed]);

  // ── Psychology analysis ──────────────────────────────────────────────────
  const emotionStats = useMemo<EmotionStat[]>(() => {
    const map: Record<string, { trades: number; wins: number; sumPnL: number }> = {};
    closed.forEach(t => {
      const e = t.emotions_before ?? "NEUTRAL";
      if (!map[e]) map[e] = { trades: 0, wins: 0, sumPnL: 0 };
      map[e].trades++;
      if ((t.pnl_amount ?? 0) > 0) map[e].wins++;
      map[e].sumPnL += t.pnl_amount ?? 0;
    });
    return EMOTIONS
      .filter(e => map[e])
      .map(e => ({ emotion: e, trades: map[e].trades, wins: map[e].wins, winRate: (map[e].wins / map[e].trades) * 100, avgPnL: map[e].sumPnL / map[e].trades }));
  }, [closed]);

  const revengeStats = emotionStats.find(e => e.emotion === "REVENGE");
  const rulesFollowed = closed.filter(t => t.rules_followed === true);
  const rulesBroken   = closed.filter(t => t.rules_followed === false);
  const rfWR = rulesFollowed.length ? (rulesFollowed.filter(t => (t.pnl_amount ?? 0) > 0).length / rulesFollowed.length) * 100 : null;
  const rbWR = rulesBroken.length ? (rulesBroken.filter(t => (t.pnl_amount ?? 0) > 0).length / rulesBroken.length) * 100 : null;
  const rfAvg = rulesFollowed.length ? rulesFollowed.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) / rulesFollowed.length : null;
  const rbAvg = rulesBroken.length ? rulesBroken.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) / rulesBroken.length : null;

  // ── Instrument breakdown ─────────────────────────────────────────────────
  const instrumentStats = useMemo<InstrumentStat[]>(() => {
    const map: Record<string, { trades: number; wins: number; sumPnL: number }> = {};
    closed.forEach(t => {
      const s = t.symbol;
      if (!map[s]) map[s] = { trades: 0, wins: 0, sumPnL: 0 };
      map[s].trades++;
      if ((t.pnl_amount ?? 0) > 0) map[s].wins++;
      map[s].sumPnL += t.pnl_amount ?? 0;
    });
    return Object.entries(map).map(([symbol, v]) => {
      const winRate = (v.wins / v.trades) * 100;
      const avgPnL  = v.sumPnL / v.trades;
      const recommendation: "keep" | "reduce" | "stop" = winRate < 35 && v.sumPnL < 0 ? "stop" : winRate < 50 ? "reduce" : "keep";
      return { symbol, trades: v.trades, wins: v.wins, winRate, avgPnL, totalPnL: v.sumPnL, recommendation };
    }).sort((a, b) => b.totalPnL - a.totalPnL);
  }, [closed]);

  // ── Prop firm tracker ────────────────────────────────────────────────────
  const propAccounts = useMemo(() => {
    const hasProp = trades.some(t => t.prop_firm);
    if (!hasProp) return [];
    const map: Record<string, { firm: string; phase: string | null; trades: TradeEntry[] }> = {};
    trades.filter(t => t.prop_firm).forEach(t => {
      const key = `${t.prop_firm}|${t.prop_account_id ?? ""}`;
      if (!map[key]) map[key] = { firm: t.prop_firm!, phase: t.prop_phase ?? null, trades: [] };
      map[key].trades.push(t);
    });
    return Object.values(map);
  }, [trades]);

  const PROP_LIMITS: Record<string, { daily: number; maxDD: number; target: number }> = {
    FTMO: { daily: 5, maxDD: 10, target: 10 },
    "The5ers": { daily: 5, maxDD: 10, target: 8 },
    MyFundedFX: { daily: 5, maxDD: 10, target: 10 },
    Apex: { daily: 3, maxDD: 6, target: 7 },
    FundedNext: { daily: 5, maxDD: 10, target: 10 },
  };

  // ─── empty states ─────────────────────────────────────────────────────────
  if (!closed.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-black text-black mb-2">No Closed Trades Yet</h3>
        <p className="text-sm text-gray-400 max-w-md">
          Log your first closed trade to unlock analytics. Every pattern, every edge, every lesson starts here.
        </p>
      </div>
    );
  }

  const pfColor = !kpis ? "text-gray-400" : kpis.profitFactor >= 1.5 ? "text-green-600" : kpis.profitFactor >= 1.0 ? "text-amber-600" : "text-red-600";
  const ddColor = !kpis ? "text-gray-400" : kpis.maxDDPct < 5 ? "text-green-600" : kpis.maxDDPct < 10 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* ─── KPI ROW ─────────────────────────────────────────────────────── */}
      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard
            label="Total P&L"
            value={<span className={kpis.totalPnL >= 0 ? "text-green-600" : "text-red-600"}>{fmt(kpis.totalPnL)}</span>}
            sub={`${closed.length} closed trades`}
          />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-1 col-span-2 sm:col-span-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 self-start">Win Rate</p>
            <WinRateDial pct={kpis.winRate} wins={kpis.wins} losses={kpis.losses} />
          </div>
          <KpiCard
            label="Profit Factor"
            value={<span className={pfColor}>{kpis.profitFactor >= 999 ? "∞" : kpis.profitFactor.toFixed(2)}</span>}
            sub={kpis.profitFactor > 0 ? `For every £1 lost you make £${kpis.profitFactor.toFixed(2)}` : "No profitable trades yet"}
          />
          <KpiCard
            label="Expectancy"
            value={<span className={kpis.expectancy >= 0 ? "text-green-600" : "text-red-600"}>{fmt(kpis.expectancy)}</span>}
            sub="Expected return per trade"
          />
          <KpiCard
            label="Avg RR Achieved"
            value={kpis.avgRRAchieved != null ? `${kpis.avgRRAchieved.toFixed(2)}:1` : "—"}
            sub={kpis.earlyExitPct != null
              ? `vs planned ${kpis.avgRRPlanned?.toFixed(2)}:1 — ${kpis.earlyExitPct.toFixed(0)}% early exit`
              : kpis.avgRRPlanned != null ? `Planned ${kpis.avgRRPlanned.toFixed(2)}:1` : undefined}
          />
          <KpiCard
            label="Max Drawdown"
            value={<span className={ddColor}>{fmt(-kpis.maxDD)}</span>}
            sub={`${kpis.maxDDPct.toFixed(1)}% of period P&L`}
          />
        </div>
      )}

      {/* ─── EQUITY CURVE ─────────────────────────────────────────────────── */}
      <SectionCard title="Equity Curve">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setShowDrawdown(d => !d)}
            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${showDrawdown ? "bg-red-100 border-red-300 text-red-600" : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"}`}
          >
            {showDrawdown ? "▼ Hide Drawdown" : "▼ Show Drawdown"}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={equityData}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00c853" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `£${v}`} />
            <Tooltip
              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number, name: string) => [
                name === "drawdown" ? `£${Math.abs(v).toFixed(0)} DD` : `£${v.toFixed(0)}`,
                name === "drawdown" ? "Drawdown" : "Running P&L"
              ]}
            />
            {showDrawdown && <Area type="monotone" dataKey="drawdown" fill="url(#ddGrad)" stroke="#ef4444" strokeWidth={1} dot={false} />}
            <Area type="monotone" dataKey="pnl" fill="url(#pnlGrad)" stroke="#00c853" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* ─── THREE CHARTS ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Day of week */}
        <SectionCard title="P&L by Day of Week">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`£${v.toFixed(0)} avg`, "Avg P&L"]} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {dayData.map((d, i) => <Cell key={i} fill={d.avg >= 0 ? "#16a34a" : "#dc2626"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {dayData.length > 0 && <p className="text-[10px] text-gray-500 mt-2">Best day: <span className="font-bold text-green-600">{bestDay.day}</span> (avg {fmt(bestDay.avg)})</p>}
        </SectionCard>

        {/* Session */}
        <SectionCard title="P&L by Session">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="session" tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`£${v.toFixed(0)} avg`, "Avg P&L"]} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {sessionData.map((d, i) => <Cell key={i} fill={d.avg >= 0 ? "#16a34a" : "#dc2626"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {sessionData.length > 0 && (() => {
            const best = sessionData.reduce((b, s) => s.avg > b.avg ? s : b, sessionData[0]);
            return <p className="text-[10px] text-gray-500 mt-2">Edge in <span className="font-bold text-green-600">{best.session}</span> (avg {fmt(best.avg)})</p>;
          })()}
        </SectionCard>

        {/* Hour heatmap */}
        <SectionCard title="P&L by Hour (UTC)">
          <div className="flex flex-wrap gap-0.5 mt-2">
            {hourData.map(h => (
              <div key={h.hour} title={h.avg != null ? `${h.hour}:00 — avg £${h.avg.toFixed(0)} (${h.count} trades)` : `${h.hour}:00 — no trades`}
                className="flex items-center justify-center rounded text-[7px] font-bold cursor-default transition-transform hover:scale-110"
                style={{ width: 28, height: 28, backgroundColor: hourColor(h.avg), color: h.avg != null ? "#fff" : "#9ca3af" }}>
                {h.hour}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[9px] text-gray-400">
            <span style={{ background: "rgba(0,200,83,0.7)", width: 10, height: 10, borderRadius: 2, display: "inline-block" }} />Profitable
            <span style={{ background: "rgba(239,68,68,0.7)", width: 10, height: 10, borderRadius: 2, display: "inline-block" }} />Losing
            <span style={{ background: "#f3f4f6", width: 10, height: 10, borderRadius: 2, display: "inline-block" }} />No trades
          </div>
        </SectionCard>
      </div>

      {/* ─── SETUP ANALYSIS ───────────────────────────────────────────────── */}
      <SectionCard title="Setup Performance Analysis">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {([["setup", "Setup"], ["trades", "Trades"], ["winRate", "Win%"], ["avgRR", "Avg RR"], ["totalPnL", "Total P&L"], ["bestTrade", "Best"], ["worstTrade", "Worst"]] as [keyof SetupStat, string][]).map(([col, label]) => (
                  <th key={col} className="pb-3 pr-4 text-[9px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-black transition-colors select-none whitespace-nowrap"
                    onClick={() => toggleSetupSort(col)}>
                    {label}{setupSort === col ? (setupSortDir === "desc" ? " ↓" : " ↑") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedSetups.map(s => (
                <tr key={s.setup} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-black text-xs whitespace-nowrap">{s.setup}</td>
                  <td className="py-2.5 pr-4 text-xs text-gray-600">{s.trades}</td>
                  <td className="py-2.5 pr-4 text-xs">
                    <span className={s.winRate >= 50 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{s.winRate.toFixed(0)}%</span>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-gray-600">{s.avgRR.toFixed(2)}:1</td>
                  <td className={`py-2.5 pr-4 text-xs font-bold ${s.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(s.totalPnL)}</td>
                  <td className="py-2.5 pr-4 text-xs text-green-600">+£{s.bestTrade.toFixed(0)}</td>
                  <td className="py-2.5 text-xs text-red-600">-£{Math.abs(s.worstTrade).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedSetups.length > 0 && (() => {
          const best = sortedSetups.reduce((b, s) => s.totalPnL > b.totalPnL ? s : b, sortedSetups[0]);
          return <p className="mt-4 text-xs text-gray-600">Most profitable setup: <span className="font-bold text-black">{best.setup}</span> ({best.winRate.toFixed(0)}% WR, {best.avgRR.toFixed(2)} avg RR)</p>;
        })()}
      </SectionCard>

      {/* ─── CONFLUENCE ANALYSIS ──────────────────────────────────────────── */}
      <SectionCard title="Confluence Analysis">
        {confluenceStats.length === 0 ? (
          <p className="text-xs text-gray-400">No confluence tags logged yet. Add tags when logging trades to unlock this analysis.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              {confluenceStats.map(c => {
                const isHighImpact = c.winRate > 70 && c.uses >= 10;
                const isAvoid = c.winRate < 35;
                return (
                  <div key={c.tag} className={`rounded-lg p-3 border ${isHighImpact ? "border-green-200 bg-green-50" : isAvoid ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-black truncate">{c.tag}</span>
                      {isHighImpact && <span className="text-[9px] font-black text-green-700 bg-green-200 px-1.5 py-0.5 rounded-full">⭐ HIGH IMPACT</span>}
                      {isAvoid && <span className="text-[9px] font-black text-red-700 bg-red-200 px-1.5 py-0.5 rounded-full">⚠️ AVOID</span>}
                    </div>
                    <div className="flex gap-3 text-[10px] text-gray-500">
                      <span>{c.uses} uses</span>
                      <span className={c.winRate >= 50 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{c.winRate.toFixed(0)}% WR</span>
                      <span className={c.avgPnL >= 0 ? "text-green-600" : "text-red-600"}>{fmt(c.avgPnL)} avg</span>
                    </div>
                    <ColorBar value={c.winRate} max={100} color={isHighImpact ? "#16a34a" : isAvoid ? "#dc2626" : "var(--tool-accent)"} />
                  </div>
                );
              })}
            </div>

            {topCombos.length > 0 && (
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Your Statistical Edge — Top Combinations</h4>
                <div className="space-y-2">
                  {topCombos.map((c, i) => (
                    <div key={i} className="bg-[var(--tool-accent-tint)] border border-[var(--tool-accent-border)] rounded-lg p-4">
                      <p className="text-xs font-black text-black mb-1">{c.combo}</p>
                      <p className="text-[10px] text-gray-600">
                        {c.total} trades &middot; <span className="text-green-600 font-bold">{c.winRate.toFixed(1)}% win rate</span> &middot; {fmt(c.avgPnL)} avg P&L &middot;
                        {c.winRate >= 70 && " ⭐ Your statistical edge."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>

      {/* ─── PSYCHOLOGY ANALYSIS ──────────────────────────────────────────── */}
      <SectionCard title="Psychology Analysis">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emotions table */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Emotion Before Trade vs Outcome</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Emotion", "Trades", "Win Rate", "Avg P&L"].map(h => (
                    <th key={h} className="pb-2 text-[9px] font-black uppercase tracking-widest text-gray-400 text-left pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emotionStats.map(e => {
                  const isDanger = e.emotion === "FOMO" || e.emotion === "REVENGE";
                  return (
                    <tr key={e.emotion} className={`border-b border-gray-50 ${isDanger ? "bg-red-50" : ""}`}>
                      <td className="py-2 pr-3 text-xs font-bold text-black">
                        {EMOTION_EMOJI[e.emotion]} {e.emotion}
                        {isDanger && <span className="ml-1 text-[8px] text-red-600">← RED</span>}
                      </td>
                      <td className="py-2 pr-3 text-xs text-gray-600">{e.trades}</td>
                      <td className={`py-2 pr-3 text-xs font-bold ${e.winRate >= 50 ? "text-green-600" : "text-red-600"}`}>{e.winRate.toFixed(0)}%</td>
                      <td className={`py-2 text-xs font-bold ${e.avgPnL >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(e.avgPnL)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {revengeStats && revengeStats.trades > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs font-bold text-red-700 mb-1">⚠️ REVENGE TRADING ALERT</p>
                <p className="text-[11px] text-red-600">
                  You have a <strong>{revengeStats.winRate.toFixed(0)}%</strong> win rate on revenge trades.
                  These {revengeStats.trades} trades cost <strong>£{Math.abs(revengeStats.avgPnL * revengeStats.trades).toFixed(0)}</strong> total.
                  Avoiding revenge trading would add this directly to your account.
                </p>
              </div>
            )}
          </div>

          {/* Rules adherence */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Rules Adherence</h4>
            <div className="space-y-3">
              {[
                { label: "Rules Followed", trades: rulesFollowed.length, wr: rfWR, avg: rfAvg, color: "green" },
                { label: "Rules Broken",   trades: rulesBroken.length,  wr: rbWR, avg: rbAvg, color: "red" },
              ].map(r => (
                <div key={r.label} className={`rounded-lg p-4 border ${r.color === "green" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-black">{r.label}</span>
                    <span className="text-xs text-gray-500">{r.trades} trades</span>
                  </div>
                  <div className="flex gap-4 text-[11px]">
                    {r.wr != null && <span className={`font-bold ${r.color === "green" ? "text-green-600" : "text-red-600"}`}>{r.wr.toFixed(0)}% WR</span>}
                    {r.avg != null && <span className={`font-bold ${r.avg >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(r.avg)} avg</span>}
                  </div>
                </div>
              ))}
              {rfAvg != null && rbAvg != null && (
                <p className="text-xs text-gray-600 mt-2">
                  Following your rules is worth <span className="font-bold text-green-600">{fmt(rfAvg - rbAvg)}</span> per trade on average.
                </p>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ─── INSTRUMENT BREAKDOWN ─────────────────────────────────────────── */}
      <SectionCard title="Instrument Performance">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={instrumentStats.slice(0, 10)} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} tickFormatter={v => `£${v}`} />
            <YAxis type="category" dataKey="symbol" tick={{ fontSize: 10, fill: "#374151" }} width={55} />
            <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`£${v.toFixed(0)}`, "Total P&L"]} />
            <Bar dataKey="totalPnL" radius={[0, 4, 4, 0]}>
              {instrumentStats.slice(0, 10).map((d, i) => <Cell key={i} fill={d.totalPnL >= 0 ? "#16a34a" : "#dc2626"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Symbol", "Trades", "Win%", "Avg P&L", "Total P&L", "Recommendation"].map(h => (
                  <th key={h} className="pb-2 text-[9px] font-black uppercase tracking-widest text-gray-400 text-left pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instrumentStats.map(i => (
                <tr key={i.symbol} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 font-bold text-black text-xs">{i.symbol}</td>
                  <td className="py-2.5 pr-4 text-xs text-gray-600">{i.trades}</td>
                  <td className={`py-2.5 pr-4 text-xs font-bold ${i.winRate >= 50 ? "text-green-600" : "text-red-600"}`}>{i.winRate.toFixed(0)}%</td>
                  <td className={`py-2.5 pr-4 text-xs font-bold ${i.avgPnL >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(i.avgPnL)}</td>
                  <td className={`py-2.5 pr-4 text-xs font-bold ${i.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(i.totalPnL)}</td>
                  <td className="py-2.5 text-xs">
                    {i.recommendation === "keep" && <span className="text-green-700">✅ Keep trading — edge confirmed</span>}
                    {i.recommendation === "reduce" && <span className="text-amber-700">⚠️ Underperforming — reduce size</span>}
                    {i.recommendation === "stop" && <span className="text-red-700">🔴 Stop trading — no edge</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ─── PROP FIRM TRACKER ────────────────────────────────────────────── */}
      {propAccounts.length > 0 && (
        <SectionCard title="Prop Firm Tracker">
          <div className="space-y-6">
            {propAccounts.map((acc, idx) => {
              const limits = PROP_LIMITS[acc.firm] ?? { daily: 5, maxDD: 10, target: 10 };
              const todayPnL = acc.trades
                .filter(t => t.trading_day === new Date().toISOString().split("T")[0])
                .reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
              const totalPnL = acc.trades.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
              const days = new Set(acc.trades.map(t => t.trading_day)).size;

              function PropBar({ label, used, max, unit = "%" }: { label: string; used: number; max: number; unit?: string }) {
                const pct = Math.min(100, (Math.abs(used) / max) * 100);
                const color = pct < 50 ? "#16a34a" : pct < 80 ? "#d97706" : "#dc2626";
                return (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-bold" style={{ color }}>{Math.abs(used).toFixed(0)}{unit} of {max}{unit} {pct >= 80 ? "⚠️" : pct >= 100 ? "✅" : ""}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="font-black text-black">{acc.firm}</h4>
                    {acc.phase && (
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${acc.phase === "FUNDED" ? "bg-green-100 text-green-700" : acc.phase === "CHALLENGE" ? "bg-amber-100 text-amber-700" : "bg-cyan-100 text-cyan-700"}`}>
                        {acc.phase}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <PropBar label="Daily Loss Used" used={Math.abs(Math.min(0, todayPnL))} max={limits.daily * 100} unit="%" />
                    <PropBar label="Total Drawdown" used={Math.abs(Math.min(0, totalPnL))} max={limits.maxDD * 100} unit="%" />
                    <PropBar label="Profit Target" used={Math.max(0, totalPnL)} max={limits.target * 100} unit="%" />
                    <div className="text-[10px] text-gray-600">Trading Days: <span className="font-bold text-black">{days}</span> of 4 minimum</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
