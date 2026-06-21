"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, BarChart, Bar } from "recharts";
import { Shield, CheckCircle, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Monte Carlo (copied from RiskCalculator for use in recovery) ─────────────
function runMonteCarlo(balance: number, riskPct: number, winRate: number, rr: number, numTrades: number, numSims = 1000) {
  const curves: number[][] = [];
  const allDrawdowns: number[] = [];
  let totalStreaks = 0, maxStreakSeen = 0;

  for (let s = 0; s < numSims; s++) {
    const curve = [balance];
    let bal = balance;
    let peak = balance;
    let maxDD = 0;
    let streak = 0, curStreak = 0;

    for (let t = 0; t < numTrades; t++) {
      const risk = bal * (riskPct / 100);
      if (Math.random() < winRate) {
        bal += risk * rr;
        curStreak = 0;
      } else {
        bal -= risk;
        curStreak++;
        if (curStreak > streak) streak = curStreak;
      }
      if (bal > peak) peak = bal;
      const dd = (peak - bal) / peak;
      if (dd > maxDD) maxDD = dd;
      if (bal <= 0) { bal = 0; break; }
      curve.push(bal);
    }
    curves.push(curve);
    allDrawdowns.push(maxDD);
    totalStreaks += streak;
    if (streak > maxStreakSeen) maxStreakSeen = streak;
  }

  const finals = curves.map(c => c[c.length - 1]).sort((a, b) => a - b);
  allDrawdowns.sort((a, b) => a - b);
  const median = finals[Math.floor(numSims / 2)];
  const best10 = finals[Math.floor(numSims * 0.9)];
  const worst10 = finals[Math.floor(numSims * 0.1)];
  const probDouble = finals.filter(f => f >= balance * 2).length / numSims;
  const probHalfRuin = finals.filter(f => f <= balance * 0.5).length / numSims;
  const maxDrawdownMedian = allDrawdowns[Math.floor(numSims / 2)];

  return { finals, stats: { median, best10, worst10, probDouble, probHalfRuin, maxDrawdownMedian, worstStreak: maxStreakSeen, avgConsecLosses: Math.round(totalStreaks / numSims) } };
}

// ─── Prop Firms config ────────────────────────────────────────────────────────
const PROP_FIRMS_V2: Record<string, {
  name: string; balance: number; maxDailyLoss: number; maxTotalLoss: number;
  profitTarget: number; minDays: number; maxLots: number | null;
  drawdownType: "BALANCE_BASED" | "EQUITY_BASED" | "EQUITY_TRAILING" | "INTRADAY_TRAILING";
  trailingDrawdown: boolean; newsRestriction: boolean; newsMinutes: number;
  weekendRestriction: boolean; copyTrading: boolean; scalingPlan: boolean;
  profitSplit: number;
}> = {
  ftmo_10k:   { name: "FTMO – $10k",    balance: 10000,  maxDailyLoss: 5, maxTotalLoss: 10, profitTarget: 10, minDays: 4,  maxLots: null, drawdownType: "BALANCE_BASED",     trailingDrawdown: false, newsRestriction: true,  newsMinutes: 2, weekendRestriction: false, copyTrading: false, scalingPlan: true,  profitSplit: 80 },
  ftmo_100k:  { name: "FTMO – $100k",   balance: 100000, maxDailyLoss: 5, maxTotalLoss: 10, profitTarget: 10, minDays: 4,  maxLots: null, drawdownType: "BALANCE_BASED",     trailingDrawdown: false, newsRestriction: true,  newsMinutes: 2, weekendRestriction: false, copyTrading: false, scalingPlan: true,  profitSplit: 80 },
  the5ers:    { name: "The5ers",         balance: 100000, maxDailyLoss: 4, maxTotalLoss: 8,  profitTarget: 8,  minDays: 0,  maxLots: 50,   drawdownType: "EQUITY_BASED",      trailingDrawdown: false, newsRestriction: false, newsMinutes: 0, weekendRestriction: false, copyTrading: true,  scalingPlan: true,  profitSplit: 75 },
  myfundedfx: { name: "MyFundedFX",     balance: 100000, maxDailyLoss: 5, maxTotalLoss: 10, profitTarget: 10, minDays: 5,  maxLots: 100,  drawdownType: "EQUITY_TRAILING",   trailingDrawdown: true,  newsRestriction: true,  newsMinutes: 2, weekendRestriction: false, copyTrading: false, scalingPlan: false, profitSplit: 85 },
  apex:       { name: "Apex Trader",    balance: 50000,  maxDailyLoss: 3, maxTotalLoss: 6,  profitTarget: 6,  minDays: 10, maxLots: null, drawdownType: "INTRADAY_TRAILING", trailingDrawdown: true,  newsRestriction: false, newsMinutes: 0, weekendRestriction: false, copyTrading: true,  scalingPlan: false, profitSplit: 90 },
  fundednext: { name: "FundedNext",     balance: 50000,  maxDailyLoss: 5, maxTotalLoss: 10, profitTarget: 10, minDays: 5,  maxLots: null, drawdownType: "BALANCE_BASED",     trailingDrawdown: false, newsRestriction: true,  newsMinutes: 2, weekendRestriction: false, copyTrading: false, scalingPlan: true,  profitSplit: 80 },
  custom:     { name: "Custom Rules",   balance: 10000,  maxDailyLoss: 5, maxTotalLoss: 10, profitTarget: 10, minDays: 5,  maxLots: 100,  drawdownType: "BALANCE_BASED",     trailingDrawdown: false, newsRestriction: false, newsMinutes: 2, weekendRestriction: false, copyTrading: false, scalingPlan: false, profitSplit: 80 },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1.5">{children}</label>;
}
function FieldInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full bg-background-primary border border-border-slate/80 px-4 py-3 text-sm font-mono font-bold outline-none focus:border-accent text-text-primary rounded-lg transition-colors", className)} {...props} />;
}
function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary border-b border-border-slate/30 pb-2 flex items-center gap-1.5">{children}</h4>;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface PropComplianceTabProps {
  balance: number;
  riskAmt: number;
  lots: number;
  sym: string;
  symbol: string;
  direction: string;
  entryPrice: string;
  stopPrice: string;
}

export function PropComplianceTab({ balance, riskAmt, lots, sym, symbol, direction, entryPrice, stopPrice }: PropComplianceTabProps) {
  const [firmId, setFirmId] = useState("ftmo_10k");
  const [dailyUsed, setDailyUsed] = useState(0);
  const [daysTrade, setDaysTrade] = useState(0);
  const [events, setEvents] = useState<any[]>([]);

  // Trailing drawdown state
  const [startBalance, setStartBalance] = useState(10000);
  const [peakEquity, setPeakEquity] = useState(10000);
  const [currentEquityBalance, setCurrentEquityBalance] = useState(10000);

  // Recovery calculator state
  const [recoveryCurrent, setRecoveryCurrent] = useState(9000);
  const [recoveryTarget, setRecoveryTarget] = useState(10000);
  const [recoveryWinRate, setRecoveryWinRate] = useState(45);
  const [recoveryRR, setRecoveryRR] = useState(2.0);
  const [recoveryResults, setRecoveryResults] = useState<{ riskPct: number; medianTrades: number; pSuccess: number }[] | null>(null);

  const firm = PROP_FIRMS_V2[firmId];

  // Sync startBalance with firm default
  useEffect(() => {
    setStartBalance(firm.balance);
    setPeakEquity(firm.balance);
    setCurrentEquityBalance(firm.balance);
  }, [firmId]);

  // Fetch news calendar
  useEffect(() => {
    if (!symbol) return;
    fetch(`/api/calendar/${symbol}`)
      .then(r => r.json())
      .then(d => setEvents(d.events ?? []))
      .catch(() => {});
  }, [symbol]);

  const firm_balance = firm.balance;
  const dailyLimit = firm_balance * firm.maxDailyLoss / 100;
  const totalLoss = firm_balance * firm.maxTotalLoss / 100;

  // Trailing floor calculation
  const isTrailing = firm.trailingDrawdown;
  const floorBalance = isTrailing
    ? peakEquity - totalLoss
    : startBalance - totalLoss;
  const bufferRemaining = currentEquityBalance - floorBalance;
  const bufferPct = (bufferRemaining / totalLoss) * 100;

  // Compliance checks
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const nextHighImpact = events.find(e => e.impact === "high");
  const minsToNextHigh = nextHighImpact?.time ? (() => {
    const parts = nextHighImpact.time.split(":");
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || "0", 10);
    const evt = new Date();
    evt.setUTCHours(h, m, 0, 0);
    if (evt < new Date()) evt.setUTCDate(evt.getUTCDate() + 1);
    return Math.round((evt.getTime() - Date.now()) / 60000);
  })() : null;

  const newsViolation = firm.newsRestriction && minsToNextHigh !== null && minsToNextHigh < firm.newsMinutes;

  const tradeChecks = [
    {
      label: `Lot limit: ${lots.toFixed(2)} lots${firm.maxLots ? ` (max ${firm.maxLots})` : " (no limit)"}`,
      pass: lots <= (firm.maxLots ?? 9999),
      warn: firm.maxLots !== null && lots > firm.maxLots * 0.8,
    },
    {
      label: `Daily loss budget: ${sym}${(dailyUsed + riskAmt).toFixed(0)} used of ${sym}${dailyLimit.toFixed(0)} limit`,
      pass: (dailyUsed + riskAmt) <= dailyLimit,
      warn: (dailyUsed + riskAmt) > dailyLimit * 0.8,
    },
    {
      label: firm.newsRestriction
        ? `News timing: ${newsViolation ? `HIGH IMPACT EVENT within ${firm.newsMinutes} min` : "Clear"}`
        : "News timing: No restriction for this firm",
      pass: !newsViolation,
      warn: false,
    },
    {
      label: isTrailing
        ? `Trailing floor buffer: ${sym}${bufferRemaining.toFixed(0)} remaining`
        : "Drawdown type: Balance-based (no trailing floor)",
      pass: isTrailing ? bufferRemaining > riskAmt : true,
      warn: isTrailing ? bufferRemaining < riskAmt * 2 : false,
    },
    {
      label: firm.minDays > 0
        ? `Minimum trading days: ${daysTrade}/${firm.minDays} completed`
        : "Minimum days: No requirement",
      pass: daysTrade >= firm.minDays || firm.minDays === 0,
      warn: firm.minDays > 0 && daysTrade < firm.minDays && daysTrade >= firm.minDays * 0.7,
    },
  ];

  const allPass = tradeChecks.every(c => c.pass);
  const hasWarn = tradeChecks.some(c => c.warn);
  const signal = !allPass ? "DO NOT TRADE" : hasWarn ? "CAUTION" : "GO";
  const signalColor = signal === "GO" ? "bg-emerald-500 text-white" : signal === "CAUTION" ? "bg-amber-500 text-white" : "bg-red-600 text-white";

  // Recovery simulator
  function runRecovery() {
    const riskLevels = [0.25, 0.5, 1.0, 1.5, 2.0];
    const deficit = recoveryTarget - recoveryCurrent;
    if (deficit <= 0) return;

    const results = riskLevels.map(riskPct => {
      const { finals } = runMonteCarlo(recoveryCurrent, riskPct, recoveryWinRate / 100, recoveryRR, 200, 1000);
      const successCount = finals.filter(f => f >= recoveryTarget).length;
      const pSuccess = successCount / 1000;
      // Estimate median trades: binary search not feasible easily, use rough simulation
      let totalTrades = 0;
      let simCount = 0;
      for (let s = 0; s < 200; s++) {
        let bal = recoveryCurrent;
        for (let t = 0; t < 200; t++) {
          const r = bal * riskPct / 100;
          if (Math.random() < recoveryWinRate / 100) bal += r * recoveryRR; else bal -= r;
          if (bal >= recoveryTarget || bal < recoveryCurrent * 0.5) {
            totalTrades += t + 1;
            simCount++;
            break;
          }
        }
      }
      const medianTrades = simCount > 0 ? Math.round(totalTrades / simCount) : 200;
      return { riskPct, medianTrades, pSuccess };
    });
    setRecoveryResults(results);
  }

  // Visual bar heights for trailing drawdown
  const maxVisualBalance = startBalance * 1.15;
  const minVisualBalance = startBalance * 0.8;
  const visRange = maxVisualBalance - minVisualBalance;
  function toPercent(val: number) {
    return Math.min(100, Math.max(0, ((val - minVisualBalance) / visRange) * 100));
  }

  return (
    <div className="space-y-6">
      {/* Firm selector */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <SectionHeader><Shield className="w-3.5 h-3.5" /> Prop Firm Ruleset</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <FieldLabel>Select Firm</FieldLabel>
            <select
              value={firmId}
              onChange={e => setFirmId(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/80 px-3 py-3 text-sm font-bold text-text-primary outline-none focus:border-accent rounded-lg"
            >
              {Object.entries(PROP_FIRMS_V2).map(([id, f]) => (
                <option key={id} value={id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Daily Loss", val: `${firm.maxDailyLoss}%`, sub: `${sym}${dailyLimit.toFixed(0)}` },
              { label: "Max DD",     val: `${firm.maxTotalLoss}%`, sub: `${sym}${totalLoss.toFixed(0)}` },
              { label: "Profit Split", val: `${firm.profitSplit}%`, sub: "to trader" },
            ].map(s => (
              <div key={s.label} className="bg-background-primary border border-border-slate/40 rounded-lg p-2 text-center">
                <p className="text-[8px] font-mono text-text-tertiary uppercase mb-1">{s.label}</p>
                <p className="text-sm font-bold font-mono text-text-primary">{s.val}</p>
                <p className="text-[8px] font-mono text-text-tertiary">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Rules badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: `DD Type: ${firm.drawdownType.replace(/_/g, " ")}`, active: firm.trailingDrawdown },
            { label: `News: ${firm.newsRestriction ? `${firm.newsMinutes}min blackout` : "No restriction"}`, active: firm.newsRestriction },
            { label: `Scaling: ${firm.scalingPlan ? "Available" : "None"}`, active: firm.scalingPlan },
            { label: `Copy Trading: ${firm.copyTrading ? "Prohibited" : "Allowed"}`, active: firm.copyTrading },
          ].map(r => (
            <span key={r.label} className={cn("px-2 py-1 text-[8px] font-mono font-bold border rounded uppercase",
              r.active ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"
            )}>
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* Section 2: Trailing Drawdown Calculator */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <SectionHeader><AlertTriangle className="w-3.5 h-3.5" /> Drawdown Floor Calculator</SectionHeader>
        <p className="text-[9px] font-mono text-text-tertiary mt-2 mb-4">
          {isTrailing ? "⚠️ This firm uses TRAILING drawdown — the floor rises with your peak equity." : "ℹ️ This firm uses BALANCE-BASED drawdown — the floor is fixed from your starting balance."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <FieldLabel>Account Start Balance ({sym})</FieldLabel>
              <FieldInput type="number" value={startBalance || ""} onChange={e => setStartBalance(+e.target.value)} />
            </div>
            {isTrailing && (
              <div>
                <FieldLabel>Peak Equity Reached ({sym})</FieldLabel>
                <FieldInput type="number" value={peakEquity || ""} onChange={e => setPeakEquity(+e.target.value)} />
              </div>
            )}
            <div>
              <FieldLabel>Current Equity Balance ({sym})</FieldLabel>
              <FieldInput type="number" value={currentEquityBalance || ""} onChange={e => setCurrentEquityBalance(+e.target.value)} />
            </div>
          </div>

          {/* Visual bar + stats */}
          <div className="space-y-4">
            <div className="flex gap-4 items-end h-40">
              {/* Visual balance bar */}
              <div className="relative flex-1 h-full bg-background-elevated rounded overflow-hidden">
                {/* Floor line */}
                <div className="absolute left-0 right-0 border-t-2 border-red-400 border-dashed z-10"
                  style={{ bottom: `${toPercent(floorBalance)}%` }} />
                {/* Peak equity dot */}
                {isTrailing && (
                  <div className="absolute left-0 right-0 border-t border-white/60 z-10"
                    style={{ bottom: `${toPercent(peakEquity)}%` }} />
                )}
                {/* Current balance bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 transition-all"
                  style={{ height: `${toPercent(currentEquityBalance)}%` }} />
                {/* Start balance line */}
                <div className="absolute left-0 right-0 border-t border-border-slate/60"
                  style={{ bottom: `${toPercent(startBalance)}%` }} />
              </div>
              {/* Legend */}
              <div className="text-[8px] font-mono text-text-tertiary space-y-2">
                {isTrailing && <div className="flex items-center gap-1"><div className="w-4 h-px bg-white/60" /> Peak</div>}
                <div className="flex items-center gap-1"><div className="w-4 h-2 bg-emerald-500/40" /> Equity</div>
                <div className="flex items-center gap-1"><div className="w-4 h-px bg-border-slate/60" /> Start</div>
                <div className="flex items-center gap-1"><div className="w-4 h-px border-t-2 border-dashed border-red-400" /> Floor</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-background-primary rounded p-2">
                <p className="text-text-tertiary text-[8px] uppercase">Drawdown Floor</p>
                <p className="font-bold text-red-400">{sym}{floorBalance.toFixed(0)}</p>
              </div>
              <div className={cn("rounded p-2", bufferPct < 25 ? "bg-red-50 border border-red-200" : bufferPct < 50 ? "bg-amber-50 border border-amber-200" : "bg-background-primary")}>
                <p className="text-text-tertiary text-[8px] uppercase">Buffer Left</p>
                <p className={cn("font-bold", bufferPct < 25 ? "text-red-500" : bufferPct < 50 ? "text-amber-500" : "text-emerald-500")}>
                  {sym}{bufferRemaining.toFixed(0)} ({bufferPct.toFixed(0)}%)
                </p>
              </div>
            </div>

            {/* Risk warnings */}
            {riskAmt > bufferRemaining * 0.5 && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-[9px] font-mono text-red-700">
                🔴 This trade risks more than 50% of your remaining buffer! Reduce size.
              </div>
            )}
            {riskAmt > bufferRemaining * 0.25 && riskAmt <= bufferRemaining * 0.5 && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[9px] font-mono text-amber-700">
                ⚠️ This trade risks more than 25% of your remaining drawdown buffer.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Compliance Checker */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader><CheckCircle className="w-3.5 h-3.5" /> Compliance Checker</SectionHeader>
          <div className={cn("px-3 py-1.5 text-xs font-black uppercase rounded", signalColor)}>
            {signal === "GO" ? "✅ GO" : signal === "CAUTION" ? "⚠️ CAUTION" : "❌ DO NOT TRADE"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <FieldLabel>Daily Loss Used ({sym})</FieldLabel>
            <FieldInput type="number" value={dailyUsed || ""} placeholder="0" onChange={e => setDailyUsed(+e.target.value)} />
          </div>
          <div>
            <FieldLabel>Days Traded</FieldLabel>
            <FieldInput type="number" value={daysTrade || ""} placeholder="0" onChange={e => setDaysTrade(+e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          {tradeChecks.map((c, i) => (
            <div key={i} className={cn("flex items-center gap-2.5 p-2.5 rounded-lg border text-[10px] font-mono",
              !c.pass ? "bg-red-50 border-red-200 text-red-700" :
              c.warn ? "bg-amber-50 border-amber-200 text-amber-700" :
              "bg-emerald-50 border-emerald-200 text-emerald-700"
            )}>
              <span>{!c.pass ? "❌" : c.warn ? "⚠️" : "✅"}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Recovery Calculator */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <SectionHeader><AlertTriangle className="w-3.5 h-3.5" /> Recovery Calculator</SectionHeader>
        <p className="text-[9px] font-mono text-text-tertiary mt-2 mb-4">Simulate paths back to target balance at different risk levels. Highlighted row = recommended approach.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <FieldLabel>Current Balance ({sym})</FieldLabel>
            <FieldInput type="number" value={recoveryCurrent || ""} onChange={e => setRecoveryCurrent(+e.target.value)} />
          </div>
          <div>
            <FieldLabel>Target Balance ({sym})</FieldLabel>
            <FieldInput type="number" value={recoveryTarget || ""} onChange={e => setRecoveryTarget(+e.target.value)} />
          </div>
          <div>
            <FieldLabel>Win Rate: {recoveryWinRate}%</FieldLabel>
            <input type="range" min="30" max="70" step="1" value={recoveryWinRate} onChange={e => setRecoveryWinRate(+e.target.value)}
              className="w-full h-1 accent-accent cursor-pointer mt-3" />
          </div>
          <div>
            <FieldLabel>RR Ratio: {recoveryRR}:1</FieldLabel>
            <input type="range" min="0.5" max="4" step="0.5" value={recoveryRR} onChange={e => setRecoveryRR(+e.target.value)}
              className="w-full h-1 accent-accent cursor-pointer mt-3" />
          </div>
        </div>

        <button onClick={runRecovery}
          className="w-full py-3 bg-[#0a0a0a] hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg mb-4 transition-all">
          Run Recovery Simulation (1,000 runs per risk level)
        </button>

        {recoveryResults && (
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border-slate/30 text-text-tertiary uppercase text-[9px]">
                <th className="py-2 text-left font-normal">Risk %</th>
                <th className="py-2 text-left font-normal">Risk Amount</th>
                <th className="py-2 text-left font-normal">Median Trades to Recover</th>
                <th className="py-2 text-left font-normal">P(Recover before -50%)</th>
                <th className="py-2 text-left font-normal">Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/10">
              {recoveryResults.map(r => {
                const isRecommended = r.riskPct === 0.5;
                const label = r.pSuccess > 0.8 ? "Good chance" : r.pSuccess > 0.5 ? "Possible" : "Risky";
                const cls = r.pSuccess > 0.8 ? "text-emerald-600" : r.pSuccess > 0.5 ? "text-amber-500" : "text-red-500";
                return (
                  <tr key={r.riskPct} className={cn("transition-colors",
                    isRecommended && "border-l-4 border-l-emerald-500 bg-emerald-50/20"
                  )}>
                    <td className={cn("py-2 pl-2 font-bold", isRecommended && "text-emerald-600")}>
                      {r.riskPct}%{isRecommended && " ★"}
                    </td>
                    <td className="py-2 text-text-secondary">{sym}{(recoveryCurrent * r.riskPct / 100).toFixed(0)}</td>
                    <td className="py-2 font-bold text-text-primary">{r.medianTrades} trades</td>
                    <td className={cn("py-2 font-bold", cls)}>{(r.pSuccess * 100).toFixed(1)}%</td>
                    <td className={cn("py-2", cls)}>{label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
