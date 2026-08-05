import React from "react";
import Metadata from "next";
import Link from "next/link";
import { ShieldAlert, Download, Calculator, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SAMPLE_RESEARCH_STUDIES } from "@/lib/data/research";
import { DrawdownRecoveryCalculator } from "@/components/calculators/DrawdownRecoveryCalculator";

export const metadata = {
  title: "Quantitative Risk & Drawdown Recovery Studies | Drawdown Research",
  description:
    "Mathematical papers and simulations on drawdown recovery, risk-of-ruin models, consecutive loss distributions, and position sizing decay.",
};

export default function RiskResearchPage() {
  const riskStudies = SAMPLE_RESEARCH_STUDIES.filter((s) => s.category === "risk-math");

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Risk & Drawdown", href: "/research/risk" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            Risk & Drawdown Mathematics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Quantitative Risk & Recovery Papers
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Mathematical modeling of loss depth, non-linear recovery requirements, position-sizing decay, and account ruin probabilities.
          </p>
        </div>

        {/* Embedded Interactive Recovery Tool */}
        <DrawdownRecoveryCalculator />

        {/* Papers List */}
        <div className="space-y-6 mt-12">
          <h2 className="text-xl font-bold text-text-primary">Peer-Reviewed Risk Papers</h2>
          {riskStudies.map((study) => (
            <div key={study.slug} className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">{study.title}</h3>
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
