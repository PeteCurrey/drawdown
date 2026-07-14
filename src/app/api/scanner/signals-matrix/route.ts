import { NextResponse } from "next/server";

type Signal = "BUY" | "SELL" | "NEUTRAL";
type Consensus = "STRONG BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG SELL";

// Twelve Data symbol map for batch requests
const TD_MAP: Record<string, string> = {
  EURUSD:  "EUR/USD",
  GBPUSD:  "GBP/USD",
  USDJPY:  "USD/JPY",
  GBPJPY:  "GBP/JPY",
  XAGUSD:  "XAG/USD",
  UKX:     "FTSE",
  SPX:     "SPX500",
  NDX:     "QQQ",
  DJI:     "DJI",
  BTCUSDT: "BTC/USD",
  ETHUSDT: "ETH/USD",
  XRPUSDT: "XRP/USD",
};

const SLUGS = Object.keys(TD_MAP);

const TF_MAP = [
  { tf: "15min", label: "15m"    },
  { tf: "1h",    label: "1H"     },
  { tf: "4h",    label: "4H"     },
  { tf: "1day",  label: "Daily"  },
  { tf: "1week", label: "Weekly" },
];

function rsiToSignal(rsi: number): Signal {
  if (rsi >= 60) return "BUY";
  if (rsi <= 40) return "SELL";
  return "NEUTRAL";
}
function signalScore(s: Signal): number {
  return s === "BUY" ? 1 : s === "SELL" ? -1 : 0;
}
function toConsensus(score: number): Consensus {
  if (score >= 4)  return "STRONG BUY";
  if (score >= 2)  return "BUY";
  if (score <= -4) return "STRONG SELL";
  if (score <= -2) return "SELL";
  return "NEUTRAL";
}

export async function GET() {
  const key = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 503 });

  // Batch fetch: one request per timeframe, all symbols at once
  const batchSymbols = Object.values(TD_MAP).join(",");

  const tfFetches = TF_MAP.map(({ tf, label }) =>
    fetch(
      `https://api.twelvedata.com/rsi?symbol=${encodeURIComponent(batchSymbols)}&interval=${tf}&time_period=14&outputsize=1&apikey=${key}`,
      { next: { revalidate: 300 } }                        // 5-min server cache
    )
      .then(r => r.json())
      .then(data => ({ label, data }))
      .catch(() => ({ label, data: {} }))
  );

  const tfResults = await Promise.all(tfFetches);

  const matrix: Record<string, {
    signals: Record<string, Signal>;
    totalScore: number;
    consensus: Consensus;
    alignedCount: number;    // how many TFs agree with majority
    alignedDir: Signal;
  }> = {};

  for (const slug of SLUGS) {
    const tdSym = TD_MAP[slug];
    const signals: Record<string, Signal> = {};
    let score = 0;

    for (const { label, data } of tfResults) {
      // Batch response: keyed by symbol name OR single symbol if only one
      const symData = data[tdSym] ?? (SLUGS.length === 1 ? data : null);
      const rsiStr = symData?.values?.[0]?.rsi;
      const rsi = rsiStr ? parseFloat(rsiStr) : null;
      const sig: Signal = rsi !== null ? rsiToSignal(rsi) : "NEUTRAL";
      signals[label] = sig;
      score += signalScore(sig);
    }

    const allSigs = Object.values(signals);
    const bullCount = allSigs.filter(s => s === "BUY").length;
    const bearCount = allSigs.filter(s => s === "SELL").length;
    const alignedCount = Math.max(bullCount, bearCount);
    const alignedDir: Signal = bullCount > bearCount ? "BUY" : bearCount > bullCount ? "SELL" : "NEUTRAL";

    matrix[slug] = {
      signals,
      totalScore: score,
      consensus: toConsensus(score),
      alignedCount,
      alignedDir,
    };
  }

  return NextResponse.json({
    matrix,
    updatedAt: new Date().toISOString(),
  });
}
