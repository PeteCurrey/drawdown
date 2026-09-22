import React from "react";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldAlert, AlertTriangle, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PropFirmDailyLossCalculator } from "@/components/calculators/PropFirmDailyLossCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
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
    {
      question: "Does the daily loss limit reset every day?",
      answer:
        "Yes. The daily loss limit is calculated fresh from each day's midnight snapshot. A day where you lose $4,800 on a $5,000 limit does not carry forward — the next day you begin from the new midnight baseline with a new $5,000 allowance (or 5% of the new baseline).",
    },
    {
      question: "How do I calculate my remaining daily loss buffer mid-session?",
      answer:
        "Remaining Buffer = Current Equity − Daily Breach Floor. The Daily Breach Floor = Midnight Baseline − (Midnight Baseline × Daily Limit %). Enter your midnight baseline and current equity into this calculator to get your live remaining buffer at any point during the day.",
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

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary flex items-center gap-3">
              <Users className="w-6 h-6 text-accent flex-shrink-0" />
              Who This Calculator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Evaluation Challenge Traders",
                  body: "Traders actively in Phase 1 or Phase 2 of a funded evaluation. The daily loss limit is the most commonly breached rule — this tool shows your exact safe trading buffer before each session.",
                },
                {
                  title: "Funded Account Holders",
                  body: "Already-funded traders who need to protect their payout eligibility. A single daily breach on a funded account results in termination and loss of all accumulated profit.",
                },
                {
                  title: "Overnight Position Managers",
                  body: "Traders who hold positions through the daily server midnight reset. Floating profits at midnight raise your daily loss floor; this calculator models the consequence of that reset.",
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
              Daily Breach Floor ($) = Midnight Baseline − Allowed Daily Loss
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
                    <td className="p-3 font-semibold text-text-primary">Midnight Baseline</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">The higher of your closed balance and your equity at the firm's server midnight. This is the starting reference for the new trading day's daily loss calculation.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Daily Loss Limit</td>
                    <td className="p-3 font-mono">% (e.g. 5)</td>
                    <td className="p-3">The percentage of the midnight baseline that represents your maximum tolerated intra-day equity decline. Typically 4–5% across most major prop firms.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Current Session Equity</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">Your live account equity during the current trading session, including all floating open positions. The breach floor is tested against this value in real-time.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Open Floating P&amp;L</td>
                    <td className="p-3 font-mono">Currency (positive = profit)</td>
                    <td className="p-3">The unrealised profit or loss of currently open trades. Included in equity but not in closed balance. Negative floating P&amp;L directly erodes your daily buffer.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example: The Midnight Trap</h3>
            <p>
              Assume a <strong>$100,000 funded account</strong> with a <strong>5% daily loss limit ($5,000)</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Day 1:</strong> You make $3,000 in closed profit. Account balance is now $103,000.</li>
              <li><strong>Midnight Snapshot:</strong> Balance is $103,000. Equity is $103,000. Allowed daily loss for Day 2 is 5% of $103,000 = <strong>$5,150</strong>.</li>
              <li><strong>Breach Level for Day 2:</strong> $103,000 − $5,150 = <strong>$97,850</strong>.</li>
              <li><strong>Critical Notice:</strong> Even though your overall account is still well above the $90,000 initial drawdown threshold, dropping below $97,850 on Day 2 results in an immediate rule breach and account termination.</li>
              <li><strong>Second Trap:</strong> If you hold a floating $2,000 profit trade into midnight, your equity at midnight is $105,000. Day 3 floor = $105,000 − $5,250 = $99,750. A reversal the following morning costing you $3,000 would breach you even though your balance never dropped.</li>
            </ul>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Common Daily Loss Rule Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Ignoring the firm's server timezone:</strong> FTMO resets at midnight CE(S)T (Prague). MyForexFunds used EST. Apex uses US Central time. Trading beyond your assumed reset time in the wrong timezone means you are operating under yesterday's floor, not today's.</li>
              <li><strong>Not factoring overnight swap costs into equity:</strong> Swap charges on open positions post at midnight rollover. A large forex position with a negative swap can silently reduce your midnight equity baseline, tightening your next day's buffer without any executed trades.</li>
              <li><strong>Calculating safety buffer from balance not equity:</strong> Your closed balance may be $102,000 but if you have $3,000 in floating losses, your equity is $99,000. The daily floor is calculated from the midnight equity baseline — not from your current closed balance mid-session.</li>
              <li><strong>Using the same lot size throughout the month:</strong> As the month progresses and your buffer narrows toward the breach floor, you must reduce position sizes proportionally. Continuing to trade the same lot sizes when your daily buffer is $1,200 instead of $5,000 has catastrophically different risk-to-buffer ratios.</li>
            </ul>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Verification Checklist for Funded Traders</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Check whether your firm's server timezone is CE(S)T (Prague), UTC, or EST (New York).</li>
              <li>Ensure pending stop loss orders calculate total risk including commissions and slippage.</li>
              <li>Avoid holding floating profitable swings into the midnight rollover if you cannot supervise the opening session.</li>
              <li>Check if your firm treats the daily limit as equity-based or balance-based — this distinction is critical for traders using martingale or averaging strategies.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Never Breach a Daily Limit Again"
            body="The Drawdown platform tracks your live daily loss buffer in real time against your prop firm's specific midnight baseline. Receive alerts before you approach the breach floor — not after."
            cta="Protect Your Account"
            href="/pricing"
          />

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
