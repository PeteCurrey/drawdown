"use client";

import React, { useState } from "react";
import { DollarSign, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";

export default function PipValueCalculatorPage() {
  const [currency, setCurrency] = useState<string>("USD");
  const [asset, setAsset] = useState<string>("EURUSD");
  const [lots, setLots] = useState<number>(1);

  // Quick mock conversion rates for local calculator logic
  // GBPUSD = 1.25, EURUSD = 1.08, AUDUSD = 0.66, USDJPY = 155
  const getPipValue = () => {
    let valueInUSD = 10; // Default for standard EURUSD lot

    if (asset === "EURUSD" || asset === "GBPUSD" || asset === "AUDUSD") {
      valueInUSD = 10 * lots;
    } else if (asset === "USDJPY") {
      valueInUSD = (1000 / 155) * lots; // approx $6.45 per lot
    } else if (asset === "XAUUSD") {
      valueInUSD = 10 * lots; // $10 per pip (0.10 change in gold price)
    } else if (asset === "BTCUSD") {
      valueInUSD = 1 * lots; // $1 per lot for $1 change
    }

    if (currency === "USD") return valueInUSD;
    if (currency === "GBP") return valueInUSD / 1.25;
    if (currency === "EUR") return valueInUSD / 1.08;
    if (currency === "AUD") return valueInUSD / 0.66;
    return valueInUSD;
  };

  const pipValueResult = getPipValue();

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Pip Value", href: "/calculators/pip-value" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Execution Specs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Pip Value <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Convert pips to absolute cash values in your local currency across forex pairs, metals, and index contracts.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-xs font-mono outline-none focus:border-accent"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Currency Pair / Asset</label>
              <select 
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-xs font-mono outline-none focus:border-accent"
              >
                <option value="EURUSD">EUR/USD (Euro / US Dollar)</option>
                <option value="GBPUSD">GBP/USD (Pound / US Dollar)</option>
                <option value="AUDUSD">AUD/USD (Australian / US Dollar)</option>
                <option value="USDJPY">USD/JPY (US Dollar / Japanese Yen)</option>
                <option value="XAUUSD">XAU/USD (Gold / US Dollar)</option>
                <option value="BTCUSD">BTC/USD (Bitcoin / US Dollar)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Position size (Lots)</label>
              <input 
                type="number"
                step="0.01"
                value={lots}
                onChange={(e) => setLots(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="p-8 border border-border-slate/50 bg-background-primary/30 hover:border-accent transition-colors flex flex-col justify-between h-full">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Pip Value</span>
              <div className="mt-8">
                <p className="text-4xl font-sans font-black text-accent">
                  {currency === "USD" && "$"}
                  {currency === "GBP" && "£"}
                  {currency === "EUR" && "€"}
                  {currency === "AUD" && "A$"}
                  {pipValueResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">PER SINGLE PIP MOVEMENT ON {lots} LOTS</p>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Contract Size Warning</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                  Contract sizes vary between standard currency pairs (100k units), indices (typically $1 or $10 per point), and crypto. Always check your broker's terminal specs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-20 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">Understanding Pip Values in Trading</h2>
          <p>
            A "pip" (percentage in point) is the smallest price move that a given exchange rate can make. For most currency pairs, this is equivalent to 1/100 of 1%, or the fourth decimal place (0.0001). For Yen-based pairs, a pip is the second decimal place (0.01).
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">The Value Computation</h3>
          <p>
            The value of a pip is determined by the size of your trade (lots) and the currency denomination of your account. If you trade a pair where the quote currency matches your account currency, the pip value is fixed (e.g. $10 per standard lot on EUR/USD in a USD account). If the quote currency differs, the pip value must be converted using the current exchange rate.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="risk-guide" 
          title="Download the Complete Risk Management Guide PDF"
          description="Access Pete Currey's advanced mathematical models for portfolio safety and drawdowns."
        />
      </div>
    </div>
  );
}
