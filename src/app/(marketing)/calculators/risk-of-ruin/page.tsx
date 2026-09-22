import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RiskOfRuinSimulator } from "@/components/calculators/RiskOfRuinSimulator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
import { BookOpen, ArrowRight, HelpCircle, Activity, Percent, Users, Table2 } from "lucide-react";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Risk of Ruin Simulator & Drawdown Probability",
  description:
    "Simulate trading account ruin probability based on win rate, reward-to-risk ratio, and position size. Mathematical formulas and risk analysis.",
  path: "/calculators/risk-of-ruin",
});

export default function RiskOfRuinPage() {
  const faqs = [
    {
      question: "What is Risk of Ruin in trading?",
      answer:
        "Risk of Ruin is a mathematical concept from probability theory and gambling mathematics that calculates the likelihood of an investor losing so much capital that they cannot continue trading, either through complete account liquidation or breaching a mandatory drawdown limit.",
    },
    {
      question: "How do win rate and risk-to-reward interact in ruin calculations?",
      answer:
        "Ruin probability is non-linear. Even a strategy with a 40% win rate can have near-zero risk of ruin if its risk-to-reward ratio is 1:3 and risk per trade is kept below 1.5%. Conversely, an 80% win-rate strategy risking 10% per trade faces virtually guaranteed ruin over long sequences.",
    },
    {
      question: "What is the Ralph Vince formula for risk of ruin?",
      answer:
        "In fixed-fractional trading, the probability of ruin is expressed as: Risk of Ruin = ((1 - Advantage) / (1 + Advantage)) ^ Units of Capital, where Advantage is determined by the mathematical expectancy of the system.",
    },
    {
      question: "What risk per trade makes ruin probability negligible?",
      answer:
        "For most positive-expectancy strategies (win rate above 40%, RR above 1:1.5), keeping risk per trade below 2% of equity produces a ruin probability approaching zero over typical trading careers. Above 3% per trade, even high-edge strategies face meaningful ruin probability over 500+ trade sequences.",
    },
    {
      question: "Does a higher win rate always mean lower ruin risk?",
      answer:
        "No. A 70% win rate strategy risking 5% per trade with a 1:0.5 risk-to-reward ratio has lower mathematical expectancy than a 40% win rate strategy with a 1:3 RR ratio risking 1% per trade. Ruin risk depends on expectancy (win rate × average win − loss rate × average loss) combined with risk per trade, not win rate alone.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Risk of Ruin Simulator",
            "url": "https://drawdown.trading/calculators/risk-of-ruin",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Evaluate the mathematical probability of hitting your maximum tolerable drawdown threshold.",
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
            { label: "Risk of Ruin Simulator", href: "/calculators/risk-of-ruin" },
          ]}
        />

        <div className="my-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
            Risk-of-Ruin Simulator
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            Evaluate the mathematical probability of hitting your maximum tolerable drawdown threshold before achieving trading goals. Model the statistical longevity of your strategy under adverse variance.
          </p>
        </div>

        {/* Interactive Simulator */}
        <RiskOfRuinSimulator />

        {/* Editorial section */}
        <div className="mt-12 space-y-10">

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Who This Simulator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "System Developers",
                  body: "Testing whether a new or existing strategy's statistical parameters will sustain a viable trading career. High ruin probability is the most important signal to adjust risk per trade before deploying live capital.",
                },
                {
                  title: "Prop Firm Challengers",
                  body: "Modelling the probability that your strategy will hit the evaluation's maximum drawdown before reaching the profit target. Ruin threshold equals the firm's drawdown limit.",
                },
                {
                  title: "Risk Threshold Setters",
                  body: "Determining the maximum acceptable risk per trade for a given strategy profile — the point at which ruin probability rises above an acceptable tolerance level (e.g. below 1%).",
                },
              ].map((persona) => (
                <div key={persona.title} className="p-4 border border-border-slate/40 bg-background-surface/30 space-y-2">
                  <p className="text-xs font-bold text-text-primary uppercase tracking-wide">{persona.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{persona.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology block */}
          <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Mathematical Methodology & Risk Longevity
            </h2>
            <div className="text-xs text-text-secondary space-y-3 leading-relaxed">
              <p>
                The Risk of Ruin calculation estimates the statistical probability that a series of consecutive losses will breach your defined drawdown limit before the system reaches its profit target.
              </p>
              <p>
                Under Perry Kaufman and Ralph Vince probability models, whenever expected value (EV) is negative, ruin probability is 100%. When EV is positive, ruin probability decreases exponentially as the ratio of account capital to trade risk increases.
              </p>

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
                      <td className="p-3 font-semibold text-text-primary">Win Rate</td>
                      <td className="p-3 font-mono">%</td>
                      <td className="p-3">Percentage of trades that produce a net profit after costs. Use verified historical data, not forward-projected estimates.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Risk-to-Reward Ratio</td>
                      <td className="p-3 font-mono">Ratio (e.g. 1:2)</td>
                      <td className="p-3">The average ratio of winning trade profit to losing trade loss. A 1:2 ratio means every win earns twice what a loss costs. Must reflect actual average outcomes, not targets.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Risk Per Trade</td>
                      <td className="p-3 font-mono">% of equity</td>
                      <td className="p-3">Fixed fractional position size as a percentage of current equity. The single most powerful lever for reducing ruin probability.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Ruin Threshold</td>
                      <td className="p-3 font-mono">% drawdown</td>
                      <td className="p-3">The drawdown percentage at which you define "ruin." For prop firms, this is the maximum drawdown limit. For self-funded traders, this is typically the drawdown at which you would stop the strategy.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Worked example */}
              <h3 className="font-bold text-text-primary text-sm pt-4">Worked Example</h3>
              <p>
                A discretionary trader with a <strong>45% win rate</strong>, <strong>1:2 risk-to-reward</strong>, risking <strong>1% per trade</strong>, with a <strong>20% ruin threshold</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                <li><strong>Expectancy per trade:</strong> (0.45 × 2) − (0.55 × 1) = 0.90 − 0.55 = +0.35R per trade (positive).</li>
                <li><strong>Units of capital before ruin:</strong> 20% drawdown / 1% risk = 20 units of risk before breach.</li>
                <li><strong>Ruin probability:</strong> With positive expectancy and 20 units of capital buffer, ruin probability under the Vince model is approximately <strong>1.2%</strong> — near-negligible over a 500-trade career.</li>
                <li><strong>At 3% risk per trade:</strong> Same strategy reaches ruin in roughly 7 consecutive losses. Ruin probability rises to approximately <strong>18%</strong>.</li>
              </ul>

              <p className="text-text-tertiary pt-2">
                Note: This simulator assumes independent trials and stationary distribution. In live financial markets, trade outcomes may exhibit serial correlation, slippage, or volatility clustering during macroeconomic shock events.
              </p>
            </div>

            {/* Common Pitfalls */}
            <div className="pt-4 border-t border-border-primary/40 space-y-3">
              <h3 className="font-bold text-text-primary text-sm">Common Risk-of-Ruin Calculation Pitfalls</h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary leading-relaxed">
                <li><strong>Using theoretical win rates not realised ones:</strong> A strategy that backtests at 55% may live-trade at 42% due to execution slippage, missed signals, and emotional interference. Always stress-test ruin scenarios using a win rate 10–15% below your backtest figure.</li>
                <li><strong>Assuming a fixed risk-to-reward in all market conditions:</strong> Trend-following strategies achieve their target RR regularly in trending markets but frequently get stopped out before targets in ranging conditions. Average RR must account for partial wins, breakeven trades, and early exits.</li>
                <li><strong>Not adjusting position size when drawdown reduces equity:</strong> If your account drops from $25,000 to $20,000 but you continue trading the same lot size, your effective risk per trade rises from 1% to 1.25%, materially increasing ruin probability. Fixed-fractional sizing must be recalculated at each trade entry.</li>
                <li><strong>Confusing ruin probability with certainty:</strong> A 5% ruin probability means that over many trials of your strategy, roughly 1 in 20 will result in ruin. It is not a guarantee of safety. For funded accounts where one ruin event ends the challenge, even 5% is meaningfully high risk.</li>
              </ul>
            </div>

            {/* Conversion Module */}
            <CalculatorNextStep
              heading="Audit Your Real Edge vs Your Ruin Probability"
              body="The Drawdown Backtester runs your actual trade history through Monte Carlo simulations to produce your real observed ruin probability — not a theoretical estimate based on assumed win rates."
              cta="Run Your Backtest"
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
                  href="/calculators/drawdown-recovery"
                  className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-primary/60 hover:border-accent text-text-secondary hover:text-text-primary transition group"
                >
                  <span>Drawdown Recovery Calculator</span>
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
                  <span>Quantitative Research: Drawdown & Ruin Probability</span>
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
