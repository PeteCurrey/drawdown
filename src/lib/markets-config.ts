export type MarketCategory = 'forex' | 'commodities' | 'indices' | 'crypto';

export interface MarketInstrument {
  slug: string;
  category: MarketCategory;
  name: string;            // e.g. "Euro / US Dollar"
  ticker: string;          // TradingView symbol e.g. "FX:EURUSD"
  displayPair: string;     // e.g. "EUR/USD"
  baseCurrency: string;    // e.g. "EUR"
  quoteCurrency: string;   // e.g. "USD"
  description: string;     // 2-3 sentence intro for SEO/page
  whyTrade: string;        // 1-2 sentences on why traders watch this
  sessionPeak: string;     // e.g. "London & New York overlap (13:00–17:00 GMT)"
  drawdownPhase: string;   // e.g. "Phase 2 — Chart Reader"
  drawdownNote: string;    // 1-2 sentences on how Drawdown teaches this instrument
  keyDrivers: string[];    // 3-4 macro drivers
  relatedSlugs: string[];  // slugs of related instruments for internal linking
  metaTitle: string;
  metaDescription: string;
}

export const CATEGORY_META = {
  forex: {
    title: "Forex Markets | Live FX Charts & Analysis | Drawdown",
    description: "Live charts, technical analysis and Drawdown education context for all major forex pairs. GBP/USD, EUR/USD, USD/JPY and more.",
    intro: "The foreign exchange market is where Drawdown lives. Every major pair, covered with live TradingView charts, technical analysis gauges, and honest context on how we teach each instrument within the curriculum."
  },
  commodities: {
    title: "Commodities Markets | Gold, Oil & Silver Charts | Drawdown",
    description: "Live charts and analysis for major commodities including Gold, Silver and Crude Oil. Real-time TradingView data with Drawdown education context.",
    intro: "Commodities add macro depth to any trading toolkit. Gold, Silver and Crude Oil — each covered with live data, key driver breakdowns and curriculum context from the Drawdown platform."
  },
  indices: {
    title: "Stock Indices | FTSE 100, S&P 500, NASDAQ Charts | Drawdown",
    description: "Live charts and analysis for major stock indices including the FTSE 100, S&P 500, NASDAQ 100 and Dow Jones.",
    intro: "Global equity indices are the pulse of macro market sentiment. Understand what the FTSE, S&P 500 and NASDAQ are doing — and why it matters for every trade you take."
  },
  crypto: {
    title: "Crypto Markets | Bitcoin, Ethereum & XRP Charts | Drawdown",
    description: "Live Bitcoin, Ethereum and XRP charts with technical analysis and Drawdown curriculum context for crypto traders.",
    intro: "Cryptocurrency offers 24/7 market access and extreme volatility. Covered in Drawdown's Phase 6 curriculum — here's the live data and context serious crypto traders need."
  }
};

export const MARKETS_CONFIG: MarketInstrument[] = [
  // FOREX
  {
    slug: "eurusd",
    category: "forex",
    name: "Euro / US Dollar",
    ticker: "FX:EURUSD",
    displayPair: "EUR/USD",
    baseCurrency: "EUR",
    quoteCurrency: "USD",
    description: "The EUR/USD is the world's most traded currency pair, accounting for roughly 28% of daily forex volume. It represents the exchange rate between the Eurozone's single currency and the US Dollar — the two largest economic blocs on the planet. Tight spreads, deep liquidity and near-constant volatility make it the first pair most serious traders learn.",
    whyTrade: "Institutional order flow is densest on EUR/USD, making it ideal for price action and ICT-style setups. London session open regularly produces the cleanest structural moves.",
    sessionPeak: "London open (08:00–10:00 GMT) and NY overlap (13:00–17:00 GMT)",
    drawdownPhase: "Phase 2 — Chart Reader",
    drawdownNote: "EUR/USD features in Phases 2 and 3 as the primary teaching pair for structure, order blocks and liquidity sweeps. All core chart reading modules use EUR/USD as the base example.",
    keyDrivers: ["ECB interest rate decisions", "US Federal Reserve policy", "Eurozone GDP and CPI data", "US Non-Farm Payrolls"],
    relatedSlugs: ["eurgbp", "usdjpy", "gbpusd"],
    metaTitle: "EUR/USD Live Chart & Analysis | Euro Dollar Today | Drawdown",
    metaDescription: "EUR/USD live chart, technical analysis and price action breakdown. Track the Euro Dollar with TradingView data and learn to trade it with Drawdown."
  },
  {
    slug: "gbpusd",
    category: "forex",
    name: "British Pound / US Dollar",
    ticker: "FX:GBPUSD",
    displayPair: "GBP/USD",
    baseCurrency: "GBP",
    quoteCurrency: "USD",
    description: "GBP/USD — known as 'Cable' — is the most important pair for UK-based traders. It measures the strength of Sterling against the world's reserve currency and is one of the most volatile major pairs in the forex market. The pair is particularly reactive to BoE policy decisions, UK inflation data and broader risk sentiment.",
    whyTrade: "Cable's volatility and the London session dynamic make it a primary instrument for UK day traders. It regularly produces clean sweep-and-reverse setups around session highs and lows.",
    sessionPeak: "London open (07:00–09:30 GMT) and NY overlap (13:00–17:00 GMT)",
    drawdownPhase: "Phase 2 — Chart Reader",
    drawdownNote: "GBP/USD is the flagship pair for Drawdown's UK-focused curriculum. Pete trades Cable personally and it features in live session breakdowns throughout Phases 2, 3 and 4.",
    keyDrivers: ["Bank of England MPC decisions", "UK CPI and wage data", "US Federal Reserve policy", "UK GDP releases"],
    relatedSlugs: ["gbpjpy", "eurgbp", "eurusd"],
    metaTitle: "GBP/USD Live Chart & Analysis | Cable Today | Drawdown",
    metaDescription: "GBP/USD live chart and price action analysis for UK traders. Track Cable with real-time TradingView data and learn to trade it properly with Drawdown."
  },
  {
    slug: "usdjpy",
    category: "forex",
    name: "US Dollar / Japanese Yen",
    ticker: "FX:USDJPY",
    displayPair: "USD/JPY",
    baseCurrency: "USD",
    quoteCurrency: "JPY",
    description: "USD/JPY is the second most traded forex pair globally, offering exceptional liquidity during both Asian and US sessions. The pair is heavily influenced by the interest rate differential between the US Federal Reserve and the Bank of Japan — a spread that has driven historic moves in recent years.",
    whyTrade: "USD/JPY trending behaviour and sensitivity to US yield data creates excellent macro-driven setups. The Tokyo session also provides early directional clues.",
    sessionPeak: "Tokyo open (00:00–03:00 GMT) and NY session (13:00–17:00 GMT)",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "USD/JPY is introduced in Phase 3 as a macro-driven trend pair. Students learn to trade with fundamental bias and interest rate differential as a directional filter.",
    keyDrivers: ["Bank of Japan yield curve control policy", "US Treasury yields", "Fed interest rate decisions", "Japan CPI and trade data"],
    relatedSlugs: ["eurusd", "gbpjpy", "audusd"],
    metaTitle: "USD/JPY Live Chart & Analysis | Dollar Yen Today | Drawdown",
    metaDescription: "USD/JPY live chart and technical analysis. Track Dollar Yen in real time and learn institutional setups with Drawdown's forex education platform."
  },
  {
    slug: "gbpjpy",
    category: "forex",
    name: "British Pound / Japanese Yen",
    ticker: "FX:GBPJPY",
    displayPair: "GBP/JPY",
    baseCurrency: "GBP",
    quoteCurrency: "JPY",
    description: "GBP/JPY is nicknamed 'The Dragon' for good reason — it's one of the most volatile and fast-moving pairs in the forex market. Combining the reactivity of Sterling with the carry-trade dynamics of the Yen, this pair can move 150+ pips in a single London session without breaking a sweat.",
    whyTrade: "The Dragon's range and speed attract experienced UK traders looking for explosive intraday moves. High reward-to-risk potential when approached with strict position sizing.",
    sessionPeak: "London open (07:00–10:00 GMT)",
    drawdownPhase: "Phase 4 — Risk Manager",
    drawdownNote: "GBP/JPY is only introduced in Phase 4 after students have mastered risk management. Its volatility is a reward for discipline — and a brutal lesson if approached without it.",
    keyDrivers: ["BoE and BoJ policy divergence", "Risk-on/risk-off sentiment", "UK economic data surprises", "Japanese intervention risk"],
    relatedSlugs: ["gbpusd", "usdjpy", "eurgbp"],
    metaTitle: "GBP/JPY Live Chart & Analysis | The Dragon Today | Drawdown",
    metaDescription: "GBP/JPY live chart and analysis for UK traders. Track The Dragon pair with real-time data and learn to trade it safely with Drawdown."
  },
  {
    slug: "audusd",
    category: "forex",
    name: "Australian Dollar / US Dollar",
    ticker: "FX:AUDUSD",
    displayPair: "AUD/USD",
    baseCurrency: "AUD",
    quoteCurrency: "USD",
    description: "AUD/USD — 'The Aussie' — is a commodity-correlated currency pair that moves closely with iron ore, gold and broader risk appetite. It's a liquid and widely traded major pair favoured by traders looking for clean technical setups outside of European trading hours.",
    whyTrade: "The Aussie's correlation to commodity prices and its behaviour during the Asian and early London sessions offers diversification for traders beyond purely European pairs.",
    sessionPeak: "Sydney/Tokyo overlap (23:00–03:00 GMT) and London open (07:00–09:00 GMT)",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "AUD/USD is used in Phase 3 to teach correlation trading and commodity-currency relationships. It illustrates how macro backdrop influences price structure.",
    keyDrivers: ["RBA interest rate decisions", "China economic data", "Iron ore and commodity prices", "Global risk sentiment"],
    relatedSlugs: ["eurusd", "usdjpy", "usdcad"],
    metaTitle: "AUD/USD Live Chart & Analysis | Aussie Dollar Today | Drawdown",
    metaDescription: "AUD/USD live chart and technical analysis. Track the Aussie Dollar with real-time TradingView data and learn commodity-correlated trading with Drawdown."
  },
  {
    slug: "eurgbp",
    category: "forex",
    name: "Euro / British Pound",
    ticker: "FX:EURGBP",
    displayPair: "EUR/GBP",
    baseCurrency: "EUR",
    quoteCurrency: "GBP",
    description: "EUR/GBP is the cross rate between the Eurozone and the United Kingdom — making it particularly relevant for British traders. Often range-bound but capable of explosive moves around UK and EU macro events, it's a pair that rewards patience and clean level-to-level trading.",
    whyTrade: "EUR/GBP is a staple for UK traders. It frequently consolidates before high-impact news events then produces clean breakout structures. Tight spreads on most UK brokers.",
    sessionPeak: "London session (07:00–11:00 GMT)",
    drawdownPhase: "Phase 2 — Chart Reader",
    drawdownNote: "EUR/GBP features in Phase 2 range-trading modules. Its tendency to consolidate makes it excellent for teaching support/resistance and liquidity grab setups.",
    keyDrivers: ["BoE and ECB policy divergence", "UK and Eurozone CPI data", "Political risk (Brexit legacy effects)", "UK trade balance data"],
    relatedSlugs: ["gbpusd", "eurusd", "gbpjpy"],
    metaTitle: "EUR/GBP Live Chart & Analysis | Euro Pound Today | Drawdown",
    metaDescription: "EUR/GBP live chart and price action analysis. Track the Euro Pound cross with real-time data and learn to trade it with Drawdown's UK-focused curriculum."
  },
  // COMMODITIES
  {
    slug: "gold",
    category: "commodities",
    name: "Gold",
    ticker: "OANDA:XAUUSD",
    displayPair: "XAU/USD",
    baseCurrency: "XAU",
    quoteCurrency: "USD",
    description: "Gold (XAU/USD) is the world's oldest store of value and one of the most actively traded instruments in financial markets. It acts as a safe-haven asset during periods of geopolitical uncertainty and economic stress, while also reacting sharply to US dollar strength, real yields and Federal Reserve policy.",
    whyTrade: "Gold offers excellent liquidity, wide trading hours and clean technical structure. It's particularly effective for breakout and trend-following strategies during high-volatility macro events.",
    sessionPeak: "London/New York overlap (13:00–17:00 GMT)",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "Gold is introduced in Phase 3 as the primary commodities instrument. Students learn how to apply price action methodology across non-FX markets and handle its characteristic spike behaviour.",
    keyDrivers: ["US real yields and dollar strength", "Federal Reserve interest rate policy", "Geopolitical risk and safe-haven demand", "Central bank gold purchases"],
    relatedSlugs: ["eurusd", "gbpusd", "silver"],
    metaTitle: "Gold Live Chart & Analysis | XAU/USD Today | Drawdown",
    metaDescription: "Gold (XAU/USD) live chart and technical analysis. Track gold prices in real time and learn to trade it with Drawdown's structured education platform."
  },
  {
    slug: "oil",
    category: "commodities",
    name: "Crude Oil (WTI)",
    ticker: "NYMEX:CL1!",
    displayPair: "WTI/USD",
    baseCurrency: "WTI",
    quoteCurrency: "USD",
    description: "WTI Crude Oil is the most actively traded energy commodity in the world. Its price is driven by a complex interplay of OPEC+ supply decisions, US inventory data, geopolitical risk in oil-producing regions, and global demand forecasts. Highly volatile around weekly EIA reports.",
    whyTrade: "Oil's strong trending behaviour and volatility around weekly inventory releases create excellent short-term trading opportunities for traders with defined risk parameters.",
    sessionPeak: "US session (13:00–20:00 GMT), peak volatility around EIA release (15:30 GMT Wednesdays)",
    drawdownPhase: "Phase 4 — Risk Manager",
    drawdownNote: "Crude Oil is covered in Phase 4 as an advanced commodity. Its spike risk around news events makes strict position sizing non-negotiable — reinforcing the core Risk Manager curriculum.",
    keyDrivers: ["OPEC+ production decisions", "US EIA weekly inventory data", "Geopolitical risk in Middle East", "Global GDP and demand forecasts"],
    relatedSlugs: ["gold", "silver", "eurusd"],
    metaTitle: "Crude Oil Live Chart & Analysis | WTI Today | Drawdown",
    metaDescription: "WTI Crude Oil live chart and technical analysis. Track oil prices with real-time TradingView data and learn commodity trading with Drawdown."
  },
  {
    slug: "silver",
    category: "commodities",
    name: "Silver",
    ticker: "OANDA:XAGUSD",
    displayPair: "XAG/USD",
    baseCurrency: "XAG",
    quoteCurrency: "USD",
    description: "Silver (XAG/USD) combines properties of both a precious metal and an industrial commodity, making it uniquely reactive to both safe-haven flows and economic growth expectations. It's more volatile than gold and can produce exaggerated moves relative to its price level.",
    whyTrade: "Silver's volatility and its correlation with gold make it attractive for traders who want precious metal exposure with amplified price swings. Often moves in tandem with gold but with greater percentage range.",
    sessionPeak: "London/New York overlap (13:00–17:00 GMT)",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "Silver is taught alongside gold in Phase 3's commodities module. Students learn how to use gold as a directional bias filter for silver entries.",
    keyDrivers: ["Gold price direction", "Industrial demand (solar, electronics)", "US dollar strength", "Fed policy and real yields"],
    relatedSlugs: ["gold", "oil", "eurusd"],
    metaTitle: "Silver Live Chart & Analysis | XAG/USD Today | Drawdown",
    metaDescription: "Silver (XAG/USD) live chart and technical analysis. Track silver prices in real time and learn to trade it with Drawdown's commodities curriculum."
  },
  // INDICES
  {
    slug: "uk100",
    category: "indices",
    name: "FTSE 100",
    ticker: "SPREADEX:UK100",
    displayPair: "UK100",
    baseCurrency: "GBP",
    quoteCurrency: "GBP",
    description: "The FTSE 100 represents the 100 largest companies listed on the London Stock Exchange. As a benchmark for the UK economy, it's a first port of call for British traders and investors. The index is heavily weighted towards financials, energy and mining companies, making it sensitive to commodity prices and GBP movements.",
    whyTrade: "FTSE 100 is the natural home market for UK traders. Its behaviour around London open, news events and US market open creates consistent intraday trading opportunities.",
    sessionPeak: "London open (07:00–09:30 GMT)",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "The FTSE 100 is introduced in Phase 3 to broaden students beyond forex. Its open range characteristics are ideal for teaching gap fills and morning momentum setups.",
    keyDrivers: ["BoE interest rate decisions", "UK GDP and employment data", "Commodity prices (oil, mining stocks)", "Global risk sentiment"],
    relatedSlugs: ["us500", "nas100", "gold"],
    metaTitle: "FTSE 100 Live Chart & Analysis | UK100 Today | Drawdown",
    metaDescription: "FTSE 100 live chart and technical analysis. Track the UK100 index with real-time TradingView data and learn index trading with Drawdown."
  },
  {
    slug: "us500",
    category: "indices",
    name: "S&P 500",
    ticker: "FOREXCOM:SPX500",
    displayPair: "US500",
    baseCurrency: "USD",
    quoteCurrency: "USD",
    description: "The S&P 500 is the world's most followed stock market index, comprising 500 of the largest US publicly traded companies. It's the global benchmark for equity market health and has a profound influence on risk sentiment across all asset classes — forex, commodities and crypto included.",
    whyTrade: "The S&P 500's correlation to risk appetite makes it an essential instrument for macro-aware traders. Its behaviour around US market open and Fed announcements generates the cleanest institutional moves.",
    sessionPeak: "US session open (14:30 GMT) and first hour of trading",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "The S&P 500 is used in Phase 3 to teach macro correlation — understanding how equity market sentiment bleeds into forex and commodity positioning.",
    keyDrivers: ["Federal Reserve policy", "US corporate earnings seasons", "Non-Farm Payrolls and jobs data", "US CPI inflation data"],
    relatedSlugs: ["nas100", "us30", "gold"],
    metaTitle: "S&P 500 Live Chart & Analysis | US500 Today | Drawdown",
    metaDescription: "S&P 500 live chart and technical analysis. Track the US500 index with real-time data and learn index trading with Drawdown's structured curriculum."
  },
  {
    slug: "nas100",
    category: "indices",
    name: "NASDAQ 100",
    ticker: "FOREXCOM:NAS100",
    displayPair: "NAS100",
    baseCurrency: "USD",
    quoteCurrency: "USD",
    description: "The NASDAQ 100 tracks the 100 largest non-financial companies listed on the NASDAQ exchange, dominated by technology giants. It's the most volatile of the major US indices and has become a barometer for growth and technology sector sentiment globally.",
    whyTrade: "The NASDAQ 100's volatility and strong trending behaviour make it attractive for momentum traders. It frequently sets the tone for overnight risk sentiment that flows into the London session.",
    sessionPeak: "US session open (14:30 GMT) with pre-market moves from 09:00 GMT",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "NASDAQ features in Phase 3 alongside the S&P 500. Its leverage sensitivity makes it a strong teaching tool for position sizing and the relationship between volatility and risk.",
    keyDrivers: ["Big Tech earnings (Apple, Microsoft, Nvidia, Meta)", "Federal Reserve rate decisions", "US CPI and inflation expectations", "AI sector sentiment"],
    relatedSlugs: ["us500", "us30", "bitcoin"],
    metaTitle: "NASDAQ 100 Live Chart & Analysis | NAS100 Today | Drawdown",
    metaDescription: "NASDAQ 100 live chart and technical analysis. Track the NAS100 with real-time TradingView data and learn index trading with Drawdown."
  },
  {
    slug: "us30",
    category: "indices",
    name: "Dow Jones Industrial Average",
    ticker: "FOREXCOM:DJI",
    displayPair: "US30",
    baseCurrency: "USD",
    quoteCurrency: "USD",
    description: "The Dow Jones Industrial Average is the oldest and most recognised US stock index, tracking 30 large-cap American companies. Though less comprehensive than the S&P 500, it remains a widely watched macro indicator and a popular instrument for spread betting and CFD trading.",
    whyTrade: "US30 provides stable, liquid exposure to the US equity market. Its lower volatility relative to NASDAQ makes it a useful instrument for traders building comfort with index trading.",
    sessionPeak: "US session open (14:30 GMT)",
    drawdownPhase: "Phase 3 — Strategist",
    drawdownNote: "US30 is used in Phase 3 as an introductory index instrument for students transitioning from forex, thanks to its lower intraday volatility relative to NASDAQ.",
    keyDrivers: ["Federal Reserve monetary policy", "US corporate earnings", "Employment and GDP data", "Consumer confidence data"],
    relatedSlugs: ["us500", "nas100", "gold"],
    metaTitle: "Dow Jones Live Chart & Analysis | US30 Today | Drawdown",
    metaDescription: "Dow Jones (US30) live chart and technical analysis. Track the DJIA with real-time TradingView data and learn index trading with Drawdown."
  },
  // CRYPTO
  {
    slug: "bitcoin",
    category: "crypto",
    name: "Bitcoin",
    ticker: "COINBASE:BTCUSD",
    displayPair: "BTC/USD",
    baseCurrency: "BTC",
    quoteCurrency: "USD",
    description: "Bitcoin is the world's first and largest cryptocurrency by market capitalisation. From a trading perspective, BTC/USD offers 24/7 market access, extreme volatility, and increasingly institutional participation — with BlackRock, Fidelity and others now operating Bitcoin ETFs. It behaves like a high-beta risk asset with its own unique on-chain market dynamics.",
    whyTrade: "Bitcoin's 24/7 nature means setups can form at any time. Its strong trending behaviour during bull cycles and deep corrective structures create excellent reward-to-risk opportunities for experienced traders.",
    sessionPeak: "London/New York overlap (13:00–21:00 GMT) but active 24/7",
    drawdownPhase: "Phase 6 — The Edge",
    drawdownNote: "Bitcoin is introduced in Phase 6 as an advanced instrument. By this point, students apply all structural, risk and psychological frameworks to a market that operates without breaks or institutional circuit breakers.",
    keyDrivers: ["Bitcoin halving cycle", "Institutional ETF flows (BlackRock, Fidelity)", "Federal Reserve risk sentiment", "Regulatory developments globally"],
    relatedSlugs: ["ethereum", "nas100", "gold"],
    metaTitle: "Bitcoin Live Chart & Analysis | BTC/USD Today | Drawdown",
    metaDescription: "Bitcoin (BTC/USD) live chart and technical analysis. Track Bitcoin price in real time and learn to trade crypto with Drawdown's structured education platform."
  },
  {
    slug: "ethereum",
    category: "crypto",
    name: "Ethereum",
    ticker: "COINBASE:ETHUSD",
    displayPair: "ETH/USD",
    baseCurrency: "ETH",
    quoteCurrency: "USD",
    description: "Ethereum is the second largest cryptocurrency and the leading smart contract platform. ETH/USD moves with broader crypto market sentiment but also has unique catalysts tied to DeFi activity, network upgrades and staking yields. It tends to be more volatile than Bitcoin with faster percentage moves.",
    whyTrade: "ETH/USD provides leveraged crypto exposure with strong correlation to Bitcoin but frequently outperforms during risk-on periods. Its volatility creates wide intraday ranges for active traders.",
    sessionPeak: "New York session and Asian overlap — active 24/7",
    drawdownPhase: "Phase 6 — The Edge",
    drawdownNote: "Ethereum is covered alongside Bitcoin in Phase 6. Students learn how to use BTC/USD as a directional bias filter when taking ETH/USD positions.",
    keyDrivers: ["Bitcoin price direction", "DeFi and NFT market activity", "Ethereum network upgrades", "Crypto regulatory environment"],
    relatedSlugs: ["bitcoin", "nas100", "us500"],
    metaTitle: "Ethereum Live Chart & Analysis | ETH/USD Today | Drawdown",
    metaDescription: "Ethereum (ETH/USD) live chart and technical analysis. Track Ethereum price in real time and learn crypto trading with Drawdown."
  },
  {
    slug: "xrp",
    category: "crypto",
    name: "XRP",
    ticker: "COINBASE:XRPUSD",
    displayPair: "XRP/USD",
    baseCurrency: "XRP",
    quoteCurrency: "USD",
    description: "XRP is the native token of the Ripple payment network and one of the most liquid altcoins in the market. Known for explosive price moves around regulatory developments, XRP/USD can deliver outsized percentage gains and losses within short timeframes — making risk management critical.",
    whyTrade: "XRP's explosive breakout patterns and reaction to news catalysts attract active traders looking for high-volatility opportunities beyond the major crypto assets.",
    sessionPeak: "Active 24/7, most liquid during US session (13:00–21:00 GMT)",
    drawdownPhase: "Phase 6 — The Edge",
    drawdownNote: "XRP is used in Phase 6 to illustrate altcoin-specific risks — particularly how news-driven spikes differ from structural price action. Students learn to distinguish genuine setups from noise.",
    keyDrivers: ["SEC regulatory developments", "Bitcoin market direction", "Ripple network adoption and partnerships", "Global crypto regulation"],
    relatedSlugs: ["bitcoin", "ethereum", "nas100"],
    metaTitle: "XRP Live Chart & Analysis | XRP/USD Today | Drawdown",
    metaDescription: "XRP (XRP/USD) live chart and technical analysis. Track XRP price in real time and learn to trade it with Drawdown's crypto education curriculum."
  }
];

export function getCategoryInstruments(category: MarketCategory): MarketInstrument[] {
  return MARKETS_CONFIG.filter(item => item.category === category);
}

export function getInstrumentBySlug(slug: string): MarketInstrument | undefined {
  return MARKETS_CONFIG.find(item => item.slug === slug);
}

export function getAllSlugs() {
  return MARKETS_CONFIG.map(item => ({
    category: item.category,
    slug: item.slug
  }));
}
