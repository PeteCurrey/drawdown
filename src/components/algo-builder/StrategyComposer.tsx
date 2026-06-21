"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronUp, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StrategyConfig, DEFAULT_CONFIG, OutputLanguage, RiskModel, StopType,
  TakeProfitType, InstrumentType, Timeframe, SessionFilter, BrokerBridge,
  PartialExit,
} from "@/types/algo-builder";

// ─── Design tokens (chartreuse theme) ─────────────────────────────────────────
const C = "#C8F135";   // chartreuse accent

// ─── Subcomponents ────────────────────────────────────────────────────────────

function SectionHeader({
  number, title, isOpen, onToggle,
}: { number: string; title: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
      style={{ backgroundColor: "#111", minHeight: 44 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono font-bold" style={{ color: C }}>
          {number}
        </span>
        <span className="text-[11px] font-display font-bold uppercase tracking-widest text-text-primary">
          {title}
        </span>
      </div>
      {isOpen
        ? <ChevronUp className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
        : <ChevronDown className="w-3.5 h-3.5 text-text-tertiary shrink-0" />}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-sans uppercase tracking-widest text-text-tertiary block mb-1.5">
      {children}
    </label>
  );
}

function DarkInput({
  className, ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2.5 text-sm font-mono text-text-primary outline-none transition-colors",
        className,
      )}
      style={{
        backgroundColor: "#0D0D0D",
        border: "1px solid #2A2A2A",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = C; }}
      onBlur={e =>  { e.currentTarget.style.borderColor = "#2A2A2A"; }}
      {...props}
    />
  );
}

function DarkSelect({
  className, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full px-3 py-2.5 text-sm font-mono text-text-primary outline-none transition-colors appearance-none",
        className,
      )}
      style={{ backgroundColor: "#0D0D0D", border: "1px solid #2A2A2A" }}
      {...props}
    />
  );
}

type PillValue = string;
function Pill({
  label, active, onToggle,
}: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all"
      style={
        active
          ? { backgroundColor: C, color: "#000", border: `1px solid ${C}` }
          : { backgroundColor: "#1A1A1A", color: "#888", border: "1px solid #333" }
      }
    >
      {label}
    </button>
  );
}

function RadioOption({
  label, sub, active, onSelect,
}: { label: string; sub?: string; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-start gap-2.5 p-3 w-full text-left transition-all"
      style={{
        backgroundColor: active ? `${C}10` : "#0D0D0D",
        border: `1px solid ${active ? C : "#2A2A2A"}`,
      }}
    >
      <div
        className="w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center"
        style={{ borderColor: active ? C : "#555" }}
      >
        {active && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C }} />}
      </div>
      <div>
        <p className="text-[11px] font-mono font-bold text-text-primary">{label}</p>
        {sub && <p className="text-[9px] font-mono text-text-tertiary mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className="relative w-9 h-5 transition-colors shrink-0"
        style={{
          backgroundColor: checked ? C : "#2A2A2A",
          borderRadius: 10,
        }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="absolute top-0.5 w-4 h-4 bg-black rounded-full transition-all"
          style={{ left: checked ? "calc(100% - 18px)" : 2 }}
        />
      </div>
      <span className="text-[11px] font-mono text-text-secondary group-hover:text-text-primary transition-colors">
        {label}
      </span>
    </label>
  );
}

// ─── Example strategy quick-fills ─────────────────────────────────────────────
const EXAMPLES: { label: string; config: Partial<StrategyConfig> }[] = [
  {
    label: "EMA/SMA Trend Follow",
    config: {
      description: "Enter long when the 20 EMA crosses above the 50 SMA on the 15-minute chart and RSI(14) is below 50. Exit on the opposite crossover or when RSI exceeds 70. Use a 1.5× ATR stop loss. Risk 1% per trade. Only trade during London and New York sessions.",
      instrumentType: "forex",
      instrument: "GBPUSD",
      timeframe: "15m",
      useConfirmationTF: true,
      confirmationTimeframe: "1H",
      sessions: ["london", "newyork"],
      riskModel: "fixed_pct",
      riskPct: 1,
      stopType: "atr_trailing",
      takeProfitType: "fixed_rr",
      rrRatio: 2,
    },
  },
  {
    label: "VWAP Mean Reversion",
    config: {
      description: "Enter long when price dips below the lower VWAP band (1.5× ATR distance) on the 5-minute chart and then closes back above it, with RSI(14) below 40 confirming oversold. Exit when price touches the upper VWAP band or after hitting the 1.5R profit target. Only trade during the London–New York overlap (13:00–17:00 UTC).",
      instrumentType: "indices",
      instrument: "NAS100",
      timeframe: "5m",
      useConfirmationTF: false,
      sessions: ["newyork"],
      riskModel: "atr_based",
      atrMultiplier: 1,
      stopType: "atr_trailing",
      takeProfitType: "fixed_rr",
      rrRatio: 1.5,
    },
  },
  {
    label: "ICT Smart Money",
    config: {
      description: "At the London session open (8:00 AM GMT), identify the Asian session high and low. Enter long on a 50% retracement into a bullish Order Block with a bullish Fair Value Gap on the 15-minute chart. Stop loss below the Order Block low. Take 50% profit at 2R, let the remaining 50% run to 3R with a trailing stop. Risk 0.5% per trade. Only trade GBPUSD and EURUSD.",
      instrumentType: "forex",
      instrument: "GBPUSD",
      timeframe: "15m",
      useConfirmationTF: true,
      confirmationTimeframe: "1H",
      sessions: ["london"],
      riskModel: "fixed_pct",
      riskPct: 0.5,
      stopType: "structure",
      takeProfitType: "partial",
      partialExits: [{ rr: 2, pct: 50 }, { rr: 3, pct: 50 }],
    },
  },
];

// ─── Main StrategyComposer ────────────────────────────────────────────────────

interface StrategyComposerProps {
  config: StrategyConfig;
  onChange: (c: StrategyConfig) => void;
}

export function StrategyComposer({ config, onChange }: StrategyComposerProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    s1: true, s2: false, s3: false, s4: false,
  });
  const [draftSaved, setDraftSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("drawdown_algo_draft");
      if (raw) {
        const saved = JSON.parse(raw) as StrategyConfig;
        onChange({ ...DEFAULT_CONFIG, ...saved });
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save to localStorage
  const persist = useCallback((c: StrategyConfig) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem("drawdown_algo_draft", JSON.stringify(c));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);
  }, []);

  function update(patch: Partial<StrategyConfig>) {
    const next = { ...config, ...patch };
    onChange(next);
    persist(next);
  }

  function toggleSection(id: string) {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // Kelly auto-calc
  useEffect(() => {
    if (config.riskModel !== "kelly") return;
    const { kellyWinRate: wr, kellyRR: rr } = config;
    const p = wr / 100;
    const q = 1 - p;
    const raw = (p * rr - q) / rr;
    const half = Math.max(0, raw / 2);
    if (Math.abs(half - config.kellyFraction) > 0.001) {
      update({ kellyFraction: parseFloat(half.toFixed(4)) });
    }
  }, [config.kellyWinRate, config.kellyRR, config.riskModel]); // eslint-disable-line

  function applyExample(ex: Partial<StrategyConfig>) {
    const next = { ...config, ...ex };
    onChange(next);
    persist(next);
    // Open sections relevant to filled data
    setOpen({ s1: true, s2: true, s3: true, s4: false });
  }

  function clearDraft() {
    localStorage.removeItem("drawdown_algo_draft");
    onChange({ ...DEFAULT_CONFIG });
    setOpen({ s1: true, s2: false, s3: false, s4: false });
  }

  const charCount = config.description.length;
  const MAX_CHARS = 2000;

  const TFS: Timeframe[] = ["1m", "5m", "15m", "1H", "4H", "D", "W"];

  return (
    <div className="flex flex-col" style={{ backgroundColor: "#0A0A0A" }}>

      {/* Draft indicator */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "#1A1A1A" }}>
        <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
          Strategy Composer
        </span>
        <div className="flex items-center gap-3">
          {draftSaved && (
            <span className="text-[9px] font-mono" style={{ color: C }}>
              ✓ Draft saved
            </span>
          )}
          <button
            type="button"
            onClick={clearDraft}
            className="flex items-center gap-1 text-[9px] font-mono text-text-tertiary hover:text-text-secondary transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* ── SECTION 1: Strategy Description ─────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #1A1A1A" }}>
        <SectionHeader
          number="01"
          title="Strategy Description"
          isOpen={open.s1}
          onToggle={() => toggleSection("s1")}
        />
        {open.s1 && (
          <div
            className="px-4 pb-5 pt-1 space-y-4"
            style={{ borderLeft: `2px solid ${C}`, background: `${C}04` }}
          >
            {/* Example buttons */}
            <div className="space-y-1.5">
              <Label>Quick-fill examples</Label>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => applyExample(ex.config)}
                    className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all hover:bg-[#C8F135]/10"
                    style={{ border: `1px solid ${C}`, color: C }}
                  >
                    <Zap className="w-2.5 h-2.5 inline mr-1" />
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label>Describe your strategy in plain English</Label>
                <span
                  className={cn("text-[9px] font-mono transition-colors", charCount > MAX_CHARS * 0.9 ? "text-amber-500" : "text-text-tertiary")}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              <textarea
                value={config.description}
                onChange={e => update({ description: e.target.value.slice(0, MAX_CHARS) })}
                rows={7}
                placeholder={'e.g. Enter long when the 20 EMA crosses above the 50 SMA on the 15-minute chart, and RSI(14) is below 50. Exit on opposite crossover or after a 2% stop loss. Risk 1% per trade.'}
                className="w-full px-3 py-2.5 text-sm font-mono text-text-primary outline-none resize-none transition-colors leading-relaxed"
                style={{ backgroundColor: "#0D0D0D", border: "1px solid #2A2A2A" }}
                onFocus={e => { e.currentTarget.style.borderColor = C; }}
                onBlur={e =>  { e.currentTarget.style.borderColor = "#2A2A2A"; }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: Instrument & Timeframe ───────────────────────────── */}
      <div style={{ borderBottom: "1px solid #1A1A1A" }}>
        <SectionHeader
          number="02"
          title="Instrument & Timeframe"
          isOpen={open.s2}
          onToggle={() => toggleSection("s2")}
        />
        {open.s2 && (
          <div
            className="px-4 pb-5 pt-1 space-y-5"
            style={{ borderLeft: `2px solid ${C}`, background: `${C}04` }}
          >
            {/* Instrument type pills */}
            <div>
              <Label>Instrument Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {(["forex","indices","crypto","equities","futures"] as InstrumentType[]).map(t => (
                  <Pill key={t} label={t.toUpperCase()} active={config.instrumentType === t} onToggle={() => update({ instrumentType: t })} />
                ))}
              </div>
            </div>

            {/* Symbol input */}
            <div>
              <Label>Instrument Symbol</Label>
              <DarkInput
                value={config.instrument}
                onChange={e => update({ instrument: e.target.value.toUpperCase() })}
                placeholder="e.g. GBPUSD, NAS100, BTCUSDT"
              />
              <p className="text-[9px] font-mono text-text-tertiary mt-1">
                {config.instrumentType === "forex" && "Use format: EURUSD, GBPUSD, USDJPY"}
                {config.instrumentType === "indices" && "Use: NAS100, SPX500, US30, UK100"}
                {config.instrumentType === "crypto" && "Use: BTCUSD, ETHUSD"}
                {config.instrumentType === "equities" && "Use: AAPL, TSLA, GOOGL"}
                {config.instrumentType === "futures" && "Use exchange-specific notation"}
              </p>
            </div>

            {/* Timeframe grid */}
            <div>
              <Label>Primary Timeframe</Label>
              <div className="flex flex-wrap gap-1.5">
                {TFS.map(tf => (
                  <Pill key={tf} label={tf} active={config.timeframe === tf} onToggle={() => update({ timeframe: tf })} />
                ))}
              </div>
            </div>

            {/* Multi-TF toggle */}
            <div>
              <Toggle
                checked={config.useConfirmationTF}
                onChange={v => update({ useConfirmationTF: v })}
                label="Add confirmation timeframe"
              />
              {config.useConfirmationTF && (
                <div className="mt-3 pl-4 border-l-2" style={{ borderColor: `${C}40` }}>
                  <Label>Confirmation Timeframe</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {TFS.filter(tf => tf !== config.timeframe).map(tf => (
                      <Pill
                        key={tf}
                        label={tf}
                        active={config.confirmationTimeframe === tf}
                        onToggle={() => update({ confirmationTimeframe: tf })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Session filter */}
            <div>
              <Label>Market Session Filter</Label>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { id: "all",     label: "All Sessions" },
                  { id: "london",  label: "London" },
                  { id: "newyork", label: "New York" },
                  { id: "asian",   label: "Asian" },
                ] as { id: SessionFilter; label: string }[]).map(s => (
                  <Pill
                    key={s.id}
                    label={s.label}
                    active={config.sessions.includes(s.id)}
                    onToggle={() => {
                      if (s.id === "all") {
                        update({ sessions: ["all"] });
                      } else {
                        const next = config.sessions.filter(x => x !== "all");
                        update({
                          sessions: next.includes(s.id)
                            ? next.filter(x => x !== s.id).length ? next.filter(x => x !== s.id) : ["all"]
                            : [...next, s.id],
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 3: Risk & Position Sizing ───────────────────────────── */}
      <div style={{ borderBottom: "1px solid #1A1A1A" }}>
        <SectionHeader
          number="03"
          title="Risk & Position Sizing"
          isOpen={open.s3}
          onToggle={() => toggleSection("s3")}
        />
        {open.s3 && (
          <div
            className="px-4 pb-5 pt-1 space-y-5"
            style={{ borderLeft: `2px solid ${C}`, background: `${C}04` }}
          >
            {/* Risk model radio */}
            <div>
              <Label>Risk Model</Label>
              <div className="grid grid-cols-1 gap-1.5">
                <RadioOption
                  label="Fixed Percentage"
                  sub="Risk a fixed % of account equity per trade"
                  active={config.riskModel === "fixed_pct"}
                  onSelect={() => update({ riskModel: "fixed_pct" })}
                />
                {config.riskModel === "fixed_pct" && (
                  <div className="pl-7 flex items-center gap-2">
                    <DarkInput
                      type="number" min="0.1" max="5" step="0.1"
                      value={config.riskPct}
                      onChange={e => update({ riskPct: parseFloat(e.target.value) || 1 })}
                      className="w-24"
                    />
                    <span className="text-xs font-mono text-text-tertiary">% per trade</span>
                    {config.riskPct > 2 && (
                      <span className="text-[9px] font-mono text-amber-500">⚠ Above 2% is high risk</span>
                    )}
                  </div>
                )}

                <RadioOption
                  label="ATR-Based Stop"
                  sub="Stop loss = N × ATR(period)"
                  active={config.riskModel === "atr_based"}
                  onSelect={() => update({ riskModel: "atr_based" })}
                />
                {config.riskModel === "atr_based" && (
                  <div className="pl-7 grid grid-cols-2 gap-2">
                    <div>
                      <Label>ATR Multiplier</Label>
                      <DarkInput type="number" step="0.5" min="0.5" max="5"
                        value={config.atrMultiplier}
                        onChange={e => update({ atrMultiplier: parseFloat(e.target.value) || 1.5 })}
                      />
                    </div>
                    <div>
                      <Label>ATR Period</Label>
                      <DarkInput type="number" step="1" min="5" max="50"
                        value={config.atrPeriod}
                        onChange={e => update({ atrPeriod: parseInt(e.target.value) || 14 })}
                      />
                    </div>
                  </div>
                )}

                <RadioOption
                  label="Kelly Criterion"
                  sub="Optimal position size based on your edge"
                  active={config.riskModel === "kelly"}
                  onSelect={() => update({ riskModel: "kelly" })}
                />
                {config.riskModel === "kelly" && (
                  <div className="pl-7 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Win Rate %</Label>
                        <DarkInput type="number" min="10" max="90" step="1"
                          value={config.kellyWinRate}
                          onChange={e => update({ kellyWinRate: parseFloat(e.target.value) || 50 })}
                        />
                      </div>
                      <div>
                        <Label>Avg R:R Ratio</Label>
                        <DarkInput type="number" min="0.5" max="10" step="0.5"
                          value={config.kellyRR}
                          onChange={e => update({ kellyRR: parseFloat(e.target.value) || 2 })}
                        />
                      </div>
                    </div>
                    {config.kellyFraction > 0 ? (
                      <div className="p-2.5" style={{ backgroundColor: `${C}10`, border: `1px solid ${C}30` }}>
                        <p className="text-[10px] font-mono">
                          <span className="text-text-tertiary">Half-Kelly fraction: </span>
                          <span className="font-bold" style={{ color: C }}>{(config.kellyFraction * 100).toFixed(2)}%</span>
                          <span className="text-text-tertiary ml-3">Full Kelly: {(config.kellyFraction * 200).toFixed(2)}%</span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-[9px] font-mono text-red-400">
                        Negative edge at these stats — no mathematical advantage.
                      </p>
                    )}
                  </div>
                )}

                <RadioOption
                  label="Fixed Lot Size"
                  sub="Fixed contract/lot size per trade"
                  active={config.riskModel === "fixed_lot"}
                  onSelect={() => update({ riskModel: "fixed_lot" })}
                />
                {config.riskModel === "fixed_lot" && (
                  <div className="pl-7 flex items-center gap-2">
                    <DarkInput type="number" min="0.01" max="100" step="0.01"
                      value={config.fixedLotSize}
                      onChange={e => update({ fixedLotSize: parseFloat(e.target.value) || 0.1 })}
                      className="w-28"
                    />
                    <span className="text-xs font-mono text-text-tertiary">lots / contracts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stop loss type */}
            <div>
              <Label>Stop Loss Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { id: "fixed_pips",    label: "Fixed Pips/Points" },
                  { id: "atr_trailing",  label: "ATR Trailing" },
                  { id: "structure",     label: "Structure-Based" },
                ] as { id: StopType; label: string }[]).map(s => (
                  <Pill key={s.id} label={s.label} active={config.stopType === s.id}
                    onToggle={() => update({ stopType: s.id })} />
                ))}
              </div>
              {config.stopType === "fixed_pips" && (
                <div className="mt-2 flex items-center gap-2">
                  <DarkInput type="number" min="1" max="500" value={config.stopPips}
                    onChange={e => update({ stopPips: parseInt(e.target.value) || 50 })}
                    className="w-24"
                  />
                  <span className="text-xs font-mono text-text-tertiary">pips / points</span>
                </div>
              )}
              {config.stopType === "structure" && (
                <p className="text-[9px] font-mono text-text-tertiary mt-1.5">
                  AI will place stop below/above the nearest structural high/low.
                </p>
              )}
            </div>

            {/* Take profit */}
            <div>
              <Label>Take Profit</Label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {([
                  { id: "fixed_rr", label: "Fixed R:R Ratio" },
                  { id: "partial",  label: "Partial Exits" },
                ] as { id: TakeProfitType; label: string }[]).map(t => (
                  <Pill key={t.id} label={t.label} active={config.takeProfitType === t.id}
                    onToggle={() => update({ takeProfitType: t.id })} />
                ))}
              </div>

              {config.takeProfitType === "fixed_rr" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-tertiary">TP at</span>
                  <DarkInput type="number" min="0.5" max="10" step="0.5"
                    value={config.rrRatio}
                    onChange={e => update({ rrRatio: parseFloat(e.target.value) || 2 })}
                    className="w-24"
                  />
                  <span className="text-xs font-mono text-text-tertiary">R</span>
                </div>
              )}

              {config.takeProfitType === "partial" && (
                <div className="space-y-2">
                  {config.partialExits.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-text-tertiary w-6">TP{i+1}</span>
                      <span className="text-[9px] font-mono text-text-tertiary">Close</span>
                      <DarkInput type="number" min="10" max="100" step="10"
                        value={ex.pct}
                        onChange={e => {
                          const exits = [...config.partialExits];
                          exits[i] = { ...exits[i], pct: parseInt(e.target.value) || 50 };
                          update({ partialExits: exits });
                        }}
                        className="w-20"
                      />
                      <span className="text-[9px] font-mono text-text-tertiary">% at</span>
                      <DarkInput type="number" min="0.5" max="10" step="0.5"
                        value={ex.rr}
                        onChange={e => {
                          const exits = [...config.partialExits];
                          exits[i] = { ...exits[i], rr: parseFloat(e.target.value) || 1.5 };
                          update({ partialExits: exits });
                        }}
                        className="w-20"
                      />
                      <span className="text-[9px] font-mono text-text-tertiary">R</span>
                      {config.partialExits.length > 1 && (
                        <button onClick={() => {
                          update({ partialExits: config.partialExits.filter((_, j) => j !== i) });
                        }} className="text-text-tertiary hover:text-red-400 text-xs ml-1">✕</button>
                      )}
                    </div>
                  ))}
                  {config.partialExits.length < 3 && (
                    <button
                      type="button"
                      onClick={() => update({ partialExits: [...config.partialExits, { rr: 3, pct: 50 }] })}
                      className="text-[9px] font-mono text-text-tertiary hover:text-text-primary transition-colors"
                      style={{ color: C }}
                    >
                      + Add exit level
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Circuit breaker */}
            <div className="space-y-2">
              <Toggle
                checked={config.useMaxDailyLoss}
                onChange={v => update({ useMaxDailyLoss: v })}
                label="Daily loss circuit breaker"
              />
              {config.useMaxDailyLoss && (
                <div className="pl-4 border-l-2 flex items-center gap-2" style={{ borderColor: `${C}40` }}>
                  <span className="text-xs font-mono text-text-tertiary">Hard stop at</span>
                  <DarkInput type="number" min="1" max="20" step="0.5"
                    value={config.maxDailyLossPct}
                    onChange={e => update({ maxDailyLossPct: parseFloat(e.target.value) || 5 })}
                    className="w-20"
                  />
                  <span className="text-xs font-mono text-text-tertiary">% daily loss</span>
                </div>
              )}
            </div>

            {/* Max concurrent positions */}
            <div>
              <Label>Max Concurrent Positions</Label>
              <div className="flex items-center gap-2">
                <DarkInput type="number" min="1" max="10" step="1"
                  value={config.maxConcurrentPositions}
                  onChange={e => update({ maxConcurrentPositions: parseInt(e.target.value) || 1 })}
                  className="w-24"
                />
                <span className="text-xs font-mono text-text-tertiary">open at once</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 4: Code Preferences ─────────────────────────────────── */}
      <div>
        <SectionHeader
          number="04"
          title="Code Preferences"
          isOpen={open.s4}
          onToggle={() => toggleSection("s4")}
        />
        {open.s4 && (
          <div
            className="px-4 pb-5 pt-1 space-y-5"
            style={{ borderLeft: `2px solid ${C}`, background: `${C}04` }}
          >
            {/* Language toggle */}
            <div>
              <Label>Output Language</Label>
              <div
                className="flex"
                style={{ border: "1px solid #2A2A2A", display: "inline-flex" }}
              >
                {(["pine_script", "python"] as OutputLanguage[]).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => update({ outputLanguage: lang })}
                    className="px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all"
                    style={config.outputLanguage === lang
                      ? { backgroundColor: C, color: "#000", fontWeight: 700 }
                      : { backgroundColor: "#0D0D0D", color: "#888" }}
                  >
                    {lang === "pine_script" ? "🌲 Pine Script v6" : "🐍 Python / Backtrader"}
                  </button>
                ))}
              </div>
            </div>

            {/* Pine Script options */}
            {config.outputLanguage === "pine_script" && (
              <div className="space-y-4 p-3" style={{ backgroundColor: "#0D0D0D", border: "1px solid #1E1E1E" }}>
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Pine Script v6 Options</p>
                <Toggle checked={config.includeTVAlerts} onChange={v => update({ includeTVAlerts: v })} label="Include TradingView alertcondition()" />
                {config.includeTVAlerts && (
                  <div>
                    <Label>Alert message format</Label>
                    <DarkInput
                      value={config.alertMessage}
                      onChange={e => update({ alertMessage: e.target.value })}
                      placeholder="{{ticker}} {{strategy.order.action}} at {{close}}"
                    />
                  </div>
                )}
                <Toggle checked={config.includeVisualLabels} onChange={v => update({ includeVisualLabels: v })} label="Include visual labels on chart" />
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Label>Commission %</Label>
                    <DarkInput type="number" step="0.01" min="0" max="1"
                      value={config.commissionPct}
                      onChange={e => update({ commissionPct: parseFloat(e.target.value) || 0.05 })}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-text-tertiary mt-4">per side (0.05% = typical spread)</span>
                </div>
              </div>
            )}

            {/* Python options */}
            {config.outputLanguage === "python" && (
              <div className="space-y-4 p-3" style={{ backgroundColor: "#0D0D0D", border: "1px solid #1E1E1E" }}>
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Python / Backtrader Options</p>
                <Toggle checked={config.includeBacktraderClass} onChange={v => update({ includeBacktraderClass: v })} label="Full Backtrader Strategy class" />
                <Toggle checked={config.includePandasTA} onChange={v => update({ includePandasTA: v })} label="Import pandas_ta indicators" />
                <Toggle checked={config.includeQuantConnect} onChange={v => update({ includeQuantConnect: v })} label="QuantConnect LEAN format" />
                <div>
                  <Label>Broker Bridge</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { id: "none",   label: "None" },
                      { id: "ibkr",   label: "Interactive Brokers" },
                      { id: "mt5",    label: "MT5 Python" },
                      { id: "alpaca", label: "Alpaca" },
                    ] as { id: BrokerBridge; label: string }[]).map(b => (
                      <Pill key={b.id} label={b.label} active={config.brokerBridge === b.id}
                        onToggle={() => update({ brokerBridge: b.id })} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Code quality */}
            <div className="space-y-3">
              <Label>Code Quality Options</Label>
              <Toggle checked={config.addInlineComments} onChange={v => update({ addInlineComments: v })} label="Add inline comments explaining each logic block" />
              <Toggle checked={config.addBiasWarnings} onChange={v => update({ addBiasWarnings: v })} label="Include lookahead-bias warnings as code comments" />
              <Toggle
                checked={config.includePerformanceMetrics}
                onChange={v => update({ includePerformanceMetrics: v })}
                label={`Include performance metric printout${config.outputLanguage === "python" ? "" : " (Python only)"}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
