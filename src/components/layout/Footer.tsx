"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
    <footer className="bg-background-primary border-t border-border-slate py-12 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="text-xl font-display font-extrabold tracking-widest uppercase">
              Drawdown
            </Link>
            <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
              Trading education for people who want to learn properly. No shortcuts. Just edge. Join our mailing list for weekly market intel.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md relative group">
              <input 
                type="email" 
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-background-elevated border border-border-slate focus:border-accent p-4 text-xs font-mono uppercase tracking-widest outline-none transition-colors"
              />
              <button 
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-2 top-2 bottom-2 px-4 bg-accent text-background-primary hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
              {message && (
                <p className={cn(
                  "absolute top-full mt-2 text-[10px] font-mono uppercase tracking-widest",
                  status === 'error' ? "text-loss" : "text-profit"
                )}>
                  {message}
                </p>
              )}
            </form>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="/courses" className="hover:text-accent transition-colors">Curriculum</Link></li>
              <li><Link href="/tools" className="hover:text-accent transition-colors">AI Tools</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Learn</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="/learn-to-trade/day-trading" className="hover:text-accent transition-colors">Day Trading</Link></li>
              <li><Link href="/learn-to-trade/forex-trading" className="hover:text-accent transition-colors">Forex Mastery</Link></li>
              <li><Link href="/learn-to-trade/risk-management" className="hover:text-accent transition-colors">Risk Mgmt</Link></li>
              <li><Link href="/learn-to-trade/trading-psychology" className="hover:text-accent transition-colors">Psychology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-accent transition-colors underline decoration-loss/50 underline-offset-4">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="space-y-8 border-t border-border-slate pt-8">
          <div className="space-y-4">
            <p className="text-[10px] md:text-xs text-text-tertiary font-mono leading-relaxed">
              <span className="text-warning font-bold uppercase block mb-1">Risk Warning:</span>
              Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment. You should not invest money that you cannot afford to lose. Past performance is not indicative of future results.
            </p>
            <p className="text-[10px] md:text-xs text-text-tertiary font-mono leading-relaxed">
              <span className="text-text-secondary font-bold uppercase block mb-1">Not Financial Advice:</span>
              Drawdown is a trading education platform. We do not provide personalised financial advice, investment recommendations, or portfolio management services. All content is for educational purposes only. You should seek independent financial advice before making any investment decisions.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            <p>© 2026 DRAWDOWN. TRADE THE TRUTH.</p>
            <p>Built by traders for traders.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
