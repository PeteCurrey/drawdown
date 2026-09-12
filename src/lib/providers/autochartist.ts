/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Autochartist provider.
 *
 * When AUTOCHARTIST_API_KEY is not configured, this provider returns a
 * NOT_CONNECTED status. It NEVER generates synthetic pattern data.
 *
 * Rule: Simulated third-party data must never be presented as if it came
 * from that third party. If Autochartist is not connected, there are no
 * Autochartist patterns.
 */

export const NOT_CONNECTED = "NOT_CONNECTED" as const;
export type NotConnected = typeof NOT_CONNECTED;

export interface AutochartistPattern {
  patternName: string;
  direction: "BULLISH" | "BEARISH";
  probability: number;
  patternType: "chartpattern" | "fibonacci";
  state: "emerging" | "completed";
  identifiedAt: string;
}

export interface AutochartistData {
  status: "CONNECTED";
  provider: "Autochartist";
  activePatterns: AutochartistPattern[];
  volatilityForecast: {
    expectedHigh: number;
    expectedLow: number;
  };
  keyLevels: {
    support1: number;
    support2: number;
    resistance1: number;
    resistance2: number;
  };
}

export interface AutochartistUnavailable {
  status: NotConnected;
  provider: "Autochartist";
  message: string;
}

export type AutochartistResult = AutochartistData | AutochartistUnavailable;

/**
 * Fetch pattern and volatility forecast data from Autochartist.
 *
 * Returns NOT_CONNECTED if the API key is not configured.
 * Never generates synthetic patterns to fill the gap.
 */
export async function fetchAutochartistData(
  symbol: string,
  timeframe: string,
  _currentPrice: number,
  _atr: number,
  _bias: "BULLISH" | "BEARISH" | "NEUTRAL"
): Promise<AutochartistResult> {
  const apiKey = process.env.AUTOCHARTIST_API_KEY;

  if (!apiKey) {
    console.info("[autochartist] AUTOCHARTIST_API_KEY not configured — returning NOT_CONNECTED.");
    return {
      status: NOT_CONNECTED,
      provider: "Autochartist",
      message: "Autochartist pattern analysis is not currently connected. No pattern data available.",
    };
  }

  try {
    const cleanSymbol = symbol.replace("/", "");
    const res = await fetch(
      `https://api.autochartist.com/v1/analysis?symbol=${cleanSymbol}&timeframe=${timeframe}&apikey=${apiKey}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.patterns) {
        return {
          status: "CONNECTED",
          provider: "Autochartist",
          ...data,
        };
      }
    }
    console.warn("[autochartist] API responded but returned no patterns:", res.status);
    return {
      status: NOT_CONNECTED,
      provider: "Autochartist",
      message: "Autochartist API is reachable but returned no pattern data.",
    };
  } catch (e) {
    console.error("[autochartist] API fetch failed:", e);
    return {
      status: NOT_CONNECTED,
      provider: "Autochartist",
      message: "Autochartist API request failed.",
    };
  }
}
