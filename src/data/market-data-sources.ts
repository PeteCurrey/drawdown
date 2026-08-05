export type MarketDataNature =
  | "live"
  | "near_real_time"
  | "delayed"
  | "end_of_day"
  | "historical"
  | "derived"
  | "illustrative";

export type MarketDataHealth =
  | "current"
  | "delayed"
  | "stale"
  | "unavailable"
  | "market_closed"
  | "provider_error";

export interface MarketDataSource {
  id: string;
  providerName: string;
  datasetName: string;
  sourceType: "commercial_vendor" | "public_body" | "embedded_vendor" | "drawdown_derived";
  dataNature: MarketDataNature;
  expectedDelaySeconds?: number;
  expectedRefreshSeconds?: number;
  timezone: string;
  attributionRequired?: boolean;
  attributionText?: string;
  methodologySlug?: string;
  status: "active" | "limited" | "retired";
}

export interface MarketDataObservation {
  sourceId: string;
  sourceSymbol: string;
  displaySymbol: string;
  value?: number | string;
  observedAt?: string;
  receivedAt?: string;
  marketStatus?: "open" | "closed" | "pre_market" | "after_hours" | "unknown";
  health: MarketDataHealth;
  isDerived: boolean;
  calculationMethodologySlug?: string;
  errorCode?: string;
}

export const marketDataSources: Record<string, MarketDataSource> = {
  "polygon-forex": {
    id: "polygon-forex",
    providerName: "Polygon.io",
    datasetName: "Real-time FX Tick Feeds",
    sourceType: "commercial_vendor",
    dataNature: "delayed",
    expectedDelaySeconds: 60,
    expectedRefreshSeconds: 5,
    timezone: "UTC",
    attributionText: "Quotes delayed by 60 seconds. Powered by Polygon.io.",
    status: "active"
  },
  "tradingview-embedded": {
    id: "tradingview-embedded",
    providerName: "TradingView",
    datasetName: "Interactive Charts & Widgets",
    sourceType: "embedded_vendor",
    dataNature: "live",
    timezone: "Exchange Local",
    attributionText: "Chart data supplied via TradingView widgets.",
    status: "active"
  },
  "drawdown-derived-daily": {
    id: "drawdown-derived-daily",
    providerName: "Drawdown Trading",
    datasetName: "Sessional Volume and Liquidity Voids",
    sourceType: "drawdown_derived",
    dataNature: "derived",
    timezone: "Europe/London",
    methodologySlug: "/methodology/derived-metrics",
    status: "active"
  }
};
