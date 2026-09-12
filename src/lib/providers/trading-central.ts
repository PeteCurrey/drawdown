/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Trading Central provider.
 *
 * When TRADING_CENTRAL_API_KEY is not configured, this provider returns a
 * NOT_CONNECTED status. It NEVER calculates a synthetic "analyst consensus"
 * from ATR arithmetic and presents it as Trading Central output.
 *
 * Rule: Do not manufacture analyst consensus. If the provider is not connected,
 * return NOT_CONNECTED with an honest explanation.
 */

export const NOT_CONNECTED = "NOT_CONNECTED" as const;
export type NotConnected = typeof NOT_CONNECTED;

export interface TradingCentralData {
  status: "CONNECTED";
  provider: "Trading Central";
  tcConsensusScore: number;
  tcSentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  analystSignal: string;
  keyLevels: {
    pivot: number;
    resistance1: number;
    resistance2: number;
    support1: number;
    support2: number;
  };
}

export interface TradingCentralUnavailable {
  status: NotConnected;
  provider: "Trading Central";
  message: string;
}

export type TradingCentralResult = TradingCentralData | TradingCentralUnavailable;

/**
 * Fetch analyst research and consensus scores from Trading Central.
 *
 * Returns NOT_CONNECTED if the API key is not configured.
 * Never derives a synthetic consensus score from local calculations.
 */
export async function fetchTradingCentralData(
  symbol: string,
  _currentPrice: number,
  _atr: number,
  _bias: "BULLISH" | "BEARISH" | "NEUTRAL",
  _confluenceScore: number
): Promise<TradingCentralResult> {
  const apiKey = process.env.TRADING_CENTRAL_API_KEY;

  if (!apiKey) {
    console.info("[trading-central] TRADING_CENTRAL_API_KEY not configured — returning NOT_CONNECTED.");
    return {
      status: NOT_CONNECTED,
      provider: "Trading Central",
      message: "Trading Central analyst consensus is not currently connected. No consensus data available.",
    };
  }

  try {
    const cleanSymbol = symbol.replace("/", "");
    const res = await fetch(
      `https://api.tradingcentral.com/v1/panoramic?symbol=${cleanSymbol}&token=${apiKey}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return {
          status: "CONNECTED",
          provider: "Trading Central",
          ...data,
        };
      }
    }
    console.warn("[trading-central] API responded with no usable data:", res.status);
    return {
      status: NOT_CONNECTED,
      provider: "Trading Central",
      message: "Trading Central API is reachable but returned no consensus data.",
    };
  } catch (e) {
    console.error("[trading-central] API fetch failed:", e);
    return {
      status: NOT_CONNECTED,
      provider: "Trading Central",
      message: "Trading Central API request failed.",
    };
  }
}
