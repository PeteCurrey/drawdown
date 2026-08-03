"use client";

import React, { useMemo } from "react";
import { 
  ShieldAlert, Brain, Award, Zap, AlertTriangle, AlertCircle, 
  TrendingUp, TrendingDown, Clock, ThumbsUp, ThumbsDown, Sparkles 
} from "lucide-react";
import type { TradeEntry } from "./types";
import { cn } from "@/lib/utils";

interface BehavioralDiagnosticViewProps {
  trades: TradeEntry[];
}

export function BehavioralDiagnosticView({ trades }: BehavioralDiagnosticViewProps) {
  const closedTrades = useMemo(() => trades.filter(t => t.status === "CLOSED"), [trades]);

  const diagnostics = useMemo(() => {
    if (closedTrades.length === 0) return null;

    let fomoCount = 0;
    let revengeCount = 0;
    let overSizeCount = 0;
    let disciplineCount = 0;
    let anxietyCount = 0;

    let totalWins = 0;
    let winAmount = 0;
    let lossAmount = 0;

    // Track state by emotion
    const emotionPnL: Record<string, { count: number; pnl: number; wins: number }> = {};
    // Track session patterns
    const sessionPnL: Record<string, { count: number; pnl: number; wins: number }> = {};

    closedTrades.forEach(t => {
      const pnl = t.pnl_amount ?? 0;
      const isWin = pnl > 0;
      if (isWin) {
        totalWins++;
        winAmount += pnl;
      } else {
        lossAmount += Math.abs(pnl);
      }

      // 1. FOMO indicators
      const hasFomoEmotion = t.emotions_before === "FOMO";
      const hasFomoMistake = t.mistakes?.some(m => 
        m.toLowerCase().includes("fomo") || 
        m.toLowerCase().includes("chasing") || 
        m.toLowerCase().includes("early")
      ) ?? false;
      const hasFomoAiTag = t.ai_tags_auto?.some(tag => 
        tag.toLowerCase().includes("fomo") || 
        tag.toLowerCase().includes("chasing")
      ) ?? false;

      if (hasFomoEmotion || hasFomoMistake || hasFomoAiTag) {
        fomoCount++;
      }

      // 2. Revenge indicators
      const hasRevengeEmotion = t.emotions_before === "REVENGE";
      const hasRevengeMistake = t.mistakes?.some(m => 
        m.toLowerCase().includes("revenge") || 
        m.toLowerCase().includes("overtrading")
      ) ?? false;

      if (hasRevengeEmotion || hasRevengeMistake) {
        revengeCount++;
      }

      // 3. Oversized indicators
      const hasOversizedMistake = t.mistakes?.some(m => 
        m.toLowerCase().includes("oversiz") || 
        m.toLowerCase().includes("leverage")
      ) ?? false;
      const isOversizedRisk = (t.risk_percent ?? 0) > 2.0;

      if (hasOversizedMistake || isOversizedRisk) {
        overSizeCount++;
      }

      // 4. Discipline indicators
      if (t.rules_followed === true && t.checklist_completed === true) {
        disciplineCount++;
      }

      // 5. Anxiety indicators
      const hasAnxietyDuring = t.emotions_during === "ANXIOUS" || t.emotions_during === "PANICKED";
      const hasFearMistake = t.mistakes?.some(m => 
        m.toLowerCase().includes("early_exit") || 
        m.toLowerCase().includes("scared") || 
        m.toLowerCase().includes("moved")
      ) ?? false;

      if (hasAnxietyDuring || hasFearMistake) {
        anxietyCount++;
      }

      // Emotion groupings
      const eb = t.emotions_before ?? "NEUTRAL";
      if (!emotionPnL[eb]) emotionPnL[eb] = { count: 0, pnl: 0, wins: 0 };
      emotionPnL[eb].count++;
      emotionPnL[eb].pnl += pnl;
      if (isWin) emotionPnL[eb].wins++;

      // Session groupings
      const sess = t.session ?? "LONDON";
      if (!sessionPnL[sess]) sessionPnL[sess] = { count: 0, pnl: 0, wins: 0 };
      sessionPnL[sess].count++;
      sessionPnL[sess].pnl += pnl;
      if (isWin) sessionPnL[sess].wins++;
    });

    const total = closedTrades.length;

    // Behavioral insights engine
    const insights: string[] = [];

    // Rule 1: Analyze over-confidence vs anxiety
    const confidentStats = emotionPnL["CONFIDENT"];
    if (confidentStats && confidentStats.count >= 2) {
      const confWinRate = (confidentStats.wins / confidentStats.count) * 100;
      if (confWinRate < 40) {
        insights.push(
          `Over-Confidence Trap: You logged ${confidentStats.count} trades with a "CONFIDENT" pre-trade state, but achieved only a ${confWinRate.toFixed(0)}% win rate. Check if you are ignoring key confluences when feeling sure.`
        );
      }
    }

    // Rule 2: Revenge trade penalty
    if (revengeCount >= 1) {
      const revengeTrades = closedTrades.filter(t => 
        t.emotions_before === "REVENGE" || 
        t.mistakes?.some(m => m.toLowerCase().includes("revenge"))
      );
      const revengeLoss = revengeTrades.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
      if (revengeLoss < 0) {
        insights.push(
          `Revenge Trading Cost: Emotional over-trading has cost you £${Math.abs(revengeLoss).toLocaleString("en-GB", { maximumFractionDigits: 0 })}. These entries bypass your setup checklist and carry high drawdown risks.`
        );
      }
    }

    // Rule 3: Session specific behavior
    Object.entries(sessionPnL).forEach(([sess, data]) => {
      if (data.count >= 3) {
        const wr = (data.wins / data.count) * 100;
        if (wr < 35) {
          insights.push(
            `Session Fatigue: Your win rate drops to ${wr.toFixed(0)}% during the ${sess} session. Consider reducing size or restricting activity to peak hours of your main session.`
          );
        }
      }
    });

    // Rule 4: Process compliance reward
    const compliantTrades = closedTrades.filter(t => t.rules_followed === true);
    if (compliantTrades.length >= 2) {
      const compWins = compliantTrades.filter(t => (t.pnl_amount ?? 0) > 0).length;
      const compWR = (compWins / compliantTrades.length) * 100;
      insights.push(
        `Discipline Advantage: Trades where you strictly followed your rules have a ${compWR.toFixed(0)}% win rate. Staying fully compliant is your primary mathematical edge.`
      );
    }

    return {
      fomoPct: (fomoCount / total) * 100,
      revengePct: (revengeCount / total) * 100,
      overSizePct: (overSizeCount / total) * 100,
      disciplinePct: (disciplineCount / total) * 100,
      anxietyPct: (anxietyCount / total) * 100,
      insights
    };
  }, [closedTrades]);

  if (closedTrades.length === 0) {
    return (
      <div className="bg-white border border-gray-100 p-8 text-center rounded-xl font-mono text-xs text-gray-400">
        Analyze your behavioral and psychological profile by closing and logging at least 1 trade.
      </div>
    );
  }

  const d = diagnostics!;

  // Get color for audit meters
  const getMeterColor = (pct: number, inverse = false) => {
    if (inverse) {
      // higher is better
      return pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
    }
    // lower is better (risk meters)
    return pct >= 40 ? "bg-red-500" : pct >= 15 ? "bg-amber-500" : "bg-emerald-500";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Discipline / Rule Score */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Rule Discipline</p>
              <h3 className="text-2xl font-bold font-display text-gray-900 mt-1">{d.disciplinePct.toFixed(0)}%</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", getMeterColor(d.disciplinePct, true))} style={{ width: `${d.disciplinePct}%` }} />
            </div>
            <p className="text-[10px] font-mono text-gray-400 mt-2">
              Percentage of trades with a complete checklist and rules followed.
            </p>
          </div>
        </div>

        {/* FOMO Index */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">FOMO Index</p>
              <h3 className="text-2xl font-bold font-display text-gray-900 mt-1">{d.fomoPct.toFixed(0)}%</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", getMeterColor(d.fomoPct))} style={{ width: `${d.fomoPct}%` }} />
            </div>
            <p className="text-[10px] font-mono text-gray-400 mt-2">
              Trades triggered by market chase or early execution impulses.
            </p>
          </div>
        </div>

        {/* Revenge Risk */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Revenge Exposure</p>
              <h3 className="text-2xl font-bold font-display text-gray-900 mt-1">{d.revengePct.toFixed(0)}%</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", getMeterColor(d.revengePct))} style={{ width: `${d.revengePct}%` }} />
            </div>
            <p className="text-[10px] font-mono text-gray-400 mt-2">
              Trades logged as attempts to "win back" losses after negative sessions.
            </p>
          </div>
        </div>

      </div>

      {/* Main Diagnostic Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Insights and Directives */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">Psychological Behavior Audit</h4>
          </div>

          {d.insights.length > 0 ? (
            <div className="space-y-4">
              {d.insights.map((insight, i) => {
                const isPositive = insight.includes("Advantage") || insight.includes("Discipline");
                return (
                  <div key={i} className={cn("flex gap-3 p-4 rounded-lg text-xs leading-relaxed font-mono border", 
                    isPositive 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                      : "bg-red-50 border-red-100 text-red-800"
                  )}>
                    {isPositive ? (
                      <ThumbsUp className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <div>{insight}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 font-mono text-xs">
              No strong psychological patterns identified yet. Log more trades to build statistical accuracy.
            </div>
          )}

          {/* Sessional Drawdown Caution banner if high risks found */}
          {(d.fomoPct > 35 || d.revengePct > 20 || d.overSizePct > 20) && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 text-xs leading-relaxed font-mono text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>WARNING // DRAWDOWN LEAK DETECTED:</strong> Your behavioral stats signal elevated emotional trading. If funded or taking a prop challenge, this leakage is highly likely to trigger maximum daily or total loss limits. Use the sessional position sizer daily loss guidelines immediately.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mini Risk Metrics */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">Emotional Vulnerabilities</h4>
          </div>

          <div className="space-y-4">
            {[
              { label: "Anxiety & Fear", val: d.anxietyPct, desc: "Early exits and moving stop-losses prematurely" },
              { label: "Over-leveraging", val: d.overSizePct, desc: "Sizing position larger than strategy limits" },
            ].map((metric, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-gray-500">{metric.label}</span>
                  <span className={cn("font-bold", getMeterColor(metric.val).replace("bg-", "text-"))}>{metric.val.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", getMeterColor(metric.val))} style={{ width: `${metric.val}%` }} />
                </div>
                <p className="text-[9px] text-gray-400 font-mono leading-tight">{metric.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-[10px] font-mono text-gray-400 leading-relaxed space-y-1.5">
            <p className="text-gray-900 font-bold uppercase text-[9px]">Self-Regulation Tip:</p>
            <p>
              Traders who log pre-trade emotions experience up to a 43% lower maximum drawdown because they pause and evaluate sessional compliance before hitting execute.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
