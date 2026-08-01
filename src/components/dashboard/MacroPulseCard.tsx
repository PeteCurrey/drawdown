"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Landmark, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function MacroPulseCard() {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMacro() {
      try {
        const res = await fetch("/api/macro/indicators");
        if (res.ok) {
          const data = await res.json();
          if (data.list) setIndicators(data.list);
        }
      } catch (e) {
        console.error("Failed to load macro pulse in dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    loadMacro();
  }, []);

  return (
    <div className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 duration-200">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-[#F9771D]" />
            <h5 className="font-semibold text-sm text-[#1A1A1A]">Macro Pulse</h5>
          </div>
          <Link href="/markets/pulse" className="text-xs text-[#555550] hover:text-[#1A1A1A]">
            ↗
          </Link>
        </div>

        <div className="space-y-2 mb-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-6 bg-[#F8F9FA] rounded animate-pulse" />)
          ) : indicators.length > 0 ? (
            indicators.slice(0, 3).map((item) => {
              const isUp = item.change > 0;
              const isDown = item.change < 0;

              return (
                <div key={item.key} className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#555550] font-sans truncate">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#1A1A1A]">{item.value}{item.unit}</span>
                    <span className={cn("text-[9px] px-1 rounded font-semibold", isUp ? "text-[#18B880] bg-[#18B880]/10" : isDown ? "text-[#CE6969] bg-[#CE6969]/10" : "text-[#555550]")}>
                      {isUp ? `+${item.change}` : item.change}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-[10px] font-mono text-[#555550]">FRED Macro Data Synced</p>
          )}
        </div>
      </div>

      <div>
        <div className="w-full h-px bg-[#F0F0F0] mb-2" />
        <div className="flex justify-between items-center text-[10px] font-mono text-[#555550]">
          <span>Data Provider</span>
          <span className="text-[#F9771D] font-bold">FRED® & EIA®</span>
        </div>
      </div>
    </div>
  );
}
