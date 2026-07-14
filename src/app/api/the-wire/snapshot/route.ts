import { NextResponse } from "next/server";

const FH_KEY = process.env.FINNHUB_API_KEY ?? "";

interface Tick {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePct: number;
}

const SYMBOLS: { key: string; label: string; fh: string }[] = [
  { key: "GBPUSD",  label: "GBP/USD",  fh: "OANDA:GBP_USD"    },
  { key: "EURUSD",  label: "EUR/USD",  fh: "OANDA:EUR_USD"    },
  { key: "USDJPY",  label: "USD/JPY",  fh: "OANDA:USD_JPY"    },
  { key: "XAUUSD",  label: "XAU/USD",  fh: "OANDA:XAU_USD"    },
  { key: "SPX500",  label: "S&P 500",  fh: "OANDA:SPX500_USD" },
  { key: "BTCUSD",  label: "BTC/USD",  fh: "BINANCE:BTCUSDT"  },
];

const cache = new Map<string, { data: Tick[]; ts: number }>();
const TTL = 55_000;

export async function GET() {
  if (!FH_KEY) return NextResponse.json([], { status: 204 });

  const cached = cache.get("snap");
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const results = await Promise.allSettled(
      SYMBOLS.map(async (s) => {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(s.fh)}&token=${FH_KEY}`,
          { next: { revalidate: 55 } }
        );
        if (!res.ok) return null;
        const q = await res.json();
        if (!q.c) return null;
        return {
          symbol: s.key,
          label: s.label,
          price: q.c,
          change: q.d ?? 0,
          changePct: q.dp ?? 0,
        } as Tick;
      })
    );

    const ticks: Tick[] = results
      .filter((r): r is PromiseFulfilledResult<Tick> => r.status === "fulfilled" && r.value !== null)
      .map((r) => r.value);

    cache.set("snap", { data: ticks, ts: Date.now() });
    return NextResponse.json(ticks);
  } catch (err) {
    console.error("[the-wire/snapshot]", err);
    return NextResponse.json([], { status: 500 });
  }
}
