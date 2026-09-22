import React from "react";
import Link from "next/link";
import { Percent, ArrowRight, ShieldAlert, DollarSign, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PositionSizeCalculator } from "@/components/calculators/PositionSizeCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Position Size Calculator | Forex & CFD Lot Sizing",
  description:
    "Calculate exact lot sizes and cash exposure for forex, CFDs, and commodities based on account equity, risk percentage, and stop loss distance.",
  path: "/calculators/position-size",
});

export default function PositionSizeCalculatorPage() {
  const faqs = [
    {
      question: "How do I calculate position size in forex?",
      answer:
        "Multiply your account equity by your desired risk percentage to find your total cash risk. Then divide that cash risk by your stop loss distance (in pips) multiplied by the pip value per standard lot. Position Size (Lots) = Cash Risk / (Stop Loss Pips × Pip Value).",
    },
    {
      question: "What is the recommended risk percentage per trade?",
      answer:
        "Professional institutional standards recommend risking between 0.5% and 1.5% of total account equity per trade. Risking more than 2% rapidly increases the mathematical probability of deep drawdown during normal adverse streak sequences.",
    },
    {
      question: "Why does pip value matter for position sizing?",
      answer:
        "Different currency pairs have different pip values depending on your account currency. On a USD account, EUR/USD has a standard lot pip value of $10, whereas USD/JPY fluctuates around $6.50. Factoring in pip value ensures your actual dollar risk matches your intended percentage.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Position Size Calculator",
            "url": "https://drawdown.trading/calculators/position-size",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate standard lot sizes, risk thresholds, and capital exposure in real-time across major forex pairs, CFDs, and commodities.",
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
            { label: "Position Size", href: "/calculators/position-size" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Percent className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Position Size <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Determine standard lot sizes, risk thresholds, and capital exposure in real-time. Protect your trading equity by aligning every order with your defined monetary risk limit.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <PositionSizeCalculator />

        {/* SEO Explanatory Content & Formulas */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            How to Calculate Position Sizes in Trading
          </h2>
          <p>
            Correct position sizing is the mathematical bedrock of sustainable trading. Without disciplined sizing, win rate alone cannot protect your account from ruin. A trader with a 65% win rate who risks 5% per trade will face severe capital depletion during inevitable losing streaks, whereas a trader risking 1% with a 45% win rate and 1:2 risk-to-reward ratio achieves consistent positive expectancy.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Sizing Formula</h3>
          <p>
            To compute your optimal lot size manually before placing an order, apply the standard risk-weighted formula:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Position Size (Standard Lots) = (Account Balance × Risk Percentage) / (Stop Loss in Pips × Pip Value per Lot)
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example:</h3>
          <p>
            Suppose you have an account balance of <strong>$25,000</strong> and decide to risk <strong>1%</strong> on a EUR/USD long setup with an entry at 1.0850 and an invalidation stop at 1.0825 (a <strong>25-pip stop loss</strong>).
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cash Risk:</strong> $25,000 × 0.01 = $250.00 total exposure at risk.</li>
            <li><strong>Stop Loss Distance:</strong> 25 pips.</li>
            <li><strong>Pip Value:</strong> $10.00 per standard lot on EUR/USD.</li>
            <li><strong>Calculation:</strong> $250 / (25 × $10) = $250 / $250 = <strong>1.00 Standard Lot (100,000 units)</strong>.</li>
          </ul>

          <h3 className="text-xl font-bold uppercase text-text-primary">Common Position Sizing Pitfalls</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Fixed lot sizing regardless of stop distance:</strong> Trading a constant 1.00 lot when your stop varies between 10 pips and 60 pips causes random swings in cash risk.</li>
            <li><strong>Ignoring quote currency exchange rates:</strong> Calculating EUR/GBP or USD/JPY using a flat $10 pip valuation skews your real risk by 10% to 35%.</li>
            <li><strong>Revenge sizing after a loss:</strong> Increasing lot sizes to recover prior drawdowns accelerates the mathematical probability of account wipeout.</li>
          </ul>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Risk & Execution Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/pip-value"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Pip Value Calculator (Currency Conversions)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Trading Risk Calculator & Cash Exposure</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/blog/kelly-criterion-position-sizing-mastery"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Kelly Criterion Position Sizing Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/blog/fixed-percentage-vs-fixed-monetary-risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Fixed Percentage vs Fixed Monetary Risk</span>
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
          resourceId="risk-guide"
          title="Download the Complete Risk Management Guide PDF"
          description="Protect your capital from market swings. This manual covers advanced leverage management, position sizing sheets, and prop challenge protocols."
        />
      </div>
    </div>
  );
}
