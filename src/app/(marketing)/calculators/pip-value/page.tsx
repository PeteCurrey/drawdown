import React from "react";
import Link from "next/link";
import { DollarSign, ArrowRight, Percent, ShieldAlert, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PipValueCalculator } from "@/components/calculators/PipValueCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Pip Value Calculator | Forex, Metals & Indices",
  description:
    "Convert pips to absolute cash values in your local currency across forex pairs, metals, and index contracts for precise position sizing.",
  path: "/calculators/pip-value",
});

export default function PipValueCalculatorPage() {
  const faqs = [
    {
      question: "What is a pip in forex trading?",
      answer:
        "A pip (percentage in point) is the standard unit of measurement representing the smallest price change in an exchange rate. For most currency pairs, a pip is 0.0001 (the fourth decimal place). For Japanese Yen pairs, one pip is 0.01 (the second decimal place).",
    },
    {
      question: "How is pip value calculated for EUR/USD?",
      answer:
        "On a standard contract (100,000 units) of EUR/USD, one pip equals 0.0001 × 100,000 = $10.00 USD. If your account currency is GBP or EUR, that $10 USD is converted into your base currency using the current spot exchange rate.",
    },
    {
      question: "What is the difference between a pip and a pipette?",
      answer:
        "A pipette is a fractional pip equal to one-tenth (0.1) of a pip. Modern brokers display prices with 5 decimal places (e.g. 1.08543), where the last digit is the pipette.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Pip Value Calculator",
            "url": "https://drawdown.trading/calculators/pip-value",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate the monetary value of a pip in your base currency across forex, gold, and index contracts.",
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
            { label: "Pip Value", href: "/calculators/pip-value" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Execution Specs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Pip Value <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Convert pips to absolute cash values in your local currency across forex pairs, metals, and index contracts. Input your lot size to know your exact monetary price sensitivity.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <PipValueCalculator />

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            Understanding Pip Valuation & Contract Sizing
          </h2>
          <p>
            Pip value is the monetary gain or loss generated when an asset moves by one single pip. Because position sizing depends directly on stop loss distance in pips, understanding the exact cash value of each pip is crucial for calculating genuine market exposure.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Core Pip Value Formula</h3>
          <p>
            When the quote currency matches your account currency (e.g. trading EUR/USD with a USD account):
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Pip Value = One Pip Decimal (0.0001) × Contract Size (100,000 for Standard Lot) = $10.00 per Lot
          </div>

          <p>
            When trading cross currency pairs (e.g. USD/JPY on a USD account):
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Pip Value = (One Pip Decimal / Exchange Rate) × Contract Size
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Standard Lot Sizing Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-border-slate/50">
              <thead className="bg-background-surface/60 font-mono text-text-tertiary uppercase">
                <tr>
                  <th className="p-3 border-b border-border-slate/50">Lot Type</th>
                  <th className="p-3 border-b border-border-slate/50">Volume (Lots)</th>
                  <th className="p-3 border-b border-border-slate/50">Units</th>
                  <th className="p-3 border-b border-border-slate/50">EUR/USD Pip Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                <tr>
                  <td className="p-3 font-semibold text-text-primary">Standard Lot</td>
                  <td className="p-3 font-mono">1.00</td>
                  <td className="p-3 font-mono">100,000</td>
                  <td className="p-3 font-mono text-accent">$10.00</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-primary">Mini Lot</td>
                  <td className="p-3 font-mono">0.10</td>
                  <td className="p-3 font-mono">10,000</td>
                  <td className="p-3 font-mono text-accent">$1.00</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-primary">Micro Lot</td>
                  <td className="p-3 font-mono">0.01</td>
                  <td className="p-3 font-mono">1,000</td>
                  <td className="p-3 font-mono text-accent">$0.10</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Risk & Execution Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator (Lot Sizing)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Risk Calculator (Total Cash Exposure)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/blog/gbpusd-trading-guide"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>GBP/USD Trading & Spread Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/research/trading-costs"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Empirical Broker Trading Cost Audit</span>
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
