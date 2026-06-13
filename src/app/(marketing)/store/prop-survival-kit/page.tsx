"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, Download, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function PropSurvivalKitPage() {
  const [includeBump, setIncludeBump] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "prop-survival-kit", includeBump }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col" data-theme="dark" style={{ backgroundColor: "#08090D", color: "#E4E2DD" }}>
      {/* Direct Response Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border-slate/50" style={{ backgroundColor: "#08090D" }}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="max-w-2xl space-y-8">
               <div className="flex items-center gap-3 text-accent">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">DIGITAL DOWNLOAD • INSTANT ACCESS</span>
               </div>
               
               <h1 className="  font-sans font-extrabold uppercase tracking-tight leading-[0.95] text-text-primary">
                 The Architecture of a <br />
                 <span className="text-text-secondary">Passed Challenge.</span>
               </h1>
               
               <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
                 Most traders blow their accounts on day three due to mathematical ignorance. Get the exact risk-sizing sheets, daily routines, and drawdown recovery models required to secure funding.
               </p>

               <div className="pt-4">
                  <button className="w-full md:w-auto px-12 py-5 bg-accent text-[#08090D] font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
                     <Download className="w-5 h-5" /> Download The Kit — £14
                  </button>
                  <p className="mt-4 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 flex items-center gap-2">
                     <Lock className="w-3 h-3" /> Secure Checkout via Stripe
                  </p>
               </div>
             </div>

             {/* Hero Visual Mockup */}
             <div className="relative border border-border-slate/50 bg-background-surface/40 backdrop-blur-md p-2 shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.1)] hover:-translate-y-1">
                <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-background-primary opacity-20 blur-xl" />
                <div className="relative bg-background-elevated/40 backdrop-blur-md p-8 aspect-square flex flex-col items-center justify-center text-center border border-border-slate/50">
                   <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
                   <h3 className="text-2xl font-sans font-black uppercase mb-4 text-text-primary">Stop Donating Evaluation Fees.</h3>
                   <p className="text-text-secondary text-sm">You are trading against a math formula designed to make you fail. It's time to use our math to beat theirs.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Agitation Section */}
      <section className="py-24 border-b border-border-slate/50 bg-background-primary relative">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-accent-rgb),0.05)_0%,transparent_70%)] pointer-events-none" />
         <div className="max-w-7xl mx-auto px-6 max-w-4xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase leading-tight mb-8 text-text-primary">
               Another $500 fee gone. <br />
               <span className="text-text-tertiary">Another revenge trade spiral.</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-6 text-left md:text-center">
               The prop firms are banking on your lack of structure. They know that after one bad loss, you will over-leverage to "make it back" and violate the daily drawdown limit. They rely on your emotional tilt to keep their business model highly profitable.
            </p>
            <p className="text-lg text-text-primary font-bold leading-relaxed text-left md:text-center">
               You don't need a better strategy. You need a better defense.
            </p>
         </div>
      </section>

      {/* What's Inside Grid */}
      <section className="py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-16 text-center">
               <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
                 // THE ARSENAL
               </span>
               <h2 className="text-4xl font-sans font-bold uppercase text-text-primary">
                 What You Get Instantly.
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               <div className="p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md hover:border-accent/30 hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.1)] hover:-translate-y-1 transition-all duration-300">
                  <div className="text-accent mb-6 font-sans font-black text-4xl">01</div>
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-text-primary">The Max-Drawdown Calculator</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                     A plug-and-play Google Sheet that calculates your exact lot size based on your current equity and the firm's specific trailing drawdown rules. Never accidentally breach a limit again.
                  </p>
                  <ul className="space-y-2">
                     <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        <CheckCircle2 className="w-3 h-3 text-profit" /> FTMO Logic Included
                     </li>
                     <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        <CheckCircle2 className="w-3 h-3 text-profit" /> The5%ers Logic Included
                     </li>
                  </ul>
               </div>

               <div className="p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md hover:border-accent/30 hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.1)] hover:-translate-y-1 transition-all duration-300">
                  <div className="text-accent mb-6 font-sans font-black text-4xl">02</div>
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-text-primary">30-Day Evaluation Checklist</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                     A daily protocol to follow before you execute a single trade. It forces you to check news events, verify your bias, and confirm your risk parameters.
                  </p>
                  <ul className="space-y-2">
                     <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        <CheckCircle2 className="w-3 h-3 text-profit" /> Pre-Market Routine
                     </li>
                     <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        <CheckCircle2 className="w-3 h-3 text-profit" /> End-of-Day Debrief
                     </li>
                  </ul>
               </div>

               <div className="p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md hover:border-accent/30 hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.1)] hover:-translate-y-1 transition-all duration-300">
                  <div className="text-accent mb-6 font-sans font-black text-4xl">03</div>
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-text-primary">"The Tilt Protocol"</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                     The exact psychological framework our desk uses to stop a drawdown spiral. Step-by-step instructions on what to do immediately after a loss to prevent emotional contagion.
                  </p>
                  <ul className="space-y-2">
                     <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        <CheckCircle2 className="w-3 h-3 text-profit" /> Hard-Stop Rules
                     </li>
                     <li className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        <CheckCircle2 className="w-3 h-3 text-profit" /> Recovery Math
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Checkout Section & Guarantee */}
      <section className="py-24 border-t border-border-slate/50 relative bg-background-primary">
         <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter leading-none mb-8 text-text-primary">
               Secure Your Edge.
            </h2>
            
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-8 mb-8 text-left shadow-[0_0_40px_rgba(0,0,0,0.3)]">
               <div className="flex justify-between items-center mb-6 pb-6 border-b border-border-slate/50">
                  <div>
                     <h4 className="text-lg font-bold uppercase text-text-primary">Prop Challenge Survival Kit</h4>
                     <p className="text-xs text-text-secondary">Digital PDF & Google Sheets Templates</p>
                  </div>
                  <div className="text-2xl font-sans font-black text-text-primary">£14</div>
               </div>

               {/* Bump Offer */}
               <label className="bg-accent/10 border border-accent/30 p-6 flex gap-4 items-start cursor-pointer hover:bg-accent/20 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={includeBump}
                    onChange={(e) => setIncludeBump(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-accent"
                  />
                  <div>
                     <p className="text-sm font-bold uppercase text-accent flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Add 30 Days of Drawdown Edge
                     </p>
                     <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Yes! Give me 30 days full access to the AI Trade Journal and Market Scanner to execute my challenge flawlessly. (Normally £29/mo, add today for just £19).
                     </p>
                  </div>
               </label>
            </div>

            <button
               onClick={handleCheckout}
               disabled={loading}
               className="w-full py-6 bg-accent text-[#08090D] font-sans font-black uppercase tracking-[0.2em] text-lg hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20 disabled:opacity-60"
            >
               {loading ? "Redirecting to Checkout..." : `Complete Purchase — £${includeBump ? '33' : '14'}`}
            </button>
            
            <p className="mt-8 text-xs text-text-tertiary leading-relaxed">
               <strong className="text-text-primary">100% No-BS 14-Day Guarantee.</strong> If you apply these frameworks and still feel unprepared for your challenge, email us. We will refund your £14 immediately. No questions asked.
            </p>
         </div>
      </section>
    </div>
  );
}
