import React from "react";
import Metadata from "next";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, Calculator, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PropFirmChallengeCalculator } from "@/components/calculators/PropFirmChallengeCalculator";

export const metadata = {
  title: "Prop-Firm Rule & Challenge Economics Research | Drawdown Research",
  description:
    "Empirical analysis of prop-firm challenge survival probabilities, trailing drawdown mechanics, consistency rules, and effective break-even costs.",
};

export default function PropFirmResearchPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Prop-Firm Research", href: "/research/prop-firms" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Prop-Firm Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Prop-Firm Challenge Economics & Trailing Drawdown Analysis
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Empirical rule analysis: calculating effective challenge break-even targets, maximum daily drawdown limits, and true failure rates.
          </p>
        </div>

        {/* Challenge Calculator */}
        <PropFirmChallengeCalculator />
      </div>
    </div>
  );
}
