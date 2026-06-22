"use client";

import { useState } from "react";
import { Check, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STRIPE_CONFIG } from "@/config/stripe";

const tiers = [
  {
    name: "Foundation",
    price: { monthly: 49, yearly: 39 },
    description: "For beginners building their knowledge base.",
    buttonText: "Start Foundation",
    highlight: false,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(99, 102, 241, 0.12)",
    borderAccent: "rgba(99, 102, 241, 0.25)",
    savings: "120",
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
    name: "Edge",
    price: { monthly: 149, yearly: 119 },
    description: "For active traders seeking AI-powered edge.",
    buttonText: "Join Edge",
    highlight: true,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(6, 182, 212, 0.10)",
    borderAccent: "rgba(6, 182, 212, 0.28)",
    savings: "360",
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
    name: "Floor",
    price: { monthly: 299, yearly: 239 },
    description: "Direct access and bespoke strategy analysis.",
    buttonText: "Enter the Floor",
    highlight: false,
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(217, 119, 6, 0.08)",
    borderAccent: "rgba(217, 119, 6, 0.25)",
    savings: "720",
    features: [
      { name: "Everything in Edge", included: true },
      { name: "Monthly 1-to-1 Mentorship (45m)", included: true },
      { name: "Custom AI Portfolio Analysis", included: true },
      { name: "Private Small-Group Masterclasses", included: true },
      { name: "Early Access to New Tools", included: true },
      { name: "Quarterly Strategy Review Calls", included: true },
      { name: "Direct Discord Access to Founder", included: true },
      { name: "Deploy Your Algo Mini Course", included: true, badge: "Included — £97 value", accent: true },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleSubscribe = async (tierName: string) => {
    setLoadingTier(tierName);
    try {
      const tierId = tierName.toLowerCase().replace("the ", "");
      const priceConfig = STRIPE_CONFIG.prices[tierId as keyof typeof STRIPE_CONFIG.prices][
        billingCycle === "monthly" ? "monthly" : "annual"
      ];
      const priceId = (priceConfig as any)["gbp"];

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, tier: tierId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = "/login?redirect=/pricing";
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
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
            // PRICING
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary mb-4">
            Choose Your Level.
          </h1>
          <p className="text-base text-text-tertiary max-w-xl mx-auto font-sans leading-relaxed">
            Professional education and tools for traders who are tired of the noise.
            Select the tier that matches your commitment.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={cn("text-sm font-sans transition-colors", billingCycle === "monthly" ? "text-text-primary font-semibold" : "text-text-tertiary")}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-7 bg-[#F0F0F0] border border-border-slate/50 rounded-full p-0.5 relative transition-colors"
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-mkt-ink rounded-full transition-transform duration-300"
              style={{ transform: billingCycle === "yearly" ? "translateX(28px)" : "translateX(0)" }}
            />
          </button>
          <span className={cn("text-sm font-sans transition-colors", billingCycle === "yearly" ? "text-text-primary font-semibold" : "text-text-tertiary")}>
            Yearly{" "}
            <span className="text-[10px] font-sans font-bold text-profit ml-1">Save 20%</span>
          </span>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => {
            const isHovered = hoveredTier === tier.name;
            return (
              <div
                key={tier.name}
                onMouseEnter={() => setHoveredTier(tier.name)}
                onMouseLeave={() => setHoveredTier(null)}
                className={cn(
                  "relative flex flex-col border rounded-[14px] overflow-hidden transition-all duration-300",
                  tier.highlight ? "md:-translate-y-2 shadow-[0_12px_48px_rgba(0,0,0,0.09)]" : ""
                )}
                style={{
                  borderColor: isHovered ? tier.borderAccent : "rgba(229,229,229,0.8)",
                  transform: isHovered && !tier.highlight ? "translateY(-3px)" : tier.highlight ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovered ? `0 12px 48px rgba(0,0,0,0.08)` : tier.highlight ? "0 12px 48px rgba(0,0,0,0.09)" : "none",
                }}
              >
                {/* Background image reveal */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url(${tier.imageUrl})`,
                      opacity: isHovered ? 0.07 : 0.03,
                      transform: isHovered ? "scale(1)" : "scale(1.04)",
                    }}
                  />
                </div>

                {tier.highlight && (
                  <div className="relative z-10 bg-mkt-ink text-white text-center py-2 text-[10px] font-sans font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}

                <div className="relative z-10 p-8 flex flex-col flex-1 /95">
                  {/* Tier name + description */}
                  <div className="mb-8">
                    <h3 className="text-xl font-sans font-extrabold tracking-tight text-text-primary mb-1">{tier.name}</h3>
                    <p className="text-xs text-text-tertiary font-sans leading-relaxed min-h-[36px]">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-sans font-extrabold text-text-primary tracking-tight">
                        £{tier.price[billingCycle]}
                      </span>
                      <span className="text-xs text-text-tertiary font-sans ml-1">/mo</span>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="text-[10px] font-sans text-profit mt-1 font-semibold">
                        Billed annually — save £{tier.savings}/yr
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleSubscribe(tier.name)}
                    disabled={loadingTier !== null}
                    className={cn(
                      "w-full py-3 rounded-lg text-sm font-sans font-semibold mb-8 transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60",
                      tier.highlight
                        ? "bg-mkt-ink text-white hover:bg-mkt-i2"
                        : "bg-background-elevated/40 border border-border-slate/50 text-text-primary hover:bg-[#EEEEEE]"
                    )}
                  >
                    {loadingTier === tier.name ? "Processing..." : tier.buttonText}
                    {loadingTier !== tier.name && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {/* Features */}
                  <div className="space-y-3 border-t border-border-slate/50 pt-6">
                    <p className="text-[10px] font-sans font-bold text-text-tertiary uppercase tracking-widest mb-4">
                      What's included
                    </p>
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        {feature.included ? (
                          <Check className={cn("w-4 h-4 shrink-0 mt-0.5", (feature as any).accent ? "text-[#C8F135]" : "text-profit")} />
                        ) : (
                          <X className="w-4 h-4 text-mkt-bd shrink-0 mt-0.5" />
                        )}
                        <span className={cn("text-xs font-sans leading-relaxed flex-1", feature.included ? "text-text-secondary" : "text-text-tertiary")}>
                          {feature.name}
                        </span>
                        {(feature as any).badge && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wide text-black bg-[#C8F135] shrink-0 ml-1">
                            {(feature as any).badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Educational notice */}
        <div className="mt-16 p-6 bg-background-elevated/40 border border-border-slate/50 rounded-[14px] max-w-4xl mx-auto">
          <h4 className="text-[10px] font-sans font-bold text-text-tertiary uppercase tracking-widest mb-3">
            Educational Platform Notice
          </h4>
          <p className="text-[10px] text-text-tertiary leading-relaxed font-sans">
            Subscription tiers represent access levels to educational content and proprietary analysis tools.
            Drawdown does not provide financial advice or trade signals. All strategies tested or journals
            analyzed remain the intellectual property of the user. Past performance as logged in the AI Trade
            Journal is not indicative of future results.
          </p>
        </div>
      </div>
    </div>
  );
}
