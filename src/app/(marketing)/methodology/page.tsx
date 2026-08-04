import Metadata from "next";
import Link from "next/link";
import { ShieldCheck, Search, Filter, Layers, Database, Sparkles, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = {
  title: "Data & Methodology Centre | Drawdown Trading",
  description:
    "The central source of truth for every technical, analytical, statistical, market-data, and AI claim across Drawdown Trading. Fully evidence-led and transparent.",
};

// Static fallback data in case database is unreachable during SSG/build
const FALLBACK_CLAIMS = [
  {
    slug: "market-prices",
    title: "Market Price Data & Feeds",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    short_claim: "Calculated from third-party price feeds",
    approved_wording: "Drawdown utilizes commercial third-party market data feeds to display historical prices, sessional volatility, and technical indicator values.",
    summary: "How market pricing is pulled, loaded, and updated in our charting and analysis widgets."
  },
  {
    slug: "economic-calendar",
    title: "Economic Calendar Data",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    short_claim: "Macroeconomic event data sourced from public calendars",
    approved_wording: "Drawdown displays global macroeconomic event data sourced from public calendars and economic agencies.",
    summary: "Pulls schedules and actual values of interest rates, inflation indicators, and employment reports."
  },
  {
    slug: "central-banks",
    title: "Central Bank & Macro Policy Rates",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    short_claim: "Macroeconomic indicators from FRED",
    approved_wording: "Macroeconomic metrics and central-bank policy rates are pulled from FRED database.",
    summary: "Visualizing key interest rates and money supply metrics from regional central banks."
  },
  {
    slug: "news-sentiment",
    title: "News & Sentiment Indicators",
    category: "market-data",
    status: "derived",
    evidence_strength: "moderate",
    short_claim: "Social sentiment represents analytical observations",
    approved_wording: "Social sentiment and market news indicators represent analytical observations compiled from third-party API summaries.",
    summary: "Aggregating news sentiment and social media mentions into general sentiment categories."
  },
  {
    slug: "technical-confluence",
    title: "Technical Confluence Grid & DCS",
    category: "technical-analysis",
    status: "derived",
    evidence_strength: "strong",
    short_claim: "Mathematical confluence grid from M15 to D1",
    approved_wording: "The Technical Confluence Grid aggregates moving averages, momentum, and volatility indicators across multiple timeframes.",
    summary: "Calculates confluence levels where multiple independent indicators align."
  },
  {
    slug: "ai-consensus",
    title: "AI Consensus Panel",
    category: "artificial-intelligence",
    status: "derived",
    evidence_strength: "strong",
    short_claim: "Multi-model synthesis (Claude, GPT, Grok) with strict privacy",
    approved_wording: "The AI Consensus Panel uses large language models to synthesize technical conditions and market text. AI outputs are non-deterministic.",
    summary: "How Drawdown uses generative AI to provide sessional summaries and consensus reviews."
  },
  {
    slug: "position-sizing",
    title: "Position Sizing Calculator",
    category: "risk-management",
    status: "verified",
    evidence_strength: "strong",
    short_claim: "Mathematical calculator based on user-entered parameters",
    approved_wording: "Position sizes are calculated using standard risk-management formulas based on user-entered parameters.",
    summary: "Safety calculations to protect capital bases from over-exposure."
  },
  {
    slug: "backtesting-engine",
    title: "Strategy Backtester (Beta)",
    category: "backtesting",
    status: "planned",
    evidence_strength: "moderate",
    short_claim: "Historical simulations using historical candle data",
    approved_wording: "The Strategy Backtester (Beta) simulates historical performance using daily/hourly historical candle data.",
    summary: "Simulating logical rule outcomes against historical chart histories."
  },
  {
    slug: "trading-journal",
    title: "Trade Journal & Analytics",
    category: "trading-journal",
    status: "verified",
    evidence_strength: "strong",
    short_claim: "Calculates performance metrics from user logs",
    approved_wording: "The Trade Journal calculates performance metrics based on user-entered or CSV-imported trading logs.",
    summary: "Performance attribution, MAE/MFE, and psychological journaling features."
  },
  {
    slug: "broker-research",
    title: "Broker Research & Ranking",
    category: "broker-research",
    status: "verified",
    evidence_strength: "strong",
    short_claim: "Brokers ranked by regulatory licenses and tested specifications",
    approved_wording: "We rank brokers based on a standardized framework covering regulatory licensing, documented specifications, and account-testing costs.",
    summary: "Methodology of compiling broker guide sheets and safety ratings."
  },
  {
    slug: "platform-capabilities",
    title: "Drawdown Platform Scope",
    category: "platform-capability",
    status: "verified",
    evidence_strength: "strong",
    short_claim: "Trading education and risk-management research platform",
    approved_wording: "Drawdown is a trading education and risk-management research platform. We do not execute trades, route orders, or hold funds.",
    summary: "Clear definition of Drawdown's operational scope and legal boundaries."
  }
];

async function getClaims() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return FALLBACK_CLAIMS;

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("methodology_claims")
      .select("slug, title, category, status, evidence_strength, short_claim, approved_wording, summary")
      .eq("public", true)
      .order("title");

    if (error || !data || data.length === 0) return FALLBACK_CLAIMS;
    return data;
  } catch {
    return FALLBACK_CLAIMS;
  }
}

export default async function MethodologyPage() {
  const claims = await getClaims();

  const totalClaims = claims.length;
  const verifiedCount = claims.filter(c => c.status === "verified").length;
  const derivedCount = claims.filter(c => c.status === "derived").length;
  const thirdPartyCount = claims.filter(c => c.status === "third_party").length;
  const betaCount = claims.filter(c => c.status === "planned").length;

  return (
    <div className="pt-28 pb-24 min-h-screen select-none" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      {/* Header / Hero Section */}
      <div className="max-w-[1280px] mx-auto px-6 mb-16">
        <div className="max-w-4xl">
          <Breadcrumbs 
            items={[
              { label: 'Methodology', href: '/methodology' }
            ]} 
          />
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <ShieldCheck size={14} />
                Single Source of Truth // Evidence-Led Platform
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Data &amp; Methodology <span style={{ color: "var(--graphite-600)" }}>Centre</span>
            </h1>
            
            <p className="text-[15px] font-sans leading-relaxed max-w-2xl" style={{ color: "var(--ink-950)" }}>
              Every technical, analytical, statistical, market-data, AI, and performance claim made across Drawdown is recorded here. We only make statements we can clearly explain, evidence, and defend.
            </p>
          </div>
        </div>

        {/* Legal Scope Disclaimer Box */}
        <div className="max-w-4xl mt-8 p-6 border flex items-start gap-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
          <div className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
            <span className="font-bold uppercase font-mono tracking-[0.08em] block mb-2" style={{ color: "var(--ink-950)" }}>Operational Scope Disclosure:</span>
            <p>
              Drawdown Trading is an independent trading education, analytical research, and risk-management tools platform. Drawdown does not route, execute, or transmit orders, and does not hold client funds. All market observations, trade signals, and indicators are non-advisory analytical data.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="border-y py-8 mb-16" style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-100)" }}>
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 border bg-white flex flex-col justify-between" style={{ borderColor: "var(--line-200)", borderRadius: 0, minHeight: "100px" }}>
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] block mb-2" style={{ color: "var(--graphite-600)" }}>Total Registered Claims</span>
            <span className="text-3xl font-display font-semibold" style={{ color: "var(--ink-950)" }}>{totalClaims}</span>
          </div>

          <div className="p-4 border bg-white flex flex-col justify-between" style={{ borderColor: "var(--line-200)", borderRadius: 0, minHeight: "100px" }}>
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] block mb-2" style={{ color: "var(--graphite-600)" }}>Verified Calculations</span>
            <span className="text-3xl font-display font-semibold" style={{ color: "var(--ink-950)" }}>{verifiedCount}</span>
          </div>

          <div className="p-4 border bg-white flex flex-col justify-between" style={{ borderColor: "var(--line-200)", borderRadius: 0, minHeight: "100px" }}>
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] block mb-2" style={{ color: "var(--graphite-600)" }}>Derived Analytical Models</span>
            <span className="text-3xl font-display font-semibold" style={{ color: "var(--ink-950)" }}>{derivedCount}</span>
          </div>

          <div className="p-4 border bg-white flex flex-col justify-between" style={{ borderColor: "var(--line-200)", borderRadius: 0, minHeight: "100px" }}>
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] block mb-2" style={{ color: "var(--graphite-600)" }}>Third-Party &amp; Beta</span>
            <span className="text-3xl font-display font-semibold" style={{ color: "var(--ink-950)" }}>{thirdPartyCount + betaCount}</span>
          </div>
        </div>
      </div>

      {/* Main Claims Directory */}
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[20px] font-display font-semibold tracking-[-0.02em] uppercase" style={{ color: "var(--ink-950)" }}>Claims Evidence Register</h2>
            <p className="text-[11px] font-mono uppercase tracking-[0.08em] mt-2" style={{ color: "var(--graphite-600)" }}>Select a methodology card to view source data, formulas, and limitations</p>
          </div>
        </div>

        {/* Claims Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim) => (
            <Link
              key={claim.slug}
              href={`/methodology/${claim.slug}`}
              className="p-6 border flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                borderColor: "var(--line-200)",
                backgroundColor: "var(--paper-100)",
                borderRadius: 0,
              }}
            >
              <div className="space-y-4">
                {/* Badges Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 border text-[10px] font-mono font-bold uppercase tracking-wider bg-white"
                        style={{ color: "var(--graphite-600)", borderColor: "var(--line-200)", borderRadius: 0 }}>
                    {claim.category.replace("-", " ")}
                  </span>
                  
                  <span
                    className="px-2.5 py-1 border text-[10px] font-mono font-bold uppercase tracking-wider bg-white"
                    style={{ color: "var(--signal-navy)", borderColor: "var(--line-200)", borderRadius: 0 }}
                  >
                    {claim.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-[16px] font-sans font-medium leading-snug group-hover:underline" style={{ color: "var(--ink-950)" }}>
                  {claim.title}
                </h3>

                <p className="text-[13px] leading-[1.6] font-sans min-h-[56px] line-clamp-2" style={{ color: "var(--graphite-600)" }}>
                  {claim.summary}
                </p>

                <div className="p-3 border bg-white text-[11px] font-mono italic" style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)", borderRadius: 0 }}>
                  "{claim.short_claim}"
                </div>
              </div>

              <div className="pt-4 border-t mt-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.08em] group-hover:underline" style={{ borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <span>View Full Methodology</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
