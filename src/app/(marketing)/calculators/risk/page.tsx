"use client";

import React, { useState } from "react";
import { ShieldAlert, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";

export default function RiskCalculatorPage() {
  const [balance, setBalance] = useState<number>(10000);
  const [lots, setLots] = useState<number>(1);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [pipValue, setPipValue] = useState<number>(10);

  const cashRisk = lots * stopLossPips * pipValue;
  const riskPercent = balance > 0 ? (cashRisk / balance) * 100 : 0;
  const survivalOdds = riskPercent > 0 ? Math.floor(100 / riskPercent) : 0;

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Risk Modeler", href: "/calculators/risk" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Risk <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Verify how much absolute capital is at risk on your trade and check your account survival metrics instantly.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Balance ($)</label>
              <input 
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Position Size (Lots)</label>
              <input 
                type="number"
                step="0.01"
                value={lots}
                onChange={(e) => setLots(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Stop Loss (Pips)</label>
              <input 
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Pip Value per Standard Lot ($)</label>
              <input 
                type="number"
                value={pipValue}
                onChange={(e) => setPipValue(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Cash Exposure</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-red-500">${cashRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">TOTAL VALUE EXPOSED</p>
                </div>
              </div>

              <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Risk Percentage</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-accent">{riskPercent.toFixed(2)}%</p>
                  <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">OF TOTAL CAPITAL BALANCE</p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Survival Statistics</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                  At this sizing, you can sustain <span className="font-bold text-accent">{survivalOdds}</span> consecutive losing trades before blowing your entire account balance. Keep risk low to survive drawdowns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-20 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">Understanding Risk Exposure in Live Markets</h2>
          <p>
            While position sizing tells you how much to buy, the risk calculator shows you the absolute capital cost of a trade failing. By knowing exactly how much cash is at risk, you can stay within your personal risk tolerance levels and protect your trading longevity.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">How to Check Capital Risk</h3>
          <p>
            The risk calculator multiplies your trade volume (lots) by the distance to your stop loss and the currency value of each pip:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Cash Risk = Position Size (Lots) × Stop Loss (Pips) × Pip Value
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Why a 1% Limit is Recommended</h3>
          <p>
            Professional traders rarely risk more than 1% to 2% of their account balance per trade. Doing so ensures that even a 10-trade losing streak only draws down the account by roughly 10%, which is relatively easy to recover from. Risking 5% or 10% per trade means you could face account ruin within a single highly volatile trading session.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="risk-guide" 
          title="Download the Complete Risk Management Guide PDF"
          description="Protect your capital from market swings. This manual covers advanced leverage management, position sizing sheets, and prop challenge protocols."
        />
      </div>
    </div>
  );
}
