import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RiskOfRuinSimulator } from "@/components/calculators/RiskOfRuinSimulator";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Risk of Ruin Simulator & Drawdown Probability | Drawdown",
  description:
    "Simulate trading account ruin probability based on win rate, reward-to-risk ratio, and position size. Includes mathematical formulas and embed codes.",
};

export default function RiskOfRuinPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Risk of Ruin Simulator", href: "/calculators/risk-of-ruin" },
          ]}
        />

        <div className="my-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
            Risk-of-Ruin Simulator
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            Evaluate the mathematical probability of hitting your maximum tolerable drawdown threshold before achieving trading goals.
          </p>
        </div>

        {/* Interactive Simulator */}
        <RiskOfRuinSimulator />

        {/* Methodology & Assumptions */}
        <div className="mt-12 bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Mathematical Methodology & Risk Disclaimer
          </h2>
          <div className="text-xs text-text-secondary space-y-2 leading-relaxed">
            <p>
              The Risk of Ruin calculation estimates the statistical probability that a series of consecutive losses will breach your defined drawdown limit.
            </p>
            <p className="text-text-tertiary">
              Note: This model assumes constant win rates and fixed-fractional risk per trade. In live markets, trade outcomes may exhibit serial correlation or volatility clustering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
