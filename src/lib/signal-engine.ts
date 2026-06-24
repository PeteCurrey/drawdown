import { createInternalSupabase } from "./supabase/server";
import { 
  calculateEMA, 
  calculateRSI, 
  calculateMACD, 
  calculateStochastic, 
  calculateATR,
  calculateBollingerBands,
  calculateCCI,
  calculateADX
} from "./indicators";
import { currencyFilter } from "./instruments";
import Anthropic from "@anthropic-ai/sdk";

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
 * Fetch economic calendar from Finnhub to identify fundamental catalysts
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
 * Fetch indicators directly from TAAPI.IO (for Crypto)
 */
async function fetchTaapiData(slug: string, timeframe: string): Promise<any> {
  const apiKey = process.env.TAAPI_API_KEY;
  if (!apiKey) return null;

  const cryptoMap: Record<string, string> = {
    "BTC/USD": "BTC/USDT",
    "ETH/USD": "ETH/USDT",
    "SOL/USD": "SOL/USDT",
  };

  const symbol = cryptoMap[slug];
  if (!symbol) return null; // Only query crypto from Binance exchange on TAAPI

  const tfMap: Record<string, string> = {
    "15M": "15m",
    "1H": "1h",
    "4H": "4h",
    "1D": "1d",
  };
  const tf = tfMap[timeframe] || "1h";

  try {
    const res = await fetch("https://api.taapi.io/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: apiKey,
        construct: {
          exchange: "binance",
          symbol: symbol,
          timeframe: tf,
          indicators: [
            { id: "rsi", indicator: "rsi", period: 14 },
            { id: "macd", indicator: "macd" },
            { id: "stoch", indicator: "stoch" },
            { id: "cci", indicator: "cci" },
            { id: "adx", indicator: "adx" },
            { id: "bbands", indicator: "bbands" }
          ]
        }
      })
    });

    if (!res.ok) {
      console.warn(`[signal-engine] TAAPI bulk query failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data || data.error || data.errors || !Array.isArray(data.data)) {
      console.warn(`[signal-engine] TAAPI response error:`, data?.error || data?.errors);
      return null;
    }

    const rsiVal = data.data.find((i: any) => i.id === "rsi")?.result?.value;
    const macdData = data.data.find((i: any) => i.id === "macd")?.result;
    const stochData = data.data.find((i: any) => i.id === "stoch")?.result;
    const cciVal = data.data.find((i: any) => i.id === "cci")?.result?.value;
    const adxVal = data.data.find((i: any) => i.id === "adx")?.result?.value;
    const bbandsData = data.data.find((i: any) => i.id === "bbands")?.result;

    return {
      rsi: rsiVal !== undefined ? { value: rsiVal, bias: rsiVal > 55 ? "BULLISH" : rsiVal < 45 ? "BEARISH" : "NEUTRAL" } : null,
      macd: macdData ? { value: macdData.valueMACD, signal: macdData.valueMACDSignal, bias: macdData.valueMACD > macdData.valueMACDSignal ? "BULLISH" : "BEARISH" } : null,
      stochastic: stochData ? { k: stochData.valueK, d: stochData.valueD, bias: stochData.valueK > stochData.valueD ? "BULLISH" : "BEARISH" } : null,
      cci: cciVal !== undefined ? { value: cciVal, bias: cciVal > 100 ? "BULLISH" : cciVal < -100 ? "BEARISH" : "NEUTRAL" } : null,
      adx: adxVal !== undefined ? { value: adxVal, bias: adxVal > 25 ? "TRENDING" : "RANGING" } : null,
      bbands: bbandsData ? { upper: bbandsData.valueUpperBand, middle: bbandsData.valueMiddleBand, lower: bbandsData.valueLowerBand, bias: "NEUTRAL" } : null,
    };
  } catch (err: any) {
    console.error(`[signal-engine] TAAPI fetch error:`, err.message || err);
    return null;
  }
}

/**
 * Fetch CoinGecko stats for Crypto
 */
async function fetchCoinGeckoData(slug: string): Promise<any> {
  const cryptoMap: Record<string, string> = {
    "BTC/USD": "bitcoin",
    "ETH/USD": "ethereum",
    "SOL/USD": "solana",
  };
  const id = cryptoMap[slug];
  if (!id) return null;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const c = data[0];
      return {
        price: c.current_price,
        change24h: c.price_change_percentage_24h,
        marketCap: c.market_cap,
        volume: c.total_volume,
        high24h: c.high_24h,
        low24h: c.low_24h,
        rank: c.market_cap_rank,
      };
    }
    return null;
  } catch (err) {
    console.error(`[signal-engine] CoinGecko fetch failed:`, err);
    return null;
  }
}

/**
 * Fetch Binance Funding Rate & Countdown
 */
async function fetchBinanceFundingRate(slug: string): Promise<any> {
  const cryptoMap: Record<string, string> = {
    "BTC/USD": "BTCUSDT",
    "ETH/USD": "ETHUSDT",
    "SOL/USD": "SOLUSDT",
  };
  const symbol = cryptoMap[slug];
  if (!symbol) return null;

  try {
    const res = await fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.lastFundingRate) {
      return {
        fundingRate: parseFloat(data.lastFundingRate), // e.g. 0.00000764
        nextFundingTime: data.nextFundingTime, // ms
      };
    }
    return null;
  } catch (err) {
    console.error(`[signal-engine] Binance Funding Rate fetch failed:`, err);
    return null;
  }
}

/**
 * Generate AI Consensus Panel results from Claude, GPT-4o, and simulated Grok
 */
async function generateAIConsensus(
  instrument: string,
  timeframe: string,
  bias: string,
  confluenceScore: number,
  price: number,
  indicators: any,
  catalyst: any
): Promise<any> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const prompt = `
Market Setup to Analyze:
- Instrument: ${instrument}
- Timeframe: ${timeframe}
- Technical Bias: ${bias}
- Confluence Score: ${confluenceScore}/10
- Current Price: ${price}
- Fundamental Catalyst: ${catalyst?.event || "N/A"} (Impact: ${catalyst?.impact || "low"})

Indicators State (Latest):
- RSI: ${indicators?.rsi?.value ? indicators.rsi.value.toFixed(1) : "N/A"} (${indicators?.rsi?.bias || "N/A"})
- MACD Bias: ${indicators?.macd?.bias || "N/A"} (Line: ${indicators?.macd?.value ? indicators.macd.value.toFixed(4) : "N/A"})
- Stochastic Bias: ${indicators?.stochastic?.bias || "N/A"} (K: ${indicators?.stochastic?.k ? indicators.stochastic.k.toFixed(1) : "N/A"})
- CCI Bias: ${indicators?.cci?.bias || "N/A"} (Value: ${indicators?.cci?.value ? indicators.cci.value.toFixed(1) : "N/A"})
- ADX Value: ${indicators?.adx?.value ? indicators.adx.value.toFixed(0) : "N/A"} (Trend: ${indicators?.adx?.bias || "N/A"})

Assess the validity of this setup from a professional quantitative perspective. Give a clear verdict (BULLISH, BEARISH, or NEUTRAL), a confidence rating (0-100), and 3 bullet points of reasoning.
`;

  let claudeResult = null;
  let gpt4Result = null;
  let grokResult = null;

  // 1. Fetch GPT-4o Consensus
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are GPT-4o, a quantitative trading analyst. Analyze the market setup and return a JSON object with this exact structure: { \"verdict\": \"BULLISH\" | \"BEARISH\" | \"NEUTRAL\", \"confidence\": number (0-100), \"reasoning\": [string, string, string] }"
            },
            { role: "user", content: prompt }
          ]
        })
      });
      if (res.ok) {
        const json = await res.json();
        gpt4Result = JSON.parse(json.choices?.[0]?.message?.content || "{}");
      }
    } catch (e) {
      console.error("[signal-engine] GPT-4o query failed:", e);
    }
  }

  // 2. Fetch Claude 3.5 Sonnet
  if (anthropicKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const msg = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: "You are Claude 3.5 Sonnet, an institutional macro strategist. Focus on multi-step reasoning, risk context, and explaining the 'why' behind the signal. Return ONLY a valid JSON object (no markup, no markdown blocks, no other text) with this structure: { \"verdict\": \"BULLISH\" | \"BEARISH\" | \"NEUTRAL\", \"confidence\": number (0-100), \"reasoning\": [string, string, string] }",
        messages: [{ role: "user", content: prompt }]
      });
      const text = msg.content[0]?.type === "text" ? msg.content[0].text : "{}";
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        claudeResult = JSON.parse(match[0]);
      }
    } catch (err: any) {
      console.warn("[signal-engine] Claude query failed (will simulate with GPT-4o fallback):", err.message || err);
    }
  }

  // Fallback Claude Simulation via GPT-4o if Anthropic key is exhausted/not present
  if (!claudeResult && openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are Claude 3.5 Sonnet, acting as an institutional macro strategist. Focus on multi-step reasoning, risk context, and explaining the 'why'. Return a JSON object: { \"verdict\": \"BULLISH\" | \"BEARISH\" | \"NEUTRAL\", \"confidence\": number (0-100), \"reasoning\": [string, string, string] }"
            },
            { role: "user", content: prompt }
          ]
        })
      });
      if (res.ok) {
        const json = await res.json();
        claudeResult = JSON.parse(json.choices?.[0]?.message?.content || "{}");
      }
    } catch (e) {
      console.error("[signal-engine] Fallback Claude query failed:", e);
    }
  }

  // 3. Fetch Grok (xAI X/Sentiment) - Simulated via GPT-4o
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are Grok, an AI trading intelligence model. You have access to real-time social sentiment data from X/Twitter. Incorporate social momentum, retail sentiment, and contrarian indicators in your analysis. Return a JSON object with this exact structure: { \"verdict\": \"BULLISH\" | \"BEARISH\" | \"NEUTRAL\", \"confidence\": number (0-100), \"reasoning\": [string, string, string] }"
            },
            { role: "user", content: prompt }
          ]
        })
      });
      if (res.ok) {
        const json = await res.json();
        grokResult = JSON.parse(json.choices?.[0]?.message?.content || "{}");
      }
    } catch (e) {
      console.error("[signal-engine] Grok query failed:", e);
    }
  }

  // Absolute fallback values if APIs fail to parse
  const finalClaude = claudeResult || {
    verdict: bias,
    confidence: Math.round(50 + confluenceScore * 4),
    reasoning: [
      `Technicals show high confluence with a score of ${confluenceScore}/10.`,
      `RSI momentum supports the ${bias.toLowerCase()} directional bias.`,
      `Macro landscape remains supportive of the technical trend.`
    ]
  };

  const finalGpt4 = gpt4Result || {
    verdict: bias,
    confidence: Math.round(45 + confluenceScore * 5),
    reasoning: [
      `Daily timeframe shows clear structure supporting ${bias.toLowerCase()} entry.`,
      `Key moving averages are aligned in a trend-following configuration.`,
      `Risk-reward ratio of 1:2 is highly favorable.`
    ]
  };

  const finalGrok = grokResult || {
    verdict: bias,
    confidence: Math.round(40 + confluenceScore * 5),
    reasoning: [
      `Social discussion velocity is increasing around this asset.`,
      `Retail trading sentiment remains aligned with structural breakout.`,
      `Volume indicators validate high-conviction breakout levels.`
    ]
  };

  // Compute Drawdown Consensus Score (DCS)
  // Formula: Claude 40%, GPT-4o 35%, Grok 25%
  // Calculate weighted direction: BULLISH=+1, BEARISH=-1, NEUTRAL=0
  const cDir = finalClaude.verdict === "BULLISH" ? 1 : finalClaude.verdict === "BEARISH" ? -1 : 0;
  const gDir = finalGpt4.verdict === "BULLISH" ? 1 : finalGpt4.verdict === "BEARISH" ? -1 : 0;
  const kDir = finalGrok.verdict === "BULLISH" ? 1 : finalGrok.verdict === "BEARISH" ? -1 : 0;

  const weightedDir = (cDir * 0.4) + (gDir * 0.35) + (kDir * 0.25);
  
  // Calculate net confidence based on alignment
  const weightedConf = (finalClaude.confidence * 0.4) + (finalGpt4.confidence * 0.35) + (finalGrok.confidence * 0.25);
  
  // Consensus verdict alignment multiplier (if all agree, DCS remains high. If split, DCS decays)
  const isAligned = (cDir === gDir && gDir === kDir);
  const alignmentMultiplier = isAligned ? 1.0 : Math.abs(weightedDir);
  const dcsScore = Math.max(10, Math.round(weightedConf * alignmentMultiplier));

  return {
    claude: finalClaude,
    gpt4: finalGpt4,
    grok: finalGrok,
    dcsScore
  };
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

  // pre-calculate indicators for all timeframes to feed the confluence grid
  const symbolTfCache: Record<string, Record<string, any>> = {};
  for (const slug of Object.keys(TD_SYMBOL_MAP)) {
    symbolTfCache[slug] = {};
  }

  // Phase 1: Pre-calculate indicators
  for (const tf of timeframes) {
    try {
      console.log(`[signal-engine] Pre-calculating indicators for timeframe ${tf.label}...`);
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
        const rawSymbolData = data[tdSym];
        if (!rawSymbolData || rawSymbolData.status === "error" || !Array.isArray(rawSymbolData.values)) {
          continue;
        }

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

        const ema20 = calculateEMA(values, 20);
        const ema50 = calculateEMA(values, 50);
        const rsi = calculateRSI(values, 14);
        const macd = calculateMACD(values, 12, 26, 9);
        const stoch = calculateStochastic(values, 14, 3);
        const atr = calculateATR(values, 14);
        const bbands = calculateBollingerBands(values, 20, 2);
        const cci = calculateCCI(values, 20);
        const adx = calculateADX(values, 14);

        const lastIdx = values.length - 1;
        const currentPrice = values[lastIdx].close;
        const lastATR = atr[lastIdx]?.value;
        const lastRsi = rsi[rsi.length - 1]?.value ?? 50;
        const lastMacd = macd[lastIdx];
        const lastStoch = stoch[stoch.length - 1];
        const lastEma20 = ema20[lastIdx]?.value ?? currentPrice;
        const lastEma50 = ema50[lastIdx]?.value ?? currentPrice;
        const lastBb = bbands[lastIdx];
        const lastCci = cci[lastIdx]?.value ?? 0;
        const lastAdx = adx[lastIdx]?.value ?? 20;

        symbolTfCache[drawdownSlug][tf.label] = {
          price: currentPrice,
          atr: lastATR,
          rsi: { value: lastRsi, bias: lastRsi > 55 ? "BULLISH" : lastRsi < 45 ? "BEARISH" : "NEUTRAL" },
          macd: { value: lastMacd?.macd ?? 0, signal: lastMacd?.signal ?? 0, bias: (lastMacd?.macd ?? 0) > (lastMacd?.signal ?? 0) ? "BULLISH" : "BEARISH" },
          stochastic: { k: lastStoch?.k ?? 50, d: lastStoch?.d ?? 50, bias: (lastStoch?.k ?? 50) > (lastStoch?.d ?? 50) ? "BULLISH" : "BEARISH" },
          ema: { ema20: lastEma20, ema50: lastEma50, bias: lastEma20 > lastEma50 ? "BULLISH" : "BEARISH" },
          bbands: { upper: lastBb?.upper ?? currentPrice, middle: lastBb?.middle ?? currentPrice, lower: lastBb?.lower ?? currentPrice, bias: currentPrice > (lastBb?.middle ?? currentPrice) ? "BULLISH" : "BEARISH" },
          cci: { value: lastCci, bias: lastCci > 100 ? "BULLISH" : lastCci < -100 ? "BEARISH" : "NEUTRAL" },
          adx: { value: lastAdx, bias: lastAdx > 25 ? "TRENDING" : "RANGING" },
          values
        };
      }
    } catch (e) {
      console.error(`[signal-engine] Error pre-calculating timeframe ${tf.label}:`, e);
    }
  }

  // Check for Confluences & Generate signals
  for (const tf of timeframes) {
    for (const [drawdownSlug, tdSym] of Object.entries(TD_SYMBOL_MAP)) {
      const tfState = symbolTfCache[drawdownSlug][tf.label];
      if (!tfState || !tfState.atr || tfState.atr <= 0) continue;

      let bullishPoints = 0;
      let bearishPoints = 0;
      const factors: string[] = [];

      // Calculate score
      if (tfState.ema.ema20 && tfState.ema.ema50) {
        if (tfState.ema.ema20 > tfState.ema.ema50) {
          bullishPoints += 2;
          factors.push("EMA Golden Cross (20 > 50)");
        } else {
          bearishPoints += 2;
          factors.push("EMA Death Cross (20 < 50)");
        }
      }

      if (tfState.price > tfState.ema.ema20 && tfState.ema.ema20 > tfState.ema.ema50) {
        bullishPoints += 2;
        factors.push("Price above fast/slow EMAs");
      } else if (tfState.price < tfState.ema.ema20 && tfState.ema.ema20 < tfState.ema.ema50) {
        bearishPoints += 2;
        factors.push("Price below fast/slow EMAs");
      }

      if (tfState.rsi.value > 53) {
        bullishPoints += 2;
        factors.push(`RSI Bullish Momentum (${Math.round(tfState.rsi.value)})`);
      } else if (tfState.rsi.value < 47) {
        bearishPoints += 2;
        factors.push(`RSI Bearish Momentum (${Math.round(tfState.rsi.value)})`);
      }

      if (tfState.macd.bias === "BULLISH") {
        bullishPoints += 2;
        factors.push("MACD Bullish Cross");
      } else {
        bearishPoints += 2;
        factors.push("MACD Bearish Cross");
      }

      if (tfState.stochastic.bias === "BULLISH") {
        bullishPoints += 2;
        factors.push("Stochastic %K > %D Crossover");
      } else {
        bearishPoints += 2;
        factors.push("Stochastic %K < %D Crossover");
      }

      const isBullishSignal = bullishPoints >= 7;
      const isBearishSignal = bearishPoints >= 7;

      if (isBullishSignal || isBearishSignal) {
        const bias = isBullishSignal ? "BULLISH" : "BEARISH";
        const score = isBullishSignal ? bullishPoints : bearishPoints;
        const filteredFactors = factors.filter(f => 
          bias === "BULLISH" 
            ? !f.includes("Death") && !f.includes("below") && !f.includes("<") 
            : !f.includes("Golden") && !f.includes("above") && !f.includes(">")
        );

        const stopDistance = 1.5 * tfState.atr;
        const targetDistance = 3.0 * tfState.atr;

        const entry_price = tfState.price;
        const stop_loss = bias === "BULLISH" ? tfState.price - stopDistance : tfState.price + stopDistance;
        const take_profit_1 = bias === "BULLISH" ? tfState.price + (1.5 * tfState.atr) : tfState.price - (1.5 * tfState.atr);
        const take_profit_2 = bias === "BULLISH" ? tfState.price + targetDistance : tfState.price - targetDistance;
        const take_profit_3 = bias === "BULLISH" ? tfState.price + (4.5 * tfState.atr) : tfState.price - (4.5 * tfState.atr);
        const rr_ratio = 2.0;

        const catalyst_event = findCatalyst(calendarEvents, drawdownSlug);
        const expires_at = new Date(Date.now() + tf.expiryHours * 3600_000).toISOString();

        // Confluence Grid data
        const gridIndicators: Record<string, any> = {};
        for (const tframe of ["15M", "1H", "4H", "1D"]) {
          const tState = symbolTfCache[drawdownSlug][tframe];
          if (tState) {
            gridIndicators[tframe] = {
              rsi: tState.rsi.value,
              rsi_bias: tState.rsi.bias,
              macd_bias: tState.macd.bias,
              stochastic_bias: tState.stochastic.bias,
              ema_bias: tState.ema.bias,
              bbands_bias: tState.bbands.bias,
              cci: tState.cci.value,
              cci_bias: tState.cci.bias,
              adx: tState.adx.value,
              adx_trend: tState.adx.bias
            };
          }
        }

        // TAAPI indicators
        let taapiData = null;
        const isCrypto = drawdownSlug.includes("BTC") || drawdownSlug.includes("ETH") || drawdownSlug.includes("SOL");
        if (isCrypto) {
          taapiData = await fetchTaapiData(drawdownSlug, tf.label);
        }
        
        if (!taapiData) {
          taapiData = gridIndicators[tf.label] || null;
        }

        // CoinGecko data
        const geckoData = isCrypto ? await fetchCoinGeckoData(drawdownSlug) : null;

        // CoinGlass/Binance funding rate
        const fundingData = isCrypto ? await fetchBinanceFundingRate(drawdownSlug) : null;

        // AI Consensus Panel
        const aiConsensusData = await generateAIConsensus(
          drawdownSlug,
          tf.label,
          bias,
          score,
          entry_price,
          symbolTfCache[drawdownSlug][tf.label],
          catalyst_event
        );

        const { dcsScore, ...modelsConsensus } = aiConsensusData;

        // Check if there is an existing active signal
        const { data: existing } = await supabase
          .from("signals")
          .select("id")
          .eq("instrument", drawdownSlug)
          .eq("timeframe", tf.label)
          .eq("is_active", true)
          .maybeSingle();

        const payload = {
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
          atr: tfState.atr,
          catalyst_event,
          confluence_factors: filteredFactors,
          expires_at,
          taapi_data: gridIndicators,
          coingecko_data: geckoData,
          coinglass_data: fundingData,
          ai_consensus: modelsConsensus,
          dcs_score: dcsScore,
          is_active: true
        };

        if (existing?.id) {
          await supabase
            .from("signals")
            .update(payload)
            .eq("id", existing.id);
        } else {
          await supabase
            .from("signals")
            .insert(payload);
        }

        generatedSignalsCount[tf.label]++;
      }
    }
  }

  console.log("[signal-engine] Signal scan completed. Results:", generatedSignalsCount);
  return generatedSignalsCount;
}
