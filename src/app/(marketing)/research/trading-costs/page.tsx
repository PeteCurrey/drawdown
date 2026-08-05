import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Activity, ShieldCheck, ArrowRight, DollarSign } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SAMPLE_RESEARCH_STUDIES } from "@/lib/data/research";

export const metadata = {
  title: "Trading Cost Studies & Spread Analysis | Drawdown Research",
  description:
    "Empirical audits of round-trip trading costs, commission models, overnight financing swaps, and currency conversion fees across UK brokers.",
};

export default function TradingCostsResearchPage() {
  const costStudies = SAMPLE_RESEARCH_STUDIES.filter((s) => s.category === "broker-costs");

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Trading Costs", href: "/research/trading-costs" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            Trading Cost Research
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Empirical Broker Cost Audits
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Measuring true round-trip costs: spreads, ticket commissions, overnight swap rates, and hidden deposit/withdrawal friction.
          </p>
        </div>

        <div className="space-y-6">
          {costStudies.map((study) => (
            <div key={study.slug} className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-text-primary mb-2">{study.title}</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">{study.subtitle}</p>
              <div className="space-y-2 mb-4">
                <span className="text-xs font-semibold text-text-secondary">Key Findings:</span>
                <ul className="text-xs text-text-tertiary space-y-1 list-disc list-inside">
                  {study.keyFindings.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
