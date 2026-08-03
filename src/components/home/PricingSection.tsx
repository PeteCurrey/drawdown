"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Shield, ArrowRight } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { STRIPE_CONFIG } from "@/config/stripe";
import { REGIONAL_PRICING, type RegionCode } from "@/lib/regions";
import { GET_DEFAULT_FEATURES, GET_EDGE_FEATURES, GET_FLOOR_FEATURES } from "@/data/pricing";

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
    const baseMonthlyPrice = regPlan ? parseInt(regPlan.price) : (tierId === "foundation" ? 49 : tierId === "edge" ? 149 : 299);

    const priceVal = billingCycle === "monthly" ? baseMonthlyPrice : Math.floor(baseMonthlyPrice * 0.8);
    const activePriceId = billingCycle === "monthly" ? monthlyPriceId : annualPriceId;

    return {
      price: priceVal,
      symbol,
      priceId: activePriceId
    };
  };

  const handleSubscribe = async (tierId: string, priceId: string) => {
    if (tierId === "floor" && activeFloorSubs >= floorCap) {
      window.location.href = "/waitlist?tier=floor";
      return;
    }

    setLoadingTier(tierId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, tier: tierId }),
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
    <section
      className="w-full py-24 border-b select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--graphite-600)" }}
          >
            Platform Tiers
          </span>
          <h2
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-6"
            style={{ color: "var(--ink-950)" }}
          >
            Choose Your Commitment
          </h2>
          
          {/* Toggle — zero border radius */}
          <div className="flex items-center gap-4">
            <span
              className="text-[12px] font-mono uppercase tracking-[0.08em]"
              style={{ color: billingCycle === "monthly" ? "var(--ink-950)" : "var(--graphite-600)" }}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
              className="px-3 py-1 border text-[11px] font-mono uppercase tracking-[0.08em] transition-colors"
              style={{
                borderColor: "var(--line-200)",
                backgroundColor: "var(--paper-100)",
                color: "var(--ink-950)",
                borderRadius: 0,
              }}
            >
              Switch to {billingCycle === "monthly" ? "Yearly (Save 20%)" : "Monthly"}
            </button>
          </div>
        </div>

        {/* 3 Column Grid — zero border-radius, hairline borders, tabular figures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          {tiers.map((tier) => {
            const { price, symbol, priceId } = getPlanDetails(tier.id);
            const isEdge = tier.id === "edge";
            const isFloorCapped = tier.id === "floor" && activeFloorSubs >= floorCap;

            return (
              <div
                key={tier.id}
                className="border p-8 flex flex-col justify-between"
                style={{
                  backgroundColor: isEdge ? "var(--ink-950)" : "var(--paper-100)",
                  borderColor: isEdge ? "var(--ink-950)" : "var(--line-200)",
                  color: isEdge ? "#FAFAF9" : "var(--ink-950)",
                  borderRadius: 0,
                }}
              >
                <div>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[20px] font-medium font-sans uppercase tracking-tight">
                        {tier.name}
                      </h3>
                      {isEdge && (
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                          style={{
                            borderColor: "rgba(255,255,255,0.2)",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "#FAFAF9",
                            borderRadius: 0,
                          }}
                        >
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[13px] leading-relaxed font-sans min-h-[38px]"
                      style={{ color: isEdge ? "rgba(255,255,255,0.6)" : "var(--graphite-600)" }}
                    >
                      {tier.description}
                    </p>
                    
                    {/* Price in IBM Plex Mono tabular figures */}
                    <div className="flex items-baseline gap-1 mt-6">
                      <span className="text-[40px] font-mono tabular font-medium leading-none">
                        {symbol}{price}
                      </span>
                      <span
                        className="text-[11px] font-mono uppercase tracking-[0.08em]"
                        style={{ color: isEdge ? "rgba(255,255,255,0.5)" : "var(--graphite-600)" }}
                      >
                        /mo
                      </span>
                    </div>
                    {tier.id === "floor" && (
                      <p
                        className="text-[11px] font-mono uppercase tracking-[0.08em] mt-2"
                        style={{ color: "var(--risk-amber)" }}
                      >
                        Strictly limited to {floorCap} active members
                      </p>
                    )}
                  </div>

                  {/* CTA button — zero radius */}
                  <button
                    onClick={() => handleSubscribe(tier.id, priceId)}
                    disabled={loadingTier !== null}
                    className="w-full py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] mb-8 border transition-colors duration-150 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isEdge ? "#FAFAF9" : "var(--signal-navy)",
                      color: isEdge ? "var(--ink-950)" : "#FAFAF9",
                      borderColor: isEdge ? "#FAFAF9" : "var(--signal-navy)",
                      borderRadius: 0,
                    }}
                  >
                    {loadingTier === tier.id ? "Processing..." : isFloorCapped ? "Join Waitlist" : tier.buttonText}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3">
                    <span
                      className="block text-[10px] font-mono uppercase tracking-[0.08em] mb-4"
                      style={{ color: isEdge ? "rgba(255,255,255,0.4)" : "var(--graphite-600)" }}
                    >
                      Included features
                    </span>
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check
                          size={15}
                          strokeWidth={1.5}
                          className="shrink-0 mt-0.5"
                          style={{ color: isEdge ? "#FAFAF9" : "var(--ink-950)" }}
                        />
                        <span
                          className="text-[13px] leading-snug font-sans"
                          style={{ color: isEdge ? "rgba(255,255,255,0.85)" : "var(--ink-950)" }}
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

        {/* Roadmap link for upcoming features */}
        <div className="mb-12 text-center">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] hover:underline"
            style={{ color: "var(--ink-950)" }}
          >
            See upcoming platform features on our roadmap
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Educational Notice — hairline border, risk-amber text */}
        <div
          className="p-6 border max-w-3xl"
          style={{
            borderColor: "var(--line-200)",
            backgroundColor: "var(--paper-100)",
            borderRadius: 0,
          }}
        >
          <div className="flex items-start gap-4">
            <Shield size={18} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--graphite-600)" }} />
            <div className="space-y-1">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                Educational Platform Notice
              </h4>
              <p className="text-[12px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                Subscription tiers represent access levels to educational content and proprietary analysis tools. Drawdown does not provide financial advice or trade signals. All strategies tested or journals analyzed remain the intellectual property of the user. Past performance as logged in the AI Trade Journal is not indicative of future results.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
