"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, Award, Clock, TrendingUp, Radio, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRegion } from "@/components/layout/RegionalLayout";
import { Reveal } from "@/components/ui/Reveal";
import { RevealGroup } from "@/components/ui/RevealGroup";

export function TheWireSection() {
  const [take, setTake] = useState<{ content: string; date: string } | null>(null);
  const supabase = createClient();
  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;

  useEffect(() => {
    async function fetchTake() {
      try {
        const { data } = await (supabase
          .from("daily_briefings")
          .select("macro_narrative, report_date") as any)
          .order("report_date", { ascending: false })
          .limit(1)
          .single();

        if (data && data.macro_narrative && data.macro_narrative.trim().length > 20) {
          setTake({
            content: data.macro_narrative,
            date: new Date(data.report_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          });
        } else {
          setTake({
            content: "Central bank divergence continues as US retail sales hold firm against softening UK labor metrics. Risk parameters favor measured exposure into the upcoming Fed window.",
            date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          });
        }
      } catch {
        setTake({
          content: "Central bank divergence continues as US retail sales hold firm against softening UK labor metrics. Risk parameters favor measured exposure into the upcoming Fed window.",
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        });
      }
    }
    fetchTake();
  }, []);

  return (
    <section
      id="the-wire"
      className="w-full border-b select-none relative"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
        paddingTop: "var(--section-y-desktop)",
        paddingBottom: "var(--section-y-desktop)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl mb-12 space-y-4">
            <span
              className="block type-label uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              FINANCIAL EDITORIAL
            </span>
            <h2
              className="type-display-lg font-normal"
              style={{ color: "var(--text-primary)" }}
            >
              The Wire.
            </h2>
            <p
              className="type-body-lg font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              Founder analysis, macro flow intelligence, and the weekly directional forecasting challenge.
            </p>
          </div>
        </Reveal>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal delay={0.04}>
          {/* Column 1: Pete's Daily Take */}
          <div
            className="p-6 md:p-8 border flex flex-col justify-between transition-all duration-200 h-full"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-1)",
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="type-label uppercase font-bold flex items-center gap-2" style={{ color: "var(--accent)" }}>
                  <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                  PETE&apos;S DAILY TAKE
                </span>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  {take?.date ?? "Today"}
                </span>
              </div>

              <blockquote
                className="font-sans text-sm md:text-base leading-relaxed italic"
                style={{ color: "var(--text-primary)" }}
              >
                &ldquo;{take?.content ? (take.content.length > 220 ? take.content.slice(0, 220) + "..." : take.content) : "Loading daily briefing..."}&rdquo;
              </blockquote>

              <div className="pt-2">
                <span className="font-sans text-xs font-semibold block" style={{ color: "var(--text-primary)" }}>
                  Pete Currey
                </span>
                <span className="type-label block text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Founder, Drawdown · Trading live since 2016
                </span>
              </div>
            </div>

            <div className="pt-6 border-t mt-6" style={{ borderColor: "var(--border-subtle)" }}>
              <Link
                href={`${regionPrefix}/tools/intelligence-hub`}
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Read Full Briefing <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Column 2: Macro Pulse */}
          <Reveal delay={0.1}>
          <div
            className="p-6 md:p-8 border flex flex-col justify-between transition-all duration-200 h-full"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-1)",
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="type-label uppercase font-bold flex items-center gap-2" style={{ color: "var(--market-up)" }}>
                  <Radio className="w-3.5 h-3.5" strokeWidth={1.5} />
                  MACRO PULSE
                </span>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  Institutional Feeds
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>US 10-Year Yield</span>
                    <span className="font-mono text-xs tabular-nums font-semibold" style={{ color: "var(--text-primary)" }}>4.28%</span>
                  </div>
                  <div className="text-[11px] font-sans" style={{ color: "var(--text-secondary)" }}>Consolidating near resistance; Fed rate cut expectations anchored.</div>
                </div>

                <div className="space-y-1 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Gold / Real Yields</span>
                    <span className="font-mono text-xs tabular-nums font-semibold" style={{ color: "var(--market-up)" }}>Bullish Structure</span>
                  </div>
                  <div className="text-[11px] font-sans" style={{ color: "var(--text-secondary)" }}>Central bank sovereign accumulation outpacing ETF outflows.</div>
                </div>

                <div className="space-y-1 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>DXY Dollar Index</span>
                    <span className="font-mono text-xs tabular-nums font-semibold" style={{ color: "var(--market-flat)" }}>104.20 Neutral</span>
                  </div>
                  <div className="text-[11px] font-sans" style={{ color: "var(--text-secondary)" }}>Rangebound against European crosses ahead of CPI prints.</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t mt-6" style={{ borderColor: "var(--border-subtle)" }}>
              <Link
                href="/markets"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                View Live Macro Feeds <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Column 3: Weekly Forecast Challenge */}
          <Reveal delay={0.16}>
          <div
            className="p-6 md:p-8 border flex flex-col justify-between transition-all duration-200 h-full"
            style={{
              backgroundColor: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--elev-1)",
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="type-label uppercase font-bold flex items-center gap-2" style={{ color: "var(--market-flat)" }}>
                  <Award className="w-3.5 h-3.5" strokeWidth={1.5} />
                  FORECAST CHALLENGE
                </span>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  Market Call
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-sans text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  The Weekly Market Call
                </h3>
                <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Lock in directional forecasts across GBP/USD, Gold, S&P 500, and Bitcoin. Track your prediction accuracy against empirical settlement prices with zero financial risk.
                </p>

                <div className="space-y-2 pt-2 text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[var(--market-up)]" strokeWidth={1.5} />
                    <span>Tuesday locks at 23:59 UTC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--market-flat)]" strokeWidth={1.5} />
                    <span>Friday market close resolution</span>
                  </div>
                </div>

                <div
                  className="p-3 border text-xs"
                  style={{
                    backgroundColor: "var(--surface-base)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>Prize:</span> Top forecaster receives 1 month complimentary Edge Tier access (£99 value).
                </div>
              </div>
            </div>

            <div className="pt-6 border-t mt-6" style={{ borderColor: "var(--border-subtle)" }}>
              <Link
                href="/market-call"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Enter This Week&apos;s Forecast <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
