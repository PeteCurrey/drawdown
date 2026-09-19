"use client";

import { useEffect, useState } from "react";
import { WifiOff, Users } from "lucide-react";

interface MarketPrice {
  symbol: string;
  price: number;
  changePercent: number;
}

interface ConsensusItem {
  symbol: string;
  score: number;
  verdict: string;
  rsi: string;
  trend: string;
}

const ASSET_CONFIG = [
  {
    symbol: "GBPUSD",
    label: "GBP/USD",
    bg: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=600&q=80",
  },
  {
    symbol: "XAUUSD",
    label: "XAU/USD",
    bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    symbol: "EURUSD",
    label: "EUR/USD",
    bg: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
  },
  {
    symbol: "BTCUSD",
    label: "BTC/USD",
    bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  },
];

export function InstitutionalConsensusSection() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [consensus, setConsensus] = useState<ConsensusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedOffline, setFeedOffline] = useState(false);
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const symbolList = ASSET_CONFIG.map((c) => c.symbol).join(",");
        const [priceRes, conRes] = await Promise.all([
          fetch(`/api/market/prices?symbols=${symbolList}`),
          fetch("/api/market/consensus"),
        ]);

        const priceData = priceRes.ok ? await priceRes.json() : [];
        const conData = conRes.ok ? await conRes.json() : [];

        if (!active) return;

        const hasPrice = Array.isArray(priceData) && priceData.length > 0;
        const hasCon = Array.isArray(conData) && conData.length > 0;

        if (!hasPrice && !hasCon) {
          setFeedOffline(true);
        } else {
          if (hasPrice) setPrices(priceData);
          if (hasCon) setConsensus(conData);
        }
      } catch (err) {
        console.error("Error loading consensus data:", err);
        if (active) setFeedOffline(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (price: number | null | undefined, symbol: string) => {
    if (price == null || typeof price !== "number" || Number.isNaN(price))
      return "--";
    if (symbol.includes("BTC") || symbol.includes("XAU"))
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    return price.toFixed(4);
  };

  const getSignalColors = (score: number) => {
    if (score >= 60)
      return {
        text: "var(--market-up)",
        bg: "color-mix(in srgb, var(--market-up) 10%, transparent)",
        border: "color-mix(in srgb, var(--market-up) 25%, transparent)",
      };
    if (score <= 40)
      return {
        text: "var(--market-down)",
        bg: "color-mix(in srgb, var(--market-down) 10%, transparent)",
        border: "color-mix(in srgb, var(--market-down) 25%, transparent)",
      };
    return {
      text: "var(--market-flat)",
      bg: "color-mix(in srgb, var(--market-flat) 5%, transparent)",
      border: "color-mix(in srgb, var(--market-flat) 15%, transparent)",
    };
  };

  const matchSymbol = (configSymbol: string, dataSymbol: string) => {
    const clean = (s: string) => s.replace(/[^a-zA-Z]/g, "").toLowerCase();
    return clean(configSymbol) === clean(dataSymbol);
  };

  // ── Shared offline panel ────────────────────────────────────────────────────
  const OfflinePanel = ({ label }: { label: string }) => (
    <div
      className="border p-12 flex flex-col items-center justify-center gap-3 text-center"
      style={{
        backgroundColor: "var(--surface-raised)",
        borderColor: "var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        minHeight: 280,
      }}
    >
      <WifiOff className="w-7 h-7" style={{ color: "var(--text-secondary)" }} />
      <p
        className="text-sm font-mono font-bold uppercase tracking-wider"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </p>
      <p className="text-xs font-sans" style={{ color: "var(--text-secondary)" }}>
        Unable to retrieve live data. Refresh to retry.
      </p>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Section Heading */}
      <div className="mb-10">
        <span
          className="block type-label uppercase mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Accumulation matrix
        </span>
        <h2
          className="type-display-lg font-normal mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Market Consensus
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <p
            className="type-body-lg font-normal leading-relaxed lg:col-span-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Multi-timeframe technical consensus, momentum thresholds, and trend
            alignment calculated systematically from daily historical candle series.
          </p>
          <p
            className="text-[12px] leading-relaxed font-mono lg:col-span-6 border-l pl-6 pt-1"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            Tracks directional consensus of primary global assets. By evaluating
            the last 50 daily candles of each instrument, the matrix calculates its
            20-period EMA and 14-period RSI. A consensus score above 60% indicates
            sustained bullish technical alignment.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border p-6 animate-pulse flex flex-col gap-4"
              style={{
                backgroundColor: "var(--surface-raised)",
                borderColor: "var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                minHeight: 260,
              }}
            >
              <div
                className="h-4 w-20 rounded"
                style={{ backgroundColor: "var(--border-subtle)" }}
              />
              <div
                className="h-8 w-32 rounded"
                style={{ backgroundColor: "var(--border-subtle)" }}
              />
              <div className="mt-auto space-y-2">
                <div
                  className="h-2 w-full rounded"
                  style={{ backgroundColor: "var(--border-subtle)" }}
                />
                <div
                  className="h-2 w-full rounded"
                  style={{ backgroundColor: "var(--border-subtle)" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : feedOffline ? (
        <OfflinePanel label="Consensus Feed Offline" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSET_CONFIG.map((config) => {
            const priceItem = prices.find((p) =>
              matchSymbol(config.symbol, p.symbol)
            );
            const conItem = consensus.find((c) =>
              matchSymbol(config.symbol, c.symbol)
            );

            const price =
              priceItem && !Number.isNaN(priceItem.price)
                ? priceItem.price
                : null;
            const changePercent =
              priceItem && !Number.isNaN(priceItem.changePercent)
                ? priceItem.changePercent
                : null;
            const score = conItem?.score ?? null;
            const verdict = conItem?.verdict ?? null;

            const isPositive = changePercent !== null && changePercent >= 0;
            const buyPct = score ?? 0;
            const sellPct = score !== null ? 100 - score : 0;
            const isHovered = hoveredSymbol === config.symbol;
            const sigColors = getSignalColors(score ?? 50);

            return (
              <div
                key={config.symbol}
                onMouseEnter={() => setHoveredSymbol(config.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className="p-6 border flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isHovered
                    ? "var(--accent)"
                    : "var(--border-subtle)",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: isHovered
                    ? "0 0 24px rgba(10, 37, 64, 0.15), inset 0 0 12px rgba(10, 37, 64, 0.15)"
                    : "none",
                }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 z-0 transition-all duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `url(${config.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isHovered ? 0.12 : 0.03,
                    mixBlendMode: "luminosity",
                  }}
                />

                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="text-[13px] font-sans font-bold uppercase tracking-wide"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {config.label}
                      </span>
                      {verdict ? (
                        <span
                          className="text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider"
                          style={{
                            color: sigColors.text,
                            backgroundColor: sigColors.bg,
                            borderColor: sigColors.border,
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          {verdict}
                        </span>
                      ) : (
                        <span
                          className="text-[9px] font-mono uppercase tracking-wider"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          —
                        </span>
                      )}
                    </div>

                    {/* Price block */}
                    <div className="mb-6">
                      <span
                        className="text-[28px] font-mono tabular-nums font-bold leading-none tracking-tight block"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatPrice(price, config.symbol)}
                      </span>
                      <span
                        className="text-[10px] font-mono font-semibold mt-1.5 inline-block"
                        style={{
                          color:
                            changePercent !== null
                              ? isPositive
                                ? "var(--market-up)"
                                : "var(--market-down)"
                              : "var(--text-tertiary)",
                        }}
                      >
                        {changePercent !== null ? (
                          <>
                            {isPositive ? "▲" : "▼"}{" "}
                            {Math.abs(changePercent).toFixed(2)}%
                          </>
                        ) : (
                          "—"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Progress bars — only when consensus data available */}
                  {score !== null ? (
                    <div
                      className="space-y-4 pt-4 border-t"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className="font-sans font-medium uppercase tracking-wider"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            L/S Buy Ratio
                          </span>
                          <span
                            className="font-mono tabular-nums font-bold"
                            style={{ color: "var(--market-up)" }}
                          >
                            {buyPct}%
                          </span>
                        </div>
                        <div
                          className="w-full h-1 overflow-hidden"
                          style={{
                            borderRadius: "var(--radius-md)",
                            backgroundColor:
                              "color-mix(in srgb, var(--border-subtle) 60%, transparent)",
                          }}
                        >
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${buyPct}%`,
                              backgroundColor: "var(--market-up)",
                              borderRadius: "var(--radius-md)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className="font-sans font-medium uppercase tracking-wider"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            L/S Sell Ratio
                          </span>
                          <span
                            className="font-mono tabular-nums font-bold"
                            style={{ color: "var(--market-down)" }}
                          >
                            {sellPct}%
                          </span>
                        </div>
                        <div
                          className="w-full h-1 overflow-hidden"
                          style={{
                            borderRadius: "var(--radius-md)",
                            backgroundColor:
                              "color-mix(in srgb, var(--border-subtle) 60%, transparent)",
                          }}
                        >
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${sellPct}%`,
                              backgroundColor: "var(--market-down)",
                              borderRadius: "var(--radius-md)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="pt-4 border-t"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <p
                        className="text-[10px] font-mono"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Consensus data unavailable
                      </p>
                    </div>
                  )}

                  {/* Source note */}
                  <div
                    className="mt-6 flex items-center gap-1.5 text-[9px] font-sans uppercase tracking-widest"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Users className="w-3 h-3" /> Consensus Ratio
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
