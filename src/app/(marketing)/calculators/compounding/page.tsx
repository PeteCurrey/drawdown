"use client";

import React, { useState } from "react";
import { LineChart, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";

export default function CompoundingCalculatorPage() {
  const [startBalance, setStartBalance] = useState<number>(10000);
  const [periodGain, setPeriodGain] = useState<number>(5);
  const [periods, setPeriods] = useState<number>(12);
  const [reinvestRate, setReinvestRate] = useState<number>(100);

  const compoundMultiplier = 1 + (periodGain * (reinvestRate / 100)) / 100;
  const endingBalance = startBalance * Math.pow(compoundMultiplier, periods);
  const netProfit = endingBalance - startBalance;

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 text-mkt-ink">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Compounding", href: "/calculators/compounding" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <LineChart className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Growth & Profit</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Compounding <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-mkt-i2 leading-relaxed">
            Project your long-term equity growth by compounding trading gains over multiple periods.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-mkt-bd bg-white space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Starting Capital ($)</label>
              <input 
                type="number"
                value={startBalance}
                onChange={(e) => setStartBalance(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Gain Per Period (%)</label>
              <input 
                type="number"
                step="0.5"
                value={periodGain}
                onChange={(e) => setPeriodGain(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Number of Periods (Days/Months)</label>
              <input 
                type="number"
                value={periods}
                onChange={(e) => setPeriods(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-mkt-i4">Reinvestment Rate</span>
                <span className="text-accent font-bold">{reinvestRate}%</span>
              </div>
              <input 
                type="range"
                min="10"
                max="100"
                step="10"
                value={reinvestRate}
                onChange={(e) => setReinvestRate(Number(e.target.value))}
                className="w-full h-1 bg-[#F7F7F7] accent-accent appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Ending Capital</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-accent">${endingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">PROJECTED BALANCES</p>
                </div>
              </div>

              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Net Profits</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-mkt-ink">${netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">TOTAL VALUE ADDED</p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-mkt-ink">Growth Expectancy</h4>
                <p className="text-[11px] text-mkt-i2 leading-relaxed mt-1">
                  Compound interest is the eighth wonder of the world. At this rate, your initial balance will grow by <span className="font-bold text-accent">{((endingBalance/startBalance - 1)*100).toFixed(0)}%</span> across the {periods} compounding periods.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-slate max-w-none text-mkt-i2 leading-relaxed mb-20 space-y-8 border-t border-mkt-bd/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-mkt-ink">The Power of Compounding in Trading</h2>
          <p>
            Compounding means reinvesting your trading profits back into your account balance, which increases the size of your capital base. Because your position sizing scales with your balance, each subsequent win generates a larger dollar profit than the last.
          </p>

          <h3 className="text-xl font-bold uppercase text-mkt-ink">The Mathematical Formula</h3>
          <p>
            To compound capital manually, use the standard compounding growth equation:
          </p>
          <div className="bg-[#F7F7F7] p-6 border border-mkt-bd font-mono text-xs overflow-x-auto text-mkt-ink">
            Ending Capital = Starting Capital × (1 + (Period Gain × Reinvestment Rate)) ^ Periods
          </div>

          <h3 className="text-xl font-bold uppercase text-mkt-ink">Reinvesting vs. Withdrawing</h3>
          <p>
            Traders who withdraw profits regularly (e.g. to fund living costs) miss out on the compounding curve. While withdrawing provides immediate cash, leaving profits in the account allows you to trade larger sizes without risking a higher percentage of your balance.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="journal-template" 
          title="Download the Free Trading Journal Excel Template"
          description="Track your compounded growth daily. Log your trades, monitor win expectancy, and watch your equity curve grow dynamically."
        />
      </div>
    </div>
  );
}
