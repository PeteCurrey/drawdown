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
import { STRIPE_CONFIG } from "@/config/stripe";
import { CheckoutConsentModal } from "@/components/legal/CheckoutConsentModal";

export default function InvestmentCentreMarketingClient() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingPlanType, setPendingPlanType] = useState<"addon_only" | "bundle" | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function getUserData() {
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
        console.error("Failed to load user session:", e);
      } finally {
        setLoadingUser(false);
      }
    }
    getUserData();
  }, []);

  const hasEligibleBaseTier = subscriptionTier && ["foundation", "edge", "floor"].includes(subscriptionTier);

  const handleSubscribeClick = async () => {
    setShowCheckoutModal(true);
  };

  const handleProceedStripeCheckout = async (
    planType: "addon_only" | "bundle",
    consentData?: { terms_accepted: boolean; immediate_supply_requested: boolean; marketing_consent: boolean }
  ) => {
    if (!consentData) {
      setPendingPlanType(planType);
      setShowCheckoutModal(false);
      setShowConsentModal(true);
      return;
    }
    setCheckoutLoading(true);
    setShowConsentModal(false);
    try {
      if (!user) {
        const redirectUrl = encodeURIComponent("/investment-centre?checkout=true");
        window.location.href = `/login?redirect=${redirectUrl}`;
        return;
      }

      const targetPriceId = planType === "addon_only"
        ? STRIPE_CONFIG.prices["investment-centre"].monthly.gbp
        : STRIPE_CONFIG.prices["foundation"].monthly.gbp;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: targetPriceId,
          tier: planType === "addon_only" ? "investment-centre" : "foundation-investment-centre",
          terms_accepted: consentData.terms_accepted,
          immediate_supply_requested: consentData.immediate_supply_requested,
          marketing_consent: consentData.marketing_consent,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Checkout error: ${data.error}`);
      } else {
        window.location.href = "https://investmentcentre.drawdown.trading";
      }
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      window.location.href = "https://investmentcentre.drawdown.trading";
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans select-none overflow-x-hidden relative">
      {/* ── Top Announcement Banner ── */}
      <div className="w-full bg-slate-900 border-b border-[#C8F135]/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sticky top-0 z-40">
        <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8F135] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8F135]"></span>
            </span>
            <span className="text-[#C8F135] font-mono font-bold tracking-wider uppercase text-[11px]">
              [INSTITUTIONAL PLATFORM ADD-ON]
            </span>
            <span className="text-slate-300 text-[11px] hidden sm:inline font-mono">
              Requires Foundation Membership or Above
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/40 px-2.5 py-0.5 text-[11px] font-mono font-bold rounded">
              £99 / MONTH
            </span>
            <button
              onClick={handleSubscribeClick}
              className="bg-[#C8F135] text-black font-bold px-4 py-1 text-[11px] font-mono uppercase tracking-wider hover:bg-[#b5db2e] transition-all flex items-center gap-1.5 rounded"
            >
              <Lock className="w-3.5 h-3.5" />
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8F135]/15 border border-[#C8F135]/40 text-[#3d5200] text-xs font-mono font-bold uppercase tracking-widest rounded">
            <Cpu className="w-3.5 h-3.5 text-[#5a7a00]" />
            [INSTITUTIONAL INTELLIGENCE &amp; DETERMINISTIC RISK ROUTING]
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none font-sans">
            Cross-Asset Macro Synthesis &amp; Falsification-Gated Execution
          </h1>

          <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-sans max-w-3xl">
            Meridian continuously ingests macro feeds, central bank signals, SEC filings, and alternative dataset joins. Every market delta is evaluated against active investment theses, ranked by explicit salience scoring, and gated through cryptographic HMAC risk tokens before broker execution.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/pricing"
              className="bg-[#C8F135] text-black font-extrabold px-8 py-4 text-xs font-mono uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center gap-2.5 rounded"
            >
              ACCESS WITH EDGE (£99/MO)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#specification"
              className="border border-slate-300 hover:border-slate-500 text-slate-700 hover:text-slate-900 px-8 py-4 text-xs font-mono uppercase tracking-wider font-bold transition-all bg-slate-50 hover:bg-slate-100 rounded"
            >
              SYSTEM SPECIFICATION
            </a>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#5a7a00]" />
            <span>Investment Centre is fully included with Edge (£99/mo) and Floor (£299/mo) memberships.</span>
          </div>
        </div>
      </section>

      {/* ── Interactive Terminal Interface Display ── */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#5a7a00] font-mono font-bold uppercase tracking-widest mb-1">
                LIVE SYSTEM INTERFACE
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Inside Meridian Investment Centre Terminal
              </h2>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-mono text-slate-500 rounded">
              v2.4 INSTITUTIONAL EDITION
            </span>
          </div>

          {/* Terminal Window Mockup — stays dark to represent the actual platform UI */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg font-mono text-slate-200">
            {/* Window Header */}
            <div className="bg-slate-800 px-6 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#C8F135] font-bold tracking-widest">MERIDIAN // TERMINAL</span>
                <span className="text-slate-600">|</span>
                <span className="text-[#C8F135] opacity-90 text-[11px]">AUTONOMOUS MACRO &amp; RISK ENGINE v2.4</span>
              </div>
              <div className="flex items-center gap-6 text-[11px] text-slate-400 tracking-wider">
                <span className="text-[#C8F135]">TRADE DESK</span>
                <span>ARCHITECTURE</span>
                <span>AUTOMATION</span>
                <span className="bg-[#C8F135] text-black font-bold px-2.5 py-0.5 text-[10px] uppercase">
                  LOG IN TO CONSOLE →
                </span>
              </div>
            </div>

            {/* Terminal Main Content Area */}
            <div className="p-6 sm:p-10 space-y-10 bg-slate-900">
              {/* Inner Hero */}
              <div className="space-y-4 max-w-3xl">
                <span className="text-[#C8F135] text-xs font-bold uppercase tracking-widest">
                  [INSTITUTIONAL INTELLIGENCE &amp; DETERMINISTIC RISK ROUTING]
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                  Cross-Asset Macro Synthesis &amp; Falsification-Gated Execution
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                  Meridian continuously ingests macro feeds, central bank signals, SEC filings, and alternative dataset joins. Every market delta is evaluated against active investment theses, ranked by explicit salience scoring, and gated through cryptographic HMAC risk tokens before broker execution.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="bg-[#C8F135] text-black font-bold px-4 py-2 text-xs uppercase font-mono">
                    LOG IN &amp; LAUNCH CONSOLE
                  </span>
                  <span className="border border-slate-600 text-slate-300 px-4 py-2 text-xs uppercase font-mono">
                    SYSTEM SPECIFICATION
                  </span>
                </div>
              </div>

              {/* 4 Ingestion Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-700/80 pt-8">
                <div className="bg-slate-800 p-4 border border-slate-700 rounded">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">INGESTION FEEDS</p>
                  <h4 className="text-base font-bold text-white tracking-wide">18 REAL-TIME</h4>
                  <p className="text-[11px] text-slate-400 font-sans">FRED, EIA, SEC, FCA, TwelveData</p>
                </div>
                <div className="bg-slate-800 p-4 border border-slate-700 rounded">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">DELTAS EVALUATED (24H)</p>
                  <h4 className="text-base font-bold text-white tracking-wide">1,420 METRICS</h4>
                  <p className="text-[11px] text-slate-400 font-sans">Deterministic Salience Pipeline</p>
                </div>
                <div className="bg-slate-800 p-4 border border-slate-700 rounded">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">COUNCIL SYNTHESIS</p>
                  <h4 className="text-base font-bold text-white tracking-wide">3 AI MODELS</h4>
                  <p className="text-[11px] text-slate-400 font-sans">Claude 3.5, GPT-4o, Grok-2</p>
                </div>
                <div className="bg-slate-800 p-4 border border-slate-700 rounded">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">BROKER ADAPTER</p>
                  <h4 className="text-base font-bold text-white tracking-wide">OANDA v20 ACTIVE</h4>
                  <p className="text-[11px] text-slate-400 font-sans">HMAC RiskToken Protected</p>
                </div>
              </div>

              {/* 4-Tier Pipeline */}
              <div id="specification" className="space-y-4 border-t border-slate-700/80 pt-8">
                <p className="text-[10px] text-[#C8F135] uppercase tracking-widest">SYSTEM PIPELINE &amp; 4-TIER ESCALATION MODEL</p>
                <h4 className="text-xl font-bold text-white font-sans">End-to-End Autonomous Intelligence Flow</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800 border border-slate-700 p-4 space-y-2">
                    <span className="text-[10px] text-sky-400 font-bold">TIER 1 — WATCH</span>
                    <h5 className="text-xs font-bold text-white font-sans">Continuous Observation</h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Monitors raw data streams across macroeconomic releases, Treasury fiscal reports, EIA inventory stock draws, and disclosed UK FCA net short positions.</p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 p-4 space-y-2">
                    <span className="text-[10px] text-purple-400 font-bold">TIER 2 — RESEARCH</span>
                    <h5 className="text-xs font-bold text-white font-sans">Council Deep Synthesis</h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Multi-LLM consensus (Claude, GPT-4o, Grok) cross-references anomalies against historical cycles, SEC Form 4 insider trades, and government contract awards.</p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 p-4 space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold">TIER 3 — PREPARE</span>
                    <h5 className="text-xs font-bold text-white font-sans">Thesis Falsification Check</h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Drafts explicit OrderIntent parameters. Validates stop loss targets and verifies that mandatory falsification criteria are intact before staging.</p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 p-4 space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold">TIER 4 — EXECUTE</span>
                    <h5 className="text-xs font-bold text-white font-sans">RiskGate &amp; Broker Route</h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Generates cryptographically signed ApprovalToken. Passes security checks and routes execution payload to Oanda v20 REST endpoints.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Window Footer */}
            <div className="bg-slate-800 px-6 py-3 border-t border-slate-700 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
              <div>MERIDIAN INVESTMENT CENTRE // PRIVATELY DEPLOYED SYSTEM</div>
              <div className="flex items-center gap-4">
                <span>THE BRIEF</span>
                <span className="text-[#C8F135] font-bold">TRADE DESK</span>
                <span>AUTOMATION</span>
                <span>SPECIFICATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The 8 Pillars Section ── */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div>
          <p className="text-xs text-[#5a7a00] font-mono font-bold uppercase tracking-widest mb-1">
            INTELLIGENCE COVERAGE
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            The 8 Pillars of Cross-Asset Context
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR I</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">THE WORLD</h3>
              <p className="text-xs text-slate-500 font-sans">Global macro indicators, FRED fed funds rate, US public debt, EIA crude oil inventories.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR II</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">THE MARKETS</h3>
              <p className="text-xs text-slate-500 font-sans">Real-time multi-asset spot breadth (GBP/USD, EUR/USD, WTI), CFTC COT, FCA UK net short registers.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR III</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">THE HORIZON</h3>
              <p className="text-xs text-slate-500 font-sans">Forward event calendar linking SEC EDGAR S-1 IPO filings, central bank rate decisions, prediction odds.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR IV</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">THE UNDERCURRENT</h3>
              <p className="text-xs text-slate-500 font-sans">Alternative data inputs: Congressional stock trading cross-referenced with USAspending federal contract awards.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR V</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">ALTERNATIVES</h3>
              <p className="text-xs text-slate-500 font-sans">Kalshi, Polymarket, and Manifold event contract probabilities and alternative asset valuation curves.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR VI</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">ACTIVE THESES</h3>
              <p className="text-xs text-slate-500 font-sans">Investment conviction &amp; mandatory falsification engine. Every position possesses explicit invalidation rules.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR VII</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">AI COUNCIL</h3>
              <p className="text-xs text-slate-500 font-sans">Tri-model synthesis engine producing structured macro consensus reports and scenario probability distributions.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-start gap-4 hover:border-[#C8F135]/60 transition-colors">
            <span className="text-[#5a7a00] font-mono text-xs font-bold shrink-0 mt-0.5 bg-[#C8F135]/15 px-2 py-1 rounded">PILLAR VIII</span>
            <div className="space-y-1 font-mono">
              <h3 className="text-sm font-bold text-slate-900 uppercase">AUTOMATION &amp; RISK</h3>
              <p className="text-xs text-slate-500 font-sans">Deterministic 4-tier escalation model, RiskGate HMAC token signing, and Oanda broker execution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing & Prerequisite Membership Section ── */}
      <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto border-t border-slate-200">
        <div className="bg-white border border-[#C8F135]/50 rounded-2xl p-8 sm:p-12 shadow-[0_4px_40px_rgba(200,241,53,0.12)] space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8F135]/15 border border-[#C8F135]/40 text-[#3d5200] text-xs font-mono font-bold uppercase tracking-widest rounded">
              <Lock className="w-3.5 h-3.5 text-[#5a7a00]" />
              [PREREQUISITE MEMBERSHIP REQUIRED]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
              The Investment Centre Add-on
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              The Investment Centre is included with <strong className="text-slate-900">Edge membership (£99/mo)</strong> and <strong className="text-[#5a7a00]">Floor membership (£299/mo)</strong>. It is not available as a standalone product.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Edge &amp; Floor Membership</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900">£99</span>
                  <span className="text-sm font-mono text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-[#5a7a00] font-mono mt-1">Included with Edge membership — also included with Floor</p>
              </div>
              <div className="space-y-2 text-xs text-slate-700 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5a7a00] shrink-0" />
                  <span>18 Real-Time Macro &amp; Alternative Feeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5a7a00] shrink-0" />
                  <span>1,420 Metrics Evaluated 24/7 (Salience Engine)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5a7a00] shrink-0" />
                  <span>Tri-Model AI Council (Claude 3.5 + GPT-4o + Grok)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5a7a00] shrink-0" />
                  <span>OANDA v20 HMAC RiskToken Router</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-lg border border-slate-200">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#5a7a00] uppercase font-bold tracking-widest block">
                  MEMBERSHIP CHECK
                </span>
                <h4 className="text-sm font-bold text-slate-900">Minimum Tier: Foundation (£49/mo)</h4>
              </div>

              {loadingUser ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#5a7a00]" /> Checking account eligibility...
                </div>
              ) : subscriptionTier === "floor" ? (
                <div className="space-y-3">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded font-mono flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>The Investment Centre is 100% INCLUDED in your Floor Membership!</span>
                  </div>
                  <a
                    href="https://investmentcentre.drawdown.trading"
                    className="w-full bg-[#C8F135] text-black font-extrabold py-3.5 text-xs font-mono uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 rounded text-center block"
                  >
                    Launch Investment Centre Console →
                  </a>
                </div>
              ) : hasEligibleBaseTier ? (
                <div className="space-y-3">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded font-mono flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Eligible! Your current tier ({subscriptionTier?.toUpperCase()}) allows adding the £99/mo Investment Centre.</span>
                  </div>
                  <button
                    onClick={() => handleProceedStripeCheckout("addon_only")}
                    disabled={checkoutLoading}
                    className="w-full bg-[#C8F135] text-black font-extrabold py-3.5 text-xs font-mono uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 rounded cursor-pointer"
                  >
                    {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe for £99/Month →"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>The Investment Centre is included with Edge (£99/mo) and Floor (£299/mo). It is not available as a standalone add-on.</span>
                  </div>
                  <button
                    onClick={() => handleProceedStripeCheckout("bundle")}
                    disabled={checkoutLoading}
                    className="w-full bg-[#C8F135] text-black font-extrabold py-3.5 text-xs font-mono uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 rounded cursor-pointer"
                  >
                    {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bundle: Foundation + Investment Centre (£148/mo) →"}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center font-mono">
                    Already a member? <Link href="/login?redirect=/investment-centre" className="text-[#5a7a00] underline">Log in here</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Checkout Modal ── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 font-mono">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#C8F135]/15 border border-[#C8F135]/40 text-[#3d5200] text-[10px] font-bold uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                [MEMBERSHIP RULE ENFORCED]
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                Access The Investment Centre
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                The Investment Centre is included with Edge (£99/mo) and Floor (£299/mo) memberships. Upgrade to access.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {subscriptionTier === "floor" ? (
                <div className="bg-slate-50 border border-emerald-200 p-4 rounded-lg space-y-3 text-center">
                  <p className="text-xs text-emerald-700 font-bold">You hold The Floor membership! The Investment Centre is fully unlocked for you.</p>
                  <a
                    href="https://investmentcentre.drawdown.trading"
                    className="w-full bg-[#C8F135] text-black font-extrabold py-3 text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 rounded text-center block"
                  >
                    Launch Console →
                  </a>
                </div>
              ) : hasEligibleBaseTier ? (
                <div className="bg-slate-50 border border-emerald-200 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">Base Tier: {subscriptionTier?.toUpperCase()}</span>
                    <span className="text-emerald-600 font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-900 font-bold">Investment Centre Add-on</span>
                    <span className="text-slate-900 font-bold text-base">£99 / mo</span>
                  </div>
                  <button
                    onClick={() => handleProceedStripeCheckout("addon_only")}
                    disabled={checkoutLoading}
                    className="w-full bg-[#C8F135] text-black font-extrabold py-3 text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 rounded mt-2 cursor-pointer"
                  >
                    {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Proceed to £99/mo Checkout →"}
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-amber-600 uppercase font-bold tracking-widest block">
                      CHOOSE YOUR ACCESS PATH:
                    </span>

                    {/* Option 1: Bundle */}
                    <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-900 font-bold">Foundation + Investment Centre Bundle</span>
                        <span className="text-slate-900 font-bold">£148 / mo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans">Foundation (£49/mo) + Investment Centre (£99/mo).</p>
                      <button
                        onClick={() => handleProceedStripeCheckout("bundle")}
                        disabled={checkoutLoading}
                        className="w-full bg-[#C8F135] text-black font-extrabold py-2.5 text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-all flex items-center justify-center gap-2 rounded cursor-pointer"
                      >
                        {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Foundation + Investment Centre Bundle (£148/mo) →"}
                      </button>
                    </div>

                    {/* Option 2: Floor */}
                    <div className="p-3 bg-[#C8F135]/8 border border-[#C8F135]/40 rounded space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-900 font-bold">The Floor Membership</span>
                        <span className="text-[#5a7a00] font-bold">£299 / mo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans">Includes everything in Edge + The Investment Centre (£99 value) + 1-on-1s.</p>
                      <button
                        onClick={() => handleProceedStripeCheckout("bundle")}
                        disabled={checkoutLoading}
                        className="w-full border border-[#C8F135] text-[#3d5200] font-extrabold py-2.5 text-xs uppercase tracking-wider hover:bg-[#C8F135] hover:text-black transition-all flex items-center justify-center gap-2 rounded cursor-pointer"
                      >
                        {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get The Floor (£299/mo — All Included) →"}
                      </button>
                    </div>

                    {/* Option 3: Sign in */}
                    <div className="text-center pt-2">
                      <Link
                        href="/login?redirect=/investment-centre"
                        className="text-xs text-slate-500 hover:text-slate-800 underline font-sans"
                      >
                        Already have a Foundation/Edge/Floor membership? Sign in
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingPlanType && (
        <CheckoutConsentModal
          isOpen={showConsentModal}
          onClose={() => { setShowConsentModal(false); setPendingPlanType(null); }}
          onConfirm={(consentData) => { if (pendingPlanType) handleProceedStripeCheckout(pendingPlanType, consentData); }}
          loading={checkoutLoading}
          productName="Drawdown Investment Centre"
          priceString="£99/mo"
        />
      )}
    </div>
  );
}
