"use client";

import React, { useState } from "react";
import { Calculator, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { cn } from "@/lib/utils";

export default function PropFirmDailyLossCalculatorPage() {
  const [prevDayClose, setPrevDayClose] = useState<number>(100000);
  const [dailyLimitPercent, setDailyLimitPercent] = useState<number>(5);
  const [currentEquity, setCurrentEquity] = useState<number>(101000);

  const allowedDailyLoss = (prevDayClose * dailyLimitPercent) / 100;
  const dailyLossFloor = prevDayClose - allowedDailyLoss;
  const distanceToBreach = currentEquity - dailyLossFloor;
  const percentToBreach = prevDayClose > 0 ? (distanceToBreach / prevDayClose) * 100 : 0;

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Prop Firm Daily Loss", href: "/calculators/prop-firm-daily-loss" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Prop Trading</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Prop Firm Daily Loss <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Calculate your exact daily drawdown safety buffer based on previous day close values to protect funded accounts.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Previous Day Midnight Close ($)</label>
              <input 
                type="number"
                value={prevDayClose}
                onChange={(e) => setPrevDayClose(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-tertiary">Daily Drawdown Limit</span>
                <span className="text-accent font-bold">{dailyLimitPercent}%</span>
              </div>
              <input 
                type="range"
                min="3"
                max="10"
                step="0.5"
                value={dailyLimitPercent}
                onChange={(e) => setDailyLimitPercent(Number(e.target.value))}
                className="w-full h-1 bg-background-primary accent-accent appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Current Account Equity ($)</label>
              <input 
                type="number"
                value={currentEquity}
                onChange={(e) => setCurrentEquity(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Allowed Daily Loss</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-red-500">${allowedDailyLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">DAILY DRAWDOWN THRESHOLD</p>
                </div>
              </div>

              <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Drawdown Floor</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-accent">${dailyLossFloor.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">MINIMUM ALLOWED EQUITY</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Distance to Breach</span>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <p className={cn(
                    "text-3xl font-sans font-black",
                    distanceToBreach <= 1000 ? "text-red-500" : "text-mkt-grn"
                  )}>
                    ${distanceToBreach.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">SAFETY BALANCE BUFFER</p>
                </div>
                <span className="text-xs font-mono font-bold text-accent">{percentToBreach.toFixed(2)}% buffer</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-20 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">How Prop Firm Daily Loss Limits work</h2>
          <p>
            The daily loss limit is the most common reason traders fail prop firm evaluations like FTMO or The5%ers. It is calculated dynamically based on your previous day's closing balance (typically at midnight CET or EST).
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Dynamic Calculation</h3>
          <p>
            Every day, your daily loss floor is reset using the following equation:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Daily Drawdown Floor = Previous Day Balance/Equity − (Previous Day Balance/Equity × Daily Limit %)
          </div>
          <p>
            <strong>Warning:</strong> Many firms use the higher of previous day's balance or equity as the starting point. If you carry open trades into midnight with floating profits, your daily loss floor is set higher, which can lead to accidental breaches if those profits evaporate during the next day.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="challenge-checklist" 
          title="Download the 30-Day Evaluation Challenge Checklist PDF"
          description="A complete guide to passing prop firm challenges. Includes checklist points on daily loss limits, news schedules, and consistency filters."
        />
      </div>
    </div>
  );
}
