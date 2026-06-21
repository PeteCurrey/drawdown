"use client";

import { useState } from "react";
import {
  ChevronDown, ChevronUp, Download, Mail, Link2, RefreshCw,
  TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, Target,
  Calendar, Globe, BarChart2, Shield, Clock, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MacroData {
  vix: number | null;
  vixRegime: string;
  dxy: number | null;
  dxyChg: number | null;
  gold: number | null;
  goldChg: number | null;
  yield10y: number | null;
  realYield: number | null;
  umcsent: number | null;
  regime: string;
}

interface CalendarEvent {
  time: string;
  currency: string;
  event: string;
  previous: string;
  forecast: string;
  impact: "high" | "medium" | "low";
}

interface InstrumentBrief {
  slug: string;
  display: string;
  category: string;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  setup_score: number;
  summary: string;
  entry_zone: string;
  target_1: string;
  target_2: string;
  stop: string;
  risk_reward: string;
  best_timeframe: "INTRADAY" | "SWING" | "POSITION";
  key_catalyst: string;
  price: number | null;
  changePct: number | null;
}

interface TopSetup extends InstrumentBrief {
  rank: number;
}

interface RiskItem {
  type: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
}

interface DailyReport {
  report_date: string;
  macro_narrative: string;
  macro_data: MacroData;
  events_today: CalendarEvent[];
  instrument_briefs: InstrumentBrief[];
  top_setups: TopSetup[];
  risk_radar: RiskItem[];
  generated_at: string;
}

interface Props {
  report: DailyReport | null;
  isStale: boolean;
  staleDate: string | null;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function BiasChip({ bias }: { bias: string }) {
  const color =
    bias === "BULLISH" ? "bg-profit/15 text-profit border-profit/25" :
    bias === "BEARISH" ? "bg-loss/15 text-loss border-loss/25"       :
    "bg-white/8 text-white/40 border-white/15";
  return (
    <span className={cn("text-[7px] font-black font-mono uppercase px-2 py-0.5 rounded border", color)}>
      {bias}
    </span>
  );
}

function SetupBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", score >= 70 ? "bg-amber-400" : score >= 40 ? "bg-accent" : "bg-white/20")}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-[9px] font-black font-mono", score >= 70 ? "text-amber-400" : score >= 40 ? "text-accent" : "text-white/30")}>
        {score}
      </span>
    </div>
  );
}

function MacroStat({ label, value, change, note }: {
  label: string; value: string; change?: number | null; note?: string;
}) {
  const isUp = change !== null && change !== undefined && change > 0;
  const isDown = change !== null && change !== undefined && change < 0;
  return (
    <div className="flex flex-col">
      <span className="text-[8px] font-mono uppercase tracking-widest text-white/30 mb-0.5">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[16px] font-black font-mono text-white">{value}</span>
        {change !== null && change !== undefined && (
          <span className={cn("text-[9px] font-mono font-bold flex items-center gap-0.5",
            isUp ? "text-profit" : isDown ? "text-loss" : "text-white/30")}>
            {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : isDown ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
            {isUp ? "+" : ""}{change.toFixed(2)}%
          </span>
        )}
      </div>
      {note && <span className="text-[7px] font-mono text-white/25 leading-tight mt-0.5">{note}</span>}
    </div>
  );
}

// Converts **bold** markdown to JSX
function BoldMarkdown({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? <strong key={i} className="text-white font-bold">{p}</strong> : p
      )}
    </span>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function MacroSection({ data, narrative }: { data: MacroData; narrative: string }) {
  const vixColor =
    !data.vix ? "text-white/40" :
    data.vix < 15 ? "text-profit" : data.vix < 20 ? "text-white" :
    data.vix < 25 ? "text-warning" : "text-loss";

  return (
    <section className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
      {/* Stats bar */}
      <div className="bg-[#111] border-b border-white/8 px-6 py-4">
        <div className="flex flex-wrap gap-8">
          <MacroStat label="VIX" value={data.vix?.toFixed(1) ?? "—"}
            note={data.vixRegime} />
          <div className="w-px bg-white/8 self-stretch" />
          <MacroStat label="DXY" value={data.dxy?.toFixed(2) ?? "—"} change={data.dxyChg}
            note="US Dollar Index" />
          <div className="w-px bg-white/8 self-stretch" />
          <MacroStat label="GOLD" value={data.gold ? `$${data.gold.toFixed(0)}` : "—"} change={data.goldChg}
            note="XAU/USD safe haven" />
          <div className="w-px bg-white/8 self-stretch" />
          <MacroStat label="REAL YIELD" value={data.realYield !== null ? `${data.realYield > 0 ? "+" : ""}${data.realYield.toFixed(2)}%` : "—"}
            note="10Y breakeven" />
          {data.umcsent && (
            <>
              <div className="w-px bg-white/8 self-stretch" />
              <MacroStat label="CONSUMER SENT." value={data.umcsent.toFixed(1)} note="UMich index" />
            </>
          )}
          <div className="ml-auto flex items-center">
            <span className={cn("text-[9px] font-mono font-bold uppercase px-3 py-1 rounded border",
              data.regime === "RISK-ON"      ? "bg-profit/10 text-profit border-profit/20" :
              data.regime === "RISK-OFF"     ? "bg-loss/10 text-loss border-loss/20"       :
              "bg-warning/10 text-warning border-warning/20")}>
              {data.regime}
            </span>
          </div>
        </div>
      </div>
      {/* AI Narrative */}
      <div className="px-6 py-5">
        <p className="text-[8px] font-mono uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
          <Globe className="w-3 h-3" /> GPT-4.1 MACRO ANALYSIS
        </p>
        {narrative ? (
          <p className="text-[12px] font-mono text-white/70 leading-relaxed">
            <BoldMarkdown text={narrative} />
          </p>
        ) : (
          <p className="text-[11px] font-mono text-white/30 italic">
            Macro narrative requires OPENAI_API_KEY to be configured.
          </p>
        )}
      </div>
    </section>
  );
}

function EventsSection({ events }: { events: CalendarEvent[] }) {
  const now = new Date();
  const nowUTCMins = now.getUTCHours() * 60 + now.getUTCMinutes();

  if (events.length === 0) return (
    <section className="bg-[#0d0d0d] border border-white/8 rounded-xl px-6 py-5">
      <p className="text-[8px] font-mono uppercase tracking-widest text-white/30 mb-2 flex items-center gap-2">
        <Calendar className="w-3 h-3" /> TODAY'S KEY EVENTS
      </p>
      <p className="text-[11px] font-mono text-white/30">No high-impact events today, or calendar unavailable.</p>
    </section>
  );

  return (
    <section className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-white/40" />
        <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">TODAY'S KEY EVENTS — ECONOMIC CALENDAR</span>
      </div>
      <div className="divide-y divide-white/5">
        {events.map((e, i) => {
          const [h, m] = e.time.split(":").map(Number);
          const evtMins = (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
          const minsAway = evtMins - nowUTCMins;
          const imminent = minsAway >= 0 && minsAway <= 120;
          const passed   = minsAway < -5;
          return (
            <div key={i} className={cn("flex items-center gap-4 px-6 py-3 transition-colors",
              imminent ? "bg-warning/8 border-l-2 border-l-warning" : "hover:bg-white/3")}>
              <div className="flex items-center gap-2 w-16 shrink-0">
                <Clock className={cn("w-3 h-3", imminent ? "text-warning" : "text-white/20")} />
                <span className={cn("text-[9px] font-mono font-bold",
                  imminent ? "text-warning" : passed ? "text-white/20" : "text-white/50")}>
                  {e.time}
                </span>
              </div>
              <span className={cn("text-[8px] font-mono font-bold uppercase w-8 shrink-0",
                e.impact === "high" ? "text-loss" : e.impact === "medium" ? "text-warning" : "text-white/30")}>
                {e.currency}
              </span>
              <span className={cn("flex-1 text-[10px] font-mono min-w-0",
                passed ? "text-white/25 line-through" : "text-white/70")}>{e.event}</span>
              <div className="flex items-center gap-4 shrink-0 text-[9px] font-mono">
                <span className="text-white/30">Prev: {e.previous || "—"}</span>
                <span className="text-white/50">Fcst: {e.forecast || "—"}</span>
                <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold uppercase",
                  e.impact === "high" ? "bg-loss/15 text-loss border border-loss/20" :
                  "bg-warning/10 text-warning border border-warning/20")}>
                  {e.impact}
                </span>
                {imminent && <span className="text-warning text-[8px] font-bold">{minsAway}m</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InstrumentRow({ brief, expanded, onToggle }: {
  brief: InstrumentBrief; expanded: boolean; onToggle: () => void;
}) {
  const isUp = (brief.changePct ?? 0) >= 0;
  return (
    <div className={cn("border-b border-white/5 transition-colors", expanded ? "bg-white/3" : "hover:bg-white/2")}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-3 text-left">
        <div className="w-[90px] shrink-0">
          <p className="text-[11px] font-black font-mono text-white">{brief.display}</p>
          <p className="text-[7px] font-mono text-white/30 uppercase">{brief.category}</p>
        </div>
        <BiasChip bias={brief.bias} />
        <SetupBar score={brief.setup_score} />
        <p className="flex-1 text-[10px] font-mono text-white/50 italic min-w-0 truncate">
          "{brief.summary}"
        </p>
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {brief.changePct !== null && (
            <span className={cn("text-[9px] font-mono font-bold", isUp ? "text-profit" : "text-loss")}>
              {isUp ? "+" : ""}{brief.changePct.toFixed(2)}%
            </span>
          )}
          <span className="text-[8px] font-mono text-white/20 uppercase border border-white/10 px-1.5 py-0.5 rounded">
            {brief.best_timeframe}
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-3">
          {[
            { label: "Entry Zone", value: brief.entry_zone,  icon: <Target className="w-3 h-3" /> },
            { label: "Target 1",   value: brief.target_1,    icon: <TrendingUp className="w-3 h-3 text-profit" /> },
            { label: "Target 2",   value: brief.target_2,    icon: <TrendingUp className="w-3 h-3 text-profit/60" /> },
            { label: "Stop Loss",  value: brief.stop,        icon: <AlertTriangle className="w-3 h-3 text-loss" /> },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[7px] font-mono text-white/25 uppercase tracking-widest mb-1 flex items-center gap-1">
                {item.icon} {item.label}
              </p>
              <p className="text-[11px] font-mono font-bold text-white/80">{item.value || "—"}</p>
            </div>
          ))}
          <div className="col-span-2 md:col-span-4 mt-2 pt-2 border-t border-white/5">
            <p className="text-[7px] font-mono text-white/25 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-warning" /> KEY CATALYST
            </p>
            <p className="text-[10px] font-mono text-white/60">{brief.key_catalyst || "—"}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[8px] font-mono text-white/30">R:R {brief.risk_reward || "—"}</span>
              <span className="text-[8px] font-mono text-white/30">Timeframe: {brief.best_timeframe}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InstrumentsSection({ briefs }: { briefs: InstrumentBrief[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (slug: string) => setExpanded(s => s === slug ? null : slug);

  return (
    <section className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">INSTRUMENT BRIEFINGS — SORTED BY SETUP SCORE</span>
        </div>
        <span className="text-[8px] font-mono text-white/20">Click row to expand</span>
      </div>
      {briefs.length === 0 ? (
        <p className="px-6 py-5 text-[11px] font-mono text-white/30">No instrument briefs generated.</p>
      ) : (
        <div>
          {briefs.map(brief => (
            <InstrumentRow
              key={brief.slug}
              brief={brief}
              expanded={expanded === brief.slug}
              onToggle={() => toggle(brief.slug)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const RANK_COLORS = [
  "from-amber-500/20 to-amber-600/5 border-amber-500/30",
  "from-white/10 to-white/2 border-white/15",
  "from-orange-900/20 to-orange-900/5 border-orange-700/20",
];
const RANK_LABELS = ["#1 SETUP OF THE DAY", "#2 SETUP", "#3 SETUP"];

function TopSetupsSection({ setups }: { setups: TopSetup[] }) {
  if (setups.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-amber-400" />
        <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">TOP SETUPS OF THE DAY</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {setups.slice(0, 3).map((setup, i) => (
          <div key={setup.slug}
            className={cn("bg-gradient-to-br border rounded-xl p-5 space-y-4", RANK_COLORS[i])}>
            <div>
              <p className={cn("text-[8px] font-mono uppercase tracking-widest mb-1",
                i === 0 ? "text-amber-400" : "text-white/30")}>{RANK_LABELS[i]}</p>
              <div className="flex items-center gap-3">
                <p className="text-[16px] font-black font-mono text-white">{setup.display}</p>
                <BiasChip bias={setup.bias} />
              </div>
              <div className="flex items-center gap-3 mt-1">
                <SetupBar score={setup.setup_score} />
                <span className="text-[8px] font-mono text-white/30">{setup.best_timeframe}</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-white/70 italic leading-relaxed border-l-2 border-accent/30 pl-3">
              "{setup.summary}"
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Entry Zone", val: setup.entry_zone, cls: "text-white/70" },
                { label: "R:R",        val: setup.risk_reward, cls: "text-accent font-bold" },
                { label: "Target 1",   val: setup.target_1,    cls: "text-profit" },
                { label: "Target 2",   val: setup.target_2,    cls: "text-profit/70" },
                { label: "Stop",       val: setup.stop,         cls: "text-loss" },
              ].map(item => (
                <div key={item.label} className="bg-black/20 rounded px-2.5 py-2">
                  <p className="text-[7px] font-mono text-white/25 uppercase tracking-widest">{item.label}</p>
                  <p className={cn("text-[10px] font-mono font-bold", item.cls)}>{item.val || "—"}</p>
                </div>
              ))}
            </div>

            {setup.key_catalyst && (
              <div className="flex items-start gap-2 bg-warning/8 border border-warning/15 rounded px-3 py-2">
                <Zap className="w-3 h-3 text-warning shrink-0 mt-0.5" />
                <p className="text-[9px] font-mono text-warning/80 leading-relaxed">{setup.key_catalyst}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RiskRadarSection({ items }: { items: RiskItem[] }) {
  if (items.length === 0) return null;
  const sevBg = {
    HIGH:   "bg-loss/10 border-loss/20",
    MEDIUM: "bg-warning/8 border-warning/15",
    LOW:    "bg-white/5 border-white/10",
  };
  const sevText = { HIGH: "text-loss", MEDIUM: "text-warning", LOW: "text-white/30" };
  const typeIcon: Record<string, React.ReactNode> = {
    EVENT:      <Calendar className="w-3.5 h-3.5" />,
    VOLATILITY: <AlertTriangle className="w-3.5 h-3.5" />,
    SIGNAL:     <Zap className="w-3.5 h-3.5" />,
    MACRO:      <Globe className="w-3.5 h-3.5" />,
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-white/40" />
        <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">RISK RADAR — THINGS TO WATCH TODAY</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className={cn("flex items-start gap-3 border rounded-lg p-4", sevBg[item.severity])}>
            <span className={cn(sevText[item.severity], "shrink-0 mt-0.5")}>
              {typeIcon[item.type] ?? <AlertTriangle className="w-3.5 h-3.5" />}
            </span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[7px] font-mono font-bold uppercase", sevText[item.severity])}>
                  {item.type}
                </span>
                <span className={cn("text-[7px] font-mono uppercase px-1.5 py-0.5 rounded border",
                  sevBg[item.severity], sevText[item.severity])}>
                  {item.severity}
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/60 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function DailyReportClient({ report, isStale, staleDate }: Props) {
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const handlePrint = () => window.print();

  const handleEmail = async () => {
    if (!report) return;
    setEmailLoading(true);
    try {
      await fetch("/api/intelligence/daily-report/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_date: report.report_date }),
      });
      setEmailSent(true);
    } catch {}
    setEmailLoading(false);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
  };

  // Format date
  const reportDateFormatted = report
    ? new Date(report.report_date + "T00:00:00Z").toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "—";
  const genTimeFormatted = report?.generated_at
    ? new Date(report.generated_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC"
    : "—";

  return (
    <div className="min-h-screen bg-[#080808] pb-24 print:bg-white print:text-black">
      {/* Stale banner */}
      {isStale && (
        <div className="bg-warning/15 border-b border-warning/30 px-6 py-3 text-center">
          <p className="text-[10px] font-mono text-warning">
            ⚠ Showing report from {staleDate} — Today's report generates at 06:00 UTC
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <header className="flex items-start justify-between print:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-accent">
                DRAWDOWN INTELLIGENCE
              </span>
              <span className="text-white/20 text-[8px]">·</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-white/30">
                DAILY BRIEFING
              </span>
            </div>
            <h1 className="text-[28px] font-black tracking-tight text-white leading-none">
              {reportDateFormatted}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[9px] font-mono text-white/30">
                Generated {genTimeFormatted}
              </span>
              {!isStale && (
                <span className="flex items-center gap-1 text-[8px] font-mono text-profit bg-profit/10 border border-profit/20 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" /> LIVE
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-white/50 hover:text-white hover:border-white/20 rounded transition-colors">
              <Download className="w-3 h-3" /> PDF
            </button>
            <button onClick={handleEmail} disabled={emailLoading || emailSent}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-white/50 hover:text-white hover:border-white/20 rounded transition-colors disabled:opacity-40">
              <Mail className="w-3 h-3" /> {emailSent ? "Sent ✓" : emailLoading ? "Sending…" : "Email"}
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-white/50 hover:text-white hover:border-white/20 rounded transition-colors">
              <Link2 className="w-3 h-3" /> Share
            </button>
          </div>
        </header>

        {/* ─── No Report ──────────────────────────────────────────────────── */}
        {!report && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
            <p className="text-[11px] font-mono text-white/30">
              No report available yet. Today's briefing generates at 06:00 UTC.
            </p>
          </div>
        )}

        {report && (
          <>
            {/* Section 1: Macro */}
            <div>
              <SectionHeader label="01 · MACRO ENVIRONMENT" />
              <MacroSection data={report.macro_data} narrative={report.macro_narrative} />
            </div>

            {/* Section 2: Events */}
            <div>
              <SectionHeader label="02 · TODAY'S KEY EVENTS" />
              <EventsSection events={report.events_today} />
            </div>

            {/* Section 3: Top Setups */}
            {report.top_setups.length > 0 && (
              <div>
                <SectionHeader label="03 · TOP SETUPS OF THE DAY" />
                <TopSetupsSection setups={report.top_setups} />
              </div>
            )}

            {/* Section 4: Instrument Briefings */}
            <div>
              <SectionHeader label="04 · INSTRUMENT BRIEFINGS" />
              <InstrumentsSection briefs={report.instrument_briefs} />
            </div>

            {/* Section 5: Risk Radar */}
            {report.risk_radar.length > 0 && (
              <div>
                <SectionHeader label="05 · RISK RADAR" />
                <RiskRadarSection items={report.risk_radar} />
              </div>
            )}

            {/* Footer */}
            <footer className="border-t border-white/8 pt-6 mt-8">
              <p className="text-[9px] font-mono text-white/25 leading-relaxed text-center max-w-2xl mx-auto">
                This report was generated by the Drawdown AI Intelligence Engine combining data from{" "}
                <span className="text-white/40">CFTC</span>,{" "}
                <span className="text-white/40">Federal Reserve (FRED)</span>,{" "}
                <span className="text-white/40">Finnhub</span>,{" "}
                <span className="text-white/40">Twelve Data</span>, and{" "}
                <span className="text-white/40">Alpha Vantage</span>, analysed by{" "}
                <span className="text-accent">Claude (Anthropic)</span>,{" "}
                <span className="text-profit">GPT-4.1 (OpenAI)</span>, and{" "}
                <span className="text-blue-400">Gemini 2.5 Flash (Google)</span>.
                <br className="mt-2 block" />
                <strong className="text-white/40">NOT FINANCIAL ADVICE. For educational purposes only.</strong>
              </p>
            </footer>
          </>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; color: black; }
          .bg-\\[\\#080808\\] { background: white; }
          * { color: black !important; border-color: #ddd !important; background: white !important; }
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 print:mt-6">
      <div className="h-px flex-1 bg-white/8" />
      <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/25 shrink-0">{label}</span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}
