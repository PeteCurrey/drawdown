import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, CheckCircle2, AlertCircle, Database, Calculator, ExternalLink, ShieldCheck } from "lucide-react";

// Expanded Static fallback data in case database is unreachable during SSG/build
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
  },
  "economic-calendar": {
    slug: "economic-calendar",
    title: "Economic Calendar Data",
    short_claim: "Macroeconomic event data sourced from public calendars",
    original_wording: "Real-time economic releases",
    approved_wording: "Drawdown displays global macroeconomic event data sourced from public calendars and economic agencies.",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    summary: "Pulls schedules and actual values of interest rates, inflation indicators, and employment reports.",
    what_it_means: "Users can see scheduled release times, consensus expectations, and actual prints for major economic events.",
    what_it_does_not_mean: "It is not guaranteed to be delivered the exact millisecond the data is published by the government agency.",
    methodology: "The data is sourced via an integration with third-party economic calendars such as ForexFactory or Finnhub.",
    data_sources: [
      { name: "ForexFactory Calendar JSON", publisher: "ForexFactory", dataType: "Macro Economic Calendar", updateFrequency: "Hourly", delay: "Negligible" }
    ],
    limitations: ["Data could be delayed or revised post-release by the issuing authority"],
    assumptions: ["The reporting authority's data is the correct market truth"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "central-banks": {
    slug: "central-banks",
    title: "Central Bank & Macro Policy Rates",
    short_claim: "Macroeconomic indicators from FRED",
    approved_wording: "Macroeconomic metrics and central-bank policy rates are pulled from FRED database.",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    summary: "Visualizing key interest rates and money supply metrics from regional central banks.",
    what_it_means: "Key macroeconomic factors like Fed Funds Rate and M2 Money Supply are visually mapped for educational context.",
    what_it_does_not_mean: "This does not predict central bank meetings or policy outcomes.",
    methodology: "Sourced directly via API from the Federal Reserve Economic Data (FRED) system.",
    data_sources: [
      { name: "FRED API", publisher: "Federal Reserve Bank of St. Louis", url: "https://fred.stlouisfed.org", dataType: "Macroeconomic Metrics", updateFrequency: "Daily", delay: "None" }
    ],
    limitations: ["FRED data series can sometimes be discontinued or re-benchmarked"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "news-sentiment": {
    slug: "news-sentiment",
    title: "News & Sentiment Indicators",
    short_claim: "Social sentiment represents analytical observations",
    approved_wording: "Social sentiment and market news indicators represent analytical observations compiled from third-party API summaries.",
    category: "market-data",
    status: "derived",
    evidence_strength: "moderate",
    summary: "Aggregating news sentiment and social media mentions into general sentiment categories.",
    what_it_means: "An algorithmic tally of positive vs negative keywords in news headlines about a specific asset.",
    what_it_does_not_mean: "It does not guarantee market direction, as markets can often move opposite to retail sentiment.",
    methodology: "Natural language processing checks headline polarity and assigns a score between -1 and 1.",
    calculations: [
      { title: "Sentiment Score", formula: "Score = (Positive_Hits - Negative_Hits) / Total_Articles", description: "Standard NLP sentiment ratio." }
    ],
    limitations: ["Sarcasm or highly contextual phrasing may be incorrectly classified by the NLP"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "ai-consensus": {
    slug: "ai-consensus",
    title: "AI Consensus Panel",
    short_claim: "Multi-model synthesis (Claude, GPT, Grok) with strict privacy",
    approved_wording: "The AI Consensus Panel uses large language models to synthesize technical conditions and market text. AI outputs are non-deterministic.",
    category: "artificial-intelligence",
    status: "derived",
    evidence_strength: "strong",
    summary: "How Drawdown uses generative AI to provide sessional summaries and consensus reviews.",
    what_it_means: "A panel of three distinct LLMs evaluates the same context window of technical data to find overlapping agreements.",
    what_it_does_not_mean: "It is not a human analyst. AI models can hallucinate or confidently output mathematically incorrect logic.",
    methodology: "We concurrently query Anthropic Claude 3.5, OpenAI GPT-4o, and xAI Grok with identical system prompts and strict JSON schemas, then programmatically evaluate overlapping conditions.",
    data_sources: [
      { name: "Anthropic API", publisher: "Anthropic", dataType: "LLM Inference", delay: "Real-time" },
      { name: "OpenAI API", publisher: "OpenAI", dataType: "LLM Inference", delay: "Real-time" }
    ],
    limitations: ["LLMs do not understand math natively and can hallucinate technical analysis terminology"],
    assumptions: ["Consensus across multiple foundational models reduces individual model hallucination risk"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "backtesting-engine": {
    slug: "backtesting-engine",
    title: "Strategy Backtester (Beta)",
    short_claim: "Historical simulations using historical candle data",
    approved_wording: "The Strategy Backtester (Beta) simulates historical performance using daily/hourly historical candle data.",
    category: "backtesting",
    status: "planned",
    evidence_strength: "moderate",
    summary: "Simulating logical rule outcomes against historical chart histories.",
    what_it_means: "Allows users to write logic (e.g. RSI < 30) and see how it would have theoretically performed over the last N years.",
    what_it_does_not_mean: "Historical performance does not guarantee future results. It does not account for liquidity, slippage, or black swan gaps.",
    methodology: "Iterates through historical OHLC arrays, executing logic rules at the Close of each candle.",
    calculations: [
      { title: "Theoretical P&L", formula: "Sum of (Exit_Price - Entry_Price) * Position_Size", description: "Basic gross profit/loss without slippage modeling." }
    ],
    limitations: ["Currently in Beta", "Only processes End-Of-Candle logic, not intrabar ticks"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "trading-journal": {
    slug: "trading-journal",
    title: "Trade Journal & Analytics",
    short_claim: "Calculates performance metrics from user logs",
    approved_wording: "The Trade Journal calculates performance metrics based on user-entered or CSV-imported trading logs.",
    category: "trading-journal",
    status: "verified",
    evidence_strength: "strong",
    summary: "Performance attribution, MAE/MFE, and psychological journaling features.",
    what_it_means: "It calculates standard metrics like Win Rate, Profit Factor, and Expectancy based entirely on the data provided by the user.",
    what_it_does_not_mean: "It does not independently verify the trades against broker servers. Garbage in, garbage out.",
    methodology: "Standard accounting algorithms aggregate P&L arrays, separate winners from losers, and compute ratios.",
    calculations: [
      { title: "Profit Factor", formula: "Gross Profit / Gross Loss", description: "Measures the amount of money made for every dollar lost." },
      { title: "Expectancy", formula: "(Win% * Average_Win) - (Loss% * Average_Loss)", description: "The mathematical expected value of a single trade." }
    ],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  "broker-research": {
    slug: "broker-research",
    title: "Broker Research & Ranking",
    short_claim: "Brokers ranked by regulatory licenses and tested specifications",
    approved_wording: "We rank brokers based on a standardized framework covering regulatory licensing, documented specifications, and account-testing costs.",
    category: "broker-research",
    status: "verified",
    evidence_strength: "strong",
    summary: "Methodology of compiling broker guide sheets and safety ratings.",
    what_it_means: "Brokers are evaluated based on public regulatory registers (e.g. FCA, ASIC) and trading condition reviews.",
    what_it_does_not_mean: "It does not guarantee the solvency or safety of any specific broker. Drawdown is not liable for broker defaults.",
    methodology: "A scoring matrix assigns weights to regulatory tiers, spread widths, asset availability, and deposit methods.",
    data_sources: [
      { name: "FCA Register", publisher: "Financial Conduct Authority (UK)", url: "https://register.fca.org.uk", dataType: "Regulatory License Status", updateFrequency: "Real-time lookup" }
    ],
    limitations: ["Broker conditions change rapidly; our reviews are snapshots in time"],
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
    <div className="pt-28 pb-24 min-h-screen select-none" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-4xl">
          {/* Back Link */}
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] hover:underline mb-8"
            style={{ color: "var(--graphite-600)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Data &amp; Methodology Centre</span>
          </Link>

          {/* Header Section */}
          <div className="space-y-4 mb-12 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 border text-[10px] font-mono font-bold uppercase tracking-wider bg-white"
                    style={{ color: "var(--graphite-600)", borderColor: "var(--line-200)", borderRadius: 0 }}>
                {claim.category?.replace("-", " ")}
              </span>

              <span
                className="px-2.5 py-1 border text-[10px] font-mono font-bold uppercase tracking-wider bg-white"
                style={{ color: "var(--signal-navy)", borderColor: "var(--line-200)", borderRadius: 0 }}
              >
                {claim.status?.replace("_", " ")}
              </span>

              <span className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                Verified: {new Date(claim.last_verified_at || Date.now()).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold" style={{ color: "var(--ink-950)" }}>
              {claim.title}
            </h1>

            <p className="text-[15px] font-sans leading-relaxed max-w-2xl" style={{ color: "var(--graphite-600)" }}>
              {claim.summary}
            </p>
          </div>
        </div>

        {/* Main Sections Stack */}
        <div className="max-w-4xl space-y-12">
          {/* Section 1: Approved Wording */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: "var(--signal-navy)" }}>
              <ShieldCheck className="w-4 h-4" />
              <span>Approved Site-Wide Copy Statement</span>
            </div>
            <blockquote className="text-[16px] font-sans font-medium leading-relaxed pl-4 border-l-2" style={{ color: "var(--ink-950)", borderColor: "var(--signal-navy)" }}>
              &quot;{claim.approved_wording}&quot;
            </blockquote>
          </section>

          {/* Section 2: What It Means vs What It Does Not Mean */}
          {(claim.what_it_means || claim.what_it_does_not_mean) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
              {claim.what_it_means && (
                <div className="p-6 border bg-white space-y-3" style={{ borderColor: "var(--line-200)", borderRadius: 0 }}>
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: "var(--ink-950)" }}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>What It Means</span>
                  </div>
                  <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                    {claim.what_it_means}
                  </p>
                </div>
              )}

              {claim.what_it_does_not_mean && (
                <div className="p-6 border bg-white space-y-3" style={{ borderColor: "var(--line-200)", borderRadius: 0 }}>
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F59E0B]">
                    <AlertCircle className="w-4 h-4" />
                    <span>What It Does NOT Mean</span>
                  </div>
                  <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                    {claim.what_it_does_not_mean}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Section 3: Data Sources */}
          {dataSources.length > 0 && (
            <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: "var(--ink-950)" }}>
                <Database className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
                <span>Data Sources &amp; Upstream Attribution</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {dataSources.map((ds: any, idx: number) => (
                  <div key={idx} className="p-4 border bg-white space-y-2 text-[13px] font-sans" style={{ borderColor: "var(--line-200)", borderRadius: 0 }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm" style={{ color: "var(--ink-950)" }}>{ds.name}</span>
                      {ds.url && (
                        <a href={ds.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline font-mono text-[11px]" style={{ color: "var(--signal-navy)" }}>
                          <span>Publisher Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px]" style={{ color: "var(--graphite-600)" }}>
                      <div>Publisher: <span style={{ color: "var(--ink-950)" }}>{ds.publisher}</span></div>
                      <div>Type: <span style={{ color: "var(--ink-950)" }}>{ds.dataType}</span></div>
                      <div>Delay: <span style={{ color: "var(--ink-950)" }}>{ds.delay || "Real-time"}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Mathematical Calculations */}
          {calculations.length > 0 && (
            <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: "var(--ink-950)" }}>
                <Calculator className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
                <span>Mathematical Formulas &amp; Algorithms</span>
              </div>

              <div className="space-y-4">
                {calculations.map((calc: any, idx: number) => (
                  <div key={idx} className="p-4 border bg-white space-y-2" style={{ borderColor: "var(--line-200)", borderRadius: 0 }}>
                    <h4 className="font-semibold text-[14px] font-sans" style={{ color: "var(--ink-950)" }}>{calc.title}</h4>
                    {calc.formula && (
                      <div className="p-3 border font-mono text-[12px] bg-[var(--paper-100)]" style={{ borderColor: "var(--line-200)", color: "var(--signal-navy)", borderRadius: 0 }}>
                        {calc.formula}
                      </div>
                    )}
                    <p className="text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>{calc.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Limitations & Assumptions */}
          {(limitations.length > 0 || assumptions.length > 0) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              {limitations.length > 0 && (
                <div className="p-6 border bg-white space-y-3" style={{ borderColor: "var(--line-200)", borderRadius: 0 }}>
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#F59E0B]">Known Limitations</h4>
                  <ul className="space-y-2 text-[13px] list-disc list-inside font-sans" style={{ color: "var(--graphite-600)" }}>
                    {limitations.map((lim: string, idx: number) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}

              {assumptions.length > 0 && (
                <div className="p-6 border bg-white space-y-3" style={{ borderColor: "var(--line-200)", borderRadius: 0 }}>
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: "var(--signal-navy)" }}>Model Assumptions</h4>
                  <ul className="space-y-2 text-[13px] list-disc list-inside font-sans" style={{ color: "var(--graphite-600)" }}>
                    {assumptions.map((asm: string, idx: number) => (
                      <li key={idx}>{asm}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
