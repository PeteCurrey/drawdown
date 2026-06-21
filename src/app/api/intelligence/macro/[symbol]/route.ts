import { NextResponse } from "next/server";

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

/** Scanner slug → relevant FRED series IDs */
const SYMBOL_SERIES: Record<string, string[]> = {
  EURUSD:  ["FEDFUNDS", "ECBDFR",               "T10YIE", "BAMLH0A0HYM2"],
  GBPUSD:  ["FEDFUNDS", "IUDSOIA",              "T10YIE"],
  USDJPY:  ["FEDFUNDS", "IRSTCB01JPM156N",      "T10YIE"],
  GBPJPY:  ["IUDSOIA",  "IRSTCB01JPM156N",      "T10YIE"],
  SPX:     ["FEDFUNDS", "T10YIE", "UMCSENT",   "VIXCLS", "BAMLH0A0HYM2"],
  NDX:     ["FEDFUNDS", "T10YIE", "UMCSENT",   "VIXCLS"],
  DJI:     ["FEDFUNDS", "T10YIE", "UMCSENT",   "VIXCLS"],
  UKX:     ["IUDSOIA",  "T10YIE",               "VIXCLS"],
  XAGUSD:  ["VIXCLS",   "T10YIE",               "DFF"],
  BTCUSDT: ["VIXCLS",   "UMCSENT"],
  ETHUSDT: ["VIXCLS",   "UMCSENT"],
  XRPUSDT: ["VIXCLS",   "UMCSENT"],
};

/** Primary / secondary rate for rate-differential calculation */
const RATE_PAIRS: Record<string, { primary: string; secondary: string }> = {
  EURUSD: { primary: "FEDFUNDS",  secondary: "ECBDFR" },
  GBPUSD: { primary: "FEDFUNDS",  secondary: "IUDSOIA" },
  USDJPY: { primary: "FEDFUNDS",  secondary: "IRSTCB01JPM156N" },
  GBPJPY: { primary: "IUDSOIA",   secondary: "IRSTCB01JPM156N" },
};

async function fetchFred(series: string, key: string): Promise<number | null> {
  try {
    const url = `${FRED_BASE}?series_id=${series}&api_key=${key}&file_type=json&sort_order=desc&limit=1&observation_start=2020-01-01`;
    const res = await fetch(url, { next: { revalidate: 14400 } }); // 4h
    if (!res.ok) return null;
    const data = await res.json();
    const val = data.observations?.[0]?.value;
    return val && val !== "." ? parseFloat(val) : null;
  } catch {
    return null;
  }
}

function vixRegime(v: number | null): string {
  if (v === null) return "UNKNOWN";
  if (v < 15)  return "CALM";
  if (v < 20)  return "NORMAL";
  if (v < 25)  return "ELEVATED";
  return "FEAR";
}

function regimeLabel(vix: number | null, hySpreadPct: number | null): "RISK-ON" | "RISK-OFF" | "TRANSITIONAL" {
  const fearVix = vix !== null && vix > 20;
  const fearHY  = hySpreadPct !== null && hySpreadPct * 100 > 500; // convert % → bps
  if (!fearVix && !fearHY) return "RISK-ON";
  if (fearVix  && fearHY)  return "RISK-OFF";
  return "TRANSITIONAL";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const slug = symbol.toUpperCase();
  const key  = process.env.FRED_API_KEY ?? "";
  if (!key) return NextResponse.json({ error: "FRED_API_KEY not configured" }, { status: 503 });

  const seriesList = SYMBOL_SERIES[slug] ?? ["FEDFUNDS", "T10YIE", "VIXCLS"];

  const values: Record<string, number | null> = {};
  await Promise.all(
    seriesList.map(async s => { values[s] = await fetchFred(s, key); })
  );

  const vix      = values["VIXCLS"]        ?? null;
  const t10yie   = values["T10YIE"]        ?? null;
  const fedfunds = values["FEDFUNDS"] ?? values["DFF"] ?? null;
  const umcsent  = values["UMCSENT"]       ?? null;
  const hySpread = values["BAMLH0A0HYM2"] ?? null;

  // Approximate real yield: fed funds minus inflation breakeven
  const real_yield_10y = (fedfunds !== null && t10yie !== null)
    ? +((fedfunds - t10yie).toFixed(2))
    : null;

  // Rate differential
  const ratePair = RATE_PAIRS[slug];
  let rate_differential: number | null = null;
  if (ratePair) {
    const p = values[ratePair.primary]   ?? null;
    const s = values[ratePair.secondary] ?? null;
    if (p !== null && s !== null) rate_differential = +((p - s).toFixed(2));
  }

  return NextResponse.json({
    symbol:             slug,
    series_values:      values,
    rate_differential,
    real_yield_10y,
    vix_level:          vix,
    vix_regime:         vixRegime(vix),
    consumer_sentiment: umcsent,
    hy_spread_bps:      hySpread !== null ? +(hySpread * 100).toFixed(0) : null,
    regime_label:       regimeLabel(vix, hySpread),
    fetched_at:         new Date().toISOString(),
  });
}
