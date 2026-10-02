"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, ArrowRight } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { Reveal } from "@/components/ui/Reveal";
import { brokersAu } from "@/data/brokers-au";
import { brokersUs } from "@/data/brokers-us";
import { brokersSg, brokersHk } from "@/data/brokers-asia";
import { brokers as allBrokers } from "@/data/brokers";
import { FOUNDER_BROKERS } from "@/config/founder";

const ukBrokers = allBrokers
  .filter((b) => FOUNDER_BROKERS.includes(b.id))
  .slice(0, 3)
  .map((b) => ({
    id: b.id,
    name: b.name,
    logoUrl: b.logo,
    bestFor: b.oneLine,
    stat: b.spreads ? `Spreads from ${b.spreads}` : b.minDeposit ? `Min deposit ${b.minDeposit}` : "",
    features: b.pros.slice(0, 3),
    regulation: b.fcaRegulated ? "FCA PROTECTED" : "GLOBAL",
  }));

const brokerBranding: Record<string, { bg: string; border: string }> = {
  "ig": {
    bg: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    border: "var(--accent)"
  },
  "ic-markets": {
    bg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    border: "var(--accent)"
  },
  "eightcap": {
    bg: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80",
    border: "var(--accent)"
  }
};

const defaultBranding = {
  bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  border: "var(--accent)"
};

function TradingViewLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 22H7V6h7v16zm8-22h-7v28h7V0zm8 14h-7v14h7V14z" fill="currentColor" />
    </svg>
  );
}

export function BrokerEcosystemSection() {
  const { region } = useRegion();
  const [hoveredBrokerId, setHoveredBrokerId] = useState<string | null>(null);

  useEffect(() => {
    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initWidget = () => {
      if (typeof (window as any).TradingView !== "undefined") {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: "FX:GBPUSD",
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "ecosystem-tradingview-chart-container",
          studies: ["MASimple@tv-basicstudies", "RSI@tv-basicstudies"]
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      const t = setTimeout(initWidget, 100);
      return () => clearTimeout(t);
    }
  }, []);

  const getRegionalData = () => {
    switch (region) {
      case "au":
        return {
          brokers: brokersAu.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            bestFor: b.bestFor,
            stat: b.minDeposit === "$0" ? "No Minimum Deposit" : `Min Deposit: ${b.minDeposit}`,
            features: b.features,
            regulation: "ASIC REGULATED"
          })),
          link: "/au/brokers"
        };
      case "us":
        return {
          brokers: brokersUs.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            bestFor: b.bestFor,
            stat: `Min Deposit: ${b.minDeposit}`,
            features: b.features,
            regulation: "CFTC / NFA REGULATED"
          })),
          link: "/us/brokers"
        };
      case "sg":
        return {
          brokers: brokersSg.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            bestFor: b.bestFor,
            stat: `Min Deposit: ${b.minDeposit}`,
            features: b.features,
            regulation: "MAS REGULATED"
          })),
          link: "/sg/brokers"
        };
      case "hk":
        return {
          brokers: brokersHk.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            bestFor: b.bestFor,
            stat: `Min Deposit: ${b.minDeposit}`,
            features: b.features,
            regulation: "SFC REGULATED"
          })),
          link: "/hk/brokers"
        };
      default:
        return {
          brokers: ukBrokers,
          link: "/brokers"
        };
    }
  };

  const { brokers, link } = getRegionalData();

  return (
    <section
      id="broker-ecosystem"
      className="w-full border-b select-none relative"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
        paddingTop: "var(--section-y-desktop)",
        paddingBottom: "var(--section-y-desktop)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 space-y-20">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl space-y-4">
            <span
              className="block type-label uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              EXECUTION & CHARTING ECOSYSTEM
            </span>
            <h2
              className="type-display-lg font-normal"
              style={{ color: "var(--text-primary)" }}
            >
              Broker & Tool Infrastructure.
            </h2>
            <p
              className="type-body-lg font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              Independent decision-support tooling paired with verified, Tier-1 regulated execution venues.
            </p>
          </div>
        </Reveal>

        {/* 1. TradingView Integrated Block */}
        <Reveal delay={0.08}>
          <div className="border p-8 lg:p-10" style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <TradingViewLogo className="w-5 h-5 text-white" />
                  <span className="type-label font-bold uppercase" style={{ color: "var(--text-primary)" }}>
                    Official Charting Partner
                  </span>
                </div>

                <h3 className="type-h2 font-normal" style={{ color: "var(--text-primary)" }}>
                  The charting platform serious traders actually use.
                </h3>

                <div className="space-y-3 type-body font-normal text-sm" style={{ color: "var(--text-secondary)" }}>
                  <p>
                    Every chart walkthrough and technical setup in the Drawdown curriculum is built on TradingView. It provides real-time multi-asset market data, institutional charting tools, and server-side alerts.
                  </p>
                  <p>
                    We use it across our daily sessions and recommend it as our standard charting environment.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/go/tradingview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-wider font-bold transition-all duration-200"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--surface-base)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    Try TradingView Free →
                  </Link>
                  <p className="text-[11px] font-sans" style={{ color: "var(--text-tertiary)" }}>
                    Partner link — we receive compensation if you subscribe to a paid plan.
                  </p>
                </div>
              </div>

              {/* Embedded Chart Preview */}
              <div className="lg:col-span-7 h-[380px] lg:h-[420px] w-full border relative overflow-hidden flex flex-col" style={{ borderColor: "var(--border-subtle)", backgroundColor: "#0c0c0e", borderRadius: "var(--radius-md)" }}>
                <div className="h-9 border-b px-4 flex items-center justify-between z-10" style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--market-up)]" />
                    <span className="text-[11px] font-mono font-bold tracking-wider" style={{ color: "var(--text-primary)" }}>LIVE</span>
                    <span className="text-[11px] font-mono tracking-wider" style={{ color: "var(--text-secondary)" }}>GBP/USD</span>
                    <span className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>1H</span>
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: "var(--text-tertiary)" }}>Powered by TradingView</span>
                </div>
                <div className="flex-1 w-full relative">
                  <div id="ecosystem-tradingview-chart-container" className="w-full h-full absolute inset-0" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 2. Regulated Broker Cards */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
            <div>
              <span className="type-label uppercase font-bold block mb-1" style={{ color: "var(--text-secondary)" }}>
                VERIFIED BROKERS
              </span>
              <h3 className="type-h3 font-semibold" style={{ color: "var(--text-primary)" }}>
                Where our founder trades live
              </h3>
            </div>
            <Link
              href={link}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Compare All Brokers <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brokers.map((broker, idx) => {
              const branding = brokerBranding[broker.id] || defaultBranding;
              const isHovered = hoveredBrokerId === broker.id;

              return (
                <Reveal key={broker.id} delay={idx * 0.08}>
                <div
                  onMouseEnter={() => setHoveredBrokerId(broker.id)}
                  onMouseLeave={() => setHoveredBrokerId(null)}
                  className="p-6 md:p-8 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden h-full"
                  style={{
                    borderColor: isHovered ? "var(--accent)" : "var(--border-subtle)",
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: isHovered ? "var(--elev-2)" : "var(--elev-1)",
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="type-label uppercase font-bold" style={{ color: "var(--text-primary)" }}>
                        {broker.name}
                      </span>
                      <span
                        className="text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                          borderColor: "color-mix(in srgb, var(--market-up) 25%, transparent)",
                          color: "var(--market-up)",
                          borderRadius: "var(--radius-pill)",
                        }}
                      >
                        {broker.regulation}
                      </span>
                    </div>

                    <p className="text-xs font-sans font-medium" style={{ color: "var(--text-secondary)" }}>
                      {broker.bestFor}
                    </p>

                    <div className="py-2.5 border-y" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="font-mono text-xs tabular-nums font-semibold" style={{ color: "var(--text-primary)" }}>
                        {broker.stat}
                      </span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {broker.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-sans" style={{ color: "var(--text-secondary)" }}>
                          <Check className="w-3.5 h-3.5 text-[var(--market-up)] shrink-0" strokeWidth={1.5} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t mt-6" style={{ borderColor: "var(--border-subtle)" }}>
                    <Link
                      href={`/go/${broker.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-medium font-sans border transition-all duration-200"
                      style={{
                        backgroundColor: "var(--surface-base)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      Open Account →
                    </Link>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>

          <div
            className="p-4 border text-[11px] font-sans leading-relaxed"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-secondary)",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Regulatory Disclosure:</strong> CFDs and spread bets are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 68% and 78% of retail investor accounts lose money when trading CFDs with these providers. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
          </div>
        </div>
      </div>
    </section>
  );
}
