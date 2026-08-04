import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_DB_URL = process.env.SUPABASE_URL;

if (!SUPABASE_DB_URL) {
  console.error('Missing SUPABASE_URL in .env.local');
  process.exit(1);
}

const CLAIMS = [
  {
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
  {
    slug: "economic-calendar",
    title: "Economic Calendar Data",
    short_claim: "Macroeconomic event data sourced from public calendars",
    original_wording: "Instant real-time economic feeds",
    approved_wording: "Drawdown displays global macroeconomic event data sourced from public calendars and economic agencies. Data is updated periodically after source publication.",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    summary: "Pulls schedules and actual values of interest rates, inflation indicators, and employment reports.",
    what_it_means: "Macroeconomic calendar updates are pulled from global release schedules to keep traders informed of high-impact events.",
    what_it_does_not_mean: "It does not guarantee delivery speeds of news releases and should not be used to trigger automated execution based on news releases.",
    methodology: "Pushed periodically from third-party calendars using background cron jobs.",
    data_sources: [
      { name: "Global Macroeconomic Feeds", publisher: "Various Central Banks & National Statistics Offices", dataType: "Macro indicators", updateFrequency: "Upon release" }
    ],
    limitations: ["Release times can drift", "Previous values may be revised by statistics offices retroactively"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "central-banks",
    title: "Central Bank & Macro Policy Rates",
    short_claim: "Macroeconomic indicators from FRED",
    original_wording: "Direct institutional bank feeds",
    approved_wording: "Macroeconomic metrics and central-bank policy rates are pulled from the Federal Reserve Economic Data (FRED) database and updated after official releases.",
    category: "market-data",
    status: "third_party",
    evidence_strength: "strong",
    summary: "Visualizing key interest rates and money supply metrics from regional central banks.",
    what_it_means: "Historical and current interest rates are populated from the FRED API to support fundamental analysis.",
    what_it_does_not_mean: "FRED data is reference-only and is not an active execution parameter.",
    methodology: "Ingested via FRED API calls and cached in local database tables.",
    data_sources: [
      { name: "Federal Reserve Economic Data (FRED)", publisher: "Federal Reserve Bank of St. Louis", url: "https://fred.stlouisfed.org", dataType: "Interest Rates & Monetary Policy" }
    ],
    limitations: ["Updates occur after bank announcements", "API subject to rate limiting and temporary downtime"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "news-sentiment",
    title: "News & Sentiment Indicators",
    short_claim: "Social sentiment represent analytical observations",
    original_wording: "Institutional news flow and predictive sentiment",
    approved_wording: "Social sentiment and market news indicators represent analytical observations compiled from third-party API summaries. Drawdown does not issue trading recommendations.",
    category: "market-data",
    status: "derived",
    evidence_strength: "moderate",
    summary: "Aggregating news sentiment and social media mentions into general sentiment categories.",
    what_it_means: "The system processes news articles and social feeds to indicate if current online commentary is leaning positive, negative, or neutral.",
    what_it_does_not_mean: "It does not represent institutional order flows or guarantee market direction. It does not predict future prices.",
    methodology: "Articles are summarized using AI models to output sentiment categorizations and index scores.",
    data_sources: [
      { name: "Finnhub Sentiment API", publisher: "Finnhub", url: "https://finnhub.io", dataType: "News Sentiment" }
    ],
    limitations: ["AI sentiment indexing is subjective", "High correlation to lagging price movements"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
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
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "ai-consensus",
    title: "AI Consensus Panel",
    short_claim: "Multi-model synthesis (Claude, GPT, Grok) with strict privacy",
    original_wording: "Guaranteed AI predictions and automatic trade signals",
    approved_wording: "The AI Consensus Panel uses large language models (Claude, GPT, Grok) to synthesize technical conditions and market text. AI outputs are non-deterministic, can hallucinate, and do not constitute financial advice. No private user trade data is shared for model training.",
    category: "artificial-intelligence",
    status: "derived",
    evidence_strength: "strong",
    summary: "How Drawdown uses generative AI to provide sessional summaries and consensus reviews.",
    what_it_means: "Generative AI models read structured market parameters (OHLC, Volatility, News headlines) to draft sessional summaries.",
    what_it_does_not_mean: "The AI cannot see global order book depth, does not execute trades, and does not guarantee price direction.",
    methodology: "We send sessional data parameters through structured prompts to LLM endpoints. The answers are parsed and displayed.",
    limitations: ["Model hallucinations or factual inaccuracies in news summaries", "AI responses are non-deterministic and can vary given identical inputs"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
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
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "backtesting-engine",
    title: "Strategy Backtester (Beta)",
    short_claim: "Historical simulations using historical candle data",
    original_wording: "Ultra-precise tick backtester showing guaranteed future outcomes",
    approved_wording: "The Strategy Backtester (Beta) simulates historical performance using daily/hourly historical candle data. Historical results are hypothetical and do not predict future performance. Slippage, commissions, and spreads are modelled based on static settings.",
    category: "backtesting",
    status: "planned",
    evidence_strength: "moderate",
    summary: "Simulating logical rule outcomes against historical chart histories.",
    what_it_means: "A tool showing how a technical rule set would have behaved in past markets based on static historical charts.",
    what_it_does_not_mean: "It is not live trading, does not guarantee live profitability, and does not simulate variable dynamic broker slippage.",
    methodology: "Historical OHLC candle records are parsed and rules evaluated sequentially. Includes look-ahead checks.",
    limitations: ["No survivorship bias protection for all instruments", "Static spreads do not reflect real news events", "Candle data granularity is not a tick-by-tick order book representation"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "trading-journal",
    title: "Trade Journal & Analytics",
    short_claim: "Calculates performance metrics from user logs",
    approved_wording: "The Trade Journal calculates performance metrics (win rate, profit factor, expectancy) based on user-entered or CSV-imported trading logs. Data is stored securely and can be permanently deleted by the user.",
    category: "trading-journal",
    status: "verified",
    evidence_strength: "strong",
    summary: "Performance attribution, MAE/MFE, and psychological journaling features.",
    what_it_means: "A database-driven logbook displaying personal metrics based on the user's trading log inputs.",
    what_it_does_not_mean: "Drawdown does not execute, route, or verify trades directly on the broker's servers.",
    methodology: "Standard database tables record user logs, and calculate aggregates (Win Rate, Profit Factor, Expectancy).",
    calculations: [
      { title: "Profit Factor", formula: "Profit Factor = Gross Profit / Gross Loss", description: "Measures risk-reward sustainability." }
    ],
    limitations: ["Depends entirely on the accuracy of user inputs or CSV logs"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
    slug: "broker-research",
    title: "Broker Research & Ranking",
    short_claim: "Brokers ranked by regulatory licenses and tested specifications",
    approved_wording: "We rank brokers based on a standardized framework covering regulatory licensing, documented specifications, and account-testing costs. Drawdown receives affiliate commissions but maintains strict editorial controls. We do not guarantee broker performance or capital safety.",
    category: "broker-research",
    status: "verified",
    evidence_strength: "strong",
    summary: "Methodology of compiling broker guide sheets and safety ratings.",
    what_it_means: "Our evaluations compile official licensing (FCA, ASIC), documented fees, and account research.",
    what_it_does_not_mean: "Drawdown is not a broker, does not process trade orders, does not hold trading funds, and is not a financial regulator.",
    methodology: "Data is gathered from broker registries and cross-checked against licensing databases.",
    limitations: ["Broker spreads, commissions, and policies can change without notice"],
    public: true,
    last_verified_at: new Date().toISOString()
  },
  {
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
    public: true,
    last_verified_at: new Date().toISOString()
  }
];

async function seedClaims() {
  console.log('Seeding methodology claims via pg...');
  
  const client = new pg.Client({
    connectionString: SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Clear existing records
    await client.query('DELETE FROM methodology_claims;');
    console.log('Cleared existing methodology claims.');

    for (const claim of CLAIMS) {
      const query = `
        INSERT INTO methodology_claims (
          slug, title, short_claim, original_wording, approved_wording,
          category, status, evidence_strength, summary, what_it_means,
          what_it_does_not_mean, methodology, data_sources, calculations,
          limitations, assumptions, public, last_verified_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17, $18
        )
      `;

      const values = [
        claim.slug,
        claim.title,
        claim.short_claim,
        claim.original_wording || null,
        claim.approved_wording,
        claim.category,
        claim.status,
        claim.evidence_strength,
        claim.summary,
        claim.what_it_means,
        claim.what_it_does_not_mean,
        claim.methodology,
        JSON.stringify(claim.data_sources || []),
        JSON.stringify(claim.calculations || []),
        JSON.stringify(claim.limitations || []),
        JSON.stringify(claim.assumptions || []),
        claim.public ?? true,
        claim.last_verified_at
      ];

      await client.query(query, values);
      console.log(`   - Seeded /methodology/${claim.slug}`);
    }

    console.log(`✅ Successfully seeded ${CLAIMS.length} methodology claims!`);
  } catch (err) {
    console.error('❌ Failed to seed claims:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedClaims().catch(console.error);
