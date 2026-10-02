import React from "react";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldAlert, AlertTriangle, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PropFirmMaximumLossCalculator } from "@/components/calculators/PropFirmMaximumLossCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
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
    {
      question: "Can I ever reduce my trailing drawdown floor?",
      answer:
        "No. Once a trailing drawdown floor moves up with your equity, it cannot go back down. The floor only moves up, never down. This means early profits in a trailing drawdown account permanently tighten your future loss buffer.",
    },
    {
      question: "What happens when my remaining maximum loss buffer falls below a safe threshold?",
      answer:
        "When your remaining buffer approaches a critical level (typically less than 2× your average lot-size risk), you must immediately reduce position sizes. Trading the same volume with a $2,000 buffer that you used with a $10,000 buffer is proportionally 5× more reckless and dramatically increases breach probability.",
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

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary flex items-center gap-3">
              <Users className="w-6 h-6 text-accent flex-shrink-0" />
              Who This Calculator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Prop Firm Evaluation Traders",
                  body: "In Phase 1 or Phase 2 of a funded challenge. Know your exact loss floor at all times and how many losing trades your current lot size can absorb before breach.",
                },
                {
                  title: "Funded Traders on Trailing Accounts",
                  body: "Managing a futures or CFD funded account with a trailing drawdown model. Every new equity peak tightens your floor permanently — this calculator shows exactly where it currently sits.",
                },
                {
                  title: "Firm-Selection Researchers",
                  body: "Comparing prop firms before paying a challenge fee. Static vs trailing drawdown represents a fundamentally different risk profile for the same nominal account size. This tool makes the difference concrete.",
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
              Max Loss Floor ($) = Initial Account Balance − (Initial Account Balance × Max Drawdown %)
              <br />
              Remaining Buffer ($) = Current Equity − Max Loss Floor
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
                    <td className="p-3 font-semibold text-text-primary">Initial Account Balance</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">The nominal funded amount at evaluation start (e.g. $100,000). For static drawdown, this is the permanent reference. For trailing drawdown, the floor moves up from this base as equity grows.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Maximum Drawdown %</td>
                    <td className="p-3 font-mono">% (e.g. 10)</td>
                    <td className="p-3">The firm's total loss limit as a percentage of the reference balance. Typical range: 8–12% across most prop firms. Check whether this applies to balance, equity, or the higher of the two.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Current Account Equity</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">Your live equity including all open floating positions. For trailing drawdown firms, if this is higher than your previous reference point, the floor has moved up.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Drawdown Model</td>
                    <td className="p-3 font-mono">Static / Trailing</td>
                    <td className="p-3">Static: floor is fixed from initial balance. Trailing: floor trails the highest equity or balance ever reached. Some futures firms trail from intraday peak unrealised equity — the most restrictive variant.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example: Static vs Trailing</h3>
            <p>
              Consider a <strong>$100,000 account</strong> with a <strong>10% maximum drawdown ($10,000 buffer)</strong>. You grow the account to <strong>$108,000</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Under Static Drawdown (FTMO):</strong> The breach floor is fixed at $90,000. With your account at $108,000, your buffer has expanded from $10,000 to <strong>$18,000</strong>. You have significant breathing room.</li>
              <li><strong>Under Trailing Drawdown (Apex / Intraday Peak):</strong> The floor trails your peak balance. When you reach $108,000, your floor moves up to $108,000 − $10,000 = <strong>$98,000</strong>. Your buffer remains locked at only $10,000.</li>
              <li><strong>The Hidden Trap:</strong> If during a trade your floating equity momentarily peaks at $110,000 (unrealised) before the trade reverses to close at $107,000, your trailing floor has already moved to $100,000 — locked by the intraday peak you never actually realised in balance.</li>
            </ul>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Common Maximum Loss Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Treating trailing drawdown as static:</strong> The most expensive mistake in prop trading. If you grew your account to $115,000 and your trailing floor is at $105,000, you cannot afford a trade that draws down more than $10,000 at any point — regardless of your target exit.</li>
              <li><strong>Separating daily limit from overall limit in your mental model:</strong> You can hit your daily limit ($5,000) while still having $8,000 of maximum buffer remaining. Both limits apply simultaneously and are completely independent. Monitor both concurrently with every open trade.</li>
              <li><strong>Scaling lot sizes based on new highs instead of buffer size:</strong> After growing from $100,000 to $110,000, many traders increase lot sizes proportionally. On a trailing drawdown account, this is dangerous — your real risk buffer (distance from floor to equity) has not grown, only your nominal balance has.</li>
              <li><strong>Not checking how the firm handles commission and swap in drawdown calculation:</strong> Some firms calculate drawdown on balance (closed P&L only); others on equity (including open positions and accrued swap). Failing to read your account agreement precisely can mean an unexpected breach from overnight swap accumulation on large positions.</li>
            </ul>
          </div>

          {/* Risk Management Rules */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Risk Management Rules for Funded Accounts</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Scale down risk as drawdown deepens:</strong> If your remaining buffer drops from $10,000 to $4,000, cut lot sizes in half immediately. Risking the same lot size on a diminished buffer increases risk-of-ruin exponentially.</li>
              <li><strong>Separate daily limit from maximum limit:</strong> You can breach your daily limit ($5,000) while still having $8,000 of maximum buffer remaining. Always monitor both limits concurrently.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Track Both Drawdown Limits Simultaneously"
            body="The Drawdown platform displays your real-time remaining daily loss buffer and overall maximum loss buffer side by side — calculated from your actual broker equity feed. Know your exact position before placing any order."
            cta="Connect Your Account"
            href="/pricing"
          />

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
