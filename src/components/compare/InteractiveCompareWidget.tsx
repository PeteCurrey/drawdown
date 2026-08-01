"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, X, Shield, ExternalLink, Star, ArrowRight, GitCompare, Award, Zap, Sparkles, ChevronRight } from "lucide-react";
import { brokers, Broker } from "@/data/brokers";
import { propFirms, PropFirm } from "@/data/prop-firms";

interface InteractiveCompareWidgetProps {
  mode: "broker" | "propFirm";
  initialItemAId?: string;
  initialItemBId?: string;
}

export function InteractiveCompareWidget({
  mode,
  initialItemAId,
  initialItemBId
}: InteractiveCompareWidgetProps) {
  // Preset Pairings
  const brokerPresets = [
    { name: "Pepperstone vs IG Markets", a: "pepperstone", b: "ig" },
    { name: "Pepperstone vs IC Markets", a: "pepperstone", b: "ic-markets" },
    { name: "IG Markets vs CMC Markets", a: "ig", b: "cmc-markets" },
    { name: "Trading 212 vs eToro", a: "trading-212", b: "etoro" },
  ];

  const propFirmPresets = [
    { name: "FTMO vs The5%ers", a: "ftmo", b: "the5ers" },
    { name: "Funding Pips vs MyFundedFX", a: "funding-pips", b: "myfundedfx" },
    { name: "Topstep vs Apex Trader Funding", a: "topstep", b: "apex-trader-funding" },
    { name: "FTMO vs Funding Pips", a: "ftmo", b: "funding-pips" },
  ];

  const presets = mode === "broker" ? brokerPresets : propFirmPresets;

  const defaultA = initialItemAId || (mode === "broker" ? "pepperstone" : "ftmo");
  const defaultB = initialItemBId || (mode === "broker" ? "ig" : "the5ers");

  const [selectedAId, setSelectedAId] = useState(defaultA);
  const [selectedBId, setSelectedBId] = useState(defaultB);

  // Get SVG logo paths
  const getLogoSrc = (id: string, defaultLogo: string) => {
    const cleanId = id.toLowerCase();
    if (cleanId === "ig" || cleanId.includes("ig")) return "/logos/brokers/ig-markets.svg";
    if (cleanId === "pepperstone") return "/logos/brokers/pepperstone-light.svg";
    if (cleanId === "ic-markets" || cleanId === "ic") return "/logos/brokers/ic-markets-light.svg";
    return defaultLogo;
  };

  if (mode === "broker") {
    const brokerA = brokers.find(b => b.id === selectedAId || b.slug === selectedAId) || brokers[3]; // Pepperstone
    const brokerB = brokers.find(b => b.id === selectedBId || b.slug === selectedBId) || brokers[0]; // IG

    const logoA = getLogoSrc(brokerA.id, brokerA.logo);
    const logoB = getLogoSrc(brokerB.id, brokerB.logo);

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 text-white relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Preset Pairings Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            <GitCompare className="w-4 h-4" />
            <span>Popular Head-to-Head Comparisons</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAId(preset.a);
                  setSelectedBId(preset.b);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all border ${
                  selectedAId === preset.a && selectedBId === preset.b
                    ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Head-to-Head Selector Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Side A Selector & Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">PLATFORM A</span>
              <select
                value={brokerA.id}
                onChange={(e) => setSelectedAId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-sans text-white focus:outline-none focus:border-indigo-500"
              >
                {brokers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-10 flex items-center">
                <img 
                  src={logoA} 
                  alt={brokerA.name} 
                  className="h-8 w-auto object-contain max-w-[130px]" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-sans font-black uppercase text-white">{brokerA.name}</h3>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {brokerA.rating.toFixed(1)} / 5.0
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic font-medium leading-relaxed m-0">
              &quot;{brokerA.oneLine}&quot;
            </p>

            <a
              href={`/go/${brokerA.slug}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              Visit {brokerA.name} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* VS Divider in middle / Side B Selector */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">PLATFORM B</span>
              <select
                value={brokerB.id}
                onChange={(e) => setSelectedBId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-sans text-white focus:outline-none focus:border-indigo-500"
              >
                {brokers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-10 flex items-center">
                <img 
                  src={logoB} 
                  alt={brokerB.name} 
                  className="h-8 w-auto object-contain max-w-[130px]" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-sans font-black uppercase text-white">{brokerB.name}</h3>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {brokerB.rating.toFixed(1)} / 5.0
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic font-medium leading-relaxed m-0">
              &quot;{brokerB.oneLine}&quot;
            </p>

            <a
              href={`/go/${brokerB.slug}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 border border-slate-700"
            >
              Visit {brokerB.name} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Side-by-Side Specifications Matrix */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Technical Comparison Matrix
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-xs font-mono uppercase text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <th className="p-4 w-1/3">Feature Parameter</th>
                  <th className="p-4 w-1/3 text-indigo-400">{brokerA.name}</th>
                  <th className="p-4 w-1/3 text-cyan-400">{brokerB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { label: "Spreads Model", valA: brokerA.spreads, valB: brokerB.spreads },
                  { label: "Minimum Deposit", valA: brokerA.minDeposit, valB: brokerB.minDeposit },
                  { label: "Regulation", valA: brokerA.fcaRegulated ? "FCA UK (FSCS £85k)" : "Tier-1 Global", valB: brokerB.fcaRegulated ? "FCA UK (FSCS £85k)" : "Tier-1 Global" },
                  { label: "Category Focus", valA: brokerA.category, valB: brokerB.category },
                  { label: "Platforms Supported", valA: brokerA.platforms.join(", "), valB: brokerB.platforms.join(", ") },
                  { label: "Spread Betting Tax-Free", valA: brokerA.id.includes("ig") || brokerA.id.includes("cmc") || brokerA.id.includes("spreadex") ? "Yes (UK Residents)" : "No (CFDs Only)", valB: brokerB.id.includes("ig") || brokerB.id.includes("cmc") || brokerB.id.includes("spreadex") ? "Yes (UK Residents)" : "No (CFDs Only)" },
                  { label: "TradingView Integration", valA: brokerA.platforms.includes("TradingView") ? "Direct Native Trading" : "External Charting", valB: brokerB.platforms.includes("TradingView") ? "Direct Native Trading" : "External Charting" },
                  { label: "Execution Model", valA: "No Dealing Desk / ECN", valB: "No Dealing Desk / ECN" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-slate-300 border-r border-slate-800/60 bg-slate-900/30">{row.label}</td>
                    <td className="p-4 text-white font-semibold border-r border-slate-800/60">{row.valA}</td>
                    <td className="p-4 text-white font-semibold">{row.valB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros & Cons Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-sm font-sans font-black uppercase text-indigo-400">{brokerA.name} Key Highlights</h4>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">Top Strengths:</span>
              <ul className="space-y-2">
                {brokerA.pros.map((p, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-sm font-sans font-black uppercase text-cyan-400">{brokerB.name} Key Highlights</h4>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">Top Strengths:</span>
              <ul className="space-y-2">
                {brokerB.pros.map((p, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PROP FIRM MODE
  const firmA = propFirms.find(f => f.id === selectedAId || f.slug === selectedAId) || propFirms[0]; // FTMO
  const firmB = propFirms.find(f => f.id === selectedBId || f.slug === selectedBId) || propFirms[1]; // The5ers

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 text-white relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Preset Pairings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
          <GitCompare className="w-4 h-4" />
          <span>Popular Prop Firm Battles</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedAId(preset.a);
                setSelectedBId(preset.b);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all border ${
                selectedAId === preset.a && selectedBId === preset.b
                  ? "bg-purple-600 border-purple-500 text-white font-bold shadow-md shadow-purple-600/30"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Head-to-Head Selector Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Side A Selector */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">FIRM A</span>
            <select
              value={firmA.id}
              onChange={(e) => setSelectedAId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-sans text-white focus:outline-none focus:border-purple-500"
            >
              {propFirms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-2xl font-sans font-black uppercase text-white">{firmA.name}</h3>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold mt-1">
              <Star className="w-3.5 h-3.5 fill-current" /> {firmA.rating.toFixed(1)} / 5.0 Rating
            </div>
          </div>

          <p className="text-xs text-slate-300 italic font-medium leading-relaxed m-0">
            &quot;{firmA.verdict}&quot;
          </p>

          <a
            href={firmA.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
          >
            Start {firmA.name} Challenge <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Side B Selector */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">FIRM B</span>
            <select
              value={firmB.id}
              onChange={(e) => setSelectedBId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-sans text-white focus:outline-none focus:border-purple-500"
            >
              {propFirms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-2xl font-sans font-black uppercase text-white">{firmB.name}</h3>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold mt-1">
              <Star className="w-3.5 h-3.5 fill-current" /> {firmB.rating.toFixed(1)} / 5.0 Rating
            </div>
          </div>

          <p className="text-xs text-slate-300 italic font-medium leading-relaxed m-0">
            &quot;{firmB.verdict}&quot;
          </p>

          <a
            href={firmB.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 border border-slate-700"
          >
            Start {firmB.name} Challenge <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Side-by-Side Prop Firm Evaluation Matrix */}
      <div className="space-y-4">
        <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Evaluation Rules & Fees Matrix
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-xs font-mono uppercase text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="p-4 w-1/3">Evaluation Metric</th>
                <th className="p-4 w-1/3 text-purple-400">{firmA.name}</th>
                <th className="p-4 w-1/3 text-pink-400">{firmB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { label: "Challenge Fee", valA: firmA.challengeFee, valB: firmB.challengeFee },
                { label: "Profit Split", valA: firmA.profitSplit, valB: firmB.profitSplit },
                { label: "Max Funding Ceiling", valA: firmA.maxFunding, valB: firmB.maxFunding },
                { label: "Daily Drawdown Limit", valA: firmA.id === "ftmo" ? "5% (Balance-based)" : "5% Standard", valB: firmB.id === "ftmo" ? "5% (Balance-based)" : "5% Standard" },
                { label: "Max Total Drawdown", valA: firmA.id === "apex-trader-funding" ? "10% (Trailing)" : "10% (Static)", valB: firmB.id === "apex-trader-funding" ? "10% (Trailing)" : "10% (Static)" },
                { label: "Scaling Plan", valA: "Yes (Up to Multi-Million)", valB: "Yes (Up to Multi-Million)" },
                { label: "Payout Track Record", valA: "100% Verified Fast Payouts", valB: "100% Verified Fast Payouts" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-slate-300 border-r border-slate-800/60 bg-slate-900/30">{row.label}</td>
                  <td className="p-4 text-white font-semibold border-r border-slate-800/60">{row.valA}</td>
                  <td className="p-4 text-white font-semibold">{row.valB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pros & Cons Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-sm font-sans font-black uppercase text-purple-400">{firmA.name} Strengths</h4>
          <ul className="space-y-2">
            {firmA.pros.map((p, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-sm font-sans font-black uppercase text-pink-400">{firmB.name} Strengths</h4>
          <ul className="space-y-2">
            {firmB.pros.map((p, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
