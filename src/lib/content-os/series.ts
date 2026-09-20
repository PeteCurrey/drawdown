// src/lib/content-os/series.ts

export interface SeriesDefinition {
  id?: string;
  title: string;
  slug: string;
  description: string;
  pillar: string;
  defaultChannels: string[];
  visualFamily: string;
  cadence: 'weekly' | 'biweekly' | 'monthly';
}

export const CANONICAL_CONTENT_SERIES: SeriesDefinition[] = [
  {
    title: "Drawdown 101",
    slug: "drawdown-101",
    description: "Core principles of drawdown risk, account recovery mathematics, and capital preservation.",
    pillar: "risk_and_drawdown",
    defaultChannels: ["instagram", "x", "linkedin", "threads"],
    visualFamily: "DRAWDOWN",
    cadence: "weekly"
  },
  {
    title: "Market History",
    slug: "market-history",
    description: "Detailed retrospectives on major market dislocations, crashes, and historic price recoveries.",
    pillar: "case_studies",
    defaultChannels: ["instagram", "x", "linkedin", "threads"],
    visualFamily: "CASE_STUDY",
    cadence: "weekly"
  },
  {
    title: "One Chart",
    slug: "one-chart",
    description: "A single institutional chart revealing an overlooked market relationship or data anomaly.",
    pillar: "quantitative_insights",
    defaultChannels: ["instagram", "x", "linkedin", "threads"],
    visualFamily: "DATA",
    cadence: "weekly"
  },
  {
    title: "Risk Reality",
    slug: "risk-reality",
    description: "Practical position sizing and risk calculations for active FX and index traders.",
    pillar: "risk_and_drawdown",
    defaultChannels: ["instagram", "x", "threads"],
    visualFamily: "EXPLAINER",
    cadence: "weekly"
  },
  {
    title: "Biggest Drawdowns",
    slug: "biggest-drawdowns",
    description: "Examining the largest peak-to-trough drawdowns in financial history and how assets recovered.",
    pillar: "case_studies",
    defaultChannels: ["instagram", "x", "linkedin"],
    visualFamily: "CASE_STUDY",
    cadence: "biweekly"
  },
  {
    title: "What Happened Next?",
    slug: "what-happened-next",
    description: "Examining historical technical patterns and macroeconomic shocks to evaluate the subsequent outcome.",
    pillar: "market_intelligence",
    defaultChannels: ["instagram", "x", "threads"],
    visualFamily: "MARKET_UPDATE",
    cadence: "weekly"
  },
  {
    title: "Trader Psychology",
    slug: "trader-psychology",
    description: "Deconstructing behavioural leaks: revenge trading, FOMO, over-leverage, and confirmation bias.",
    pillar: "trader_psychology",
    defaultChannels: ["instagram", "x", "linkedin", "threads"],
    visualFamily: "EXPLAINER",
    cadence: "weekly"
  },
  {
    title: "Market Myth vs Data",
    slug: "market-myth-vs-data",
    description: "Contrasting common retail trading assumptions with historical quantitative distributions.",
    pillar: "quantitative_insights",
    defaultChannels: ["instagram", "x", "linkedin", "threads"],
    visualFamily: "DATA",
    cadence: "biweekly"
  }
];

export class ContentSeriesService {
  static getSeriesBySlug(slug: string): SeriesDefinition | undefined {
    return CANONICAL_CONTENT_SERIES.find(s => s.slug === slug);
  }

  static getSeriesForPillar(pillarKey: string): SeriesDefinition[] {
    return CANONICAL_CONTENT_SERIES.filter(s => s.pillar === pillarKey);
  }
}
