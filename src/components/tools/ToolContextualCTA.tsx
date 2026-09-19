import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface ToolContextualCTAProps {
  toolName: string;
  lead: string;
  benefit: string;
}

export function ToolContextualCTA({ toolName, lead, benefit }: ToolContextualCTAProps) {
  return (
    <aside
      className="p-8 border my-12 relative overflow-hidden transition-all"
      style={{
        borderColor: "rgba(22,33,62,0.12)",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(22,33,62,0.08)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40" 
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span 
              className="px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wider font-bold"
              style={{
                borderColor: "rgba(22,33,62,0.15)",
                backgroundColor: "rgba(22,33,62,0.04)",
                color: "var(--accent)",
                borderRadius: "var(--radius-pill)",
              }}
            >
              Drawdown Operating Loop
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              Integrated Workflow
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
            {lead}
          </h3>
          <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
            {benefit}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/dashboard/run-my-trade"
            className="px-5 py-3 text-xs font-mono uppercase tracking-[0.08em] font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-95"
            style={{
              backgroundColor: "var(--accent)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 4px 12px rgba(22,33,62,0.18)",
            }}
          >
            Launch Plan My Trade
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/courses/ground-zero"
            className="px-4 py-3 text-xs font-mono uppercase tracking-[0.08em] font-medium border text-[var(--text-primary)] hover:bg-black/[0.02] transition-colors text-center"
            style={{
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
            }}
          >
            Start Phase 1 Free
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function ToolDisclaimer() {
  return (
    <footer
      className="p-6 border text-[11px] font-sans leading-relaxed text-[var(--text-secondary)] mt-12 mb-8"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "rgba(0,0,0,0.015)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[var(--text-tertiary)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)] block">
            Educational Platform Disclosure &amp; Risk Notice
          </span>
          <p>
            Drawdown Trading provides quantitative calculation engines and educational risk models for informational purposes only. We do not provide financial, investment, or trading advice. CFDs, leveraged forex, and spread betting carry high risk of rapid capital loss. 74–89% of retail investor accounts lose money when trading CFDs. Never risk capital you cannot afford to lose entirely.
          </p>
        </div>
      </div>
    </footer>
  );
}
