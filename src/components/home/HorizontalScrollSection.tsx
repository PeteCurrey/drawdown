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
    description: "UK tax context — educational comparisons of spread betting, CFDs and investing. Tax treatment depends on individual circumstances and may change.",
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
      className="w-full border-b select-none relative z-10"
      style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)", paddingTop: "var(--section-y-desktop)", paddingBottom: "var(--section-y-desktop)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Eyebrow + Heading */}
        <div className="mb-16">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Platform capabilities
          </span>
          <h2
            className="type-display-lg font-normal max-w-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            Everything a serious trader actually needs
          </h2>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 border flex flex-col justify-between"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--elev-1)",
                }}
              >
                <div>
                  {/* Icon header if literal icon exists */}
                  {Icon ? (
                    <div className="mb-4">
                      <Icon size={20} strokeWidth={1.5} style={{ color: "var(--text-primary)" }} />
                    </div>
                  ) : (
                    <div className="mb-4 h-[20px]" />
                  )}

                  <h3
                    className="text-[15px] font-medium leading-snug mb-2 font-sans"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className="text-[13px] leading-[1.6] font-sans"
                    style={{ color: "var(--text-secondary)" }}
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
