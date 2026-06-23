import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lock, ChevronLeft, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { MarketGauge } from "@/components/dashboard/MarketGauge";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { DotProgressBar } from "@/components/dashboard/DotProgressBar";

const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

export default async function MarketIntelligencePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;

  if (userWeight < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
        <div className="p-10 bg-white border border-[#EDEDED] rounded-2xl flex flex-col items-center text-center space-y-6 max-w-md w-full rounded-none">
          <div className="w-14 h-14 rounded-none border border-[#F9771D]/20 bg-[#F9771D]/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#F9771D]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Edge Access Required</p>
            <p className="text-xs text-[#555550] leading-relaxed">
              Market Intelligence includes sessional volume profiles, institutional positioning index,
              order flow delta metrics, and advanced news indicators. Available on Edge and Floor plans.
              Your current plan is{" "}
              <span className="font-bold text-[#1A1A1A] uppercase">{tier ?? "Free"}</span>.
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center px-8 py-4 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-[4px]"
            >
              Upgrade to Edge
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-8 py-3 border border-[#EDEDED] hover:border-[#F9771D] text-[10px] font-mono uppercase tracking-widest text-[#555550] hover:text-[#1A1A1A] transition-all rounded-[4px]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active state data definitions for GBP/USD consensus
  const consensusIndicators = [
    { label: "RSI (14)", value: "58.4", trend: "Bullish zone" },
    { label: "EMA (20)", value: "Price above", trend: "Trending" },
    { label: "COT Data", value: "Net long +23,412", trend: "Institutional long" },
    { label: "Volume Profile", value: "1.4M contracts", trend: "Above average" },
    { label: "News Sentiment", value: "+0.62 score", trend: "Positive" },
    { label: "Order Flow", value: "Buy delta +1,240", trend: "Accumulation" },
    { label: "Macro Score", value: "7.2/10", trend: "Risk-on" },
  ];

  return (
    <div className="space-y-0 -m-6 md:-m-10">
      {/* Edge-to-edge dark panel */}
      <section className="bg-[#181818] text-white p-6 md:p-10 pb-12 flex flex-col xl:flex-row gap-8 justify-between border-b border-[#333330]">
        <div className="flex-1 space-y-8">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#333330] pb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-[#2A2A2A] transition-colors text-[#8A8A85] hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <span className="text-[10px] font-mono text-[#8A8A85] uppercase tracking-widest block">ANALYSIS CENTRE</span>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Market Intelligence</h1>
                  <span className="text-xs text-[#8A8A85] px-2 py-0.5 border border-[#333330] bg-[#232323] cursor-pointer inline-flex items-center gap-1 font-mono">
                    GBP / USD <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#18B880] animate-pulse" />
                <span className="text-xs text-[#8A8A85] font-mono uppercase tracking-wider">Live Feed</span>
              </div>
              <div className="flex border border-[#333330]">
                <button className="px-3 py-1 bg-white text-[#181818] text-[10px] font-bold font-mono">4H</button>
                <button className="px-3 py-1 hover:bg-[#2A2A2A] text-[#8A8A85] text-[10px] font-mono">1D</button>
              </div>
              <button className="p-1 hover:bg-[#2A2A2A] rounded-none text-[#8A8A85]">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large Sentiment Gauge */}
          <div className="flex justify-center py-6">
            <MarketGauge 
              percentage={73} 
              label="Bullish Bias" 
              instrument="GBP / USD"
              price="1.27340"
              rsi="58.4"
              trend="ABOVE EMA"
            />
          </div>

          {/* Consensus Nodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-4 pt-6">
            {consensusIndicators.map((ind, i) => (
              <div key={i} className="bg-[#2A2A2A] border border-[#333330] p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-[9px] font-mono text-[#8A8A85] uppercase tracking-wider">{ind.label}</span>
                <div>
                  <span className="text-sm font-bold block truncate">{ind.value}</span>
                  <span className="text-[10px] text-[#18B880] block mt-0.5">{ind.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="w-full xl:w-[320px] bg-[#232323] border border-[#333330] flex flex-col h-[600px] shrink-0 p-4">
          <div className="flex-grow overflow-y-auto">
            <LiveFeed items={[
              { id: "feed-1", type: "alert", severity: "orange", source: "GBP/USD", message: "Bearish divergence on 4H RSI", time: "10m ago" },
              { id: "feed-2", type: "event", severity: "red", message: "📋 NFP data release in 2h 14m", time: "2h ago" },
              { id: "feed-3", type: "event", severity: "orange", message: "📋 BOE rate decision — tomorrow 12:00", time: "4h ago" },
              { id: "feed-4", type: "event", severity: "green", message: "📋 EUR/USD signal zone approached", time: "5h ago" },
              { id: "feed-5", type: "event", severity: "green", message: "📋 The Wire — Morning brief ready", time: "7h ago" },
            ]} />
          </div>
        </div>
      </section>

      {/* Light background lower section */}
      <section className="p-6 md:p-10 bg-[#D5D8C5] grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TradingView Chart Container */}
        <div className="lg:col-span-2 bg-[#181818] border border-[#EDEDED] p-6 text-white min-h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-[#333330] pb-4">
            <span className="text-xs font-bold font-mono text-[#8A8A85]">TradingView Terminal — GBP / USD · 4H</span>
            <span className="text-[9px] font-mono bg-[#2A2A2A] text-white px-2 py-0.5 border border-[#333330]">Confluences Loaded</span>
          </div>
          <div className="flex-grow flex items-center justify-center border border-dashed border-[#333330] my-4 bg-[#232323]/50">
            <span className="text-xs font-mono text-[#8A8A85] uppercase tracking-widest">[ TradingView API Live Sandbox Grid ]</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#8A8A85]">
            <span>Feed status: Online</span>
            <span>Data courtesy of Twelve Data &amp; TradingView</span>
          </div>
        </div>

        {/* Calendar and Consensus side columns */}
        <div className="space-y-8">
          {/* Institutional Consensus Card */}
          <div className="bg-white border border-[#EDEDED] rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#1A1A1A]">Consensus Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-[#555550] mb-1">
                  <span>Smart Money Longs</span>
                  <span className="font-bold">67%</span>
                </div>
                <DotProgressBar percentage={67} />
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-mono text-[#555550] mb-1">
                  <span>Retail Short Bias</span>
                  <span className="font-bold">82%</span>
                </div>
                <DotProgressBar percentage={82} color="bg-[#CE6969]" />
              </div>
            </div>
          </div>

          {/* Economic Calendar Mini-Card */}
          <div className="bg-white border border-[#EDEDED] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#EDEDED] pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Calendar Events</h3>
              <span className="text-[9px] font-mono bg-[#C8CBB8] px-2 py-0.5 text-[#1A1A1A]">GMT</span>
            </div>
            <div className="space-y-3">
              {[
                { time: "13:30", name: "US Core Durable Goods Orders m/m", impact: "high", col: "bg-[#CE6969]" },
                { time: "14:45", name: "US Flash Manufacturing PMI", impact: "medium", col: "bg-[#F9771D]" },
                { time: "15:00", name: "US New Home Sales", impact: "low", col: "bg-[#18B880]" },
              ].map((ev, i) => (
                <div key={i} className="flex justify-between items-start gap-4 text-xs">
                  <span className="font-mono text-[#555550] shrink-0">{ev.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">{ev.name}</p>
                    <span className="text-[9px] font-mono text-[#555550] uppercase">{ev.impact} Impact</span>
                  </div>
                  <span className={`w-2.5 h-2.5 shrink-0 mt-1 ${ev.col}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
