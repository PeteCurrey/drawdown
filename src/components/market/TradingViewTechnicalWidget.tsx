"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

type WidgetStatus = "idle" | "loading" | "loaded" | "error";

interface TradingViewTechnicalWidgetProps {
  /** TradingView symbol string, e.g. "FX:EURUSD" */
  tvSymbol: string;
  /**
   * Whether this widget is in the viewport (or near it).
   * The widget only initialises once this flips to true,
   * enabling lazy loading via IntersectionObserver in the parent.
   */
  isVisible: boolean;
}

const WIDGET_HEIGHT = 200;

export function TradingViewTechnicalWidget({
  tvSymbol,
  isVisible,
}: TradingViewTechnicalWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<WidgetStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const initWidget = useCallback(() => {
    if (!containerRef.current) return;
    clearTimer();

    setStatus("loading");
    containerRef.current.innerHTML = "";

    // TradingView requires this exact DOM structure.
    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.width = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    // textContent rather than innerHTML — avoids XSS scanner false positives.
    script.textContent = JSON.stringify({
      interval: "1D",      // Daily — matches "Technical Consensus" framing across the platform
      width: "100%",
      isTransparent: true, // Transparent background so our card surface shows through
      height: WIDGET_HEIGHT,
      symbol: tvSymbol,
      showIntervalTabs: false,
      displayMode: "single", // Compact gauge view only — no oscillator/MA table breakdown
      locale: "en",
      colorTheme: "dark",
    });

    wrapper.appendChild(widgetDiv);
    wrapper.appendChild(script);
    containerRef.current.appendChild(wrapper);

    // After 2.5 s, check whether TradingView actually created an iframe.
    // If yes → loaded. If no → the embed failed (network, ad-blocker, etc.) → error.
    // This is more reliable than a pure time-based guess because the iframe is injected
    // synchronously once TradingView's script executes.
    timerRef.current = setTimeout(() => {
      const iframe = containerRef.current?.querySelector("iframe");
      setStatus(iframe ? "loaded" : "error");
    }, 2500);
  }, [tvSymbol]);

  // Initialise once the card scrolls into view.
  useEffect(() => {
    if (isVisible && status === "idle") {
      initWidget();
    }
  }, [isVisible, status, initWidget]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const handleRetry = () => {
    clearTimer();
    setStatus("idle");
    // Tiny delay so React re-renders idle state before we re-init.
    setTimeout(initWidget, 50);
  };

  return (
    <div className="relative w-full" style={{ minHeight: WIDGET_HEIGHT }}>
      {/* ── Skeleton: shown while idle or loading ─────────────────────── */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-500",
          status === "loaded" || status === "error"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        )}
        aria-hidden={status === "loaded" || status === "error"}
      >
        {/* Gauge circle skeleton */}
        <div className="w-20 h-20 rounded-full bg-background-surface/60 animate-pulse" />
        {/* Label skeleton */}
        <div className="w-14 h-2.5 bg-background-surface/60 rounded animate-pulse" />
        <div className="w-20 h-2 bg-background-surface/40 rounded animate-pulse" />
      </div>

      {/* ── Error state ────────────────────────────────────────────────── */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <WifiOff className="w-5 h-5 text-text-tertiary" />
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary text-center leading-relaxed">
            Live data<br />unavailable
          </p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border-slate/50 text-[8px] font-mono uppercase tracking-widest text-text-tertiary hover:text-text-primary hover:border-border-slate transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* ── Widget mount point ─────────────────────────────────────────── */}
      {/*
        TradingView's embed terms require the "powered by TradingView" attribution
        link that the widget renders inside the iframe. It cannot be stripped.
        With isTransparent: true and colorTheme: dark it renders as small grey
        text at the bottom of the widget area — minimal visual footprint.
      */}
      <div
        ref={containerRef}
        className={cn(
          "w-full transition-opacity duration-700",
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
        style={{ minHeight: WIDGET_HEIGHT }}
        aria-label={`TradingView technical analysis for ${tvSymbol}`}
      />
    </div>
  );
}
