import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RiskOfRuinSimulator } from "@/components/calculators/RiskOfRuinSimulator";
import { BookOpen, ArrowRight, HelpCircle, Activity, Percent } from "lucide-react";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Risk of Ruin Simulator & Drawdown Probability",
  description:
    "Simulate trading account ruin probability based on win rate, reward-to-risk ratio, and position size. Mathematical formulas and risk analysis.",
  path: "/calculators/risk-of-ruin",
});

export default function RiskOfRuinPage() {
  const faqs = [
    {
      question: "What is Risk of Ruin in trading?",
      answer:
        "Risk of Ruin is a mathematical concept from probability theory and gambling mathematics that calculates the likelihood of an investor losing so much capital that they cannot continue trading, either through complete account liquidation or breaching a mandatory drawdown limit.",
    },
    {
      question: "How do win rate and risk-to-reward interact in ruin calculations?",
      answer:
        "Ruin probability is non-linear. Even a strategy with a 40% win rate can have near-zero risk of ruin if its risk-to-reward ratio is 1:3 and risk per trade is kept below 1.5%. Conversely, an 80% win-rate strategy risking 10% per trade faces virtually guaranteed ruin over long sequences.",
    },
    {
      question: "What is the Ralph Vince formula for risk of ruin?",
      answer:
        "In fixed-fractional trading, the probability of ruin is expressed as: Risk of Ruin = ((1 - Advantage) / (1 + Advantage)) ^ Units of Capital, where Advantage is determined by the mathematical expectancy of the system.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Risk of Ruin Simulator",
            "url": "https://drawdown.trading/calculators/risk-of-ruin",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Evaluate the mathematical probability of hitting your maximum tolerable drawdown threshold.",
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
            { label: "Risk of Ruin Simulator", href: "/calculators/risk-of-ruin" },
          ]}
        />

        <div className="my-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
            Risk-of-Ruin Simulator
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            Evaluate the mathematical probability of hitting your maximum tolerable drawdown threshold before achieving trading goals. Model the statistical longevity of your strategy under adverse variance.
          </p>
        </div>

        {/* Interactive Simulator */}
        <RiskOfRuinSimulator />

        {/* Methodology & Assumptions */}
        <div className="mt-12 bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Mathematical Methodology & Risk Longevity
          </h2>
          <div className="text-xs text-text-secondary space-y-3 leading-relaxed">
            <p>
              The Risk of Ruin calculation estimates the statistical probability that a series of consecutive losses will breach your defined drawdown limit before the system reaches its profit target.
            </p>
            <p>
              Under Perry Kaufman and Ralph Vince probability models, whenever expected value (EV) is negative, ruin probability is 100%. When EV is positive, ruin probability decreases exponentially as the ratio of account capital to trade risk increases.
            </p>
            <p className="text-text-tertiary">
              Note: This simulator assumes independent trials and stationary distribution. In live financial markets, trade outcomes may exhibit serial correlation, slippage, or volatility clustering during macroeconomic shock events.
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
                href="/calculators/drawdown-recovery"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Recovery Calculator</span>
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
                <span>Quantitative Research: Drawdown & Ruin Probability</span>
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
