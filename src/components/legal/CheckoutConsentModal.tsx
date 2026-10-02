"use client";

import { useState } from "react";
import { ShieldCheck, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { LEGAL_CONFIG } from "@/config/legal";

interface CheckoutConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (consentData: {
    terms_accepted: boolean;
    immediate_supply_requested: boolean;
    marketing_consent: boolean;
  }) => void;
  loading: boolean;
  productName: string;
  priceString: string;
}

export function CheckoutConsentModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productName,
  priceString,
}: CheckoutConsentModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [immediateSupply, setImmediateSupply] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  if (!isOpen) return null;

  const isFormValid = termsAccepted && immediateSupply;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onConfirm({
      terms_accepted: termsAccepted,
      immediate_supply_requested: immediateSupply,
      marketing_consent: marketingConsent,
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div 
        className="relative w-full max-w-lg overflow-hidden border shadow-2xl transition-all font-sans"
        style={{
          backgroundColor: "var(--paper-100, #111)",
          borderColor: "var(--line-200, #333)",
          color: "var(--ink-950, #fff)",
          borderRadius: 0,
        }}
      >
        {/* Modal Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--line-200, #333)" }}
        >
          <div className="flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy, #3b82f6)" }}>
            <ShieldCheck className="w-4 h-4" />
            <span>Contractual Consent</span>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1 hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] opacity-60">Order Review</span>
            <h3 className="text-[18px] font-bold tracking-tight uppercase leading-tight">
              {productName}
            </h3>
            <p className="text-sm font-mono" style={{ color: "var(--signal-navy, #3b82f6)" }}>
              Price: {priceString}
            </p>
          </div>

          <div className="space-y-4">
            {/* Consent 1: Terms & Privacy (Required) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-[13px] leading-relaxed opacity-85 select-none">
                I accept the Drawdown{" "}
                <Link href="/terms" target="_blank" className="underline hover:opacity-80">Terms and Conditions</Link>{" "}
                and acknowledge the{" "}
                <Link href="/privacy" target="_blank" className="underline hover:opacity-80">Privacy Policy</Link>. I confirm I am aged {LEGAL_CONFIG.minimumCustomerAge} or older. <span className="text-red-500">*</span>
              </span>
            </label>

            {/* Consent 2: Immediate Digital Access (Required) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={immediateSupply}
                onChange={(e) => setImmediateSupply(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-[13px] leading-relaxed opacity-85 select-none">
                I request immediate supply and access to my digital content/subscription and agree that by checking this box, <strong>I waive my 14-day statutory right of cancellation</strong> under the UK Consumer Contracts Regulations 2013. I understand that the Drawdown {LEGAL_CONFIG.moneyBackGuaranteeDays}-day money-back guarantee remains fully applicable. <span className="text-red-500">*</span>
              </span>
            </label>

            {/* Consent 3: Marketing Consent (Optional) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-[13px] leading-relaxed opacity-85 select-none">
                I agree to receive general educational articles, quantitative market analysis, and product updates from Drawdown. I can opt out at any time.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3.5 text-[12px] font-mono font-bold uppercase tracking-[0.08em] transition-colors border flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isFormValid ? "var(--signal-navy, #3b82f6)" : "transparent",
                borderColor: isFormValid ? "var(--signal-navy, #3b82f6)" : "var(--line-200, #333)",
                color: isFormValid ? "#FAFAF9" : "var(--ink-950, #fff)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting to Stripe...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Stripe Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-2.5 text-[11px] font-mono uppercase tracking-[0.08em] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
