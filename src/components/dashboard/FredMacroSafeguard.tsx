"use client";

import { useEffect, useState } from "react";
import { 
  Landmark, AlertTriangle, ShieldCheck, ShieldAlert, 
  ChevronUp, ChevronDown, HelpCircle, Activity, Landmark as BankIcon, Droplet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataProvenanceLabel } from "@/components/ui/DataProvenanceLabel";

interface IndicatorItem {
  key: string;
  name: string;
  value: number | null;
  prevValue: number | null;
  unit: string;
  change: number | null;
  direction: "up" | "down" | "flat";
  source: string;
}

interface FredMacroSafeguardProps {
  variant?: "compact" | "full";
}

export function FredMacroSafeguard({ variant = "full" }: FredMacroSafeguardProps) {
  const [indicators, setIndicators] = useState<Record<string, IndicatorItem>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"us" | "uk" | "commodities">("us");

  useEffect(() => {
    async function loadMacro() {
      try {
        const res = await fetch("/api/macro/indicators");
        if (res.ok) {
          const data = await res.json();
          if (data.indicators) {
            setIndicators(data.indicators);
          }
        }
      } catch (e) {
        console.error("Failed to load FRED macro indicators:", e);
      } finally {
        setLoading(false);
      }
    }
    loadMacro();
  }, []);

  // Compute live sessional macro threat rating based on current rates/inflation
  const getMacroRiskScore = () => {
    if (loading || Object.keys(indicators).length === 0) return { score: 35, level: "LOW", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    
    let points = 0;
    
    // Fed Funds Rate above 4.5% = high volatility
    if (indicators.fed_rate?.value && indicators.fed_rate.value > 4.5) points += 20;
    // CPI above 2.5% = inflationary risk
    if (indicators.us_cpi?.value && indicators.us_cpi.value > 2.5) points += 15;
    // Bond yields high = risk off environment
    if (indicators.us_10y?.value && indicators.us_10y.value > 4.0) points += 15;
    // Commodities volatility (WTI above $75/bbl)
    if (indicators.wti_oil?.value && indicators.wti_oil.value > 75) points += 10;

    if (points >= 50) {
      return {
        score: points + 15,
        level: "CRITICAL NEWS RISK",
        desc: "High-impact macro events and interest rate stress are creating massive slippage potential. Strict prop-firm risk management recommended.",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        icon: ShieldAlert
      };
    } else if (points >= 30) {
      return {
        score: points + 10,
        level: "ELEVATED VOLATILITY",
        desc: "Intermediate macro news dates (CPI/BoE) are causing sessional spread spikes. Reduce leverage on EUR/USD and GBP/USD pairs.",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: AlertTriangle
      };
    } else {
      return {
        score: Math.max(points, 15),
        level: "NORMAL MACRO REGIME",
        desc: "Volatility indicators are stabilized. Normal prop sessional trading allowed. Keep a strict eye on daily drawdown limits.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: ShieldCheck
      };
    }
  };

  const risk = getMacroRiskScore();
  const RiskIcon = risk.icon || ShieldCheck;

  if (variant === "compact") {
    return (
      <div className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 duration-200">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#F9771D]" />
              <h5 className="font-semibold text-sm text-[#1A1A1A]">FRED® Macro Guard</h5>
            </div>
            <span className={cn("text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", risk.bg, risk.color, risk.border, "border")}>
              {risk.level}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-[11px] text-[#555550] leading-snug line-clamp-2">
              {risk.desc}
            </p>
          </div>

          <div className="space-y-2">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="h-6 bg-gray-50 rounded animate-pulse" />)
            ) : (
              [
                { item: indicators.fed_rate, label: "Fed Funds Rate", icon: Landmark },
                { item: indicators.us_cpi, label: "US CPI YoY", icon: Activity },
                { item: indicators.wti_oil, label: "Crude Oil Price", icon: Droplet }
              ].map(({ item, label, icon: Icon }) => {
                if (!item) return null;
                const isUp = (item.change ?? 0) > 0;
                const isDown = (item.change ?? 0) < 0;

                return (
                  <div key={item.key} className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#555550] font-sans flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      {label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1A1A1A]">{item.value ?? "—"}{item.unit}</span>
                      <span className={cn(
                        "text-[9px] px-1 rounded font-semibold", 
                        isUp ? "text-[#18B880] bg-[#18B880]/10" : isDown ? "text-[#CE6969] bg-[#CE6969]/10" : "text-gray-500 bg-gray-100"
                      )}>
                        {isUp ? "+" : ""}{item.change ?? 0}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
          <DataProvenanceLabel
            provider="FRED® St. Louis Fed"
            delayDescription="~1 day"
            status="delayed"
          />
          <span className="text-[9px] font-mono text-gray-400">Shield: {risk.score}%</span>
        </div>
      </div>
    );
  }

  // Full dashboard layout
  return (
    <div className="bg-white border border-[#DEDDD8] rounded-none p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-[#EBEBE8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-[#181818] border border-[#333330] text-white">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1A1A1A]">FRED® Macro Volatility Safeguard</h3>
          </div>
          <p className="text-xs text-[#555550]">
            Wired directly to the St. Louis Federal Reserve and EIA to scan global interest rate cycles and commodity feeds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2 px-3 py-2 border rounded-none", risk.bg, risk.border)}>
            <RiskIcon className={cn("w-4 h-4", risk.color)} />
            <div className="text-left">
              <div className={cn("text-[9px] font-mono font-bold uppercase tracking-wider", risk.color)}>
                {risk.level}
              </div>
              <div className="text-[10px] text-gray-600 font-mono">
                Sessional Threat Score: {risk.score}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Directive and warnings */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-none">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A] mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#F9771D]" />
              Account Preservation Directive
            </h4>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              {risk.desc}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-[11px] font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Slippage Risk: <span className="font-bold text-gray-700">HIGH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Spread Widening: <span className="font-bold text-gray-700">Sessional Spikes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                News Filter: <span className="font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-[#CE6969]/20 bg-[#CE6969]/5 rounded-none">
            <span className="text-[10px] font-mono uppercase font-bold text-[#CE6969] tracking-wider block mb-1">
              Prop Firm Trade Restrictor
            </span>
            <p className="text-[11px] text-[#CE6969] leading-snug">
              Most prop firms trigger an automatic breach if you execute positions within 2 minutes of high-impact FRED announcements (CPI/FOMC). Keep limits checked!
            </p>
          </div>
        </div>

        {/* Detailed Indicators tab / grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex border-b border-gray-200">
            {[
              { id: "us" as const, label: "United States (FRED)", icon: Landmark },
              { id: "uk" as const, label: "United Kingdom (BoE)", icon: BankIcon },
              { id: "commodities" as const, label: "EIA Energy & Crude", icon: Droplet },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-[#F9771D] text-[#1A1A1A] font-bold"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-50 rounded-lg animate-pulse" />)
            ) : activeTab === "us" ? (
              <>
                {[
                  { item: indicators.fed_rate, title: "Federal Funds Rate", desc: "US Federal Reserve benchmark rate" },
                  { item: indicators.us_cpi, title: "US CPI Inflation (YoY)", desc: "Consumer Price Index inflation metric" },
                  { item: indicators.us_10y, title: "US 10-Year Bond Yield", desc: "Treasury bond yield stress gauge" },
                ].map(({ item, title, desc }) => {
                  if (!item) return null;
                  const isUp = (item.change ?? 0) > 0;
                  const isDown = (item.change ?? 0) < 0;

                  return (
                    <div key={item.key} className="p-4 border border-gray-100 rounded-none bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-800">{title}</span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center",
                            isUp ? "text-emerald-600 bg-emerald-50" : isDown ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-50"
                          )}>
                            {isUp && <ChevronUp className="w-3 h-3 mr-0.5" />}
                            {isDown && <ChevronDown className="w-3 h-3 mr-0.5" />}
                            {isUp ? "+" : ""}{item.change ?? 0}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
                      </div>
                      <div className="mt-4 flex justify-between items-end">
                        <span className="text-[20px] font-bold font-mono text-gray-900">
                          {item.value ?? "—"}{item.unit}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">{item.source}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : activeTab === "uk" ? (
              <>
                {[
                  { item: indicators.boe_rate, title: "BoE Base Rate", desc: "Bank of England policy rate" },
                  { item: indicators.uk_cpi, title: "UK CPI Inflation (YoY)", desc: "UK CPI YoY inflation metric" },
                ].map(({ item, title, desc }) => {
                  if (!item) return null;
                  const isUp = (item.change ?? 0) > 0;
                  const isDown = (item.change ?? 0) < 0;

                  return (
                    <div key={item.key} className="p-4 border border-gray-100 rounded-none bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-800">{title}</span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center",
                            isUp ? "text-emerald-600 bg-emerald-50" : isDown ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-50"
                          )}>
                            {isUp && <ChevronUp className="w-3 h-3 mr-0.5" />}
                            {isDown && <ChevronDown className="w-3 h-3 mr-0.5" />}
                            {isUp ? "+" : ""}{item.change ?? 0}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
                      </div>
                      <div className="mt-4 flex justify-between items-end">
                        <span className="text-[20px] font-bold font-mono text-gray-900">
                          {item.value ?? "—"}{item.unit}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">{item.source}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {[
                  { item: indicators.wti_oil, title: "WTI Crude Oil Price", desc: "Energy sector volatility pricing proxy" },
                ].map(({ item, title, desc }) => {
                  if (!item) return null;
                  const isUp = (item.change ?? 0) > 0;
                  const isDown = (item.change ?? 0) < 0;

                  return (
                    <div key={item.key} className="p-4 border border-gray-100 rounded-none bg-white shadow-sm flex flex-col justify-between md:col-span-2">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-800">{title}</span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center",
                            isUp ? "text-emerald-600 bg-emerald-50" : isDown ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-50"
                          )}>
                            {isUp && <ChevronUp className="w-3 h-3 mr-0.5" />}
                            {isDown && <ChevronDown className="w-3 h-3 mr-0.5" />}
                            {isUp ? "+" : ""}{item.change ?? 0}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
                      </div>
                      <div className="mt-4 flex justify-between items-end">
                        <span className="text-[20px] font-bold font-mono text-gray-900">
                          {item.value ?? "—"}{item.unit}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">{item.source}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
