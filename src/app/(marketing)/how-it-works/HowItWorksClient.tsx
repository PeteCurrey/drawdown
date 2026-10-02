"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  PenLine,
  ArrowRightLeft,
  FileText,
  CheckSquare,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Calculator,
  Brain,
  ScanSearch,
} from "lucide-react";

const stages = [
  {
    number: "01",
    name: "Prepare",
    href: "/dashboard/prepare",
    icon: ClipboardCheck,
    question: "Am I within my limits and in the right state to trade today?",
    description:
      "Before any plan is drafted, you verify your account's daily and weekly loss thresholds, cross-reference watchlist instruments against the economic calendar, and answer a session readiness check. If the metrics or your mindset don't support a session, you record a valid stand-down — not a failure.",
    tools: ["Risk Calculator", "Economic Calendar"],
    outcome: "Outcome: ready / caution / stand_down",
    color: "indigo",
  },
  {
    number: "02",
    name: "Plan",
    href: "/dashboard/plan",
    icon: PenLine,
    question: "Do I have a clearly defined plan with an invalidation level and a position size?",
    description:
      "You build a structured trade plan: instrument, direction, entry zone, invalidation level, stop loss, target logic, and risk amount. The embedded position sizer calculates size from your account's risk policy. Once you mark the plan as ready, the original snapshot is locked and immutable.",
    tools: ["Position Sizer", "Trade Plan Builder"],
    outcome: "Plan Status: draft → ready → executed_elsewhere / not_taken",
    color: "blue",
  },
  {
    number: "03",
    name: "Execute Elsewhere",
    href: "/dashboard/plan",
    icon: ArrowRightLeft,
    question: "Did I place this trade through my broker independently?",
    description:
      "Drawdown does not execute, route, or transmit orders. The Execution Portal is a boundary page: you place the trade independently through your own broker, then return here to confirm placement. If the setup disappeared or you chose not to take it, you record the reason and the workflow closes cleanly.",
    tools: ["Execution Boundary Portal"],
    outcome: "Confirmed placed by user / Not taken (reason recorded)",
    color: "violet",
  },
  {
    number: "04",
    name: "Record",
    href: "/dashboard/record",
    icon: FileText,
    question: "Have I accurately recorded what actually happened?",
    description:
      "You enter the actual fills: entry, stop, exit, commissions, and financing. The original locked plan snapshot is displayed alongside so you can see exactly what changed. Emotional notes, screenshots, and tags complete the record. This is also called Journal in the navigation.",
    tools: ["AI Trade Journal", "CSV Import"],
    outcome: "Trade Record linked to Plan Snapshot",
    color: "purple",
  },
  {
    number: "05",
    name: "Review",
    href: "/dashboard/review",
    icon: CheckSquare,
    question: "Did I follow my rules — regardless of the outcome?",
    description:
      "Process quality is the headline. You score plan adherence, risk discipline, and journal completeness independently of the financial result. A winning trade that breached your rules cannot receive a perfect score. AI-assisted analysis is labelled clearly and can be corrected by you.",
    tools: ["Process Review Scorer", "AI Trade Analysis"],
    outcome: "Process Score (0–100). Outcome shown separately, not as headline.",
    color: "rose",
  },
  {
    number: "06",
    name: "Improve",
    href: "/dashboard/improve",
    icon: TrendingUp,
    question: "What is the one thing I am working on right now?",
    description:
      "One improvement commitment at a time. Sourced from your reviews, you identify a process strength, a process weakness, and select a single commitment under one of four categories: Process, Risk, Mindset, or Analysis. A contextual lesson link is attached — one, not five.",
    tools: ["Improvement Tracker", "Curriculum (contextual)"],
    outcome: "Active commitment with follow-through rate",
    color: "amber",
  },
  {
    number: "07",
    name: "Repeat Weekly",
    href: "/dashboard/weekly-review",
    icon: RefreshCw,
    question: "Did I run a consistent process this week — and what do I carry into next week?",
    description:
      "The Weekly Operating Review compiles sessions prepared, stand-downs, plans created, trades placed, and trades not taken. The headline metric is process consistency score, not profit. You sign off, review your previous commitment's outcome, and select the next commitment.",
    tools: ["Weekly Operating Review"],
    outcome: "Process Consistency signed off. New weekly commitment recorded.",
    color: "emerald",
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; icon: string; number: string }> = {
  indigo: { bg: "bg-indigo-50/50", border: "border-indigo-200/60", badge: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "text-indigo-600", number: "text-indigo-500" },
  blue:   { bg: "bg-blue-50/50",   border: "border-blue-200/60",   badge: "bg-blue-100 text-blue-700 border-blue-200",     icon: "text-blue-600",   number: "text-blue-400"   },
  violet: { bg: "bg-violet-50/50", border: "border-violet-200/60", badge: "bg-violet-100 text-violet-700 border-violet-200", icon: "text-violet-600", number: "text-violet-400" },
  purple: { bg: "bg-purple-50/50", border: "border-purple-200/60", badge: "bg-purple-100 text-purple-700 border-purple-200", icon: "text-purple-600", number: "text-purple-400" },
  rose:   { bg: "bg-rose-50/50",   border: "border-rose-200/60",   badge: "bg-rose-100 text-rose-700 border-rose-200",     icon: "text-rose-600",   number: "text-rose-400"   },
  amber:  { bg: "bg-amber-50/50",  border: "border-amber-200/60",  badge: "bg-amber-100 text-amber-700 border-amber-200",   icon: "text-amber-600",  number: "text-amber-400"  },
  emerald:{ bg: "bg-emerald-50/50",border: "border-emerald-200/60",badge: "bg-emerald-100 text-emerald-700 border-emerald-200",icon: "text-emerald-600",number: "text-emerald-400"},
};

export default function HowItWorksClient() {
  return (
    <div className="bg-white text-[#1A1A1A]">
      
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] mb-4">
          // The Drawdown Operating System
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight mb-6">
          A Trading Process You Can Actually Review
        </h1>
        <p className="text-lg text-[#555550] leading-relaxed max-w-2xl mx-auto mb-8">
          Every Drawdown capability — risk tools, journals, market intelligence, education — has a defined role in one repeatable 7-stage discipline process. This is not a dashboard. It is an operating system.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="px-8 py-3.5 bg-[#181818] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#333330] transition-colors"
          >
            Start for Free
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 border border-[#DEDDD8] text-[#555550] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#F4F4F0] transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* ── Process Line ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#888880]">
          {stages.map((stage, i) => (
            <span key={stage.number} className="flex items-center gap-2">
              <span className={cn("font-bold", colorMap[stage.color].number)}>{stage.name}</span>
              {i < stages.length - 1 && <span className="text-[#C8CBB8]">→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stage Cards ──────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-10">
        {stages.map((stage) => {
          const c = colorMap[stage.color];
          const Icon = stage.icon;
          return (
            <div
              key={stage.number}
              className={cn("p-8 rounded-2xl border", c.bg, c.border)}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn("text-4xl font-black font-mono opacity-25", c.number)}>{stage.number}</span>
                    <Icon className={cn("w-6 h-6", c.icon)} />
                  </div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Stage {parseInt(stage.number)}: {stage.name}</h2>
                </div>

                <div className="flex-1 space-y-4">
                  <blockquote className="text-sm font-semibold text-[#1A1A1A] italic border-l-2 border-current pl-4" style={{ borderColor: "currentColor" }}>
                    "{stage.question}"
                  </blockquote>
                  <p className="text-sm text-[#555550] leading-relaxed">{stage.description}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {stage.tools.map(tool => (
                      <span key={tool} className={cn("text-[9px] font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider", c.badge)}>
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-start justify-between gap-4">
                    <p className="text-[10px] font-mono text-[#888880]">{stage.outcome}</p>
                    <Link
                      href={stage.href}
                      className={cn(
                        "shrink-0 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider hover:underline",
                        c.icon
                      )}
                    >
                      Open Stage <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────────────── */}
      <section className="border-t border-[#EDEDED] bg-[#F9F9F7]">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-3">
          <p className="text-xs text-[#888880] leading-relaxed">
            Drawdown does not execute trades, route orders, provide personal financial advice, or manage client money. 
            All trades are placed independently by users through their own broker accounts. 
            Education and tools are provided for informational purposes only. 
            Trading involves significant risk of loss and is not suitable for everyone.
          </p>
          <Link href="/disclaimer" className="text-xs font-mono text-indigo-500 hover:underline">
            Read full disclaimer →
          </Link>
        </div>
      </section>

    </div>
  );
}
