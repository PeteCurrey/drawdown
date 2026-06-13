"use client";

import { useState } from "react";
import { Check, X, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";
import { STRIPE_CONFIG } from "@/config/stripe";
import { REGIONAL_PRICING, type RegionCode } from "@/lib/regions";

const tiers = [
  {
    id: "foundation" as const,
    name: "Foundation",
    description: "For beginners building their knowledge base.",
    buttonText: "Start Foundation",
    features: [
      { name: "Full Course Library (Phases 1–4)", included: true },
      { name: "Weekly Video Market Breakdowns", included: true },
      { name: "Trade Journal (Manual)", included: true },
      { name: "Position Size Calculator", included: true },
      { name: "Community Discord Access", included: true },
      { name: "The Wire (Daily Edition)", included: true },
      { name: "AI Trade Journal", included: false },
      { name: "AI Market Scanner", included: false },
      { name: "AI Strategy Backtester", included: false },
    ],
  },
  {
    id: "edge" as const,
    name: "Edge",
    description: "For active traders seeking AI-powered edge.",
    buttonText: "Join Edge",
    features: [
      { name: "Everything in Foundation", included: true },
      { name: "AI Trade Journal", included: true },
      { name: "AI Market Scanner & Alerting", included: true },
      { name: "AI Strategy Backtester", included: true },
      { name: "Daily Live Trading Sessions", included: true },
      { name: "Bi-weekly Group Mentorship", included: true },
      { name: "AI Daily Briefing", included: true },
      { name: "Advanced Strategy Modules", included: true },
    ],
  },
  {
    id: "floor" as const,
    name: "Floor",
    description: "Direct access and bespoke strategy analysis.",
    buttonText: "Enter the Floor",
    features: [
      { name: "Everything in Edge", included: true },
      { name: "Monthly 1-to-1 Mentorship (45m)", included: true },
      { name: "Custom AI Portfolio Analysis", included: true },
      { name: "Private Small-Group Masterclasses", included: true },
      { name: "Early Access to New Tools", included: true },
      { name: "Direct Discord Access to Founder", included: true },
      { name: "Quarterly Strategy Review Calls", included: true },
    ],
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
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

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // PLATFORM TIERS
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-6">
            Choose Your Commitment
          </h2>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn(
              "text-xs font-sans font-bold uppercase tracking-wider transition-colors",
              billingCycle === "monthly" ? "text-mkt-ink" : "text-mkt-i4"
            )}>
              Monthly
            </span>
            <button 
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 bg-white border border-mkt-bd rounded-full p-0.5 relative transition-colors"
            >
              <div className={cn(
                "w-5 h-5 bg-mkt-ink rounded-full transition-transform duration-300",
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
            <span className={cn(
              "text-xs font-sans font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5",
              billingCycle === "yearly" ? "text-mkt-ink" : "text-mkt-i4"
            )}>
              Yearly <span className="text-mkt-grn bg-mkt-gbg border border-mkt-gbd text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const { price, symbol, priceId } = getPlanDetails(tier.id);
            const isEdge = tier.id === "edge";
            const isHovered = hoveredIdx === idx;
            
            // Subtle, corporate theme styling details
            const cardTheme = tier.id === "foundation" 
              ? {
                  baseBg: "rgba(16, 185, 129, 0.005)",
                  hoverBg: "rgba(16, 185, 129, 0.035)",
                  borderColor: "rgba(16, 185, 129, 0.22)",
                  shadow: "0 8px 32px rgba(16, 185, 129, 0.03)"
                }
              : tier.id === "floor"
              ? {
                  baseBg: "rgba(217, 119, 6, 0.005)",
                  hoverBg: "rgba(217, 119, 6, 0.035)",
                  borderColor: "rgba(217, 119, 6, 0.22)",
                  shadow: "0 8px 32px rgba(217, 119, 6, 0.03)"
                }
              : { // Edge (dark card)
                  baseBg: "rgb(10, 10, 10)",
                  hoverBg: "rgb(12, 12, 12)",
                  borderColor: "rgba(34, 197, 94, 0.45)",
                  shadow: "0 12px 40px rgba(34, 197, 94, 0.08)"
                };

            return (
              <motion.div
                key={tier.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  "border rounded-[14px] p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative",
                  isEdge ? "text-white" : "text-mkt-ink"
                )}
                style={{
                  backgroundColor: isHovered ? cardTheme.hoverBg : (isEdge ? "rgb(10, 10, 10)" : cardTheme.baseBg),
                  borderColor: isHovered ? cardTheme.borderColor : (isEdge ? "rgba(255, 255, 255, 0.08)" : "rgba(229, 229, 229, 0.7)"),
                  transform: isHovered ? "translateY(-3px)" : "translateY(0px)",
                  boxShadow: isHovered ? cardTheme.shadow : (isEdge ? "0 10px 30px rgba(0,0,0,0.15)" : "none")
                }}
              >
                {isEdge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mkt-grn text-white px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-md z-10">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-sans font-extrabold uppercase mb-2 tracking-tight">
                      {tier.name}
                    </h3>
                    <p className={cn(
                      "text-xs font-sans leading-relaxed min-h-[40px]",
                      isEdge ? "text-neutral-400" : "text-mkt-i3"
                    )}>
                      {tier.description}
                    </p>
                    
                    {/* Price in Geist, weight 800, letter-spacing -0.04em */}
                    <div className="flex items-baseline gap-1 mt-6">
                      <span 
                        className="text-[44px] font-sans tracking-[-0.04em] font-extrabold leading-none"
                        style={{ fontWeight: 800 }}
                      >
                        {symbol}{price}
                      </span>
                      <span className={cn(
                        "text-[10px] font-mono uppercase tracking-widest",
                        isEdge ? "text-neutral-500" : "text-mkt-i4"
                      )}>
                        /mo
                      </span>
                    </div>
                  </div>

                  {/* CTA button */}
                  <button 
                    onClick={() => handleSubscribe(tier.id, priceId)}
                    disabled={loadingTier !== null}
                    className={cn(
                      "w-full py-4 text-xs font-sans font-bold uppercase tracking-widest mb-10 transition-all rounded-lg flex items-center justify-center gap-2",
                      isEdge 
                        ? "bg-mkt-grn text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20" 
                        : "bg-white border border-mkt-bd text-mkt-ink hover:border-mkt-ink"
                    )}
                  >
                    {loadingTier === tier.id ? "Processing..." : tier.buttonText}
                  </button>

                  {/* Features List */}
                  <div className="space-y-4">
                    <p className={cn(
                      "text-[9px] font-mono uppercase tracking-widest mb-4",
                      isEdge ? "text-neutral-500" : "text-mkt-i4"
                    )}>
                      Included features
                    </p>
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-mkt-grn shrink-0 mt-0.5" />
                        ) : (
                          <X className={cn(
                            "w-4 h-4 shrink-0 mt-0.5",
                            isEdge ? "text-neutral-700" : "text-neutral-200"
                          )} />
                        )}
                        <span className={cn(
                          "text-xs leading-tight font-sans",
                          feature.included 
                            ? (isEdge ? "text-neutral-200" : "text-mkt-ink") 
                            : (isEdge ? "text-neutral-600" : "text-mkt-i4")
                        )}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Educational Notice */}
        <div className="mt-24 p-8 bg-white border border-mkt-bd max-w-4xl mx-auto rounded-[14px] flex items-start gap-4">
          <Shield className="w-6 h-6 text-mkt-i3 shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-mkt-ink">Educational Platform Notice</h4>
            <p className="text-[10px] text-mkt-i3 leading-relaxed font-mono">
              Subscription tiers represent access levels to educational content and proprietary analysis tools. Drawdown does not provide financial advice or trade signals. All strategies tested or journals analyzed remain the intellectual property of the user. Past performance as logged in the AI Trade Journal is not indicative of future results.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
