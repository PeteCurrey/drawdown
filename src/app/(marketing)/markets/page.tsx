"use client";

import { Activity, Globe, Zap, ArrowRight, TrendingUp, AlertTriangle, ChevronRight, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import { MarketTicker } from "@/components/market/MarketTicker";

export default function MarketsHubPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      
      {/* Ticker Tape */}
      <div className="border-b border-mkt-bd/50">
        <MarketTicker />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-white overflow-hidden border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3 text-accent">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">LIVE INTELLIGENCE</span>
            </div>
            
            <h1 className="  font-sans font-extrabold uppercase tracking-tight leading-[0.9]">
              Market Intelligence <br />
              <span className="text-mkt-ink">Command Center.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-mkt-i2 leading-relaxed max-w-3xl font-medium">
              Live institutional data flows, volatility metrics, and actionable setups. Cut through the noise and see where the smart money is moving today.
            </p>
          </div>
        </div>

        {/* Aesthetic Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_10%,var(--color-accent)_10.5%,transparent_11%)] [background-size:2vw_100%]" />
        </div>
      </section>

      {/* Macro Overlay / Pete's Bias */}
      <section className="bg-white border-b border-mkt-bd relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-warning mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Current Macro Bias</span>
              </div>
              <h2 className="text-2xl font-sans font-bold text-mkt-ink mb-2">Risk-Off: DXY Strength Dominating</h2>
              <p className="text-sm text-mkt-i2 max-w-2xl leading-relaxed">
                "Yields are pushing higher ahead of Friday's PCE print. Expect equity weakness and USD pairs to drift lower. Do not try to catch falling knives in tech today." — Pete C.
              </p>
            </div>
            <Link href="/learn/pete-memo" className="shrink-0 px-6 py-3 border border-warning/50 text-warning hover:bg-warning/10 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               Read Full Memo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Asset Blocks Grid */}
      <section className="py-16">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Forex Block */}
               <div className="bg-white border border-mkt-bd flex flex-col group hover:border-mkt-bds/30 transition-all">
                  <div className="p-6 border-b border-mkt-bd/50 flex justify-between items-center">
                     <h3 className="text-xl font-sans font-bold uppercase text-mkt-ink flex items-center gap-2">
                        <Globe className="w-5 h-5 text-accent" /> Forex
                     </h3>
                     <span className="text-[10px] font-mono text-mkt-grn uppercase tracking-widest bg-profit/10 px-2 py-1">High Volatility</span>
                  </div>
                  
                  <div className="p-6 space-y-6 flex-grow">
                     <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Top Movers (24H)</p>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-mkt-ink">EUR/USD</span>
                              <span className="text-sm text-red-500 font-mono">-0.45%</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-mkt-ink">USD/JPY</span>
                              <span className="text-sm text-mkt-grn font-mono">+0.82%</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-mkt-bd/50">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Key Data Today</p>
                        <div className="flex items-start gap-3">
                           <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                           <div>
                              <p className="text-sm text-mkt-ink font-bold">13:30 GMT - US Core CPI</p>
                              <p className="text-xs text-mkt-i2 mt-1">Expected: 0.3% | Prev: 0.4%</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Affiliate Monetization */}
                  <div className="p-6 bg-white border-t border-mkt-bd/50">
                     <p className="text-xs text-mkt-i2 mb-3">Trading Forex?</p>
                     <a href="/go/pepperstone" className="flex items-center justify-between text-sm font-bold text-mkt-ink hover:text-accent transition-colors">
                        Trade on Pepperstone (Raw Spreads) <ArrowRight className="w-4 h-4" />
                     </a>
                  </div>
               </div>

               {/* Indices Block */}
               <div className="bg-white border border-mkt-bd flex flex-col group hover:border-mkt-bds/30 transition-all">
                  <div className="p-6 border-b border-mkt-bd/50 flex justify-between items-center">
                     <h3 className="text-xl font-sans font-bold uppercase text-mkt-ink flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-accent" /> Indices
                     </h3>
                     <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest bg-loss/10 px-2 py-1">Risk-Off</span>
                  </div>
                  
                  <div className="p-6 space-y-6 flex-grow">
                     <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Market Proximity</p>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-mkt-ink">S&P 500</span>
                              <span className="text-xs text-mkt-i2">Testing 50 SMA</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-mkt-ink">NASDAQ 100</span>
                              <span className="text-xs text-red-500">Broke Support</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-mkt-bd/50">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Educational Primer</p>
                        <Link href="/learn/trading-nasdaq-open" className="text-sm font-bold text-mkt-ink hover:text-accent transition-colors block">
                           How to trade the NY Equity Open Volatility &rarr;
                        </Link>
                     </div>
                  </div>

                  {/* Affiliate Monetization */}
                  <div className="p-6 bg-white border-t border-mkt-bd/50">
                     <p className="text-xs text-mkt-i2 mb-3">Trading Indices?</p>
                     <a href="/go/ig-markets" className="flex items-center justify-between text-sm font-bold text-mkt-ink hover:text-accent transition-colors">
                        Trade on IG (Tax-Free UK) <ArrowRight className="w-4 h-4" />
                     </a>
                  </div>
               </div>

               {/* Crypto & Metals Block */}
               <div className="bg-white border border-mkt-bd flex flex-col group hover:border-mkt-bds/30 transition-all">
                  <div className="p-6 border-b border-mkt-bd/50 flex justify-between items-center">
                     <h3 className="text-xl font-sans font-bold uppercase text-mkt-ink flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" /> Crypto & Gold
                     </h3>
                     <span className="text-[10px] font-mono text-warning uppercase tracking-widest bg-warning/10 px-2 py-1">Consolidating</span>
                  </div>
                  
                  <div className="p-6 space-y-6 flex-grow">
                     <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Key Assets</p>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-mkt-ink">XAU/USD</span>
                              <span className="text-sm text-mkt-grn font-mono">+0.15%</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-mkt-ink">BTC/USD</span>
                              <span className="text-sm text-red-500 font-mono">-2.10%</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-mkt-bd/50">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Institutional Insight</p>
                        <p className="text-sm text-mkt-i2">
                           Gold holding steady despite dollar strength, indicating underlying safe-haven bid. BTC struggling to clear resistance.
                        </p>
                     </div>
                  </div>

                  {/* Affiliate Monetization */}
                  <div className="p-6 bg-white border-t border-mkt-bd/50">
                     <p className="text-xs text-mkt-i2 mb-3">Trading Gold?</p>
                     <Link href="/brokers/best-for-gold" className="flex items-center justify-between text-sm font-bold text-mkt-ink hover:text-accent transition-colors">
                        Find the Best Broker for XAU <ArrowRight className="w-4 h-4" />
                     </Link>
                  </div>
               </div>

            </div>
         </div>
      </section>

    </div>
  );
}
