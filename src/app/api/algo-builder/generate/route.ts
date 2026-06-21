import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient, createInternalSupabase } from "@/lib/supabase/server";
import type { StrategyConfig } from "@/types/algo-builder";

// ─── Tier gate ────────────────────────────────────────────────────────────────
const TIER_WEIGHT: Record<string, number> = {
  free: 0, foundation: 1, edge: 2, floor: 3,
};

// ─── QuantCoder system prompt ─────────────────────────────────────────────────
const QUANTCODER_SYSTEM = `You are QuantCoder, an elite quantitative trading code generation AI embedded in the Drawdown trading education platform. You think like an institutional quant with 20 years of systematic trading experience and have deep expertise in Pine Script v6 (TradingView) and Python with Backtrader, Pandas, and NumPy.

Your job is to take a trader's natural language strategy description and produce clean, production-ready, error-free code. You are meticulous and institutional-grade.

PINE SCRIPT RULES (if language = pine_script):
- Always use //@version=6 as the first line
- Always use strategy() declaration with title, overlay, initial_capital, commission_type, commission_value, default_qty_type, default_qty_value
- Use strategy.entry() and strategy.exit() — never strategy.close() alone
- Never use look-ahead bias: all indicator calculations must use confirmed (bar[1]) values or barstate.isconfirmed
- Always use request.security() with gaps=barmerge.gaps_on and lookahead=barmerge.lookahead_off for multi-timeframe
- Use ta.crossover() and ta.crossunder() — never write manual crossover logic
- Include proper input() variables for every parameter so the user can adjust from the TradingView settings panel
- Include alertcondition() at the bottom for both long and short if alerts were requested
- Add plot() statements for all key indicators
- If daily loss circuit breaker requested: use strategy.equity to track and strategy.close_all() on breach
- Add inline comments explaining EVERY logical block — the user may be learning

PYTHON RULES (if language = python):
- Structure as a complete Backtrader Strategy class
- Import: backtrader, pandas, numpy, pandas_ta (if enabled)
- Use self.datas[0] correctly — never raw arrays
- Calculate all indicators in __init__ using self.I() wrapper pattern
- Use self.buy() and self.sell() with size= parameter driven by the risk model
- If Kelly Criterion: calculate fraction in __init__, apply to self.broker.getvalue()
- If ATR stop: use trailing stop with ATR multiplier, update on each bar
- Include a complete if __name__ == "__main__" block with:
  cerebro setup, data feed (Yahoo Finance CSV format as placeholder),
  broker setup with initial cash=100000, commission=0.001
  printout of: final portfolio value, total return %, max drawdown %, Sharpe ratio
- Add inline comments explaining each section

BIAS DETECTION — scan your own output for these and add // WARNING or # WARNING comments if found:
- Any indicator that uses current bar's close in the signal condition without [1] offset
- Lookahead in request.security calls
- Position sizing that depends on future price information
- Double-trigger bugs (entry and exit on same bar)

OUTPUT FORMAT:
- Return ONLY the code — no markdown fences, no backticks, no preamble, no explanation
- First line must be the version declaration or import block
- Code must be complete and immediately paste-ready into TradingView or Python`;

// ─── Fix mode system prompt ───────────────────────────────────────────────────
const FIX_SYSTEM = `${QUANTCODER_SYSTEM}

You are now in error-fix mode. You will receive a compiler error message and the original code that produced it. Return the complete corrected code only — no explanation, no markdown, no backticks. Fix ONLY what is broken; preserve all other logic.`;

// ─── Sanitise description ─────────────────────────────────────────────────────
function sanitise(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")             // strip HTML tags
    .replace(/[<>"'`]/g, "")             // strip injection chars
    .replace(/\s+/g, " ")               // normalise whitespace
    .trim()
    .slice(0, 2000);
}

// ─── Build user prompt from strategyConfig ────────────────────────────────────
function buildPrompt(config: StrategyConfig): string {
  const lang = config.outputLanguage === "pine_script"
    ? "Pine Script v6" : "Python (Backtrader)";

  const lines: string[] = [
    `Generate ${lang} code for the following trading strategy:`,
    "",
    `STRATEGY DESCRIPTION: ${sanitise(config.description)}`,
    "",
    `INSTRUMENT: ${config.instrument} (${config.instrumentType})`,
    `PRIMARY TIMEFRAME: ${config.timeframe}`,
  ];

  if (config.useConfirmationTF) {
    lines.push(`CONFIRMATION TIMEFRAME: ${config.confirmationTimeframe}`);
  }

  const sessionLabel = config.sessions.includes("all")
    ? "All Sessions"
    : config.sessions.join(", ").toUpperCase();
  lines.push(`SESSION FILTER: ${sessionLabel}`);
  lines.push("");

  // Risk model
  lines.push(`RISK MODEL: ${config.riskModel}`);
  if (config.riskModel === "fixed_pct") {
    lines.push(`Risk ${config.riskPct}% of account per trade`);
  } else if (config.riskModel === "atr_based") {
    lines.push(`Stop = ${config.atrMultiplier}× ATR(${config.atrPeriod})`);
  } else if (config.riskModel === "kelly") {
    lines.push(`Win rate ${config.kellyWinRate}%, R:R ratio ${config.kellyRR} — calculated Kelly fraction: ${(config.kellyFraction * 100).toFixed(2)}% (half-Kelly applied for safety)`);
  } else if (config.riskModel === "fixed_lot") {
    lines.push(`Fixed lot size: ${config.fixedLotSize}`);
  }

  lines.push(`STOP LOSS: ${config.stopType}`);
  if (config.stopType === "fixed_pips") lines.push(`Stop distance: ${config.stopPips} pips/points`);

  lines.push(`TAKE PROFIT: ${config.takeProfitType}`);
  if (config.takeProfitType === "fixed_rr") {
    lines.push(`Target: ${config.rrRatio}R`);
  } else if (config.takeProfitType === "partial") {
    config.partialExits.forEach((e, i) => {
      lines.push(`Partial exit ${i + 1}: Close ${e.pct}% at ${e.rr}R`);
    });
  }

  if (config.useMaxDailyLoss) {
    lines.push(`MAX DAILY LOSS: ${config.maxDailyLossPct}% — hard circuit breaker (close all positions and stop trading for the day)`);
  }

  lines.push(`MAX CONCURRENT POSITIONS: ${config.maxConcurrentPositions}`);
  lines.push("");
  lines.push("CODE PREFERENCES:");
  lines.push(`- Include comments: ${config.addInlineComments ? "yes" : "no"}`);
  lines.push(`- Include bias warnings: ${config.addBiasWarnings ? "yes" : "no"}`);

  if (config.outputLanguage === "pine_script") {
    lines.push(`- Include TradingView alerts: ${config.includeTVAlerts ? "yes" : "no"}`);
    if (config.includeTVAlerts) lines.push(`- Alert message format: ${config.alertMessage}`);
    lines.push(`- Include visual labels: ${config.includeVisualLabels ? "yes" : "no"}`);
    lines.push(`- Commission: ${config.commissionPct}%`);
  } else {
    lines.push(`- Broker bridge: ${config.brokerBridge}`);
    lines.push(`- Include pandas_ta: ${config.includePandasTA ? "yes" : "no"}`);
    lines.push(`- Include QuantConnect LEAN format: ${config.includeQuantConnect ? "yes" : "no"}`);
    lines.push(`- Include performance metrics printout: ${config.includePerformanceMetrics ? "yes" : "no"}`);
  }

  return lines.join("\n");
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Tier check ────────────────────────────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier   = (profile as any)?.subscription_tier as string ?? "free";
    const weight = TIER_WEIGHT[tier] ?? 0;
    if (weight < 3) {
      return NextResponse.json({ error: "Floor subscription required." }, { status: 403 });
    }

    // ── 3. Parse body ────────────────────────────────────────────────────────
    const body = await req.json();
    const { strategyConfig, fixMode, errorText, originalCode, language } = body as {
      strategyConfig: StrategyConfig | null;
      fixMode?:       boolean;
      errorText?:     string;
      originalCode?:  string;
      language?:      string;
    };

    // ── 4. Rate limit (10 generations per 24h) ───────────────────────────────
    const internal = createInternalSupabase();
    const since    = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await internal
      .from("algo_generation_log")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);

    const used = count ?? 0;
    if (used >= 10) {
      return NextResponse.json(
        { error: "Daily generation limit reached (10/10). Resets in 24 hours.", used, remaining: 0 },
        { status: 429 }
      );
    }

    // ── 5. Build messages ────────────────────────────────────────────────────
    let systemPrompt: string;
    let userMessage:  string;

    if (fixMode && errorText && originalCode) {
      systemPrompt = FIX_SYSTEM;
      userMessage  = `The following ${language ?? "Pine Script"} strategy produced this compiler error:\n\n${errorText}\n\nHere is the original code:\n\n${originalCode}\n\nReturn the complete corrected code only.`;
    } else if (strategyConfig) {
      if (!strategyConfig.description?.trim() || strategyConfig.description.trim().length < 20) {
        return NextResponse.json({ error: "Strategy description is too short." }, { status: 400 });
      }
      systemPrompt = QUANTCODER_SYSTEM;
      userMessage  = buildPrompt(strategyConfig);
    } else {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // ── 6. Stream from Anthropic ─────────────────────────────────────────────
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await anthropic.messages.stream({
      model:      "claude-sonnet-4-5",
      max_tokens: 4096,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userMessage }],
    });

    // ── 7. Pipe through TransformStream ─────────────────────────────────────
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();

          // ── 8. Log generation (after stream complete) ────────────────────
          if (!fixMode && strategyConfig) {
            await internal
              .from("algo_generation_log")
              .insert({
                user_id:     user.id,
                language:    strategyConfig.outputLanguage,
                instrument:  strategyConfig.instrument,
                timeframe:   strategyConfig.timeframe,
                description: sanitise(strategyConfig.description).slice(0, 200),
              });
          }
        } catch (err: any) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":  "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Generations-Used": String(used + 1),
      },
    });
  } catch (err: any) {
    // Log to Supabase error_log if possible
    try {
      const internal = createInternalSupabase();
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await internal.from("error_log" as any).insert({
            user_id:    user.id,
            route:      "/api/algo-builder/generate",
            error_code: err?.status ?? 500,
            message:    String(err?.message ?? err).slice(0, 500),
          });
        } catch {}
      }
    } catch {}

    if (err?.message?.includes("timeout") || err?.code === "ERR_REQUEST_TIMEOUT") {
      return NextResponse.json(
        { error: "QuantCoder timed out — try a simpler description." },
        { status: 408 }
      );
    }
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
