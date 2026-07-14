"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function EarningsTab() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/market/earnings");
        const data = await res.json();
        setEarnings(data);
      } catch (err) {
        console.error("Earnings Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 pb-8 border-b border-mkt-bd">
        <h3 className="text-2xl font-sans font-bold uppercase tracking-tight flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-accent" /> Earnings Calendar
        </h3>
        <p className="text-[10px] font-mono uppercase text-mkt-i4 tracking-widest leading-loose">
           Corporate Reporting Dashboard // US & UK Equities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-white border border-mkt-bd animate-pulse" />
          ))
        ) : earnings.length > 0 ? (
          earnings.map((report, i) => (
            <div key={i} className="p-8 bg-white border border-mkt-bd group hover:border-mkt-bds transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-xl font-mono font-bold">{report.symbol}</h4>
                   <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">{report.companyName}</span>
                </div>
                <div className="px-3 py-1 bg-[#F7F7F7] border border-mkt-bd text-[9px] font-mono font-bold uppercase tracking-widest">
                  {report.period}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-mkt-i4 font-mono uppercase text-[10px]">Date</span>
                  <span className="font-bold">{report.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-mkt-i4 font-mono uppercase text-[10px]">EPS Estimate</span>
                  <span className="font-bold text-accent">{report.estimate || "---"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-mkt-i4 font-mono uppercase text-[10px]">Revenue Est.</span>
                  <span className="font-bold">${((report.revenueEstimate || 0) / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-mkt-bd/30 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   {report.actualOutcome === 'beat' ? <TrendingUp className="w-3 h-3 text-mkt-grn" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                   <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4">Sentiment: Neutral</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-mkt-bd/50">
             <DollarSign className="w-10 h-10 text-mkt-i4 mx-auto mb-4 opacity-20" />
             <p className="text-[10px] font-mono uppercase text-mkt-i4 tracking-widest">No major earnings reporting in the current window.</p>
          </div>
        )}
      </div>
    </div>
  );
}
