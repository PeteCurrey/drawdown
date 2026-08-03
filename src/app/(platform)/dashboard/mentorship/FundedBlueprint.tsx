"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Award, Flame, TrendingUp, ShieldAlert, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  phase: number;
  title: string;
  subtitle: string;
  disciplineTarget: string;
  drawdownCap: string;
  focus: string;
  checklist: string[];
}

const MILESTONES: Milestone[] = [
  {
    phase: 1,
    title: "Sessional Challenge Prep",
    subtitle: "Rule discipline and habit building",
    disciplineTarget: "90% Adherence",
    drawdownCap: "Daily Max 3.5%",
    focus: "Establish core setups, eliminate revenge trading, and stabilize sessional size.",
    checklist: [
      "Log 20 consecutive trades with strict stop-losses",
      "Keep average risk per trade under 1.0%",
      "Achieve zero 'Revenge Trade' flags in your AI Journal psychology audit"
    ]
  },
  {
    phase: 2,
    title: "Evaluation Optimization",
    subtitle: "Squeezing edge and maximizing profit",
    disciplineTarget: "85% Win-Confluence",
    drawdownCap: "Total Max 6.0%",
    focus: "Focus on risk-to-reward ratios (min 1:2) and filter for high-confluence setups.",
    checklist: [
      "Secure an average risk-to-reward ratio of 1:2.2",
      "Achieve a 48%+ win rate on Forex or Commodities over 30 days",
      "Use the Monte Carlo Position Sizer to maintain a <1% ruin probability"
    ]
  },
  {
    phase: 3,
    title: "Funded Buffer Shielding",
    subtitle: "Protecting live capital & securing payouts",
    disciplineTarget: "95% Capital Safety",
    drawdownCap: "Daily Max 2.5%",
    focus: "Protect the funded account. Build a safety cushion before taking higher-size setups.",
    checklist: [
      "Build a 3% cash buffer using conservative 0.5% sizing",
      "Establish strict macro-news halts during FOMC/CPI releases",
      "Successfully secure your first bi-weekly profit split"
    ]
  },
  {
    phase: 4,
    title: "Account Scaling Blueprint",
    subtitle: "Expanding size and allocation tiers",
    disciplineTarget: "98% Risk Perfection",
    drawdownCap: "Drawdown Buffer 4.0%",
    focus: "Scale your trading account using a professional milestone compounding framework.",
    checklist: [
      "Achieve 10% total net gain while keeping maximum drawdowns under 3%",
      "Formulate a multi-account risk management layout",
      "Submit performance log for 25% allocation scale-up with Pete"
    ]
  }
];

export function FundedBlueprint() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const currentMilestone = MILESTONES[activePhase - 1];

  return (
    <div className="bg-gradient-to-br from-[#12131C] to-[#1C1E2D] text-white rounded-xl border border-slate-800/80 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/60 bg-[#0E0F17]/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-[13px] tracking-wider font-mono text-slate-200">FUNDED BLUEPRINT</h3>
            <p className="text-[11px] text-slate-400">Track and scale your prop progress</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Floor Edge
        </span>
      </div>

      {/* Phase selection tabs */}
      <div className="grid grid-cols-4 border-b border-slate-800/50 text-center text-xs font-mono">
        {MILESTONES.map((m) => (
          <button
            key={m.phase}
            onClick={() => setActivePhase(m.phase)}
            className={cn(
              "py-3 border-b-2 transition-all flex flex-col items-center gap-1",
              activePhase === m.phase
                ? "border-amber-500 text-amber-400 bg-amber-500/[0.03] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/10"
            )}
          >
            <span className="text-[10px] uppercase">PHASE</span>
            <span className="text-sm font-bold">0{m.phase}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Challenge & Focus */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">
              <Flame className="w-3.5 h-3.5" /> Milestone Challenge 0{currentMilestone.phase}
            </div>
            <h4 className="text-md font-bold text-slate-100">{currentMilestone.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{currentMilestone.subtitle}</p>
          </div>

          {/* Targets grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0E0F17]/50 rounded-lg p-3 border border-slate-800/40">
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Discipline Target</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {currentMilestone.disciplineTarget}
              </span>
            </div>
            <div className="bg-[#0E0F17]/50 rounded-lg p-3 border border-slate-800/40">
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Drawdown Cap</span>
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {currentMilestone.drawdownCap}
              </span>
            </div>
          </div>

          {/* Strategy Focus */}
          <div className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-slate-800/30 flex gap-3">
            <BookOpen className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block mb-1">Coaching Focus:</span>
              {currentMilestone.focus}
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Checklist */}
        <div className="space-y-5 md:border-l md:border-slate-800/40 md:pl-8">
          <div className="space-y-2.5">
            <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Milestone Checklist</span>
            <div className="space-y-2">
              {currentMilestone.checklist.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 bg-slate-900/20 p-2.5 rounded-lg border border-slate-800/10 hover:border-slate-800/40 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer advice */}
      <div className="p-4 bg-[#0E0F17]/60 border-t border-slate-800/40 text-center">
        <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
          Ready to review Phase 0{currentMilestone.phase} logs?
          <span className="block text-amber-400 font-bold mt-1 animate-pulse">Select a sessional slot in the calendar to lock in your coaching.</span>
        </p>
      </div>
    </div>
  );
}
