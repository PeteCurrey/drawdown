"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import Link from "next/link";

export function PropSurvivalFloatingWidget() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("prop-survival-widget-dismissed");
    if (!isDismissed) {
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

  if (!visible) return null;

  return (
    <div className="fixed z-50 bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-[340px] bg-[#111111] border border-[#C8F135]/20 p-4 md:p-5 shadow-[0_20px_50px_rgba(200,241,53,0.08)] rounded-2xl animate-in slide-in-from-bottom-5 duration-500 text-white font-sans overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8F135]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <span className="bg-[#C8F135]/10 border border-[#C8F135]/20 text-[#C8F135] text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wider">
          Free Download
        </span>
        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Info */}
      <Link href="/store/prop-survival-kit#get-kit-section" className="flex items-start gap-3 hover:opacity-95 transition-opacity block group relative z-10">
        <div className="w-10 h-10 bg-[#C8F135]/10 rounded-xl border border-[#C8F135]/20 flex items-center justify-center text-[#C8F135] shrink-0 shadow-sm">
          <Download className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-sans font-bold uppercase text-white tracking-tight group-hover:text-[#C8F135] transition-colors">
            Prop Firm Survival Kit
          </h4>
          <p className="text-[11px] text-white/50 leading-normal">
            Max-Drawdown calculator sheets, evaluation checklists & Pete's Tilt Protocol.
          </p>
        </div>
      </Link>

      {/* CTA */}
      <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10 relative z-10">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">No payment required</span>
          <span className="text-lg font-sans font-black text-[#C8F135]">FREE</span>
        </div>

        <Link
          href="/store/prop-survival-kit#get-kit-section"
          className="px-5 py-2.5 bg-[#C8F135] hover:bg-[#d4ff3a] text-black font-mono font-bold uppercase tracking-widest text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          Get Kit
        </Link>
      </div>
    </div>
  );
}
