"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FRAGMENTED_TABS = [
  { tab: "Tab 1: TradingView", issue: "Charting & technical drawings isolated from risk parameters" },
  { tab: "Tab 2: Web Lot Calculator", issue: "Manual pip calculation with no memory of account balance or drawdown rules" },
  { tab: "Tab 3: ForexFactory / News", issue: "Checking economic calendar in a separate browser window minutes before entry" },
  { tab: "Tab 4: Notion / Spreadsheet", issue: "Manually copying fill prices hours after the trade — if you remember to log it at all" },
  { tab: "Tab 5: Broker Terminal", issue: "Entering positions in emotional heat without a pre-committed, locked trade plan" },
  { tab: "Tab 6: Discord / Twitter", issue: "Noise and second-guessing distracting from your own documented process" },
];

const CONNECTED_WORKFLOW = [
  { stage: "Prepare", solution: "Sessional macro bias, economic calendar, and volatility windows in one workspace" },
  { stage: "Plan & Size", solution: "Structural stops, exact lot sizes, and drawdown risk calculated simultaneously via RUN MY TRADE" },
  { stage: "Execute & Record", solution: "One-click snapshot lock of your plan before transmitting orders to your broker" },
  { stage: "Review & Improve", solution: "Weekly process auditing, emotion-pattern recognition, and targeted curriculum drills" },
];

export function FragmentedProblemSection() {
  return (
    <section
      className="w-full py-20 md:py-28 border-b select-none"
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
            // The Core Problem
          </span>
          <h2
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.12] tracking-[-0.02em] font-semibold"
            style={{ color: "var(--ink-950)" }}
          >
            Serious traders are forced to use fragmented tools.
          </h2>
          <p
            className="text-[17px] leading-[1.6] font-sans"
            style={{ color: "var(--graphite-600)" }}
          >
            Most trading errors do not happen because the chart was wrong. They happen at the seams between disconnected tools — when a rushed lot calculation, a missed economic release, or an emotional impulse overrides your discipline.
          </p>
        </div>

        {/* Comparison Grid: Fragmented vs. Operating System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Fragmented Stack */}
          <div
            className="lg:col-span-6 p-8 md:p-10 border flex flex-col justify-between"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.02)",
              borderColor: "var(--line-200)",
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--line-200)" }}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-red-600 font-bold block mb-1">
                    The Fragmented Reality
                  </span>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    Six Browser Tabs. Zero Accountability.
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-mono text-xs font-bold">
                  ✕
                </div>
              </div>

              <div className="space-y-4">
                {FRAGMENTED_TABS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✕
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-900 block">{item.tab}</span>
                      <span className="text-gray-500 text-xs leading-relaxed">{item.issue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t font-mono text-xs text-red-700 bg-red-50/50 p-3 rounded" style={{ borderColor: "var(--line-200)" }}>
              ⚠️ Friction causes execution mistakes, position sizing miscalculations, and unrecorded losing streaks.
            </div>
          </div>

          {/* Right: The Drawdown Operating System */}
          <div
            className="lg:col-span-6 p-8 md:p-10 border flex flex-col justify-between"
            style={{
              backgroundColor: "#FAFAF9",
              borderColor: "var(--line-200)",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--line-200)" }}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-emerald-600 font-bold block mb-1">
                    The Drawdown Operating System
                  </span>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    One Unified Decision Loop
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-mono text-xs font-bold">
                  ✓
                </div>
              </div>

              <div className="space-y-4">
                {CONNECTED_WORKFLOW.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✓
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-900 block uppercase tracking-wider">{item.stage}</span>
                      <span className="text-gray-600 text-xs leading-relaxed">{item.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--line-200)" }}>
              <div className="font-mono text-xs text-gray-600">
                Every trade planned, validated, and logged under one strict risk framework.
              </div>
              <Link
                href="/signup"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Experience Free <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
