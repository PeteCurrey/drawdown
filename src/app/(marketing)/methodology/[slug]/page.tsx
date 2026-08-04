import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, CheckCircle2, AlertCircle, Database, Calculator, FileText, ExternalLink, ShieldCheck } from "lucide-react";

// Static fallback data in case database is unreachable during SSG/build
const FALLBACK_CLAIMS_MAP: Record<string, any> = {
  "market-prices": {
    slug: "market-prices",
    title: "Market Price Data & Feeds",
    short_claim: "Calculated from third-party price feeds",
    original_wording: "Real-time institutional prices",
    approved_wording: "Drawdown utilizes commercial third-party market data feeds to display historical prices, sessional volatility, and technical indicator values. Pricing is refreshed periodically and depends on provider endpoints.",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    summary: "How market pricing is pulled, loaded, and updated in our charting and analysis widgets.",
    what_it_means: "Market-price and volume data are used to support technical analysis. It is designed to provide reference data for user analysis.",
    what_it_does_not_mean: "It is not a direct view of institutional order books, and it does not represent order execution or routing. The data is not guaranteed to be latency-free.",
    methodology: "Data is requested via Twelve Data and Finnhub REST and WebSockets endpoints. Technical indicators (RSI, moving averages) are computed client-side or server-side from these price points.",
    data_sources: [
      { name: "Twelve Data API", publisher: "Twelve Data", url: "https://twelvedata.com", dataType: "FX & CFD Reference Prices", updateFrequency: "1-minute bars", delay: "Typically delayed up to 15 minutes unless user connects licensed key" },
      { name: "Finnhub Stock API", publisher: "Finnhub", url: "https://finnhub.io", dataType: "Indices & Equities", updateFrequency: "EOD / Refreshed periodically", delay: "Delayed" }
    ],
    calculations: [
      { title: "Candle Bar calculations", description: "Standard open, high, low, close (OHLC) bar parsing from raw ticks." }
    ],
    limitations: ["Data outages from upstream API providers", "Delayed data is not suitable for high-frequency or real-time trading decision execution"],
    assumptions: ["Upstream data feeds are accurate and representative of the broader interbank market"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "technical-confluence": {
    slug: "technical-confluence",
    title: "Technical Confluence Grid & DCS",
    short_claim: "Mathematical confluence grid from M15 to D1",
    original_wording: "Proven predictive technical signals",
    approved_wording: "The Technical Confluence Grid aggregates moving averages, momentum, and volatility indicators across multiple timeframes (M15 to D1). This is a mathematical calculation and does not predict future prices.",
    category: "technical-analysis",
    status: "derived",
    evidence_strength: "strong",
    summary: "Calculates confluence levels where multiple independent indicators align.",
    what_it_means: "A dashboard visualization highlighting when indicators (RSI, MACD, EMAs) agree on a trend direction across different time horizons.",
    what_it_does_not_mean: "It does not mean a result is guaranteed or that it acts as a trade signal that will always succeed.",
    methodology: "Standard mathematical formulas for RSI, MACD, Exponential Moving Averages, and Average True Range are executed server-side using Twelve Data points.",
    calculations: [
      { title: "Dynamic Confluence Score (DCS)", formula: "DCS = w1 * EMA_Align + w2 * RSI_Score + w3 * MACD_Score", description: "Weighted index of indicator alignment across multiple timeframes." }
    ],
    limitations: ["Lagging indicators reflect past price action only", "Ineffective in sideways, range-bound market regimes"],
    assumptions: ["Technical indicators reflect mathematical relationships, not market predictive truth"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "position-sizing": {
    slug: "position-sizing",
    title: "Position Sizing Calculator",
    short_claim: "Mathematical calculator based on user-entered parameters",
    approved_wording: "Position sizes are calculated using standard risk-management formulas based on user-entered parameters (account balance, risk percentage, and stop-loss pips or ATR values).",
    category: "risk-management",
    status: "verified",
    evidence_strength: "strong",
    summary: "Safety calculations to protect capital bases from over-exposure.",
    what_it_means: "A tool to calculate trade sizes in units or lots based on a set risk limit.",
    what_it_does_not_mean: "It is not direct market order routing, and it does not guarantee execution fills at the exact calculated price.",
    methodology: "Lot size = (Balance * Risk%) / (Stop Loss in Pips * Pip Value per Lot). Volatility mode pulls ATR to recommend stops.",
    calculations: [
      { title: "Standard Lot Size Formula", formula: "Lots = (Balance * Risk%) / (Pips * ValuePerPip)", description: "Computes standard position sizes." }
    ],
    limitations: ["Calculated sizes depend entirely on user inputs", "Does not account for broker slippage or market gap risk"],
    assumptions: ["Pip values follow standard interbank lot definitions"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "platform-capabilities": {
    slug: "platform-capabilities",
    title: "Drawdown Platform Scope",
    short_claim: "Trading education and risk-management research platform",
    original_wording: "Professional execution and Direct Market Access platform",
    approved_wording: "Drawdown is a trading education and risk-management research platform. We provide tools, market observations, and educational content. Drawdown does not execute trades, route orders, or manage trading accounts.",
    category: "platform-capability",
    status: "verified",
    evidence_strength: "strong",
    summary: "Clear definition of Drawdown's operational scope and legal boundaries.",
    what_it_means: "All platform calculations, alerts, charts, and materials are for analytical and educational research only.",
    what_it_does_not_mean: "Drawdown is not a broker, not an execution venue, and does not transmit or route orders. Trades are executed independently by the user.",
    methodology: "Manual audits are conducted regularly to ensure all landing pages and applications adhere to this scope.",
    limitations: ["Educational metrics do not represent guarantees of capital gains"],
    assumptions: ["Users execute orders independently at their chosen licensed broker"],
    public: true,
    last_verified_at: new Date().toISOString()
  }
};

async function getClaimBySlug(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase
        .from("methodology_claims")
        .select("*")
        .eq("slug", slug)
        .eq("public", true)
        .single();

      if (data && !error) return data;
    } catch (e) {
      console.warn("Supabase fetch fallback:", e);
    }
  }

  return FALLBACK_CLAIMS_MAP[slug] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const claim = await getClaimBySlug(resolvedParams.slug);

  if (!claim) {
    return {
      title: "Methodology Claim Not Found | Drawdown Trading",
    };
  }

  return {
    title: `${claim.title} - Data & Methodology | Drawdown Trading`,
    description: claim.summary || claim.approved_wording,
  };
}

export default async function MethodologyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const claim = await getClaimBySlug(resolvedParams.slug);

  if (!claim) {
    notFound();
  }

  const dataSources = typeof claim.data_sources === "string" ? JSON.parse(claim.data_sources) : (claim.data_sources || []);
  const calculations = typeof claim.calculations === "string" ? JSON.parse(claim.calculations) : (claim.calculations || []);
  const limitations = typeof claim.limitations === "string" ? JSON.parse(claim.limitations) : (claim.limitations || []);
  const assumptions = typeof claim.assumptions === "string" ? JSON.parse(claim.assumptions) : (claim.assumptions || []);

  return (
    <div className="min-h-screen bg-[#080B11] text-[#E2E8F0] pt-28 pb-20 select-none">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/methodology"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#94A3B8] hover:text-[#00FF87] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Data &amp; Methodology Centre</span>
        </Link>

        {/* Claim Title & Header Badges */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#1E293B] text-[#94A3B8]">
              {claim.category?.replace("-", " ")}
            </span>

            <span
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider border ${
                claim.status === "verified"
                  ? "bg-[#00FF87]/10 text-[#00FF87] border-[#00FF87]/30"
                  : claim.status === "derived"
                  ? "bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/30"
                  : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
              }`}
            >
              {claim.status?.replace("_", " ")}
            </span>

            <span className="text-xs font-mono text-[#94A3B8]">
              Verified: {new Date(claim.last_verified_at || Date.now()).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tight text-white leading-tight">
            {claim.title}
          </h1>

          <p className="text-lg text-[#94A3B8] font-sans leading-relaxed">
            {claim.summary}
          </p>
        </div>

        {/* Main Sections Stack */}
        <div className="space-y-8">
          {/* Section 1: Approved Wording */}
          <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#00FF87]">
              <ShieldCheck className="w-4 h-4" />
              <span>Approved Site-Wide Copy Statement</span>
            </div>
            <blockquote className="text-base font-sans font-medium text-white leading-relaxed pl-4 border-l-2 border-[#00FF87]">
              &quot;{claim.approved_wording}&quot;
            </blockquote>
          </div>

          {/* Section 2: What It Means vs What It Does Not Mean */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#60A5FA]">
                <CheckCircle2 className="w-4 h-4" />
                <span>What It Means</span>
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                {claim.what_it_means}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#F59E0B]">
                <AlertCircle className="w-4 h-4" />
                <span>What It Does NOT Mean</span>
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                {claim.what_it_does_not_mean}
              </p>
            </div>
          </div>

          {/* Section 3: Data Sources */}
          {dataSources.length > 0 && (
            <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white">
                <Database className="w-4 h-4 text-[#00FF87]" />
                <span>Data Sources &amp; Upstream Attribution</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {dataSources.map((ds: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#0B0F17] border border-[#1E293B] space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{ds.name}</span>
                      {ds.url && (
                        <a href={ds.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#00FF87] hover:underline font-mono text-[11px]">
                          <span>Publisher Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px] text-[#94A3B8]">
                      <div>Publisher: <span className="text-[#CBD5E1]">{ds.publisher}</span></div>
                      <div>Type: <span className="text-[#CBD5E1]">{ds.dataType}</span></div>
                      <div>Delay: <span className="text-[#CBD5E1]">{ds.delay || "Real-time"}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Mathematical Calculations */}
          {calculations.length > 0 && (
            <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white">
                <Calculator className="w-4 h-4 text-[#60A5FA]" />
                <span>Mathematical Formulas &amp; Algorithms</span>
              </div>

              <div className="space-y-4">
                {calculations.map((calc: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#0B0F17] border border-[#1E293B] space-y-2">
                    <h4 className="font-bold text-white text-sm font-sans">{calc.title}</h4>
                    {calc.formula && (
                      <div className="p-3 rounded bg-[#080B11] border border-[#1E293B] font-mono text-xs text-[#00FF87]">
                        {calc.formula}
                      </div>
                    )}
                    <p className="text-xs text-[#94A3B8] font-sans">{calc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Limitations & Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {limitations.length > 0 && (
              <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#F59E0B]">Known Limitations</h4>
                <ul className="space-y-2 text-xs text-[#CBD5E1] list-disc list-inside font-sans">
                  {limitations.map((lim: string, idx: number) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}

            {assumptions.length > 0 && (
              <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#60A5FA]">Model Assumptions</h4>
                <ul className="space-y-2 text-xs text-[#CBD5E1] list-disc list-inside font-sans">
                  {assumptions.map((asm: string, idx: number) => (
                    <li key={idx}>{asm}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
