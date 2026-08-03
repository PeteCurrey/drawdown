import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getInsiderTransactions,
  getCongressionalTrading,
  getSocialSentiment,
  getNewsSentiment,
  getCompanyProfiles,
} from "@/lib/market";
import { getLatestSignals } from "@/lib/intelligence-ai";
import { Lock } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import DirectUpgradeButton from "@/components/dashboard/DirectUpgradeButton";
import { IntelligenceHubClient } from "@/components/dashboard/IntelligenceHubClient";

// ── Tier weights ────────────────────────────────────────────────────────────
const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  foundation: 1,
  edge: 2,
  floor: 3,
};

const TX_CODE: Record<string, string> = {
  P: "Purchase",
  S: "Sale",
  A: "Award",
  D: "Disposition",
  F: "Tax Withholding",
  G: "Gift",
  M: "Option Exercise",
  X: "Option Disposition",
  C: "Conversion",
  E: "Expiration",
  J: "Other Acquisition",
  W: "Will/Inheritance",
};

function isBuy(code: string, change: number) {
  return code === "P" || code === "M" || code === "J" || (code === "A" && change > 0);
}

// ── Cluster Buy detection ───────────────────────────────────────────────────
interface ClusterBuy {
  symbol: string;
  buyers: { name: string; date: string; shares: number; price: number }[];
  totalShares: number;
  latestDate: string;
}

function detectClusterBuys(trades: any[]): ClusterBuy[] {
  const now = Date.now();
  const window30d = 30 * 24 * 3600 * 1000;

  const recent = trades.filter((t) => {
    if (!isBuy(t.transactionCode, t.change)) return false;
    const date = new Date(t.transactionDate || t.filingDate).getTime();
    return now - date <= window30d;
  });

  const bySymbol: Record<string, any[]> = {};
  for (const t of recent) {
    const sym = t.symbol;
    if (!sym) continue;
    if (!bySymbol[sym]) bySymbol[sym] = [];
    bySymbol[sym].push(t);
  }

  const clusters: ClusterBuy[] = [];
  for (const [sym, txns] of Object.entries(bySymbol)) {
    const uniqueBuyers = new Map<string, any>();
    for (const t of txns) {
      if (!uniqueBuyers.has(t.name)) {
        uniqueBuyers.set(t.name, t);
      }
    }
    if (uniqueBuyers.size >= 3) {
      const buyerList = Array.from(uniqueBuyers.values());
      clusters.push({
        symbol: sym,
        buyers: buyerList.map((b) => ({
          name: b.name,
          date: b.transactionDate || b.filingDate,
          shares: Math.abs(b.change),
          price: b.transactionPrice,
        })),
        totalShares: buyerList.reduce((s, b) => s + Math.abs(b.change), 0),
        latestDate: buyerList
          .map((b) => b.transactionDate || b.filingDate)
          .sort()
          .reverse()[0],
      });
    }
  }

  return clusters.sort(
    (a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
  );
}

export default async function IntelligenceHub() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
        <div className="p-10 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col items-center text-center space-y-6 max-w-md w-full">
          <div className="w-14 h-14 rounded-full border border-[#1e40af]/20 bg-[#1e40af]/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#1e40af]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Edge Access Required
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Intelligence Hub includes insider transaction monitoring,
              political capital flow tracking, and AI signal synthesis. Available
              on Edge and Floor plans. Your current plan is{" "}
              <span className="font-bold text-slate-900 uppercase">
                {tier ?? "Free"}
              </span>
              .
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <DirectUpgradeButton
              tier="edge"
              redirectPath="/dashboard/intelligence"
            >
              Upgrade to Edge
            </DirectUpgradeButton>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-8 py-3 border border-slate-200 hover:border-[#1e40af] text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all rounded-lg"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Data fetches ──────────────────────────────────────────────────────────
  const [insiderTrades, politicalTrades, aiSignals, socialData, newsData] =
    await Promise.all([
      getInsiderTransactions(),
      getCongressionalTrading(),
      getLatestSignals(3),
      getSocialSentiment("MSFT"),
      getNewsSentiment("MSFT"),
    ]);

  // Cluster Buy detection
  const clusterBuys = detectClusterBuys(insiderTrades);

  // Company logos for unique insider-trade symbols
  const insiderSymbols = [...new Set(insiderTrades.map((t: any) => t.symbol).filter(Boolean))];
  const companyProfiles = await getCompanyProfiles(insiderSymbols);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <PageHeader
        eyebrow="// ALT-DATA & AI SIGNALS"
        title="Alt-Data & Signals"
        description="Real-time tracking of corporate insider conviction, congressional capital flows, and AI signal synthesis across 15 major equities."
      />

      <IntelligenceHubClient
        initialInsiderTrades={insiderTrades}
        politicalTrades={politicalTrades}
        aiSignals={aiSignals}
        clusterBuys={clusterBuys}
        companyProfiles={companyProfiles}
        initialSocialSentiment={socialData}
        initialNewsSentiment={newsData}
      />
    </div>
  );
}
