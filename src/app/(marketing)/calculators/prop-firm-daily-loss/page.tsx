import React from "react";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldAlert, AlertTriangle, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PropFirmDailyLossCalculator } from "@/components/calculators/PropFirmDailyLossCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Prop Firm Daily Loss Calculator | Drawdown Buffer Modeler",
  description:
    "Calculate your exact daily drawdown safety buffer based on previous day close values to protect funded accounts from rule breaches.",
  path: "/calculators/prop-firm-daily-loss",
});

export default function PropFirmDailyLossCalculatorPage() {
  const faqs = [
    {
      question: "How is daily drawdown calculated by prop firms like FTMO?",
      answer:
        "At midnight CE(S)T, the firm records your account equity and balance. Whichever value is higher becomes the baseline for the day. If you have a 5% daily loss limit on a $100,000 account, your equity cannot drop below $95,000 at any second during that trading day, including floating unrealized losses.",
    },
    {
      question: "Do floating/unrealized losses count toward daily drawdown?",
      answer:
        "Yes. Across virtually all major prop firms (including FTMO, The5ers, FundingPips, Alpha Capital), daily drawdown is monitored in real-time on equity. If open trades push your floating drawdown past the daily limit, the account is instantly breached even if trades are not yet closed.",
    },
    {
      question: "What happens if I hold open profitable trades overnight?",
      answer:
        "If you hold trades with floating profits past midnight, your equity at midnight becomes higher than your balance. Most firms set the daily loss floor from that higher equity, meaning a reversal the next day could breach your daily limit even if your closed balance remains intact.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Prop Firm Daily Loss Calculator",
            "url": "https://drawdown.trading/calculators/prop-firm-daily-loss",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate daily drawdown breach levels and remaining loss buffers for funded prop trading accounts.",
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
            { label: "Prop Firm Daily Loss", href: "/calculators/prop-firm-daily-loss" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Prop Trading</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Prop Firm Daily Loss <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Calculate your exact daily drawdown safety buffer based on previous day close values. Never fail an evaluation due to midnight equity reset misunderstandings.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <PropFirmDailyLossCalculator />

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            How Prop Firm Daily Drawdown Rules Actually Work
          </h2>
          <p>
            More than 70% of evaluation breaches in proprietary trading occur on the <strong>daily loss limit</strong> rather than the overall maximum drawdown. Traders fail not because their strategy lacks edge, but because they misunderstand how prop firms snapshot midnight equity and calculate floating drawdowns in real-time.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Universal Daily Loss Formula</h3>
          <p>
            At the daily reset time (typically 00:00 CE(S)T server time):
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Midnight Baseline = MAX(Starting Balance at Midnight, Equity at Midnight)
            <br />
            Allowed Daily Loss ($) = Midnight Baseline × (Daily Limit % / 100)
            <br />
            Daily Breach Floor ($) = Midnight Baseline - Allowed Daily Loss
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example: The Midnight Trap</h3>
          <p>
            Assume a <strong>$100,000 funded account</strong> with a <strong>5% daily loss limit ($5,000)</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Day 1:</strong> You make $3,000 in closed profit. Account balance is now $103,000.</li>
            <li><strong>Midnight Snapshot:</strong> Balance is $103,000. Equity is $103,000. Allowed daily loss for Day 2 is 5% of $103,000 = <strong>$5,150</strong>.</li>
            <li><strong>Breach Level for Day 2:</strong> $103,000 - $5,150 = <strong>$97,850</strong>.</li>
            <li><strong>Notice:</strong> Even though your overall account is still well above the $90,000 initial drawdown threshold, dropping below $97,850 on Day 2 results in an immediate rule breach and account termination.</li>
          </ul>

          <h3 className="text-xl font-bold uppercase text-text-primary">Verification Checklist for Funded Traders</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Check whether your firm's server timezone is CE(S)T (Prague), UTC, or EST (New York).</li>
            <li>Ensure pending stop loss orders calculate total risk including commissions and slippage.</li>
            <li>Avoid holding floating profitable swings into the midnight rollover if you cannot supervise the opening session.</li>
          </ul>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Prop Firm Risk Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/prop-firm-maximum-loss"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Prop Firm Maximum Loss Calculator (Static vs Trailing)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/prop-firms"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Prop Firm Comparison & Rule Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator (Risk Buffer Tuning)</span>
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
