import { NextRequest, NextResponse } from "next/server";
import { MARKETS_CONFIG } from "@/lib/markets-config";
import { getMarketHistory } from "@/lib/market";
import { calculateRSI, calculateEMA } from "@/lib/indicators";

export async function GET(request: NextRequest) {
  try {
    const consensus = await Promise.all(
      MARKETS_CONFIG.map(async (inst) => {
        try {
          // Fetch last 50 daily candles
          const history = await getMarketHistory(inst.ticker, "1d", 50);
          
          if (!history || history.length < 15) {
            return {
              symbol: inst.displayPair,
              score: 50,
              verdict: "Neutral",
              rsi: "50.0",
              trend: "Neutral",
              lastUpdated: new Date().toISOString()
            };
          }

          // Calculate RSI (14)
          const rsiValues = calculateRSI(history, 14);
          const latestRsiObj = rsiValues[rsiValues.length - 1];
          const rsi = latestRsiObj && latestRsiObj.value !== null ? latestRsiObj.value : 50;

          // Calculate EMA (20)
          const emaValues = calculateEMA(history, 20);
          const latestEmaObj = emaValues[emaValues.length - 1];
          const ema = latestEmaObj && latestEmaObj.value !== null ? latestEmaObj.value : history[history.length - 1].close;

          const latestClose = history[history.length - 1].close;

          // Trend: Bullish if close is above 20 EMA
          const trend = latestClose >= ema ? "Bullish" : "Bearish";

          // Consensus score calculation
          let score = 50;
          if (trend === "Bullish") {
            score += 15;
          } else {
            score -= 15;
          }

          if (rsi < 30) {
            score += 25;
          } else if (rsi < 40) {
            score += 10;
          } else if (rsi > 70) {
            score -= 25;
          } else if (rsi > 60) {
            score -= 10;
          }

          score = Math.max(5, Math.min(95, score));

          let verdict = "Neutral";
          if (score >= 75) verdict = "Strong Buy";
          else if (score >= 60) verdict = "Buy";
          else if (score <= 25) verdict = "Strong Sell";
          else if (score <= 40) verdict = "Sell";

          return {
            symbol: inst.displayPair,
            score: Math.round(score),
            verdict,
            rsi: rsi.toFixed(1),
            trend,
            lastUpdated: new Date().toISOString()
          };
        } catch (err) {
          console.error(`Error calculating consensus for ${inst.displayPair}:`, err);
          return {
            symbol: inst.displayPair,
            score: 50,
            verdict: "Neutral",
            rsi: "50.0",
            trend: "Neutral",
            lastUpdated: new Date().toISOString()
          };
        }
      })
    );

    return NextResponse.json(consensus);
  } catch (error: any) {
    console.error("Consensus Endpoint Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

