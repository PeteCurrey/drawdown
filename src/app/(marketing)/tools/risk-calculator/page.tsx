"use client";

import { Percent, ShieldAlert, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { RiskCalculator } from "@/components/tools/RiskCalculator";

export default function PublicRiskCalculatorPage() {
  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Risk Calculator", href: "/tools/risk-calculator" }
          ]}
        />

        {/* Hero Header */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Percent className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase leading-tight">
            Risk <span className="text-accent underline decoration-accent/20">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Determine your exact position size, standard lots, contract units, and drawdown thresholds in real-time. Designed for Forex, Gold, Indices, and Crypto markets.
          </p>
        </header>

        {/* Full Working Calculator */}
        <div className="mb-20">
          <RiskCalculator />
        </div>

        {/* Educational/SEO Content Section */}
        <hr className="border-border-slate/30 mb-16" />

        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-text-primary">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">How Position Sizing Works</h2>
            </div>
            <p className="text-sm sm:text-base">
              Position sizing is the single most critical aspect of risk management. It determines how many standard lots or contract units you should trade based on your account size, the percentage of capital you wish to risk, and the distance to your stop loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-background-surface border border-border-slate p-6">
              <h3 className="text-sm font-mono font-bold uppercase text-accent tracking-wider">// THE FORMULA</h3>
              <p className="text-xs">
                To calculate the standard lot size for a trade, the risk engine divides the absolute cash value of your risk by the distance to your stop loss multiplied by the unit value of each pip/point:
              </p>
              <div className="bg-background-primary p-4 border border-border-slate/50 font-mono text-[11px] text-text-primary overflow-x-auto">
                Position Size = (Balance × Risk%) / (SL Distance × Pip Value)
              </div>
            </div>

            <div className="space-y-4 bg-background-surface border border-border-slate p-6">
              <h3 className="text-sm font-mono font-bold uppercase text-accent tracking-wider">// THE 1% RULE</h3>
              <p className="text-xs">
                Professional traders and prop firm participants rarely risk more than 1% to 2% of their total account equity on any single execution. This ensures that even a long streak of 10 consecutive losses only draws down the account by roughly 10%, keeping you well within validation parameters.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold uppercase text-text-primary">Understanding Pip and Point Multipliers</h3>
            <p className="text-xs sm:text-sm">
              Different instruments measure price movement using different units. In Forex, a 1-pip move for 4-decimal pairs (like GBP/USD or EUR/USD) corresponds to 0.0001, whereas for JPY-based pairs it represents 0.01. Gold (XAU/USD) is measured per troy ounce where a 10-cent price change corresponds to 1 pip. Indices (like the FTSE 100 or NASDAQ) use absolute points where each point corresponds to £10, $20, or $50 per contract.
            </p>
          </div>
        </article>

        {/* Signup CTA Block */}
        <div className="mt-20 p-8 sm:p-12 bg-background-surface border border-border-slate relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 border border-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/5 transition-colors duration-1000" />
          
          <div className="max-w-2xl space-y-6">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">// PROFESSIONAL ACCOUNT</span>
            <h3 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary">
              Scale Your Trading with institutional Risk Tools.
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sign up today to save calculations automatically to your Trade Journal database, enable real-time dashboard drawdown alerts, track your psychological patterns, and build a mathematically verified edge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-background-primary font-mono text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-background-primary border border-border-slate hover:border-accent text-text-primary font-mono text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
