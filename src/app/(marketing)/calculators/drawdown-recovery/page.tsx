import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DrawdownRecoveryCalculator } from "@/components/calculators/DrawdownRecoveryCalculator";
import { BookOpen, ShieldAlert, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Drawdown Recovery Calculator & Non-Linear Loss Math | Drawdown",
  description:
    "Calculate the non-linear percentage gain required to recover from trading losses. Includes trade count estimates, worked examples, and embed code.",
};

export default function DrawdownRecoveryPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Drawdown Recovery Calculator", href: "/calculators/drawdown-recovery" },
          ]}
        />

        <div className="my-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
            Drawdown Recovery Calculator
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            Understand non-linear loss mathematics. As losses deepen, the percentage gain required relative to remaining equity expands exponentially.
          </p>
        </div>

        {/* Interactive Calculator Component */}
        <DrawdownRecoveryCalculator />

        {/* Methodology & Formula Section */}
        <div className="mt-12 bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Formula Explanation & Worked Example
          </h2>

          <div className="text-xs text-text-secondary space-y-3 leading-relaxed">
            <p>
              The percentage recovery required is calculated using the formula:
            </p>
            <div className="p-4 rounded-xl bg-background-primary border border-border-primary/60 font-mono text-accent text-center text-sm">
              Required Gain % = ( Loss Amount / Remaining Equity ) × 100
            </div>

            <h3 className="font-bold text-text-primary text-sm pt-2">Worked Example:</h3>
            <p>
              Suppose an account starts with <strong>£10,000</strong> and suffers a <strong>50% drawdown (£5,000 loss)</strong>. The remaining balance is <strong>£5,000</strong>. To return to the initial £10,000 starting capital, the trader must make £5,000 profit on the remaining £5,000 equity.
            </p>
            <p className="font-semibold text-text-primary">
              £5,000 Profit / £5,000 Balance = 100% Gain Required.
            </p>
          </div>

          <div className="pt-4 border-t border-border-primary/40 flex items-center justify-between text-xs">
            <Link
              href="/research/risk"
              className="inline-flex items-center gap-1.5 font-bold text-accent hover:underline"
            >
              Read our quantitative research paper on non-linear recovery decay
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
