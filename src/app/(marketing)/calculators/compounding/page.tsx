import React from "react";
import Link from "next/link";
import { LineChart, ArrowRight, Percent, Activity, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { CompoundingCalculator } from "@/components/calculators/CompoundingCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Forex Compounding Calculator | Trading Equity Growth Modeler",
  description:
    "Project your long-term equity growth by compounding trading gains over daily, weekly, or monthly periods with custom reinvestment rates.",
  path: "/calculators/compounding",
});

export default function CompoundingCalculatorPage() {
  const faqs = [
    {
      question: "How does compounding work in forex and CFD trading?",
      answer:
        "Compounding occurs when you leave accrued trading profits in your account rather than withdrawing them. Because subsequent position sizes are calculated as a percentage of your growing balance, lot sizes expand naturally, generating exponential equity growth over time.",
    },
    {
      question: "What is a realistic compounding rate for independent traders?",
      answer:
        "Consistent institutional-grade hedge funds and proprietary traders typically target 2% to 5% net monthly returns. While social media often promises 20% to 50% monthly compounding, achieving that requires extreme leverage that inevitably leads to account ruin.",
    },
    {
      question: "How do periodic withdrawals affect compounding?",
      answer:
        "Withdrawing capital reduces the compounding multiplier. Our calculator allows you to adjust the Reinvestment Rate from 10% to 100%, showing the exact impact of partial profit extraction versus complete reinvestment.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Trading Compounding Calculator",
            "url": "https://drawdown.trading/calculators/compounding",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Project trading equity growth by compounding periodic returns across daily, weekly, and monthly periods.",
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
            { label: "Compounding", href: "/calculators/compounding" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <LineChart className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Growth & Profit</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Compounding <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Project your long-term equity growth by compounding trading gains over multiple periods. Model the mathematical difference between fixed withdrawals and geometric reinvestment.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <CompoundingCalculator />

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            The Mathematics of Compounding in Trading
          </h2>
          <p>
            Albert Einstein famously termed compound interest the eighth wonder of the world. In trading, compounding transforms a modest statistical edge into substantial capital expansion over extended time horizons. When gains are reinvested, your capital base grows geometrically rather than linearly.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Compounding Formula</h3>
          <p>
            The future value of your trading equity compounded over discrete periods is calculated using:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Ending Balance = Starting Capital × (1 + (Periodic Gain % × Reinvestment Rate %)) ^ Periods
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example:</h3>
          <p>
            Suppose you start with <strong>$10,000</strong>, achieve an average net gain of <strong>4% per month</strong>, and reinvest <strong>100%</strong> of profits over <strong>24 months (2 years)</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Monthly Multiplier:</strong> 1 + (0.04 × 1.0) = 1.04.</li>
            <li><strong>24-Month Compounding Factor:</strong> (1.04)²⁴ ≈ 2.5633.</li>
            <li><strong>Ending Capital:</strong> $10,000 × 2.5633 = <strong>$25,633.04</strong>.</li>
            <li><strong>Total Net Profit:</strong> $15,633.04 (+156.33% total return vs +96% if calculated linearly).</li>
          </ul>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Reality Check: Drawdown & Variance</h3>
          <p>
            Calculators display smooth, uninterrupted geometric curves. In real markets, periodic monthly drawdowns occur. A -6% month requires a subsequent +6.38% gain just to return to the prior baseline. Sustainable compounding relies entirely on keeping drawdowns shallow so the geometric curve is not shattered.
          </p>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Risk & Sizing Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator (Dynamic Lot Sizing)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/drawdown"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Calculator (Model Adverse Streaks)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/drawdown-recovery"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Recovery Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/blog/why-consistency-beats-big-wins-in-trading"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Why Consistency Beats High-Risk Home Runs</span>
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
