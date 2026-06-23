import { NextResponse } from "next/server";
import { currencyFilter } from "@/lib/instruments";

/**
 * CURRENCY_TO_COUNTRY maps ISO currency codes to the 2-letter country codes
 * that Finnhub uses in its economic calendar.
 */
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US", EUR: "EU", GBP: "GB", JPY: "JP",
  CHF: "CH", AUD: "AU", CAD: "CA", NZD: "NZ",
};

// Server-side 1-hour in-memory cache
const serverCache = new Map<string, { events: any[]; ts: number }>();
const CACHE_TTL = 3600 * 1000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ instrument: string }> }
) {
  const { instrument } = await params;
  const slug = instrument.toUpperCase();
  const key = process.env.FINNHUB_API_KEY;

  // currencyFilter covers all 30 instruments from lib/instruments.ts
  const currencies = currencyFilter(slug);

  if (!key) {
    console.warn("[calendar] FINNHUB_API_KEY not set");
    return NextResponse.json({ events: getMockEvents(currencies) });
  }

  // Check cache
  const cached = serverCache.get(slug);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ events: cached.events });
  }

  try {
    const now = new Date();
    const from = now.toISOString().split("T")[0];
    const to = new Date(now.getTime() + 7 * 86400_000).toISOString().split("T")[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${key}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    const countries = currencies
      .map(c => CURRENCY_TO_COUNTRY[c])
      .filter(Boolean);

    const HIGH_IMPACT = ["NFP", "CPI", "FOMC", "BOE", "ECB", "GDP", "PMI", "ISM",
      "Retail Sales", "Unemployment", "Interest Rate", "Non-Farm"];

    const events = (data.economicCalendar ?? [])
      .filter((e: any) => countries.includes(e.country))
      // Prefer high-impact events, fall back to any
      .sort((a: any, b: any) => {
        const aHigh = HIGH_IMPACT.some(k => a.event?.includes(k)) ? 0 : 1;
        const bHigh = HIGH_IMPACT.some(k => b.event?.includes(k)) ? 0 : 1;
        return aHigh - bHigh;
      })
      .slice(0, 5)
      .map((e: any) => ({
        time: e.time,
        country: e.country,
        event: e.event,
        impact: e.impact,
        previous: e.prev,
        estimate: e.estimate,
      }));

    serverCache.set(slug, { events, ts: Date.now() });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: getMockEvents(currencies) });
  }
}

function getMockEvents(currencies: string[]) {
  const base = [
    { time: "13:30", country: "US", event: "Initial Jobless Claims",    impact: "medium", previous: "220K",  estimate: "215K"  },
    { time: "15:00", country: "US", event: "Fed Chair Speech",           impact: "high",   previous: null,    estimate: null    },
    { time: "09:00", country: "EU", event: "CPI Flash Estimate YoY",    impact: "high",   previous: "2.4%",  estimate: "2.3%"  },
    { time: "09:30", country: "GB", event: "GDP MoM",                   impact: "high",   previous: "0.1%",  estimate: "0.2%"  },
    { time: "00:50", country: "JP", event: "Trade Balance",              impact: "medium", previous: "-¥342B",estimate: "-¥280B"},
    { time: "03:30", country: "AU", event: "RBA Rate Decision",          impact: "high",   previous: "4.10%", estimate: "4.10%" },
    { time: "14:15", country: "CH", event: "SNB Policy Rate",            impact: "high",   previous: "1.50%", estimate: "1.25%" },
    { time: "14:30", country: "CA", event: "Core CPI MoM",              impact: "medium", previous: "0.1%",  estimate: "0.2%"  },
  ];
  const countries = currencies.map(c => CURRENCY_TO_COUNTRY[c]).filter(Boolean);
  return base.filter(e => countries.includes(e.country)).slice(0, 4);
}
