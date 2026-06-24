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

const C_PRIMARY = "var(--tool-accent)";
const C_LIGHT   = "var(--tool-accent-hover)";
const C_TINT    = "var(--tool-accent-tint)";
const C_BORDER  = "var(--tool-accent-border)";
const C_TEXT    = "var(--tool-accent-text)";
const C_BG      = "var(--tool-accent-tint)";
const C_BD      = "var(--tool-accent-border)";

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

      {/* ── Page Header — matches layout style with violet accents ──────── */}
      <header className="space-y-4">
        {/* Eyebrow — violet tracking label */}
        <p
          className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]"
          style={{ color: C_PRIMARY }}
        >
          ALGO_BUILDER // STRATEGY COMPOSER
        </p>

        {/* Title row + status badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1
              className="font-display font-bold uppercase leading-none text-black"
              style={{ fontSize: 32 }}
            >
              ALGO{" "}
              <span style={{ color: C_PRIMARY }}>STRATEGY BUILDER.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Convert discretionary logic into production Pine Script v6 &amp; Python.
              Powered by QuantCoder AI.
            </p>
          </div>

          {/* Status badges — right-aligned */}
          <div className="flex items-center gap-3 shrink-0">
            {/* QuantCoder status — violet badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md"
              style={{ backgroundColor: C_TINT, border: `1px solid ${C_BORDER}`, color: C_TEXT }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C_PRIMARY }} />
              QuantCoder AI // ONLINE
            </div>

            {/* Tier badge — keep orange, platform-wide convention */}
            <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white rounded-md bg-[#f97316]">
              {tier.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* ── Rate limit bar — white card ── */}
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
                style={{ backgroundColor: i < rateLimitInfo.used ? C_PRIMARY : "#e5e7eb" }}
              />
            ))}
          </div>
          <span className="text-gray-500">{rateLimitInfo.used}/{rateLimitInfo.limit}</span>
        </div>
      )}

      {/* ── Main two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4">

        {/* Left: Strategy Composer — white card */}
        <div
          className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden"
          id="algo-composer"
        >
          <StrategyComposer config={config} onChange={setConfig} />

          {/* Generate button — Violet primary style */}
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
                backgroundColor: isFormValid || isGenerating ? C_PRIMARY : undefined,
                color: isFormValid || isGenerating ? "#ffffff" : "#a78bfa",
                border: !isFormValid && !isGenerating ? "1px solid #ddd6fe" : "none",
                background: !isFormValid && !isGenerating ? "#ede9fe" : C_PRIMARY,
                cursor: !isFormValid && !isGenerating ? "not-allowed" : "pointer",
              }}
              title={!isFormValid ? "Describe your strategy (min. 20 characters) to generate" : undefined}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Generating… Click to cancel
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 text-white">
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
                    ? { color: C_PRIMARY, borderColor: C_PRIMARY, fontWeight: 700 }
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

      {/* ── Tour Step Panel ── */}
      {tourStep !== null && (
        <TourStepPanel
          step={tourStep}
          onNext={advanceTour}
          onSkip={skipTour}
          onClose={skipTour}
          total={TOUR_STEPS.length}
        />
      )}
    </div>
  );
}

// ─── Tour steps with descriptive link texts ───────────────────────────────────
interface TourStep {
  title: string;
  body: string;
  linkText: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to QuantCoder",
    body: "Describe your trading strategy in plain English — entry conditions, exit rules, and filters. The AI handles the code.",
    linkText: "→ Describe your strategy in Section 1"
  },
  {
    title: "Set Your Instrument",
    body: "Choose which market your strategy will trade and the timeframe you want to execute on. This defines your data environment.",
    linkText: "→ Open Section 2 to select instrument and timeframe"
  },
  {
    title: "Define Your Risk",
    body: "Set your position sizing rules and maximum drawdown tolerance. QuantCoder bakes this directly into the generated code.",
    linkText: "→ Open Section 3 to configure risk parameters"
  },
  {
    title: "Code Preferences",
    body: "Choose Pine Script v6 for TradingView, Python for live execution, or both. Set your preferred variable naming and comment style.",
    linkText: "→ Open Section 4 to set preferences"
  },
  {
    title: "Generate Your Strategy",
    body: "Hit Generate Strategy Code. QuantCoder will produce production-ready code you can copy directly into TradingView or your broker API.",
    linkText: "→ Click Generate Strategy Code when ready"
  },
  {
    title: "Save & Deploy",
    body: "Your strategy is saved to My Strategies. From there you can backtest it, version it, or deploy it via Algo Deployment.",
    linkText: "→ View your saved strategies in the My Strategies tab"
  }
];

// ─── Tour Step Panel — persistent banner card at the bottom ──────────────────
function TourStepPanel({
  step, onNext, onSkip, onClose, total,
}: { step: number; onNext: () => void; onSkip: () => void; onClose: () => void; total: number }) {
  const s = TOUR_STEPS[step];
  const isLast = step === total - 1;
  const fillWidth = ((step + 1) / total) * 100;

  return (
    <div 
      className="relative w-full overflow-hidden mt-6 bg-[#f5f3ff] border border-[#ddd6fe] rounded-xl p-5 md:py-5 md:px-6 transition-all duration-300 shadow-sm"
    >
      {/* Thin progress bar at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ddd6fe]">
        <div 
          className="h-full bg-[#7c3aed] transition-all duration-300" 
          style={{ width: `${fillWidth}%` }} 
        />
      </div>

      {/* × Close button top-right */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-[#9ca3af] hover:text-gray-600 transition-colors p-1"
        aria-label="Dismiss tour"
      >
        <span className="text-lg font-bold leading-none">×</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        {/* Left side */}
        <div className="space-y-1.5 flex-grow pr-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed]">
            Step {step + 1} of {total}
          </p>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">
            {s.title}
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
            {s.body}
          </p>
          <span className="inline-block text-xs font-semibold text-[#7c3aed] hover:underline cursor-pointer">
            {s.linkText}
          </span>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-4 shrink-0 flex-wrap justify-end">
          {/* Dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-colors"
                style={{ backgroundColor: i === step ? "#7c3aed" : "#ddd6fe" }}
              />
            ))}
          </div>

          {/* Skip button */}
          <button
            onClick={onSkip}
            className="text-xs font-semibold text-[#9ca3af] hover:text-gray-600 uppercase tracking-wide transition-colors"
          >
            Skip Tour
          </button>

          {/* Next / Finish button */}
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-lg"
          >
            {isLast ? "Get Started" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
