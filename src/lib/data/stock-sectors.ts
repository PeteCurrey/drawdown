/**
 * Static reference snapshot — NOT live market data.
 *
 * Sector/industry classifications: GICS (Global Industry Classification Standard).
 * Market-cap figures: approximate reference values (USD billions), sourced ~Sep 2025.
 * change1D figures: ILLUSTRATIVE ONLY — static placeholders, not real daily moves.
 * price figures: ILLUSTRATIVE ONLY — static placeholders, not real-time quotes.
 *
 * Live equity data requires new API integration pending SC9 credit-budget review.
 */

/** ISO date of the last manual data update. Displayed visibly on the page. */
export const DATA_LAST_UPDATED = "September 2025";

export interface StockItem {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  /** Approximate market cap in USD billions — reference/structural data, ~Sep 2025 */
  marketCap: number;
  /**
   * ILLUSTRATIVE ONLY — static placeholder, not a live or historical daily move.
   * Displayed with an explicit "Illustrative" label on the page.
   */
  change1D?: number;
  /** ILLUSTRATIVE ONLY — static placeholder price, not a real-time quote */
  price?: number;
}

export interface SectorGroup {
  name: string;
  children: {
    name: string; // Industry or Ticker
    children?: {
      name: string;
      ticker: string;
      companyName: string;
      marketCap: number;
      change1D: number;
      price?: number;
      size: number;
    }[];
    // if flat industry / direct leaf:
    ticker?: string;
    companyName?: string;
    marketCap?: number;
    change1D?: number;
    price?: number;
    size?: number;
  }[];
}

export const STOCK_DATA_V1: StockItem[] = [
  // ── Information Technology ──────────────────────────────────────────
  { ticker: "AAPL", name: "Apple Inc.", sector: "Information Technology", industry: "Consumer Electronics", marketCap: 3450, change1D: 1.25, price: 228.5 },
  { ticker: "MSFT", name: "Microsoft Corporation", sector: "Information Technology", industry: "Software—Infrastructure", marketCap: 3200, change1D: 0.85, price: 432.1 },
  { ticker: "NVDA", name: "NVIDIA Corporation", sector: "Information Technology", industry: "Semiconductors", marketCap: 3100, change1D: 2.74, price: 126.8 },
  { ticker: "AVGO", name: "Broadcom Inc.", sector: "Information Technology", industry: "Semiconductors", marketCap: 790, change1D: 1.62, price: 168.4 },
  { ticker: "ORCL", name: "Oracle Corporation", sector: "Information Technology", industry: "Software—Infrastructure", marketCap: 460, change1D: -0.45, price: 167.2 },
  { ticker: "CRM", name: "Salesforce Inc.", sector: "Information Technology", industry: "Software—Application", marketCap: 255, change1D: 0.32, price: 268.0 },
  { ticker: "AMD", name: "Advanced Micro Devices", sector: "Information Technology", industry: "Semiconductors", marketCap: 245, change1D: -1.35, price: 151.2 },
  { ticker: "ADBE", name: "Adobe Inc.", sector: "Information Technology", industry: "Software—Infrastructure", marketCap: 235, change1D: 0.65, price: 520.4 },
  { ticker: "INTC", name: "Intel Corporation", sector: "Information Technology", industry: "Semiconductors", marketCap: 95, change1D: -2.10, price: 21.8 },

  // ── Communication Services ──────────────────────────────────────────
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Communication Services", industry: "Internet Content & Info", marketCap: 2050, change1D: 0.95, price: 165.3 },
  { ticker: "META", name: "Meta Platforms Inc.", sector: "Communication Services", industry: "Internet Content & Info", marketCap: 1480, change1D: 2.15, price: 585.6 },
  { ticker: "NFLX", name: "Netflix Inc.", sector: "Communication Services", industry: "Entertainment", marketCap: 305, change1D: 1.12, price: 708.2 },
  { ticker: "DIS", name: "Walt Disney Co.", sector: "Communication Services", industry: "Entertainment", marketCap: 175, change1D: -0.82, price: 95.4 },
  { ticker: "CMCSA", name: "Comcast Corporation", sector: "Communication Services", industry: "Telecom Services", marketCap: 160, change1D: -0.30, price: 41.2 },
  { ticker: "T", name: "AT&T Inc.", sector: "Communication Services", industry: "Telecom Services", marketCap: 155, change1D: 0.45, price: 21.6 },

  // ── Consumer Discretionary ──────────────────────────────────────────
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", industry: "Internet Retail", marketCap: 1980, change1D: 1.48, price: 190.5 },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Consumer Discretionary", industry: "Auto Manufacturers", marketCap: 780, change1D: 3.42, price: 245.0 },
  { ticker: "HD", name: "Home Depot Inc.", sector: "Consumer Discretionary", industry: "Home Improvement Retail", marketCap: 395, change1D: 0.25, price: 398.2 },
  { ticker: "MCD", name: "McDonald's Corp.", sector: "Consumer Discretionary", industry: "Restaurants", marketCap: 215, change1D: -0.65, price: 298.4 },
  { ticker: "NKE", name: "Nike Inc.", sector: "Consumer Discretionary", industry: "Apparel Footwear", marketCap: 130, change1D: -1.75, price: 84.6 },
  { ticker: "LOW", name: "Lowe's Companies Inc.", sector: "Consumer Discretionary", industry: "Home Improvement Retail", marketCap: 148, change1D: 0.15, price: 262.1 },
  { ticker: "SBUX", name: "Starbucks Corp.", sector: "Consumer Discretionary", industry: "Restaurants", marketCap: 110, change1D: 0.88, price: 96.5 },

  // ── Financials ──────────────────────────────────────────────────────
  { ticker: "BRK.B", name: "Berkshire Hathaway", sector: "Financials", industry: "Insurance—Diversified", marketCap: 990, change1D: 0.42, price: 452.0 },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", sector: "Financials", industry: "Banks—Diversified", marketCap: 610, change1D: 1.15, price: 214.8 },
  { ticker: "V", name: "Visa Inc.", sector: "Financials", industry: "Credit Services", marketCap: 560, change1D: 0.55, price: 280.2 },
  { ticker: "MA", name: "Mastercard Inc.", sector: "Financials", industry: "Credit Services", marketCap: 440, change1D: 0.35, price: 478.4 },
  { ticker: "BAC", name: "Bank of America", sector: "Financials", industry: "Banks—Diversified", marketCap: 310, change1D: 0.75, price: 39.8 },
  { ticker: "GS", name: "Goldman Sachs Group", sector: "Financials", industry: "Capital Markets", marketCap: 165, change1D: 1.85, price: 495.2 },
  { ticker: "AXP", name: "American Express Co.", sector: "Financials", industry: "Credit Services", marketCap: 190, change1D: -0.22, price: 265.4 },

  // ── Health Care ─────────────────────────────────────────────────────
  { ticker: "LLY", name: "Eli Lilly & Co.", sector: "Health Care", industry: "Drug Manufacturers", marketCap: 860, change1D: 2.30, price: 910.5 },
  { ticker: "UNH", name: "UnitedHealth Group", sector: "Health Care", industry: "Healthcare Plans", marketCap: 535, change1D: -0.92, price: 582.0 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Health Care", industry: "Drug Manufacturers", marketCap: 385, change1D: 0.12, price: 162.3 },
  { ticker: "ABBV", name: "AbbVie Inc.", sector: "Health Care", industry: "Drug Manufacturers", marketCap: 340, change1D: 0.65, price: 192.5 },
  { ticker: "MRK", name: "Merck & Co. Inc.", sector: "Health Care", industry: "Drug Manufacturers", marketCap: 290, change1D: -1.10, price: 114.7 },
  { ticker: "TMO", name: "Thermo Fisher Scientific", sector: "Health Care", industry: "Diagnostics & Research", marketCap: 220, change1D: 0.45, price: 575.0 },
  { ticker: "ABT", name: "Abbott Laboratories", sector: "Health Care", industry: "Medical Devices", marketCap: 200, change1D: -0.38, price: 115.6 },

  // ── Consumer Staples ────────────────────────────────────────────────
  { ticker: "WMT", name: "Walmart Inc.", sector: "Consumer Staples", industry: "Discount Stores", marketCap: 640, change1D: 0.72, price: 80.2 },
  { ticker: "PG", name: "Procter & Gamble Co.", sector: "Consumer Staples", industry: "Household Products", marketCap: 405, change1D: -0.15, price: 172.4 },
  { ticker: "COST", name: "Costco Wholesale Corp.", sector: "Consumer Staples", industry: "Discount Stores", marketCap: 400, change1D: 1.15, price: 905.0 },
  { ticker: "KO", name: "Coca-Cola Co.", sector: "Consumer Staples", industry: "Beverages—Non-Alcoholic", marketCap: 305, change1D: -0.42, price: 71.0 },
  { ticker: "PEP", name: "PepsiCo Inc.", sector: "Consumer Staples", industry: "Beverages—Non-Alcoholic", marketCap: 235, change1D: -0.85, price: 172.5 },
  { ticker: "PM", name: "Philip Morris International", sector: "Consumer Staples", industry: "Tobacco", marketCap: 190, change1D: 0.35, price: 122.4 },

  // ── Energy ──────────────────────────────────────────────────────────
  { ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", industry: "Oil & Gas Integrated", marketCap: 460, change1D: 1.45, price: 116.5 },
  { ticker: "CVX", name: "Chevron Corp.", sector: "Energy", industry: "Oil & Gas Integrated", marketCap: 270, change1D: 0.92, price: 148.0 },
  { ticker: "COP", name: "ConocoPhillips", sector: "Energy", industry: "Oil & Gas E&P", marketCap: 125, change1D: -0.65, price: 108.4 },
  { ticker: "SLB", name: "Schlumberger N.V.", sector: "Energy", industry: "Oil & Gas Equipment", marketCap: 62, change1D: -1.40, price: 43.8 },
  { ticker: "EOG", name: "EOG Resources Inc.", sector: "Energy", industry: "Oil & Gas E&P", marketCap: 72, change1D: 0.28, price: 126.5 },

  // ── Industrials ─────────────────────────────────────────────────────
  { ticker: "GE", name: "GE Aerospace", sector: "Industrials", industry: "Aerospace & Defense", marketCap: 205, change1D: 2.10, price: 188.0 },
  { ticker: "CAT", name: "Caterpillar Inc.", sector: "Industrials", industry: "Farm & Heavy Construction", marketCap: 190, change1D: 1.65, price: 395.0 },
  { ticker: "RTX", name: "RTX Corporation", sector: "Industrials", industry: "Aerospace & Defense", marketCap: 165, change1D: 0.52, price: 124.0 },
  { ticker: "HON", name: "Honeywell International", sector: "Industrials", industry: "Diversified Industrials", marketCap: 135, change1D: -0.40, price: 206.5 },
  { ticker: "UPS", name: "United Parcel Service", sector: "Industrials", industry: "Integrated Freight", marketCap: 115, change1D: -1.25, price: 134.2 },
  { ticker: "BA", name: "Boeing Co.", sector: "Industrials", industry: "Aerospace & Defense", marketCap: 95, change1D: -2.85, price: 153.8 },

  // ── Real Estate & Utilities ─────────────────────────────────────────
  { ticker: "NEE", name: "NextEra Energy Inc.", sector: "Utilities", industry: "Utilities—Regulated Electric", marketCap: 170, change1D: 0.85, price: 82.5 },
  { ticker: "SO", name: "Southern Company", sector: "Utilities", industry: "Utilities—Regulated Electric", marketCap: 98, change1D: 0.40, price: 90.2 },
  { ticker: "AMT", name: "American Tower Corp.", sector: "Real Estate", industry: "REIT—Specialty", marketCap: 105, change1D: -0.75, price: 225.0 }
];

export const GICS_SECTORS = [
  "All Sectors",
  "Information Technology",
  "Communication Services",
  "Consumer Discretionary",
  "Financials",
  "Health Care",
  "Consumer Staples",
  "Energy",
  "Industrials",
  "Utilities",
  "Real Estate"
];

/**
 * Transforms flat stock list into hierarchical Recharts Treemap data:
 * Root -> Sectors -> Industries -> Tickers
 */
export function buildTreemapData(stocks: StockItem[], sectorFilter = "All Sectors") {
  const filtered = sectorFilter === "All Sectors"
    ? stocks
    : stocks.filter(s => s.sector.toLowerCase() === sectorFilter.toLowerCase());

  // Group by sector
  const sectorMap = new Map<string, Map<string, StockItem[]>>();

  for (const s of filtered) {
    if (!sectorMap.has(s.sector)) {
      sectorMap.set(s.sector, new Map());
    }
    const indMap = sectorMap.get(s.sector)!;
    if (!indMap.has(s.industry)) {
      indMap.set(s.industry, []);
    }
    indMap.get(s.industry)!.push(s);
  }

  // Construct hierarchy
  const rootChildren = Array.from(sectorMap.entries()).map(([sectorName, indMap]) => {
    const industryChildren = Array.from(indMap.entries()).map(([indName, items]) => {
      const tickerChildren = items.map(item => ({
        name: item.ticker,
        ticker: item.ticker,
        companyName: item.name,
        sector: item.sector,
        industry: item.industry,
        marketCap: item.marketCap,
        change1D: item.change1D ?? 0,
        price: item.price,
        size: item.marketCap // Recharts uses size to calculate rectangle area
      }));

      return {
        name: indName,
        children: tickerChildren
      };
    });

    return {
      name: sectorName,
      children: industryChildren
    };
  });

  return rootChildren;
}

/**
 * Returns light-theme fill and text colours for a treemap tile based on daily % change.
 * All backgrounds are designed for a white/light-grey page background.
 *
 * ⚠️ change values here are ILLUSTRATIVE ONLY — see file-level disclaimer.
 */
export function getPerformanceColor(change: number | undefined): {
  bgColor: string;
  textColor: string;
} {
  if (change === undefined || isNaN(change)) {
    return { bgColor: "#E2E8F0", textColor: "#475569" }; // slate-200 / slate-600
  }
  // Strong positive  ≥ +3 %
  if (change >= 3.0)  return { bgColor: "#16a34a", textColor: "#ffffff" }; // green-600
  // Mid positive     ≥ +1.5 %
  if (change >= 1.5)  return { bgColor: "#4ade80", textColor: "#14532d" }; // green-400 / green-900
  // Mild positive    > +0.3 %
  if (change > 0.3)   return { bgColor: "#bbf7d0", textColor: "#166534" }; // green-200 / green-800
  // Flat
  if (change >= -0.3) return { bgColor: "#F1F5F9", textColor: "#64748b" }; // slate-100 / slate-500
  // Mild negative    > −1.5 %
  if (change > -1.5)  return { bgColor: "#fecaca", textColor: "#7f1d1d" }; // red-200 / red-900
  // Mid negative     > −3 %
  if (change > -3.0)  return { bgColor: "#f87171", textColor: "#ffffff" }; // red-400
  // Strong negative  ≤ −3 %
  return { bgColor: "#dc2626", textColor: "#ffffff" }; // red-600
}
