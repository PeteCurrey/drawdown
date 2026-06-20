"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";

export function Footer() {
  const { region } = useRegion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to subscribe.");
    }
  };

  return (
    <footer className="bg-white border-t border-mkt-bd py-16 md:py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Four Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand + Tagline + Newsletter */}
          <div className="space-y-8">
            <Link 
              href={region === "uk" ? "/" : `/${region}`} 
              className="text-xl font-sans font-extrabold tracking-[-0.04em] text-mkt-ink block"
            >
              Drawdown<span className="text-mkt-grn">.</span>
            </Link>
            <p className="text-xs text-mkt-i3 leading-relaxed font-sans">
              Trading education for people who want to learn properly. No shortcuts. Just edge. Join our mailing list for weekly market intel.
            </p>
            
            <form onSubmit={handleSubmit} className="relative max-w-sm">
              <input 
                type="email" 
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="w-full bg-[#F7F7F7] border border-mkt-bd focus:border-mkt-bds p-3.5 pr-12 text-[10px] font-mono uppercase tracking-widest outline-none transition-colors rounded-lg"
              />
              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="absolute right-2 top-2 bottom-2 px-3 bg-mkt-ink text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 rounded-md flex items-center justify-center"
              >
                {status === "loading" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
              {message && (
                <p className={cn(
                  "absolute top-full mt-1.5 text-[9px] font-mono uppercase tracking-widest",
                  status === "error" ? "text-mkt-red" : "text-mkt-grn"
                )}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-mkt-ink mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-xs text-mkt-i3 font-sans">
              <li><Link href={`${regionPrefix}/courses`} className="hover:text-mkt-ink transition-colors">Curriculum</Link></li>
              <li><Link href={`${regionPrefix}/markets`} className="hover:text-mkt-ink transition-colors">Markets Hub</Link></li>
              <li><Link href={`${regionPrefix}/brokers`} className="hover:text-mkt-ink transition-colors font-bold text-mkt-grn">Broker Guide</Link></li>
              <li><Link href={`${regionPrefix}/tools/tradingview`} className="hover:text-mkt-ink transition-colors">TradingView Review</Link></li>
              <li><Link href={`${regionPrefix}/pricing`} className="hover:text-mkt-ink transition-colors">Pricing</Link></li>
              <li><Link href={`${regionPrefix}/blog`} className="hover:text-mkt-ink transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-mkt-ink mb-6">
              Learn
            </h4>
            <ul className="space-y-4 text-xs text-mkt-i3 font-sans">
              <li><Link href={`${regionPrefix}/learn-to-trade/day-trading`} className="hover:text-mkt-ink transition-colors">Day Trading</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade/forex-trading`} className="hover:text-mkt-ink transition-colors">Forex Mastery</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade/risk-management`} className="hover:text-mkt-ink transition-colors">Risk Mgmt</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade`} className="hover:text-mkt-ink transition-colors font-bold text-mkt-grn">Educational Hub</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-mkt-ink mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-xs text-mkt-i3 font-sans">
              <li><Link href="/about" className="hover:text-mkt-ink transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-mkt-ink transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-mkt-ink transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-mkt-ink transition-colors underline decoration-neutral-200 underline-offset-4">Risk Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip: copyright left, risk warning right */}
        <div className="border-t border-mkt-bd pt-8 flex flex-col lg:flex-row justify-between items-start gap-8">
          
          {/* Copyright & Clean Text-Only Region Links */}
          <div className="space-y-4 shrink-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
              © 2026 Drawdown Trading. All rights reserved. · Drawdown Trading Ltd, Chesterfield, Derbyshire, UK
            </p>
            
            {/* Region links without flags */}
            <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-widest text-mkt-i4">
              <span className="border-r border-mkt-bd pr-4 text-neutral-400 select-none">Market Region</span>
              {[
                { id: "uk", label: "UK", href: "/" },
                { id: "au", label: "AU", href: "/au" },
                { id: "us", label: "US", href: "/us" },
                { id: "sg", label: "SG", href: "/sg" },
                { id: "hk", label: "HK", href: "/hk" },
              ].map((reg) => (
                <Link 
                  key={reg.id}
                  href={reg.href}
                  className={cn(
                    "hover:text-mkt-ink transition-colors",
                    (region === reg.id || (region === "uk" && reg.id === "uk")) ? "text-mkt-ink font-bold" : ""
                  )}
                >
                  {reg.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Risk Warning on Right */}
          <div className="space-y-3 max-w-3xl lg:text-right font-sans">
            <p className="text-[9px] text-mkt-i4 leading-relaxed">
              <span className="font-bold text-mkt-i3 block mb-0.5">Risk Warning:</span>
              Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment. You should not invest money that you cannot afford to lose. Past performance is not indicative of future results.
            </p>
            <p className="text-[9px] text-mkt-i4 leading-relaxed">
              <span className="font-bold text-mkt-i3 block mb-0.5">Not Financial Advice:</span>
              Drawdown is a trading education platform. We do not provide personalised financial advice, investment recommendations, or portfolio management services. All content is for educational purposes only. You should seek independent financial advice before making any investment decisions.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
