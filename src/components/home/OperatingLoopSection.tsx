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
import { Reveal } from "@/components/ui/Reveal";
import { CardAtmosphere, PatternType } from "@/components/ui/CardAtmosphere";

const LOOP_STAGES: Array<{
  num: string;
  title: string;
  badge: string;
  icon: any;
  action: string;
  details: string;
  output: string;
  disclosure?: string;
  pattern: PatternType;
}> = [
  {
    num: "01",
    title: "PREPARE",
    badge: "Session Bias",
    icon: Compass,
    action: "Define context before looking at entries",
    details: "Check macroeconomic calendar releases, high-impact news windows, and multi-timeframe directional bias across major asset classes.",
    output: "Daily trading context established",
    pattern: "topographic",
  },
  {
    num: "02",
    title: "PLAN",
    badge: "Structure",
    icon: Target,
    action: "Map technical geometry and invalidation",
    details: "Define entry trigger, structural invalidation stop level, and multi-target take-profit zones with clear mathematical risk-to-reward ratio.",
    output: "Pre-committed price boundaries",
    pattern: "dot-matrix",
  },
  {
    num: "03",
    title: "SIZE",
    badge: "Risk Modeling",
    icon: Calculator,
    action: "Calculate lot size and drawdown impact",
    details: "Directly calculate exact position lot sizes based on your actual account balance and maximum drawdown thresholds. Never guess lot sizing.",
    output: "Exact lot size & monetary risk (£)",
    pattern: "plotted-curve",
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
    pattern: "grid-mesh",
  },
  {
    num: "05",
    title: "RECORD",
    badge: "Institutional Log",
    icon: BookOpen,
    action: "Snapshot the plan and trade state",
    details: "Lock your pre-trade plan snapshot, record actual fill price, slippage, commission, and tag psychological/emotional mindset at entry.",
    output: "Immutable trade log with zero hindsight bias",
    pattern: "candlestick-wave",
  },
  {
    num: "06",
    title: "REVIEW",
    badge: "Process Audit",
    icon: CheckSquare,
    action: "Audit execution against your rules",
    details: "Weekly review calculates true expectancy, process compliance score, emotional leakage patterns, and drawdown recovery metrics.",
    output: "Objective statistical feedback",
    pattern: "isobar",
  },
  {
    num: "07",
    title: "IMPROVE",
    badge: "Targeted Refinement",
    icon: TrendingUp,
    action: "Commit to one weekly discipline fix",
    details: "Target one recurring mistake at a time with curated lessons and risk drills from the Drawdown curriculum.",
    output: "Continuous compounding edge",
    pattern: "circuit-lines",
  },
];

export function OperatingLoopSection() {
  return (
    <section
      id="operating-loop"
      className="w-full border-b select-none"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.05)",
        paddingTop: "var(--section-y-desktop)",
        paddingBottom: "var(--section-y-desktop)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sticky Left Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <Reveal>
              <div className="space-y-4">
                <span
                  className="block type-label uppercase tracking-widest"
                  style={{ color: "var(--text-secondary)" }}
                >
                  THE OPERATING LOOP
                </span>
                <h2
                  className="type-display-lg font-normal tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Seven stages. <br />
                  One unbroken loop.
                </h2>
                <p
                  className="type-body-lg font-normal leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Drawdown transforms trading from an erratic guessing game into an engineered operating discipline. Every phase connects directly into the next.
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 font-sans text-sm font-medium transition-all duration-150 active:translate-y-0.5"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#FFFFFF",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "0 2px 8px rgba(16,24,40,0.12)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                >
                  Start Free — Run Your First Loop <ArrowRight size={15} strokeWidth={1.5} />
                </Link>

                {/* Execution Transparency Callout */}
                <div
                  className="p-5 border space-y-2 mt-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(0,0,0,0.06)",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(16,24,40,0.03)",
                  }}
                >
                  <span className="type-label uppercase font-bold block" style={{ color: "var(--text-secondary)" }}>
                    Execution Transparency
                  </span>
                  <p className="text-xs font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Drawdown provides analytical decision-support, risk modeling, and journaling infrastructure. Drawdown does not route orders or hold client funds. Actual execution occurs at your independent, regulated broker terminal.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Scrolling Right Detail Cards */}
          <div className="lg:col-span-7 space-y-4 relative">
            {LOOP_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isExecute = stage.title === "EXECUTE";

              return (
                <Reveal key={idx} delay={0.05}>
                  <div
                    className="p-6 md:p-8 border transition-all duration-300 relative overflow-hidden group hover:shadow-[var(--elev-2)]"
                    style={{
                      backgroundColor: isExecute ? "rgba(22, 33, 62, 0.02)" : "#FFFFFF",
                      borderColor: isExecute ? "var(--accent)" : "rgba(0,0,0,0.06)",
                      borderRadius: "12px",
                      boxShadow: isExecute ? "0 2px 8px rgba(22, 33, 62, 0.06)" : "var(--elev-1)",
                    }}
                  >
                    {/* Subtle atmosphere background revealing on hover */}
                    <CardAtmosphere pattern={stage.pattern} accentColor="var(--accent)" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono tabular-nums text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                            {stage.num}
                          </span>
                          <h3
                            className="font-sans text-base font-bold uppercase tracking-wide"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {stage.title}
                          </h3>
                        </div>
                        <span
                          className="text-[10px] font-mono uppercase px-2.5 py-0.5 border font-semibold"
                          style={{
                            backgroundColor: isExecute ? "var(--accent-muted)" : "var(--surface-base)",
                            borderColor: isExecute ? "var(--accent)" : "var(--border-subtle)",
                            borderRadius: "var(--radius-pill)",
                            color: isExecute ? "var(--accent)" : "var(--text-secondary)",
                          }}
                        >
                          {stage.badge}
                        </span>
                      </div>

                      <p className="text-sm font-medium mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>
                        {stage.action}
                      </p>

                      <p className="text-xs leading-relaxed font-sans mb-5" style={{ color: "var(--text-secondary)" }}>
                        {stage.details}
                      </p>

                      <div className="pt-4 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: "var(--border-subtle)" }}>
                        <span className="type-label uppercase" style={{ color: "var(--text-tertiary)" }}>OUTCOME</span>
                        <span className="font-medium text-right" style={{ color: "var(--text-primary)" }}>
                          {stage.output}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
