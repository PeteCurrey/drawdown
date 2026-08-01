import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

interface IndicatorItem {
  key: string;
  name: string;
  value: number | null;
  prevValue: number | null;
  unit: string;
  change: number | null;
  direction: "up" | "down" | "flat";
  source: string;
  period?: string;
}

async function fetchFredSeries(seriesId: string, apiKey: string): Promise<{ current: number | null; prev: number | null }> {
  try {
    const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=5`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { current: null, prev: null };
    const data = await res.json();
    const validObs = (data.observations || [])
      .filter((o: any) => o.value && o.value !== ".")
      .map((o: any) => parseFloat(o.value));
    
    return {
      current: validObs[0] ?? null,
      prev: validObs[1] ?? null,
    };
  } catch (err) {
    console.error(`FRED fetch error for ${seriesId}:`, err);
    return { current: null, prev: null };
  }
}

async function fetchEiaWti(apiKey: string): Promise<{ current: number | null; prev: number | null }> {
  if (!apiKey) return { current: null, prev: null };
  try {
    const url = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${apiKey}&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&length=5`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { current: null, prev: null };
    const json = await res.json();
    const rows = json?.response?.data || [];
    const validVals = rows.map((r: any) => parseFloat(r.value)).filter((v: number) => !isNaN(v));
    return {
      current: validVals[0] ?? null,
      prev: validVals[1] ?? null,
    };
  } catch (err) {
    console.error("EIA WTI fetch error:", err);
    return { current: null, prev: null };
  }
}

export async function GET() {
  const fredKey = process.env.FRED_API_KEY ?? "";
  const eiaKey = process.env.EIA_API_KEY ?? "";

  // Fallbacks if API keys are missing or calls fail
  const defaultValues: Record<string, { current: number; prev: number; unit: string; name: string; source: string }> = {
    fed_rate: { name: "Fed Funds Rate", current: 5.25, prev: 5.50, unit: "%", source: "FRED (FEDFUNDS)" },
    boe_rate: { name: "BoE Base Rate", current: 5.00, prev: 5.25, unit: "%", source: "FRED (BOERUKM)" },
    us_cpi: { name: "US CPI YoY", current: 3.0, prev: 3.2, unit: "%", source: "FRED (CPIAUCSL)" },
    uk_cpi: { name: "UK CPI YoY", current: 2.3, prev: 2.6, unit: "%", source: "FRED (GBRCPIALLMINMEI)" },
    us_10y: { name: "US 10Y Yield", current: 4.18, prev: 4.25, unit: "%", source: "FRED (DGS10)" },
    wti_oil: { name: "WTI Crude Oil", current: 77.40, prev: 76.80, unit: "USD/bbl", source: "EIA" },
  };

  const results: Record<string, IndicatorItem> = {};

  const seriesMap = [
    { key: "fed_rate", series: "FEDFUNDS", name: "Fed Funds Rate", unit: "%" },
    { key: "boe_rate", series: "BOERUKM", name: "BoE Base Rate", unit: "%" },
    { key: "us_cpi", series: "CPIAUCSL", name: "US CPI YoY", unit: "%" },
    { key: "uk_cpi", series: "GBRCPIALLMINMEI", name: "UK CPI YoY", unit: "%" },
    { key: "us_10y", series: "DGS10", name: "US 10Y Yield", unit: "%" },
  ];

  await Promise.all([
    ...seriesMap.map(async (item) => {
      let data = { current: null as number | null, prev: null as number | null };
      if (fredKey) {
        data = await fetchFredSeries(item.series, fredKey);
      }
      const def = defaultValues[item.key];
      const val = data.current ?? def.current;
      const prev = data.prev ?? def.prev;
      const change = val !== null && prev !== null ? parseFloat((val - prev).toFixed(2)) : 0;
      const direction: "up" | "down" | "flat" = change > 0 ? "up" : change < 0 ? "down" : "flat";

      results[item.key] = {
        key: item.key,
        name: item.name,
        value: val,
        prevValue: prev,
        unit: item.unit,
        change,
        direction,
        source: fredKey ? `FRED (${item.series})` : `Mock`,
      };
    }),
    (async () => {
      let eiaData = { current: null as number | null, prev: null as number | null };
      if (eiaKey) {
        eiaData = await fetchEiaWti(eiaKey);
      }
      // If EIA failed or no key, try FRED fallback DCOILWTICO
      if (eiaData.current === null && fredKey) {
        eiaData = await fetchFredSeries("DCOILWTICO", fredKey);
      }
      const def = defaultValues.wti_oil;
      const val = eiaData.current ?? def.current;
      const prev = eiaData.prev ?? def.prev;
      const change = val !== null && prev !== null ? parseFloat((val - prev).toFixed(2)) : 0;
      const direction: "up" | "down" | "flat" = change > 0 ? "up" : change < 0 ? "down" : "flat";

      results["wti_oil"] = {
        key: "wti_oil",
        name: "WTI Crude Oil",
        value: val,
        prevValue: prev,
        unit: "USD/bbl",
        change,
        direction,
        source: eiaKey ? "EIA v2" : fredKey ? "FRED (DCOILWTICO)" : "Mock",
      };
    })(),
  ]);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    indicators: results,
    list: Object.values(results),
  });
}
