"use client";

import React, { useState } from "react";
import { Percent, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";

export default function PositionSizeCalculatorPage() {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [pipValue, setPipValue] = useState<number>(10); // Standard lot pip value in currency

  const cashRisk = (balance * riskPercent) / 100;
  const standardLots = stopLossPips > 0 ? cashRisk / (stopLossPips * pipValue) : 0;
  const units = standardLots * 100000;

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 text-mkt-ink">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Position Size", href: "/calculators/position-size" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Percent className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Position Size <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-mkt-i2 leading-relaxed">
            Determine standard lot sizes, risk thresholds, and capital exposure in real-time. Fits all major asset classes.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-mkt-bd bg-white space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Account Balance</label>
              <input 
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-mkt-i4">Risk Per Trade</span>
                <span className="text-accent font-bold">{riskPercent}%</span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full h-1 bg-[#F7F7F7] accent-accent appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Stop Loss (Pips / Points)</label>
              <input 
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Pip Value per Standard Lot ($)</label>
              <input 
                type="number"
                value={pipValue}
                onChange={(e) => setPipValue(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Cash Risk</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-red-500">${cashRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">TOTAL EXPOSURE AT RISK</p>
                </div>
              </div>

              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Recommended Lot Size</span>
                <div className="mt-8">
                  <p className="text-3xl font-sans font-black text-accent">{standardLots.toFixed(2)} Lots</p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">{units.toLocaleString(undefined, { maximumFractionDigits: 0 })} UNITS OF BASE ASSET</p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-mkt-ink">Sizing Precaution</h4>
                <p className="text-[11px] text-mkt-i2 leading-relaxed mt-1">
                  Position sizing rules assume standard pip valuations (e.g. $10 per pip on EUR/USD standard lot). Always verify your broker's exact contract size parameters before opening a trade.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-slate max-w-none text-mkt-i2 leading-relaxed mb-20 space-y-8 border-t border-mkt-bd/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-mkt-ink">How to Calculate Position Sizes in Trading</h2>
          <p>
            Correct position sizing is the single most important aspect of risk management. Without it, you are effectively gambling. Even if your strategy has a high win rate, a few oversized trades during a losing streak can wipe out weeks of profits or result in a margin call.
          </p>

          <h3 className="text-xl font-bold uppercase text-mkt-ink">The Sizing Formula</h3>
          <p>
            To compute your optimal position size manually, use the following formula:
          </p>
          <div className="bg-[#F7F7F7] p-6 border border-mkt-bd font-mono text-xs overflow-x-auto text-mkt-ink">
            Position Size (Lots) = Cash Risk Amount / (Stop Loss in Pips × Pip Value per Lot)
          </div>

          <h3 className="text-xl font-bold uppercase text-mkt-ink">Key Variables Explained:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Balance:</strong> The total equity in your trading account.</li>
            <li><strong>Risk Percentage:</strong> The maximum percentage of your account you are willing to lose on a single trade (typically 1% to 2%).</li>
            <li><strong>Stop Loss distance:</strong> The amount of space between your entry price and your invalidation point, measured in pips or points.</li>
            <li><strong>Pip Value:</strong> The monetary value of one pip movement for a standard contract size. For major forex pairs on standard accounts, this is typically $10.</li>
          </ul>
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
