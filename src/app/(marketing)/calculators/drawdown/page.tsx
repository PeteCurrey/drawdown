import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, ShieldAlert, AlertTriangle, LineChart, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { DrawdownCalculator } from "@/components/calculators/DrawdownCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Drawdown Calculator | Losing Streak Probability & Capital Decay",
  description:
    "Model consecutive losing streaks and calculate the mathematical drawdown impact on your trading capital across different win-rate regimes.",
  path: "/calculators/drawdown",
});

export default function DrawdownCalculatorPage() {
  const faqs = [
    {
      question: "What is trading drawdown?",
      answer:
        "Drawdown is the peak-to-trough decline in a trading account's balance or equity, expressed either in monetary terms or as a percentage of peak capital. A drawdown begins when an account drops below its previous high-water mark and only ends when equity climbs back above that peak.",
    },
    {
      question: "Why do losing streaks happen even with a 60% win rate?",
      answer:
        "Trade outcomes in financial markets are independent probabilistic trials. Over a series of 100 trades, the distribution of wins and losses clusters randomly. Even with a 60% edge, the probability of experiencing 5 or more consecutive losses within 100 trades exceeds 60%.",
    },
    {
      question: "How does compounding affect drawdown calculations?",
      answer:
        "When risk is calculated as a fixed percentage of remaining equity (fixed-fractional sizing), account capital decays non-linearly. Each subsequent loss is calculated on a smaller base, so five consecutive 2% losses result in a 9.61% drawdown rather than 10.0%. However, recovering that drawdown requires a higher percentage gain.",
    },
    {
      question: "What is the maximum expected drawdown for a strategy?",
      answer:
        "Maximum expected drawdown increases with the number of trades taken and decreases with larger risk-to-reward ratios. A 1:2 RR strategy with 45% win rate will experience a much shallower worst-case drawdown over 500 trades than a 1:1 RR strategy with 55% win rate, even if both have similar expectancy.",
    },
    {
      question: "How long does it typically take to recover from drawdown?",
      answer:
        "Recovery time depends on your net return per period and the depth of the drawdown. A 20% drawdown requires a 25% gain to recover. At a 3% monthly net gain rate, that is approximately 7–8 months of consecutive net profitable months, assuming no further adverse periods.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Drawdown Calculator",
            "url": "https://drawdown.trading/calculators/drawdown",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Model the statistical probability of consecutive losing streaks and their mathematical impact on your trading capital.",
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
            { label: "Drawdown Modeler", href: "/calculators/drawdown" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Drawdown Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Drawdown <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Model the probability of consecutive losing streaks and their mathematical impact on your trading capital. Stress-test your risk tolerance against institutional probability distributions.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <DrawdownCalculator />

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
                  title: "Strategy Developers",
                  body: "Validating a new system before live capital deployment. Understand what the worst-case drawdown looks like given your strategy's historical win rate and risk per trade.",
                },
                {
                  title: "Prop Firm Aspirants",
                  body: "Modelling whether your strategy's inherent drawdown variance is compatible with a firm's maximum drawdown allowance before paying a challenge fee.",
                },
                {
                  title: "Risk-Aware Retail Traders",
                  body: "Determining the right risk percentage per trade to keep worst-case drawdown sequences within your personal psychological and financial tolerance.",
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
              How Losing Streaks Impact Trading Accounts
            </h2>
            <p>
              Traders frequently underestimate the severity of adverse variance. In any random sample of market outcomes, losing trades do not occur in convenient, evenly spaced intervals. They arrive in clusters.
            </p>
            <h3 className="text-xl font-bold uppercase text-text-primary">The Mathematical Odds of Consecutive Losses</h3>
            <p>
              The single-sequence probability of suffering <em>n</em> consecutive losses is calculated by multiplying the loss probability of your strategy:
            </p>
            <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
              Streak Probability = (1 - Win Rate) ^ Streak Length
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
                    <td className="p-3 font-semibold text-text-primary">Win Rate</td>
                    <td className="p-3 font-mono">% (e.g. 55)</td>
                    <td className="p-3">The percentage of trades that close at a profit. Use historical backtest data or verified live trade history. Do not use theoretical or cherry-picked values.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Risk Per Trade</td>
                    <td className="p-3 font-mono">% of equity</td>
                    <td className="p-3">The percentage of current equity risked on each trade. Must be consistent across the modelled trade sample for the decay formula to be valid.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Streak Length</td>
                    <td className="p-3 font-mono">Number of trades</td>
                    <td className="p-3">The consecutive loss run being evaluated. For strategy stress-testing, model at minimum the streak that has a &gt;5% probability of occurring in your expected annual trade count.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Starting Capital</td>
                    <td className="p-3 font-mono">Currency</td>
                    <td className="p-3">Account equity at the start of the modelled sequence. Used to express drawdown in absolute monetary terms.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example</h3>
            <p>
              Consider a trader with a <strong>55% win rate</strong> risking <strong>1.5%</strong> per trade on a <strong>$50,000</strong> account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Loss Probability per Trade:</strong> 100% - 55% = 45% (0.45).</li>
              <li><strong>Probability of 6 consecutive losses:</strong> (0.45)⁶ = 0.008304 (0.83% chance in any specific sequence, but over 150 trades, the cumulative probability of hitting at least one 6-loss streak exceeds 42%).</li>
              <li><strong>Account Capital After 6 Losses:</strong> $50,000 × (1 - 0.015)⁶ = $45,665.41.</li>
              <li><strong>Drawdown Amount:</strong> $4,334.59 (8.67% maximum drawdown).</li>
              <li><strong>Recovery Required:</strong> +9.49% on remaining equity ($4,334.59 ÷ $45,665.41) to return to $50,000.</li>
            </ul>
          </div>

          {/* Capital Decay */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Capital Decay vs Linear Calculation</h3>
            <p>
              When sizing positions using fixed fractional equity (e.g. risking 1.5% of current equity rather than initial starting balance), each loss reduces the dollar risk on subsequent trades. While this dampens catastrophic ruin, it simultaneously demands a larger recovery gain to reach breakeven.
            </p>
          </div>

          {/* Assumptions & Limitations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-text-primary flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                Underlying Assumptions
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                <li>Fixed-fractional position sizing: each trade risks an exact fixed percentage of remaining balance.</li>
                <li>Independent Bernoulli trials: each trade outcome is statistically independent with stationary win rate.</li>
                <li>Zero execution slippage: trades close exactly at stop invalidation levels.</li>
                <li>Single continuous losing sequence: isolates the drawdown impact of an uninterrupted run of losses.</li>
              </ul>
            </div>

            <div className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-text-primary flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Practical Limitations
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                <li>Regime clustering: market volatility clusters, causing losing trades to arrive in denser streaks than pure independent trials predict.</li>
                <li>Sample horizon effect: a 6-loss streak with an isolated probability of 0.83% has an cumulative probability exceeding 40% over 150 trades.</li>
                <li>Spreads and overnight financing: holding costs slightly increase real-world cash decay beyond pure percentage loss models.</li>
              </ul>
            </div>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Common Drawdown Modelling Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Using theoretical win rates instead of verified data:</strong> A strategy with 100 backtested trades on cherry-picked historical data may have a very different live win rate. Model drawdowns using conservative estimates until live data confirms the win rate.</li>
              <li><strong>Assuming losses are evenly distributed:</strong> Consecutive losses cluster due to market regimes and strategy correlation to conditions. A trend-following system may lose 8 trades in a row during a ranging market phase, regardless of its long-run win rate.</li>
              <li><strong>Ignoring recovery asymmetry:</strong> A 20% drawdown does not require a 20% gain to recover — it requires 25%. The deeper the drawdown, the more non-linear the recovery becomes. Use the <Link href="/calculators/drawdown-recovery" className="text-accent underline">Drawdown Recovery Calculator</Link> to model this correctly.</li>
              <li><strong>Not adjusting risk per trade during a losing streak:</strong> Maintaining the same risk percentage while in drawdown means your absolute dollar risk decreases, which is mathematically correct. Increasing it to "make back losses" is the fastest route to irreversible capital depletion.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Backtest Your Strategy's Real Drawdown Distribution"
            body="The Drawdown Backtester runs Monte Carlo simulations on your actual trade history to show the distribution of worst-case drawdown scenarios — not just the single path you experienced."
            cta="Run a Backtest"
            href="/pricing"
          />

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Related Risk & Recovery Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/drawdown-recovery"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Recovery Calculator (Non-Linear Math)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/risk-of-ruin"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Risk of Ruin Simulator (Monte Carlo Odds)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/research/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Research Paper: Non-Linear Recovery Decay</span>
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
          resourceId="journal-template"
          title="Download the Professional Trading Journal Template"
          description="Log and analyze your losing streaks automatically. Use our pre-designed Excel log to track drawdown triggers and expectancy."
        />
      </div>
    </div>
  );
}
