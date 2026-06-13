"use client";

import { motion } from "framer-motion";
import { Calendar, Radio, TrendingUp, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const featuredNews = {
  date: "Today // 10:45 AM",
  source: "Reuters",
  title: "BoE Holds Rates at 5.25% as Inflation Matches 2% Target",
  excerpt: "The Bank of England voted 7-2 to maintain interest rates, stating policy must remain restrictive until core service sector pricing pressures subside.",
};

const newsList = [
  {
    date: "1 Hour Ago // 12:15 PM",
    source: "Bloomberg",
    title: "US Retail Sales Rise Modestly, Suggesting Consumer Spending Resilience",
    excerpt: "May sales figures increase 0.1%, coming in below economists' estimates but indicating stable retail demand.",
    thumbnailText: "RET"
  },
  {
    date: "2 Hours Ago // 11:30 AM",
    source: "Financial Times",
    title: "ECB Policymakers Cautious on July Cut as Wage Growth Accelerates",
    excerpt: "Governing council members signal interest rate reductions might pause next month due to persistent wage pressures.",
    thumbnailText: "ECB"
  },
  {
    date: "4 Hours Ago // 09:15 AM",
    source: "WSJ",
    title: "Tokyo CPI Acceleration Boosts Speculation of Summer BoJ Rate Increase",
    excerpt: "Core consumer prices in Tokyo rose 2.1% in June, supporting the case for Bank of Japan monetary tightening.",
    thumbnailText: "BOJ"
  }
];

const calendarEvents = [
  { time: "13:30", currency: "USD", impact: "high", event: "Core Retail Sales (MoM) (May)" },
  { time: "14:15", currency: "GBP", impact: "medium", event: "BoE Gov Bailey Speaks" },
  { time: "15:00", currency: "EUR", impact: "low", event: "Consumer Confidence (Jun)" },
  { time: "16:30", currency: "USD", impact: "high", event: "Crude Oil Inventories" },
  { time: "23:45", currency: "NZD", impact: "medium", event: "GDP (QoQ) (Q1)" }
];

const topMovers = [
  { symbol: "EURUSD", price: "1.0845", change: "-0.05%", isPositive: false },
  { symbol: "GBPUSD", price: "1.2734", change: "+0.12%", isPositive: true },
  { symbol: "BTCUSD", price: "67,420", change: "+1.45%", isPositive: true }
];

export function LiveNewsSection() {
  const cardClasses = "bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-300";

  return (
    <section className="w-full bg-[#F7F7F7] border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // LIVE MARKET BRIEFING
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Market Pulse & Intelligence
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Real-time sentiment monitoring, macro calendars, and raw institutional data feeds.
          </p>
        </div>

        {/* 1.6fr / 1fr Grid layout approximated via bootstrap cols: 7 / 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (News feed: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Featured news card */}
            <div className={cn(cardClasses, "p-0 overflow-hidden")}>
              {/* Image Area */}
              <div className="h-56 bg-gradient-to-br from-neutral-950 to-neutral-900 flex flex-col justify-between p-6 relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="h-full w-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>
                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] font-bold text-white bg-mkt-grn px-2 py-0.5 rounded-sm uppercase tracking-wider font-sans">
                    BREAKING
                  </span>
                  <Newspaper className="w-5 h-5 text-white/40" />
                </div>
                <div className="z-10">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    {featuredNews.date} &bull; {featuredNews.source}
                  </p>
                  <h3 className="text-xl md:text-2xl font-sans font-extrabold text-white mt-1 leading-tight tracking-tight">
                    {featuredNews.title}
                  </h3>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <p className="text-sm text-mkt-i3 leading-relaxed font-sans">
                  {featuredNews.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-mkt-i4 uppercase font-bold tracking-wider">
                    POLITICS / MACRO
                  </span>
                  <span className="text-xs font-semibold text-mkt-ink hover:underline cursor-pointer font-sans">
                    Read coverage &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Three news list items */}
            <div className="bg-white border border-mkt-bd rounded-[14px] p-6 space-y-4">
              {newsList.map((item, index) => (
                <div 
                  key={index}
                  className="flex gap-4 py-4 border-b border-neutral-100 last:border-b-0 last:pb-0 first:pt-0 items-start group cursor-pointer"
                >
                  {/* Icon Thumbnail */}
                  <div className="w-14 h-14 bg-neutral-50 border border-mkt-bd rounded flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold text-mkt-i3 uppercase">{item.thumbnailText}</span>
                  </div>
                  {/* Content */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">
                      {item.date} &bull; {item.source}
                    </p>
                    <h4 className="text-sm font-sans font-bold text-mkt-ink group-hover:text-mkt-grn transition-colors duration-150 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-mkt-i3 leading-normal font-sans">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column (Sidebar: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Economic Calendar Card */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-base font-sans font-bold text-mkt-ink flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-mkt-i3" /> Economic Calendar
                </h3>
                <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">TODAY</span>
              </div>
              
              <div className="space-y-3">
                {calendarEvents.map((evt, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {/* Impact Dot */}
                      <span className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        evt.impact === "high" ? "bg-mkt-red" : evt.impact === "medium" ? "bg-mkt-amb" : "bg-neutral-300"
                      )} />
                      <span className="text-xs font-mono text-mkt-i3">{evt.time}</span>
                      <span className="text-xs font-mono font-bold text-mkt-ink">{evt.currency}</span>
                    </div>
                    <span className="text-xs text-mkt-i3 font-sans text-right max-w-[180px] truncate">
                      {evt.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Movers Card */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-base font-sans font-bold text-mkt-ink flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-mkt-i3" /> Top Movers
                </h3>
                <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">24H RANGE</span>
              </div>
              
              <div className="space-y-3">
                {topMovers.map((mvr, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-b-0 last:pb-0"
                  >
                    <span className="text-xs font-mono font-bold text-mkt-ink">{mvr.symbol}</span>
                    <span className="text-xs font-mono text-mkt-i3">{mvr.price}</span>
                    <span className={cn(
                      "text-xs font-mono font-bold",
                      mvr.isPositive ? "text-mkt-grn" : "text-mkt-red"
                    )}>
                      {mvr.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
