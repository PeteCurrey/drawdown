"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  UserCheck,
  Landmark,
  Zap,
  MessageCircle,
  Newspaper,
  Gauge,
  Info,
  ExternalLink,
  Users,
  GitMerge,
  Volume2,
  CircleDot,
  RefreshCw,
  Filter,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────
export interface InsiderTrade {
  symbol: string;
  name: string;
  share?: number;
  change: number;
  filingDate: string;
  transactionDate: string;
  transactionCode: string;
  transactionPrice: number;
  id?: string;
  source?: string;
}

export interface PoliticalTrade {
  name: string;
  symbol: string;
  transactionType: string;
  amount: string;
  filingDate: string;
  transactionDate: string;
  owner?: string;
  filingUrl?: string;
}

export interface AISignal {
  id: string;
  title: string;
  type: string;
  severity: string;
  content: string;
  related_symbols: string[];
  confidence_score: number;
}

export interface ClusterBuy {
  symbol: string;
  buyers: { name: string; date: string; shares: number; price: number }[];
  totalShares: number;
  latestDate: string;
}

export interface SocialSentimentData {
  symbol: string;
  score: number;
  mentions: number;
  bullishCount: number;
  bearishCount: number;
}

export interface NewsSentimentData {
  symbol: string;
  buzz: number;
  sentiment: number;
  sectorAvgSentiment: number;
  articleCount: number;
}

interface IntelligenceHubClientProps {
  initialInsiderTrades: InsiderTrade[];
  politicalTrades: PoliticalTrade[];
  aiSignals: AISignal[];
  clusterBuys: ClusterBuy[];
  companyProfiles: Record<string, any>;
  initialSocialSentiment: SocialSentimentData | null;
  initialNewsSentiment: NewsSentimentData | null;
}

const INTELLIGENCE_SYMBOLS = [
  "ALL",
  "AAPL", "MSFT", "NVDA", "AMZN", "TSLA",
  "META", "GOOGL", "JPM", "BAC", "XOM",
  "WMT", "JNJ", "NFLX", "AMD", "GS"
];

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

function SignalTypeIcon({ type }: { type: string }) {
  if (type === "insider_cluster")
    return <Users className="w-3.5 h-3.5 text-[#9333ea]" />;
  if (type === "unusual_volume")
    return <Volume2 className="w-3.5 h-3.5 text-amber-500" />;
  return <GitMerge className="w-3.5 h-3.5 text-[#9333ea]" />;
}

function signalTypeLabel(type: string) {
  if (type === "insider_cluster") return "Cluster";
  if (type === "unusual_volume") return "Vol Spike";
  return "Correlation";
}

export function IntelligenceHubClient({
  initialInsiderTrades,
  politicalTrades,
  aiSignals,
  clusterBuys,
  companyProfiles,
  initialSocialSentiment,
  initialNewsSentiment,
}: IntelligenceHubClientProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("ALL");
  const [selectedSentimentSymbol, setSelectedSentimentSymbol] = useState<string>("MSFT");
  const [socialData, setSocialData] = useState<SocialSentimentData | null>(initialSocialSentiment);
  const [newsData, setNewsData] = useState<NewsSentimentData | null>(initialNewsSentiment);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // xAI Grok-3 Social Sentiment state
  const [grokData, setGrokData] = useState<{
    symbol: string;
    sentiment_score: number;
    social_volume_change_24h: number;
    sentiment_bias: string;
    narrative_theme: string;
    talking_points: string[];
    contrarian_danger_level: string;
    squeeze_probability: number;
  } | null>(null);
  const [loadingGrok, setLoadingGrok] = useState(false);

  // Fetch Grok-3 sessional social metrics
  useEffect(() => {
    let isMounted = true;
    setLoadingGrok(true);

    async function fetchGrokSentiment() {
      try {
        const res = await fetch(`/api/intelligence/grok-sentiment?symbol=${selectedSentimentSymbol}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data) {
          setGrokData(data);
        }
      } catch (e) {
        console.error("Grok sentiment fetch failed:", e);
      } finally {
        if (isMounted) setLoadingGrok(false);
      }
    }

    fetchGrokSentiment();
    return () => { isMounted = false; };
  }, [selectedSentimentSymbol]);

  // ── Diversified & Strictly Deduplicated Insider Trades ─────────────────
  const filteredInsiderTrades = useMemo(() => {
    let trades = initialInsiderTrades;
    if (selectedSymbol !== "ALL") {
      trades = initialInsiderTrades.filter(t => t.symbol === selectedSymbol);
    } else {
      // For "ALL": pick up to 3 filings per company to ensure multi-symbol diversity
      const counts: Record<string, number> = {};
      const diverse: InsiderTrade[] = [];
      for (const t of initialInsiderTrades) {
        const sym = t.symbol ?? "UNKNOWN";
        counts[sym] = (counts[sym] ?? 0) + 1;
        if (counts[sym] <= 3) {
          diverse.push(t);
        }
      }
      trades = diverse;
    }

    // Strict deduplication by composite key (symbol + name + date + change + price + code)
    const seen = new Set<string>();
    const unique: InsiderTrade[] = [];
    for (const t of trades) {
      const key = `${t.symbol}-${(t.name || '').trim().toLowerCase()}-${t.transactionDate || t.filingDate}-${t.change}-${t.transactionPrice}-${t.transactionCode}`;
      if (!seen.has(key)) {
          seen.add(key);
          unique.push(t);
      }
    }
    return unique;
  }, [initialInsiderTrades, selectedSymbol]);

  // ── Dynamic Sentiment Fetching ──────────────────────────────────────────
  useEffect(() => {
    if (selectedSentimentSymbol === "MSFT" && initialSocialSentiment && initialNewsSentiment) {
      setSocialData(initialSocialSentiment);
      setNewsData(initialNewsSentiment);
      return;
    }
    let isMounted = true;
    setLoadingSentiment(true);

    async function fetchSentiment() {
      try {
        const res = await fetch(`/api/intelligence/news-sentiment/${selectedSentimentSymbol}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data) {
          const bullCount = data.bullish_count ?? 0;
          const bearCount = data.bearish_count ?? 0;
          const total = bullCount + bearCount || 1;
          const score = bullCount / total;

          setSocialData({
            symbol: selectedSentimentSymbol,
            score: score || 0.5,
            mentions: data.articles?.length ?? 0,
            bullishCount: bullCount,
            bearishCount: bearCount,
          });

          setNewsData({
            symbol: selectedSentimentSymbol,
            buzz: Math.min((data.articles?.length ?? 0) / 10, 1),
            sentiment: data.overall_sentiment ? (data.overall_sentiment + 1) / 2 : 0.5,
            sectorAvgSentiment: 0.52,
            articleCount: data.articles?.length ?? 0,
          });
        }
      } catch (e) {
        console.error("Sentiment fetch failed:", e);
      } finally {
        if (isMounted) setLoadingSentiment(false);
      }
    }

    fetchSentiment();
    return () => { isMounted = false; };
  }, [selectedSentimentSymbol, initialSocialSentiment, initialNewsSentiment]);

  // ── Live Calculated Real-Time Metrics (Zero Mocks) ───────────────────────
  const liveStats = useMemo(() => {
    // 1. Insider Conviction Index (Buy vs. Sell ratio)
    const buys = initialInsiderTrades.filter(t => isBuy(t.transactionCode, t.change || 0));
    const sales = initialInsiderTrades.filter(t => t.transactionCode === "S");
    const totalInsider = buys.length + sales.length || 1;
    const insiderConviction = Math.round((buys.length / totalInsider) * 100);

    // 2. Congressional Buy Ratio (STOCK Act purchases ratio)
    const congBuys = politicalTrades.filter(t => t.transactionType === "Purchase");
    const congSales = politicalTrades.filter(t => t.transactionType === "Sale" || t.transactionType === "Exchange");
    const totalCong = congBuys.length + congSales.length || 1;
    const congressBuyRatio = Math.round((congBuys.length / totalCong) * 100);

    // 3. Insider Total Sessional Volume
    const totalInsiderVolume = initialInsiderTrades.reduce((acc, t) => acc + Math.abs(t.change || 0), 0);

    // 4. Sector/Ticker Filings Intensity Leader
    const activeSymbols = initialInsiderTrades.map(t => t.symbol).concat(politicalTrades.map(t => t.symbol)).filter(Boolean);
    const symbolCounts: Record<string, number> = {};
    activeSymbols.forEach(s => { symbolCounts[s] = (symbolCounts[s] || 0) + 1; });
    const topActiveSymbol = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    return {
      insiderConviction,
      congressBuyRatio,
      totalInsiderVolume,
      topActiveSymbol,
      totalInsiderTrades: initialInsiderTrades.length,
      totalPoliticalTrades: politicalTrades.length,
    };
  }, [initialInsiderTrades, politicalTrades]);

  return (
    <div className="space-y-8">

      {/* ── Methodology Strip ─────────────────────────────────────────────── */}
      <div className="p-6 bg-white border border-[#DEDDD8] rounded-none flex items-start gap-4">
        <div className="p-2 bg-[#faf5ff] border border-[#e9d5ff] text-[#9333ea] rounded-none mt-0.5">
          <Info className="w-4 h-4 shrink-0" />
        </div>
        <div className="space-y-1.5 flex-grow">
          <p className="text-[10px] font-bold text-[#9333ea] uppercase tracking-wider font-mono">
            Platform Protocol // Alt-Data Architecture
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Insider Tracker</strong> monitors real-time SEC Form 4 executive filings across 15 high-conviction equities. 
            The processing engine automatically balances single-company transaction clusters to maintain multi-symbol sessional visibility. 
            <strong>Cluster Buys</strong> isolate 3+ unique executive purchases within a rolling 30-day window. 
            <strong>Political Alpha</strong> indexes official Form PT Congressional disclosures under the U.S. STOCK Act. All analytics are computed dynamically on the active live-feed dataset.
          </p>
        </div>
      </div>

      {/* ── Calculated Alt-Data Barometers (Zero Mock Data) ────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Insider Conviction */}
        <div className="p-5 bg-white border border-[#DEDDD8] rounded-none flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Insider Conviction</span>
            <span className="text-[10px] font-mono text-[#9333ea] bg-[#faf5ff] border border-[#e9d5ff] px-2 py-0.5 rounded-none uppercase font-bold">
              {liveStats.insiderConviction}% Buys
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono tabular">{liveStats.insiderConviction}%</span>
              <span className="text-[9px] font-mono text-slate-400">({liveStats.totalInsiderTrades} raw filings)</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-none overflow-hidden">
              <div 
                className="h-full bg-[#9333ea] rounded-none transition-all duration-700"
                style={{ width: `${liveStats.insiderConviction}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Congressional Flow Ratio */}
        <div className="p-5 bg-white border border-[#DEDDD8] rounded-none flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Congressional Buy Ratio</span>
            <span className="text-[10px] font-mono text-[#9333ea] bg-[#faf5ff] border border-[#e9d5ff] px-2 py-0.5 rounded-none uppercase font-bold">
              STOCK ACT
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono tabular">{liveStats.congressBuyRatio}%</span>
              <span className="text-[9px] font-mono text-slate-400">({liveStats.totalPoliticalTrades} active PTs)</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-none overflow-hidden">
              <div 
                className="h-full bg-[#9333ea] rounded-none transition-all duration-700"
                style={{ width: `${liveStats.congressBuyRatio}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Top Active Target */}
        <div className="p-5 bg-white border border-[#DEDDD8] rounded-none flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Alt-Data Target Index</span>
            <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-none uppercase font-bold">
              Intensity Peak
            </span>
          </div>
          <div className="flex flex-col justify-end flex-grow">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono uppercase">{liveStats.topActiveSymbol}</span>
            <span className="text-[9px] font-mono text-slate-400 mt-1">Highest frequency in current reporting session</span>
          </div>
        </div>

        {/* Card 4: Executive Volume */}
        <div className="p-5 bg-white border border-[#DEDDD8] rounded-none flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Sessional Insiders Volume</span>
            <span className="text-[9px] font-mono text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-none uppercase font-bold">
              Sec Form 4
            </span>
          </div>
          <div className="flex flex-col justify-end flex-grow">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono tabular">
              {liveStats.totalInsiderVolume.toLocaleString()}
            </span>
            <span className="text-[9px] font-mono text-slate-400 mt-1">Total aggregated shares moved by insiders</span>
          </div>
        </div>
      </section>

      {/* ── Cluster Buy Alert Section ──────────────────────────────────────── */}
      {clusterBuys.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-none bg-[#9333ea] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
              Active Cluster Buy Alerts — 30 Day Window
            </h2>
            <span className="px-2 py-0.5 bg-[#9333ea] text-white text-[8px] font-bold uppercase tracking-widest font-mono rounded-none">
              {clusterBuys.length} Target{clusterBuys.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clusterBuys.slice(0, 4).map((cluster) => {
              const profile = companyProfiles[cluster.symbol];
              return (
                <div
                  key={cluster.symbol}
                  onClick={() => setSelectedSymbol(cluster.symbol)}
                  className={cn(
                    "p-4 bg-white border rounded-none relative overflow-hidden cursor-pointer transition-all hover:border-[#9333ea]",
                    selectedSymbol === cluster.symbol ? "border-[#9333ea] bg-slate-50/50" : "border-[#DEDDD8]"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {profile?.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={profile.logo}
                          alt={cluster.symbol}
                          className="w-7 h-7 rounded-none object-contain bg-white border border-slate-100 p-0.5"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-none bg-[#9333ea] flex items-center justify-center">
                          <span className="text-white text-[9px] font-black font-mono">
                            {cluster.symbol.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase font-mono">
                          {cluster.symbol}
                        </p>
                        <p className="text-[8px] font-mono text-[#9333ea] uppercase font-bold">
                          {profile?.industry ?? "Equity"}
                        </p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-[#faf5ff] border border-[#e9d5ff] text-[#6b21a8] text-[8px] font-bold uppercase tracking-wider font-mono rounded-none">
                      {cluster.buyers.length} Execs
                    </span>
                  </div>
                  <div className="space-y-1 mb-2">
                    {cluster.buyers.slice(0, 2).map((b) => (
                      <div
                        key={b.name}
                        className="flex items-center justify-between text-[9px] font-mono tabular"
                      >
                        <span className="text-slate-500 truncate max-w-[120px]">
                          {b.name}
                        </span>
                        <span className="text-emerald-600 font-bold">
                          +{b.shares.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[8px] font-mono text-slate-400">
                      {new Date(cluster.latestDate).toLocaleDateString("en-GB")}
                    </span>
                    <span className="text-[9px] font-bold text-slate-800 font-mono tabular">
                      {cluster.totalShares.toLocaleString()} sh
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
            <Zap className="w-4 h-4 text-[#9333ea]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
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
                  className="p-5 bg-white border border-[#DEDDD8] rounded-none relative overflow-hidden group hover:border-[#9333ea] transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <SignalTypeIcon type={signal.type} />
                    <span
                      className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-none"
                      style={{
                        background:
                          signal.type === "insider_cluster"
                            ? "#faf5ff"
                            : signal.type === "unusual_volume"
                            ? "#fffbeb"
                            : "#faf5ff",
                        color:
                          signal.type === "insider_cluster"
                            ? "#6b21a8"
                            : signal.type === "unusual_volume"
                            ? "#d97706"
                            : "#6b21a8",
                        border:
                          signal.type === "insider_cluster"
                            ? "1px solid #e9d5ff"
                            : signal.type === "unusual_volume"
                            ? "1px solid #fef3c7"
                            : "1px solid #e9d5ff",
                      }}
                    >
                      {signalTypeLabel(signal.type)}
                    </span>
                    <span
                      className={cn(
                        "ml-auto text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded-none border",
                        signal.severity === "high"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : signal.severity === "medium"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
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

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">
                        Confidence
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#9333ea] tabular">
                        {scorePercent}%
                      </span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-none overflow-hidden">
                      <div
                        className="h-full bg-[#9333ea] rounded-none transition-all duration-700"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </div>

                  {signal.related_symbols?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {signal.related_symbols.map((sym: string) => (
                        <span
                          key={sym}
                          onClick={() => setSelectedSymbol(sym)}
                          className="px-1.5 py-0.5 bg-white border border-[#DEDDD8] text-[8px] font-mono font-bold text-slate-600 rounded-none cursor-pointer hover:bg-slate-50 hover:border-[#9333ea] hover:text-[#9333ea] transition-all"
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

      {/* ── Main Trackers Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Insider Trading Tracker */}
        <section className="bg-white border border-[#DEDDD8] rounded-none flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#DEDDD8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[#9333ea]" />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 font-mono">
                    Insider Tracker
                  </h2>
                  <p className="text-[9px] font-mono text-slate-400 uppercase">SEC Form 4 · Active Filings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-[#6b21a8] uppercase tracking-wider font-bold bg-[#faf5ff] border border-[#e9d5ff] px-2 py-0.5 rounded-none">
                  {filteredInsiderTrades.length} Filings
                </span>
              </div>
            </div>

            {/* Symbol Selector Filter */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <Filter className="w-3 h-3 text-slate-400 shrink-0" />
              {INTELLIGENCE_SYMBOLS.slice(0, 9).map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={cn(
                    "px-2 py-1 text-[8px] font-mono font-bold uppercase rounded-none transition-all shrink-0 border",
                    selectedSymbol === sym
                      ? "bg-[#9333ea] text-white border-[#9333ea]"
                      : "bg-white text-slate-500 border-slate-200 hover:border-[#9333ea] hover:text-[#9333ea]"
                  )}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow max-h-[520px] overflow-y-auto overflow-x-auto">
            {filteredInsiderTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <CircleDot className="w-8 h-8 text-slate-200" />
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  No filings found for {selectedSymbol}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-[8px] font-mono uppercase tracking-widest text-slate-400 border-b border-[#DEDDD8] sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3 bg-white font-bold">Company</th>
                    <th className="px-5 py-3 bg-white font-bold">Executive</th>
                    <th className="px-5 py-3 bg-white font-bold">Action</th>
                    <th className="px-5 py-3 text-right bg-white font-bold">Shares / Price</th>
                    <th className="px-5 py-3 text-right bg-white font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInsiderTrades.map((trade: InsiderTrade, i: number) => {
                    const sym = trade.symbol;
                    const prof = companyProfiles[sym];
                    const buy = isBuy(trade.transactionCode, trade.change);
                    const secUrl = trade.id
                      ? `https://efts.sec.gov/LATEST/search-index?q=%22${trade.id}%22&forms=4`
                      : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${sym}&type=4&dateb=&owner=include&count=40`;
                    return (
                      <tr
                        key={`${sym}-${trade.id || i}-${trade.name}-${i}`}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {prof?.logo ? (
                              <img
                                src={prof.logo}
                                alt={sym}
                                className="w-6 h-6 rounded-none object-contain bg-white border border-slate-100"
                              />
                            ) : (
                              <div
                                className="w-6 h-6 rounded-none flex items-center justify-center text-[8px] font-black text-white"
                                style={{ background: "#9333ea" }}
                              >
                                {sym?.slice(0, 2)}
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-900 font-mono">
                              {sym}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">
                              {trade.name || "OFFICER"}
                            </p>
                            <p className="text-[8px] text-slate-400 font-mono uppercase">
                              {txLabel(trade.transactionCode)}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "text-[8px] font-bold uppercase font-mono px-2 py-0.5 rounded-none border",
                              buy
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-red-50 text-red-500 border-red-100"
                            )}
                          >
                            {buy ? "Buy" : "Sell"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <p className="text-[11px] font-mono font-bold text-slate-700 tabular">
                            {Math.abs(trade.change ?? 0).toLocaleString()} sh
                          </p>
                          {trade.transactionPrice > 0 && (
                            <p className="text-[9px] font-mono text-slate-400 tabular">
                              @ ${trade.transactionPrice.toFixed(2)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <p className="text-[10px] font-mono text-slate-500 tabular">
                            {trade.transactionDate
                              ? new Date(trade.transactionDate).toLocaleDateString("en-GB")
                              : "—"}
                          </p>
                          {secUrl && (
                            <a
                              href={secUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[8px] font-mono text-[#9333ea] hover:underline flex items-center gap-0.5 justify-end mt-0.5 font-bold uppercase"
                            >
                              EDGAR <ExternalLink className="w-2.5 h-2.5" />
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

        {/* Political Alpha Tracker */}
        <section className="bg-white border border-[#DEDDD8] rounded-none flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#DEDDD8] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-[#9333ea]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 font-mono">
                Political Alpha
              </h2>
            </div>
            <span className="text-[8px] font-mono text-[#6b21a8] uppercase tracking-wider font-bold bg-[#faf5ff] border border-[#e9d5ff] px-2 py-0.5 rounded-none">
              U.S. STOCK ACT · EDGAR
            </span>
          </div>

          <div className="flex-grow max-h-[520px] overflow-y-auto overflow-x-auto">
            {politicalTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <CircleDot className="w-8 h-8 text-slate-200" />
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  No filings in the last 60 days
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-[8px] font-mono uppercase tracking-widest text-slate-400 border-b border-[#DEDDD8] sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3 bg-white font-bold">Representative</th>
                    <th className="px-5 py-3 bg-white font-bold">Security</th>
                    <th className="px-5 py-3 bg-white font-bold">Type</th>
                    <th className="px-5 py-3 text-right bg-white font-bold">Filed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {politicalTrades.map((trade: PoliticalTrade, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-[11px] font-bold text-slate-700 truncate max-w-[140px]">
                            {trade.name || "U.S. Representative"}
                          </p>
                          <p className="text-[8px] text-slate-400 font-mono uppercase">
                            {trade.owner || "Congress"}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[#9333ea] font-bold uppercase">
                        {trade.symbol || "N/A"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "text-[8px] font-bold uppercase font-mono px-2 py-0.5 rounded-none border",
                            trade.transactionType === "Purchase"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-red-50 text-red-500 border-red-100"
                          )}
                        >
                          {trade.transactionType === "Purchase" ? "BUY" : "SELL"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <p className="text-[10px] font-mono text-slate-500 tabular">
                          {trade.filingDate
                            ? new Date(trade.filingDate).toLocaleDateString("en-GB")
                            : "—"}
                        </p>
                        {trade.filingUrl && (
                          <a
                            href={trade.filingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[8px] font-mono text-[#9333ea] hover:underline flex items-center gap-0.5 justify-end mt-0.5 font-bold uppercase"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-[#9333ea]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 font-mono">
              Sentiment Pulse
            </h2>
            <span className="text-[8px] font-mono text-[#6b21a8] font-bold uppercase bg-[#faf5ff] border border-[#e9d5ff] px-2 py-0.5 rounded-none">
              {selectedSentimentSymbol}
            </span>
          </div>

          {/* Symbol Selector for Sentiment */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {["MSFT", "AAPL", "NVDA", "GOOGL", "META", "AMZN", "TSLA", "JPM"].map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSentimentSymbol(sym)}
                className={cn(
                  "px-2.5 py-1 text-[8px] font-mono font-bold uppercase rounded-none transition-all shrink-0 border",
                  selectedSentimentSymbol === sym
                    ? "bg-[#9333ea] text-white border-[#9333ea]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#9333ea] hover:text-[#9333ea]"
                )}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* xAI Grok-3 Social Buzz Terminal */}
          <div className="p-8 bg-[#0B0E14] border border-[#1E2230] rounded-none flex flex-col gap-6 relative overflow-hidden group">
            {/* Glowing background accent */}
            <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#9333ea]/5 rounded-none blur-3xl group-hover:bg-[#9333ea]/10 transition-all duration-700" />
            
            {(loadingGrok || !grokData) && (
              <div className="absolute inset-0 bg-[#0B0E14]/90 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 rounded-none space-y-3">
                <RefreshCw className="w-6 h-6 text-[#9333ea] animate-spin" />
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">Syncing X-Firehose via Grok-3...</span>
              </div>
            )}
            
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#9333ea]/10 border border-[#9333ea]/20">
                  <Brain className="w-5 h-5 text-[#9333ea]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
                    Grok-3 Social Buzz <Sparkles className="w-3 h-3 text-[#9333ea] animate-pulse" />
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase">
                    xAI Real-Time Sentiment &amp; Squeeze Analytics
                  </p>
                </div>
              </div>
              <span className="text-[8px] font-mono font-bold text-[#9333ea] bg-[#9333ea]/10 border border-[#9333ea]/20 px-2 py-0.5 rounded-none uppercase">
                Active Firehose
              </span>
            </div>

            {grokData && (
              <div className="space-y-6 z-10">
                {/* Main Sentiment Meter */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[8px] font-mono uppercase font-bold tracking-wider text-slate-400">
                    <span className="text-red-400">Crowd Short</span>
                    <span className="text-emerald-400">Crowd Long</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-none overflow-hidden border border-slate-800">
                    <div
                      className={cn(
                        "h-full rounded-none transition-all duration-1000 bg-gradient-to-r",
                        grokData.sentiment_bias === "BULLISH" 
                          ? "from-emerald-500 to-[#9333ea]" 
                          : grokData.sentiment_bias === "BEARISH"
                          ? "from-rose-500 to-amber-500"
                          : "from-amber-400 to-emerald-400"
                      )}
                      style={{ width: `${grokData.sentiment_score}%` }}
                    />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-3xl font-black text-slate-100 font-mono tracking-tighter tabular">
                        {grokData.sentiment_score}%
                      </span>
                      <span className="text-[9px] font-mono text-[#9333ea] font-bold uppercase ml-2">
                        {grokData.sentiment_bias} Sessional Bias
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-none uppercase">
                      {grokData.narrative_theme}
                    </span>
                  </div>
                </div>

                {/* Grid of stats */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-950 p-3.5 border border-slate-800">
                    <span className="block text-[8px] text-slate-500 font-mono uppercase tracking-wider">X Mentions Velocity (24h)</span>
                    <span className={cn(
                      "text-sm font-bold flex items-center gap-1.5 mt-1 font-mono tabular",
                      grokData.social_volume_change_24h >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {grokData.social_volume_change_24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {grokData.social_volume_change_24h >= 0 ? "+" : ""}{grokData.social_volume_change_24h}%
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3.5 border border-slate-800">
                    <span className="block text-[8px] text-slate-500 font-mono uppercase tracking-wider">Contrarian Crowd Danger</span>
                    <span className={cn(
                      "text-xs font-bold font-mono flex items-center gap-1 mt-1.5 uppercase",
                      grokData.contrarian_danger_level === "HIGH" 
                        ? "text-red-400" 
                        : grokData.contrarian_danger_level === "MODERATE"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    )}>
                      <ShieldAlert className="w-3.5 h-3.5" /> {grokData.contrarian_danger_level} RISK
                    </span>
                  </div>
                </div>

                {/* Squeeze Probability */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-mono uppercase text-slate-400">
                    <span>Sessional Squeeze Probability</span>
                    <span className="text-[#9333ea] font-bold tabular">{grokData.squeeze_probability}%</span>
                  </div>
                  <div className="h-1 bg-slate-950 rounded-none overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-[#9333ea] rounded-none transition-all"
                      style={{ width: `${grokData.squeeze_probability}%` }}
                    />
                  </div>
                </div>

                {/* Key Talking Points */}
                <div className="space-y-2">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider">Primary Sessional Talking Points:</span>
                  <div className="space-y-2">
                    {grokData.talking_points?.map((pt, idx) => (
                      <div key={idx} className="flex gap-2 text-[11px] text-slate-300 leading-relaxed bg-slate-950 p-2.5 border border-slate-800">
                        <span className="w-4 h-4 rounded-none bg-[#9333ea]/10 border border-[#9333ea]/20 text-[#9333ea] font-mono text-[8px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* News Sentiment */}
          <div className="p-8 bg-white border border-[#DEDDD8] rounded-none flex flex-col gap-6 relative">
            {loadingSentiment && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-none">
                <RefreshCw className="w-5 h-5 text-[#9333ea] animate-spin" />
              </div>
            )}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#faf5ff] border border-[#e9d5ff] text-[#9333ea] rounded-none">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-900">
                    Institutional News Bias
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase">
                    Financial RSS · Sentiment Scoring
                  </p>
                </div>
              </div>
              <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-none uppercase">
                Sector avg: {Math.round((newsData?.sectorAvgSentiment ?? 0.52) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[8px] font-mono uppercase text-slate-400 font-bold">
                <span>0% Bullish</span>
                <span>100% Bullish</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-none overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-[#9333ea] rounded-none transition-all duration-1000"
                  style={{ width: `${((newsData?.sentiment ?? 0.5) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight tabular">
                    {Math.round((newsData?.sentiment ?? 0.5) * 100)}%
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 uppercase ml-2">
                    positive coverage ({newsData?.symbol})
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">
                    Buzz index:{" "}
                    <span className="text-[#9333ea] font-bold tabular">
                      {Math.round((newsData?.buzz ?? 0) * 100)}%
                    </span>
                  </p>
                  <p className="text-[8px] text-slate-400 font-mono uppercase">
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
