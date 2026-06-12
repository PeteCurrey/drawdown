import React from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import { GSAPReveal } from "@/components/animations/GSAPReveal";
import { PropFirmCard } from "@/components/ui/PropFirmCard";
import { propFirms } from "@/data/prop-firms";

export function PropFirmSection() {
  // Only feature the top 3 as requested
  const featuredFirms = propFirms.filter(f => ["ftmo", "the5ers", "funding-pips"].includes(f.id));

  return (
    <section className="py-12 md:py-20 bg-background-primary border-t border-border-slate">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold">
              // INSTITUTIONAL CAPITAL
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight">
              Prop Firm <span className="text-accent italic">Directory</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed font-medium">
              Scaling your own capital takes years. Prop firms offer a shortcut to funding — if you have a proven edge. We evaluate firms on rules, reliability, and real payout data.
            </p>
          </div>
          <Link 
            href="/prop-firms" 
            className="group flex items-center gap-3 px-8 py-4 border border-border-slate hover:border-text-primary transition-all text-sm md:text-xs font-black uppercase tracking-widest text-text-tertiary hover:text-text-primary"
          >
            View All Firms <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFirms.map((firm, i) => (
            <GSAPReveal key={firm.id} direction="up" delay={i * 0.1}>
              <PropFirmCard firm={firm} isPetesPick={firm.id === "the5ers"} source="homepage" />
            </GSAPReveal>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-border-slate/30 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono font-black text-text-primary uppercase tracking-widest mb-1">Pass Rates: <span className="text-loss">~5.4%</span></p>
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Statistical reality of most challenges.</p>
              </div>
           </div>
           <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest max-w-sm text-center md:text-right">
             Drawdown may earn a referral commission if you purchase a challenge. This never influences our honest rule assessments.
           </p>
        </div>
      </div>
    </section>
  );
}
