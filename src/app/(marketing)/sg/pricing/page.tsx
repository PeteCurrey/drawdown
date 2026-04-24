"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { RegionalProvider, useRegion } from "@/components/layout/RegionalLayout";
import { STRIPE_CONFIG } from "@/config/stripe";
import { TrackPageView } from "@/components/admin/TrackPageView";

const tiers = [
  {
    name: "Foundation",
    price: { monthly: 79, yearly: 759 },
    description: "For Singapore traders building their knowledge base.",
    buttonText: "Start Foundation",
    highlight: false,
    borderColor: "border-text-primary/20",
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
    price: { monthly: 239, yearly: 2299 },
    description: "For active SG traders seeking AI-powered edge.",
    buttonText: "Join Edge",
    highlight: true,
    borderColor: "border-accent",
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
    price: { monthly: 479, yearly: 4599 },
    description: "Direct access and bespoke strategy analysis.",
    buttonText: "Enter the Floor",
    highlight: false,
    borderColor: "border-premium",
    features: [
      { name: "Everything in Edge", included: true },
      { name: "Monthly 1-to-1 Mentorship (45m)", included: true },
      { name: "Custom AI Portfolio Analysis", included: true },
      { name: "Private Small-Group Masterclasses", included: true },
      { name: "Early Access to New Tools", included: true },
      { name: "Quarterly Strategy Review Calls", included: true },
      { name: "Direct Discord Access to Founder", included: true },
    ],
  },
];

function PricingContent() {
  const { region, currencySymbol } = useRegion();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierName: string) => {
    setLoadingTier(tierName);
    try {
      const tierId = tierName.toLowerCase().replace('the ', '');
      const priceConfig = STRIPE_CONFIG.prices[tierId as keyof typeof STRIPE_CONFIG.prices][billingCycle === 'monthly' ? 'monthly' : 'annual'];
      
      const priceId = (priceConfig as any)[region] || (priceConfig as any)['gbp'];

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, tier: tierId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = "/login?redirect=/sg/pricing";
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
    <div className="pt-32 pb-24 min-h-screen bg-background-primary">
      <TrackPageView path="/sg/pricing" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            SINGAPORE PRICING // SGD
          </span>
          <h1 className="  font-display font-bold uppercase mb-8">
            Choose Your <span className="text-accent">Truth.</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-12">
            Professional education and tools for Singapore traders. 
            Select the tier that matches your commitment.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-mono uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-tertiary')}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-background-elevated rounded-full p-1 relative transition-colors border border-border-slate"
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
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={cn(
                "relative flex flex-col p-8 md:p-12 bg-background-surface border-2 transition-premium hover:bg-background-elevated",
                tier.borderColor,
                tier.highlight ? "scale-105 z-10 shadow-2xl shadow-accent/10" : "opacity-80 hover:opacity-100"
              )}
            >
              <div className="mb-12">
                <h3 className="text-2xl font-display font-bold uppercase mb-2">
                  {tier.name}
                </h3>
                <p className="text-text-secondary text-sm mb-8 min-h-[40px]">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-black">
                    {currencySymbol}{tier.price[billingCycle]}
                  </span>
                  <span className="text-text-tertiary text-sm font-mono uppercase tracking-widest">
                    /{billingCycle === 'monthly' ? 'mo' : 'mo'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => handleSubscribe(tier.name)}
                disabled={loadingTier !== null}
                className={cn(
                  "w-full py-5 text-sm font-bold uppercase tracking-widest mb-12 transition-colors flex items-center justify-center gap-2",
                  tier.name === 'Edge' ? 'bg-accent text-background-primary hover:bg-accent-hover' : 
                  tier.name === 'Floor' ? 'bg-premium text-background-primary hover:bg-premium/90' :
                  'bg-background-elevated border border-border-slate hover:border-text-primary'
                )}
              >
                {loadingTier === tier.name ? "Processing..." : tier.buttonText}
              </button>

              <div className="space-y-4">
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
          ))}
        </div>

        <div className="mt-24 p-8 bg-background-elevated border border-border-slate max-w-4xl mx-auto text-center">
          <p className="text-[10px] text-text-tertiary leading-relaxed font-mono uppercase tracking-widest">
            MAS Educational Notice: Drawdown provides institutional-grade education and tools. All prices in SGD.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SingaporePricingPage() {
  return (
    <RegionalProvider region="sg">
      <PricingContent />
    </RegionalProvider>
  );
}
