"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { StrategyConfig, DEFAULT_CONFIG } from "@/types/algo-builder";
import { StrategyComposer } from "./StrategyComposer";
import { CodeOutput } from "./CodeOutput";
import { HealthCheck } from "./HealthCheck";
import { MarketWidget } from "./MarketWidget";
import { TradingViewEmbed } from "./TradingViewEmbed";
import { ExportBridge } from "./ExportBridge";
import { StrategyLibrary } from "./StrategyLibrary";

const C = "#C8F135";

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
      setShowHealthCheck(false); // reset health check for new code
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

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[10px] font-mono text-text-tertiary mb-3">
            <Link href="/dashboard" className="hover:text-text-secondary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dashboard/tools" className="hover:text-text-secondary transition-colors">Tools</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: C }}>Algo Strategy Builder</span>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold uppercase text-text-primary" style={{ fontSize: 28 }}>
              Algo Strategy Builder
            </h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Convert discretionary logic into production Pine Script v6 & Python.
            Powered by QuantCoder AI.
          </p>
        </div>

        {/* Status + tier badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* QuantCoder status */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${C}15`, border: `1px solid ${C}40`, color: C }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C }} />
            QuantCoder AI // ONLINE
          </div>

          {/* Tier badge */}
          <div
            className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black"
            style={{ backgroundColor: C }}
          >
            {tier.toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Rate limit bar ───────────────────────────────────────────────── */}
      {rateLimitInfo && (
        <div className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-mono" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <span className="text-text-tertiary">Generations today:</span>
          <div className="flex gap-1">
            {Array.from({ length: rateLimitInfo.limit }, (_, i) => (
              <div key={i} className="w-3 h-3" style={{ backgroundColor: i < rateLimitInfo.used ? C : "#2A2A2A" }} />
            ))}
          </div>
          <span className="text-text-tertiary">{rateLimitInfo.used}/{rateLimitInfo.limit}</span>
        </div>
      )}

      {/* ── Main two-column layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4">

        {/* Left: Strategy Composer */}
        <div className="flex flex-col border" style={{ border: "1px solid #222", borderRadius: 0 }} id="algo-composer">
          <StrategyComposer config={config} onChange={setConfig} />

          {/* Generate button — inside left panel at bottom */}
          <div className="p-4 border-t" style={{ borderColor: "#1E1E1E" }} id="algo-generate-btn">
            {genError && (
              <p className="text-[11px] font-mono text-red-400 mb-3 px-1">{genError}</p>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isFormValid && !isGenerating}
              className="w-full py-4 font-bold uppercase tracking-widest text-[11px] transition-all disabled:opacity-40"
              style={{
                backgroundColor: isGenerating ? "#1A1A1A" : (isFormValid ? C : "#1A1A1A"),
                color: isGenerating ? C : "#000",
                border: isGenerating ? `1px solid ${C}` : "none",
              }}
              title={!isFormValid ? "Describe your strategy (min. 20 characters) to generate" : undefined}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C }} />
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
              <p className="text-[9px] font-mono text-text-tertiary text-center mt-2">
                Describe your strategy in Section 1 to enable generation
              </p>
            )}
          </div>
        </div>

        {/* Right: Code Output + Market Widget */}
        <div className="flex flex-col gap-4">
          {/* Right tabs */}
          <div
            className="flex"
            style={{ backgroundColor: "#111", border: "1px solid #222" }}
            id="algo-code-output"
          >
            {([
              { id: "code",    label: "Code Output" },
              { id: "library", label: "My Strategies" },
            ] as { id: "code"|"library"; label: string }[]).map(t => (
              <button
                key={t.id}
                onClick={() => setRightTab(t.id)}
                className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all"
                style={rightTab === t.id
                  ? { backgroundColor: C, color: "#000", fontWeight: 700 }
                  : { color: "#666" }}
              >
                {t.label}
              </button>
            ))}
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
          {/* Health Check */}
          <HealthCheck
            generatedCode={generatedCode}
            instrument={config.instrument}
            timeframe={config.timeframe}
            language={config.outputLanguage}
            show={showHealthCheck}
            onToggle={() => setShowHealthCheck(v => !v)}
          />

          {/* TradingView embed */}
          <TradingViewEmbed
            symbol={config.instrument}
            intervalMinutes={tvInterval}
          />

          {/* Export bridge */}
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

// ─── Lazy library panel (avoids loading Supabase unless tab active) ───────────
function StrategyLibraryPanel(props: {
  currentCode: string;
  currentLanguage: "pine_script" | "python";
  currentInstrument: string;
  currentTimeframe: string;
  currentDescription: string;
}) {
  const { StrategyLibrary } = require("./StrategyLibrary");
  return <StrategyLibrary {...props} />;
}

// ─── Simple custom tour ───────────────────────────────────────────────────────
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

function TourOverlay({
  step, onNext, onSkip, total,
}: { step: number; onNext: () => void; onSkip: () => void; total: number }) {
  const C = "#C8F135";
  const s = TOUR_STEPS[step];
  const isLast = step === total - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end p-4 md:p-8 pointer-events-none">
      {/* Semi-transparent backdrop only on mobile */}
      <div className="absolute inset-0 bg-black/40 md:hidden pointer-events-auto" onClick={onSkip} />

      <div
        className="relative max-w-sm w-full pointer-events-auto animate-in slide-in-from-bottom-4 duration-300"
        style={{ backgroundColor: "#111", border: `1px solid ${C}40` }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#222" }}>
          <div className="flex gap-1">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className="w-5 h-1 transition-colors"
                style={{ backgroundColor: i <= step ? C : "#333" }}
              />
            ))}
          </div>
          <button onClick={onSkip} className="text-[9px] font-mono text-text-tertiary hover:text-text-secondary uppercase tracking-wider">
            Skip tour
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C }}>
            Step {step + 1} of {total}
          </p>
          <p className="font-display font-bold uppercase text-text-primary text-sm">{s.title}</p>
          <p className="text-xs text-text-secondary leading-relaxed">{s.body}</p>
          <p className="text-[9px] font-mono text-text-tertiary">→ {s.highlight}</p>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onNext}
            className="w-full py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: C }}
          >
            {isLast ? "Get Started" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
