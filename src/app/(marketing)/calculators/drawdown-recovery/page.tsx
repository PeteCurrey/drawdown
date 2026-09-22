import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DrawdownRecoveryCalculator } from "@/components/calculators/DrawdownRecoveryCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
import { BookOpen, ArrowRight, HelpCircle, Activity, Percent, Users, Table2 } from "lucide-react";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Drawdown Recovery Calculator & Non-Linear Loss Math",
  description:
    "Calculate the non-linear percentage gain required to recover from trading losses. Includes trade count estimates, worked examples, and formulas.",
  path: "/calculators/drawdown-recovery",
});

export default function DrawdownRecoveryPage() {
  const faqs = [
    {
      question: "Why does a 50% loss require a 100% gain to recover?",
      answer:
        "Loss recovery is non-linear because your profit must be earned on a smaller remaining capital base. If you lose $5,000 on a $10,000 account (50%), you have $5,000 remaining. To get back to $10,000, you must generate $5,000 profit on your $5,000 balance: $5,000 / $5,000 = 100% gain.",
    },
    {
      question: "What is the non-linear recovery decay point?",
      answer:
        "Beyond 20% drawdown, the required recovery percentage accelerates dramatically. While a 10% loss requires an 11.1% gain and a 20% loss requires 25%, a 70% loss demands a 233.3% gain, and a 90% loss requires a 900% return.",
    },
    {
      question: "How should a trader adjust position size during a drawdown?",
      answer:
        "Traders should reduce position sizes as drawdown deepens. Increasing lot size to recover quickly ('revenge trading') drastically elevates the probability of total account liquidation.",
    },
    {
      question: "How many trades does recovery typically take?",
      answer:
        "At a consistent net gain of 1% per trade and a 1:2 RR ratio, recovering a 20% drawdown (requiring 25% gain) takes approximately 22–25 winning trades, assuming no further net-negative sessions. Recovery time is highly sensitive to the size of your average winning trade and subsequent drawdown risk.",
    },
    {
      question: "At what drawdown level is an account effectively unrecoverable?",
      answer:
        "There is no absolute threshold, but beyond 50% drawdown, the compounding effect becomes so asymmetric that recovery requires performance that exceeds most strategies' realistic capabilities. A 70% drawdown requires a 233% gain — representing roughly 3–4 years of consistent institutional-grade returns. Most retail traders never recover from drawdowns exceeding 40%.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Drawdown Recovery Calculator",
            "url": "https://drawdown.trading/calculators/drawdown-recovery",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate the non-linear percentage gain required to recover from trading losses.",
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
            { label: "Drawdown Recovery Calculator", href: "/calculators/drawdown-recovery" },
          ]}
        />

        <div className="my-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
            Drawdown Recovery Calculator
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            Understand non-linear loss mathematics. As losses deepen, the percentage gain required relative to remaining equity expands exponentially.
          </p>
        </div>

        {/* Interactive Calculator Component */}
        <DrawdownRecoveryCalculator />

        {/* Main editorial section */}
        <div className="mt-12 space-y-10">

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Who This Calculator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Traders in Active Drawdown",
                  body: "You are currently below your equity high-water mark and need to understand exactly how much you need to gain — and over how many trades — to return to breakeven.",
                },
                {
                  title: "Prop Firm Challengers",
                  body: "Assessing how deep a drawdown your funded account can realistically recover from before the evaluation's profit target deadline, without violating drawdown rules.",
                },
                {
                  title: "Risk Policy Designers",
                  body: "Setting maximum drawdown thresholds for a strategy or fund. Understanding the recovery math helps establish at what drawdown level a strategy should be suspended rather than traded through.",
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
          <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Formula Explanation & Worked Example
            </h2>

            <div className="text-xs text-text-secondary space-y-3 leading-relaxed">
              <p>
                The percentage recovery required is calculated using the formula:
              </p>
              <div className="p-4 rounded-xl bg-background-primary border border-border-primary/60 font-mono text-accent text-center text-sm">
                Required Gain % = ( Loss Amount / Remaining Equity ) × 100
              </div>

              {/* Variable Definitions */}
              <h3 className="font-bold text-text-primary text-sm pt-4 flex items-center gap-2">
                <Table2 className="w-4 h-4 text-accent" />
                Input Variable Definitions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-border-primary/40">
                  <thead className="bg-background-primary/60 font-mono text-text-tertiary uppercase">
                    <tr>
                      <th className="p-3 border-b border-border-primary/40">Variable</th>
                      <th className="p-3 border-b border-border-primary/40">Units</th>
                      <th className="p-3 border-b border-border-primary/40">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary/30">
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Peak Equity</td>
                      <td className="p-3 font-mono">Currency</td>
                      <td className="p-3">The high-water mark — highest balance or equity the account has ever reached. This is the recovery target.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Current Equity</td>
                      <td className="p-3 font-mono">Currency</td>
                      <td className="p-3">Current account equity. The difference between peak and current equity is the drawdown amount in absolute terms.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Drawdown %</td>
                      <td className="p-3 font-mono">%</td>
                      <td className="p-3">Calculated as: (Peak − Current) / Peak × 100. This is the input most traders already know intuitively.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-text-primary text-sm pt-2">Worked Example:</h3>
              <p>
                Suppose an account starts with <strong>£10,000</strong> and suffers a <strong>30% drawdown (£3,000 loss)</strong>. The remaining balance is <strong>£7,000</strong>. To return to the initial £10,000 starting capital, the trader must make £3,000 profit on the remaining £7,000 equity.
              </p>
              <p className="font-semibold text-text-primary">
                £3,000 Profit / £7,000 Balance = 42.9% Gain Required — not 30%.
              </p>
              <p>
                This is why the recovery curve accelerates non-linearly beyond 20%: you are always earning back lost capital on a shrinking base.
              </p>
            </div>

            {/* Common Pitfalls */}
            <div className="pt-4 border-t border-border-primary/40 space-y-3">
              <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
                Common Recovery Pitfalls
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary leading-relaxed">
                <li><strong>Increasing position size to recover faster:</strong> Doubling lot size after a 20% drawdown means one losing sequence can push drawdown to 40%, requiring a 67% recovery. The exponential math works against you.</li>
                <li><strong>Targeting original balance rather than current equity:</strong> Recovery should be measured from your current equity base. Mentally anchoring to your original peak creates psychological pressure that leads to over-trading.</li>
                <li><strong>Not accounting for ongoing trading costs during recovery:</strong> Spreads, commissions, and overnight swap rates are deducted from every trade. A 30% drawdown is harder to recover in a high-cost environment versus a raw spread account. Factor in your average cost per trade when estimating recovery timelines.</li>
                <li><strong>Ignoring the opportunity cost of drawdown:</strong> Capital in drawdown is capital not compounding. A 6-month recovery period has real compounding cost against your long-term equity curve targets.</li>
              </ul>
            </div>

            {/* Conversion Module */}
            <CalculatorNextStep
              heading="Manage Your Recovery Inside a Funded Challenge"
              body="Prop firm evaluations impose profit targets and drawdown limits simultaneously. The Drawdown platform tracks your exact recovery progress against both limits so you know at all times whether recovery is still mathematically viable."
              cta="Track Your Recovery"
              href="/pricing"
            />

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
                  href="/calculators/risk-of-ruin"
                  className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
                >
                  <span>Risk of Ruin Simulator</span>
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
                  <span>Research Paper: Non-Linear Recovery Decay</span>
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
    </div>
  );
}
