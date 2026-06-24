"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Code2, Bookmark, Zap, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { StrategyConfig, DEFAULT_CONFIG } from "@/types/algo-builder";
import { StrategyComposer } from "./StrategyComposer";
import { CodeOutput } from "./CodeOutput";
import { HealthCheck } from "./HealthCheck";
import { MarketWidget } from "./MarketWidget";
import { TradingViewEmbed } from "./TradingViewEmbed";
import { ExportBridge } from "./ExportBridge";
import { StrategyLibrary } from "./StrategyLibrary";

// ─── Design tokens — exact match to Trade Journal (JournalClient.tsx) ─────────
const C    = "#00e5cc";   // Journal cyan accent  ← was "#C8F135" chartreuse
const C_BG = `${C}1a`;   // 10% opacity background
const C_BD = `${C}4d`;   // 30% opacity border

// Map our Timeframe type → TradingView interval
const TV_INTERVAL: Record<string, string> = {
  "1m": "1", "5m": "5", "15m": "15", "1H": "60",
  "4H": "240", "D": "D", "W": "W",
};

interface AlgoBuilderShellProps {
  userName: string;
  userEmail: string;
  tier: string;
}

export function AlgoBuilderShell({ userName, userEmail, tier }: AlgoBuilderShellProps) {
  const [config, setConfig]                   = useState<StrategyConfig>(DEFAULT_CONFIG);
  const [generatedCode, setGeneratedCode]     = useState("");
  const [isGenerating, setIsGenerating]       = useState(false);
  const [genVersion, setGenVersion]           = useState(0);
  const [genError, setGenError]               = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo]     = useState<{ used: number; limit: number } | null>(null);
  const [rightTab, setRightTab]               = useState<"code" | "library">("code");
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [tourStep, setTourStep]               = useState<number | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  // ── Onboarding tour (first visit only) ──────────────────────────────────
  useEffect(() => {
    const done = localStorage.getItem("drawdown_algo_tour_complete");
    if (!done) setTourStep(0);
  }, []);

  function advanceTour() {
    if (tourStep === null) return;
    if (tourStep >= TOUR_STEPS.length - 1) {
      localStorage.setItem("drawdown_algo_tour_complete", "1");
      setTourStep(null);
    } else {
      setTourStep(tourStep + 1);
    }
  }
  function skipTour() {
    localStorage.setItem("drawdown_algo_tour_complete", "1");
    setTourStep(null);
  }

  // ── Generate handler ─────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (isGenerating) {
      readerRef.current?.cancel();
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    setGenError(null);
    setGeneratedCode("");
    setRightTab("code");

    try {
      const res = await fetch("/api/algo-builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyConfig: config }),
        signal: AbortSignal.timeout(35_000),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setGenError(
            err.error?.includes("rate limit")
              ? err.error
              : `Rate limit reached. ${err.remaining ?? 0} generations left today.`
          );
          if (err.used !== undefined) setRateLimitInfo({ used: err.used, limit: 10 });
        } else if (res.status === 403) {
          setGenError("Floor subscription required. Please upgrade.");
        } else {
          setGenError(err.error ?? "Generation failed. Please try again.");
        }
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      readerRef.current = reader;

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setGeneratedCode(prev => prev + decoder.decode(value, { stream: true }));
      }

      setGenVersion(v => v + 1);
      setShowHealthCheck(false);
    } catch (e: any) {
      if (e?.name === "TimeoutError" || e?.name === "AbortError") {
        setGenError("QuantCoder timed out — try a simpler description.");
      } else {
        setGenError("Network error. Please try again.");
      }
    } finally {
      setIsGenerating(false);
      readerRef.current = null;
    }
  }, [config, isGenerating]);

  const isFormValid = config.description.trim().length >= 20;
  const hasCode = generatedCode.length > 0;
  const tvInterval = TV_INTERVAL[config.timeframe] ?? "15";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* ── Onboarding Tour Overlay ─────────────────────────────────────── */}
      {tourStep !== null && (
        <TourOverlay
          step={tourStep}
          onNext={advanceTour}
          onSkip={skipTour}
          total={TOUR_STEPS.length}
        />
      )}

      {/* ── Page Header — matches JournalClient header exactly ──────────── */}
      <header className="space-y-4">
        {/* Eyebrow — exact match: JournalClient "AI_JOURNAL // PERFORMANCE" */}
        <p
          className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]"
          style={{ color: C }}
        >
          ALGO_BUILDER // STRATEGY COMPOSER
        </p>

        {/* Title row + status badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {/* H1 — exact match: JournalClient "TRADE JOURNAL." */}
            <h1
              className="font-display font-bold uppercase leading-none text-black"
              style={{ fontSize: 32 }}
            >
              ALGO{" "}
              <span style={{ color: C }}>STRATEGY BUILDER.</span>
            </h1>
            {/* Subtitle — exact match: JournalClient "Every trade logged…" */}
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Convert discretionary logic into production Pine Script v6 &amp; Python.
              Powered by QuantCoder AI.
            </p>
          </div>

          {/* Status badges — right-aligned */}
          <div className="flex items-center gap-3 shrink-0">
            {/* QuantCoder status — teal pill matching Journal locked-state pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md"
              style={{ backgroundColor: C_BG, border: `1px solid ${C_BD}`, color: C }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C }} />
              QuantCoder AI // ONLINE
            </div>

            {/* Tier badge — keep orange, platform-wide convention */}
            <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white rounded-md bg-[#f97316]">
              {tier.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* ── Rate limit bar — white card ──────────────────────────────────── */}
      {rateLimitInfo && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-mono bg-white border border-gray-200 rounded-xl"
        >
          <span className="text-gray-500">Generations today:</span>
          <div className="flex gap-1">
            {Array.from({ length: rateLimitInfo.limit }, (_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: i < rateLimitInfo.used ? C : "#e5e7eb" }}
              />
            ))}
          </div>
          <span className="text-gray-500">{rateLimitInfo.used}/{rateLimitInfo.limit}</span>
        </div>
      )}

      {/* ── Main two-column layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4">

        {/* Left: Strategy Composer — white card */}
        <div
          className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden"
          id="algo-composer"
        >
          <StrategyComposer config={config} onChange={setConfig} />

          {/* Generate button — Journal primary button style */}
          <div className="p-4 border-t border-gray-100" id="algo-generate-btn">
            {genError && (
              <p className="text-[11px] font-mono text-red-600 mb-3 px-1">{genError}</p>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isFormValid && !isGenerating}
              className="w-full py-4 font-mono font-bold uppercase tracking-widest text-[11px] transition-all rounded-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isFormValid || isGenerating ? C : undefined,
                opacity: !isFormValid && !isGenerating ? 0.4 : 1,
                color: isFormValid || isGenerating ? "#000" : "#6b7280",
                border: !isFormValid && !isGenerating ? "1px solid #e5e7eb" : "none",
                background: !isFormValid && !isGenerating ? "#f9fafb" : C,
              }}
              title={!isFormValid ? "Describe your strategy (min. 20 characters) to generate" : undefined}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#000" }} />
                  Generating… Click to cancel
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Generate Strategy Code
                </span>
              )}
            </button>
            {!isFormValid && !isGenerating && (
              <p className="text-[9px] font-mono text-gray-400 text-center mt-2">
                Describe your strategy in Section 1 to enable generation
              </p>
            )}
          </div>
        </div>

        {/* Right: Code Output + Market Widget */}
        <div className="flex flex-col gap-4">
          {/* Right tab bar — Journal tab style: underline only, no background */}
          <div
            className="flex border-b border-gray-200"
            id="algo-code-output"
          >
            {([
              { id: "code",    label: "Code Output",  icon: Code2     },
              { id: "library", label: "My Strategies", icon: Bookmark },
            ] as { id: "code"|"library"; label: string; icon: React.ElementType }[]).map(t => {
              const Icon = t.icon;
              const active = rightTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setRightTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-mono uppercase tracking-widest transition-all border-b-2 -mb-px"
                  style={active
                    ? { color: C, borderColor: C, fontWeight: 700 }
                    : { color: "#6b7280", borderColor: "transparent" }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <CodeOutput
            code={generatedCode}
            isGenerating={isGenerating}
            language={config.outputLanguage}
            generationVersion={genVersion}
            instrument={config.instrument}
            description={config.description}
            visible={rightTab === "code"}
            onRegenerate={handleGenerate}
            onLibraryOpen={() => setRightTab("library")}
          />

          {rightTab === "library" && (
            <StrategyLibrary
              currentCode={generatedCode}
              currentLanguage={config.outputLanguage}
              currentInstrument={config.instrument}
              currentTimeframe={config.timeframe}
              currentDescription={config.description}
            />
          )}

          {/* Market context widget */}
          {config.instrument && (
            <MarketWidget instrument={config.instrument} />
          )}
        </div>
      </div>

      {/* ── Below-fold panels (visible after code generated) ───────────── */}
      {hasCode && (
        <div className="space-y-6" id="algo-health-check">
          <HealthCheck
            generatedCode={generatedCode}
            instrument={config.instrument}
            timeframe={config.timeframe}
            language={config.outputLanguage}
            show={showHealthCheck}
            onToggle={() => setShowHealthCheck(v => !v)}
          />

          <TradingViewEmbed
            symbol={config.instrument}
            intervalMinutes={tvInterval}
          />

          <ExportBridge
            code={generatedCode}
            language={config.outputLanguage}
            instrument={config.instrument}
            timeframe={config.timeframe}
            description={config.description}
          />
        </div>
      )}
    </div>
  );
}

// ─── Tour steps (unchanged) ───────────────────────────────────────────────────
const TOUR_STEPS = [
  {
    title: "Welcome to QuantCoder",
    body: "Describe your trading strategy in plain English — entry conditions, exit rules, and filters. The AI handles the code.",
    highlight: "Describe your strategy in Section 1",
  },
  {
    title: "Set Instrument & Timeframe",
    body: "Choose the market and timeframe your strategy runs on. Multi-timeframe confirmation adds an extra filter.",
    highlight: "Section 02: Instrument & Timeframe",
  },
  {
    title: "Configure Risk Model",
    body: "Fixed percentage, ATR-based, or Kelly Criterion — your choice drives position sizing in the generated code.",
    highlight: "Section 03: Risk & Position Sizing",
  },
  {
    title: "Choose Your Language",
    body: "Pine Script v6 for TradingView, or Python/Backtrader for live execution via IBKR, MT5, or Alpaca.",
    highlight: "Section 04: Code Preferences",
  },
  {
    title: "Generate Your Code",
    body: "Click Generate — QuantCoder AI streams production-ready code with inline comments and bias detection.",
    highlight: "Generate Strategy Code button",
  },
  {
    title: "Save, Test, Fix",
    body: "Save to your library, run a health check with real price data, or paste TradingView errors for instant fixes.",
    highlight: "My Strategies tab",
  },
];

// ─── Tour Overlay — white card with teal button (Journal primary style) ───────
function TourOverlay({
  step, onNext, onSkip, total,
}: { step: number; onNext: () => void; onSkip: () => void; total: number }) {
  const s = TOUR_STEPS[step];
  const isLast = step === total - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end p-4 md:p-8 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 md:hidden pointer-events-auto"
        style={{ background: "rgba(0,0,0,0.2)" }}
        onClick={onSkip}
      />

      {/* Card — white, Journal card style */}
      <div
        className="relative max-w-sm w-full pointer-events-auto animate-in slide-in-from-bottom-4 duration-300 bg-white border border-gray-200 rounded-xl"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        {/* Step indicator row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex gap-1">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className="w-5 h-1 rounded-full transition-colors"
                style={{ backgroundColor: i <= step ? C : "#e5e7eb" }}
              />
            ))}
          </div>
          {/* Skip tour — Journal secondary style */}
          <button
            onClick={onSkip}
            className="text-[9px] font-mono text-gray-400 hover:text-gray-700 uppercase tracking-wider underline-offset-2 hover:underline transition-colors"
          >
            Skip tour
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Step label — Journal eyebrow style in teal */}
          <p
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]"
            style={{ color: C }}
          >
            Step {step + 1} of {total}
          </p>
          {/* Step title — Journal heading style */}
          <p className="font-display font-bold uppercase text-gray-900 text-sm">
            {s.title}
          </p>
          {/* Body */}
          <p className="text-xs text-gray-500 leading-relaxed">{s.body}</p>
          {/* Highlight hint */}
          <p className="text-[9px] font-mono" style={{ color: C }}>
            → {s.highlight}
          </p>
        </div>

        {/* Next button — Journal primary button (teal bg, black text) */}
        <div className="px-4 pb-4">
          <button
            onClick={onNext}
            className="w-full py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-opacity hover:opacity-90 text-black rounded-lg"
            style={{ backgroundColor: C }}
          >
            {isLast ? "Get Started" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
