import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// ─── 20-minute module-level cache ─────────────────────────────────────────────
const CACHE = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 20 * 60 * 1000;

// ─── Twelve Data symbol map ───────────────────────────────────────────────────
const TD_MAP: Record<string, string> = {
  EURUSD: "EUR/USD", GBPUSD: "GBP/USD", USDJPY: "USD/JPY", GBPJPY: "GBP/JPY",
  XAGUSD: "XAG/USD", UKX: "FTSE", SPX: "SPX500", NDX: "QQQ", DJI: "DJI",
  BTCUSDT: "BTC/USD", ETHUSDT: "ETH/USD", XRPUSDT: "XRP/USD",
};

// Currency pairs for rate differential labels
const CCY_PAIRS: Record<string, [string, string]> = {
  EURUSD: ["USD", "EUR"], GBPUSD: ["USD", "GBP"],
  USDJPY: ["USD", "JPY"], GBPJPY: ["GBP", "JPY"],
};

// ─── JSON extraction helper ───────────────────────────────────────────────────
function extractJSON(text: string): any {
  try { return JSON.parse(text); } catch {}
  const block = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (block) try { return JSON.parse(block[1]); } catch {}
  const raw = text.match(/\{[\s\S]*\}/);
  if (raw) try { return JSON.parse(raw[0]); } catch {}
  return null;
}

// ─── Twelve Data helpers ──────────────────────────────────────────────────────
async function fetchTD(path: string, tdKey: string) {
  try {
    const r = await fetch(`https://api.twelvedata.com/${path}&apikey=${tdKey}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

// ─── LLM callers ─────────────────────────────────────────────────────────────
async function callClaude(
  system: string, user: string, anthropicKey: string
): Promise<{ raw: string | null; parsed: any; ok: boolean }> {
  try {
    const client = new Anthropic({ apiKey: anthropicKey });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    });
    const raw = msg.content[0]?.type === "text" ? msg.content[0].text : null;
    return { raw, parsed: raw ? extractJSON(raw) : null, ok: raw !== null };
  } catch (e) {
    console.error("[ai-debate] Claude error:", String(e));
    return { raw: null, parsed: null, ok: false };
  }
}

async function callGPT(
  system: string, user: string, openaiKey: string
): Promise<{ raw: string | null; parsed: any; ok: boolean }> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4.1",
        max_tokens: 1024,
        messages: [
          { role: "system", content: system },
          { role: "user",   content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[ai-debate] GPT error:", res.status, await res.text());
      return { raw: null, parsed: null, ok: false };
    }
    const data = await res.json();
    const raw: string | null = data.choices?.[0]?.message?.content ?? null;
    return { raw, parsed: raw ? extractJSON(raw) : null, ok: raw !== null };
  } catch (e) {
    console.error("[ai-debate] GPT error:", String(e));
    return { raw: null, parsed: null, ok: false };
  }
}

async function callGemini(
  system: string, user: string, geminiKey: string
): Promise<{ raw: string | null; parsed: any; ok: boolean }> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ parts: [{ text: user }], role: "user" }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
        }),
      }
    );
    if (!res.ok) {
      console.error("[ai-debate] Gemini error:", res.status, await res.text());
      return { raw: null, parsed: null, ok: false };
    }
    const data = await res.json();
    const raw: string | null = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    return { raw, parsed: raw ? extractJSON(raw) : null, ok: raw !== null };
  } catch (e) {
    console.error("[ai-debate] Gemini error:", String(e));
    return { raw: null, parsed: null, ok: false };
  }
}

// ─── Prompt builders ──────────────────────────────────────────────────────────
function buildTechnicianPrompt(slug: string, td: any, cot: any) {
  const p = td.price ?? "N/A";
  const chg = td.changePct ?? "N/A";
  const atr = td.atr ?? "N/A";
  const pivot = td.pivot;
  const r1 = td.r1; const r2 = td.r2; const s1 = td.s1; const s2 = td.s2;
  const rsiD = td.rsiDaily ?? "N/A";
  const rsi4h = td.rsi4h   ?? "N/A";
  const ema20 = td.ema20above !== null ? (td.ema20above ? "Price above" : "Price below") : "N/A";
  const ema50 = td.ema50above !== null ? (td.ema50above ? "Price above" : "Price below") : "N/A";
  const ema200 = td.ema200above !== null ? (td.ema200above ? "Price above" : "Price below") : "N/A";
  const mtf = td.mtfTable ?? "No MTF data";
  const cotIndex = cot?.cot_index ?? "N/A";

  return `Analyse ${slug} purely on technical grounds.
Symbol: ${slug} | Price: ${p} | Change: ${chg}%
ATR(14) Daily: ${atr}
MTF Signal Table (RSI-based): ${mtf}
Key Levels: R2=${r2 ?? "?"} R1=${r1 ?? "?"} Pivot=${pivot ?? "?"} S1=${s1 ?? "?"} S2=${s2 ?? "?"}
MA Stack: 20EMA=${ema20} | 50EMA=${ema50} | 200EMA=${ema200}
RSI(14) Daily: ${rsiD} | RSI 4H: ${rsi4h}
COT Index context: ${cotIndex}/100

Respond ONLY in this exact JSON (no markdown, no extra text):
{
  "technical_structure": "2 sentences max on trend and price structure",
  "key_level_to_watch": "single most important level right now with exact price",
  "pattern_detected": "specific pattern or null",
  "entry_trigger": "1 sentence on what specifically needs to happen before entering",
  "invalidation": "1 sentence on what price action would invalidate the setup",
  "technical_bias": "BULLISH or BEARISH or NEUTRAL",
  "conviction": "HIGH or MEDIUM or LOW",
  "technical_score": 0
}`;
}

function buildStrategistPrompt(slug: string, macro: any, cot: any, retail: any, news: any) {
  const ccyPair = CCY_PAIRS[slug];
  const rateDiff = macro?.rate_differential ?? "N/A";
  const realYield = macro?.real_yield_10y ?? "N/A";
  const vix = macro?.vix_level ?? "N/A";
  const vixRegime = macro?.vix_regime ?? "UNKNOWN";
  const netSpec = cot?.net_speculator != null ? cot.net_speculator.toLocaleString() : "N/A";
  const weekChg = cot?.week_change != null ? cot.week_change.toLocaleString() : "N/A";
  const netComm = cot?.net_commercial != null ? cot.net_commercial.toLocaleString() : "N/A";
  const netRet  = cot?.net_retail != null     ? cot.net_retail.toLocaleString()     : "N/A";
  const cotIdx  = cot?.cot_index ?? "N/A";
  const cotSig  = cot?.signal    ?? "N/A";
  const longPct  = retail?.long_percent  ?? "N/A";
  const shortPct = retail?.short_percent ?? "N/A";
  const crowd    = retail?.crowd_label   ?? "N/A";
  const sentTrend = news?.sentiment_trend ?? "N/A";
  const bullN = news?.bullish_count ?? 0;
  const bearN = news?.bearish_count ?? 0;
  const ccy1Label = ccyPair ? ccyPair[0] : "Base";
  const ccy2Label = ccyPair ? ccyPair[1] : "Quote";
  const rate1 = macro?.series_values?.["FEDFUNDS"] ?? macro?.series_values?.["DFF"] ?? "N/A";
  const rate2 = macro?.series_values?.["ECBDFR"] ?? macro?.series_values?.["IUDSOIA"] ?? macro?.series_values?.["IRSTCB01JPM156N"] ?? "N/A";

  return `Analyse ${slug} from a macro and fundamental perspective.
Symbol: ${slug}
Rate Differential: ${rateDiff} (${ccy1Label} rate: ${rate1}% vs ${ccy2Label} rate: ${rate2}%)
Real 10Y Yield Proxy: ${realYield}
VIX: ${vix} — Regime: ${vixRegime}
COT Data (latest week):
  Hedge Fund Net Position: ${netSpec} (change: ${weekChg})
  Smart Money (Commercial) Net: ${netComm}
  Retail Net: ${netRet}
  COT Index (52-week range): ${cotIdx}/100
  COT Signal: ${cotSig}
Retail Sentiment: ${longPct}% Long / ${shortPct}% Short — ${crowd}
News Sentiment Trend: ${sentTrend} (${bullN} bullish / ${bearN} bearish headlines)

Respond ONLY in this exact JSON:
{
  "macro_backdrop": "2 sentences on the fundamental driver for this instrument right now",
  "positioning_read": "1 sentence on what COT and retail data implies about institutional positioning",
  "catalyst_risk": "1 sentence on the key upcoming event/risk",
  "flow_bias": "BULLISH or BEARISH or NEUTRAL",
  "smart_money_alignment": true,
  "macro_score": 0,
  "time_horizon": "INTRADAY or SWING or POSITION"
}`;
}

function buildSentimentPrompt(slug: string, retail: any, news: any, macro: any) {
  const overall = news?.overall_sentiment ?? "N/A";
  const label   = news?.overall_label    ?? "N/A";
  const top5 = (news?.articles ?? []).slice(0, 5).map(
    (a: { title: string; sentiment_label: string; source: string }) =>
      `- [${a.sentiment_label}] ${a.title.substring(0, 80)} (${a.source})`
  ).join("\n") || "No recent headlines available";
  const crowd   = retail?.crowd_label   ?? "N/A";
  const longPct = retail?.long_percent  ?? "N/A";
  const vixReg  = macro?.vix_regime     ?? "N/A";
  const umcsent = macro?.series_values?.["UMCSENT"] ?? "N/A";

  return `Analyse the sentiment and narrative environment around ${slug}.
Symbol: ${slug}
News Sentiment: Overall score ${overall} (${label})
Recent Headlines:\n${top5}
Retail Crowding: ${crowd} — ${longPct}% retail long
VIX Regime: ${vixReg}
Consumer Sentiment (if applicable): ${umcsent}

Respond ONLY in this exact JSON:
{
  "narrative": "2 sentences — what is the dominant market story/narrative driving this instrument?",
  "sentiment_risk": "1 sentence — what sentiment shift could cause a sharp move against the current trend?",
  "retail_contrarian_signal": "1 sentence on what the retail positioning implies as a contrarian indicator",
  "news_momentum": "ACCELERATING or STABLE or FADING",
  "sentiment_score": 0,
  "black_swan_watch": "1 sentence on the least-priced risk nobody is talking about"
}`;
}

function buildSynthesisPrompt(
  slug: string,
  tech: any, macro: any, sent: any,
  s1: number, s2: number, s3: number,
  availableCount: number
) {
  const header = availableCount < 3
    ? `NOTE: Only ${availableCount}/3 analysts responded. Synthesise available reports.`
    : "All 3 analysts responded.";
  return `${header}\n\nSynthesise these analyst reports on ${slug}:\n\nTECHNICIAN (technical_score: ${s1}): ${JSON.stringify(tech)}\n\nSTRATEGIST (macro_score: ${s2}): ${JSON.stringify(macro)}\n\nSENTIMENT ANALYST (sentiment_score: ${s3}): ${JSON.stringify(sent)}\n\nRespond ONLY in this exact JSON:\n{\n  "consensus_bias": "BULLISH or BEARISH or NEUTRAL or CONTESTED",\n  "conviction": "HIGH or MEDIUM or LOW",\n  "agreement_level": "ALIGNED or MIXED or DIVERGENT",\n  "setup_quality_score": 0,\n  "headline": "1 punchy sentence summarising the situation as a desk head would say at morning meeting",\n  "trade_thesis": "2-3 sentences — if I were trading this right now, here is the setup",\n  "key_risk": "1 sentence — the main thing that could make this wrong",\n  "best_timeframe": "INTRADAY or SWING or POSITION",\n  "analysts_available": ${availableCount},\n  "agent_scores": {\n    "technical": ${s1},\n    "macro": ${s2},\n    "sentiment": ${s3},\n    "composite": ${Math.round(s1 * 0.35 + s2 * 0.40 + s3 * 0.25)}\n  },\n  "where_analysts_disagree": null\n}`;
}

// ─── Main Route ───────────────────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const slug   = symbol.toUpperCase();
  const origin = new URL(req.url).origin;

  // ── Cache check ────────────────────────────────────────────────────────────
  const cached = CACHE.get(slug);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ ...cached.data, cached: true });
  }

  // ── API keys ───────────────────────────────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? "";
  const openaiKey    = process.env.OPENAI_API_KEY    ?? "";
  const geminiKey    = process.env.GOOGLE_GEMINI_KEY ?? "";
  const tdKey        = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";

  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  const tdSym = encodeURIComponent(TD_MAP[slug] ?? slug);

  // ── Fetch all intelligence data + TD technicals in parallel ───────────────
  const [
    cotRes, macroRes, retailRes, newsRes,
    quoteData, rsiDailyData, rsi4hData, atrData, ema20Data, ema200Data, ohlcData,
  ] = await Promise.all([
    fetch(`${origin}/api/intelligence/cot/${slug}`, { cache: "no-store" })
      .then(r => r.json()).catch(() => null),
    fetch(`${origin}/api/intelligence/macro/${slug}`, { cache: "no-store" })
      .then(r => r.json()).catch(() => null),
    fetch(`${origin}/api/intelligence/retail-sentiment/${slug}`, { cache: "no-store" })
      .then(r => r.json()).catch(() => null),
    fetch(`${origin}/api/intelligence/news-sentiment/${slug}`, { cache: "no-store" })
      .then(r => r.json()).catch(() => null),
    tdKey ? fetchTD(`quote?symbol=${tdSym}`, tdKey) : Promise.resolve(null),
    tdKey ? fetchTD(`rsi?symbol=${tdSym}&interval=1day&time_period=14&outputsize=1`, tdKey) : Promise.resolve(null),
    tdKey ? fetchTD(`rsi?symbol=${tdSym}&interval=4h&time_period=14&outputsize=1`, tdKey)   : Promise.resolve(null),
    tdKey ? fetchTD(`atr?symbol=${tdSym}&interval=1day&time_period=14&outputsize=1`, tdKey)  : Promise.resolve(null),
    tdKey ? fetchTD(`ema?symbol=${tdSym}&interval=1day&time_period=20&outputsize=1`, tdKey)  : Promise.resolve(null),
    tdKey ? fetchTD(`ema?symbol=${tdSym}&interval=1day&time_period=200&outputsize=1`, tdKey) : Promise.resolve(null),
    tdKey ? fetchTD(`time_series?symbol=${tdSym}&interval=1day&outputsize=2`, tdKey)         : Promise.resolve(null),
  ]);

  // ── Build technical data object ────────────────────────────────────────────
  const price     = quoteData?.close  ? parseFloat(quoteData.close)  : null;
  const changePct = quoteData?.percent_change ? parseFloat(quoteData.percent_change) : null;
  const atr       = atrData?.values?.[0]?.atr       ? parseFloat(atrData.values[0].atr)       : null;
  const rsiDaily  = rsiDailyData?.values?.[0]?.rsi   ? parseFloat(rsiDailyData.values[0].rsi)   : null;
  const rsi4h     = rsi4hData?.values?.[0]?.rsi      ? parseFloat(rsi4hData.values[0].rsi)      : null;
  const ema20val  = ema20Data?.values?.[0]?.ema       ? parseFloat(ema20Data.values[0].ema)       : null;
  const ema200val = ema200Data?.values?.[0]?.ema      ? parseFloat(ema200Data.values[0].ema)      : null;

  // Pivot from yesterday's OHLC
  const prevCandle = ohlcData?.values?.[1];
  let pivot: number | null = null, r1 = null, r2 = null, s1 = null, s2 = null;
  if (prevCandle && price) {
    const h = parseFloat(prevCandle.high), l = parseFloat(prevCandle.low), c = parseFloat(prevCandle.close);
    pivot = (h + l + c) / 3;
    r1 = 2 * pivot - l; r2 = pivot + h - l;
    s1 = 2 * pivot - h; s2 = pivot - h + l;
  }

  const fmt = (n: number | null, d = 5) => n !== null ? n.toFixed(d) : null;
  const mtfTable = [
    `Daily RSI=${rsiDaily?.toFixed(1) ?? "N/A"} → ${rsiDaily ? (rsiDaily > 60 ? "BUY" : rsiDaily < 40 ? "SELL" : "NEUTRAL") : "N/A"}`,
    `4H RSI=${rsi4h?.toFixed(1) ?? "N/A"} → ${rsi4h   ? (rsi4h   > 60 ? "BUY" : rsi4h   < 40 ? "SELL" : "NEUTRAL") : "N/A"}`,
    `EMA200: Price ${ema200val && price ? (price > ema200val ? "ABOVE" : "BELOW") : "N/A"}`,
  ].join(" | ");

  const td = {
    price: fmt(price), changePct: fmt(changePct, 2), atr: fmt(atr, 5),
    rsiDaily: rsiDaily?.toFixed(1), rsi4h: rsi4h?.toFixed(1),
    ema20above:  ema20val  && price ? price > ema20val  : null,
    ema50above:  null, // not fetched — omit
    ema200above: ema200val && price ? price > ema200val : null,
    pivot: fmt(pivot), r1: fmt(r1), r2: fmt(r2), s1: fmt(s1), s2: fmt(s2),
    mtfTable,
  };

  // ── Agent system prompts ───────────────────────────────────────────────────
  const TECHNICIAN_SYS = "You are a veteran technical analyst with 20 years on a prop trading desk. You read price action, indicators, and chart structure like a language. You are precise, pattern-focused, and sceptical of macro noise. You express high conviction only when multiple technical factors align. Respond ONLY with valid JSON — no markdown, no text outside the JSON object.";
  const STRATEGIST_SYS = "You are a macro strategist at a $10B hedge fund. You trade on central bank divergence, real yield differentials, positioning, and economic cycles. You see individual price moves as symptoms of larger macro forces. Respond ONLY with valid JSON — no markdown, no text outside the JSON object.";
  const SENTIMENT_SYS  = "You are a market sentiment specialist. You synthesise news flow, social positioning, retail behaviour, and market psychology. You understand that markets are driven by narrative as much as fundamentals. Respond ONLY with valid JSON — no markdown, no text outside the JSON object.";
  const EDITOR_SYS     = "You are a senior portfolio manager reviewing three analysts' reports. Your job is to synthesise their views into a single actionable brief. You note where analysts agree (high confidence) and where they diverge (contested signal). You are direct, concise, and never hedge excessively. Respond ONLY with valid JSON — no markdown, no text outside the JSON object.";

  // ── Parallel agent calls ───────────────────────────────────────────────────
  const techUser   = buildTechnicianPrompt(slug, td, cotRes);
  const macroUser  = buildStrategistPrompt(slug, macroRes, cotRes, retailRes, newsRes);
  const sentUser   = buildSentimentPrompt(slug, retailRes, newsRes, macroRes);

  const calls: [
    Promise<{ raw: string | null; parsed: any; ok: boolean }>,
    Promise<{ raw: string | null; parsed: any; ok: boolean }>,
    Promise<{ raw: string | null; parsed: any; ok: boolean }>
  ] = [
    callClaude(TECHNICIAN_SYS, techUser, anthropicKey),
    openaiKey ? callGPT(STRATEGIST_SYS, macroUser, openaiKey) : Promise.resolve({ raw: null, parsed: null, ok: false }),
    geminiKey ? callGemini(SENTIMENT_SYS, sentUser, geminiKey) : Promise.resolve({ raw: null, parsed: null, ok: false }),
  ];

  const [techR, macroR2, sentR] = await Promise.all(calls);

  // ── Score extraction ───────────────────────────────────────────────────────
  const score1 = techR.parsed?.technical_score  ?? 0;
  const score2 = macroR2.parsed?.macro_score     ?? 0;
  const score3 = sentR.parsed?.sentiment_score  ?? 0;

  // Fallback parsed objects for synthesis
  const tech2  = techR.parsed  ?? { technical_bias: "NEUTRAL", conviction: "LOW", technical_score: 0 };
  const macro2 = macroR2.parsed ?? { flow_bias:      "NEUTRAL", macro_score:     0 };
  const sent2  = sentR.parsed  ?? { news_momentum:   "STABLE",  sentiment_score: 0 };

  const availableCount = [techR.ok, macroR2.ok, sentR.ok].filter(Boolean).length;

  // ── Synthesis ──────────────────────────────────────────────────────────────
  const synthUser = buildSynthesisPrompt(slug, tech2, macro2, sent2, score1, score2, score3, availableCount);
  const synthR = await callClaude(EDITOR_SYS, synthUser, anthropicKey);

  const synthesis = synthR.parsed ?? {
    consensus_bias: "NEUTRAL",
    conviction: "LOW",
    agreement_level: "DIVERGENT",
    setup_quality_score: 0,
    headline: "Analysis incomplete — insufficient data from agents.",
    trade_thesis: "Unable to generate thesis.",
    key_risk: "Multiple data sources unavailable.",
    best_timeframe: "SWING",
    analysts_available: availableCount,
    agent_scores: { technical: score1, macro: score2, sentiment: score3, composite: Math.round(score1 * 0.35 + score2 * 0.40 + score3 * 0.25) },
    where_analysts_disagree: null,
  };

  const result = {
    symbol: slug,
    analysts_available: availableCount,
    synthesis,
    agents: {
      technician: {
        name: "The Technician",
        model: "Claude Sonnet",
        color: "cyan",
        ok: techR.ok,
        data: tech2,
        score: score1,
      },
      strategist: {
        name: "The Strategist",
        model: "GPT-4.1",
        color: "green",
        ok: macroR2.ok,
        data: macro2,
        score: score2,
      },
      sentiment: {
        name: "The Sentiment Analyst",
        model: "Gemini 2.5 Flash",
        color: "blue",
        ok: sentR.ok,
        data: sent2,
        score: score3,
      },
    },
    intelligence: {
      cot:    cotRes    ?? null,
      macro:  macroRes  ?? null,
      retail: retailRes ?? null,
      news:   newsRes   ?? null,
    },
    generated_at: new Date().toISOString(),
  };

  CACHE.set(slug, { data: result, ts: Date.now() });
  return NextResponse.json(result);
}
