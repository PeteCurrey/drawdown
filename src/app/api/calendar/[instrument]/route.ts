import { NextResponse } from "next/server";

const INSTRUMENT_CURRENCIES: Record<string, string[]> = {
  EURUSD:["EUR","USD"], GBPUSD:["GBP","USD"], USDJPY:["USD","JPY"], GBPJPY:["GBP","JPY"],
  XAGUSD:["USD"], UKX:["GBP"], SPX:["USD"], NDX:["USD"], DJI:["USD"],
  BTCUSDT:["USD"], ETHUSDT:["USD"], XRPUSDT:["USD"],
};
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD:"US", EUR:"EU", GBP:"GB", JPY:"JP", CHF:"CH", AUD:"AU", CAD:"CA", NZD:"NZ",
};

export async function GET(_req: Request, { params }: { params: Promise<{ instrument: string }> }) {
  const { instrument } = await params;
  const key = process.env.FINNHUB_API_KEY;
  const currencies = INSTRUMENT_CURRENCIES[instrument.toUpperCase()] ?? ["USD"];

  if (!key) {
    // Return mock data when no API key
    return NextResponse.json({ events: getMockEvents(currencies) });
  }

  try {
    const now = new Date();
    const from = now.toISOString().split("T")[0];
    const to = new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0];
    const res = await fetch(`https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${key}`);
    const data = await res.json();
    const countries = currencies.map(c => CURRENCY_TO_COUNTRY[c]).filter(Boolean);
    const events = (data.economicCalendar ?? [])
      .filter((e: any) => countries.includes(e.country))
      .slice(0, 5)
      .map((e: any) => ({
        time: e.time, country: e.country, event: e.event,
        impact: e.impact, previous: e.prev, estimate: e.estimate,
      }));
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: getMockEvents(currencies) });
  }
}

function getMockEvents(currencies: string[]) {
  const base = [
    { time: "13:30", country: "US", event: "Initial Jobless Claims", impact: "medium", previous: "220K", estimate: "215K" },
    { time: "15:00", country: "US", event: "Fed Chair Speech", impact: "high", previous: null, estimate: null },
    { time: "09:00", country: "EU", event: "CPI Flash Estimate YoY", impact: "high", previous: "2.4%", estimate: "2.3%" },
    { time: "09:30", country: "GB", event: "GDP MoM", impact: "high", previous: "0.1%", estimate: "0.2%" },
    { time: "00:50", country: "JP", event: "Trade Balance", impact: "medium", previous: "-\u00a5342B", estimate: "-\u00a5280B" },
  ];
  const countries: string[] = currencies.map(c => c === "USD" ? "US" : c === "EUR" ? "EU" : c === "GBP" ? "GB" : c === "JPY" ? "JP" : "US");
  return base.filter(e => countries.includes(e.country as string)).slice(0, 4);
}
