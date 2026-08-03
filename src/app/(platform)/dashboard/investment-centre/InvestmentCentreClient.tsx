"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Lock, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Terminal as TerminalIcon, 
  Layers, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  X,
  Server,
  Globe,
  Database,
  BarChart3,
  Flame,
  Scale
} from "lucide-react";

export default function InvestmentCentreClient() {
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const checkoutUrl = "https://investmentcentre.drawdown.trading";

  const handleAction = (e: React.MouseEvent) => {
    // Navigate directly to the external checkout / portal URL as requested by user
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 font-mono select-none overflow-x-hidden relative pb-16">
      {/* ── Top Paywall Enforced Banner ── */}
      <div className="w-full bg-[#0E1524] border-b border-[#C8F135]/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8F135] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8F135]"></span>
          </span>
          <span className="text-[#C8F135] font-bold tracking-wider uppercase text-[11px]">
            [PAYMENT GATEWAY ACTIVE]
          </span>
          <span className="text-slate-300 text-[11px] hidden sm:inline">
            The Investment Centre requires a Meridian Terminal add-on subscription.
          </span>
          <span className="bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/40 px-2 py-0.5 text-[10px] font-bold rounded">
            £99 / MONTH
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setShowPaywallModal(true)}
            className="text-slate-400 hover:text-white text-[11px] underline underline-offset-4 transition-colors hidden md:inline-block"
          >
            View Details
          </button>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C8F135] text-black font-bold px-3.5 py-1 text-[11px] uppercase tracking-wider hover:bg-[#b5db2e] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,241,53,0.3)]"
          >
            <Lock className="w-3 h-3" />
            Unlock Access (£99/mo)
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── Terminal Header Bar ── */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#080A10]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#C8F135] font-bold tracking-widest text-sm sm:text-base">
              MERIDIAN // TERMINAL
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[#C8F135] text-xs sm:text-xs tracking-wider opacity-90">
              AUTONOMOUS MACRO & RISK ENGINE v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-mono tracking-wider">
          <a href="#coverage" className="hover:text-[#C8F135] transition-colors hidden md:inline">
            THE BRIEF
          </a>
          <a href="#pipeline" className="hover:text-[#C8F135] transition-colors">
            TRADE DESK
          </a>
          <a href="#pipeline" className="hover:text-[#C8F135] transition-colors hidden sm:inline">
            ARCHITECTURE
          </a>
          <a href="#coverage" className="hover:text-[#C8F135] transition-colors hidden md:inline">
            AUTOMATION
          </a>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C8F135] text-black font-bold px-4 py-1.5 text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(200,241,53,0.25)]"
          >
            LOG IN TO CONSOLE →
          </a>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-block">
            <span className="text-[#C8F135] text-xs font-mono tracking-widest uppercase">
              [INSTITUTIONAL INTELLIGENCE & DETERMINISTIC RISK ROUTING]
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none font-sans">
            Cross-Asset Macro Synthesis &amp; Falsification-Gated Execution
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
            Meridian continuously ingests macro feeds, central bank signals, SEC filings, and alternative dataset joins. Every market delta is evaluated against active investment theses, ranked by explicit salience scoring, and gated through cryptographic HMAC risk tokens before broker execution.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C8F135] text-black font-extrabold px-6 py-3 text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(200,241,53,0.3)]"
            >
              LOG IN &amp; LAUNCH CONSOLE
            </a>
            <button
              onClick={() => setShowPaywallModal(true)}
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-6 py-3 text-xs uppercase tracking-wider font-bold transition-all bg-slate-950/40"
            >
              SYSTEM SPECIFICATION
            </button>
          </div>
        </div>
      </section>

      {/* ── 4 Key Ingestion Metrics Strip ── */}
      <section className="border-y border-slate-800/80 bg-[#0A0D16]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          <div className="p-6 space-y-1.5">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              INGESTION FEEDS
            </p>
            <h3 className="text-lg font-bold text-white tracking-wide">
              18 REAL-TIME
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              FRED, EIA, SEC, FCA, TwelveData
            </p>
          </div>

          <div className="p-6 space-y-1.5">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              DELTAS EVALUATED (24H)
            </p>
            <h3 className="text-lg font-bold text-white tracking-wide">
              1,420 METRICS
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Deterministic Salience Pipeline
            </p>
          </div>

          <div className="p-6 space-y-1.5">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              COUNCIL SYNTHESIS
            </p>
            <h3 className="text-lg font-bold text-white tracking-wide">
              3 AI MODELS
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Claude 3.5, GPT-4o, Grok-2
            </p>
          </div>

          <div className="p-6 space-y-1.5">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              BROKER ADAPTER
            </p>
            <h3 className="text-lg font-bold text-white tracking-wide">
              OANDA v20 ACTIVE
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              HMAC RiskToken Protected
            </p>
          </div>
        </div>
      </section>

      {/* ── System Pipeline & 4-Tier Escalation Model ── */}
      <section id="pipeline" className="max-w-7xl mx-auto px-6 py-14 space-y-8">
        <div>
          <p className="text-[11px] text-[#C8F135] font-mono uppercase tracking-widest mb-1">
            SYSTEM PIPELINE &amp; 4-TIER ESCALATION MODEL
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            End-to-End Autonomous Intelligence Flow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Tier 1 */}
          <div className="bg-[#0B0F1A] border border-slate-800/90 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <span className="text-[11px] text-[#4A9EFF] font-mono font-bold tracking-wider block">
                TIER 1 — WATCH
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                Continuous Observation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Monitors raw data streams across macroeconomic releases, Treasury fiscal reports, EIA inventory stock draws, and disclosed UK FCA net short positions.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>STATUS: ENFORCED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A9EFF]"></span>
            </div>
          </div>

          {/* Card Tier 2 */}
          <div className="bg-[#0B0F1A] border border-slate-800/90 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <span className="text-[11px] text-[#A78BFA] font-mono font-bold tracking-wider block">
                TIER 2 — RESEARCH
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                Council Deep Synthesis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Multi-LLM consensus (Claude, GPT-4o, Grok) cross-references anomalies against historical cycles, SEC Form 4 insider trades, and government contract awards.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>STATUS: ENFORCED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]"></span>
            </div>
          </div>

          {/* Card Tier 3 */}
          <div className="bg-[#0B0F1A] border border-slate-800/90 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <span className="text-[11px] text-[#FBBF24] font-mono font-bold tracking-wider block">
                TIER 3 — PREPARE
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                Thesis Falsification Check
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Drafts explicit OrderIntent parameters. Validates stop loss targets and verifies that mandatory falsification criteria are intact before staging.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>STATUS: ENFORCED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]"></span>
            </div>
          </div>

          {/* Card Tier 4 */}
          <div className="bg-[#0B0F1A] border border-slate-800/90 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <span className="text-[11px] text-[#00C896] font-mono font-bold tracking-wider block">
                TIER 4 — EXECUTE
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                RiskGate &amp; Broker Route
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Generates cryptographically signed ApprovalToken. Passes security checks and routes execution payload to Oanda v20 REST endpoints.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>STATUS: ENFORCED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C896]"></span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intelligence Coverage: The 8 Pillars Section (Screenshot 2) ── */}
      <section id="coverage" className="bg-[#04060A] border-t border-slate-800/80 py-14">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div>
            <p className="text-[11px] text-[#C8F135] font-mono uppercase tracking-widest mb-1">
              INTELLIGENCE COVERAGE
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              The 8 Pillars of Cross-Asset Context
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pillar I */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR I
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  THE WORLD
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Global macro indicators, FRED fed funds rate, US public debt, EIA crude oil inventories.
                </p>
              </div>
            </div>

            {/* Pillar II */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR II
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  THE MARKETS
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Real-time multi-asset spot breadth (GBP/USD, EUR/USD, WTI), CFTC COT, FCA UK net short registers.
                </p>
              </div>
            </div>

            {/* Pillar III */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR III
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  THE HORIZON
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Forward event calendar linking SEC EDGAR S-1 IPO filings, central bank rate decisions, prediction odds.
                </p>
              </div>
            </div>

            {/* Pillar IV */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR IV
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  THE UNDERCURRENT
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Alternative data inputs: Congressional stock trading cross-referenced with USAspending federal contract awards.
                </p>
              </div>
            </div>

            {/* Pillar V */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR V
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  ALTERNATIVES
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Kalshi, Polymarket, and Manifold event contract probabilities and alternative asset valuation curves.
                </p>
              </div>
            </div>

            {/* Pillar VI */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR VI
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  ACTIVE THESES
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Investment conviction &amp; mandatory falsification engine. Every position possesses explicit invalidation rules.
                </p>
              </div>
            </div>

            {/* Pillar VII */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR VII
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  AI COUNCIL
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Tri-model synthesis engine producing structured macro consensus reports and scenario probability distributions.
                </p>
              </div>
            </div>

            {/* Pillar VIII */}
            <div className="bg-[#080C16] border border-slate-800/90 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
              <span className="text-[#C8F135] font-mono text-xs font-bold shrink-0 mt-0.5">
                PILLAR VIII
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  AUTOMATION &amp; RISK
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Deterministic 4-tier escalation model, RiskGate HMAC token signing, and Oanda broker execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Page Footer ── */}
      <footer className="border-t border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div>
          MERIDIAN INVESTMENT CENTRE // PRIVATELY DEPLOYED SYSTEM
        </div>

        <div className="flex items-center gap-6">
          <a href="#coverage" className="hover:text-slate-300 transition-colors">THE BRIEF</a>
          <a href="#pipeline" className="text-[#C8F135] font-bold hover:underline">TRADE DESK</a>
          <a href="#coverage" className="hover:text-slate-300 transition-colors">AUTOMATION</a>
          <a href="#pipeline" className="hover:text-slate-300 transition-colors">SPECIFICATION</a>
        </div>
      </footer>

      {/* ── Payment Gate Modal ── */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0E17] border border-[#C8F135]/40 rounded-xl p-6 sm:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(200,241,53,0.15)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#C8F135]/10 border border-[#C8F135]/30 text-[#C8F135] text-[10px] font-mono font-bold uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                [RESERVED INSTITUTIONAL ACCESS]
              </div>
              <h3 className="text-2xl font-extrabold text-white font-sans tracking-tight">
                Unlock The Investment Centre
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Autonomous cross-asset macro synthesis, tri-model AI council, and falsification-gated execution.
              </p>
            </div>

            <div className="bg-[#070A11] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-mono">Subscription Price</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#C8F135] font-mono">£99</span>
                  <span className="text-xs text-slate-400 font-mono"> / month</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-2 text-xs text-slate-300 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>18 Real-Time Macro &amp; Alternative Ingestion Feeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>1,420 Metrics Evaluated 24/7 (Salience Pipeline)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>Tri-Model AI Council (Claude 3.5 + GPT-4o + Grok-2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>HMAC RiskToken Signed Execution Router</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#C8F135] text-black font-extrabold py-3 text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,241,53,0.3)] rounded"
              >
                Unlock Access (£99/mo)
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setShowPaywallModal(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-white py-2 font-mono"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
