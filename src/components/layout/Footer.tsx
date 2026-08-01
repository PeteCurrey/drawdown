"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";

export function Footer() {
  const { region } = useRegion();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  const normalizedPathname = pathname ? pathname.replace(/^\/(au|us|sg|hk)/, "") : "";
  const isDarkMarketPage = (
    normalizedPathname === "/markets" || 
    (normalizedPathname.startsWith("/markets/") &&
     !normalizedPathname.startsWith("/markets/analysis") &&
     !normalizedPathname.startsWith("/markets/pulse")) ||
    normalizedPathname === "/blog/coffeezilla-alexg-trading-education" ||
    normalizedPathname === "/blog/why-trading-gurus-use-demo-accounts" ||
    normalizedPathname === "/blog/trading-education-business-model" ||
    normalizedPathname === "/store/prop-survival-kit" ||
    normalizedPathname === "/compare" ||
    normalizedPathname === "/prop-firms/compare" ||
    normalizedPathname === "/brokers/all"
  );

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
    <footer className={cn(
      "py-16 md:py-24 select-none relative z-10 border-t",
      isDarkMarketPage ? "bg-slate-950 border-white/5 text-white" : "bg-white border-mkt-bd"
    )}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Five Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Column 1: Brand + Tagline + Newsletter */}
          <div className="space-y-8">
            <Link 
              href={region === "uk" ? "/" : `/${region}`} 
              className={cn(
                "text-xl font-sans font-extrabold tracking-[-0.04em] block",
                isDarkMarketPage ? "text-white" : "text-mkt-ink"
              )}
            >
              Drawdown<span className={isDarkMarketPage ? "text-indigo-500" : "text-mkt-grn"}>.</span>
            </Link>
            <p className={cn(
              "text-xs leading-relaxed font-sans",
              isDarkMarketPage ? "text-slate-400" : "text-mkt-i3"
            )}>
              Trading education for people who want to learn properly. No shortcuts. Just edge. Join our mailing list for weekly market intel.
            </p>
            
            <form onSubmit={handleSubmit} className="relative max-w-sm">
              <input 
                type="email" 
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className={cn(
                  "w-full border p-3.5 pr-12 text-[10px] font-mono uppercase tracking-widest outline-none transition-colors rounded-lg",
                  isDarkMarketPage 
                    ? "bg-slate-900 border-slate-800 focus:border-indigo-500 text-white placeholder-slate-500" 
                    : "bg-[#F7F7F7] border-mkt-bd focus:border-mkt-bds text-mkt-ink"
                )}
              />
              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={cn(
                  "absolute right-2 top-2 bottom-2 px-3 text-white transition-colors disabled:opacity-50 rounded-md flex items-center justify-center",
                  isDarkMarketPage ? "bg-indigo-600 hover:bg-indigo-500" : "bg-mkt-ink hover:bg-neutral-800"
                )}
              >
                {status === "loading" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className={cn("w-3.5 h-3.5", isDarkMarketPage ? "text-indigo-400" : "text-mkt-grn")} />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
              {message && (
                <p className={cn(
                  "absolute top-full mt-1.5 text-[9px] font-mono uppercase tracking-widest",
                  status === "error" ? "text-mkt-red" : (isDarkMarketPage ? "text-indigo-400" : "text-mkt-grn")
                )}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className={cn(
              "text-[11px] font-sans font-bold uppercase tracking-widest mb-6",
              isDarkMarketPage ? "text-slate-300" : "text-mkt-ink"
            )}>
              Platform
            </h4>
            <ul className={cn(
              "space-y-4 text-xs font-sans",
              isDarkMarketPage ? "text-slate-400" : "text-mkt-i3"
            )}>
              <li><Link href={`${regionPrefix}/courses`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Curriculum</Link></li>
              <li><Link href={`${regionPrefix}/markets`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Markets Hub</Link></li>
              <li><Link href={`${regionPrefix}/brokers`} className={cn("transition-colors font-bold", isDarkMarketPage ? "text-indigo-400 hover:text-indigo-300" : "text-mkt-grn hover:text-mkt-ink")}>Broker Guide</Link></li>
              <li><Link href={`${regionPrefix}/tools/tradingview`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>TradingView Review</Link></li>
              <li><Link href={`${regionPrefix}/pricing`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Pricing</Link></li>
              <li><Link href={`${regionPrefix}/blog`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className={cn(
              "text-[11px] font-sans font-bold uppercase tracking-widest mb-6",
              isDarkMarketPage ? "text-slate-300" : "text-mkt-ink"
            )}>
              Learn
            </h4>
            <ul className={cn(
              "space-y-4 text-xs font-sans",
              isDarkMarketPage ? "text-slate-400" : "text-mkt-i3"
            )}>
              <li><Link href={`${regionPrefix}/learn-to-trade/day-trading`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Day Trading</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade/forex-trading`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Forex Mastery</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade/risk-management`} className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Risk Mgmt</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade`} className={cn("transition-colors font-bold", isDarkMarketPage ? "text-indigo-400 hover:text-indigo-300" : "text-mkt-grn hover:text-mkt-ink")}>Educational Hub</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className={cn(
              "text-[11px] font-sans font-bold uppercase tracking-widest mb-6",
              isDarkMarketPage ? "text-slate-300" : "text-mkt-ink"
            )}>
              Resources
            </h4>
            <ul className={cn(
              "space-y-4 text-xs font-sans",
              isDarkMarketPage ? "text-slate-400" : "text-mkt-i3"
            )}>
              <li><Link href="/basic" className={cn("transition-colors font-bold", isDarkMarketPage ? "text-indigo-400 hover:text-indigo-300" : "text-mkt-grn hover:text-mkt-ink")}>Trading Basics</Link></li>
              <li><Link href="/glossary" className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Glossary</Link></li>
              <li><Link href="/how-to" className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>How-To Guides</Link></li>
              <li><Link href="/compare" className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Compare</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h4 className={cn(
              "text-[11px] font-sans font-bold uppercase tracking-widest mb-6",
              isDarkMarketPage ? "text-slate-300" : "text-mkt-ink"
            )}>
              Company
            </h4>
            <ul className={cn(
              "space-y-4 text-xs font-sans",
              isDarkMarketPage ? "text-slate-400" : "text-mkt-i3"
            )}>
              <li><Link href="/about" className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>About Us</Link></li>
              <li><Link href="/contact" className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Contact</Link></li>
              <li><Link href="/privacy" className={isDarkMarketPage ? "hover:text-white transition-colors" : "hover:text-mkt-ink transition-colors"}>Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className={cn("transition-colors underline underline-offset-4", isDarkMarketPage ? "hover:text-white decoration-slate-700" : "hover:text-mkt-ink decoration-neutral-200")}>Risk Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip: copyright left, risk warning right */}
        <div className={cn(
          "border-t pt-8 flex flex-col lg:flex-row justify-between items-start gap-8",
          isDarkMarketPage ? "border-slate-800" : "border-mkt-bd"
        )}>
          
          {/* Copyright & Clean Text-Only Region Links */}
          <div className="space-y-4 shrink-0">
            <p className={cn(
              "text-[10px] font-mono uppercase tracking-widest",
              isDarkMarketPage ? "text-slate-500" : "text-mkt-i3"
            )}>
              © 2026 Drawdown Trading. All rights reserved. · Drawdown Trading Ltd, Chesterfield, Derbyshire, UK
            </p>
            
            {/* Region links without flags */}
            <div className={cn(
              "flex items-center gap-4 text-[9px] font-mono uppercase tracking-widest",
              isDarkMarketPage ? "text-slate-500" : "text-mkt-i4"
            )}>
              <span className={cn(
                "border-r pr-4 select-none",
                isDarkMarketPage ? "border-slate-700 text-slate-600" : "border-mkt-bd text-neutral-400"
              )}>Market Region</span>
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
                    "transition-colors",
                    isDarkMarketPage ? "hover:text-white" : "hover:text-mkt-ink",
                    (region === reg.id || (region === "uk" && reg.id === "uk")) 
                      ? (isDarkMarketPage ? "text-white font-bold" : "text-mkt-ink font-bold") 
                      : ""
                  )}
                >
                  {reg.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Risk Warning on Right */}
          <div className="space-y-3 max-w-3xl lg:text-right font-sans">
            <p className={cn("text-[9px] leading-relaxed", isDarkMarketPage ? "text-slate-500" : "text-mkt-i4")}>
              <span className={cn("font-bold block mb-0.5", isDarkMarketPage ? "text-slate-400" : "text-mkt-i3")}>Risk Warning:</span>
              Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment. You should not invest money that you cannot afford to lose. Past performance is not indicative of future results.
            </p>
            <p className={cn("text-[9px] leading-relaxed", isDarkMarketPage ? "text-slate-500" : "text-mkt-i4")}>
              <span className={cn("font-bold block mb-0.5", isDarkMarketPage ? "text-slate-400" : "text-mkt-i3")}>Not Financial Advice:</span>
              Drawdown is a trading education platform. We do not provide personalised financial advice, investment recommendations, or portfolio management services. All content is for educational purposes only. You should seek independent financial advice before making any investment decisions.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
