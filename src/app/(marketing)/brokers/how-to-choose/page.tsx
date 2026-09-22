import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  Zap,
  HelpCircle,
  BookOpen,
  Scale,
  Globe,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "How to Choose a Forex Broker 2026 | Spreads, Regulation & Costs",
  description:
    "A practical guide to selecting a forex or CFD broker: what regulation actually protects you, how to compare real trading costs, and which platform features matter for your strategy.",
  path: "/brokers/how-to-choose",
});

const CRITERIA = [
  {
    criterion: "1. Verify Regulation — And Understand What It Means",
    icon: ShieldCheck,
    body: "FCA (UK), ASIC (Australia), CySEC (EU), and NFA (USA) are tier-1 regulators that impose meaningful protections: segregated client funds, negative balance protection, financial ombudsman access, and compensation schemes (FSCS in the UK up to £85,000). Offshore regulators (Vanuatu, St Vincent, Seychelles) impose no meaningful protections and no compensation. Trading with an unregulated broker is an unsecured loan, not a trading account.",
  },
  {
    criterion: "2. Calculate Real Trading Costs — Not Just Headline Spreads",
    icon: DollarSign,
    body: "Brokers advertise 'from 0.0 pips' while charging commissions that can exceed the spread equivalent. Real cost = Spread + (Commission × 2) + Overnight Swap (if holding overnight). For a 1-standard-lot EUR/USD trade: at 0.0 pip spread + $3.50 commission each side = $7 total round-trip cost. At 0.8 pip spread with no commission = $8 round-trip. The commission account is marginally cheaper for day traders and significantly cheaper for high-frequency scalpers.",
  },
  {
    criterion: "3. Test Execution Quality During News Events",
    icon: Zap,
    body: "A broker's execution quality during normal markets is irrelevant. What matters is slippage, requotes, and spread widening during high-impact news events (NFP, CPI, FOMC). The best brokers maintain spreads within 2–3× normal widths during news. The worst widen by 10–20× and add slippage, turning every news release into a guaranteed loss. Check third-party broker latency benchmarks rather than broker-provided statistics.",
  },
  {
    criterion: "4. Confirm Your Instruments and Account Currency",
    icon: Globe,
    body: "Not all brokers offer all instruments. Before opening an account, verify the broker offers: the specific pairs you trade (not all brokers offer exotic pairs), gold and commodity contracts at the contract size you need, and that your preferred account currency is available. A GBP account at a USD-denominated broker adds unnecessary FX conversion costs on every deposit, withdrawal, and unrealised P&L statement.",
  },
  {
    criterion: "5. Evaluate Platform Compatibility With Your Strategy",
    icon: BookOpen,
    body: "MT4 and MT5 are the standard for algorithmic and EA-based trading. cTrader offers superior DOM depth-of-market for scalpers. TradingView integration is essential for traders whose analysis and execution are both conducted in TradingView's charting environment. Most serious traders use their analysis platform separately from their execution platform — do not choose a broker based on the quality of their built-in charts.",
  },
  {
    criterion: "6. Verify Withdrawal Processes and Timelines Before Depositing",
    icon: CheckCircle2,
    body: "A broker's deposit process is always fast. Their withdrawal process reveals their true operational standards. Before depositing significant capital: check independent forums (Reddit, ForexPeaceArmy, TrustPilot) for withdrawal complaints, verify the broker's processing time SLA in their terms, and confirm your withdrawal method is accepted without additional fees. Every major fraud in retail trading begins with a withdrawal refusal.",
  },
];

const RED_FLAGS = [
  {
    flag: "Guaranteed profits or 'managed accounts'",
    detail: "No legitimate broker offers guaranteed returns. Any broker marketing guaranteed profits is operating a scheme, not a brokerage.",
  },
  {
    flag: "Pressure to deposit more after losses",
    detail: "Legitimate brokers do not contact you about your account balance or encourage additional deposits following losses. This is a classic boiler room tactic.",
  },
  {
    flag: "Unusually wide spreads on major pairs",
    detail: "EUR/USD spreads above 2 pips on a 'standard' account are uncompetitive. Above 3 pips indicates predatory pricing. Compare against tier-1 FCA brokers before depositing.",
  },
  {
    flag: "Offshore regulation only",
    detail: "If a broker is regulated only by Vanuatu FSC, SVGFSA, or similar offshore jurisdictions, there is no meaningful client protection. UK-resident traders have no legal recourse against offshore-only regulated brokers.",
  },
  {
    flag: "No physical address or verifiable company registration",
    detail: "Legitimate brokers are registered companies with publicly verifiable company numbers in their regulatory jurisdiction. If you cannot find their company registration, do not deposit.",
  },
];

export default function HowToChooseBrokerPage() {
  const faqs = [
    {
      question: "Is an FCA-regulated broker always safe?",
      answer:
        "FCA regulation provides strong protections — segregated client funds, negative balance protection, and FSCS compensation up to £85,000 per person. However, FCA regulation does not guarantee the broker cannot fail. Segregated funds should protect your capital in the event of insolvency, but you must verify the broker holds client funds in segregated accounts and not in pooled omnibus accounts.",
    },
    {
      question: "Should I use a raw spread account with commission or a standard spread account?",
      answer:
        "For day traders executing more than 10 round-trip trades per day, raw spread + commission is almost always cheaper. For swing traders holding positions for days or weeks, the spread difference is minimal relative to overnight swap costs, and the simpler standard spread account removes the need to track per-trade commission in P&L calculations.",
    },
    {
      question: "Do broker spreads affect prop firm challenge performance?",
      answer:
        "Yes, significantly. If you are practising for a prop firm evaluation on a broker with 1.5 pip EUR/USD spreads, but the prop firm's evaluation account uses 0.8 pip spreads, your live P&L will differ materially from your practice performance. Always use a broker with similar spread conditions to your target prop firm during preparation.",
    },
    {
      question: "How do I verify a broker's FCA regulation?",
      answer:
        "Visit the FCA Financial Services Register at register.fca.org.uk and search for the firm's name or its FCA reference number (FRN). Verify that the firm's name, address, and authorised activities match what the broker claims on their website. Some firms clone regulated firms' details — always verify directly at fca.org.uk, not via links on the broker's website.",
    },
    {
      question: "What is negative balance protection and why does it matter?",
      answer:
        "Negative balance protection means your account cannot fall below zero even during extreme market gaps. Without it, a broker can pursue you legally for losses beyond your deposited capital. Under FCA rules, retail clients are entitled to negative balance protection. Professional clients are typically not — this is a meaningful risk if you have upgraded to a professional account for higher leverage.",
    },
    {
      question: "Can I use the same broker for both personal trading and prop firm challenge preparation?",
      answer:
        "Yes, and this is recommended. Your personal broker account can serve as a practice environment for developing your risk framework before paying for an evaluation. Use it with the same lot sizing rules, risk per trade, and daily loss limits you plan to apply in the funded account. The discipline carries over more effectively than demo account preparation.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Choose a Forex Broker",
            "url": "https://drawdown.trading/brokers/how-to-choose",
            "description": "A practical guide to selecting a regulated forex or CFD broker based on real trading costs, execution quality, and account protection.",
            "step": CRITERIA.map((c, i) => ({
              "@type": "HowToStep",
              "position": i + 1,
              "name": c.criterion,
              "text": c.body,
            })),
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
            { label: "Brokers", href: "/brokers" },
            { label: "How to Choose a Broker", href: "/brokers/how-to-choose" },
          ]}
        />

        {/* Hero */}
        <header className="mb-16 max-w-3xl space-y-5">
          <div className="flex items-center gap-3 text-accent">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Broker Selection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            How to Choose a <span className="text-accent italic">Forex Broker.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Most traders choose a broker based on which one is most heavily advertised. This guide covers the six criteria that actually affect your trading performance and capital safety: regulation, real cost calculation, execution quality, instrument availability, platform compatibility, and withdrawal reliability.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/brokers/all"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
            >
              Browse All Reviewed Brokers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/calculators/pip-value"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition"
            >
              Compare Trading Costs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* 6 Criteria */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-10">
            <Scale className="w-5 h-5 text-accent flex-shrink-0" />
            Six Criteria That Actually Matter
          </h2>
          <div className="space-y-6">
            {CRITERIA.map(({ criterion, icon: Icon, body }, i) => (
              <div key={i} className="flex gap-5 p-6 border border-border-slate/40 bg-background-surface/30">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary">{criterion}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Red Flags */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            Five Broker Red Flags
          </h2>
          <div className="space-y-4">
            {RED_FLAGS.map((f, i) => (
              <div key={i} className="p-5 border border-red-400/20 bg-red-400/5 space-y-2">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide">{f.flag}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trading Cost Calculator CTA */}
        <section className="mb-20">
          <h2 className="text-xl font-bold uppercase text-text-primary mb-6">Calculate Your Real Trading Costs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Pip Value Calculator",
                desc: "Calculate the monetary value of a pip in your account currency for any pair and lot size — the foundation of any cost comparison.",
                href: "/calculators/pip-value",
              },
              {
                label: "Position Size Calculator",
                desc: "Verify that your planned lot sizes produce the correct cash risk per trade before factoring in trading costs.",
                href: "/calculators/position-size",
              },
              {
                label: "Risk Calculator",
                desc: "Calculate the total cash risk including the trading cost burden on your stop-loss range.",
                href: "/calculators/risk",
              },
              {
                label: "Risk Management Framework",
                desc: "The full risk management guide — position sizing, drawdown control, and prop firm rule compliance.",
                href: "/risk-management",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-5 border border-border-slate/40 bg-background-surface/30 hover:border-accent group transition-colors space-y-2"
              >
                <p className="text-xs font-bold text-text-primary group-hover:text-accent uppercase tracking-wide transition-colors">
                  {t.label}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">{t.desc}</p>
                <div className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors pt-1">
                  Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Platform CTA */}
        <section className="mb-20 p-8 border border-accent/30 bg-accent/5 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">Works with your broker</p>
            <h3 className="text-sm font-bold uppercase tracking-tight text-text-primary">
              Connect Any FCA-Regulated Broker to the Drawdown Platform
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
              The Drawdown platform connects to MT4, MT5, and cTrader accounts to provide live risk management, position sizing calculations, and real-time drawdown monitoring regardless of which regulated broker you choose.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
          >
            View Plans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* Broker Directory Links */}
        <section className="mb-20">
          <h2 className="text-xl font-bold uppercase text-text-primary mb-6">Individually Reviewed Brokers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: "IG Markets", slug: "ig" },
              { name: "Pepperstone", slug: "pepperstone" },
              { name: "IC Markets", slug: "ic-markets" },
              { name: "Interactive Brokers", slug: "ibkr" },
              { name: "Trading 212", slug: "trading-212" },
              { name: "OANDA", slug: "oanda" },
            ].map((b) => (
              <Link
                key={b.slug}
                href={`/brokers/${b.slug}`}
                className="flex items-center justify-between p-3 border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>{b.name} Review 2026 — Spreads, Fees & Regulation</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/brokers/all"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition border-b border-transparent hover:border-accent pb-0.5"
            >
              View All 20+ Reviewed Brokers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-8">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-accent flex-shrink-0" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-2">
                <h3 className="text-sm font-bold text-text-primary">{faq.question}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
