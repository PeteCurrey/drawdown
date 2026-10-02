"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Shield, ArrowRight, BookOpen, Download, Cpu, Zap } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { STRIPE_CONFIG } from "@/config/stripe";
import { CheckoutConsentModal } from "@/components/legal/CheckoutConsentModal";
import { CardAtmosphere } from "@/components/ui/CardAtmosphere";

export function PricingSection({
  floorCap = 15,
  activeFloorSubs = 0,
}: {
  floorCap?: number;
  activeFloorSubs?: number;
} = {}) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { region } = useRegion();

  const [showConsent, setShowConsent] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const getCorePlanDetails = () => {
    let currencyKey: "gbp" | "usd" | "eur" | "cad" | "aud" = "gbp";
    let symbol = "£";
    let price = "24.99";
    const regionUpper = region.toUpperCase();

    if (regionUpper === "UK" || regionUpper === "GB") {
      currencyKey = "gbp";
      symbol = "£";
      price = "24.99";
    } else if (regionUpper === "US") {
      currencyKey = "usd";
      symbol = "$";
      price = "29.99";
    } else if (regionUpper === "AU") {
      currencyKey = "aud";
      symbol = "A$";
      price = "49.99";
    } else if (regionUpper === "CA") {
      currencyKey = "cad";
      symbol = "C$";
      price = "39.99";
    } else if (regionUpper === "DE" || regionUpper === "EU") {
      currencyKey = "eur";
      symbol = "€";
      price = "29.99";
    }

    const priceId = STRIPE_CONFIG.prices.core.monthly[currencyKey] || STRIPE_CONFIG.prices.core.monthly.gbp;

    return {
      price,
      symbol,
      priceId,
    };
  };

  const handleSubscribe = async (tierId: string, priceId: string, consentData?: {
    terms_accepted: boolean;
    immediate_supply_requested: boolean;
    marketing_consent: boolean;
  }) => {
    if (!consentData) {
      setSelectedTier(tierId);
      setSelectedPriceId(priceId);
      setShowConsent(true);
      return;
    }

    setLoadingTier(tierId);
    setShowConsent(false);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          tier: tierId,
          terms_accepted: consentData.terms_accepted,
          immediate_supply_requested: consentData.immediate_supply_requested,
          marketing_consent: consentData.marketing_consent,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = `/login?redirect=/pricing`;
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  const coreDetails = getCorePlanDetails();

  return (
    <>
    <section
      className="w-full border-b select-none relative z-10"
      style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)", paddingTop: "var(--section-y-desktop)", paddingBottom: "var(--section-y-desktop)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span
            className="inline-block text-[11px] font-mono uppercase tracking-[0.08em] mb-3 px-3 py-1 border rounded"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-tertiary)", backgroundColor: "var(--surface-raised)" }}
          >
            Commercial Membership
          </span>
          <h2
            className="type-display-lg font-normal mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            One Core Membership. All Platform Tools.
          </h2>
          <p className="text-sm font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            No multi-tier confusion. Start completely free with essential calculators, pre-trade sizing, and the Prop Firm Survival Kit. Upgrade to Core whenever you want live signals, quantitative scanning, and AI analytics.
          </p>
        </div>

        {/* 2-Column Grid: Free vs Core */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16 max-w-4xl mx-auto">
          
          {/* Card 1: Drawdown Free */}
          <div
            className="border p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-300 hover:shadow-[var(--elev-2)]"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-1)",
            }}
          >
            <CardAtmosphere pattern="topographic" accentColor="var(--market-up)" />

            <div className="relative z-10">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[20px] font-medium font-sans uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Drawdown Free
                  </h3>
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                    style={{
                      borderColor: "color-mix(in srgb, var(--market-up) 30%, transparent)",
                      backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                      color: "var(--market-up)",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    No Card Required
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed font-sans min-h-[38px]" style={{ color: "var(--text-secondary)" }}>
                  Public tools, pre-trade risk protocols, and instant lead magnet downloads.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mt-6">
                  <span className="text-[40px] font-mono tabular-nums font-medium leading-none" style={{ color: "var(--text-primary)" }}>
                    {coreDetails.symbol}0
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--text-tertiary)" }}>
                    /forever
                  </span>
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/signup"
                className="w-full py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] mb-8 border transition-colors duration-150 flex items-center justify-center gap-2 active:translate-y-0.5"
                style={{
                  backgroundColor: "var(--surface-base)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(16,24,40,0.04)",
                  borderBottom: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                Start Free Mode &rarr;
              </Link>

              {/* Features List */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.08em] mb-4" style={{ color: "var(--text-tertiary)" }}>
                  Included in Free
                </span>
                {[
                  "Prop Firm Survival Kit (Full PDF & Sheets)",
                  "Plan My Trade pre-trade sizing calculator",
                  "Position Size & Risk/Reward calculators",
                  "Phase 1: Ground Zero curriculum modules",
                  "Manual Trade Journaling",
                  "Selected market articles & weekly briefing",
                  "Public broker & prop-firm research directory",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={15} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--market-up)" }} />
                    <span className="text-[13px] leading-snug font-sans" style={{ color: "var(--text-secondary)" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Drawdown Core Membership */}
          <div
            className="border p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-300 hover:shadow-[var(--elev-3)]"
            style={{
              backgroundColor: "var(--surface-overlay)",
              borderColor: "var(--accent)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-3)",
            }}
          >
            <CardAtmosphere pattern="plotted-curve" accentColor="var(--accent)" />

            <div className="relative z-10">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[20px] font-medium font-sans uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Drawdown Core
                  </h3>
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                    style={{
                      borderColor: "var(--accent)",
                      backgroundColor: "var(--accent-muted)",
                      color: "var(--accent)",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    All-Inclusive
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed font-sans min-h-[38px]" style={{ color: "var(--text-secondary)" }}>
                  Complete systematic trading suite. All quantitative scanners, signals, and tools.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mt-6">
                  <span className="text-[40px] font-mono tabular-nums font-medium leading-none" style={{ color: "var(--text-primary)" }}>
                    {coreDetails.symbol}{coreDetails.price}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--text-tertiary)" }}>
                    /month
                  </span>
                </div>
                <p className="text-[11px] font-mono uppercase tracking-[0.08em] mt-1 text-slate-400">
                  Cancel anytime · No contract
                </p>
              </div>

              {/* CTA button */}
              <button
                onClick={() => handleSubscribe("core", coreDetails.priceId)}
                disabled={loadingTier !== null}
                className="w-full py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] mb-8 border transition-colors duration-150 flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--surface-base)",
                  borderColor: "var(--accent)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(16,24,40,0.08), 0 3px 10px rgba(16,24,40,0.12)",
                  borderBottom: "1px solid rgba(0,0,0,0.22)",
                }}
              >
                {loadingTier === "core" ? "Processing..." : "Start Core Membership"}
              </button>

              {/* Features List */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.08em] mb-4" style={{ color: "var(--text-tertiary)" }}>
                  Everything in Free, plus:
                </span>
                {[
                  "Quantitative Technical Scanner & Market Screener",
                  "Live Signal Centre feeds, consensus & alerts",
                  "Institutional Investment Centre & macro engine",
                  "AI-assisted Trade Journal & pattern review",
                  "Strategy Backtester (Beta) & walk-forward engine",
                  "Algo Strategy Builder Pine Script / Python export",
                  "Market Intelligence Hub, The Wire & Grok sentiment",
                  "Full curriculum access (all released phases)",
                  "Watchlists & custom saved screens",
                  "Priority support desk & member community",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={15} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                    <span className="text-[13px] leading-snug font-sans" style={{ color: "var(--text-primary)" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Minimalist Core Capabilities Strip */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border mb-8 group relative overflow-hidden transition-all duration-300 hover:shadow-[var(--elev-2)]"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-raised)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--elev-1)",
          }}
        >
          <CardAtmosphere pattern="grid-mesh" accentColor="var(--accent)" />

          <div className="flex items-start gap-3 relative z-10">
            <BookOpen size={16} strokeWidth={1.5} className="shrink-0 mt-1" style={{ color: "var(--accent)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--text-primary)" }}>
                Structured Education
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
                Phase-based curriculum spanning Ground-Zero foundations to advanced macro news trading &amp; algo deployment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 relative z-10" style={{ borderColor: "var(--border-subtle)" }}>
            <Download size={16} strokeWidth={1.5} className="shrink-0 mt-1" style={{ color: "var(--accent)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--text-primary)" }}>
                Instant Lead Magnet
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
                Free download: Pete Currey's Prop Firm Survival Kit with 100-page manual, sizing spreadsheets &amp; tilt protocols.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 relative z-10" style={{ borderColor: "var(--border-subtle)" }}>
            <Cpu size={16} strokeWidth={1.5} className="shrink-0 mt-1" style={{ color: "var(--accent)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--text-primary)" }}>
                All Platform Tools
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
                All quant screener, signal feeds, backtester, AI journal, and macro analytics included in Core.
              </p>
            </div>
          </div>
        </div>

        {/* Full Pricing Directory Navigation Banner */}
        <div 
          className="border p-8 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-raised)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
              Detailed Matrix
            </span>
            <h3 className="text-[18px] font-semibold tracking-tight font-display" style={{ color: "var(--text-primary)" }}>
              Looking for the complete features table?
            </h3>
            <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
              Explore the full commercial breakdown, FAQ, and standalone books on the main pricing page.
            </p>
          </div>
          
          <Link
            href="/pricing"
            className="shrink-0 py-3.5 px-6 text-[13px] font-medium uppercase tracking-[0.08em] border transition-colors duration-150 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--surface-base)",
              borderColor: "var(--accent)",
              borderRadius: "var(--radius-md)",
            }}
          >
            View Pricing Page
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Educational Notice */}
        <div
          className="p-6 border max-w-3xl mx-auto"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-raised)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div className="flex items-start gap-4">
            <Shield size={18} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--text-primary)" }}>
                Educational Platform Notice
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
                Drawdown Trading does not provide financial advice. Trade signals and market analysis represent automated conclusions derived from data feeds and quantitative risk parameters; they are not guaranteed outcomes or investment recommendations. All strategies tested or journals analyzed remain the intellectual property of the user. Past performance is not indicative of future results.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    {selectedTier && selectedPriceId && (
      <CheckoutConsentModal
        isOpen={showConsent}
        onClose={() => { setShowConsent(false); setSelectedTier(null); setSelectedPriceId(null); }}
        onConfirm={(consentData) => handleSubscribe(selectedTier, selectedPriceId, consentData)}
        loading={loadingTier !== null}
        productName="Drawdown Core Membership"
        priceString={`${coreDetails.symbol}${coreDetails.price}/mo`}
      />
    )}
    </>
  );
}
