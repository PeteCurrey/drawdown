"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

const C = "#C8F135";

// Map our instrument slugs → TradingView symbols
function toTVSymbol(instrument: string): string {
  const MAP: Record<string, string> = {
    GBPUSD: "FX:GBPUSD",  EURUSD: "FX:EURUSD",  USDJPY: "FX:USDJPY",
    GBPJPY: "FX:GBPJPY",  XAGUSD: "OANDA:XAGUSD",
    NAS100: "OANDA:NAS100USD", SPX500: "OANDA:SPX500USD",
    US30:   "OANDA:US30USD",   UK100:  "OANDA:UK100GBP",
    BTCUSD: "BINANCE:BTCUSDT", ETHUSD: "BINANCE:ETHUSDT",
  };
  return MAP[instrument.toUpperCase()] ?? instrument;
}

interface TradingViewEmbedProps {
  symbol:          string;
  intervalMinutes: string; // "15", "60", "D", etc.
}

export function TradingViewEmbed({ symbol, intervalMinutes }: TradingViewEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef    = useRef<HTMLScriptElement | null>(null);
  const observerRef  = useRef<IntersectionObserver | null>(null);
  const loadedRef    = useRef(false);

  const tvSymbol = toTVSymbol(symbol || "GBPUSD");
  const tvUrl    = `https://www.tradingview.com/?aff_id=139431`;

  // Lazy-load via IntersectionObserver — only inject script when chart scrolls into view
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedRef.current) {
          loadedRef.current = true;
          injectWidget();
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(containerRef.current);

    return () => observerRef.current?.disconnect();
  }, []); // eslint-disable-line

  // Re-inject when symbol or interval changes (after initial load)
  useEffect(() => {
    if (loadedRef.current) injectWidget();
  }, [tvSymbol, intervalMinutes]); // eslint-disable-line

  function injectWidget() {
    if (!containerRef.current) return;

    // Remove previous widget
    containerRef.current.innerHTML = "";
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.height = "400px";

    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = "400px";

    const script = document.createElement("script");
    script.type  = "text/javascript";
    script.src   = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize:             true,
      symbol:               tvSymbol,
      interval:             intervalMinutes,
      timezone:             "UTC",
      theme:                "dark",
      style:                "1",
      locale:               "en",
      enable_publishing:    false,
      allow_symbol_change:  false,
      hide_top_toolbar:     false,
      hide_legend:          false,
      save_image:           false,
      calendar:             false,
      hide_volume:          false,
      support_host:         "https://www.tradingview.com",
    });

    wrapper.appendChild(inner);
    wrapper.appendChild(script);
    containerRef.current.appendChild(wrapper);
    scriptRef.current = script;
  }

  return (
    <div style={{ border: "1px solid #222" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "#111", borderColor: "#222" }}
      >
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-primary">
            Chart Context
          </p>
          <p className="text-[9px] font-mono text-text-tertiary mt-0.5">
            Verify your logic against live price action · {tvSymbol} · {intervalMinutes}
          </p>
        </div>
        <a
          href={tvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#1A1A1A", color: C, border: `1px solid ${C}40` }}
        >
          Open in TradingView
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Widget container — IntersectionObserver triggers load */}
      <div
        ref={containerRef}
        style={{ height: 400, backgroundColor: "#0A0A0A", overflow: "hidden" }}
      >
        {/* Placeholder shown before widget injects */}
        <div className="flex items-center justify-center h-full">
          <p className="text-[10px] font-mono text-text-tertiary animate-pulse">
            Loading chart…
          </p>
        </div>
      </div>
    </div>
  );
}
