"use client";

import { useSearchParams } from "next/navigation";
import { InteractiveChart } from "@/components/charts/InteractiveChart";
import { MarketConsensus } from "@/components/market/MarketConsensus";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Suspense } from "react";

function ScannerContent() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-4">
        <Breadcrumbs />
        <div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight">
            {symbol ? `Intelligence: ${symbol}` : "Market Scanner"}
          </h1>
          <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
            // {symbol ? `Advanced technical analysis and AI intelligence for ${symbol}` : "Global technical consensus and indicator alignment"}
          </p>
        </div>
      </header>

      {symbol ? (
        <InteractiveChart symbol={symbol} userTier="edge" />
      ) : (
        <MarketConsensus />
      )}
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono text-xs uppercase animate-pulse">Loading Intelligence Hub...</div>}>
      <ScannerContent />
    </Suspense>
  );
}
