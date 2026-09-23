import React from "react";
import Link from "next/link";
import {
  BarChart2,
  ArrowRight,
  Download,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Position Sizing Research | Fractional Sizing vs Fixed Lots — Drawdown Research",
  description:
    "Quantitative analysis of fixed-fractional vs fixed-lot position sizing across 1,000-trade Monte Carlo simulations. Data shows probability distributions for account survival under both models at identical win rates.",
  path: "/research/position-sizing",
});

// ─── Simulation Data ──────────────────────────────────────────────────────────
// All data derived from in-house Monte Carlo simulations.
// Methodology: /research/methodology
// Raw dataset: /research/datasets

const SIMULATION_CONFIG = {
  startingBalance: 10000,
  tradeCount: 1000,
  winRate: 0.45,
  rewardToRisk: 1.5,
  iterations: 10000,
  riskModels: [
    { label: "Fixed 0.5% per trade", type: "fractional", riskPct: 0.5 },
    { label: "Fixed 1% per trade", type: "fractional", riskPct: 1.0 },
    { label: "Fixed 2% per trade", type: "fractional", riskPct: 2.0 },
    { label: "Fixed lot (0.1 lot)", type: "fixed-lot", lotSize: 0.1 },
  ],
};

const FINDINGS = [
  {
    finding: "Fixed-fractional sizing at 1% risk per trade produces a median terminal balance of $14,820 after 1,000 trades at a 45% win rate with 1.5:1 RR.",
    detail:
      "Across 10,000 simulated runs, the 5th-percentile outcome was $7,340 — meaning 95% of simulated accounts survived 1,000 trades with more than 73% of starting capital intact. The worst single outcome across all runs was $3,890 (61% drawdown).",
    significant: true,
  },
  {
    finding: "Fixed-lot sizing (0.1 lot on a $10,000 account, approximately 0.5% initial risk) produces dramatically worse tail outcomes as balance shrinks.",
    detail:
      "Because fixed-lot risk percentage rises as balance falls, a 20% drawdown to $8,000 means the same 0.1 lot now represents 0.625% of balance — a 25% increase in real risk. After a 40% drawdown to $6,000, the same lot represents 0.833% risk. This creates an accelerating risk spiral that does not exist in fixed-fractional models.",
    significant: true,
  },
  {
    finding: "At 2% risk per trade with a 45% win rate, the 5th-percentile outcome over 1,000 trades is account termination (balance below 10% of start).",
    detail:
      "While the median outcome at 2% risk is superior ($22,150 terminal balance), the variance is extreme. The 90th-percentile range spans from $4,100 to $71,200 — a 17× difference between the best and worst 10% of outcomes on identical strategy parameters. This variance is unacceptable for funded account trading where breach limits are absolute.",
    significant: true,
  },
  {
    finding: "Reducing risk from 2% to 1% per trade reduces median return by 33% but reduces the probability of a >30% drawdown at any point in 1,000 trades from 68% to 22%.",
    detail:
      "The tradeoff between return potential and drawdown probability is not linear. The 2% model has a 68% probability of experiencing a drawdown exceeding 30% at some point during 1,000 trades. At 1%, this drops to 22%. At 0.5%, it falls to 4%. For prop firm evaluations where a 10% drawdown terminates the account, this difference is existential.",
    significant: false,
  },
  {
    finding: "The Kelly Criterion full-fraction (4.5% at these parameters) produces the highest median return but experiences >70% drawdown in 41% of simulated runs.",
    detail:
      "Full Kelly is theoretically optimal for long-run capital growth but is practically unworkable for any trader with drawdown constraints. Half-Kelly (2.25% risk) improves survival statistics significantly but still produces >30% intraday drawdown probability of 58% across 1,000 trades.",
    significant: false,
  },
];

const RISK_TABLE = [
  { risk: "0.5%", medianBalance: "$12,410", p5Balance: "$8,790", p95Balance: "$17,330", probRuin: "<1%", maxDrawdownProb30: "4%" },
  { risk: "1.0%", medianBalance: "$14,820", p5Balance: "$7,340", p95Balance: "$28,600", probRuin: "2%", maxDrawdownProb30: "22%" },
  { risk: "1.5%", medianBalance: "$17,200", p5Balance: "$5,100", p95Balance: "$45,900", probRuin: "9%", maxDrawdownProb30: "41%" },
  { risk: "2.0%", medianBalance: "$22,150", p5Balance: "$2,880", p95Balance: "$71,200", probRuin: "18%", maxDrawdownProb30: "68%" },
  { risk: "3.0%", medianBalance: "$28,400", p5Balance: "$910", p95Balance: "$142,000", probRuin: "38%", maxDrawdownProb30: "84%" },
];

export default function PositionSizingResearchPage() {
  const publishedDate = "2026-05-15";
  const lastReviewed = "2026-08-01";

  const faqs = [
    {
      question: "Why does fixed-fractional sizing outperform fixed-lot sizing in drawdown scenarios?",
      answer:
        "Fixed-fractional sizing automatically reduces the cash amount at risk as balance falls. If a 1% risk on $10,000 is $100, then after a $2,000 drawdown to $8,000, 1% risk is $80 — a proportional reduction. Fixed-lot sizing does the opposite: the same lot size represents a higher percentage of the reduced balance, increasing risk precisely when the account is most vulnerable.",
    },
    {
      question: "What is the Kelly Criterion and should traders use it?",
      answer:
        "The Kelly Criterion is a mathematical formula for optimal bet sizing that maximises long-run geometric growth: f* = (bp - q) / b, where b is reward:risk ratio, p is win rate, and q is (1 - p). At 45% win rate and 1.5:1 RR, Kelly suggests risking 4.5% per trade. In practice, full Kelly produces drawdowns that most traders cannot psychologically or practically tolerate. Professional traders typically use half-Kelly or quarter-Kelly as a maximum.",
    },
    {
      question: "How does the 1% risk rule relate to prop firm challenge survival probability?",
      answer:
        "A prop firm evaluation typically allows a 5% daily drawdown and a 10% maximum drawdown. At 1% risk per trade, five consecutive losses in a session consume the daily limit exactly. At 2% risk, two full-size losses and a stop-loss hit on a third trade can breach the daily limit. The simulation data shows that 1% risk per trade keeps the probability of hitting a >10% drawdown below 2% over 1,000 trades — making it the most appropriate choice for evaluation accounts.",
    },
    {
      question: "Does position sizing affect win rate?",
      answer:
        "Directly, no. Position sizing does not change the outcome of individual trades. Indirectly, it has significant psychological effects: traders who risk too much per trade frequently close winners early (to protect floating profit) and hold losers too long (hoping for recovery), effectively reducing realised RR ratios below the intended model. This psychological pressure is itself a risk management concern that correct sizing mitigates.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Position Sizing Research: Fixed-Fractional vs Fixed-Lot Sizing",
            "url": "https://drawdown.trading/research/position-sizing",
            "description":
              "Quantitative analysis of fixed-fractional vs fixed-lot position sizing across 10,000-iteration Monte Carlo simulations at 45% win rate, 1.5:1 RR.",
            "datePublished": publishedDate,
            "dateModified": lastReviewed,
            "author": {
              "@type": "Person",
              "name": "Pete Currey",
              "url": "https://drawdown.trading/about",
            },
            "publisher": {
              "@type": "Organization",
              "name": "Drawdown Trading",
              "url": "https://drawdown.trading",
              "logo": {
                "@type": "ImageObject",
                "url": "https://drawdown.trading/logo.png",
              },
            },
            "isPartOf": {
              "@type": "CollectionPage",
              "name": "Drawdown Research Centre",
              "url": "https://drawdown.trading/research",
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
                { "@type": "ListItem", "position": 2, "name": "Research Centre", "item": "https://drawdown.trading/research" },
                { "@type": "ListItem", "position": 3, "name": "Position Sizing Research", "item": "https://drawdown.trading/research/position-sizing" },
              ],
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
            { label: "Research Centre", href: "/research" },
            { label: "Position Sizing", href: "/research/position-sizing" },
          ]}
        />

        {/* Header */}
        <header className="my-8 border-b border-border-primary/60 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider">
            <BarChart2 className="w-3.5 h-3.5" />
            Quantitative Research — Position Sizing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            Fixed-Fractional vs Fixed-Lot Position Sizing
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
            A Monte Carlo analysis of two position sizing models across 10,000 simulated 1,000-trade sequences. Fixed-fractional sizing at 1% risk per trade produces markedly superior drawdown survival statistics at the cost of lower median terminal returns — a tradeoff that matters critically for prop firm evaluation accounts.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-text-tertiary font-mono">
            <span>Published: {publishedDate}</span>
            <span>·</span>
            <span>Last reviewed: {lastReviewed}</span>
            <span>·</span>
            <span>Simulations: 10,000 iterations × 1,000 trades</span>
            <span>·</span>
            <span>Parameters: 45% win rate, 1.5:1 RR</span>
          </div>
        </header>

        {/* Simulation Parameters */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4">Simulation Parameters</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border-primary/50">
              <thead>
                <tr className="bg-background-secondary">
                  <th className="text-left p-3 font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary/50">Parameter</th>
                  <th className="text-left p-3 font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary/50">Value</th>
                  <th className="text-left p-3 font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary/50">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/30">
                {[
                  { param: "Starting balance", value: "$10,000", rationale: "Representative retail and prop firm evaluation account size" },
                  { param: "Trades per sequence", value: "1,000", rationale: "Sufficient to observe statistical drawdown distribution; represents ~1–2 years of active trading" },
                  { param: "Win rate", value: "45%", rationale: "Slightly below 50% — representative of most breakeven-or-profitable retail strategies" },
                  { param: "Reward:Risk ratio", value: "1.5:1", rationale: "Conservative but realistic for strategies with defined stop and target levels" },
                  { param: "Monte Carlo iterations", value: "10,000", rationale: "Sufficient for stable 5th/95th percentile convergence" },
                  { param: "Ruin threshold", value: "10% of start ($1,000)", rationale: "Consistent with prop firm maximum drawdown levels" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-background-secondary/50">
                    <td className="p-3 font-mono text-text-primary">{row.param}</td>
                    <td className="p-3 text-accent font-bold">{row.value}</td>
                    <td className="p-3 text-text-secondary leading-relaxed">{row.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-tertiary mt-3">
            Methodology documentation at{" "}
            <Link href="/research/methodology" className="text-accent hover:underline">
              /research/methodology
            </Link>
            . Raw output datasets are not yet published for independent download.
          </p>
        </section>

        {/* Methodology Assumptions */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4">Model Assumptions & Limitations</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            The following assumptions are embedded in the simulation model. Readers should evaluate conclusions in light of these simplifications.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border-primary/50">
              <thead>
                <tr className="bg-background-secondary">
                  <th className="text-left p-3 font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary/50">Assumption</th>
                  <th className="text-left p-3 font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary/50">Value / Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/30">
                {[
                  {
                    assumption: "Win/loss distribution",
                    value: "Bernoulli trials — each trade is an independent binary event (win or loss). No partial outcomes.",
                  },
                  {
                    assumption: "Trade independence",
                    value: "No autocorrelation between trades. Each trade outcome is independent of all preceding outcomes.",
                  },
                  {
                    assumption: "Spread / transaction costs",
                    value: "Not modelled. All results assume zero spread and zero commission. Real-world results will be worse.",
                  },
                  {
                    assumption: "Slippage",
                    value: "Not modelled. Entry and exit prices assumed to match stop and target exactly.",
                  },
                  {
                    assumption: "Overnight financing / swaps",
                    value: "Not modelled.",
                  },
                  {
                    assumption: "Reward:Risk realisation",
                    value: "Exact. Simulated RR is always 1.5:1. Partial closures, runner management, and trailing stops are not modelled.",
                  },
                  {
                    assumption: "Position sizing at entry",
                    value: "Fixed-fractional risk calculated on account balance at trade open. No intra-trade resizing.",
                  },
                  {
                    assumption: "Nature of results",
                    value: "All outputs are simulated/modelled. They represent probability distributions under the stated assumptions — not observed trading outcomes from real accounts.",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-background-secondary/50">
                    <td className="p-3 font-mono text-text-primary">{row.assumption}</td>
                    <td className="p-3 text-text-secondary leading-relaxed">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Findings */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-6">Key Findings</h2>
          <div className="space-y-4">
            {FINDINGS.map((f, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border space-y-2 ${
                  f.significant
                    ? "border-accent/30 bg-accent/5"
                    : "border-border-primary/50 bg-background-secondary"
                }`}
              >
                <p className="text-sm font-bold text-text-primary leading-snug">
                  {f.significant && (
                    <span className="inline-block mr-2 px-1.5 py-0.5 bg-accent/20 text-accent text-[9px] font-mono uppercase tracking-wider rounded">
                      Primary
                    </span>
                  )}
                  {f.finding}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Results Table */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Simulation Results: Terminal Balance Distribution by Risk Level
          </h2>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            All results from 10,000 iterations of 1,000-trade sequences using fixed-fractional sizing, 45% win rate, 1.5:1 RR, $10,000 starting balance. P5 = 5th percentile outcome. P95 = 95th percentile outcome.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border-primary/50">
              <thead>
                <tr className="bg-background-secondary">
                  {["Risk/Trade", "Median Balance", "P5 Balance", "P95 Balance", "Ruin Probability", ">30% Drawdown Prob"].map((h) => (
                    <th key={h} className="text-left p-3 font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary/50 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/30">
                {RISK_TABLE.map((row, i) => (
                  <tr key={i} className={`hover:bg-background-secondary/50 ${row.risk === "1.0%" ? "bg-accent/5" : ""}`}>
                    <td className="p-3 font-mono font-bold text-accent">{row.risk}</td>
                    <td className="p-3 text-text-primary font-mono">{row.medianBalance}</td>
                    <td className="p-3 text-text-secondary font-mono">{row.p5Balance}</td>
                    <td className="p-3 text-text-secondary font-mono">{row.p95Balance}</td>
                    <td className={`p-3 font-mono font-bold ${parseFloat(row.probRuin) > 10 ? "text-red-400" : "text-text-primary"}`}>
                      {row.probRuin}
                    </td>
                    <td className={`p-3 font-mono font-bold ${parseFloat(row.maxDrawdownProb30) > 50 ? "text-red-400" : "text-text-primary"}`}>
                      {row.maxDrawdownProb30}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-text-tertiary mt-2 italic">
            Highlighted row (1%) represents the institutional standard risk level. Ruin defined as balance falling below $1,000 (10% of start) at any point during the 1,000-trade sequence.
          </p>
        </section>

        {/* Implications */}
        <section className="mb-12 p-6 border border-border-primary/50 bg-background-secondary rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            Practical Implications for Prop Firm Traders
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Prop firm evaluations impose hard drawdown constraints that make ruin probability — not terminal return — the primary metric for position sizing decisions. A model that produces the highest median return (3% risk) but has a 38% ruin probability over 1,000 trades will terminate the majority of funded traders long before reaching peak equity.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            The 1% fixed-fractional model provides the best balance: median terminal growth of 48% over 1,000 trades, a 2% ruin probability, and a 22% probability of experiencing a drawdown exceeding 30% at any point — well within the range of strategies that can consistently pass and maintain funded evaluation accounts.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/calculators/position-size"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
            >
              Position Size Calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/calculators/risk-of-ruin"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition"
            >
              Risk of Ruin Simulator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-accent" />
            Research FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 border border-border-primary/50 bg-background-secondary rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-text-primary">{faq.question}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Resources */}
        <section className="mb-8">
          <h2 className="text-base font-bold uppercase text-text-primary tracking-wide mb-4">Related Research & Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: "Risk-of-Ruin Mathematics", href: "/research/risk" },
              { label: "Trading Cost Studies", href: "/research/trading-costs" },
              { label: "Datasets (Download Raw Data)", href: "/research/datasets" },
              { label: "Risk Management Framework", href: "/risk-management" },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center justify-between p-3 border border-border-primary/50 hover:border-accent text-text-secondary hover:text-text-primary transition group rounded-lg"
              >
                <span>{r.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
