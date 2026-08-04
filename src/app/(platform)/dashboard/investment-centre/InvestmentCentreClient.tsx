"use client";

import React, { useState, useEffect } from "react";
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
  Scale,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function InvestmentCentreClient() {
  const [user, setUser] = useState<any>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const supabase = createClient();
  const checkoutUrl = "https://investmentcentre.drawdown.trading";

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_tier")
            .eq("id", user.id)
            .single();
          if ((profile as any)?.subscription_tier) {
            setSubscriptionTier((profile as any).subscription_tier.toLowerCase());
          }
        }
      } catch (e) {
        console.error("Failed to load user info:", e);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUserData();
  }, []);

  const hasActiveAccess = subscriptionTier === "floor" || subscriptionTier === "investment-centre";
  const hasEligibleBaseTier = subscriptionTier && ["foundation", "edge"].includes(subscriptionTier);

  const handleEnterTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loadingUser) return;
    if (hasActiveAccess) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      setShowPaywallModal(true);
    }
  };

  const handleProceedStripeCheckout = async (planType: "addon_only" | "floor" | "foundation") => {
    setCheckoutLoading(true);
    try {
      if (!user) {
        window.location.href = `/login?redirect=/dashboard/investment-centre`;
        return;
      }

      const targetTier = planType === "addon_only" 
        ? "investment-centre" 
        : planType === "floor" 
          ? "floor" 
          : "foundation";

      const response = await fetch("/api/stripe/checkout-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: targetTier,
          billingCycle: "monthly",
          redirectPath: "/dashboard/investment-centre",
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Checkout error: ${data.error}`);
      } else {
        window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 font-sans overflow-x-hidden relative pb-16">
      
      {/* ── Top Paywall Banner (Only shown if user has no active subscription to Investment Centre) ── */}
      {!loadingUser && !hasActiveAccess && (
        <div className="w-full bg-[#0E1524] border-b border-[#C8F135]/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8F135] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8F135]"></span>
              </span>
              <span className="text-[#C8F135] font-mono font-bold tracking-wider uppercase text-[11px]">
                [PAYMENT GATEWAY ACTIVE]
              </span>
              <span className="text-slate-300 text-[11px] hidden sm:inline font-mono">
                The Investment Centre requires a Meridian Terminal add-on subscription.
              </span>
              <span className="bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/40 px-2 py-0.5 text-[10px] font-bold rounded">
                £99 / MONTH
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPaywallModal(true)}
                className="text-slate-400 hover:text-white text-[11px] underline underline-offset-4 transition-colors hidden md:inline-block font-mono"
              >
                View Details
              </button>
              <button
                onClick={() => setShowPaywallModal(true)}
                className="bg-[#C8F135] text-black font-bold px-3.5 py-1 text-[11px] font-mono uppercase tracking-wider hover:bg-[#b5db2e] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,241,53,0.3)] rounded"
              >
                <Lock className="w-3 h-3" />
                Unlock Access (£99/mo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Hero Section (High Aesthetics Dark Theme) ── */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Intro */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block">
              <span className="inline-block border border-[#C8F135]/30 bg-[#C8F135]/5 px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-[#C8F135] uppercase rounded-none">
                + INSTITUTIONAL AUTONOMOUS INTELLIGENCE ENGINE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Deterministic Macro Synthesis &amp; Risk-Gated Execution
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
              Meridian unifies 8 multi-asset intelligence pillars — cross-referencing real-time prices, Treasury fiscal flows, US congressional trades, and FCA disclosed shorts with a tri-model AI Council (Claude, GPT-4o, Grok) and a fail-closed HMAC RiskGate.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleEnterTerminal}
                className="bg-[#C8F135] hover:bg-[#b5db2e] text-black font-extrabold px-6 py-3.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(200,241,53,0.25)] rounded-none"
              >
                {loadingUser ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    ENTER TERMINAL DESK
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
              <a
                href="#pipeline"
                className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-6 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all bg-slate-950/40"
              >
                SYSTEM ARCHITECTURE SPEC
              </a>
            </div>

            {!loadingUser && hasActiveAccess && (
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#C8F135]" />
                <span>Active Subscription Verified. Access Granted.</span>
              </div>
            )}
          </div>

          {/* Right Column: High-tech System Parameters Card */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="bg-[#0A0D15]/90 border border-slate-800/80 p-6 font-mono text-xs text-slate-300 w-full max-w-md shadow-2xl space-y-4 rounded-none backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C8F135] to-transparent opacity-50"></div>
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">SYSTEM TELEMETRY</span>
                <span className="text-[#C8F135] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C8F135] rounded-full animate-pulse"></span>
                  HEALTHY // 18 PACKAGES
                </span>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">DATA ADAPTERS</span>
                <span className="text-white font-bold font-mono">16 CONNECTORS</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">AI COUNCIL MODEL SEATS</span>
                <span className="text-[#C8F135] font-bold">CLAUDE - GPT-4O - GROK</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">RISK GATE PROTOCOL</span>
                <span className="text-white font-bold">HMAC-SHA256 SIGNED</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">BROKER INTEGRATION</span>
                <span className="text-white font-bold">OANDA v20 REST (PRACTICE)</span>
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">TIER 4 EXECUTION GATE</span>
                <span className="text-orange-500 font-bold uppercase tracking-wider">OBSERVE MODE (DISABLED)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4 Key Stats Strip (High Contrast White Theme) ── */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          
          {/* Stat 1 */}
          <div className="p-8 space-y-2">
            <span className="text-2xl font-black text-slate-800 font-sans block tracking-tight">8 PILLARS</span>
            <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider font-mono">Cross-Asset Telemetry</span>
            <span className="text-xs text-slate-400 font-sans block leading-relaxed">Macro, Spot, Futures, Shorts, SEC</span>
          </div>
          
          {/* Stat 2 */}
          <div className="p-8 space-y-2">
            <span className="text-2xl font-black text-slate-800 font-sans block tracking-tight">3 MODEL SEATS</span>
            <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider font-mono">Tri-Model AI Council</span>
            <span className="text-xs text-slate-400 font-sans block leading-relaxed">Claude + GPT-4o + Grok Consensus</span>
          </div>
          
          {/* Stat 3 */}
          <div className="p-8 space-y-2">
            <span className="text-2xl font-black text-slate-800 font-sans block tracking-tight">4 TIERS</span>
            <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider font-mono">Deterministic Escalation</span>
            <span className="text-xs text-slate-400 font-sans block leading-relaxed">Watch -&gt; Research -&gt; Prepare -&gt; Execute</span>
          </div>
          
          {/* Stat 4 */}
          <div className="p-8 space-y-2">
            <span className="text-2xl font-black text-slate-800 font-sans block tracking-tight">0 MOCK FALLBACKS</span>
            <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider font-mono">Strict Provenance Engine</span>
            <span className="text-xs text-slate-400 font-sans block leading-relaxed">No hardcoded data or fake apis</span>
          </div>

        </div>
      </section>

      {/* ── System Pipeline & 4-Tier Model (White Theme Section) ── */}
      <section id="pipeline" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-500 font-mono uppercase font-bold tracking-widest">
              SYSTEM PIPELINE &amp; 4-TIER MODEL
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Autonomous Intelligence Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card Tier 1 */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between min-h-[230px] transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                    TIER 1 — WATCH
                  </span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 text-[9px] font-mono font-bold rounded">
                    INGESTION
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  Continuous Observation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Monitors raw data streams across macroeconomic releases, Treasury fiscal reports, EIA inventory stock draws, and disclosed UK FCA net short positions.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-600 font-bold">
                <span>STATUS: ENFORCED</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

            {/* Card Tier 2 */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between min-h-[230px] transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                    TIER 2 — RESEARCH
                  </span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 text-[9px] font-mono font-bold rounded">
                    SYNTHESIS
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  Council Deep Synthesis
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Multi-LLM consensus (Claude, GPT-4o, Grok) cross-references anomalies against historical cycles, SEC Form 4 insider trades, and government contract awards.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-600 font-bold">
                <span>STATUS: ENFORCED</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

            {/* Card Tier 3 */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between min-h-[230px] transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                    TIER 3 — PREPARE
                  </span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 text-[9px] font-mono font-bold rounded">
                    FALSIFICATION
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  Thesis Falsification Check
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Drafts explicit OrderIntent parameters. Validates stop loss targets and verifies that mandatory falsification criteria are intact before staging.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-600 font-bold">
                <span>STATUS: ENFORCED</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

            {/* Card Tier 4 */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between min-h-[230px] transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                    TIER 4 — EXECUTE
                  </span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 text-[9px] font-mono font-bold rounded">
                    SAFETY GATE
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  RiskGate &amp; Broker Route
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Generates cryptographically signed ApprovalToken. Passes security checks and routes execution payload to Oanda v20 REST endpoints.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-600 font-bold">
                <span>STATUS: ENFORCED</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Intelligence Coverage Matrix (Light Grey Theme Section) ── */}
      <section id="coverage" className="bg-[#F8F9FA] border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-500 font-mono uppercase font-bold tracking-widest">
              INTELLIGENCE COVERAGE MATRIX
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              The 8 Pillars of Cross-Asset Context
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pillar I */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR I
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  THE WORLD
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Global macro indicators, FRED fed funds rate, US public debt, EIA crude oil inventories.
                </p>
              </div>
            </div>

            {/* Pillar II */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR II
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  THE MARKETS
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Real-time multi-asset spot breadth (GBP/USD, EUR/USD, WTI), CFTC COT, FCA UK net short registers.
                </p>
              </div>
            </div>

            {/* Pillar III */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR III
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  THE HORIZON
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Forward event calendar linking SEC EDGAR S-1 IPO filings, central bank rate decisions, prediction odds.
                </p>
              </div>
            </div>

            {/* Pillar IV */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR IV
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  THE UNDERCURRENT
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Alternative data joins: Congressional stock trading cross-referenced with USAspending federal contract awards.
                </p>
              </div>
            </div>

            {/* Pillar V */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR V
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  ALTERNATIVES
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Kalshi, Polymarket, and Manifold event contract probabilities and alternative asset valuation curves.
                </p>
              </div>
            </div>

            {/* Pillar VI */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR VI
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  ACTIVE THESES
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Investment conviction &amp; mandatory falsification engine. Every position possesses explicit invalidation rules.
                </p>
              </div>
            </div>

            {/* Pillar VII */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR VII
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  AI COUNCIL
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Tri-model synthesis engine producing structured macro consensus reports and scenario probability distributions.
                </p>
              </div>
            </div>

            {/* Pillar VIII */}
            <div className="bg-white border border-slate-200 p-6 flex gap-4 transition-all duration-200 hover:shadow-md hover:border-slate-300">
              <span className="text-[#C8F135] bg-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded h-fit shrink-0 tracking-wider">
                PILLAR VIII
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
                  AUTOMATION &amp; RISK
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Deterministic 4-tier escalation model, RiskGate HMAC token signing, and Oanda broker execution.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Page Footer ── */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        <div>
          MERIDIAN INVESTMENT CENTRE • INSTITUTIONAL SYSTEM
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={handleEnterTerminal}
            className="text-slate-600 hover:text-slate-900 font-bold uppercase transition-colors"
          >
            LOGIN TO TERMINAL
          </button>
          <Link 
            href="/dashboard" 
            className="text-slate-600 hover:text-slate-900 font-bold uppercase transition-colors"
          >
            MERIDIAN HOME
          </Link>
        </div>
      </footer>

      {/* ── Gated Subscription Checkout Modal (Dark Mode Premium) ── */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E17] border border-[#C8F135]/40 p-6 sm:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(200,241,53,0.18)] space-y-6 animate-in fade-in zoom-in-95 duration-200 rounded-none font-sans text-slate-200">
            
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#C8F135]/10 border border-[#C8F135]/30 text-[#C8F135] text-[10px] font-mono font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                [RESERVED INSTITUTIONAL ACCESS]
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                Unlock The Investment Centre
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous cross-asset macro synthesis, tri-model AI council, and falsification-gated execution. Gated in accordance with private system credentials.
              </p>
            </div>

            <div className="bg-[#070A11] border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Base Tier</span>
                <span className="text-white font-bold uppercase">
                  {subscriptionTier ? subscriptionTier : "FREE"}
                </span>
              </div>
              
              <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">Add-on Subscription</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#C8F135]">£99</span>
                  <span className="text-[10px] text-slate-400"> / month</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-2 text-xs font-sans text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>16 Real-Time Connectors (FRED, EIA, SEC, FCA)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>Continuous 24/7 Macro &amp; Alternative Data Analysis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>Tri-Model AI Council consensus</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  <span>HMAC-SHA256 Signed OrderIntent Router</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {hasEligibleBaseTier ? (
                // User has Foundation or Edge: they just buy the add-on
                <button
                  onClick={() => handleProceedStripeCheckout("addon_only")}
                  disabled={checkoutLoading}
                  className="w-full bg-[#C8F135] hover:bg-[#b3d82a] text-black font-extrabold py-3.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,241,53,0.3)] rounded-none"
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      ADD INVESTMENT CENTRE (£99/mo)
                      <ExternalLink className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              ) : (
                // User is Free, Signal-Centre or none: they must bundle or upgrade to Floor
                <div className="space-y-2">
                  <button
                    onClick={() => handleProceedStripeCheckout("floor")}
                    disabled={checkoutLoading}
                    className="w-full bg-[#C8F135] hover:bg-[#b3d82a] text-black font-extrabold py-3.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,241,53,0.3)] rounded-none"
                  >
                    {checkoutLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <>
                        GET FLOOR TIER (INCLUDES FREE) (£299/mo)
                        <ExternalLink className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleProceedStripeCheckout("foundation")}
                    disabled={checkoutLoading}
                    className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white py-3.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-slate-900/60"
                  >
                    UPGRADE TO FOUNDATION (£49/mo)
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowPaywallModal(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-white py-2 font-mono uppercase tracking-wider transition-colors"
              >
                Close System Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
