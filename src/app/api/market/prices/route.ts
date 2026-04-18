import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;
const CACHE_TTL_SECONDS = 30;

const INSTRUMENTS = [
  { symbol: "FTSE:UKX", name: "FTSE 100" },
  { symbol: "SPX", name: "S&P 500" },
  { symbol: "DJI", name: "Dow Jones" },
  { symbol: "IXIC", name: "NASDAQ" },
  { symbol: "DAX:DAX", name: "DAX 40" },
  { symbol: "N225", name: "Nikkei 225" },
  { symbol: "GBP/USD", name: "GBPUSD" },
  { symbol: "EUR/USD", name: "EURUSD" },
  { symbol: "USD/JPY", name: "USDJPY" },
  { symbol: "BTC/USD", name: "BTCUSD" },
  { symbol: "XAU/USD", name: "Gold" },
  { symbol: "XAG/USD", name: "Silver" },
  { symbol: "CL:F", name: "Crude Oil (WTI)" },
  { symbol: "BZ:F", name: "Brent Oil" },
  { symbol: "NG:F", name: "Natural Gas" },
];

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing configuration" }, { status: 500 });
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  try {
    // 1. Check cache
    const { data: cachedData } = await supabase
      .from("market_data_cache")
      .select("*")
      .eq("instrument", "CORE_TICKER")
      .eq("data_type", "price")
      .single();

    if (cachedData && new Date(cachedData.expires_at) > new Date()) {
      return NextResponse.json(cachedData.data);
    }

    // 2. Cache miss or expired -> Fetch from TwelveData
    if (!TWELVEDATA_API_KEY) {
      // Fallback if no API key
      return NextResponse.json(cachedData?.data || { error: "API key missing and no cache" });
    }

    const symbols = INSTRUMENTS.map(i => i.symbol).join(",");
    const response = await fetch(
      `https://api.twelvedata.com/price?symbol=${symbols}&apikey=${TWELVEDATA_API_KEY}`
    );
    const rawData = await response.json();

    // Format the data
    const formattedData = INSTRUMENTS.map(inst => {
      const priceInfo = rawData[inst.symbol] || { price: "0.00" };
      // Note: TwelveData 'price' endpoint is basic. 
      // In production, 'quote' is better for change % but 'price' is a good start for a ticker.
      return {
        ...inst,
        price: parseFloat(priceInfo.price || "0").toFixed(inst.symbol.includes("/") ? 4 : 2),
        change: (Math.random() * 2 - 1).toFixed(2), // Mocking change for MVP since basic 'price' endpoint doesn't give it
        changePercent: (Math.random() * 0.5 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2),
      };
    });

    const expiresAt = new Date(Date.now() + CACHE_TTL_SECONDS * 1000).toISOString();

    // 3. Update cache
    await supabase.from("market_data_cache").upsert({
      instrument: "CORE_TICKER",
      data_type: "price",
      data: formattedData as any,
      fetched_at: new Date().toISOString(),
      expires_at: expiresAt,
    }, { onConflict: "instrument, data_type" });

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error("Market Data Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
