"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import { PropFirmCard } from "@/components/ui/PropFirmCard";
import { propFirms } from "@/data/prop-firms";
import { FadeInSection } from "@/components/animations/FadeInSection";

export function PropFirmSection() {
  // Only feature the top 3 as requested
  const featuredFirms = propFirms.filter(f => ["ftmo", "the5ers", "funding-pips"].includes(f.id));

  return (
    <section className="py-24 bg-white border-b border-[#E8E8E8] relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <FadeInSection>
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-semibold tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-3 py-1 inline-block uppercase font-sans">
                // INSTITUTIONAL CAPITAL
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase text-[#0A0A0A] leading-tight">
                Prop Firm Directory.
              </h2>
              <p className="text-base font-sans text-neutral-500 leading-relaxed">
                Scaling your own capital takes years. Prop firms offer a shortcut to funding — if you have a proven edge. We evaluate firms on rules, reliability, and real payout data.
              </p>
            </div>
            <Link 
              href="/prop-firms" 
              className="group flex items-center gap-2 px-6 py-3 border border-neutral-250 hover:border-black rounded-lg text-sm font-medium text-neutral-600 hover:text-black transition-colors font-sans"
            >
              View All Firms <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </FadeInSection>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFirms.map((firm, i) => (
            <FadeInSection key={firm.id} delay={i * 0.1}>
              <PropFirmCard firm={firm} isPetesPick={firm.id === "the5ers"} source="homepage" />
            </FadeInSection>
          ))}
        </div>

        {/* Footer info & commission disclosure */}
        <FadeInSection>
          <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-widest mb-0.5">
                  Pass Rates: <span className="text-rose-600 font-bold">~5.4%</span>
                </p>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  Statistical reality of most challenges.
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-sans max-w-sm text-center md:text-right">
              Drawdown may earn a referral commission if you purchase a challenge. This never influences our honest rule assessments.
            </p>
          </div>
        </FadeInSection>

      </div>
    </section>
  );
}
