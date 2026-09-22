import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Percent, Activity, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { RiskCalculator } from "@/components/tools/RiskCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Trading Risk Calculator | Capital Exposure & Sizing Check",
  description:
    "Verify how much absolute capital is at risk on your trade and check your account survival metrics before executing in live markets.",
  path: "/calculators/risk",
});

export default function RiskCalculatorPage() {
  const faqs = [
    {
      question: "What is trade cash risk versus account risk?",
      answer:
        "Trade cash risk is the exact monetary amount you stand to lose if your stop loss is hit (e.g. $250). Account risk is that monetary loss expressed as a percentage of your total liquid equity (e.g. $250 / $25,000 = 1.0% account risk).",
    },
    {
      question: "How do I calculate risk per trade manually?",
      answer:
        "Multiply your lot size by the distance from entry to stop loss (in pips or points) and the pip value for the specific asset. Cash Risk = Position Size (Lots) × Stop Loss Distance × Pip Value.",
    },
    {
      question: "What is the 1% risk rule in trading?",
      answer:
        "The 1% rule states that an investor or trader should never risk more than 1% of total account capital on any single trade setup. Adhering to this rule mathematically prevents catastrophic drawdowns during adverse losing sequences.",
    },
    {
      question: "Why do institutions enforce percentage-based risk limits?",
      answer:
        "Fixed percentage limits ensure that position sizes scale proportionally with account equity. A funded trader at $100,000 and the same trader at $80,000 after losses should be trading smaller lot sizes — not the same volume — to ensure the drawdown curve is non-linear and recovery is still achievable.",
    },
    {
      question: "Does the risk calculator account for spread and commission?",
      answer:
        "This calculator models the theoretical stop-distance risk before transaction costs. In practice, your real cash risk on a 20-pip stop on a 2-pip spread instrument is closer to 22 pips from fill. Always factor in spread when setting stop levels, not when calculating lot size.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Trading Risk Calculator",
            "url": "https://drawdown.trading/calculators/risk",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Verify how much absolute capital is at risk on your trade and check your account survival metrics before executing.",
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
            { label: "Risk Modeler", href: "/calculators/risk" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Risk <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Verify how much absolute capital is at risk on your trade and check your account survival metrics instantly. Prevent unforced errors before sending orders to your broker.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="mb-20">
          <RiskCalculator />
        </div>

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
                  title: "Pre-Trade Checkers",
                  body: "Traders who want a quick sanity-check on their lot size before placing a live order. Paste your planned lot size and stop distance; see the exact cash risk before you execute.",
                },
                {
                  title: "Prop Firm Challengers",
                  body: "Funded traders managing strict drawdown buffers. Use this to verify that each planned trade keeps your remaining daily and overall loss buffer intact.",
                },
                {
                  title: "Portfolio Risk Auditors",
                  body: "Traders with multiple open positions reviewing their aggregate exposure. Sum individual trade cash risks to understand total concurrent capital at risk.",
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
              How to Check Capital Risk
            </h2>
            <p>
              While position sizing tells you how much volume to trade, the risk calculator displays the absolute capital cost of an idea being invalidated. By knowing your precise dollar downside before clicking execute, you prevent emotional decision-making when the market moves against your position.
            </p>
            <p>The risk calculator multiplies your trade volume (lots) by the distance to your stop loss and the currency value of each pip:</p>
            <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
              Cash Risk = Position Size (Lots) × Stop Loss (Pips) × Pip Value
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
                    <td className="p-3 font-semibold text-text-primary">Position Size</td>
                    <td className="p-3 font-mono">Standard Lots</td>
                    <td className="p-3">Number of standard lots in your planned order. 1.00 lot = 100,000 units; 0.10 = 10,000 units (mini lot).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Stop Loss</td>
                    <td className="p-3 font-mono">Pips</td>
                    <td className="p-3">Distance from entry to stop level. Measured at the point of order placement, before spread is added.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Pip Value</td>
                    <td className="p-3 font-mono">Currency per pip per lot</td>
                    <td className="p-3">Monetary value of 1 pip at 1.00 standard lot. Use the <Link href="/calculators/pip-value" className="text-accent underline">Pip Value Calculator</Link> to determine this for any pair and account currency.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Account Equity</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">Your live account equity including unrealised open positions. Used to express cash risk as an account risk percentage.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example</h3>
            <p>
              A trader places <strong>0.50 lots</strong> of GBP/USD with a <strong>40-pip stop</strong> and a pip value of <strong>$10</strong> on a USD account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cash Risk:</strong> 0.50 × 40 × $10 = <strong>$200.00</strong>.</li>
              <li><strong>Account Equity:</strong> $20,000.</li>
              <li><strong>Account Risk %:</strong> $200 / $20,000 = <strong>1.0%</strong>.</li>
              <li><strong>Verdict:</strong> Within institutional tolerance; consistent with 100+ trade sequences before encountering ruin risk.</li>
            </ul>
          </div>

          {/* Why institutional desks enforce limits */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Why Institutional Desks Enforce Strict Percentage Limits</h3>
            <p>
              Professional trading firms rarely permit traders to risk more than 0.5% to 1.5% of total capital on a discretionary trade. Sizing at 1% ensures that even a severe 10-trade losing sequence only depletes ~9.56% of account equity—a drawdown that can be recovered with a +10.57% rebound. Risking 5% or 10% per trade turns a standard losing streak into irreversible capital destruction.
            </p>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Common Risk Calculation Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Treating percentage risk as absolute ceiling:</strong> Risking 1% on each of 3 simultaneous trades is 3% of total equity at risk concurrently — not 1%. Aggregate all open trade exposures into a single portfolio risk figure.</li>
              <li><strong>Ignoring correlation:</strong> Two long positions in EUR/USD and GBP/USD during a USD fundamental event effectively double your currency exposure. Treat highly correlated pairs as a single position for risk purposes.</li>
              <li><strong>Not accounting for slippage on volatile assets:</strong> Stop losses on indices, commodities, and during news events often trigger at prices worse than set. Budget 5–15% extra in your cash risk estimate when trading high-volatility instruments around scheduled economic releases.</li>
              <li><strong>Measuring risk from a tight technical stop that will be violated:</strong> If your "technical" stop is 8 pips but daily volatility (ATR) is 45 pips, you are likely to be stopped out by noise before the setup invalidation. Risk calculation must reflect a stop that the asset is unlikely to reach without the thesis being wrong.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Real-Time Risk Verification Inside the Platform"
            body="The Drawdown platform shows your exact cash risk and account risk percentage on every open trade in real time — before and after execution. No manual calculation needed before entering a position."
            cta="Start Tracking"
            href="/pricing"
          />

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Risk Architecture
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
                href="/calculators/pip-value"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Pip Value Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/drawdown"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Probability Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/research/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Research & Risk Papers</span>
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
