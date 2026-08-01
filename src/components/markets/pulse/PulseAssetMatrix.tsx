"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
  symbol: string;
  displayPair: string;
  category: string;
  slug: string;
  price: number;
  changePercent: number;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
}

const DEFAULT_ASSETS: Asset[] = [
  { symbol: "GBPUSD", displayPair: "GBP/USD", category: "forex", slug: "gbpusd", price: 1.2845, changePercent: 0.15, bias: "BULLISH" },
  { symbol: "EURUSD", displayPair: "EUR/USD", category: "forex", slug: "eurusd", price: 1.0892, changePercent: -0.08, bias: "NEUTRAL" },
  { symbol: "XAUUSD", displayPair: "XAU/USD (Gold)", category: "commodities", slug: "gold", price: 2384.50, changePercent: 0.85, bias: "BULLISH" },
  { symbol: "USOIL", displayPair: "WTI Crude Oil", category: "commodities", slug: "oil", price: 77.40, changePercent: 1.12, bias: "BULLISH" },
  { symbol: "SPX", displayPair: "S&P 500", category: "indices", slug: "spx", price: 5480.20, changePercent: 0.42, bias: "BULLISH" },
  { symbol: "UK100", displayPair: "FTSE 100", category: "indices", slug: "uk100", price: 8220.00, changePercent: -0.15, bias: "NEUTRAL" },
  { symbol: "BTCUSD", displayPair: "BTC/USD (Bitcoin)", category: "crypto", slug: "bitcoin", price: 68420.00, changePercent: 2.45, bias: "BULLISH" },
  { symbol: "ETHUSD", displayPair: "ETH/USD (Ethereum)", category: "crypto", slug: "ethereum", price: 3450.00, changePercent: 1.80, bias: "BULLISH" },
];

export function PulseAssetMatrix() {
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS);

  useEffect(() => {
    async function fetchPolygonData() {
      try {
        const res = await fetch("/api/market/polygon-snapshot?symbols=GBPUSD,EURUSD,XAUUSD,SPX,UK100,BTCUSD,ETHUSD");
        if (res.ok) {
          const json = await res.json();
          if (json.snapshots) {
            const updated = DEFAULT_ASSETS.map((asset) => {
              const snap = json.snapshots[asset.symbol];
              if (snap) {
                const isPos = snap.changePercent >= 0;
                return {
                  ...asset,
                  price: snap.price,
                  changePercent: snap.changePercent,
                  bias: (snap.changePercent >= 0.5 ? "BULLISH" : snap.changePercent <= -0.5 ? "BEARISH" : "NEUTRAL") as any,
                };
              }
              return asset;
            });
            setAssets(updated);
          }
        }
      } catch (err) {
        console.error("Asset matrix fetch error:", err);
      }
    }
    fetchPolygonData();
  }, []);

  return (
    <div className="mb-12 border border-mkt-bd bg-[#F7F7F7] p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-mkt-bd/60 pb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-mkt-ink">
            REAL-TIME CROSS-ASSET HEATMAP & BIAS
          </span>
        </div>
        <span className="text-[9px] font-mono uppercase text-mkt-i4">
          Polygon.io Live Stream
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((item) => {
          const isUp = item.changePercent >= 0;
          const biasColor =
            item.bias === "BULLISH"
              ? "text-[#18B880] bg-[#18B880]/10 border-[#18B880]/20"
              : item.bias === "BEARISH"
              ? "text-[#CE6969] bg-[#CE6969]/10 border-[#CE6969]/20"
              : "text-[#555550] bg-[#555550]/10 border-[#555550]/20";

          return (
            <Link
              key={item.symbol}
              href={`/markets/${item.category}/${item.slug}`}
              className="bg-white border border-mkt-bd p-4 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-mkt-ink group-hover:text-accent transition-colors">
                    {item.displayPair}
                  </span>
                  <span className={cn("text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase", biasColor)}>
                    {item.bias}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-lg font-bold text-mkt-ink">
                    {item.price > 1000 ? item.price.toLocaleString() : item.price}
                  </span>
                  <span className={cn("text-xs font-semibold flex items-center gap-0.5", isUp ? "text-mkt-grn" : "text-mkt-red")}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? "+" : ""}{item.changePercent}%
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-mkt-bd/40 flex items-center justify-between text-[9px] font-mono text-mkt-i4">
                <span>View Setup</span>
                <ArrowUpRight className="w-3 h-3 text-accent group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
