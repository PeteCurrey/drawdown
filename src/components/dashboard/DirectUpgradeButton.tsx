"use client";

import React, { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutConsentModal } from "@/components/legal/CheckoutConsentModal";

interface DirectUpgradeButtonProps {
  tier: "foundation" | "edge" | "floor" | "signal-centre" | "investment-centre" | "accelerator";
  billingCycle?: "monthly" | "yearly";
  region?: string;
  redirectPath?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DirectUpgradeButton({
  tier,
  billingCycle = "monthly",
  region = "gbp",
  redirectPath,
  className,
  children,
}: DirectUpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  const handleDirectUpgrade = async (consentData?: {
    terms_accepted: boolean;
    immediate_supply_requested: boolean;
    marketing_consent: boolean;
  }) => {
    if (!consentData) {
      setShowConsent(true);
      return;
    }

    setLoading(true);
    setError(null);
    setShowConsent(false);
    try {
      const response = await fetch("/api/stripe/checkout-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          billingCycle,
          region,
          redirectPath,
          terms_accepted: consentData.terms_accepted,
          immediate_supply_requested: consentData.immediate_supply_requested,
          marketing_consent: consentData.marketing_consent,
        }),
      });

      if (response.status === 401) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to start checkout session.");
      }
    } catch (err: any) {
      console.error("Direct Upgrade Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const priceDisplay = tier === "accelerator" 
    ? "£1,495 (One-time payment)" 
    : tier === "floor" 
    ? `£299 / ${billingCycle}`
    : tier === "edge" 
    ? `£99 / ${billingCycle}` 
    : `£49 / ${billingCycle}`;

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={() => handleDirectUpgrade()}
        disabled={loading}
        className={cn(
          "relative w-full flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-lg overflow-hidden group shadow-lg active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed",
          tier === "accelerator"
            ? "bg-gradient-to-r from-[#E2B755] to-[#C59235] hover:from-[#F3C475] hover:to-[#E2B755] text-black shadow-yellow-500/20"
            : tier === "floor"
            ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-amber-500/20"
            : "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white shadow-blue-500/20",
          className
        )}
      >
        {/* Subtle hover background sweep */}
        <div className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

        {loading ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Securing Stripe Session...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{children || `Instantly Upgrade to ${tier}`}</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2.5 text-[10px] font-mono text-red-500 bg-red-50 border border-red-200/50 rounded px-2.5 py-1 text-center animate-shake">
          {error}
        </p>
      )}

      <CheckoutConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onConfirm={handleDirectUpgrade}
        loading={loading}
        productName={`Drawdown ${tier.toUpperCase()}`}
        priceString={priceDisplay}
      />
    </div>
  );
}
