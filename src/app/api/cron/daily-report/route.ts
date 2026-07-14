import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// ─── Instruments ──────────────────────────────────────────────────────────────
const INSTRUMENTS = [
  { slug: "EURUSD",  display: "EUR/USD", tdSym: "EUR/USD", category: "forex"     },
  { slug: "GBPUSD",  display: "GBP/USD", tdSym: "GBP/USD", category: "forex"     },
  { slug: "USDJPY",  display: "USD/JPY", tdSym: "USD/JPY", category: "forex"     },
  { slug: "GBPJPY",  display: "GBP/JPY", tdSym: "GBP/JPY", category: "forex"     },
  { slug: "XAGUSD",  display: "XAG/USD", tdSym: "XAG/USD", category: "commodity" },
  { slug: "UKX",     display: "UK100",   tdSym: "FTSE",    category: "index"     },
  { slug: "SPX",     display: "S&P 500", tdSym: "SPX500",  category: "index"     },
  { slug: "NDX",     display: "NAS100",  tdSym: "QQQ",     category: "index"     },
  { slug: "DJI",     display: "US30",    tdSym: "DJI",     category: "index"     },
  { slug: "BTCUSDT", display: "BTC/USD", tdSym: "BTC/USD", category: "crypto"    },
  { slug: "ETHUSDT", display: "ETH/USD", tdSym: "ETH/USD", category: "crypto"    },
  { slug: "XRPUSDT", display: "XRP/USD", tdSym: "XRP/USD", category: "crypto"    },
];

// Macro indicators to fetch for the environment section
const MACRO_SYMBOLS = ["VIX", "DXY", "XAU/USD"];
const FRED_SERIES   = ["VIXCLS", "T10YIE", "DFF", "UMCSENT"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractJSON(text: string): any {
  try { return JSON.parse(text); } catch {}
  const block = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (block) try { return JSON.parse(block[1]); } catch {}
  const raw = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (raw) try { return JSON.parse(raw[0]); } catch {}
  return null;
}

async function fetchTD(path: string, key: string): Promise<any> {
  try {
    const r = await fetch(`https://api.twelvedata.com/${path}&apikey=${key}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

async function fetchFred(series: string, key: string): Promise<number | null> {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${key}&file_type=json&sort_order=desc&limit=1&observation_start=2020-01-01`;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    const d = await r.json();
    const v = d.observations?.[0]?.value;
    return v && v !== "." ? parseFloat(v) : null;
  } catch { return null; }
}

// ─── Report Generation ────────────────────────────────────────────────────────
export async function generateDailyReport() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? "";
  const openaiKey    = process.env.OPENAI_API_KEY    ?? "";
  const tdKey        = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
  const fredKey      = process.env.FRED_API_KEY      ?? "";
  const finnhubKey   = process.env.FINNHUB_API_KEY   ?? "";

  // ── 1. Fetch all data in parallel ─────────────────────────────────────────
  const allTdSymbols = [...MACRO_SYMBOLS, ...INSTRUMENTS.map(i => i.tdSym)].join(",");

  const [
    batchQuotes, batchRSI,
    vixFred, t10yFred, dffFred, umcsentFred,
    calendarRes,
  ] = await Promise.all([
    tdKey ? fetchTD(`quote?symbol=${encodeURIComponent(allTdSymbols)}`, tdKey) : null,
    tdKey ? fetchTD(`rsi?symbol=${encodeURIComponent(INSTRUMENTS.map(i=>i.tdSym).join(","))}&interval=1day&time_period=14&outputsize=1`, tdKey) : null,
    fredKey ? fetchFred("VIXCLS", fredKey) : null,
    fredKey ? fetchFred("T10YIE", fredKey)  : null,
    fredKey ? fetchFred("DFF",    fredKey)  : null,
    fredKey ? fetchFred("UMCSENT",fredKey)  : null,
    finnhubKey
      ? fetch(`https://finnhub.io/api/v1/calendar/economic?token=${finnhubKey}`, { cache: "no-store" })
          .then(r => r.json()).catch(() => ({ economicCalendar: [] }))
      : { economicCalendar: [] },
  ]);

  // Parse quotes (batch returns object keyed by symbol, or single if only one)
  const getQuote = (sym: string) => {
    if (!batchQuotes) return null;
    return batchQuotes[sym] ?? batchQuotes; // single-symbol fallback
  };
  const getRSI = (sym: string) => {
    if (!batchRSI) return null;
    const d = batchRSI[sym] ?? batchRSI;
    return d?.values?.[0]?.rsi ? parseFloat(d.values[0].rsi) : null;
  };

  // Macro environment numbers
  const vixQ   = getQuote("VIX");
  const dxyQ   = getQuote("DXY");
  const goldQ  = getQuote("XAU/USD");
  const vix    = vixFred ?? (vixQ?.close   ? parseFloat(vixQ.close)   : null);
  const dxy    = dxyQ?.close   ? parseFloat(dxyQ.close)   : null;
  const dxyChg = dxyQ?.percent_change ? parseFloat(dxyQ.percent_change) : null;
  const gold   = goldQ?.close  ? parseFloat(goldQ.close)  : null;
  const goldChg = goldQ?.percent_change ? parseFloat(goldQ.percent_change) : null;
  const yield10y = t10yFred;
  const realYield = dffFred !== null && t10yFred !== null ? +(dffFred - t10yFred).toFixed(2) : null;
  const vixRegime = !vix ? "UNKNOWN" : vix < 15 ? "CALM" : vix < 20 ? "NORMAL" : vix < 25 ? "ELEVATED" : "FEAR";

  // ── 2. Today's events (high + medium impact, sorted by time) ──────────────
  const today = new Date().toISOString().substring(0, 10);
  const allEvents: any[] = calendarRes?.economicCalendar ?? [];
  const todayEvents = allEvents
    .filter((e: any) => {
      const d = e.date ?? e.time ?? "";
      return d.startsWith(today) && (e.impact === "high" || e.impact === "medium" || e.actual === "" );
    })
    .sort((a: any, b: any) => (a.time ?? a.date ?? "").localeCompare(b.time ?? b.date ?? ""))
    .slice(0, 15)
    .map((e: any) => ({
      time:     e.time?.substring(11, 16) ?? "TBD",
      currency: e.currency ?? e.country ?? "",
      event:    e.event ?? e.description ?? "",
      previous: e.prev ?? e.previous ?? "",
      forecast: e.estimate ?? e.forecast ?? "",
      impact:   e.impact ?? "low",
    }));

  // ── 3. Instrument data for briefs ─────────────────────────────────────────
  const instrData = INSTRUMENTS.map(inst => {
    const q = getQuote(inst.tdSym);
    const rsi = getRSI(inst.tdSym);
    return {
      slug:     inst.slug,
      display:  inst.display,
      category: inst.category,
      price:    q?.close          ? parseFloat(q.close)           : null,
      changePct:q?.percent_change ? parseFloat(q.percent_change)  : null,
      rsiDaily: rsi,
    };
  });

  // ── 4. GPT-4.1 Macro Narrative ─────────────────────────────────────────────
  let macroNarrative = "";
  if (openaiKey) {
    const macroPrompt = `You are writing the macro section of a daily trading briefing for professional day traders.
Write 3-4 sentences covering: current risk sentiment (VIX ${vix?.toFixed(1) ?? "N/A"} — ${vixRegime}), 
dollar strength (DXY ${dxy?.toFixed(2) ?? "N/A"}, ${dxyChg !== null ? (dxyChg > 0 ? "+" : "") + dxyChg.toFixed(2) + "%" : "N/A"} today), 
safe haven flows (Gold ${gold?.toFixed(0) ?? "N/A"}, ${goldChg !== null ? (goldChg > 0 ? "+" : "") + goldChg.toFixed(2) + "%" : "N/A"}),
and yield environment (10Y Breakeven Inflation ${yield10y?.toFixed(2) ?? "N/A"}%, Real Yield ${realYield?.toFixed(2) ?? "N/A"}%).
Today's market regime: ${vixRegime}.
Be direct. No waffle. Write like a Bloomberg macro brief. Bold key numbers by wrapping in **asterisks**.`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4.1", max_tokens: 300,
          messages: [{ role: "user", content: macroPrompt }],
        }),
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        macroNarrative = d.choices?.[0]?.message?.content ?? "";
      }
    } catch (e) {
      console.error("[daily-report] GPT macro error:", e);
    }
  }

  // ── 5. Claude batch instrument briefs ─────────────────────────────────────
  let instrumentBriefs: any[] = [];
  if (anthropicKey) {
    const instrSummary = instrData.map(i =>
      `${i.display} (${i.category}): Price=${i.price?.toFixed(i.price > 100 ? 2 : 5) ?? "N/A"} | Change=${i.changePct !== null ? (i.changePct > 0 ? "+" : "") + i.changePct.toFixed(2) + "%" : "N/A"} | RSI=${i.rsiDaily?.toFixed(1) ?? "N/A"}`
    ).join("\n");

    const eventContext = todayEvents.slice(0, 5).map(e => `${e.time} UTC — ${e.currency} ${e.event} (${e.impact} impact)`).join(", ") || "None";

    const batchPrompt = `You are generating morning trading briefings for professional traders. Analyse each instrument and return a JSON array.

Market regime: VIX ${vix?.toFixed(1) ?? "N/A"} (${vixRegime}), DXY ${dxy?.toFixed(2) ?? "N/A"} (${dxyChg !== null ? (dxyChg > 0 ? "+" : "") + dxyChg.toFixed(2) + "%" : "N/A"}), Gold ${gold?.toFixed(0) ?? "N/A"} (${goldChg !== null ? (goldChg > 0 ? "+" : "") + goldChg.toFixed(2) + "%" : "N/A"})
Key events today: ${eventContext}

Instruments:
${instrSummary}

RSI interpretation: >60=overbought risk, 40-60=neutral, <40=oversold opportunity. Consider the macro regime.

Return ONLY a JSON array of exactly ${INSTRUMENTS.length} objects, one per instrument in the same order:
[
  {
    "slug": "EURUSD",
    "bias": "BULLISH or BEARISH or NEUTRAL",
    "setup_score": 0-100,
    "summary": "one punchy sentence max 15 words — no filler",
    "entry_zone": "specific price range or level",
    "target_1": "specific price",
    "target_2": "specific price",
    "stop": "specific price",
    "risk_reward": "1:X.X",
    "best_timeframe": "INTRADAY or SWING or POSITION",
    "key_catalyst": "one sentence on biggest catalyst today"
  }
]`;

    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const msg = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        messages: [{ role: "user", content: batchPrompt }],
      });
      const text = msg.content[0]?.type === "text" ? msg.content[0].text : "";
      const parsed = extractJSON(text);
      if (Array.isArray(parsed)) {
        instrumentBriefs = parsed.map((b: any, i: number) => ({
          ...b,
          display:  INSTRUMENTS[i]?.display ?? b.slug,
          price:    instrData[i]?.price,
          changePct:instrData[i]?.changePct,
          category: INSTRUMENTS[i]?.category,
        }));
      }
    } catch (e) {
      console.error("[daily-report] Claude briefs error:", e);
    }
  }

  // Sort by setup_score descending
  instrumentBriefs.sort((a, b) => (b.setup_score ?? 0) - (a.setup_score ?? 0));

  // ── 6. Top 3 setups ───────────────────────────────────────────────────────
  const topSetups = instrumentBriefs.slice(0, 3).map((b, i) => ({
    rank:    i + 1,
    ...b,
  }));

  // ── 7. Risk Radar ─────────────────────────────────────────────────────────
  const riskRadar: Array<{ type: string; severity: string; description: string }> = [];

  // High-impact events
  const highEvents = todayEvents.filter(e => e.impact === "high").slice(0, 3);
  highEvents.forEach(e => {
    riskRadar.push({
      type: "EVENT",
      severity: "HIGH",
      description: `${e.time} UTC — ${e.currency} ${e.event}: watch for sharp moves in ${e.currency}-denominated pairs`,
    });
  });

  // VIX regime warning
  if (vix && vix > 20) {
    riskRadar.push({
      type: "VOLATILITY",
      severity: vix > 25 ? "HIGH" : "MEDIUM",
      description: `VIX at ${vix.toFixed(1)} (${vixRegime}) — widen stops by 20-30%, reduce position sizes, avoid counter-trend entries`,
    });
  }

  // Extreme setups (setup score signals)
  const bullishSetups = instrumentBriefs.filter(b => b.bias === "BULLISH" && b.setup_score >= 70);
  const bearishSetups = instrumentBriefs.filter(b => b.bias === "BEARISH" && b.setup_score >= 70);
  if (bullishSetups.length > 0) {
    riskRadar.push({
      type: "SIGNAL",
      severity: "MEDIUM",
      description: `High-conviction BULLISH setups: ${bullishSetups.slice(0,3).map(b => b.display).join(", ")} — monitor for entries`,
    });
  }
  if (bearishSetups.length > 0) {
    riskRadar.push({
      type: "SIGNAL",
      severity: "MEDIUM",
      description: `High-conviction BEARISH setups: ${bearishSetups.slice(0,3).map(b => b.display).join(", ")} — monitor for shorts`,
    });
  }

  // Dollar regime impact
  if (dxyChg !== null && Math.abs(dxyChg) > 0.5) {
    riskRadar.push({
      type: "MACRO",
      severity: "MEDIUM",
      description: `DXY ${dxyChg > 0 ? "strengthening" : "weakening"} ${Math.abs(dxyChg).toFixed(2)}% — ${dxyChg > 0 ? "headwind for EUR/USD, GBP/USD, commodities" : "tailwind for EUR/USD, Gold, risk assets"}`,
    });
  }

  // ── 8. Assemble final report ──────────────────────────────────────────────
  return {
    report_date: today,
    macro_narrative: macroNarrative,
    macro_data: {
      vix, vixRegime, dxy, dxyChg, gold, goldChg,
      yield10y, realYield,
      umcsent: umcsentFred,
      regime: !vix ? "UNKNOWN" : vix < 17 ? "RISK-ON" : vix < 25 ? "TRANSITIONAL" : "RISK-OFF",
    },
    events_today: todayEvents,
    instrument_briefs: instrumentBriefs,
    top_setups: topSetups,
    risk_radar: riskRadar,
    generated_at: new Date().toISOString(),
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  // Verify cron secret
  const auth = req.headers.get("Authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET ?? "";
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";

  if (!isVercelCron && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );

  try {
    const report = await generateDailyReport();

    // Upsert into Supabase
    const { error } = await supabase
      .from("daily_briefings")
      .upsert({
        report_date:       report.report_date,
        macro_narrative:   report.macro_narrative,
        macro_data:        report.macro_data,
        events_today:      report.events_today,
        instrument_briefs: report.instrument_briefs,
        top_setups:        report.top_setups,
        risk_radar:        report.risk_radar,
        generated_at:      report.generated_at,
      }, { onConflict: "report_date" });

    if (error) console.error("[daily-report] Supabase upsert error:", error);

    return NextResponse.json({ success: true, report_date: report.report_date, generated_at: report.generated_at });
  } catch (err) {
    console.error("[daily-report] Generation error:", err);
    return NextResponse.json({ error: "Report generation failed", detail: String(err) }, { status: 500 });
  }
}
