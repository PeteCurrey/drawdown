"use client";

import Link from "next/link";
import { 
  Compass, 
  Target, 
  Calculator, 
  Send, 
  BookOpen, 
  CheckSquare, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

const LOOP_STAGES = [
  {
    num: "01",
    title: "PREPARE",
    badge: "Session Bias",
    icon: Compass,
    action: "Define context before looking at entries",
    details: "Check macroeconomic calendar releases, high-impact news windows, and multi-timeframe directional bias across major asset classes.",
    output: "Daily trading context established",
  },
  {
    num: "02",
    title: "PLAN",
    badge: "Structure",
    icon: Target,
    action: "Map technical geometry and invalidation",
    details: "Define entry trigger, structural invalidation stop level, and multi-target take-profit zones with clear mathematical risk-to-reward ratio.",
    output: "Pre-committed price boundaries",
  },
  {
    num: "03",
    title: "SIZE",
    badge: "Risk Modeling",
    icon: Calculator,
    action: "Calculate lot size and drawdown impact",
    details: "Directly calculate exact position lot sizes based on your actual account balance and maximum drawdown thresholds. Never guess lot sizing.",
    output: "Exact lot size & monetary risk (£)",
  },
  {
    num: "04",
    title: "EXECUTE",
    badge: "Broker Terminal",
    icon: Send,
    action: "Transmit order at your regulated broker",
    details: "Execute the validated trade parameters through your broker terminal (e.g. TradingView, MT4/5, or spread betting provider).",
    output: "Order filled at external broker",
    disclosure: "Drawdown provides analytical decision-support; trade execution occurs directly at your broker/terminal.",
  },
  {
    num: "05",
    title: "RECORD",
    badge: "Institutional Log",
    icon: BookOpen,
    action: "Snapshot the plan and trade state",
    details: "Lock your pre-trade plan snapshot, record actual fill price, slippage, commission, and tag psychological/emotional mindset at entry.",
    output: "Immutable trade log with zero hindsight bias",
  },
  {
    num: "06",
    title: "REVIEW",
    badge: "Process Audit",
    icon: CheckSquare,
    action: "Audit execution against your rules",
    details: "Weekly review calculates true expectancy, process compliance score, emotional leakage patterns, and drawdown recovery metrics.",
    output: "Objective statistical feedback",
  },
  {
    num: "07",
    title: "IMPROVE",
    badge: "Targeted Refinement",
    icon: TrendingUp,
    action: "Commit to one weekly discipline fix",
    details: "Target one recurring mistake at a time with curated lessons and risk drills from the Drawdown curriculum.",
    output: "Continuous compounding edge",
  },
];

export function OperatingLoopSection() {
  return (
    <section
      className="w-full py-24 md:py-32 border-b select-none"
      style={{
        backgroundColor: "var(--paper-0)",
        borderColor: "var(--line-200)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.1em]"
            style={{ color: "var(--graphite-600)" }}
          >
            // The Operating Loop
          </span>
          <h2
            className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] tracking-[-0.02em] font-semibold"
            style={{ color: "var(--ink-950)" }}
          >
            Seven stages. One unbroken loop.
          </h2>
          <p
            className="text-[17px] leading-[1.6] font-sans"
            style={{ color: "var(--graphite-600)" }}
          >
            Drawdown transforms trading from an erratic guessing game into an engineered operating discipline. Every phase connects directly into the next.
          </p>
        </div>

        {/* 7-Stage Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-stretch mb-12">
          {LOOP_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isExecute = stage.title === "EXECUTE";

            return (
              <div
                key={idx}
                className="p-5 border flex flex-col justify-between transition-all hover:border-gray-900"
                style={{
                  backgroundColor: isExecute ? "rgba(15, 23, 42, 0.03)" : "#FFFFFF",
                  borderColor: isExecute ? "var(--signal-navy)" : "var(--line-200)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-gray-400">
                      {stage.num}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border bg-gray-50 text-gray-700 font-semibold" style={{ borderColor: "var(--line-200)" }}>
                      {stage.badge}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-900 mb-3">
                    <Icon size={16} strokeWidth={1.75} />
                  </div>

                  <h3 className="font-display text-base font-bold text-gray-900 uppercase tracking-tight mb-2">
                    {stage.title}
                  </h3>

                  <p className="text-xs font-medium text-gray-800 mb-2 leading-snug">
                    {stage.action}
                  </p>

                  <p className="text-[11px] text-gray-500 leading-relaxed font-sans mb-4">
                    {stage.details}
                  </p>
                </div>

                <div className="pt-3 border-t text-[10px] font-mono text-gray-700" style={{ borderColor: "var(--line-200)" }}>
                  <span className="text-gray-400 block mb-0.5">OUTCOME</span>
                  {stage.output}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explicit Disclosure & Callout */}
        <div
          className="p-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{
            backgroundColor: "#FAFAF9",
            borderColor: "var(--line-200)",
          }}
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Architectural Boundary Notice
            </span>
            <p className="text-xs text-gray-700 font-sans leading-relaxed max-w-3xl">
              <strong>Execution Transparency:</strong> Drawdown provides analytical decision-support, risk modeling, and journaling infrastructure. Drawdown does not route orders or hold client funds. Actual execution occurs at your independent, regulated broker terminal.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
          >
            Start Free — Run Your First Loop <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
