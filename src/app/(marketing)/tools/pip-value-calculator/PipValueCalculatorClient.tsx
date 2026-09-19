"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { ToolWorkingBox } from "@/components/tools/ToolWorkingBox";
import { ToolFormulaSection } from "@/components/tools/ToolFormulaSection";
import { ToolContextualCTA, ToolDisclaimer } from "@/components/tools/ToolContextualCTA";
import { INSTRUMENTS } from "@/lib/tools/instruments";
import { calculatePipValue } from "@/lib/tools/pip-calc";
import { ArrowRight, Coins, HelpCircle } from "lucide-react";

const CURRENCIES = ["GBP", "USD", "EUR", "AUD", "CAD"];
const LOT_PRESETS = [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0];

export function PipValueCalculatorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPair = searchParams.get("pair") || "EURUSD";
  const initialCurrency = searchParams.get("currency") || "GBP";
  const initialLots = Number(searchParams.get("lots")) || 1.0;

  const [selectedPair, setSelectedPair] = useState<string>(
    INSTRUMENTS[initialPair] ? initialPair : "EURUSD"
  );
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [lots, setLots] = useState<number>(initialLots);

  const instrument = INSTRUMENTS[selectedPair] || INSTRUMENTS.EURUSD;

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("pair", selectedPair);
    params.set("currency", currency);
    params.set("lots", lots.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedPair, currency, lots, router]);

  const result = useMemo(() => {
    return calculatePipValue({
      symbol: selectedPair,
      accountCurrency: currency,
      lots,
    });
  }, [selectedPair, currency, lots]);

  return (
    <div className="w-full min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-[var(--text-primary)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <ToolHeader
          badge="Execution Metric"
          title="Pip Value Calculator"
          subtitle="Determine the exact monetary value of 1 pip across any trade size and account currency. Eliminate guesswork on cross-pairs, gold points, and index ticks."
        />

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Selection */}
          <div
            className="lg:col-span-5 p-6 sm:p-8 border space-y-6"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--surface-raised)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)]">
                Select Pair &amp; Units
              </span>
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                {instrument.category.toUpperCase()}
              </span>
            </div>

            {/* Instrument Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(INSTRUMENTS).slice(0, 8).map((sym) => {
                const inst = INSTRUMENTS[sym];
                const active = selectedPair === sym;
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setSelectedPair(sym)}
                    className="p-2.5 text-left border rounded transition-all text-xs font-mono"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border-subtle)",
                      backgroundColor: active ? "rgba(22,33,62,0.06)" : "var(--surface-base)",
                      color: active ? "var(--accent)" : "var(--text-primary)",
                      fontWeight: active ? "600" : "400",
                    }}
                  >
                    <div>{sym}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)] truncate">
                      {inst.quoteCurrency}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Account Currency */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
                Account Currency
              </label>
              <div className="flex gap-2">
                {CURRENCIES.map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className="flex-1 py-2 text-xs font-mono border rounded transition-colors"
                    style={{
                      borderColor: currency === cur ? "var(--accent)" : "var(--border-subtle)",
                      backgroundColor: currency === cur ? "var(--accent)" : "transparent",
                      color: currency === cur ? "#FFFFFF" : "var(--text-secondary)",
                    }}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Lot Size Input */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Trade Volume (Lots)
                </label>
                <span className="text-base font-bold text-[var(--text-primary)]">
                  {lots.toFixed(2)} Lots
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                value={lots}
                onChange={(e) => setLots(Math.max(0.01, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-sm rounded focus:outline-none focus:border-[var(--accent)]"
              />

              {/* Lot Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {LOT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setLots(p)}
                    className="px-2.5 py-1 text-xs font-mono border border-[var(--border-subtle)] rounded hover:border-[var(--accent)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {p} {p === 1 ? "Std" : p === 0.1 ? "Mini" : p === 0.01 ? "Micro" : "Lot"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Output Matrix */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="p-8 border space-y-6"
              style={{
                borderColor: "rgba(22,33,62,0.12)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(22,33,62,0.10)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] block">
                    Calculated Pip Exposure
                  </span>
                  <div className="text-sm font-sans font-semibold text-[var(--text-primary)]">
                    {instrument.name} ({lots.toFixed(2)} Lots)
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-mono font-medium">
                  {currency} Account Ground
                </div>
              </div>

              {/* Primary Callout: Single Pip Value */}
              <div
                className="p-6 text-center space-y-1 border"
                style={{
                  backgroundColor: "rgba(22,33,62,0.025)",
                  borderColor: "rgba(22,33,62,0.08)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Value per Single {instrument.unitName === "pips" ? "Pip" : "Point"}
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
                  {currency} {result.pipValueSingle.toFixed(2)}
                </div>
                <div className="text-xs font-mono text-[var(--text-tertiary)] pt-1">
                  10 {instrument.unitName} = {currency} {result.pipValue10.toFixed(2)} · 50 {instrument.unitName} = {currency} {result.pipValue50.toFixed(2)}
                </div>
              </div>

              {/* Multi-Lot Comparison Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Standardized Contract Tiers
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    {instrument.standardContractUnits.toLocaleString()} units / standard lot
                  </span>
                </div>

                <div className="border border-black/5 rounded overflow-hidden">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-black/[0.03] border-b border-black/5 text-[10px] uppercase text-[var(--text-tertiary)]">
                        <th className="p-2.5">Tier</th>
                        <th className="p-2.5">Volume</th>
                        <th className="p-2.5 text-right">1 Pip</th>
                        <th className="p-2.5 text-right">10 Pips</th>
                        <th className="p-2.5 text-right">50 Pips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.table.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-black/5 hover:bg-black/[0.01] transition-colors"
                        >
                          <td className="p-2.5 font-semibold text-[var(--text-primary)]">
                            {row.lotType}
                          </td>
                          <td className="p-2.5 text-[var(--text-secondary)]">
                            {row.lotSize.toFixed(2)}
                          </td>
                          <td className="p-2.5 text-right font-bold text-[var(--accent)]">
                            {currency} {row.valuePerPip.toFixed(2)}
                          </td>
                          <td className="p-2.5 text-right text-[var(--text-secondary)]">
                            {currency} {row.valuePer10Pips.toFixed(2)}
                          </td>
                          <td className="p-2.5 text-right text-[var(--text-secondary)]">
                            {currency} {row.valuePer50Pips.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show The Working */}
        <ToolWorkingBox steps={result.formulaSteps} />

        {/* Educational Framework */}
        <ToolFormulaSection
          title="Understanding Pip and Tick Valuation"
          description="In Forex, a pip (percentage in point) measures currency pair price movements. While EUR/USD with a USD account is always $10.00 per standard lot, cross pairs like EUR/GBP or GBP/JPY require active exchange conversion into your account base."
          formulaLatex="Pip\ Value = \left( \frac{One\ Pip\ Increment}{Exchange\ Rate} \right) \times Trade\ Size\ (Units) \times Account\ FX\ Rate"
          steps={[
            "Identify the quote (second) currency in the pair (e.g., in EUR/USD the quote currency is USD).",
            "Calculate base pip value: 1 standard lot (100,000 units) × 0.0001 (or 0.01 for JPY) = $10.00 USD.",
            "Convert quote currency into your account base currency using current spot reference rates.",
            "Scale the resulting unit value by the actual lot volume traded.",
          ]}
          faqs={[
            {
              question: "Why is a pip on GBP/USD worth $10.00 USD but £7.80 GBP?",
              answer:
                "Because the quote currency is USD, each pip naturally pays out in USD ($10 per standard lot). If your broker account is held in British Pounds (GBP), that $10 must be converted at the current GBP/USD exchange rate ($10 ÷ 1.28 = £7.81).",
            },
          ]}
        />

        {/* Contextual CTA */}
        <ToolContextualCTA
          toolName="Pip Value Calculator"
          lead="Never guess pip values again during live execution."
          benefit="Plan My Trade performs real-time multi-currency pip conversion automatically for all trades logged in your operating loop."
        />

        <ToolDisclaimer />
      </div>
    </div>
  );
}
