import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DrawdownRecoveryCalculator } from "@/components/calculators/DrawdownRecoveryCalculator";
import { BookOpen, ArrowRight, HelpCircle, Activity, Percent } from "lucide-react";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Drawdown Recovery Calculator & Non-Linear Loss Math",
  description:
    "Calculate the non-linear percentage gain required to recover from trading losses. Includes trade count estimates, worked examples, and formulas.",
  path: "/calculators/drawdown-recovery",
});

export default function DrawdownRecoveryPage() {
  const faqs = [
    {
      question: "Why does a 50% loss require a 100% gain to recover?",
      answer:
        "Loss recovery is non-linear because your profit must be earned on a smaller remaining capital base. If you lose $5,000 on a $10,000 account (50%), you have $5,000 remaining. To get back to $10,000, you must generate $5,000 profit on your $5,000 balance: $5,000 / $5,000 = 100% gain.",
    },
    {
      question: "What is the non-linear recovery decay point?",
      answer:
        "Beyond 20% drawdown, the required recovery percentage accelerates dramatically. While a 10% loss requires an 11.1% gain and a 20% loss requires 25%, a 70% loss demands a 233.3% gain, and a 90% loss requires a 900% return.",
    },
    {
      question: "How should a trader adjust position size during a drawdown?",
      answer:
        "Traders should reduce position sizes as drawdown deepens. Increasing lot size to recover quickly ('revenge trading') drastically elevates the probability of total account liquidation.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Drawdown Recovery Calculator",
            "url": "https://drawdown.trading/calculators/drawdown-recovery",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate the non-linear percentage gain required to recover from trading losses.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer,
              },
            })),
          },
        ]}
      />

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

          {/* Internal Links Network */}
          <div className="pt-4 border-t border-border-primary/40 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Link
                href="/calculators/drawdown"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Probability Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/risk-of-ruin"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Risk of Ruin Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/research/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Research Paper: Non-Linear Recovery Decay</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="pt-6 border-t border-border-primary/40 space-y-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-background-primary border border-border-primary/60 space-y-1">
                  <h4 className="text-xs font-bold text-text-primary">{faq.question}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
