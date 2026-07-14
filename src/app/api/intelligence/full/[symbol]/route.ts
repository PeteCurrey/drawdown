import { NextResponse } from "next/server";

type FetchResult = { data: any; ok: boolean; error?: string };

async function safeFetch(url: string): Promise<FetchResult> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return { data: null, ok: false, error: data.error ?? `HTTP ${res.status}` };
    return { data, ok: true };
  } catch (e) {
    return { data: null, ok: false, error: String(e) };
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const slug = symbol.toUpperCase();
  const { origin } = new URL(req.url);

  const [cotR, macroR, retailR, newsR] = await Promise.all([
    safeFetch(`${origin}/api/intelligence/cot/${slug}`),
    safeFetch(`${origin}/api/intelligence/macro/${slug}`),
    safeFetch(`${origin}/api/intelligence/retail-sentiment/${slug}`),
    safeFetch(`${origin}/api/intelligence/news-sentiment/${slug}`),
  ]);

  const source_errors: string[] = [];
  if (!cotR.ok)    source_errors.push(`COT: ${cotR.error}`);
  if (!macroR.ok)  source_errors.push(`Macro: ${macroR.error}`);
  if (!retailR.ok) source_errors.push(`Retail: ${retailR.error}`);
  if (!newsR.ok)   source_errors.push(`News: ${newsR.error}`);

  const ok = [cotR.ok, macroR.ok, retailR.ok, newsR.ok].filter(Boolean).length;
  const data_quality: "FULL" | "PARTIAL" | "DEGRADED" =
    ok === 4 ? "FULL" : ok >= 2 ? "PARTIAL" : "DEGRADED";

  return NextResponse.json({
    symbol:           slug,
    cot:              cotR.ok    ? cotR.data    : null,
    macro:            macroR.ok  ? macroR.data  : null,
    retail_sentiment: retailR.ok ? retailR.data : null,
    news:             newsR.ok   ? newsR.data   : null,
    source_errors,
    data_quality,
    fetched_at: new Date().toISOString(),
  });
}
