"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function PipValueCalculator() {
  const [currency, setCurrency] = useState<string>("USD");
  const [asset, setAsset] = useState<string>("EURUSD");
  const [lots, setLots] = useState<number>(1);

  const getPipValue = () => {
    let valueInUSD = 10;

    if (asset === "EURUSD" || asset === "GBPUSD" || asset === "AUDUSD") {
      valueInUSD = 10 * lots;
    } else if (asset === "USDJPY") {
      valueInUSD = (1000 / 155) * lots; // approx $6.45 per standard lot
    } else if (asset === "XAUUSD") {
      valueInUSD = 10 * lots; // $10 per pip ($0.10 move on 100 oz standard lot)
    } else if (asset === "BTCUSD") {
      valueInUSD = 1 * lots;
    }

    if (currency === "USD") return valueInUSD;
    if (currency === "GBP") return valueInUSD / 1.25;
    if (currency === "EUR") return valueInUSD / 1.08;
    if (currency === "AUD") return valueInUSD / 0.66;
    return valueInUSD;
  };

  const pipValueResult = getPipValue();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
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
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Position Size (Lots)</label>
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
            <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">
              MONETARY MOVEMENT PER 1.0 PIP PRICE CHANGE
            </p>
          </div>
        </div>

        <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Fractional Pip (Pipette) Note</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
              Most modern institutional brokers quote 5 decimal places (3 on JPY pairs). The 5th decimal place is a pipette (0.1 of a pip). If price moves from 1.08500 to 1.08505, that is a 0.5 pip move.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
