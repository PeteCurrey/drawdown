import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getInsiderTransactions,
  getCongressionalTrading,
  getSocialSentiment,
  getNewsSentiment,
  getCompanyProfiles,
  INTELLIGENCE_SYMBOLS,
} from "@/lib/market";
import { getLatestSignals } from "@/lib/intelligence-ai";
import {
  TrendingUp,
  Landmark,
  UserCheck,
  ArrowUpRight,
  Info,
  Zap,
  MessageCircle,
  Newspaper,
  Gauge,
  Lock,
  Users,
  Activity,
  AlertTriangle,
  ExternalLink,
  BarChart2,
  GitMerge,
  Volume2,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

// ── Tier weights ────────────────────────────────────────────────────────────
const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  foundation: 1,
  edge: 2,
  floor: 3,
};

// ── Transaction code → human label ─────────────────────────────────────────
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

function txLabel(code: string) {
  return TX_CODE[code] ?? code;
}

function isBuy(code: string, change: number) {
  return code === "P" || code === "M" || code === "J" || (code === "A" && change > 0);
}

// ── Cluster Buy detection ───────────────────────────────────────────────────
// Groups insider transactions by symbol within a rolling 30-day window.
// Flags when 3+ distinct executives buy the same stock in that window.
interface ClusterBuy {
  symbol: string;
  buyers: { name: string; date: string; shares: number; price: number }[];
  totalShares: number;
  latestDate: string;
}

function detectClusterBuys(trades: any[]): ClusterBuy[] {
  const now = Date.now();
  const window30d = 30 * 24 * 3600 * 1000;

  // Filter to purchases only, within 30-day window
  const recent = trades.filter((t) => {
    if (!isBuy(t.transactionCode, t.change)) return false;
    const date = new Date(t.transactionDate || t.filingDate).getTime();
    return now - date <= window30d;
  });

  // Group by symbol
  const bySymbol: Record<string, any[]> = {};
  for (const t of recent) {
    const sym = t.symbol;
    if (!sym) continue;
    if (!bySymbol[sym]) bySymbol[sym] = [];
    bySymbol[sym].push(t);
  }

  const clusters: ClusterBuy[] = [];
  for (const [sym, txns] of Object.entries(bySymbol)) {
    // De-duplicate by executive name (same person buying twice still = 1 executive)
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

// ── Signal type icons ────────────────────────────────────────────────────────
function SignalTypeIcon({ type }: { type: string }) {
  if (type === "insider_cluster")
    return <Users className="w-3.5 h-3.5 text-[#1e40af]" />;
  if (type === "unusual_volume")
    return <Volume2 className="w-3.5 h-3.5 text-[#0ea5e9]" />;
  return <GitMerge className="w-3.5 h-3.5 text-[#6366f1]" />;
}

function signalTypeLabel(type: string) {
  if (type === "insider_cluster") return "Cluster";
  if (type === "unusual_volume") return "Vol Spike";
  return "Correlation";
}

// ─── Page ───────────────────────────────────────────────────────────────────
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
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center px-8 py-4 bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg"
            >
              Upgrade to Edge
            </Link>
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
      getInsiderTransactions(), // full curated 15-symbol list
      getCongressionalTrading(),
      getLatestSignals(3),
      getSocialSentiment("MSFT"), // largest by market cap as representative
      getNewsSentiment("MSFT"),
    ]);

  // Cluster Buy detection
  const clusterBuys = detectClusterBuys(insiderTrades);

  // Company logos for unique insider-trade symbols
  const insiderSymbols = [...new Set(insiderTrades.slice(0, 30).map((t: any) => t.symbol).filter(Boolean))];
  const companyProfiles = await getCompanyProfiles(insiderSymbols);

  // ── Accent token ──────────────────────────────────────────────────────────
  // Navy/deep-blue — not claimed by Algo Builder (violet) or Journal (indigo)
  const accent = "#1e40af";
  const accentLight = "#dbeafe";
  const accentDark = "#1d4ed8";

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <PageHeader
        eyebrow="// ALT-DATA & AI SIGNALS"
        title="Alt-Data & Signals"
        description="Real-time tracking of corporate insider conviction, congressional capital flows, and AI signal synthesis across 15 major equities."
      />

      {/* ── Methodology Strip ─────────────────────────────────────────────── */}
      <div className="p-5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl flex items-start gap-4">
        <Info className="w-4 h-4 text-[#1e40af] shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-[#1e40af] uppercase tracking-widest">
            Data Sources & Methodology
          </p>
          <p className="text-xs text-[#1e3a8a] leading-relaxed">
            <strong>Insider Tracker</strong> — SEC Form 4 filings reported by
            corporate directors, officers, and 10% shareholders via Finnhub
            (sourced from EDGAR). Covers 15 major U.S. equities updated hourly.{" "}
            <strong>Cluster Buys</strong> are flagged when 3+ distinct executives
            purchase the same stock within a rolling 30-day window — historically
            one of the strongest non-public conviction signals available.{" "}
            <strong>Political Alpha</strong> — U.S. STOCK Act periodic transaction
            reports filed with the SEC by members of Congress and their
            immediate families (Form PT via EDGAR). Updated every 6 hours.{" "}
            <strong>Sentiment Pulse</strong> — Derived from keyword frequency
            analysis across live financial RSS feeds (ForexLive, Yahoo Finance,
            BBC Business, Investing.com). Bullish/bearish scoring is fully
            observable and source-traceable — not a black-box model.
          </p>
        </div>
      </div>

      {/* ── Cluster Buy Alert Section ──────────────────────────────────────── */}
      {clusterBuys.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#1e40af] animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
              Cluster Buy Alerts — 30 Day Window
            </h2>
            <span className="px-2 py-0.5 bg-[#1e40af] text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
              {clusterBuys.length} Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusterBuys.slice(0, 4).map((cluster) => {
              const profile = companyProfiles[cluster.symbol];
              return (
                <div
                  key={cluster.symbol}
                  className="p-5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {profile?.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={profile.logo}
                          alt={cluster.symbol}
                          className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-100 p-0.5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#1e40af] flex items-center justify-center">
                          <span className="text-white text-[9px] font-black">
                            {cluster.symbol.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase">
                          {cluster.symbol}
                        </p>
                        <p className="text-[9px] font-mono text-[#1e40af] uppercase">
                          {profile?.industry ?? "Equity"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#1e40af] text-white text-[9px] font-bold uppercase tracking-widest rounded">
                      {cluster.buyers.length} Executives
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {cluster.buyers.slice(0, 3).map((b) => (
                      <div
                        key={b.name}
                        className="flex items-center justify-between text-[10px] font-mono"
                      >
                        <span className="text-slate-600 truncate max-w-[180px]">
                          {b.name}
                        </span>
                        <span className="text-emerald-600 font-bold">
                          +{b.shares.toLocaleString()} shares
                        </span>
                      </div>
                    ))}
                    {cluster.buyers.length > 3 && (
                      <p className="text-[9px] text-slate-400 font-mono">
                        +{cluster.buyers.length - 3} more buyers
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#bfdbfe]">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      Latest:{" "}
                      {new Date(cluster.latestDate).toLocaleDateString("en-GB")}
                    </span>
                    <span className="text-[10px] font-bold text-[#1e40af]">
                      {cluster.totalShares.toLocaleString()} total shares
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── AI Signals Strip ──────────────────────────────────────────────── */}
      {aiSignals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-[#1e40af]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
              AI Intelligence Signals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSignals.map((signal: any) => {
              const score = signal.confidence_score ?? 0;
              const scorePercent = Math.round(score * 100);
              return (
                <div
                  key={signal.id}
                  className="p-5 bg-white border border-slate-200 rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <SignalTypeIcon type={signal.type} />
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{
                        background:
                          signal.type === "insider_cluster"
                            ? "#dbeafe"
                            : signal.type === "unusual_volume"
                            ? "#e0f2fe"
                            : "#e0e7ff",
                        color:
                          signal.type === "insider_cluster"
                            ? "#1e40af"
                            : signal.type === "unusual_volume"
                            ? "#0369a1"
                            : "#4338ca",
                      }}
                    >
                      {signalTypeLabel(signal.type)}
                    </span>
                    <span
                      className={cn(
                        "ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded",
                        signal.severity === "high"
                          ? "bg-red-50 text-red-600"
                          : signal.severity === "medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      )}
                    >
                      {signal.severity}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {signal.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {signal.content}
                  </p>

                  {/* Confidence meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        Confidence
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#1e40af]">
                        {scorePercent}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-full transition-all"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Related symbols */}
                  {signal.related_symbols?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {signal.related_symbols.map((sym: string) => (
                        <span
                          key={sym}
                          className="px-1.5 py-0.5 bg-[#eff6ff] border border-[#bfdbfe] text-[9px] font-mono text-[#1e40af] rounded"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Insider Trading Tracker ───────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[#1e40af]" />
              <h2 className="text-base font-bold uppercase tracking-widest text-slate-900">
                Insider Tracker
              </h2>
            </div>
            <span className="text-[9px] font-mono text-[#1e40af] uppercase tracking-widest font-bold bg-[#eff6ff] border border-[#bfdbfe] px-2 py-1 rounded">
              15 Symbols · SEC Form 4
            </span>
          </div>

          <div className="flex-grow overflow-x-auto">
            {insiderTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <CircleDot className="w-8 h-8 text-slate-200" />
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  No filings in the last 7 days
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Executive</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3 text-right">Shares / Price</th>
                    <th className="px-5 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {insiderTrades.slice(0, 10).map((trade: any, i: number) => {
                    const sym = trade.symbol;
                    const prof = companyProfiles[sym];
                    const buy = isBuy(trade.transactionCode, trade.change);
                    const accessionId = trade.id ?? "";
                    const secUrl = accessionId
                      ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&filenum=${accessionId}&type=4&dateb=&owner=include&count=10`
                      : null;
                    return (
                      <tr
                        key={`${sym}-${i}`}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {prof?.logo ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={prof.logo}
                                alt={sym}
                                className="w-6 h-6 rounded object-contain bg-white border border-slate-100"
                              />
                            ) : (
                              <div
                                className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-black text-white"
                                style={{ background: "#1e40af" }}
                              >
                                {sym?.slice(0, 2)}
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-900">
                              {sym}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700 truncate max-w-[120px]">
                              {trade.name || "OFFICER"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-mono">
                              {txLabel(trade.transactionCode)}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                              buy
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-500"
                            )}
                          >
                            {buy ? "Buy" : "Sell"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <p className="text-[11px] font-mono text-slate-700">
                            {Math.abs(trade.change ?? 0).toLocaleString()} sh
                          </p>
                          {trade.transactionPrice > 0 && (
                            <p className="text-[9px] font-mono text-slate-400">
                              @ ${trade.transactionPrice.toFixed(2)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <p className="text-[10px] font-mono text-slate-500">
                            {trade.transactionDate
                              ? new Date(trade.transactionDate).toLocaleDateString("en-GB")
                              : "—"}
                          </p>
                          {secUrl && (
                            <a
                              href={secUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] font-mono text-[#1e40af] hover:underline flex items-center gap-0.5 justify-end mt-0.5"
                            >
                              SEC <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ── Political Alpha Tracker ───────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-[#1e40af]" />
              <h2 className="text-base font-bold uppercase tracking-widest text-slate-900">
                Political Alpha
              </h2>
            </div>
            <span className="text-[9px] font-mono text-[#1e40af] uppercase tracking-widest font-bold bg-[#eff6ff] border border-[#bfdbfe] px-2 py-1 rounded">
              U.S. STOCK ACT · EDGAR
            </span>
          </div>

          <div className="flex-grow overflow-x-auto">
            {politicalTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <CircleDot className="w-8 h-8 text-slate-200" />
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  No filings in the last 60 days
                </p>
                <p className="text-[10px] text-slate-300 font-mono text-center max-w-48">
                  STOCK Act PT reports are filed within 45 days of a transaction
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Representative</th>
                    <th className="px-5 py-3">Security</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3 text-right">Filed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {politicalTrades.slice(0, 10).map((trade: any, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-700 truncate max-w-[140px]">
                            {trade.name || "U.S. Representative"}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">
                            {trade.owner || "Congress"}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[#1e40af] font-bold">
                        {trade.symbol || "N/A"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                            trade.transactionType === "Purchase"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          )}
                        >
                          {trade.transactionType === "Purchase" ? "BUY" : "SELL"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <p className="text-[10px] font-mono text-slate-500">
                          {trade.filingDate
                            ? new Date(trade.filingDate).toLocaleDateString("en-GB")
                            : "—"}
                        </p>
                        {trade.filingUrl && (
                          <a
                            href={trade.filingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-mono text-[#1e40af] hover:underline flex items-center gap-0.5 justify-end mt-0.5"
                          >
                            EDGAR <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* ── Sentiment Pulse ──────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Gauge className="w-5 h-5 text-[#1e40af]" />
          <h2 className="text-base font-bold uppercase tracking-widest text-slate-900">
            Sentiment Pulse
          </h2>
          <span className="text-[9px] font-mono text-slate-400 uppercase">
            MSFT · RSS Keyword Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Social Sentiment */}
          <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#1e40af]" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                    Social Buzz
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                    Financial RSS · Keyword Frequency
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                {socialData?.mentions ?? 0} articles matched
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono uppercase font-bold">
                <span className="text-red-400">Bearish</span>
                <span className="text-emerald-500">Bullish</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((socialData?.score ?? 0.5) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    {Math.round((socialData?.score ?? 0.5) * 100)}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase ml-2">
                    bullish signal
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-500">
                    <span className="text-emerald-600 font-bold">
                      {socialData?.bullishCount ?? 0} bull
                    </span>
                    {" / "}
                    <span className="text-red-500 font-bold">
                      {socialData?.bearishCount ?? 0} bear
                    </span>{" "}
                    keywords
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* News Sentiment */}
          <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Newspaper className="w-5 h-5 text-[#1e40af]" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                    Institutional News Bias
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                    Financial RSS · Sentiment Scoring
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                Sector avg: {Math.round((newsData?.sectorAvgSentiment ?? 0.52) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
                <span>0% Bullish</span>
                <span>100% Bullish</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-[#1e40af] rounded-full transition-all duration-1000"
                  style={{ width: `${((newsData?.sentiment ?? 0.5) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    {Math.round((newsData?.sentiment ?? 0.5) * 100)}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase ml-2">
                    positive coverage
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-500">
                    Buzz index:{" "}
                    <span className="text-[#1e40af] font-bold">
                      {Math.round((newsData?.buzz ?? 0) * 100)}%
                    </span>
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">
                    {newsData?.articleCount ?? 0} matched articles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
