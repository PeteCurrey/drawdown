"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Shield, ArrowRight, BookOpen, Download, Cpu } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { STRIPE_CONFIG } from "@/config/stripe";
import { REGIONAL_PRICING, type RegionCode } from "@/lib/regions";
import { GET_DEFAULT_FEATURES, GET_EDGE_FEATURES, GET_FLOOR_FEATURES } from "@/data/pricing";
import { CheckoutConsentModal } from "@/components/legal/CheckoutConsentModal";

const tiers = [
  {
    id: "foundation" as const,
    name: "Foundation",
    description: "For beginners building their knowledge base.",
    buttonText: "Start Foundation",
    features: GET_DEFAULT_FEATURES(),
  },
  {
    id: "edge" as const,
    name: "Edge",
    description: "For active traders seeking AI-powered edge.",
    buttonText: "Join Edge",
    features: GET_EDGE_FEATURES(),
  },
  {
    id: "floor" as const,
    name: "Floor",
    description: "Direct access and bespoke strategy analysis.",
    buttonText: "Enter the Floor",
    features: GET_FLOOR_FEATURES(),
  },
];

export function PricingSection({ floorCap = 15, activeFloorSubs = 0 }: { floorCap?: number, activeFloorSubs?: number }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { region } = useRegion();

  const [showConsent, setShowConsent] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const getPlanDetails = (tierId: "foundation" | "edge" | "floor") => {
    let currencyKey: "gbp" | "aud" | "usd" | "sgd" | "hkd" = "gbp";
    let symbol = "£";
    const regionUpper = region.toUpperCase();

    if (regionUpper === "UK" || regionUpper === "GB") {
      currencyKey = "gbp";
      symbol = "£";
    } else if (regionUpper === "US") {
      currencyKey = "usd";
      symbol = "$";
    } else if (regionUpper === "AU") {
      currencyKey = "aud";
      symbol = "A$";
    } else if (regionUpper === "SG") {
      currencyKey = "sgd";
      symbol = "S$";
    } else if (regionUpper === "HK") {
      currencyKey = "hkd";
      symbol = "HK$";
    }

    const monthlyPriceId = STRIPE_CONFIG.prices[tierId].monthly[currencyKey];
    const annualPriceId = STRIPE_CONFIG.prices[tierId].annual[currencyKey];

    const regionCode: RegionCode = (regionUpper === "UK" || regionUpper === "GB") ? "GB" : regionUpper as RegionCode;
    const regPlan = REGIONAL_PRICING[regionCode]?.[tierId];
    const baseMonthlyPrice = regPlan ? parseInt(regPlan.price) : (tierId === "foundation" ? 49 : tierId === "edge" ? 99 : 299);

    const priceVal = billingCycle === "monthly" ? baseMonthlyPrice : Math.floor(baseMonthlyPrice * 0.8);
    const activePriceId = billingCycle === "monthly" ? monthlyPriceId : annualPriceId;

    return {
      price: priceVal,
      symbol,
      priceId: activePriceId
    };
  };

  const handleSubscribe = async (tierId: string, priceId: string, consentData?: {
    terms_accepted: boolean;
    immediate_supply_requested: boolean;
    marketing_consent: boolean;
  }) => {
    if (tierId === "floor" && activeFloorSubs >= floorCap) {
      window.location.href = "/waitlist?tier=floor";
      return;
    }

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

  return (
    <>
    <section
      className="w-full border-b select-none relative z-10"
      style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)", paddingTop: "var(--section-y-desktop)", paddingBottom: "var(--section-y-desktop)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Platform Tiers
          </span>
          <h2
            className="type-display-lg font-normal mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Choose Your Commitment
          </h2>
          
          {/* Toggle */}
          <div className="flex items-center gap-4">
            <span
              className="text-[12px] font-mono uppercase tracking-[0.08em]"
              style={{ color: billingCycle === "monthly" ? "var(--text-primary)" : "var(--text-tertiary)" }}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
              className="px-3 py-1 border text-[11px] font-mono uppercase tracking-[0.08em] transition-colors"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--surface-raised)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Switch to {billingCycle === "monthly" ? "Yearly (Save 20%)" : "Monthly"}
            </button>
          </div>
        </div>

        {/* Free Tier Callout Card */}
        <div
          className="mb-8 p-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            backgroundColor: "var(--surface-raised)",
            borderColor: "var(--border-subtle)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span 
                className="px-2 py-0.5 border text-[10px] font-mono uppercase tracking-[0.1em] font-bold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                  color: "var(--market-up)",
                  borderColor: "color-mix(in srgb, var(--market-up) 25%, transparent)",
                  borderRadius: "var(--radius-pill)"
                }}
              >
                Free Forever
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                Stage 01: Free Tier (£0)
              </span>
            </div>
            <p className="text-xs font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Includes complete <strong>Phase 1 Ground Zero curriculum</strong>, <strong>RUN MY TRADE pre-trade sizing</strong>, and live macroeconomic briefings. No credit card required. Upgrade to Foundation when you are ready to log trades and access advanced modules.
            </p>
          </div>

          <Link
            href="/signup"
            className="shrink-0 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border transition-colors"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--surface-base)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            Start Free Mode &rarr;
          </Link>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          {tiers.map((tier) => {
            const { price, symbol, priceId } = getPlanDetails(tier.id);
            const isEdge = tier.id === "edge";
            const isFloorCapped = tier.id === "floor" && activeFloorSubs >= floorCap;

            return (
              <div
                key={tier.id}
                className="border p-8 flex flex-col justify-between h-full"
                style={{
                  backgroundColor: isEdge ? "var(--surface-overlay)" : "var(--surface-raised)",
                  borderColor: isEdge ? "var(--accent)" : "var(--border-subtle)",
                  color: "var(--text-primary)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: isEdge ? "var(--elev-3)" : "var(--elev-1)",
                }}
              >
                <div>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[20px] font-medium font-sans uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {tier.name}
                      </h3>
                      {isEdge && (
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                          style={{
                            borderColor: "var(--accent)",
                            backgroundColor: "var(--accent-muted)",
                            color: "var(--accent)",
                            borderRadius: "var(--radius-pill)",
                          }}
                        >
                          Most Selected
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[13px] leading-relaxed font-sans min-h-[38px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tier.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-1 mt-6">
                      <span className="text-[40px] font-mono tabular-nums font-medium leading-none" style={{ color: "var(--text-primary)" }}>
                        {symbol}{price}
                      </span>
                      <span
                        className="text-[11px] font-mono uppercase tracking-[0.08em]"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        /mo
                      </span>
                    </div>
                    {tier.id === "floor" && (
                      <p
                        className="text-[11px] font-mono uppercase tracking-[0.08em] mt-2"
                        style={{ color: "var(--market-flat)" }}
                      >
                        Strictly limited to {floorCap} active members
                      </p>
                    )}
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => handleSubscribe(tier.id, priceId)}
                    disabled={loadingTier !== null}
                    className="w-full py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] mb-8 border transition-colors duration-150 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isEdge ? "var(--accent)" : "var(--surface-raised)",
                      color: isEdge ? "var(--surface-base)" : "var(--text-primary)",
                      borderColor: isEdge ? "var(--accent)" : "var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    {loadingTier === tier.id ? "Processing..." : isFloorCapped ? "Join Waitlist" : tier.buttonText}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3">
                    <span
                      className="block text-[10px] font-mono uppercase tracking-[0.08em] mb-4"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Included features
                    </span>
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check
                          size={15}
                          strokeWidth={1.5}
                          className="shrink-0 mt-0.5"
                          style={{ color: isEdge ? "var(--accent)" : "var(--text-primary)" }}
                        />
                        <span
                          className="text-[13px] leading-snug font-sans"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Core Capabilities Strip */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border mb-8"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-raised)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div className="flex items-start gap-3">
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

          <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6" style={{ borderColor: "var(--border-subtle)" }}>
            <Download size={16} strokeWidth={1.5} className="shrink-0 mt-1" style={{ color: "var(--accent)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--text-primary)" }}>
                Instant PDF Downloads
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
                Unlock Pete Currey's professional playbooks, prop survival kits, risk spreadsheets, and journal templates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6" style={{ borderColor: "var(--border-subtle)" }}>
            <Cpu size={16} strokeWidth={1.5} className="shrink-0 mt-1" style={{ color: "var(--accent)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--text-primary)" }}>
                Premium Platform Add-ons
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--text-secondary)" }}>
                Scale your analytical edge with the Investment Centre Terminal, included with Edge and Floor memberships.
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
            borderRadius: "var(--radius-lg)",
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
              Compare every sub-capability, explore PDF guide access, and find the right plan on the full pricing page.
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
            Expand Pricing &amp; Plans
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Roadmap link for upcoming features */}
        <div className="mb-12 text-center">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] hover:underline"
            style={{ color: "var(--text-primary)" }}
          >
            See upcoming platform features on our roadmap
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Educational Notice — hairline border, risk-amber text */}
        <div
          className="p-6 border max-w-3xl"
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
                Subscription tiers represent access levels to educational content, proprietary quantitative tools, and market signals. Drawdown does not provide financial advice. Trade signals and market analysis represent automated conclusions derived from data feeds and risk parameters; they are not guaranteed outcomes or investment recommendations. All strategies tested or journals analyzed remain the intellectual property of the user. Past performance is not indicative of future results.
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
        productName={`Drawdown ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}`}
        priceString={(() => {
          const d = getPlanDetails(selectedTier as "foundation" | "edge" | "floor");
          return `${d.symbol}${d.price}/mo`;
        })()}
      />
    )}
    </>
  );
}
