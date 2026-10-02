import React from "react";
import Link from "next/link";
import { LineChart, ArrowRight, Percent, Activity, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { CompoundingCalculator } from "@/components/calculators/CompoundingCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
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
    {
      question: "Why does a single bad month destroy compounding projections?",
      answer:
        "Compounding curves assume uninterrupted positive periods. A -6% month requires a subsequent +6.38% gain just to return to the prior baseline. The compounding multiplier is disrupted and recovery time from drawdown significantly extends the time to reach projected equity targets.",
    },
    {
      question: "Should I compound a prop firm account?",
      answer:
        "Yes, but cautiously. Many funded accounts scale capital based on performance. Maintaining consistent net positive months triggers scaling programs (e.g. FTMO's scaling plan). However, letting profits ride on a trailing drawdown firm elevates your breach floor alongside your equity, making drawdown events more expensive than on a static-floor account.",
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

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary flex items-center gap-3">
              <Users className="w-6 h-6 text-accent flex-shrink-0" />
              Who This Calculator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Long-Term Capital Growers",
                  body: "Self-funded traders building personal wealth over 12–60 month horizons. Understand how a modest consistent edge grows geometrically versus linearly, and the real cost of withdrawing profits early.",
                },
                {
                  title: "Prop Firm Scale-Up Candidates",
                  body: "Funded traders eligible for capital scaling programs. Modelling the compounding effect of scaling from $25,000 to $100,000 over 6 consistent months versus the risk of a single breach resetting your progress.",
                },
                {
                  title: "Goal & Expectation Setters",
                  body: "Traders cross-checking social media or signal-seller claims against mathematical reality. Run the numbers on '20% monthly' promises to see what starting capital and reinvestment that would actually require.",
                },
              ].map((persona) => (
                <div key={persona.title} className="p-4 border border-border-slate/40 bg-background-surface/30 space-y-2">
                  <p className="text-xs font-bold text-text-primary uppercase tracking-wide">{persona.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{persona.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="space-y-3">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
              The Mathematics of Compounding in Trading
            </h2>
            <p>
              In trading, compounding transforms a modest statistical edge into substantial capital expansion over extended time horizons. When gains are reinvested, your capital base grows geometrically rather than linearly.
            </p>
            <h3 className="text-xl font-bold uppercase text-text-primary">The Compounding Formula</h3>
            <p>
              The future value of your trading equity compounded over discrete periods is calculated using:
            </p>
            <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
              Ending Balance = Starting Capital × (1 + (Periodic Gain % × Reinvestment Rate %)) ^ Periods
            </div>
          </div>

          {/* Variable Definitions */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary flex items-center gap-2">
              <Table2 className="w-4 h-4 text-accent" />
              Input Variable Definitions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-border-slate/50">
                <thead className="bg-background-surface/60 font-mono text-text-tertiary uppercase">
                  <tr>
                    <th className="p-3 border-b border-border-slate/50">Variable</th>
                    <th className="p-3 border-b border-border-slate/50">Units</th>
                    <th className="p-3 border-b border-border-slate/50">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Starting Capital</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">Your current account balance. The compounding base. For prop firms, this is the funded account size, not the challenge fee paid.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Periodic Gain</td>
                    <td className="p-3 font-mono">% (net, per period)</td>
                    <td className="p-3">Your expected net return per period (daily, weekly, or monthly). Must be net of all costs: spread, commission, swap, and platform fees. Use conservative verified figures, not best-case outcomes.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Number of Periods</td>
                    <td className="p-3 font-mono">Integer</td>
                    <td className="p-3">Total time horizon in your chosen period units. 12 monthly periods = 1 year. Ensure you apply the same period unit consistently (e.g. don't mix monthly gain with weekly period count).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Reinvestment Rate</td>
                    <td className="p-3 font-mono">% (0–100%)</td>
                    <td className="p-3">What portion of each period's profit is left in the account and compounded. 100% = full reinvestment; 50% = half withdrawn for living costs or distribution. Modelling partial reinvestment gives a realistic picture for income-dependent traders.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example</h3>
            <p>
              Suppose you start with <strong>$10,000</strong>, achieve an average net gain of <strong>4% per month</strong>, and reinvest <strong>100%</strong> of profits over <strong>24 months (2 years)</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Monthly Multiplier:</strong> 1 + (0.04 × 1.0) = 1.04.</li>
              <li><strong>24-Month Compounding Factor:</strong> (1.04)²⁴ ≈ 2.5633.</li>
              <li><strong>Ending Capital:</strong> $10,000 × 2.5633 = <strong>$25,633.04</strong>.</li>
              <li><strong>Total Net Profit:</strong> $15,633.04 (+156.33% total return vs +96% if calculated linearly).</li>
              <li><strong>Reality Check:</strong> At 4% net monthly, your average daily drawdown during the month must remain below ~1.5%. One -8% month resets the compounding clock significantly, requiring +8.7% the following month just to return to prior equity.</li>
            </ul>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">The Reality Check: Common Compounding Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Modelling gross returns not net returns:</strong> A 5% gross monthly gain with 1.5% in trading costs (spread, commission, swap) is a 3.5% net gain. Compounded over 12 months, this difference produces a 51% vs 42% total return — a significant gap on larger accounts.</li>
              <li><strong>Assuming the gain rate is stable across all market regimes:</strong> A strategy producing 4% per month in trending conditions may produce -2% per month in consolidation. Using a single "average" input does not capture the volatility of real equity curves.</li>
              <li><strong>Compounding without a drawdown model:</strong> Geometric equity curves are disrupted by drawdown. A single -15% period requires +17.6% recovery, adding multiple months to the projected compounding timeline. Always view the compounding calculator alongside the <Link href="/calculators/drawdown-recovery" className="text-accent underline">Drawdown Recovery Calculator</Link>.</li>
              <li><strong>Conflating prop firm scaling with compounding:</strong> On a prop firm trailing drawdown account, a growing balance raises your drawdown floor proportionally. You cannot treat the equity growth as pure compounding because the loss ceiling also moves.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Track Your Actual Equity Curve vs Compound Projection"
            body="The Drawdown platform plots your live equity curve against your compound projection so you can see in real time when adverse variance is pulling you below your growth target — and by how many periods."
            cta="View the Platform"
            href="/pricing"
          />

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
                href="/calculators/risk-of-ruin"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Risk of Ruin Simulator</span>
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
