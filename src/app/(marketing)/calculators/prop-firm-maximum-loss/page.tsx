import React from "react";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldAlert, AlertTriangle, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PropFirmMaximumLossCalculator } from "@/components/calculators/PropFirmMaximumLossCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Prop Firm Maximum Loss Calculator | Static vs Trailing Breach Buffer",
  description:
    "Calculate your total maximum drawdown limit and remaining capital buffer. Compare static and trailing drawdown models for prop firm evaluations.",
  path: "/calculators/prop-firm-maximum-loss",
});

export default function PropFirmMaximumLossCalculatorPage() {
  const faqs = [
    {
      question: "What is the difference between static and trailing maximum drawdown?",
      answer:
        "Static drawdown sets a permanent loss floor below your initial balance (e.g. $90,000 on a $100,000 account with 10% max loss). Even if your balance grows to $115,000, your loss floor remains at $90,000. In trailing drawdown, the loss floor trails upward as your account balance or open equity reaches new highs, locking in risk.",
    },
    {
      question: "Does maximum loss include open floating losses?",
      answer:
        "Yes. Proprietary trading firms monitor maximum drawdown in real-time based on account equity. If your floating open positions breach the maximum loss threshold at any second, your account is automatically liquidated and breached.",
    },
    {
      question: "Which prop firms use static drawdown vs trailing drawdown?",
      answer:
        "FTMO, The5ers, and FundingPips use static maximum drawdown based on initial account size. Futures evaluation firms (such as Apex Trader Funding and TradeDay) and some CFD firms use trailing drawdown (often calculated from intraday peak unrealized equity).",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Prop Firm Maximum Loss Calculator",
            "url": "https://drawdown.trading/calculators/prop-firm-maximum-loss",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate maximum drawdown limits, static floors, and remaining loss buffers for prop firm evaluations.",
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
            { label: "Prop Firm Maximum Loss", href: "/calculators/prop-firm-maximum-loss" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Prop Trading</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Prop Firm Max Loss <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Calculate your total maximum drawdown boundaries and check your remaining capital buffers. Understand exactly how static vs trailing loss floors dictate your trading longevity.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <PropFirmMaximumLossCalculator />

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            Static vs Trailing Drawdown in Proprietary Trading
          </h2>
          <p>
            Understanding the distinction between <strong>static drawdown</strong> and <strong>trailing drawdown</strong> is the difference between keeping a funded account and losing challenge fees. Many traders who pass evaluations fail within their first week because they treat a trailing drawdown rule as if it were static.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Static Maximum Loss Formula</h3>
          <p>
            In a static rule system (e.g. FTMO Standard 2-Step):
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Max Loss Floor ($) = Initial Account Balance - (Initial Account Balance × Max Drawdown %)
            <br />
            Remaining Buffer ($) = Current Equity - Max Loss Floor
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example: Static vs Trailing</h3>
          <p>
            Consider a <strong>$100,000 account</strong> with a <strong>10% maximum drawdown ($10,000 buffer)</strong>. You grow the account to <strong>$108,000</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Under Static Drawdown (FTMO):</strong> The breach floor is fixed at $90,000. With your account at $108,000, your buffer has expanded from $10,000 to <strong>$18,000</strong>. You have significant breathing room.</li>
            <li><strong>Under Trailing Drawdown (Apex / Intraday Peak):</strong> The floor trails your peak balance. When you reach $108,000, your floor moves up to $108,000 - $10,000 = <strong>$98,000</strong>. Your buffer remains locked at only $10,000. If your trade had a floating peak at $110,000 and retraced to $99,500, you are dangerously close to breach.</li>
          </ul>

          <h3 className="text-xl font-bold uppercase text-text-primary">Risk Management Rules for Funded Accounts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Scale down risk as drawdown deepens:</strong> If your remaining buffer drops from $10,000 to $4,000, cut lot sizes in half immediately. Risking the same lot size on a diminished buffer increases risk-of-ruin exponentially.</li>
            <li><strong>Separate daily limit from maximum limit:</strong> You can breach your daily limit ($5,000) while still having $8,000 of maximum buffer remaining. Always monitor both limits concurrently.</li>
          </ul>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Prop Firm Risk Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/prop-firm-daily-loss"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Prop Firm Daily Loss Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/prop-firms"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Prop Firm Rules & Evaluation Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/drawdown"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Probability Modeler</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/courses/prop-firm-survival-kit"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Prop Firm Survival Kit Course</span>
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
          title="Download the Prop Firm Challenge Protocol Guide"
          description="Protect your challenge fee. Covers strict risk rules, lot-size tables for funded accounts, and daily loss safeguards."
        />
      </div>
    </div>
  );
}
