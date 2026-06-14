"use client";

import React, { useState } from "react";
import { Calculator, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { cn } from "@/lib/utils";

export default function PropFirmMaximumLossCalculatorPage() {
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [maxLimitPercent, setMaxLimitPercent] = useState<number>(10);
  const [currentEquity, setCurrentEquity] = useState<number>(98000);

  const allowedMaxLoss = (accountSize * maxLimitPercent) / 100;
  const maxLossFloor = accountSize - allowedMaxLoss;
  const distanceToBreach = currentEquity - maxLossFloor;
  const percentToBreach = accountSize > 0 ? (distanceToBreach / accountSize) * 100 : 0;

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 text-mkt-ink">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Prop Firm Maximum Loss", href: "/calculators/prop-firm-maximum-loss" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Prop Trading</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Prop Firm Max Loss <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-mkt-i2 leading-relaxed">
            Calculate your total maximum drawdown boundaries and check your remaining capital buffers.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-mkt-bd bg-white space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Initial Account Size ($)</label>
              <input 
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-mkt-i4">Max Drawdown Limit</span>
                <span className="text-accent font-bold">{maxLimitPercent}%</span>
              </div>
              <input 
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={maxLimitPercent}
                onChange={(e) => setMaxLimitPercent(Number(e.target.value))}
                className="w-full h-1 bg-[#F7F7F7] accent-accent appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Current Account Equity ($)</label>
              <input 
                type="number"
                value={currentEquity}
                onChange={(e) => setCurrentEquity(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Allowed Total Loss</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-red-500">${allowedMaxLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">MAX LOSS THRESHOLD</p>
                </div>
              </div>

              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Max Loss Floor</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-accent">${maxLossFloor.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">ABSOLUTE ACCOUNT LIMIT</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
              <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Distance to Breach</span>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <p className={cn(
                    "text-3xl font-sans font-black",
                    distanceToBreach <= 2000 ? "text-red-500" : "text-mkt-grn"
                  )}>
                    ${distanceToBreach.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">SAFETY BALANCE BUFFER</p>
                </div>
                <span className="text-xs font-mono font-bold text-accent">{percentToBreach.toFixed(2)}% buffer</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-slate max-w-none text-mkt-i2 leading-relaxed mb-20 space-y-8 border-t border-mkt-bd/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-mkt-ink">Understanding Maximum Drawdown in Prop Firms</h2>
          <p>
            Maximum drawdown (often called the Max Loss Limit) is the overall loss threshold set by prop firms to cap their downside on funded accounts. It defines the point at which your account is closed and your challenge is failed.
          </p>

          <h3 className="text-xl font-bold uppercase text-mkt-ink">Static vs. Trailing Drawdown</h3>
          <p>
            Firms implement maximum loss limits in two different ways:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Static Max Loss (e.g. FTMO):</strong> The limit is fixed relative to your starting account size. For a $100k account with a 10% limit, your account floor is always $90,000, regardless of how high your balance grows.</li>
            <li><strong>Trailing Max Loss (e.g. Apex):</strong> The limit trails your highest achieved balance or equity peak. For a $100k account with a $3,000 trailing limit, if your account grows to $105,000, your loss floor trails up to $102,000. It never moves back down.</li>
          </ul>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="comparison-sheet" 
          title="Download the Prop Firm Comparison Sheet Excel Matrix"
          description="Directly compare maximum drawdown rules, trailing boundaries, and challenge structures across the top prop firms in the industry."
        />
      </div>
    </div>
  );
}
