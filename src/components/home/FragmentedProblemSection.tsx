"use client";

import Link from "next/link";
import { ArrowRight, Check, X, AlertTriangle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealGroup } from "@/components/ui/RevealGroup";

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
  { stage: "Plan & Size", solution: "Structural stops, exact lot sizes, and drawdown risk calculated simultaneously via Plan My Trade" },
  { stage: "Execute & Record", solution: "One-click snapshot lock of your plan before transmitting orders to your broker" },
  { stage: "Review & Improve", solution: "Weekly process auditing, emotion-pattern recognition, and targeted curriculum drills" },
];

export function FragmentedProblemSection() {
  return (
    <section
      className="w-full py-20 md:py-28 border-b select-none"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <Reveal>
        <div className="max-w-3xl mb-16 space-y-4">
          <span
            className="block type-label uppercase mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            THE PROBLEM
          </span>
          <h2
            className="type-display-lg font-normal"
            style={{ color: "var(--text-primary)" }}
          >
            Serious traders are forced to use fragmented tools.
          </h2>
          <p
            className="type-body-lg font-normal"
            style={{ color: "var(--text-secondary)" }}
          >
            Most trading errors do not happen because the chart was wrong. They happen at the seams between disconnected tools — when a rushed lot calculation, a missed economic release, or an emotional impulse overrides your discipline.
          </p>
        </div>
        </Reveal>

        {/* Comparison Grid: Fragmented vs. Operating System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Fragmented Stack */}
          <Reveal delay={0.05} className="lg:col-span-6">
          <div
            className="h-full p-8 md:p-10 border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-1)",
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--border-subtle)" }}>
                <div>
                  <span 
                    className="text-[10px] font-mono uppercase tracking-[0.1em] font-bold block mb-1"
                    style={{ color: "var(--market-down)" }}
                  >
                    The Fragmented Reality
                  </span>
                  <h3 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Six Browser Tabs. Zero Accountability.
                  </h3>
                </div>
                <div 
                  className="w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--market-down) 10%, transparent)",
                    borderColor: "color-mix(in srgb, var(--market-down) 25%, transparent)",
                    color: "var(--market-down)"
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-4">
                {FRAGMENTED_TABS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--market-down) 10%, transparent)",
                        color: "var(--market-down)"
                      }}
                    >
                      <X className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold block" style={{ color: "var(--text-primary)" }}>{item.tab}</span>
                      <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.issue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="mt-8 pt-6 border-t font-mono text-xs p-3 flex items-center gap-2" 
              style={{ 
                borderColor: "var(--border-subtle)",
                color: "var(--market-flat)",
                backgroundColor: "color-mix(in srgb, var(--market-flat) 10%, transparent)",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-[var(--market-flat)]" />
              <span>Friction causes execution mistakes, position sizing miscalculations, and unrecorded losing streaks.</span>
            </div>
          </div>
          </Reveal>

          {/* Right: The Drawdown Operating System */}
          <Reveal delay={0.12} className="lg:col-span-6">
          <div
            className="h-full p-8 md:p-10 border flex flex-col justify-between transition-all duration-200"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-3)",
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--border-subtle)" }}>
                <div>
                  <span 
                    className="text-[10px] font-mono uppercase tracking-[0.1em] font-bold block mb-1"
                    style={{ color: "var(--market-up)" }}
                  >
                    The Drawdown Operating System
                  </span>
                  <h3 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    One Unified Decision Loop
                  </h3>
                </div>
                <div 
                  className="w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                    borderColor: "color-mix(in srgb, var(--market-up) 25%, transparent)",
                    color: "var(--market-up)"
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-4">
                {CONNECTED_WORKFLOW.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                        color: "var(--market-up)"
                      }}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold block uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>{item.stage}</span>
                      <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                Every trade planned, validated, and logged under one strict risk framework.
              </div>
              <Link
                href="/signup"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:opacity-90 active:translate-y-0.5"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--surface-base)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--elev-1)"
                }}
              >
                Experience Free <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
