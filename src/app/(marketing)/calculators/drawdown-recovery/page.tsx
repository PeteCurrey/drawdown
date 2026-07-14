"use client";

import React, { useState } from "react";
import { TrendingUp, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";

export default function DrawdownRecoveryCalculatorPage() {
  const [drawdownPercent, setDrawdownPercent] = useState<number>(20);

  const recoveryPercent = drawdownPercent < 100 ? (1 / (1 - drawdownPercent / 100) - 1) * 100 : 0;

  const recoveryPairs = [
    { loss: 5, gain: 5.3 },
    { loss: 10, gain: 11.1 },
    { loss: 20, gain: 25 },
    { loss: 30, gain: 42.9 },
    { loss: 40, gain: 66.7 },
    { loss: 50, gain: 100 },
    { loss: 60, gain: 150 },
    { loss: 75, gain: 300 },
    { loss: 90, gain: 900 }
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Drawdown Recovery", href: "/calculators/drawdown-recovery" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Drawdown Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Drawdown Recovery <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Calculate the exact percentage gain required to recover your trading account to its previous peak equity.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-tertiary">Account Drawdown Level</span>
                <span className="text-accent font-bold">{drawdownPercent}%</span>
              </div>
              <input 
                type="range"
                min="1"
                max="95"
                step="1"
                value={drawdownPercent}
                onChange={(e) => setDrawdownPercent(Number(e.target.value))}
                className="w-full h-1 bg-background-primary accent-accent appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="p-8 border border-border-slate/50 bg-background-primary/30 hover:border-accent transition-colors flex flex-col justify-between">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Required Growth</span>
              <div className="mt-8">
                <p className="text-4xl font-sans font-black text-accent">{recoveryPercent.toFixed(1)}% Gain</p>
                <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">REQUIRED GAIN TO RETURN TO BREAKEVEN</p>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Asymmetry Warning</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                  Because of mathematical asymmetry, losing 50% of your account balance requires a <span className="font-bold text-accent">100% gain</span> on your remaining capital just to get back to your starting point. Protect your downside first.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="mb-20 space-y-6">
          <h3 className="text-xs font-mono font-black uppercase tracking-widest text-text-primary">// THE ASYMMETRY OF LOSS</h3>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4 text-center">
            {recoveryPairs.map((pair) => (
              <div key={pair.loss} className="p-4 border border-border-slate/50 flex flex-col justify-between bg-background-primary/20">
                <span className="text-[10px] font-mono text-red-500 font-bold">-{pair.loss}%</span>
                <span className="text-[10px] font-mono text-accent font-black mt-2">+{pair.gain}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-20 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">The Mathematics of Capital Drawdown Recovery</h2>
          <p>
            Drawdown recovery is defined by the mathematical reality that a loss of capital decreases the base size of your next trade. If your account size shrinks, you must make a higher percentage return on the remaining capital to replace the money you lost.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Recovery Formula</h3>
          <p>
            The percentage return required to recover from any drawdown is calculated as follows:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Required Recovery (%) = (1 / (1 - Drawdown Level) - 1) × 100
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Why Protecting Capital is Key</h3>
          <p>
            As drawdowns exceed 20%, the required recovery rate begins to scale exponentially. While a 10% drawdown only requires an 11.1% gain to recover, a 50% drawdown requires a 100% gain, and a 90% drawdown requires a massive 900% gain. This asymmetry is the primary reason why professional hedge funds focus heavily on limiting maximum drawdown levels to single digits.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="risk-guide" 
          title="Download Pete's Risk Management PDF Guide"
          description="Learn how to structure stop losses and account allocations so you never face exponential recovery requirements."
        />
      </div>
    </div>
  );
}
