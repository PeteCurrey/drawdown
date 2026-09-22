import React from "react";
import Link from "next/link";
import { Percent, ArrowRight, ShieldAlert, DollarSign, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PositionSizeCalculator } from "@/components/calculators/PositionSizeCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
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
    {
      question: "Should I size off balance or equity?",
      answer:
        "Size off current equity, not starting balance. If your account is at $23,000 after a drawdown from $25,000, your 1% risk is $230 — not $250. Sizing off balance during a drawdown inflates your true risk percentage and increases probability of hitting catastrophic drawdown.",
    },
    {
      question: "How does a JPY pair change my position size calculation?",
      answer:
        "For USD/JPY (and other JPY pairs), one pip is 0.01 rather than 0.0001. The pip value per standard lot is approximately $6.40–$7.00 depending on the current exchange rate. Using the standard $10 pip value for JPY pairs will cause your lot size to be 30–40% too large.",
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

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary flex items-center gap-3">
              <Users className="w-6 h-6 text-accent flex-shrink-0" />
              Who This Calculator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Retail Forex & CFD Traders",
                  body: "Trading your own capital through a retail broker. You need to align every entry with a defined percentage of your balance so that a losing sequence does not produce irreversible drawdown.",
                },
                {
                  title: "Prop Firm Evaluation Candidates",
                  body: "Navigating a funded account challenge (FTMO, The5ers, FundingPips, etc.). Maximum drawdown rules demand you precisely control lot size per trade relative to your remaining buffer.",
                },
                {
                  title: "Systematic & Algorithmic Traders",
                  body: "Building or reviewing an automated strategy. The formula here is the foundation of fixed-fractional position sizing that must be embedded in every order-generation system.",
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
              The Sizing Formula
            </h2>
            <p>
              Correct position sizing is the mathematical bedrock of sustainable trading. Without disciplined sizing, win rate alone cannot protect your account from ruin.
            </p>
            <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
              Position Size (Standard Lots) = (Account Balance × Risk Percentage) / (Stop Loss in Pips × Pip Value per Lot)
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
                    <td className="p-3 font-semibold text-text-primary">Account Balance</td>
                    <td className="p-3 font-mono">Currency (USD, GBP…)</td>
                    <td className="p-3">Use current equity, not starting balance. Do not include unrealised open profit.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Risk Percentage</td>
                    <td className="p-3 font-mono">% (e.g. 1.0)</td>
                    <td className="p-3">The proportion of equity you are willing to lose if stopped out. Typical range: 0.5% – 2.0%.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Stop Loss in Pips</td>
                    <td className="p-3 font-mono">Pips (integer)</td>
                    <td className="p-3">Distance from entry to stop-loss level. Measured in standard pip units (0.0001 for most pairs, 0.01 for JPY pairs).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Pip Value</td>
                    <td className="p-3 font-mono">Currency per pip per lot</td>
                    <td className="p-3">Monetary value of 1 pip at 1.00 standard lot. $10 for EUR/USD (USD account). Use the <Link href="/calculators/pip-value" className="text-accent underline">Pip Value Calculator</Link> for cross-pairs.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example</h3>
            <p>
              Suppose you have an account balance of <strong>$25,000</strong> and decide to risk <strong>1%</strong> on a EUR/USD long setup with an entry at 1.0850 and an invalidation stop at 1.0825 (a <strong>25-pip stop loss</strong>).
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cash Risk:</strong> $25,000 × 0.01 = $250.00 total exposure at risk.</li>
              <li><strong>Stop Loss Distance:</strong> 25 pips.</li>
              <li><strong>Pip Value:</strong> $10.00 per standard lot on EUR/USD (USD account).</li>
              <li><strong>Calculation:</strong> $250 / (25 × $10) = $250 / $250 = <strong>1.00 Standard Lot (100,000 units)</strong>.</li>
            </ul>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Common Position Sizing Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sizing from balance not equity:</strong> If you have $3,000 in open unrealised losses, your equity is already depleted. Sizing a new trade off the higher balance figure inflates your true risk percentage on that entry.</li>
              <li><strong>Fixed lot regardless of stop distance:</strong> Trading a constant 1.00 lot when your stop varies between 10 pips and 60 pips causes your cash risk per trade to fluctuate 6x, making any risk management framework incoherent.</li>
              <li><strong>Using a flat pip value for JPY pairs:</strong> Applying $10 pip value to USD/JPY will cause your calculated lot size to be approximately 30–40% oversized, meaning your actual cash risk is materially higher than intended.</li>
              <li><strong>Ignoring commission and spread in risk:</strong> On a 2-pip spread instrument with a 10-pip stop, you are actually risking 12 pips from your order execution price. Your true position size should account for spread cost in the denominator.</li>
              <li><strong>Revenge sizing after losses:</strong> Increasing lot size to recover prior drawdown is the most common path to account wipeout. Each trade's lot size must be recalculated independently from your current equity, not from your original starting balance.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Trade Journal with Automatic Lot Enforcement"
            body="Stop sizing manually before every trade. The Drawdown Trading Journal records your intended risk percentage and calculated lot size against every executed trade — flagging instances where your broker fill deviates from your planned exposure."
            cta="Open the Journal"
            href="/pricing"
          />

          {/* Contextual Internal Links Network */}
          <div className="p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
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
                href="/calculators/drawdown"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Probability Calculator</span>
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
