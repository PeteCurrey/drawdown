"use client";

import { useState, useEffect } from "react";
import { X, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRegion } from "@/components/layout/RegionalLayout";

export function PropSurvivalFloatingWidget() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { region, currencySymbol } = useRegion();

  useEffect(() => {
    // Check if user dismissed the widget in this session
    const isDismissed = sessionStorage.getItem("prop-survival-widget-dismissed");
    if (!isDismissed) {
      // Small delay for entrance animation feel
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    sessionStorage.setItem("prop-survival-widget-dismissed", "true");
  };

  const handleQuickCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "prop-survival-kit", includeBump: false, region }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed z-50 bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-[340px] bg-slate-950 border border-indigo-500/30 p-4 md:p-5 shadow-[0_20px_50px_rgba(79,70,229,0.15)] rounded-2xl animate-in slide-in-from-bottom-5 duration-500 text-white font-sans overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none mix-blend-screen" />
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wider">
          Limited Deal
        </span>
        <button 
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss offer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Info */}
      <Link href="/store/prop-survival-kit" className="flex items-start gap-3 hover:opacity-95 transition-opacity block group relative z-10">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-sans font-bold uppercase text-white tracking-tight group-hover:text-indigo-300 transition-colors">
            Prop Firm Survival Kit
          </h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Max-Drawdown calculator sheets, evaluation checklists & Pete's Tilt Protocol.
          </p>
        </div>
      </Link>

      {/* Pricing & CTA */}
      <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10 relative z-10">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">BLUEPRINT COST</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-sans font-black text-white">{currencySymbol}49</span>
            <span className="text-[9px] text-slate-500 line-through">{currencySymbol}149</span>
          </div>
        </div>

        <button
          onClick={handleQuickCheckout}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono font-bold uppercase tracking-widest text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Securing...
            </>
          ) : (
            <>
              Buy Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
