"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { RegionalProvider, useRegion } from "@/components/layout/RegionalLayout";
import { STRIPE_CONFIG } from "@/config/stripe";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { REGIONAL_PRICING, PricingTier } from "@/data/pricing";
import { useParams } from "next/navigation";
import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";

function PricingContent() {
  const { region, currencySymbol, label } = useRegion();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const tiers = REGIONAL_PRICING[region] || REGIONAL_PRICING['uk'];

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
        window.location.href = `/login?redirect=/${region}/pricing`;
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
    <div className="pt-28 pb-24 min-h-screen bg-white">
      <TrackPageView path={`/${region}/pricing`} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            {label.toUpperCase()} PRICING // {REGIONS_MAP[region].currency}
          </span>
          <h1 className="  font-sans font-bold uppercase mb-8">
            Choose Your <span className="text-accent">Truth.</span>
          </h1>
          <p className="text-mkt-i2 max-w-2xl mx-auto mb-12">
            Professional education and tools for {label} traders who are tired of the noise. 
            Select the tier that matches your commitment.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-mono uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? 'text-mkt-ink' : 'text-mkt-i4')}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-[#F7F7F7] rounded-full p-1 relative transition-colors border border-mkt-bd"
            >
              <div className={cn(
                "absolute top-1 left-1 w-6 h-6 bg-accent rounded-full transition-transform duration-300",
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
              )} />
            </button>
            <span className={cn("text-sm font-mono uppercase tracking-widest transition-colors", billingCycle === 'yearly' ? 'text-mkt-ink' : 'text-mkt-i4')}>
              Yearly <span className="text-mkt-grn text-[10px] ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={cn(
                "relative flex flex-col p-8 md:p-12 bg-white border-2 transition-premium hover:bg-[#F7F7F7]",
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
                <p className="text-mkt-i2 text-sm mb-8 min-h-[40px]">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-sans font-black">
                    {currencySymbol}{tier.price[billingCycle]}
                  </span>
                  <span className="text-mkt-i4 text-sm font-mono uppercase tracking-widest">
                    /{billingCycle === 'monthly' ? 'mo' : 'mo'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-mkt-grn text-[10px] uppercase font-mono mt-2 tracking-widest">
                    Bill annually (Save {currencySymbol}{Math.round(tier.price.monthly * 12 - tier.price.yearly)})
                  </p>
                )}
              </div>

              <button 
                onClick={() => handleSubscribe(tier.name)}
                disabled={loadingTier !== null}
                className={cn(
                  "w-full py-5 text-sm font-bold uppercase tracking-widest mb-12 transition-colors flex items-center justify-center gap-2",
                  tier.name === 'Edge' ? 'bg-mkt-ink text-white hover:bg-accent-hover' : 
                  tier.name === 'Floor' ? 'bg-premium text-background-primary hover:bg-premium/90' :
                  'bg-[#F7F7F7] border border-mkt-bd hover:border-text-primary'
                )}
              >
                {loadingTier === tier.name ? "Processing..." : tier.buttonText}
              </button>

              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-6">Included features</p>
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-mkt-grn shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-mkt-i4 shrink-0" />
                    )}
                    <span className={cn(
                      "text-xs leading-none",
                      feature.included ? "text-mkt-ink" : "text-mkt-i4"
                    )}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-8 bg-[#F7F7F7] border border-mkt-bd max-w-4xl mx-auto">
          <h4 className="text-xs font-mono uppercase tracking-widest text-mkt-i2 mb-4">{label} Regulatory Notice</h4>
          <p className="text-[10px] text-mkt-i4 leading-relaxed font-mono">
            Subscription tiers represent access levels to educational content and proprietary analysis tools. Drawdown does not provide investment advice or financial services as defined by local laws. All prices in {REGIONS_MAP[region].currency}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegionalPricingPage() {
  const params = useParams();
  const region = params.region as Region;

  return (
    <RegionalProvider region={region}>
      <PricingContent />
    </RegionalProvider>
  );
}
