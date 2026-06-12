"use client";

import { Shield, CheckCircle2, ArrowRight, Star, AlertTriangle } from "lucide-react";
import Link from "next/link";

const goldBrokers = [
  {
    rank: 1,
    id: "pepperstone",
    name: "Pepperstone",
    logoFallback: "PS",
    color: "#0032FF",
    verdict: "Best Overall for Gold Trading",
    spread: "0.0 pips (Raw)",
    commission: "$3.50/lot",
    platforms: "MT4, MT5, cTrader, TradingView",
    regulation: "FCA, ASIC",
    pros: ["Tightest raw spread on XAU/USD", "Sub-30ms execution", "TradingView native integration"],
    cons: ["Commission on Raw accounts"],
    score: 9.4,
    link: "/go/pepperstone"
  },
  {
    rank: 2,
    id: "ic-markets",
    name: "IC Markets",
    logoFallback: "IC",
    color: "#2C2F36",
    verdict: "Best for High Volume Gold Traders",
    spread: "0.0 pips (Raw)",
    commission: "$3.00/lot",
    platforms: "MT4, MT5, cTrader",
    regulation: "ASIC, CySEC",
    pros: ["Lowest commission per lot", "Deep liquidity during NY session", "Scalping permitted"],
    cons: ["No TradingView direct integration", "Weaker UK regulation"],
    score: 9.1,
    link: "/go/ic-markets"
  },
  {
    rank: 3,
    id: "ig-markets",
    name: "IG Markets",
    logoUrl: "/logos/brokers/ig-markets.svg",
    logoFallback: "IG",
    color: "#E11A27",
    verdict: "Best for UK Spread Betting on Gold",
    spread: "From 0.3 pips",
    commission: "£0 (Spread Betting)",
    platforms: "ProRealTime, MT4, IG Platform",
    regulation: "FCA",
    pros: ["Tax-free for UK traders (spread bet)", "Strongest UK regulation", "Gold CFD and spread bet"],
    cons: ["Wider spread than raw brokers", "Less suitable for scalpers"],
    score: 8.8,
    link: "/go/ig-markets"
  }
];

export default function BestBrokerForGoldPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-text-tertiary text-[10px] font-mono uppercase tracking-widest">
              <Link href="/brokers" className="hover:text-text-primary transition-colors">Brokers</Link>
              <span>/</span>
              <span className="text-accent">Best for Gold Trading</span>
            </div>

            <div className="flex items-center gap-3 text-accent">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">REAL CAPITAL TESTED</span>
            </div>
            
            <h1 className="  font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              Best Brokers for <br />
              <span className="text-text-primary">Gold Trading</span> <br />
              <span className="text-text-secondary text-3xl md:text-4xl">(XAU/USD) 2026</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl font-medium">
              When volatility spikes on NFP Friday, your spread shouldn't. We tested 20+ regulated brokers using real capital to find the tightest institutional pricing and fastest execution for XAU/USD.
            </p>

            {/* Quick Summary Box */}
            <div className="bg-background-surface border border-accent/30 p-6 max-w-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-3">// QUICK VERDICT</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="text-text-primary font-bold">Best overall:</span> Pepperstone (Raw spreads from 0.0 pips, FCA regulated).<br />
                <span className="text-text-primary font-bold">Best for UK traders:</span> IG Markets (Tax-free spread betting on XAU/USD).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology / Trust */}
      <section className="py-8 bg-background-surface border-b border-border-slate">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6">
              {["Real Capital Testing", "Spread Verified During NFP", "Withdrawal Tested"].map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                  <CheckCircle2 className="w-3 h-3 text-profit" /> {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary">
              <AlertTriangle className="w-3 h-3 text-warning" />
              Last updated: April 2026
            </div>
          </div>
        </div>
      </section>

      {/* Brokers List */}
      <section className="py-16 bg-background-primary">
        <div className="container mx-auto px-6 max-w-5xl space-y-8">
          {goldBrokers.map((broker) => (
            <div key={broker.id} className="bg-background-surface border border-border-slate hover:border-accent/30 transition-all relative overflow-hidden">

              {broker.rank === 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
              )}

              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

                  {/* Left: Name, verdict, score */}
                  <div className="w-full lg:w-1/4 shrink-0">
                    <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-3">
                      #{broker.rank} Pick
                    </div>
                    {broker.logoUrl ? (
                      <div className="h-12 bg-white px-3 py-2 flex items-center mb-4 w-fit">
                        <img src={broker.logoUrl} alt={broker.name} className="h-full object-contain max-w-[100px]" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center font-display font-black text-text-primary text-2xl mb-4" style={{ backgroundColor: broker.color }}>
                        {broker.logoFallback}
                      </div>
                    )}
                    <h3 className="text-2xl font-display font-bold uppercase text-text-primary mb-2">{broker.name}</h3>
                    <p className="text-xs text-accent font-bold uppercase tracking-wider mb-4">{broker.verdict}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(broker.score / 2) ? "text-warning fill-warning" : "text-border-slate"}`} />
                      ))}
                      <span className="text-sm font-bold text-text-primary ml-2">{broker.score}/10</span>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex-grow grid grid-cols-2 gap-y-5 gap-x-8">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">XAU/USD Spread</p>
                      <p className="text-sm font-bold text-text-primary">{broker.spread}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Commission</p>
                      <p className="text-sm font-bold text-text-primary">{broker.commission}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Platforms</p>
                      <p className="text-sm font-bold text-text-primary">{broker.platforms}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Regulation</p>
                      <p className="text-sm font-bold text-profit">{broker.regulation}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Pros</p>
                      <ul className="space-y-1">
                        {broker.pros.map((p, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                            <CheckCircle2 className="w-3 h-3 text-profit shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="w-full lg:w-48 shrink-0 flex flex-col gap-3 justify-center">
                    <a href={broker.link} target="_blank" rel="nofollow" className="w-full py-4 bg-accent text-[#08090D] text-center text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                      Open Account
                    </a>
                    <Link href={`/brokers/${broker.id}-review`} className="w-full py-4 border border-border-slate text-text-secondary text-center text-xs font-bold uppercase tracking-widest hover:border-text-primary hover:text-text-primary transition-colors">
                      Full Review
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What to Look For (Educational) */}
      <section className="py-16 bg-background-surface border-t border-border-slate">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-display font-bold uppercase mb-8">What to Look For When Trading Gold</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-widest text-accent">Spread Widening</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Gold spreads can spike 5x during NFP, CPI, and FOMC events. A raw spread of 0.0 pips can become 8 pips in milliseconds. Always test your broker's spread behavior during tier-1 news.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-widest text-accent">Overnight Swap Rates</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Swing traders holding gold positions overnight face significant swap costs. Pepperstone and IC Markets typically offer the most competitive swap rates on XAU/USD. Always compare before holding multi-day positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-8 bg-background-primary border-t border-border-slate">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed opacity-60">
            Affiliate Disclosure: Drawdown may earn a commission if you sign up via links on this page. Rankings are determined by our internal scoring methodology — not commission payouts. We only recommend brokers our team has personally tested with live capital.
          </p>
        </div>
      </section>
    </div>
  );
}
