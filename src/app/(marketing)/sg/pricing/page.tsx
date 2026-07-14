"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Shield, Activity, TrendingUp } from "lucide-react";
import { REGIONAL_PRICING } from "@/lib/regions";
import Link from "next/link";

const SG_PRICING = REGIONAL_PRICING.SG;

const tiers = [
  {
    name: "Foundation",
    id: "foundation",
    description: "For Singaporean beginners building their alpha base.",
    buttonText: "Start Foundation",
    highlight: false,
    borderColor: "border-text-primary/20",
    features: [
      { name: "Full Course Library (Phases 1–4)", included: true },
      { name: "Weekly Video Market Breakdowns", included: true },
      { name: "MAS Broker Directory", included: true },
      { name: "Position Size Calculator (SGD)", included: true },
      { name: "Community Discord Access", included: true },
      { name: "AI Trade Journal", included: false },
      { name: "AI Market Scanner", included: false },
    ],
  },
  {
    name: "Edge",
    id: "edge",
    description: "For active SG traders seeking AI-powered edge.",
    buttonText: "Join Edge",
    highlight: true,
    borderColor: "border-border-slate/50",
    features: [
      { name: "Everything in Foundation", included: true },
      { name: "AI Trade Journal", included: true },
      { name: "AI Market Scanner & Alerting", included: true },
      { name: "AI Strategy Backtester", included: true },
      { name: "Daily Live Trading Sessions", included: true },
      { name: "Asian Session Trading Modules", included: true },
      { name: "AI Daily Briefing", included: true },
    ],
  },
  {
    name: "Floor",
    id: "floor",
    description: "Direct access and bespoke Asian market analysis.",
    buttonText: "Enter the Floor",
    highlight: false,
    borderColor: "border-premium",
    features: [
      { name: "Everything in Edge", included: true },
      { name: "Monthly 1-to-1 Mentorship (45m)", included: true },
      { name: "Custom AI Portfolio Analysis", included: true },
      { name: "Private Small-Group Masterclasses", included: true },
      { name: "Early Access to New Tools", included: true },
      { name: "Direct Discord Access to Founder", included: true },
    ],
  },
];

export default function SingaporePricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    setLoadingTier(tierId);
    try {
      const plan = (SG_PRICING as any)[tierId];
      const stripePriceId = plan.stripePriceId;

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: stripePriceId, tier: tierId, region: 'SG' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
             <span className="text-accent font-mono tracking-widest uppercase text-sm block">
               SINGAPORE PRICING
             </span>
             <span className="px-2 py-0.5 bg-accent text-[#08090D] text-[8px] font-bold uppercase rounded">SGD</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase mb-8 leading-none">
            Built for <span className="text-accent underline decoration-accent/20">The Lion City.</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-12">
            professional-grade education for Singaporean traders. SGD-normalized pricing and MAS-compliant insights.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-mono uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-tertiary')}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-background-elevated/40 rounded-full p-1 relative transition-colors border border-border-slate/50"
            >
              <div className={cn(
                "absolute top-1 left-1 w-6 h-6 bg-accent rounded-full transition-transform duration-300",
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
              )} />
            </button>
            <span className={cn("text-sm font-mono uppercase tracking-widest transition-colors", billingCycle === 'yearly' ? 'text-text-primary' : 'text-text-tertiary')}>
              Yearly <span className="text-profit text-[10px] ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => {
            const plan = (SG_PRICING as any)[tier.id];
            return (
              <div 
                key={tier.id}
                className={cn(
                  "relative flex flex-col p-8 md:p-12  border-2 transition-premium hover:bg-background-elevated",
                  tier.borderColor,
                  tier.highlight ? "scale-105 z-10 shadow-2xl shadow-accent/10" : "opacity-80 hover:opacity-100"
                )}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-mkt-ink text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-12">
                  <h3 className="text-2xl font-sans font-bold uppercase mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-8 min-h-[40px]">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-sans font-black text-text-primary">
                      ${billingCycle === 'monthly' ? plan.price : Math.floor(parseInt(plan.price) * 10 * 0.8 / 12)}
                    </span>
                    <span className="text-text-tertiary text-sm font-mono uppercase tracking-widest">
                      /mo
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={loadingTier !== null}
                  className={cn(
                    "w-full py-5 text-sm font-bold uppercase tracking-widest mb-12 transition-colors flex items-center justify-center gap-2",
                    tier.id === 'edge' ? 'bg-mkt-ink text-white hover:bg-accent-hover shadow-xl shadow-accent/20' : 
                    tier.id === 'floor' ? 'bg-premium text-background-primary hover:bg-premium/90 shadow-xl shadow-premium/20' :
                    'bg-background-elevated/40 border border-border-slate/50 hover:border-text-primary'
                  )}
                >
                  {loadingTier === tier.id ? "Processing..." : tier.buttonText}
                </button>

                <div className="space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Regional Inclusions</p>
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-profit shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-text-tertiary shrink-0" />
                      )}
                      <span className={cn(
                        "text-xs leading-none",
                        feature.included ? "text-text-primary" : "text-text-tertiary"
                      )}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory Note */}
        <div className="mt-24 p-12 bg-background-elevated/40 border border-border-slate/50 max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
           <Shield className="w-16 h-16 text-accent opacity-50" />
           <div className="space-y-4 text-center md:text-left">
              <h4 className="text-xl font-sans font-bold uppercase tracking-widest text-text-primary">MAS Compliance</h4>
              <p className="text-[10px] text-text-tertiary leading-relaxed font-mono">
                Subscription tiers represent access levels to educational content and proprietary analysis tools. Drawdown is not a registered investment advisor in Singapore. All services are SGD denominated. We prioritize MAS-regulated brokers in our tools and educational materials.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
