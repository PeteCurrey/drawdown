"use client";
/**
 * TradingViewWidget — real embedded TradingView Advanced Chart.
 *
 * Injects the TradingView library via script tag and initialises a
 * TradingView.widget() instance inside a dedicated container div.
 *
 * On symbol or interval change: destroys the old widget instance and
 * creates a new one. Uses a stable container ID to avoid DOM conflicts.
 *
 * TradingView symbol map: internal hookSlug → TradingView format.
 */

import { useEffect, useRef } from "react";

// ── Symbol mapping ────────────────────────────────────────────────────────────
const TV_SYMBOL_MAP: Record<string, string> = {
  // Forex & Metals
  GBPUSD: "FX:GBPUSD",
  EURUSD: "FX:EURUSD",
  USDJPY: "FX:USDJPY",
  USDCHF: "FX:USDCHF",
  AUDUSD: "FX:AUDUSD",
  NZDUSD: "FX:NZDUSD",
  USDCAD: "FX:USDCAD",
  EURGBP: "FX:EURGBP",
  EURJPY: "FX:EURJPY",
  GBPJPY: "FX:GBPJPY",
  CADJPY: "FX:CADJPY",
  AUDCAD: "FX:AUDCAD",
  GBPCAD: "FX:GBPCAD",
  XAUUSD: "TVC:GOLD",
  XAGUSD: "TVC:SILVER",
  // Indices
  SPX:    "SP:SPX",
  NDX:    "NASDAQ:NDX",
  DJI:    "DJ:DJI",
  FTSE:   "TVC:UKX",
  DAX:    "XETR:DAX",
  NIKKEI: "TVC:NI225",
  ASX200: "ASX:XJO",
  // Commodities
  WTIUSD: "NYMEX:CL1!",
  NATGAS: "NYMEX:NG1!",
  COPPER: "COMEX:HG1!",
  // Crypto
  BTCUSD: "BINANCE:BTCUSDT",
  ETHUSD: "BINANCE:ETHUSDT",
  SOLUSD: "BINANCE:SOLUSDT",
};

// ── Interval mapping (internal → TradingView) ─────────────────────────────────
const TV_INTERVAL_MAP: Record<string, string> = {
  "5min":  "5",
  "15min": "15",
  "30min": "30",
  "1h":    "60",
  "4h":    "240",
  "1day":  "D",
  "1week": "W",
};

export function toTVSymbol(hookSlug: string): string {
  return TV_SYMBOL_MAP[hookSlug] ?? "FX:GBPUSD";
}

export function toTVInterval(interval: string): string {
  return TV_INTERVAL_MAP[interval] ?? "240";
}

// ── Widget props ──────────────────────────────────────────────────────────────

interface TradingViewWidgetProps {
  hookSlug: string;
  interval: string;
  theme?: "light" | "dark";
  height?: number;
}

declare global {
  interface Window {
    TradingView?: any;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const onReadyCallbacks: Array<() => void> = [];

function loadTVScript(cb: () => void) {
  if (scriptLoaded) { cb(); return; }
  onReadyCallbacks.push(cb);
  if (scriptLoading) return;
  scriptLoading = true;
  const s = document.createElement("script");
  s.src = "https://s3.tradingview.com/tv.js";
  s.async = true;
  s.onload = () => {
    scriptLoaded = true;
    onReadyCallbacks.forEach(fn => fn());
    onReadyCallbacks.length = 0;
  };
  document.head.appendChild(s);
}

export function TradingViewWidget({
  hookSlug,
  interval,
  theme = "light",
  height = 520,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef    = useRef<any>(null);
  const containerId  = "tv_advanced_chart_mi";

  useEffect(() => {
    const tvSymbol   = toTVSymbol(hookSlug);
    const tvInterval = toTVInterval(interval);

    function initWidget() {
      if (!containerRef.current || !window.TradingView) return;

      // Destroy previous instance if it exists
      if (widgetRef.current && typeof widgetRef.current.remove === "function") {
        try { widgetRef.current.remove(); } catch {}
      }
      // Clear the container so TradingView can re-insert its iframe
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      try {
        widgetRef.current = new window.TradingView.widget({
          container_id:       containerId,
          symbol:             tvSymbol,
          interval:           tvInterval,
          theme,
          style:              "1",
          locale:             "en",
          toolbar_bg:         theme === "light" ? "#f8f8f8" : "#131722",
          enable_publishing:  false,
          hide_top_toolbar:   false,
          hide_legend:        false,
          save_image:         false,
          height,
          width:              "100%",
          studies:            ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
          timezone:           "Etc/UTC",
          withdateranges:     true,
          allow_symbol_change: false, // we control this externally
        });
      } catch (err) {
        console.error("[TradingViewWidget] init error:", err);
      }
    }

    loadTVScript(initWidget);

    return () => {
      // Cleanup on unmount or dep change — actual removal happens at top of next effect
    };
  }, [hookSlug, interval, theme, height]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ height, width: "100%", background: theme === "light" ? "#f8f8f8" : "#131722" }}
    />
  );
}
