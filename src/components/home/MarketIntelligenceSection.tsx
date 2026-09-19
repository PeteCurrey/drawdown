"use client";

import { useState } from "react";
import { InstitutionalConsensusSection } from "@/components/home/InstitutionalConsensusSection";
import { InstitutionalPulseSection } from "@/components/home/InstitutionalPulseSection";
import { MarketPulse } from "@/components/home/MarketPulse";
import { GlobalFluxSection } from "@/components/home/GlobalFluxSection";
import { BarChart3, Activity, Newspaper, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type TabKey = "consensus" | "sentiment" | "news" | "flux";

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: "consensus", label: "Consensus Matrix", icon: BarChart3 },
  { key: "sentiment", label: "Market Sentiment", icon: Activity },
  { key: "news", label: "News & Briefing", icon: Newspaper },
  { key: "flux", label: "Global Flux", icon: LineChart },
];

export function MarketIntelligenceSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("consensus");

  return (
    <section
      id="market-intelligence"
      className="w-full border-b select-none relative"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
        paddingTop: "var(--section-y-desktop)",
        paddingBottom: "var(--section-y-desktop)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl mb-10 space-y-4">
            <span
              className="block type-label uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              SYSTEMIC TELEMETRY
            </span>
            <h2
              className="type-display-lg font-normal"
              style={{ color: "var(--text-primary)" }}
            >
              Market Intelligence Briefing.
            </h2>
            <p
              className="type-body-lg font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              Consolidated macroeconomic feeds, multi-timeframe technical consensus, and real-time news analytics.
            </p>
          </div>
        </Reveal>

        {/* Tab Control Bar */}
        <div
          className="flex items-center gap-2 p-1.5 border mb-8 overflow-x-auto"
          style={{
            backgroundColor: "var(--surface-raised)",
            borderColor: "var(--border-subtle)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium transition-all duration-150 rounded-sm cursor-pointer shrink-0",
                  isActive
                    ? "text-[var(--text-primary)] shadow-sm font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                style={{
                  backgroundColor: isActive ? "var(--surface-base)" : "transparent",
                  borderRadius: "var(--radius-sm)",
                  border: isActive ? "1px solid var(--border-subtle)" : "1px solid transparent",
                }}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: isActive ? "var(--accent)" : "inherit" }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="relative">
          {activeTab === "consensus" && (
            <div className="animate-in fade-in duration-200">
              <InstitutionalConsensusSection />
            </div>
          )}
          {activeTab === "sentiment" && (
            <div className="animate-in fade-in duration-200">
              <InstitutionalPulseSection />
            </div>
          )}
          {activeTab === "news" && (
            <div className="animate-in fade-in duration-200">
              <MarketPulse />
            </div>
          )}
          {activeTab === "flux" && (
            <div className="animate-in fade-in duration-200">
              <GlobalFluxSection />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
