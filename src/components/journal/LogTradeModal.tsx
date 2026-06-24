"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronRight, ChevronLeft, Loader2, Download, Upload } from "lucide-react";
import type { TradeEntry, Direction, InstrumentType, Session, EmotionBefore, EmotionDuring, MarketCondition } from "./types";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ─── types ───────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (trade: TradeEntry) => void;
  prefill?: Partial<TradeEntry>;
  accountBalance?: number;
}

type Step = 1 | 2 | 3;

const CONFLUENCE_TAGS = [
  "Above 200 EMA","Below 200 EMA","London Session","NY Session","COT Bullish","COT Bearish",
  "Retail Crowded Short","Retail Crowded Long","High Impact News","ATR Above Average",
  "Prev Day High Break","Pivot Point Bounce","Supply Zone","Demand Zone",
  "Fair Value Gap","Order Block",
];

const MISTAKE_TAGS = [
  "Moved stop loss","Exited early","Didn't follow plan","FOMO entry","Overtraded",
  "Oversized","Revenge trade","Ignored news event","No pre-trade plan","Widened stop",
];

const SETUP_SUGGESTIONS = ["Breakout","Pullback","OB Rejection","FVG Fill","Trendline Break","Support/Resistance","London Open","News Play"];

const EMOTIONS_BEFORE: { value: EmotionBefore; emoji: string; label: string }[] = [
  { value: "CONFIDENT", emoji: "😤", label: "CONFIDENT" },
  { value: "NERVOUS",   emoji: "😰", label: "NERVOUS" },
  { value: "NEUTRAL",   emoji: "😐", label: "NEUTRAL" },
  { value: "FOMO",      emoji: "😱", label: "FOMO" },
  { value: "REVENGE",   emoji: "😡", label: "REVENGE" },
  { value: "BORED",     emoji: "😴", label: "BORED" },
];

const EMOTIONS_DURING: { value: EmotionDuring; label: string }[] = [
  { value: "CALM", label: "CALM" },
  { value: "ANXIOUS", label: "ANXIOUS" },
  { value: "GREEDY", label: "GREEDY" },
  { value: "DISCIPLINED", label: "DISCIPLINED" },
  { value: "PANICKED", label: "PANICKED" },
];

const MARKET_CONDITIONS: { value: MarketCondition; label: string }[] = [
  { value: "TRENDING", label: "TRENDING ↑" },
  { value: "RANGING", label: "RANGING" },
  { value: "VOLATILE", label: "VOLATILE" },
  { value: "QUIET", label: "QUIET" },
];

const SESSIONS: { value: Session; label: string }[] = [
  { value: "LONDON", label: "London" },
  { value: "NEW_YORK", label: "New York" },
  { value: "ASIAN", label: "Asian" },
  { value: "OVERLAP", label: "Overlap" },
  { value: "PRE_MARKET", label: "Pre-Market" },
];

const INSTRUMENTS: { value: InstrumentType; label: string }[] = [
  { value: "forex_major", label: "Forex Major" },
  { value: "forex_minor", label: "Forex Minor" },
  { value: "index", label: "Index" },
  { value: "commodity", label: "Commodity" },
  { value: "crypto", label: "Crypto" },
];

const PROP_FIRMS = ["FTMO","The5ers","MyFundedFX","Apex","FundedNext"];

// ─── helpers ──────────────────────────────────────────────────────────────────
function now8601() {
  const d = new Date();
  return d.toISOString().slice(0, 16);
}

function isoToday() {
  return new Date().toISOString().split("T")[0];
}

function calcSession(dt: string): Session {
  const h = new Date(dt).getUTCHours(), m = new Date(dt).getUTCMinutes();
  const mins = h * 60 + m;
  if (mins >= 8 * 60 && mins < 16 * 60 + 30) return "LONDON";
  if (mins >= 13 * 60 + 30 && mins < 20 * 60) return "NEW_YORK";
  if (mins >= 0 && mins < 9 * 60) return "ASIAN";
  return "PRE_MARKET";
}

// ─── input component ──────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
        {label}{required && <span className="text-[var(--tool-accent-text)] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, readOnly, className }: {
  value: string | number; onChange?: (v: string) => void; type?: string; placeholder?: string; readOnly?: boolean; className?: string;
}) {
  return (
    <input
      type={type} value={value} readOnly={readOnly} placeholder={placeholder}
      onChange={e => onChange?.(e.target.value)}
      className={cn("w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-black bg-white focus:outline-none focus:border-[var(--tool-accent)] focus:ring-1 focus:ring-[var(--tool-accent-border)] transition-all", readOnly && "bg-gray-50 text-gray-500 cursor-default", className)}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} rows={rows} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-black bg-white focus:outline-none focus:border-[var(--tool-accent)] focus:ring-1 focus:ring-[var(--tool-accent-border)] transition-all resize-none" />
  );
}

function Toggle({ value, onChange, options }: { value: string | null; onChange: (v: string) => void; options: { value: string; label: string; color?: string }[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(o => (
        <button key={o.value} type="button"
          onClick={() => onChange(o.value)}
          className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all",
            value === o.value
              ? o.color ? `bg-${o.color}-100 border-${o.color}-300 text-${o.color}-700` : "bg-[var(--tool-accent)] border-[var(--tool-accent)] text-white"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ChipGroup({ selected, options, onToggle, color = "cyan" }: {
  selected: string[]; options: string[]; onToggle: (v: string) => void; color?: "cyan" | "red";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => onToggle(o)}
            className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all",
              active
                ? color === "red" ? "bg-red-100 border-red-300 text-red-700" : "bg-[var(--tool-accent-tint)] border-[var(--tool-accent)] text-[var(--tool-accent-text)]"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300")}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export function LogTradeModal({ open, onClose, onSaved, prefill, accountBalance = 10000 }: Props) {
  const [step, setStep]     = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [customConfluences, setCustomConfluences] = useState<string[]>([]);
  const [customMistakes, setCustomMistakes]       = useState<string[]>([]);
  const [customConfInput, setCustomConfInput]     = useState("");
  const [customMistInput, setCustomMistInput]     = useState("");

  // ── Form state ────────────────────────────────────────────────────────────
  const [f, setF] = useState({
    symbol:             prefill?.symbol ?? "",
    direction:          (prefill?.direction ?? "BUY") as Direction,
    instrument_type:    (prefill?.instrument_type ?? "forex_major") as InstrumentType,
    entry_price:        String(prefill?.entry_price ?? ""),
    stop_loss:          String(prefill?.stop_loss ?? ""),
    take_profit:        String(prefill?.take_profit ?? ""),
    position_size_lots: String(prefill?.position_size_lots ?? ""),
    entry_time:         prefill?.entry_time ? new Date(prefill.entry_time).toISOString().slice(0, 16) : now8601(),
    still_open:         prefill?.status === "OPEN" || !prefill?.exit_price,
    exit_time:          prefill?.exit_time ? new Date(prefill.exit_time).toISOString().slice(0, 16) : "",
    exit_price:         String(prefill?.exit_price ?? ""),
    // Step 2
    setup_type:         prefill?.setup_type ?? "",
    confluences:        prefill?.confluences ?? [] as string[],
    market_conditions:  (prefill?.market_conditions ?? null) as MarketCondition | null,
    emotions_before:    (prefill?.emotions_before ?? null) as EmotionBefore | null,
    pre_trade_notes:    prefill?.pre_trade_notes ?? "",
    rules_followed:     prefill?.rules_followed ?? null as boolean | null,
    checklist_completed: prefill?.checklist_completed ?? false,
    prop_firm:          prefill?.prop_firm ?? "",
    prop_account_id:    prefill?.prop_account_id ?? "",
    prop_phase:         prefill?.prop_phase ?? "",
    session:            (prefill?.session ?? null) as Session | null,
    chart_screenshot_url: prefill?.chart_screenshot_url ?? "",
    // Step 3
    post_trade_notes:   prefill?.post_trade_notes ?? "",
    mistakes:           prefill?.mistakes ?? [] as string[],
    emotions_during:    (prefill?.emotions_during ?? null) as EmotionDuring | null,
  });

  const isOpen = f.still_open;
  const entry  = parseFloat(f.entry_price) || 0;
  const sl     = parseFloat(f.stop_loss) || 0;
  const tp     = parseFloat(f.take_profit) || 0;
  const exit_p = parseFloat(f.exit_price) || 0;
  const lots   = parseFloat(f.position_size_lots) || 0;

  // Auto-calculations
  const rrPlanned = entry && sl && tp
    ? f.direction === "BUY"
      ? (tp - entry) / (entry - sl)
      : (entry - tp) / (sl - entry)
    : null;
  const riskAmount = lots && entry && sl ? lots * Math.abs(entry - sl) * 100000 * 0.0001 : null; // approximate for forex
  const riskPct    = riskAmount ? (riskAmount / accountBalance) * 100 : null;
  const pnlCalc    = !isOpen && exit_p && entry && lots
    ? (f.direction === "BUY" ? exit_p - entry : entry - exit_p) * lots * 100000 * 0.0001
    : null;
  const pipsCalc   = !isOpen && exit_p && entry
    ? Math.abs(exit_p - entry) * 10000
    : null;

  function u(field: string, val: any) { setF(p => ({ ...p, [field]: val })); }
  function toggleChip(field: "confluences" | "mistakes", tag: string) {
    setF(p => ({
      ...p,
      [field]: p[field].includes(tag) ? p[field].filter(t => t !== tag) : [...p[field], tag],
    }));
  }

  // Import from Position Sizer
  function importFromPositionSizer() {
    try {
      const raw = localStorage.getItem("drawdown_position_sizer_last");
      if (!raw) return;
      const data = JSON.parse(raw);
      setF(p => ({
        ...p,
        symbol:             data.instrument ?? p.symbol,
        entry_price:        String(data.entry_price ?? p.entry_price),
        stop_loss:          String(data.stop_loss ?? p.stop_loss),
        take_profit:        String(data.take_profit ?? p.take_profit),
        position_size_lots: String(data.position_size_lots ?? p.position_size_lots),
      }));
    } catch { /* ignore */ }
  }

  // Screenshot upload
  async function handleScreenshot(file: File) {
    setUploadingImg(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("journal-screenshots").upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("journal-screenshots").getPublicUrl(path);
      u("chart_screenshot_url", data.publicUrl);
      setImgPreview(URL.createObjectURL(file));
    } catch (e: any) { setError("Screenshot upload failed: " + e.message); }
    finally { setUploadingImg(false); }
  }

  // Save
  async function handleSave() {
    if (!f.symbol || !f.entry_price || !f.stop_loss || !f.position_size_lots) {
      setError("Symbol, entry price, stop loss and position size are required.");
      return;
    }
    setSaving(true); setError(null);
    try {
      const tradingDay = f.entry_time.split("T")[0];
      const session    = f.session ?? calcSession(f.entry_time + ":00Z");

      // RR achieved
      const rrAchieved = pnlCalc != null && riskAmount ? pnlCalc / riskAmount : null;

      const body = {
        symbol:             f.symbol.toUpperCase().trim(),
        instrument_type:    f.instrument_type,
        direction:          f.direction,
        status:             isOpen ? "OPEN" : "CLOSED",
        entry_price:        entry,
        exit_price:         isOpen ? null : exit_p || null,
        stop_loss:          sl,
        take_profit:        tp || null,
        position_size_lots: lots,
        risk_amount:        riskAmount,
        risk_percent:       riskPct,
        rr_planned:         rrPlanned,
        rr_achieved:        rrAchieved,
        pnl_amount:         pnlCalc,
        pips_gained:        pipsCalc,
        entry_time:         new Date(f.entry_time).toISOString(),
        exit_time:          !isOpen && f.exit_time ? new Date(f.exit_time).toISOString() : null,
        session,
        trading_day:        tradingDay,
        duration_minutes:   !isOpen && f.exit_time
          ? Math.round((new Date(f.exit_time).getTime() - new Date(f.entry_time).getTime()) / 60000)
          : null,
        setup_type:         f.setup_type || null,
        confluences:        [...f.confluences, ...customConfluences].filter(Boolean),
        mistakes:           !isOpen ? [...f.mistakes, ...customMistakes].filter(Boolean) : null,
        emotions_before:    f.emotions_before,
        emotions_during:    !isOpen ? f.emotions_during : null,
        market_conditions:  f.market_conditions,
        pre_trade_notes:    f.pre_trade_notes || null,
        post_trade_notes:   !isOpen ? f.post_trade_notes || null : null,
        rules_followed:     f.rules_followed,
        checklist_completed: f.checklist_completed,
        chart_screenshot_url: f.chart_screenshot_url || null,
        prop_firm:          f.prop_firm || null,
        prop_account_id:    f.prop_account_id || null,
        prop_phase:         f.prop_phase || null,
      };

      const res = await fetch("/api/journal/trade-entries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      const { trade } = await res.json();

      // Trigger AI verdict async (fire and forget)
      if (trade.status === "CLOSED") {
        fetch("/api/journal/ai-verdict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trade_id: trade.id, trade, recent_trades: [] }),
        }).catch(() => {});
      }

      onSaved(trade);
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  if (!open) return null;

  const stepLabels: Record<Step, string> = { 1: "THE TRADE", 2: "CONTEXT", 3: "REFLECTION" };
  const allSteps: Step[] = isOpen ? [1, 2] : [1, 2, 3];
  const canAdvance = step === 1 ? !!(f.symbol && f.entry_price && f.stop_loss && f.position_size_lots) : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--tool-accent-text)] mb-1">AI_JOURNAL // LOG TRADE</p>
            <h2 className="text-xl font-black text-black">
              {prefill ? "Edit" : "Log"} Trade
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 px-6 py-4 border-b border-gray-100 shrink-0">
          {allSteps.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => step > s && setStep(s)}
                className={cn("flex items-center gap-2 group",
                  step > s ? "cursor-pointer" : "cursor-default")}
              >
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all",
                  step === s ? "bg-[var(--tool-accent)] text-white" :
                  step > s ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400")}>
                  {step > s ? "✓" : s}
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-wider hidden sm:block",
                  step === s ? "text-black" : "text-gray-400")}>{stepLabels[s]}</span>
              </button>
              {i < allSteps.length - 1 && <div className="flex-1 mx-3 h-px bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── STEP 1: THE TRADE ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex justify-end">
                <button type="button" onClick={importFromPositionSizer}
                  className="text-[10px] font-bold text-[var(--tool-accent-text)] border border-[var(--tool-accent-border)] px-3 py-1.5 rounded-lg hover:bg-[var(--tool-accent-tint)] transition-all flex items-center gap-1">
                  <Download className="w-3 h-3" /> Import from Position Sizer
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Symbol" required>
                  <Input value={f.symbol} onChange={v => u("symbol", v.toUpperCase())} placeholder="GBPUSD" />
                </Field>
                <Field label="Direction" required>
                  <div className="flex gap-2">
                    {(["BUY","SELL"] as Direction[]).map(d => (
                      <button key={d} type="button" onClick={() => u("direction", d)}
                        className={cn("flex-1 py-2 rounded-lg text-[11px] font-black uppercase border transition-all",
                          f.direction === d
                            ? d === "BUY" ? "bg-green-500 border-green-500 text-white" : "bg-red-500 border-red-500 text-white"
                            : "bg-white border-gray-200 text-gray-400 hover:border-gray-300")}>
                        {d}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Instrument Type">
                  <select value={f.instrument_type} onChange={e => u("instrument_type", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-black bg-white focus:outline-none focus:border-[var(--tool-accent)]">
                    {INSTRUMENTS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Entry Price" required>
                  <Input type="number" value={f.entry_price} onChange={v => u("entry_price", v)} placeholder="1.32283" />
                </Field>
                <Field label="Stop Loss" required>
                  <Input type="number" value={f.stop_loss} onChange={v => u("stop_loss", v)} placeholder="1.31800" />
                </Field>
                <Field label="Take Profit">
                  <Input type="number" value={f.take_profit} onChange={v => u("take_profit", v)} placeholder="1.33100" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Position Size (lots)" required>
                  <Input type="number" value={f.position_size_lots} onChange={v => u("position_size_lots", v)} placeholder="0.10" />
                </Field>
                <Field label="Risk % (auto)">
                  <Input value={riskPct != null ? riskPct.toFixed(2) + "%" : ""} readOnly placeholder="auto" />
                </Field>
                <Field label="Risk Amount (auto)">
                  <Input value={riskAmount != null ? "£" + riskAmount.toFixed(2) : ""} readOnly placeholder="auto" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Entry Date & Time" required>
                  <Input type="datetime-local" value={f.entry_time} onChange={v => u("entry_time", v)} />
                </Field>
                <Field label="Session">
                  <select value={f.session ?? ""} onChange={e => u("session", e.target.value || null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-black bg-white focus:outline-none focus:border-[var(--tool-accent)]">
                    <option value="">Auto-detect</option>
                    {SESSIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={f.still_open} onChange={e => u("still_open", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[var(--tool-accent)]" />
                  <span className="text-sm font-bold text-gray-700">Still Open (no exit yet)</span>
                </label>
              </div>

              {!isOpen && (
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Exit Date & Time">
                    <Input type="datetime-local" value={f.exit_time} onChange={v => u("exit_time", v)} />
                  </Field>
                  <Field label="Exit Price">
                    <Input type="number" value={f.exit_price} onChange={v => u("exit_price", v)} placeholder="1.32840" />
                  </Field>
                  <Field label="Est. P&L (auto)">
                    <Input value={pnlCalc != null ? (pnlCalc >= 0 ? "+£" : "-£") + Math.abs(pnlCalc).toFixed(2) : ""} readOnly placeholder="auto" className={pnlCalc != null ? pnlCalc >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold" : ""} />
                  </Field>
                </div>
              )}

              {/* Calculated summary */}
              {(rrPlanned != null || riskAmount != null) && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {rrPlanned != null && <div><p className="text-[9px] text-gray-400 uppercase tracking-widest">RR Planned</p><p className="font-black text-black">{rrPlanned.toFixed(2)}:1</p></div>}
                  {riskAmount != null && <div><p className="text-[9px] text-gray-400 uppercase tracking-widest">Risk Amount</p><p className="font-black text-black">£{riskAmount.toFixed(2)}</p></div>}
                  {riskPct != null && <div><p className="text-[9px] text-gray-400 uppercase tracking-widest">Risk %</p><p className="font-black text-black">{riskPct.toFixed(2)}%</p></div>}
                  {rrPlanned != null && riskAmount != null && <div><p className="text-[9px] text-gray-400 uppercase tracking-widest">Est. Profit</p><p className="font-black text-green-600">+£{(riskAmount * rrPlanned).toFixed(2)}</p></div>}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: CONTEXT ── */}
          {step === 2 && (
            <div className="space-y-5">
              <Field label="Setup Type">
                <div className="space-y-2">
                  <Input value={f.setup_type} onChange={v => u("setup_type", v)} placeholder="e.g. Breakout, Pullback..." />
                  <div className="flex flex-wrap gap-1.5">
                    {SETUP_SUGGESTIONS.map(s => (
                      <button key={s} type="button" onClick={() => u("setup_type", s)}
                        className="text-[10px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-[var(--tool-accent-border)] hover:text-[var(--tool-accent-text)] transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>

              <Field label="Confluences (select all that apply)">
                <ChipGroup
                  selected={f.confluences}
                  options={[...CONFLUENCE_TAGS, ...customConfluences]}
                  onToggle={tag => toggleChip("confluences", tag)}
                />
                <div className="flex gap-2 mt-2">
                  <Input value={customConfInput} onChange={setCustomConfInput} placeholder="+ Add custom..." className="text-xs" />
                  <button type="button" onClick={() => { if (customConfInput.trim()) { setCustomConfluences(p => [...p, customConfInput.trim()]); setCustomConfInput(""); } }}
                    className="px-3 py-1.5 bg-[var(--tool-accent-tint)] text-[var(--tool-accent-text)] text-[10px] font-bold rounded-lg border border-[var(--tool-accent-border)] hover:bg-[var(--tool-accent-border)] transition-all shrink-0">
                    Add
                  </button>
                </div>
              </Field>

              <Field label="Market Conditions">
                <Toggle value={f.market_conditions}
                  onChange={v => u("market_conditions", v)}
                  options={MARKET_CONDITIONS.map(m => ({ value: m.value, label: m.label }))} />
              </Field>

              <Field label="Emotion Before Trade (required)" required>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS_BEFORE.map(e => (
                    <button key={e.value} type="button" onClick={() => u("emotions_before", e.value)}
                      className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all",
                        f.emotions_before === e.value ? "bg-[var(--tool-accent-tint)] border-[var(--tool-accent)] text-[var(--tool-accent-text)] font-semibold" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300")}>
                      <span>{e.emoji}</span> {e.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Pre-Trade Notes — Why are you taking this trade?">
                <Textarea value={f.pre_trade_notes} onChange={v => u("pre_trade_notes", v)} placeholder="Describe your trade rationale, the setup you see, and your plan..." rows={3} />
              </Field>

              <Field label="Chart Screenshot (optional)">
                <div className={cn("border-2 border-dashed rounded-xl p-6 text-center transition-all", imgPreview ? "border-[var(--tool-accent-border)] bg-[var(--tool-accent-tint)]" : "border-gray-200 hover:border-gray-300")}>
                  {imgPreview ? (
                    <div className="space-y-2">
                      <img src={imgPreview} alt="screenshot" className="max-h-32 mx-auto rounded-lg object-cover" />
                      <p className="text-[10px] text-gray-500">Screenshot attached</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-gray-300" />
                      <p className="text-xs text-gray-400">Drag & drop or <span className="text-[var(--tool-accent-text)] font-bold">browse</span></p>
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleScreenshot(e.target.files[0])} />
                    </label>
                  )}
                  {uploadingImg && <Loader2 className="w-4 h-4 animate-spin text-[var(--tool-accent-text)] mx-auto mt-2" />}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Rules Followed">
                  <Toggle value={f.rules_followed === null ? null : f.rules_followed ? "yes" : "no"}
                    onChange={v => u("rules_followed", v === "yes")}
                    options={[{ value: "yes", label: "✅ YES" }, { value: "no", label: "❌ NO" }]} />
                </Field>
                <Field label="Checklist Completed">
                  <Toggle value={f.checklist_completed ? "yes" : "no"}
                    onChange={v => u("checklist_completed", v === "yes")}
                    options={[{ value: "yes", label: "✅ YES" }, { value: "no", label: "❌ NO" }]} />
                </Field>
              </div>

              <Field label="Prop Firm (optional)">
                <div className="grid grid-cols-3 gap-2">
                  <select value={f.prop_firm} onChange={e => u("prop_firm", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[var(--tool-accent)]">
                    <option value="">None</option>
                    {PROP_FIRMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {f.prop_firm && <>
                    <Input value={f.prop_account_id} onChange={v => u("prop_account_id", v)} placeholder="Account ID" />
                    <select value={f.prop_phase} onChange={e => u("prop_phase", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[var(--tool-accent)]">
                      <option value="">Phase...</option>
                      <option>CHALLENGE</option><option>FUNDED</option><option>SCALING</option>
                    </select>
                  </>}
                </div>
              </Field>
            </div>
          )}

          {/* ── STEP 3: REFLECTION ── */}
          {step === 3 && !isOpen && (
            <div className="space-y-5">
              <Field label="Post-Trade Notes — What happened? What did you learn?">
                <Textarea value={f.post_trade_notes} onChange={v => u("post_trade_notes", v)} placeholder="Describe what the market did, what you did, and the key lesson..." rows={4} />
              </Field>

              <Field label="Mistakes Made (select all that apply)">
                <ChipGroup
                  selected={f.mistakes}
                  options={[...MISTAKE_TAGS, ...customMistakes]}
                  onToggle={tag => toggleChip("mistakes", tag)}
                  color="red"
                />
                <div className="flex gap-2 mt-2">
                  <Input value={customMistInput} onChange={setCustomMistInput} placeholder="+ Add custom mistake..." className="text-xs" />
                  <button type="button" onClick={() => { if (customMistInput.trim()) { setCustomMistakes(p => [...p, customMistInput.trim()]); setCustomMistInput(""); } }}
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-all shrink-0">
                    Add
                  </button>
                </div>
              </Field>

              <Field label="Emotion During Trade">
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS_DURING.map(e => (
                    <button key={e.value} type="button" onClick={() => u("emotions_during", e.value)}
                      className={cn("px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all",
                        f.emotions_during === e.value ? "bg-[var(--tool-accent-tint)] border-[var(--tool-accent)] text-[var(--tool-accent-text)] font-semibold" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300")}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {error && <p className="mt-4 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button type="button" onClick={() => step > 1 ? setStep((step - 1) as Step) : onClose()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-bold">
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex items-center gap-3">
            {/* Skip to save on step 2 for open trades */}
            {step === 2 && isOpen && (
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--tool-accent)] hover:bg-[var(--tool-accent-hover)] text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Open Trade
              </button>
            )}
            {step < (allSteps[allSteps.length - 1]) && !(step === 2 && isOpen) && (
              <button type="button" onClick={() => canAdvance && setStep((step + 1) as Step)} disabled={!canAdvance}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-900 transition-all disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {step === allSteps[allSteps.length - 1] && !isOpen && (
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--tool-accent)] hover:bg-[var(--tool-accent-hover)] text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Trade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
