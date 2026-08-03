"use client";

import { Shield, Activity, History, FileText } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CAPABILITIES GRID
//
// Single clean grid — no marquee duplication loop.
// Text-first cards with hairline top rules.
// Lucide icons (stroke 1.5, 20px, near-black) used ONLY where a literal,
// unambiguous icon exists. Abstract concepts (Tax Efficiency, Behavioral Logs,
// Consensus Signals) use text-only cards with top hairline.
// Zero border radius throughout. Zero emoji.
// ─────────────────────────────────────────────────────────────────────────────

interface Feature {
  title: string;
  description: string;
  icon?: any;
}

const features: Feature[] = [
  {
    title: "Risk Thresholds",
    description: "Hardcoded drawdown boundaries that enforce absolute risk discipline on every trade.",
    icon: Shield,
  },
  {
    title: "Tax Efficiency",
    description: "Optimised account models designed to minimise spread betting tax liabilities.",
  },
  {
    title: "Spread Monitoring",
    description: "Real-time tracking of broker bid-ask spreads during high-volatility sessions.",
    icon: Activity,
  },
  {
    title: "Behavioral Logs",
    description: "Automated analysis that isolates emotional triggers and prevents revenge trading.",
  },
  {
    title: "Backtest Depth",
    description: "Historical testing against pure price action across major FX pairs.",
    icon: History,
  },
  {
    title: "Consensus Signals",
    description: "Directional bias computed from moving average trendlines and static support/resistance zones.",
  },
  {
    title: "Intelligence Briefs",
    description: "Daily pre-market mapping of core order blocks and macroeconomic calendars.",
    icon: FileText,
  },
];

export function HorizontalScrollSection() {
  return (
    <section
      className="w-full py-24 border-b select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Eyebrow + Heading */}
        <div className="mb-16">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--graphite-600)" }}
          >
            Platform capabilities
          </span>
          <h2
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold max-w-2xl"
            style={{ color: "var(--ink-950)" }}
          >
            Everything a serious trader actually needs
          </h2>
        </div>

        {/* Capabilities Grid — 12-column system, zero border-radius, hairline rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 border-t flex flex-col justify-between"
                style={{
                  borderColor: "var(--line-200)",
                  backgroundColor: "var(--paper-100)",
                  borderRadius: 0,
                }}
              >
                <div>
                  {/* Icon header if literal icon exists */}
                  {Icon ? (
                    <div className="mb-4 text-[var(--ink-950)]">
                      <Icon size={20} strokeWidth={1.5} style={{ color: "var(--ink-950)" }} />
                    </div>
                  ) : (
                    <div className="mb-4 h-[20px]" />
                  )}

                  <h3
                    className="text-[15px] font-medium leading-snug mb-2 font-sans"
                    style={{ color: "var(--ink-950)" }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className="text-[13px] leading-[1.6] font-sans"
                    style={{ color: "var(--graphite-600)" }}
                  >
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
