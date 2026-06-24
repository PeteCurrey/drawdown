import { createInternalSupabase } from "./supabase/server";
import { calculateEMA, calculateRSI, calculateMACD, calculateStochastic, calculateATR } from "./indicators";
import { currencyFilter } from "./instruments";

// Symbol mappings between Drawdown slugs and Twelve Data symbols
export const TD_SYMBOL_MAP: Record<string, string> = {
  "XAU/USD": "XAU/USD",
  "XAG/USD": "XAG/USD",
  "GBP/USD": "GBP/USD",
  "EUR/USD": "EUR/USD",
  "USD/JPY": "USD/JPY",
  "GBP/JPY": "GBP/JPY",
  "SPX": "SPX500",
  "NDX": "QQQ",
  "DJI": "DJI",
  "FTSE": "FTSE",
  "BTC/USD": "BTC/USD",
  "ETH/USD": "ETH/USD",
  "SOL/USD": "SOL/USD",
};

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US", EUR: "EU", GBP: "GB", JPY: "JP",
  CHF: "CH", AUD: "AU", CAD: "CA", NZD: "NZ",
};

interface IndicatorValues {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
}

/**
 * Fetch calendar events from Finnhub to identify fundamentals catalysts
 */
async function fetchEconomicCalendar(): Promise<any[]> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return [];
  try {
    const now = new Date();
    const from = now.toISOString().split("T")[0];
    const to = new Date(now.getTime() + 7 * 86400_000).toISOString().split("T")[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${key}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.economicCalendar ?? [];
  } catch (e) {
    console.error("[signal-engine] Error fetching Finnhub calendar:", e);
    return [];
  }
}

/**
 * Helper to match economic events to a given instrument
 */
function findCatalyst(events: any[], slug: string): any {
  const currencies = currencyFilter(slug);
  const countries = currencies.map(c => CURRENCY_TO_COUNTRY[c]).filter(Boolean);
  
  const relevant = events.filter((e: any) => countries.includes(e.country));
  
  const HIGH_IMPACT = ["NFP", "CPI", "FOMC", "BOE", "ECB", "GDP", "PMI", "ISM", "Interest Rate"];
  const high = relevant.find((e: any) => e.impact === "high" || HIGH_IMPACT.some(k => e.event?.includes(k)));
  if (high) return { time: high.time, event: high.event, impact: "high" };
  
  const medium = relevant.find((e: any) => e.impact === "medium");
  if (medium) return { time: medium.time, event: medium.event, impact: "medium" };
  
  if (relevant.length > 0) {
    return { time: relevant[0].time, event: relevant[0].event, impact: "low" };
  }
  
  return { time: "N/A", event: "Technical confluence breakout setup", impact: "low" };
}

/**
 * Main signal generation and scan function
 */
export async function runSignalScan() {
  const tdKey = process.env.TWELVE_DATA_KEY ?? process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
  if (!tdKey) {
    throw new Error("Twelve Data API key is missing");
  }

  const supabase = createInternalSupabase();
  const timeframes = [
    { label: "15M", interval: "15min", expiryHours: 4 },
    { label: "1H", interval: "1h", expiryHours: 8 },
    { label: "4H", interval: "4h", expiryHours: 24 },
    { label: "1D", interval: "1day", expiryHours: 120 },
  ];

  // 1. Fetch economic calendar catalysts once for the batch
  const calendarEvents = await fetchEconomicCalendar();

  // 2. Clear expired signals
  const { error: deleteError } = await supabase
    .from("signals")
    .update({ is_active: false })
    .lt("expires_at", new Date().toISOString());
  
  if (deleteError) {
    console.error("[signal-engine] Error expiring old signals:", deleteError);
  }

  const batchSymbolsString = Object.values(TD_SYMBOL_MAP).join(",");
  const generatedSignalsCount: Record<string, number> = { "15M": 0, "1H": 0, "4H": 0, "1D": 0 };

  for (const tf of timeframes) {
    try {
      console.log(`[signal-engine] Fetching batch time series for timeframe ${tf.label}...`);
      const res = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(batchSymbolsString)}&interval=${tf.interval}&outputsize=100&apikey=${tdKey}`,
        { cache: "no-store" }
      );
      
      const data = await res.json();
      if (!data || data.status === "error") {
        console.error(`[signal-engine] Twelve Data error for ${tf.label}:`, data?.message);
        continue;
      }

      for (const [drawdownSlug, tdSym] of Object.entries(TD_SYMBOL_MAP)) {
        // Twelve Data returns keyed by symbol or single response structure if only 1 queried
        const rawSymbolData = data[tdSym];
        if (!rawSymbolData || rawSymbolData.status === "error" || !Array.isArray(rawSymbolData.values)) {
          continue;
        }

        // Format to what indicators expect: oldest first
        const values: IndicatorValues[] = rawSymbolData.values
          .map((v: any) => ({
            open: parseFloat(v.open),
            high: parseFloat(v.high),
            low: parseFloat(v.low),
            close: parseFloat(v.close),
            time: v.datetime,
          }))
          .reverse();

        if (values.length < 50) continue;

        // Calculate Indicators
        const ema20 = calculateEMA(values, 20);
        const ema50 = calculateEMA(values, 50);
        const rsi = calculateRSI(values, 14);
        const macd = calculateMACD(values, 12, 26, 9);
        const stoch = calculateStochastic(values, 14, 3);
        const atr = calculateATR(values, 14);

        const lastIdx = values.length - 1;
        const currentPrice = values[lastIdx].close;
        const lastATR = atr[lastIdx]?.value;

        if (!lastATR || lastATR <= 0) continue;

        // Score Confluence
        let bullishPoints = 0;
        let bearishPoints = 0;
        const factors: string[] = [];

        // 1. EMA Golden/Death Cross (2 points)
        const lastEma20 = ema20[lastIdx]?.value;
        const lastEma50 = ema50[lastIdx]?.value;
        if (lastEma20 && lastEma50) {
          if (lastEma20 > lastEma50) {
            bullishPoints += 2;
            factors.push("EMA Golden Cross (20 > 50)");
          } else if (lastEma20 < lastEma50) {
            bearishPoints += 2;
            factors.push("EMA Death Cross (20 < 50)");
          }
        }

        // 2. Price vs EMAs (2 points)
        if (lastEma20 && lastEma50) {
          if (currentPrice > lastEma20 && lastEma20 > lastEma50) {
            bullishPoints += 2;
            factors.push("Price above fast/slow EMAs");
          } else if (currentPrice < lastEma20 && lastEma20 < lastEma50) {
            bearishPoints += 2;
            factors.push("Price below fast/slow EMAs");
          }
        }

        // 3. RSI Momentum (2 points)
        const lastRsi = rsi[rsi.length - 1]?.value;
        if (lastRsi !== undefined && lastRsi !== null) {
          if (lastRsi > 53) {
            bullishPoints += 2;
            factors.push(`RSI Bullish Momentum (${Math.round(lastRsi)})`);
          } else if (lastRsi < 47) {
            bearishPoints += 2;
            factors.push(`RSI Bearish Momentum (${Math.round(lastRsi)})`);
          }
        }

        // 4. MACD Crossover (2 points)
        const lastMacd = macd[lastIdx];
        if (lastMacd && lastMacd.macd !== null && lastMacd.signal !== null) {
          if (lastMacd.macd > lastMacd.signal) {
            bullishPoints += 2;
            factors.push("MACD Bullish Cross");
          } else if (lastMacd.macd < lastMacd.signal) {
            bearishPoints += 2;
            factors.push("MACD Bearish Cross");
          }
        }

        // 5. Stochastic (2 points)
        const lastStoch = stoch[stoch.length - 1];
        if (lastStoch && lastStoch.k !== null && lastStoch.d !== null) {
          if (lastStoch.k > lastStoch.d) {
            bullishPoints += 2;
            factors.push("Stochastic %K > %D Crossover");
          } else if (lastStoch.k < lastStoch.d) {
            bearishPoints += 2;
            factors.push("Stochastic %K < %D Crossover");
          }
        }

        // Check if we hit the high confluence threshold (>= 7)
        const isBullishSignal = bullishPoints >= 7;
        const isBearishSignal = bearishPoints >= 7;

        if (isBullishSignal || isBearishSignal) {
          const bias = isBullishSignal ? "BULLISH" : "BEARISH";
          const score = isBullishSignal ? bullishPoints : bearishPoints;
          const filteredFactors = factors.filter(f => 
            bias === "BULLISH" ? !f.includes("Death") && !f.includes("below") && !f.includes("<") : !f.includes("Golden") && !f.includes("above") && !f.includes(">")
          );

          // Position Pricing levels based on ATR
          const stopDistance = 1.5 * lastATR;
          const targetDistance = 3.0 * lastATR;

          const entry_price = currentPrice;
          const stop_loss = bias === "BULLISH" ? currentPrice - stopDistance : currentPrice + stopDistance;
          
          const take_profit_1 = bias === "BULLISH" ? currentPrice + (1.5 * lastATR) : currentPrice - (1.5 * lastATR);
          const take_profit_2 = bias === "BULLISH" ? currentPrice + targetDistance : currentPrice - targetDistance;
          const take_profit_3 = bias === "BULLISH" ? currentPrice + (4.5 * lastATR) : currentPrice - (4.5 * lastATR);
          const rr_ratio = 2.0; // TP2 ratio (3.0 / 1.5)

          const catalyst_event = findCatalyst(calendarEvents, drawdownSlug);
          const expires_at = new Date(Date.now() + tf.expiryHours * 3600_000).toISOString();

          // Check if there is an existing active signal for this symbol + timeframe
          const { data: existing } = await supabase
            .from("signals")
            .select("id")
            .eq("instrument", drawdownSlug)
            .eq("timeframe", tf.label)
            .eq("is_active", true)
            .maybeSingle();

          if (existing?.id) {
            // Update
            await supabase
              .from("signals")
              .update({
                bias,
                confluence_score: score,
                entry_price,
                stop_loss,
                take_profit_1,
                take_profit_2,
                take_profit_3,
                rr_ratio,
                atr: lastATR,
                catalyst_event,
                confluence_factors: filteredFactors,
                expires_at,
              })
              .eq("id", existing.id);
          } else {
            // Insert new signal
            await supabase
              .from("signals")
              .insert({
                instrument: drawdownSlug,
                timeframe: tf.label,
                bias,
                confluence_score: score,
                entry_price,
                stop_loss,
                take_profit_1,
                take_profit_2,
                take_profit_3,
                rr_ratio,
                atr: lastATR,
                catalyst_event,
                confluence_factors: filteredFactors,
                expires_at,
                is_active: true,
              });
          }

          generatedSignalsCount[tf.label]++;
        }
      }
    } catch (e) {
      console.error(`[signal-engine] Error scanning timeframe ${tf.label}:`, e);
    }
  }

  console.log("[signal-engine] Signal scan completed. Results:", generatedSignalsCount);
  return generatedSignalsCount;
}
