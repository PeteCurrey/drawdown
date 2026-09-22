import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, ShieldAlert, LineChart, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { DrawdownCalculator } from "@/components/calculators/DrawdownCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Drawdown Calculator | Losing Streak Probability & Capital Decay",
  description:
    "Model consecutive losing streaks and calculate the mathematical drawdown impact on your trading capital across different win-rate regimes.",
  path: "/calculators/drawdown",
});

export default function DrawdownCalculatorPage() {
  const faqs = [
    {
      question: "What is trading drawdown?",
      answer:
        "Drawdown is the peak-to-trough decline in a trading account's balance or equity, expressed either in monetary terms or as a percentage of peak capital. A drawdown begins when an account drops below its previous high-water mark and only ends when equity climbs back above that peak.",
    },
    {
      question: "Why do losing streaks happen even with a 60% win rate?",
      answer:
        "Trade outcomes in financial markets are independent probabilistic trials. Over a series of 100 trades, the distribution of wins and losses clusters randomly. Even with a 60% edge, the probability of experiencing 5 or more consecutive losses within 100 trades exceeds 60%.",
    },
    {
      question: "How does compounding affect drawdown calculations?",
      answer:
        "When risk is calculated as a fixed percentage of remaining equity (fixed-fractional sizing), account capital decays non-linearly. Each subsequent loss is calculated on a smaller base, so five consecutive 2% losses result in a 9.61% drawdown rather than 10.0%. However, recovering that drawdown requires a higher percentage gain.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Drawdown Calculator",
            "url": "https://drawdown.trading/calculators/drawdown",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Model the statistical probability of consecutive losing streaks and their mathematical impact on your trading capital.",
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

      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Drawdown Modeler", href: "/calculators/drawdown" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Drawdown Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Drawdown <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Model the probability of consecutive losing streaks and their mathematical impact on your trading capital. Stress-test your risk tolerance against institutional probability distributions.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <DrawdownCalculator />

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            How Losing Streaks Impact Trading Accounts
          </h2>
          <p>
            Traders frequently underestimate the severity of adverse variance. In any random sample of market outcomes, losing trades do not occur in convenient, evenly spaced intervals. They arrive in clusters. Even an institutional quantitative strategy with a high Sharpe ratio must endure extended drawdown phases.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Mathematical Odds of Consecutive Losses</h3>
          <p>
            The single-sequence probability of suffering \( n \) consecutive losses is calculated by multiplying the loss probability of your strategy:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Streak Probability = (1 - Win Rate) ^ Streak Length
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example:</h3>
          <p>
            Consider a trader with a <strong>55% win rate</strong> risking <strong>1.5%</strong> per trade on a <strong>$50,000</strong> account:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Loss Probability per Trade:</strong> 100% - 55% = 45% (0.45).</li>
            <li><strong>Probability of 6 consecutive losses:</strong> (0.45)⁶ = 0.0083 (0.83% chance in any specific sequence, but over 150 trades, the cumulative probability of hitting at least one 6-loss streak exceeds 42%).</li>
            <li><strong>Account Capital After 6 Losses:</strong> $50,000 × (1 - 0.015)⁶ = $45,671.22.</li>
            <li><strong>Drawdown Amount:</strong> $4,328.78 (8.66% maximum drawdown).</li>
          </ul>

          <h3 className="text-xl font-bold uppercase text-text-primary">Capital Decay vs Linear Calculation</h3>
          <p>
            When sizing positions using fixed fractional equity (e.g. risking 1% of current equity rather than initial starting balance), each loss reduces the dollar risk on subsequent trades. While this dampens catastrophic ruin, it simultaneously demands a larger recovery gain to reach breakeven.
          </p>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Related Risk & Recovery Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/drawdown-recovery"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Recovery Calculator (Non-Linear Math)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/risk-of-ruin"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Risk of Ruin Simulator (Monte Carlo Odds)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/research/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Research Paper: Non-Linear Recovery Decay</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-bold uppercase text-text-primary flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-lg bg-background-surface/30 border border-border-slate/40 space-y-2">
                  <h4 className="text-sm font-bold text-text-primary">{faq.question}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet
          resourceId="journal-template"
          title="Download the Professional Trading Journal Template"
          description="Log and analyze your losing streaks automatically. Use our pre-designed Excel log to track drawdown triggers and expectancy."
        />
      </div>
    </div>
  );
}
