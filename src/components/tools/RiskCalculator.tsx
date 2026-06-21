"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import {
  Percent, ShieldAlert, RefreshCw, TrendingUp, AlertTriangle, Save,
  CheckCircle, Plus, Trash2, Activity, BarChart3, Zap, Shield,
  ChevronRight, X, AlertCircle, Info, BarChart2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { TradeContextPanel } from "./TradeContextPanel";
import { PropComplianceTab } from "./PropComplianceTab";
import { PerformanceTab } from "./PerformanceTab";

// ─── Constants ────────────────────────────────────────────────────────────────
type TabId = "CALCULATOR" | "PORTFOLIO HEAT" | "ADVANCED SIZING" | "PROP COMPLIANCE" | "PERFORMANCE";

const TD_KEY = () => process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
const TD_BASE = "https://api.twelvedata.com";

const CURRENCIES = [
  { code:"GBP", symbol:"£", flag:"🇬🇧" }, { code:"USD", symbol:"$", flag:"🇺🇸" },
  { code:"EUR", symbol:"€", flag:"🇪🇺" }, { code:"AUD", symbol:"A$", flag:"🇦🇺" },
  { code:"JPY", symbol:"¥", flag:"🇯🇵" }, { code:"CAD", symbol:"C$", flag:"🇨🇦" },
];

const INSTRUMENTS = [
  { id:"forex-major",   label:"Forex Major (EUR/USD, GBP/USD…)", pip:10,   mult:10000, isForex:true  },
  { id:"forex-minor",   label:"Forex Minor (GBP/JPY, EUR/JPY…)", pip:10,   mult:100,   isForex:true  },
  { id:"forex-exotic",  label:"Forex Exotic (USD/TRY, USD/ZAR…)",pip:10,   mult:1000,  isForex:true  },
  { id:"index-pts",     label:"Index — Points (FTSE, DOW…)",     pip:1,    mult:1,     isForex:false },
  { id:"index-cash",    label:"Index — Cash (DAX, NAS100…)",     pip:1,    mult:1,     isForex:false },
  { id:"commodity",     label:"Commodity (Gold, Oil, Silver…)",  pip:1,    mult:10,    isForex:false },
  { id:"crypto",        label:"Crypto (BTC, ETH…)",              pip:1,    mult:1,     isForex:false },
  { id:"stock",         label:"Stock / Share",                   pip:0.01, mult:100,   isForex:false },
  { id:"custom",        label:"Custom Instrument",               pip:10,   mult:1,     isForex:false },
];

const SYMBOL_SUGGESTIONS: Record<string, string[]> = {
  "forex-major":  ["EURUSD","GBPUSD","USDJPY","USDCHF","AUDUSD","NZDUSD","USDCAD"],
  "forex-minor":  ["GBPJPY","EURJPY","AUDJPY","GBPEUR","CADJPY","CHFJPY"],
  "forex-exotic": ["USDTRY","USDZAR","USDMXN","USDSEK","USDNOK"],
  "index-pts":    ["UK100","US30","GER40","FRA40","HK50"],
  "index-cash":   ["NAS100","SPX500","US30","UK100"],
  "commodity":    ["XAUUSD","XAGUSD","USOIL","UKOIL","XPTUSD"],
  "crypto":       ["BTCUSD","ETHUSD","XRPUSD","SOLUSD","BNBUSD"],
  "stock":        ["AAPL","TSLA","MSFT","GOOGL","AMZN","META"],
};

const LEVERAGE_OPTIONS = [
  {label:"1:30 (EU/UK Regulated)",  val:30},
  {label:"1:50",                    val:50},
  {label:"1:100",                   val:100},
  {label:"1:200",                   val:200},
  {label:"1:500",                   val:500},
];

const PROP_FIRMS: Record<string, any> = {
  ftmo_10k:  { name:"FTMO – $10k",   balance:10000,  maxDailyLoss:5, maxTotalLoss:10, profitTarget:10, minDays:10, maxLots:100, newsRestriction:true,  weekendRestriction:false, copyTrading:false },
  ftmo_25k:  { name:"FTMO – $25k",   balance:25000,  maxDailyLoss:5, maxTotalLoss:10, profitTarget:10, minDays:10, maxLots:100, newsRestriction:true,  weekendRestriction:false, copyTrading:false },
  ftmo_100k: { name:"FTMO – $100k",  balance:100000, maxDailyLoss:5, maxTotalLoss:10, profitTarget:10, minDays:10, maxLots:100, newsRestriction:true,  weekendRestriction:false, copyTrading:false },
  the5ers:   { name:"The5ers",        balance:100000, maxDailyLoss:4, maxTotalLoss:8,  profitTarget:8,  minDays:0,  maxLots:50,  newsRestriction:false, weekendRestriction:false, copyTrading:true  },
  funded_trader:{ name:"Funded Trader", balance:50000, maxDailyLoss:5, maxTotalLoss:10,profitTarget:10, minDays:5,  maxLots:100, newsRestriction:true,  weekendRestriction:true,  copyTrading:false },
  custom:    { name:"Custom Rules",   balance:10000,  maxDailyLoss:5, maxTotalLoss:10, profitTarget:10, minDays:5,  maxLots:100, newsRestriction:false, weekendRestriction:false, copyTrading:false },
};

const CORRELATIONS: Record<string, Record<string, number>> = {
  EURUSD:  { GBPUSD:0.87, USDJPY:-0.73, GBPJPY:0.32, XAUUSD:0.35, USDCHF:-0.92 },
  GBPUSD:  { EURUSD:0.87, USDJPY:-0.64, GBPJPY:0.72, XAUUSD:0.28, USDCHF:-0.83 },
  USDJPY:  { EURUSD:-0.73, GBPUSD:-0.64, GBPJPY:0.52, XAUUSD:-0.42, USDCHF:0.70 },
  GBPJPY:  { EURUSD:0.32, GBPUSD:0.72, USDJPY:0.52, XAUUSD:0.18, USDCHF:-0.42 },
  BTCUSD:  { ETHUSD:0.93, NAS100:0.62, XAUUSD:0.24, SPX500:0.55 },
  ETHUSD:  { BTCUSD:0.93, NAS100:0.58, XAUUSD:0.19, SPX500:0.50 },
  XAUUSD:  { EURUSD:0.35, GBPUSD:0.28, USDJPY:-0.42, BTCUSD:0.24, USDCHF:-0.38 },
  NAS100:  { SPX500:0.96, US30:0.88, BTCUSD:0.62, ETHUSD:0.58 },
  SPX500:  { NAS100:0.96, US30:0.91, BTCUSD:0.55, ETHUSD:0.50 },
};

// ─── Utilities ─────────────────────────────────────────────────────────────
function fmt(n: number, dec = 2, sym = "") { return `${sym}${n.toLocaleString("en-GB",{minimumFractionDigits:dec,maximumFractionDigits:dec})}`; }
function fmtPct(n: number) { return `${n >= 0?"+":""}${n.toFixed(2)}%`; }

async function fetchTwelveQuote(symbol: string) {
  const k = TD_KEY();
  if (!k) return null;
  const sym = encodeURIComponent(symbol);
  try {
    const r = await fetch(`${TD_BASE}/quote?symbol=${sym}&apikey=${k}`);
    const d = await r.json();
    if (d.code || d.status === "error") return null;
    return {
      price:  parseFloat(d.close ?? d.price ?? "0") || null,
      bid:    parseFloat(d.bid ?? "0") || null,
      ask:    parseFloat(d.ask ?? "0") || null,
      spread: d.bid && d.ask ? parseFloat(d.ask) - parseFloat(d.bid) : null,
    };
  } catch { return null; }
}

async function fetchTwelveATR(symbol: string) {
  const k = TD_KEY();
  if (!k) return null;
  const sym = encodeURIComponent(symbol);
  try {
    const r = await fetch(`${TD_BASE}/atr?symbol=${sym}&interval=1day&time_period=14&outputsize=1&apikey=${k}`);
    const d = await r.json();
    return d?.values?.[0]?.atr ? parseFloat(d.values[0].atr) : null;
  } catch { return null; }
}

// Monte Carlo
interface MCStats {
  median: number; best10: number; worst10: number;
  probDouble: number; probHalfRuin: number;
  maxDrawdownMedian: number; worstStreak: number;
  avgConsecLosses: number;
}
function runMonteCarlo(balance: number, riskPct: number, winRate: number, rr: number, numTrades: number, numSims = 1000) {
  const curves: number[][] = [];
  const allDrawdowns: number[] = [];
  let totalStreaks = 0, maxStreakSeen = 0;

  for (let s = 0; s < numSims; s++) {
    const curve = [balance];
    let bal = balance;
    let peak = balance;
    let maxDD = 0;
    let streak = 0, curStreak = 0;

    for (let t = 0; t < numTrades; t++) {
      const risk = bal * (riskPct / 100);
      if (Math.random() < winRate) {
        bal += risk * rr;
        curStreak = 0;
      } else {
        bal -= risk;
        curStreak++;
        if (curStreak > streak) streak = curStreak;
      }
      if (bal > peak) peak = bal;
      const dd = (peak - bal) / peak;
      if (dd > maxDD) maxDD = dd;
      if (bal <= 0) { bal = 0; break; }
      curve.push(bal);
    }
    curves.push(curve);
    allDrawdowns.push(maxDD);
    totalStreaks += streak;
    if (streak > maxStreakSeen) maxStreakSeen = streak;
  }

  const finals = curves.map(c => c[c.length - 1]).sort((a, b) => a - b);
  allDrawdowns.sort((a, b) => a - b);
  const median = finals[Math.floor(numSims / 2)];
  const best10 = finals[Math.floor(numSims * 0.9)];
  const worst10 = finals[Math.floor(numSims * 0.1)];
  const probDouble = finals.filter(f => f >= balance * 2).length / numSims;
  const probHalfRuin = finals.filter(f => f <= balance * 0.5).length / numSims;
  const maxDrawdownMedian = allDrawdowns[Math.floor(numSims / 2)];

  // Sample 20 curves for display
  const step = Math.floor(numSims / 20);
  const sampleCurves = curves.filter((_, i) => i % step === 0).slice(0, 20);

  return { sampleCurves, stats: { median, best10, worst10, probDouble, probHalfRuin, maxDrawdownMedian, worstStreak: maxStreakSeen, avgConsecLosses: Math.round(totalStreaks / numSims) } };
}

// ─── Input component helpers ─────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1.5">{children}</label>;
}
function FieldInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full bg-background-primary border border-border-slate/80 px-4 py-3 text-sm font-mono font-bold outline-none focus:border-accent text-text-primary rounded-lg transition-colors", className)} {...props} />;
}
function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary border-b border-border-slate/30 pb-2 flex items-center gap-1.5">{children}</h4>;
}
function StatRow({ label, value, sub, valueClass }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-border-slate/20 last:border-0">
      <span className="text-[10px] font-mono text-text-tertiary uppercase">{label}</span>
      <div className="text-right">
        <span className={cn("text-[11px] font-mono font-bold text-text-primary", valueClass)}>{value}</span>
        {sub && <p className="text-[9px] font-mono text-text-tertiary">{sub}</p>}
      </div>
    </div>
  );
}
function WarnBanner({ message, level = "warn" }: { message: string; level?: "warn"|"error"|"info" }) {
  const s = level === "error" ? "bg-red-50 border-red-200 text-red-700" : level === "info" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-amber-50 border-amber-200 text-amber-700";
  const Icon = level === "error" ? AlertTriangle : level === "info" ? Info : AlertCircle;
  return (
    <div className={cn("flex items-start gap-2.5 p-3 border rounded-lg text-[11px] font-mono", s)}>
      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0a0a0a] text-white px-5 py-3 rounded-lg shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <CheckCircle className="w-4 h-4 text-emerald-400" />
      <span className="text-[11px] font-mono">{msg}</span>
      <a href="/dashboard/journal" className="text-accent text-[10px] underline">View →</a>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── Calculator Tab (inner component uses useSearchParams — must be inside Suspense) ──
interface CalculatorTabProps {
  currency: string;
  onCurrencyChange: (c: string) => void;
  balance: number;
  onBalanceChange: (b: number) => void;
  todayEntries: any[];
  onSharedUpdate: (data: { symbol: string; entry: string; stop: string; direction: "BUY"|"SELL"; riskPct: number; lots: number; riskAmt: number }) => void;
}

function CalculatorTab({ currency, onCurrencyChange, balance, onBalanceChange, todayEntries, onSharedUpdate }: CalculatorTabProps) {
  const searchParams = useSearchParams();
  const [scannerBanner, setScannerBanner] = useState<{
    symbol: string; display: string; price: string; atr: string;
    bias: string; setupScore: string; spread: string;
  } | null>(null);

  const [direction, setDirection] = useState<"BUY"|"SELL">("BUY");
  const [riskPct, setRiskPct] = useState(1);
  const [riskAmt, setRiskAmt] = useState(balance * 0.01);
  const [instrId, setInstrId] = useState("forex-major");
  const [symbol, setSymbol] = useState("GBPUSD");
  const [showSuggest, setShowSuggest] = useState(false);
  const [entryPrice, setEntryPrice] = useState("1.2734");
  const [stopPrice, setStopPrice] = useState("1.2684");
  const [stopPips, setStopPips] = useState("50");
  const [tpPrice, setTpPrice] = useState("");
  const [leverage, setLeverage] = useState(30);
  const [dailyLossLimitPct, setDailyLossLimitPct] = useState(5);
  const [todayLoss, setTodayLoss] = useState(0);
  const [maxLots, setMaxLots] = useState(100);
  const [winRate, setWinRate] = useState(45);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [fetchingATR, setFetchingATR] = useState(false);
  const [liveATR, setLiveATR] = useState<number|null>(null);
  const [liveSpread, setLiveSpread] = useState<number|null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"success"|"error">("idle");
  const [toast, setToast] = useState<string|null>(null);
  const [user, setUser] = useState<any>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  useEffect(() => { supabase.auth.getUser().then(({data}) => setUser(data.user)); }, []);
  useEffect(() => { syncRiskAmt(riskPct); }, [balance]);

  // Scanner params hydration
  useEffect(() => {
    if (!searchParams) return;
    const sym = searchParams.get("symbol");
    const price = searchParams.get("price");
    if (!sym || !price) return;
    const display = searchParams.get("display") || sym;
    const atr = searchParams.get("atr") || "";
    const bias = searchParams.get("bias") || "NEUTRAL";
    const setupScore = searchParams.get("setup_score") || "";
    const spread = searchParams.get("spread") || "";
    setSymbol(sym);
    setEntryPrice(parseFloat(price).toFixed(5));
    if (atr) setLiveATR(parseFloat(atr));
    if (spread) setLiveSpread(parseFloat(spread));
    setScannerBanner({ symbol: sym, display, price, atr, bias, setupScore, spread });
  }, []);

  const selectedCcy = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];
  const instr = INSTRUMENTS.find(i => i.id === instrId) ?? INSTRUMENTS[0];
  const sym = selectedCcy.symbol;

  function syncRiskAmt(pct: number) { setRiskPct(pct); setRiskAmt(parseFloat((balance * pct / 100).toFixed(2))); }
  function syncRiskPct(amt: number) { setRiskAmt(amt); setRiskPct(parseFloat(((amt / balance) * 100).toFixed(2))); }

  const entry = parseFloat(entryPrice) || 0;
  const stop  = parseFloat(stopPrice)  || 0;
  const tp    = parseFloat(tpPrice)    || 0;
  const priceDist = Math.abs(entry - stop);
  const stopDistPips = priceDist * instr.mult;
  const pipValue = instrId === "custom" ? 10 : instr.pip;
  const divisor = stopDistPips * pipValue;
  const lots = divisor > 0 ? riskAmt / divisor : 0;
  const units = lots * 100000;
  const notional = entry > 0 ? lots * 100000 * entry : 0;
  const marginRequired = leverage > 0 ? notional / leverage : 0;
  const pipVal = pipValue * lots;
  const newBalance = balance - riskAmt;
  const maxLoss50 = riskPct > 0 ? Math.floor(Math.log(0.5) / Math.log(1 - riskPct / 100)) : 0;
  const spreadCost = liveSpread && lots > 0 ? liveSpread * instr.mult * pipValue * lots : null;
  const spreadPctOfRisk = spreadCost && riskAmt > 0 ? (spreadCost / riskAmt) * 100 : null;
  const atrRatio = liveATR && stopDistPips > 0 ? stopDistPips / (liveATR * instr.mult) : null;
  const dailyLimitCash = balance * (dailyLossLimitPct / 100);
  const remainingBudget = dailyLimitCash - todayLoss;
  const rrNow = tp && entry && stop ? Math.abs(tp - entry) / priceDist : 0;
  const evPerTrade = riskAmt * ((winRate / 100) * rrNow - (1 - winRate / 100));
  const breakeven = liveSpread ? (liveSpread * instr.mult) : stopDistPips * 0.1;

  const dailyBreached = (todayLoss + riskAmt) > dailyLimitCash;
  const invalidSL = entry > 0 && stop > 0 && (direction === "BUY" ? stop >= entry : stop <= entry);

  // Propagate shared state to root
  useEffect(() => {
    onSharedUpdate({ symbol, entry: entryPrice, stop: stopPrice, direction, riskPct, lots, riskAmt });
  }, [symbol, entryPrice, stopPrice, direction, riskPct, lots, riskAmt]);

  function setTP(multiplier: number) {
    if (!entry || !stop) return;
    const dist = Math.abs(entry - stop) * multiplier;
    const newTp = direction === "BUY" ? entry + dist : entry - dist;
    setTpPrice(newTp.toFixed(instr.mult > 100 ? 5 : 2));
  }

  function syncStopFromPips(pips: string) {
    setStopPips(pips);
    const d = parseFloat(pips) / instr.mult;
    if (d && entry) setStopPrice((direction === "BUY" ? entry - d : entry + d).toFixed(5));
  }
  function syncPipsFromStop(sl: string) {
    setStopPrice(sl);
    const d = Math.abs(entry - (parseFloat(sl) || 0)) * instr.mult;
    setStopPips(d.toFixed(1));
  }

  async function handleFetchLive() {
    setFetchingPrice(true);
    const q = await fetchTwelveQuote(symbol);
    if (q?.price) { setEntryPrice(q.price.toFixed(instr.mult > 100 ? 5 : 2)); }
    if (q?.spread != null) setLiveSpread(q.spread);
    setFetchingPrice(false);
  }

  async function handleFetchATR() {
    setFetchingATR(true);
    const atr = await fetchTwelveATR(symbol);
    setLiveATR(atr);
    setFetchingATR(false);
  }

  async function handleSave() {
    if (!user) return;
    setSaveStatus("saving");
    try {
      await fetch("/api/journal/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id, instrument: symbol, direction,
          entry_price: entry, stop_loss: stop, take_profit: tp || null,
          position_size_lots: parseFloat(lots.toFixed(2)),
          risk_amount: riskAmt, risk_percent: riskPct, rr_ratio: rrNow,
          account_balance: balance, atr_value: liveATR, spread_cost: spreadCost,
          prop_firm_compliant: !dailyBreached, timestamp: new Date().toISOString(),
        }),
      });
      setSaveStatus("success");
      setToast("Saved to Trade Journal.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch { setSaveStatus("error"); }
  }

  const todayRisk = (todayEntries as any[]).reduce((s: number, e: any) => s + Math.abs(e.pnl_amount ?? 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-[380px_1fr_300px] gap-6">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Scanner Banner */}
      {scannerBanner && (
        <div className="lg:col-span-12 flex items-start gap-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg px-4 py-3" style={{ borderLeftWidth: 4, borderLeftColor: "#06b6d4" }}>
          <div className="flex-1">
            <p className="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">📊 Loaded from Market Scanner</p>
            <p className="text-[10px] font-mono text-text-secondary mt-0.5">
              {scannerBanner.display} · {scannerBanner.bias} bias{scannerBanner.setupScore ? ` · Setup Score: ${scannerBanner.setupScore}/100` : ""}
            </p>
            <p className="text-[9px] font-mono text-text-tertiary mt-0.5">Live price and ATR pre-populated. Set your stop loss to complete the calculation.</p>
          </div>
          <button onClick={() => setScannerBanner(null)} className="text-text-tertiary hover:text-text-primary shrink-0"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* TODAY BANNER */}
      {todayEntries.length > 0 && (
        <div className="lg:col-span-12 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <p className="text-[11px] font-mono text-blue-700">
            You have <strong>{todayEntries.length} trade{todayEntries.length > 1 ? "s" : ""}</strong> logged today.
            Total risk: <strong>{sym}{todayRisk.toFixed(2)}</strong> ({((todayRisk/balance)*100).toFixed(2)}%).
            Daily loss remaining: <strong>{sym}{(dailyLimitCash - todayRisk).toFixed(2)}</strong>.
          </p>
          <a href="/dashboard/journal" className="ml-auto text-[10px] font-mono text-blue-600 underline whitespace-nowrap">View Journal →</a>
        </div>
      )}

      {/* ── LEFT: PARAMETERS ── */}
      <div className="lg:col-span-5 xl:col-span-1 space-y-5 bg-background-surface border border-border-slate/50 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center border-b border-border-slate/30 pb-3">
          <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>
          <button onClick={() => { setRiskPct(1); syncRiskAmt(1); setEntryPrice("1.2734"); setStopPrice("1.2684"); setTpPrice(""); setStopPips("50"); }}
            className="flex items-center gap-1 text-[9px] font-mono uppercase text-text-tertiary hover:text-accent transition-colors">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Currency + Direction */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Account Currency</FieldLabel>
            <select value={currency} onChange={e => onCurrencyChange(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/80 px-3 py-3 text-sm font-bold text-text-primary outline-none focus:border-accent rounded-lg">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} ({c.symbol})</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Trade Direction</FieldLabel>
            <div className="grid grid-cols-2 border border-border-slate/80 rounded-lg overflow-hidden">
              {(["BUY","SELL"] as const).map(d => (
                <button key={d} onClick={() => setDirection(d)}
                  className={cn("py-3 text-[10px] font-mono font-bold uppercase transition-all",
                    direction === d ? (d==="BUY" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600") : "bg-background-primary text-text-tertiary hover:text-text-secondary")}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div>
          <FieldLabel>Account Balance</FieldLabel>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-mono text-sm">{sym}</span>
            <FieldInput type="number" value={balance || ""} onChange={e => onBalanceChange(Math.max(100, +e.target.value))} className="pl-8 text-lg" placeholder="10000" />
          </div>
        </div>

        {/* Risk % + £ synced */}
        <div className="bg-background-primary/40 p-4 border border-border-slate/50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <FieldLabel>Risk Per Trade</FieldLabel>
            <span className="text-[10px] font-mono font-bold text-accent">{riskPct.toFixed(2)}%</span>
          </div>
          <input type="range" min="0.1" max="5" step="0.1" value={riskPct} onChange={e => syncRiskAmt(+e.target.value)}
            className="w-full h-1 accent-accent cursor-pointer" />
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">%</span>
              <FieldInput type="number" step="0.1" value={riskPct} onChange={e => syncRiskAmt(+e.target.value)} className="pl-7 text-sm" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">{sym}</span>
              <FieldInput type="number" step="1" value={riskAmt} onChange={e => syncRiskPct(+e.target.value)} className="pl-7 text-sm" />
            </div>
          </div>
          <p className="text-[9px] font-mono text-text-tertiary">Professional range: 0.5%–2%. Above 3% = high risk.</p>
        </div>

        {/* Instrument + Symbol */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3">
            <FieldLabel>Instrument Type</FieldLabel>
            <select value={instrId} onChange={e => setInstrId(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/80 px-3 py-3 text-[11px] font-bold text-text-primary outline-none focus:border-accent rounded-lg">
              {INSTRUMENTS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </div>
          <div className="col-span-2 relative">
            <FieldLabel>Symbol</FieldLabel>
            <FieldInput value={symbol} onChange={e => { setSymbol(e.target.value.toUpperCase()); setShowSuggest(true); }}
              onBlur={() => setTimeout(() => setShowSuggest(false), 200)} onFocus={() => setShowSuggest(true)} placeholder="GBPUSD" />
            {showSuggest && SYMBOL_SUGGESTIONS[instrId] && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-background-elevated border border-border-slate/50 rounded-lg shadow-lg max-h-36 overflow-y-auto">
                {SYMBOL_SUGGESTIONS[instrId].filter(s => s.includes(symbol)).map(s => (
                  <button key={s} onMouseDown={() => { setSymbol(s); setShowSuggest(false); }}
                    className="w-full text-left px-3 py-2 text-[10px] font-mono hover:bg-white/10 text-text-secondary hover:text-accent">{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        {liveSpread !== null && (
          <p className="text-[9px] font-mono text-text-tertiary -mt-2">
            Current spread: <span className="text-accent font-bold">{(liveSpread * instr.mult).toFixed(1)} pips</span>
            {stopDistPips > 0 && liveSpread * instr.mult > stopDistPips / 3 && (
              <span className="text-amber-500 ml-2">⚠ Stop is within 3× spread</span>
            )}
          </p>
        )}

        {/* Entry Price */}
        <div>
          <FieldLabel>Entry Price</FieldLabel>
          <div className="flex gap-2">
            <FieldInput type="number" step="0.00001" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} className="flex-1" placeholder="1.2734" />
            <button onClick={handleFetchLive} disabled={fetchingPrice}
              className="px-3 py-2 bg-accent/10 border border-accent/30 text-accent text-[9px] font-mono uppercase rounded-lg hover:bg-accent/20 transition-colors disabled:opacity-50 whitespace-nowrap">
              {fetchingPrice ? "…" : "FETCH LIVE"}
            </button>
          </div>
        </div>

        {/* Stop Loss — dual input */}
        <div>
          <FieldLabel>Stop Loss</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldInput type="number" step="0.00001" value={stopPrice} onChange={e => syncPipsFromStop(e.target.value)} placeholder="1.2684" />
              <p className="text-[9px] font-mono text-text-tertiary mt-0.5">Price level</p>
            </div>
            <div>
              <FieldInput type="number" value={stopPips} onChange={e => syncStopFromPips(e.target.value)} placeholder="50" />
              <p className="text-[9px] font-mono text-text-tertiary mt-0.5">Pips / Points</p>
            </div>
          </div>
          {invalidSL && <WarnBanner message={`Stop is ${direction==="BUY"?"above":"below"} entry — check direction.`} level="warn" />}
        </div>

        {/* ATR Quick-Select Stop Buttons */}
        {liveATR && instr.mult > 0 && entry > 0 && (
          <div className="space-y-1.5">
            <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">ATR Stop Suggestions</p>
            <div className="grid grid-cols-3 gap-1.5">
              {([0.5, 1, 1.5] as const).map(mult => {
                const atrPips = Math.round(liveATR * instr.mult * mult);
                return (
                  <button key={mult} onClick={() => {
                    const d = liveATR * mult;
                    const newStop = direction === "BUY" ? entry - d : entry + d;
                    syncPipsFromStop(newStop.toFixed(5));
                  }}
                    className="py-1.5 px-2 border border-border-slate/50 rounded text-[8px] font-mono text-text-tertiary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all text-center">
                    {mult}× ATR: {atrPips}p
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Levels from Scanner */}
        {scannerBanner?.atr && entry > 0 && (
          <div className="text-[9px] font-mono text-text-tertiary">
            Key levels:
            {[0.5, 1].map(m => {
              const lvl = parseFloat(scannerBanner.price) - parseFloat(scannerBanner.atr) * m * (direction === "BUY" ? 1 : -1);
              return (
                <button key={m} onClick={() => syncPipsFromStop(lvl.toFixed(5))}
                  className="mx-1 text-accent hover:underline">
                  {m}×ATR S {lvl.toFixed(4)}
                </button>
              );
            })}
          </div>
        )}

        {/* Take Profit */}
        <div>
          <FieldLabel>Take Profit</FieldLabel>
          <div className="flex gap-2 mb-1.5">
            <FieldInput type="number" step="0.00001" value={tpPrice} onChange={e => setTpPrice(e.target.value)} className="flex-1" placeholder="Auto-calculated" />
          </div>
          <div className="flex gap-2">
            {[2,3,1.5].map(rr => (
              <button key={rr} onClick={() => setTP(rr)}
                className="flex-1 py-1.5 border border-border-slate/50 text-[9px] font-mono uppercase hover:border-accent hover:text-accent transition-colors rounded text-text-tertiary">
                1:{rr} RR
              </button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div>
          <FieldLabel>Leverage</FieldLabel>
          <select value={leverage} onChange={e => setLeverage(+e.target.value)}
            className="w-full bg-background-primary border border-border-slate/80 px-3 py-3 text-sm font-bold text-text-primary outline-none focus:border-accent rounded-lg">
            {LEVERAGE_OPTIONS.map(l => <option key={l.val} value={l.val}>{l.label}</option>)}
          </select>
        </div>

        {/* Prop firm constraints */}
        <div className="border-t border-border-slate/30 pt-4 space-y-3">
          <SectionHeader><ShieldAlert className="w-3.5 h-3.5" /> Prop Firm Constraints</SectionHeader>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <FieldLabel>Daily Limit %</FieldLabel>
              <FieldInput type="number" value={dailyLossLimitPct} onChange={e => setDailyLossLimitPct(+e.target.value)} className="text-sm" />
            </div>
            <div>
              <FieldLabel>Today&apos;s Loss {sym}</FieldLabel>
              <FieldInput type="number" value={todayLoss||""} placeholder="0" onChange={e => setTodayLoss(+e.target.value)} className="text-sm" />
            </div>
            <div>
              <FieldLabel>Max Lots</FieldLabel>
              <FieldInput type="number" value={maxLots} onChange={e => setMaxLots(+e.target.value)} className="text-sm" />
            </div>
          </div>
          {remainingBudget > 0 ? (
            <p className={cn("text-[10px] font-mono", remainingBudget < dailyLimitCash * 0.2 ? "text-red-500" : remainingBudget < dailyLimitCash * 0.5 ? "text-amber-500" : "text-emerald-600")}>
              Remaining daily budget: {sym}{remainingBudget.toFixed(2)}
            </p>
          ) : <WarnBanner message="Daily loss limit reached. No more trades today." level="error" />}
          {dailyBreached && <WarnBanner message={`This trade would breach your ${dailyLossLimitPct}% daily limit!`} level="error" />}
          {lots > maxLots && <WarnBanner message={`Position size (${lots.toFixed(2)} lots) exceeds firm maximum (${maxLots} lots).`} level="warn" />}
        </div>
      </div>

      {/* ── RIGHT: OUTPUTS ── */}
      <div className="lg:col-span-7 xl:col-span-1 space-y-5">
        {/* Card 1: Position Size */}
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <SectionHeader><TrendingUp className="w-3.5 h-3.5" /> Position Size</SectionHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-3xl font-display font-black text-emerald-700">{lots > 0 ? lots.toFixed(2) : "—"}</p>
              <p className="text-[9px] font-mono uppercase text-emerald-600 mt-1">Lots</p>
            </div>
            <div className="text-center p-4 bg-background-primary border border-border-slate/50 rounded-lg">
              <p className="text-lg font-bold font-mono text-text-primary">{units > 0 ? Math.round(units).toLocaleString() : "—"}</p>
              <p className="text-[9px] font-mono uppercase text-text-tertiary mt-1">Units</p>
            </div>
            <div className="text-center p-4 bg-background-primary border border-border-slate/50 rounded-lg">
              <p className="text-sm font-bold font-mono text-text-primary">{notional > 0 ? `${sym}${Math.round(notional).toLocaleString()}` : "—"}</p>
              <p className="text-[9px] font-mono uppercase text-text-tertiary mt-1">Notional</p>
            </div>
            <div className="text-center p-4 bg-background-primary border border-border-slate/50 rounded-lg">
              <p className="text-sm font-bold font-mono text-text-primary">{marginRequired > 0 ? `${sym}${Math.round(marginRequired).toLocaleString()}` : "—"}</p>
              <p className="text-[9px] font-mono uppercase text-text-tertiary mt-1">Margin req.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <StatRow label="Pip value" value={pipVal > 0 ? `${sym}${pipVal.toFixed(2)}` : "—"} />
            <StatRow label="Stop distance" value={`${stopDistPips.toFixed(1)} pips`} />
          </div>
        </div>

        {/* Card 2: Risk Metrics */}
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm space-y-1">
          <SectionHeader><ShieldAlert className="w-3.5 h-3.5" /> Risk Metrics</SectionHeader>
          <div className="mt-3 space-y-0">
            <StatRow label="Risk Amount"  value={`${sym}${riskAmt.toFixed(2)}`} sub={`${riskPct.toFixed(2)}% of account`} />
            <StatRow label="Balance after loss" value={`${sym}${newBalance.toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2})}`} sub={`${((newBalance/balance)*100).toFixed(1)}% remaining`} />
            <StatRow label="Longevity" value={`${maxLoss50} losses`} sub="before 50% drawdown" />
            {/* ATR context */}
            <div className="py-2.5 border-b border-border-slate/20">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-text-tertiary uppercase">Volatility Context (ATR)</span>
                <button onClick={handleFetchATR} disabled={fetchingATR} className="text-[9px] font-mono text-accent hover:underline">
                  {fetchingATR ? "Loading…" : liveATR ? "Refresh" : "FETCH ATR"}
                </button>
              </div>
              {liveATR ? (
                <div className="mt-1">
                  <p className="text-[11px] font-mono text-text-primary">
                    ATR(14): <span className="font-bold">{(liveATR * instr.mult).toFixed(1)} pips</span> · Your stop: <span className="font-bold">{stopDistPips.toFixed(1)} pips</span>
                    {atrRatio && <span className="text-text-tertiary"> · {atrRatio.toFixed(2)}× ATR</span>}
                  </p>
                  {atrRatio && atrRatio < 0.5 && <WarnBanner message="Stop is less than 0.5× ATR — may be too tight for current volatility." level="warn" />}
                  {atrRatio && atrRatio > 2 && <WarnBanner message="Stop is over 2× ATR — wide stop, check position sizing." level="info" />}
                </div>
              ) : <p className="text-[9px] font-mono text-text-tertiary mt-1">Fetch ATR from Twelve Data for volatility context.</p>}
            </div>
            {/* Spread impact */}
            {spreadCost !== null && (
              <StatRow label="Spread Impact" value={`${sym}${spreadCost.toFixed(2)}`} sub={spreadPctOfRisk ? `${spreadPctOfRisk.toFixed(1)}% of risk budget` : undefined}
                valueClass={spreadPctOfRisk && spreadPctOfRisk > 15 ? "text-amber-500" : "text-text-primary"} />
            )}
          </div>
        </div>

        {/* Card 3: Reward Targets */}
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <SectionHeader><Activity className="w-3.5 h-3.5" /> Reward Targets</SectionHeader>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[{rr:1,label:"1:1"},{rr:1.5,label:"1:1.5"},{rr:2,label:"1:2",highlight:true},{rr:2.5,label:"1:2.5"},{rr:3,label:"1:3"}].map(r => (
              <div key={r.rr} className={cn("p-3 border rounded-lg text-center transition-all",
                r.highlight ? "bg-emerald-50 border-emerald-300" : "bg-background-primary border-border-slate/40")}>
                <p className={cn("text-[9px] font-mono font-bold uppercase mb-1", r.highlight ? "text-emerald-700" : "text-text-tertiary")}>{r.label}</p>
                <p className={cn("text-sm font-display font-black", r.highlight ? "text-emerald-700" : "text-text-primary")}>
                  {sym}{(riskAmt * r.rr).toFixed(0)}
                </p>
                {entry > 0 && stop > 0 && (
                  <p className="text-[8px] font-mono text-text-tertiary mt-0.5">
                    {direction==="BUY" ? (entry+(priceDist*r.rr)).toFixed(instr.mult>99?5:2) : (entry-(priceDist*r.rr)).toFixed(instr.mult>99?5:2)}
                  </p>
                )}
                <p className="text-[8px] font-mono text-text-tertiary">{sym}{(balance + riskAmt * r.rr).toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <StatRow label="Breakeven move" value={`${breakeven.toFixed(1)} pips`} sub="after spread" />
            <div className="py-2.5 border-b border-border-slate/20">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-mono text-text-tertiary uppercase">Expected Value</span>
                <span className="text-[9px] font-mono text-accent">{winRate}% win rate</span>
              </div>
              <input type="range" min="30" max="70" step="1" value={winRate} onChange={e => setWinRate(+e.target.value)} className="w-full h-1 accent-accent cursor-pointer mb-1" />
              <p className={cn("text-[11px] font-mono font-bold", evPerTrade >= 0 ? "text-emerald-600" : "text-red-500")}>
                EV: {sym}{evPerTrade >= 0 ? "+" : ""}{evPerTrade.toFixed(2)} / trade
              </p>
            </div>
          </div>
        </div>

        {/* Pre-Trade Checklist button */}
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-4 shadow-sm">
          <button
            onClick={() => { setShowChecklist(true); setChecklistItems({}); }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-background-elevated/50 border border-border-slate/40 rounded-lg text-[10px] font-mono uppercase text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
          >
            <CheckCircle className="w-4 h-4" /> Run Pre-Trade Checklist
          </button>
        </div>

        {/* Save */}
        <div className="bg-background-surface border border-border-slate/50 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          {user ? (
            <button onClick={handleSave} disabled={saveStatus==="saving" || lots <= 0}
              className="flex-1 py-4 bg-[#0a0a0a] hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 transition-all">
              <Save className="w-4 h-4" /> {saveStatus==="saving" ? "Saving…" : "Save to Trade Journal"}
            </button>
          ) : (
            <a href="/signup" className="flex-1 text-center py-4 bg-[#0a0a0a] hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg block transition-all">
              Sign Up to Save Calculations
            </a>
          )}
        </div>
      </div>

      {/* ── CONTEXT PANEL ── */}
      <div className="lg:col-span-12 xl:col-span-1">
        <TradeContextPanel
          symbol={symbol}
          entryPrice={entryPrice}
          stopPrice={stopPrice}
          direction={direction}
          lots={lots}
          riskAmt={riskAmt}
          liveATR={liveATR}
          liveSpread={liveSpread}
          balance={balance}
          instrMult={instr.mult}
          sym={sym}
        />
      </div>

      {/* Pre-Trade Checklist Modal */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background-surface border border-border-slate/50 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border-slate/30">
              <h2 className="text-[12px] font-mono font-black uppercase tracking-widest text-text-primary">// PRE-TRADE CHECKLIST</h2>
              <button onClick={() => setShowChecklist(false)} className="text-text-tertiary hover:text-text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-5">
              {([
                { section: "THE SETUP", items: [
                  { id: "entry_trigger", label: "I have identified a clear entry trigger (not just a feeling)" },
                  { id: "key_level", label: "My entry is at or near a key level" },
                  { id: "htf_trend", label: "The trend on the higher timeframe supports my direction" },
                  { id: "mtf_consensus", label: "The multi-timeframe consensus agrees (3+ timeframes)" },
                ]},
                { section: "THE RISK", items: [
                  { id: "structural_stop", label: "My stop is beyond a structural level (not just X pips)" },
                  { id: "atr_stop", label: `My stop distance is at least 0.5× ATR${liveATR ? ` (${(liveATR * instr.mult * 0.5).toFixed(0)} pips min)` : ""}` },
                  { id: "size_calculated", label: `My position size has been calculated: ${lots > 0 ? lots.toFixed(2) + " lots, risking " + riskPct.toFixed(2) + "%" : "enter stop price first"}` },
                  { id: "daily_budget", label: `Risk amount (${sym}${riskAmt.toFixed(0)}) is within daily budget (${sym}${remainingBudget.toFixed(0)} remaining)` },
                ]},
                { section: "THE REWARD", items: [
                  { id: "logical_tp", label: "My take profit is at a logical target (resistance, R1, etc.)" },
                  { id: "rr_ratio", label: `My risk:reward is at least 1:2 (current: 1:${rrNow.toFixed(2)})` },
                  { id: "know_exit", label: "I know exactly where I'm wrong and will exit without hesitation" },
                ]},
                { section: "THE ENVIRONMENT", items: [
                  { id: "calendar_checked", label: "I have checked the economic calendar for high-impact events" },
                  { id: "session_ok", label: "The session is appropriate for this instrument" },
                  { id: "spread_ok", label: `The spread is acceptable${liveSpread ? ` (${(liveSpread * instr.mult).toFixed(1)} pips)` : ""}` },
                ]},
                { section: "THE PSYCHOLOGY", items: [
                  { id: "no_revenge", label: "I am not trading to recover a loss (not revenge trading)" },
                  { id: "no_oversize", label: "I am not increasing size because I am on a winning streak" },
                  { id: "accept_stop", label: "I would be comfortable if this trade hits my stop" },
                ]},
              ] as { section: string; items: { id: string; label: string }[] }[]).map(({ section, items }) => (
                <div key={section}>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent border-b border-border-slate/20 pb-1.5 mb-3">{section}</p>
                  <div className="space-y-2.5">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                        <div
                          className={cn(
                            "w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-all",
                            checklistItems[item.id] ? "bg-emerald-500 border-emerald-500" : "border-border-slate/60 group-hover:border-accent"
                          )}
                          onClick={() => setChecklistItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        >
                          {checklistItems[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={cn("text-[10px] font-mono leading-snug",
                          checklistItems[item.id] ? "text-text-tertiary line-through" : "text-text-secondary")}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-border-slate/30">
              {(() => {
                const allItems = ["entry_trigger","key_level","htf_trend","mtf_consensus","structural_stop","atr_stop","size_calculated","daily_budget","logical_tp","rr_ratio","know_exit","calendar_checked","session_ok","spread_ok","no_revenge","no_oversize","accept_stop"];
                const allChecked = allItems.every(id => checklistItems[id]);
                const checkedCount = allItems.filter(id => checklistItems[id]).length;
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-text-tertiary">{checkedCount}/{allItems.length} complete</span>
                      <div className="w-32 h-1.5 bg-background-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(checkedCount/allItems.length)*100}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={async () => { await handleSave(); setShowChecklist(false); }}
                      disabled={!allChecked || saveStatus === "saving" || lots <= 0}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {allChecked ? "Complete Checklist & Save to Journal" : `Complete all ${allItems.length - checkedCount} remaining items`}
                    </button>
                    <button onClick={() => setShowChecklist(false)} className="w-full py-2 text-[9px] font-mono text-text-tertiary hover:text-text-secondary transition-colors">Cancel</button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Portfolio Heat Tab ───────────────────────────────────────────────────────
interface Position {
  id: string; symbol: string; direction: "BUY"|"SELL"; lots: number;
  entry: number; currentPrice: number | null; stopLoss: number;
  riskGbp: number; pnl: number | null; loading: boolean;
}
function HeatGauge({ pct }: { pct: number }) {
  const cx = 130, cy = 130, r = 100, sw = 20;
  const C = 2 * Math.PI * r, half = C / 2;
  const maxPct = 8, clamp = Math.min(pct, maxPct);
  const fill = (clamp / maxPct) * half;
  const color = pct < 2 ? "#22c55e" : pct < 4 ? "#f59e0b" : pct < 6 ? "#ef4444" : "#7f1d1d";
  const label = pct < 2 ? "SAFE" : pct < 4 ? "CAUTION" : pct < 6 ? "DANGER" : "CRITICAL";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 145" className="w-64">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={sw}
          strokeDasharray={`${half} ${C}`} strokeLinecap="round" transform={`rotate(180 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${fill} ${C}`} strokeLinecap="round" transform={`rotate(180 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
        <text x="18"  y="138" fontSize="9" fill="#22c55e" fontFamily="monospace">0%</text>
        <text x="88"  y="35"  fontSize="9" fill="#f59e0b" fontFamily="monospace">4%</text>
        <text x="218" y="138" fontSize="9" fill="#ef4444" fontFamily="monospace">8%</text>
        <text x={cx} y={cx - 8}  textAnchor="middle" fontSize="32" fontWeight="900" fill={color} fontFamily="monospace">{pct.toFixed(1)}%</text>
        <text x={cx} y={cx + 16} textAnchor="middle" fontSize="11" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
        <text x={cx} y={cx + 32} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="monospace">PORTFOLIO HEAT</text>
      </svg>
      {pct >= 6 && <div className="mt-2 px-4 py-1.5 bg-red-600 text-white text-[10px] font-mono font-bold uppercase animate-pulse rounded">⚠ Critical Exposure</div>}
    </div>
  );
}

function PortfolioHeatTab({ balance, currency }: { balance: number; currency: string }) {
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? "£";
  const [positions, setPositions] = useState<Position[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("rmc-positions") ?? "[]"); } catch { return []; }
  });
  const [dailyRealised, setDailyRealised] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(200);
  const [dailyLimit, setDailyLimit] = useState(balance * 0.05);
  const [refreshing, setRefreshing] = useState(false);
  const savePositions = (p: Position[]) => { setPositions(p); localStorage.setItem("rmc-positions", JSON.stringify(p)); };

  function addRow() {
    const p: Position = { id: Date.now().toString(), symbol:"GBPUSD", direction:"BUY", lots:0.1, entry:1.2734, currentPrice:null, stopLoss:1.2684, riskGbp:0, pnl:null, loading:false };
    savePositions([...positions, p]);
  }
  function removeRow(id: string) { savePositions(positions.filter(p => p.id !== id)); }
  function updateRow(id: string, field: keyof Position, val: any) {
    savePositions(positions.map(p => p.id === id ? { ...p, [field]: val } : p));
  }

  async function refreshPrices() {
    setRefreshing(true);
    const updated = await Promise.all(positions.map(async (p) => {
      try {
        const q = await fetchTwelveQuote(p.symbol);
        if (!q?.price) return p;
        const dist = Math.abs(p.entry - p.stopLoss);
        const pnl = p.direction === "BUY" ? (q.price - p.entry) * p.lots * 100000 * 0.0001 : (p.entry - q.price) * p.lots * 100000 * 0.0001;
        const stopDist = dist * 10000;
        const riskGbp = stopDist * 10 * p.lots;
        return { ...p, currentPrice: q.price, pnl, riskGbp };
      } catch { return p; }
    }));
    savePositions(updated);
    setRefreshing(false);
  }

  const totalRisk = positions.reduce((s, p) => s + (p.riskGbp || 0), 0);
  const totalPnl = positions.reduce((s, p) => s + (p.pnl || 0), 0);
  const totalRiskPct = balance > 0 ? (totalRisk / balance) * 100 : 0;
  const worstCase = balance - totalRisk;

  function getStatus(p: Position): { label: string; cls: string } {
    if (!p.currentPrice) return { label: "NO DATA", cls: "text-text-tertiary" };
    const dist = Math.abs(p.entry - p.stopLoss);
    const remaining = p.direction === "BUY" ? p.currentPrice - p.stopLoss : p.stopLoss - p.currentPrice;
    const pct = remaining / dist;
    if (pct < 0.2) return { label: "NEAR STOP", cls: "text-red-500 font-bold" };
    if (p.pnl !== null && p.pnl > 0) return { label: "IN PROFIT", cls: "text-emerald-600" };
    return { label: "AT RISK", cls: "text-amber-500" };
  }

  const corrWarnings: string[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i], b = positions[j];
      const corr = CORRELATIONS[a.symbol]?.[b.symbol] ?? CORRELATIONS[b.symbol]?.[a.symbol] ?? null;
      if (corr === null) continue;
      const sameDir = a.direction === b.direction;
      const effectiveCorr = sameDir ? corr : -corr;
      if (effectiveCorr > 0.7) corrWarnings.push(`${a.symbol} & ${b.symbol} are ${Math.round(effectiveCorr*100)}% correlated — effective risk doubled.`);
      if (effectiveCorr < -0.6) corrWarnings.push(`${a.symbol} & ${b.symbol} partially offset (${Math.round(effectiveCorr*100)}% inverse correlation).`);
    }
  }

  const dailyTotalPnl = dailyRealised + totalPnl;
  const limitBreached = dailyTotalPnl < -dailyLimit;

  return (
    <div className="space-y-6">
      {limitBreached && (
        <div className="w-full py-4 bg-red-600 text-white text-center font-black uppercase tracking-widest text-sm rounded-lg animate-pulse">
          ⛔ DAILY LOSS LIMIT HIT — STOP TRADING
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <HeatGauge pct={totalRiskPct} />
        </div>
        <div className="md:col-span-2 bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
          <SectionHeader><Activity className="w-3.5 h-3.5" /> Portfolio Summary</SectionHeader>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { label:"Total Risk", value:`${sym}${totalRisk.toFixed(2)}`, sub:`${totalRiskPct.toFixed(2)}% of account`, cls: totalRiskPct > 4 ? "text-red-500" : totalRiskPct > 2 ? "text-amber-500" : "text-emerald-600" },
              { label:"Floating P&L", value:`${totalPnl >= 0 ? "+" : ""}${sym}${Math.abs(totalPnl).toFixed(2)}`, sub:"unrealised", cls: totalPnl >= 0 ? "text-emerald-600" : "text-red-500" },
              { label:"Net Exposure", value:`${sym}${Math.abs(totalRisk - Math.max(0, totalPnl)).toFixed(2)}`, sub:"risk minus paper profit", cls:"text-text-primary" },
            ].map(s => (
              <div key={s.label} className="text-center p-4 bg-background-primary rounded-lg border border-border-slate/40">
                <p className="text-[9px] font-mono text-text-tertiary uppercase mb-1">{s.label}</p>
                <p className={cn("text-xl font-bold font-mono", s.cls)}>{s.value}</p>
                <p className="text-[9px] font-mono text-text-tertiary">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-mono text-text-tertiary uppercase">If all stops hit simultaneously</p>
              <p className="text-[11px] font-mono font-bold text-red-500">{sym}{totalRisk.toFixed(2)} loss</p>
            </div>
            <div className="h-2 bg-background-elevated rounded-full overflow-hidden">
              <div className="h-full bg-red-500/60 rounded-full" style={{ width: `${Math.min(100, totalRiskPct / 8 * 100)}%` }} />
            </div>
            <p className="text-[9px] font-mono text-text-tertiary">
              Account after worst-case: <strong className="text-text-primary">{sym}{Math.max(0, worstCase).toFixed(2)}</strong> ·
              Recovery trades at 1:2 RR needed: <strong className="text-text-primary">{totalRisk > 0 ? Math.ceil(totalRisk / (balance * 0.01 * 2)) : 0}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader><BarChart3 className="w-3.5 h-3.5" /> Open Positions</SectionHeader>
          <div className="flex gap-2">
            <button onClick={refreshPrices} disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-slate/50 text-[9px] font-mono uppercase hover:border-accent hover:text-accent transition-colors rounded disabled:opacity-50">
              <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} /> Refresh
            </button>
            <button onClick={addRow}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-[9px] font-mono uppercase rounded hover:bg-accent/80 transition-colors">
              <Plus className="w-3 h-3" /> Add Row
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border-slate/30 text-text-tertiary uppercase tracking-widest">
                {["Symbol","Dir","Lots","Entry","Current","Stop","Risk","P&L","Status",""].map(h => (
                  <th key={h} className="py-2 px-1 text-left font-normal text-[9px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/10">
              {positions.map(p => {
                const st = getStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="py-2 px-1"><input value={p.symbol} onChange={e => updateRow(p.id,"symbol",e.target.value.toUpperCase())} className="w-20 bg-background-primary border border-border-slate/50 px-2 py-1 rounded text-text-primary font-bold outline-none focus:border-accent" /></td>
                    <td className="py-2 px-1">
                      <select value={p.direction} onChange={e => updateRow(p.id,"direction",e.target.value)} className="bg-background-primary border border-border-slate/50 px-1 py-1 rounded outline-none text-[9px]">
                        <option>BUY</option><option>SELL</option>
                      </select>
                    </td>
                    <td className="py-2 px-1"><input type="number" step="0.01" value={p.lots} onChange={e => updateRow(p.id,"lots",+e.target.value)} className="w-16 bg-background-primary border border-border-slate/50 px-2 py-1 rounded outline-none focus:border-accent" /></td>
                    <td className="py-2 px-1"><input type="number" step="0.00001" value={p.entry} onChange={e => updateRow(p.id,"entry",+e.target.value)} className="w-20 bg-background-primary border border-border-slate/50 px-2 py-1 rounded outline-none focus:border-accent" /></td>
                    <td className={cn("py-2 px-1 font-bold", p.pnl !== null && p.pnl > 0 ? "text-emerald-600" : p.pnl !== null && p.pnl < 0 ? "text-red-500" : "text-text-tertiary")}>
                      {p.currentPrice?.toFixed(5) ?? "—"}
                    </td>
                    <td className="py-2 px-1"><input type="number" step="0.00001" value={p.stopLoss} onChange={e => updateRow(p.id,"stopLoss",+e.target.value)} className="w-20 bg-background-primary border border-border-slate/50 px-2 py-1 rounded outline-none focus:border-accent" /></td>
                    <td className="py-2 px-1 text-red-500 font-bold">{p.riskGbp > 0 ? `${sym}${p.riskGbp.toFixed(0)}` : "—"}</td>
                    <td className={cn("py-2 px-1 font-bold", p.pnl !== null && p.pnl > 0 ? "text-emerald-600" : p.pnl !== null && p.pnl < 0 ? "text-red-500" : "text-text-tertiary")}>
                      {p.pnl !== null ? `${p.pnl >= 0 ? "+" : ""}${sym}${Math.abs(p.pnl).toFixed(0)}` : "—"}
                    </td>
                    <td className={cn("py-2 px-1 text-[8px] uppercase", st.cls)}>{st.label}</td>
                    <td className="py-2 px-1"><button onClick={() => removeRow(p.id)} className="text-text-tertiary hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                );
              })}
              {positions.length === 0 && (
                <tr><td colSpan={10} className="py-8 text-center text-text-tertiary text-[10px]">No open positions. Click + Add Row.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {corrWarnings.length > 0 && (
        <div className="bg-background-surface border border-amber-200 rounded-xl p-5 shadow-sm space-y-2">
          <SectionHeader><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Correlation Warnings</SectionHeader>
          {corrWarnings.map((w, i) => <WarnBanner key={i} message={w} level="warn" />)}
        </div>
      )}

      <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm space-y-4">
        <SectionHeader><Zap className="w-3.5 h-3.5" /> Daily P&L</SectionHeader>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Realised P&L Today</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">{sym}</span>
              <FieldInput type="number" value={dailyRealised||""} placeholder="0" onChange={e => setDailyRealised(+e.target.value)} className="pl-7 text-sm" />
            </div>
          </div>
          <div>
            <FieldLabel>Daily Loss Limit</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">{sym}</span>
              <FieldInput type="number" value={dailyLimit||""} onChange={e => setDailyLimit(+e.target.value)} className="pl-7 text-sm" />
            </div>
          </div>
          <div>
            <FieldLabel>Daily Profit Target</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">{sym}</span>
              <FieldInput type="number" value={dailyTarget||""} onChange={e => setDailyTarget(+e.target.value)} className="pl-7 text-sm" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label:"Daily Loss", current: -Math.min(0, dailyTotalPnl), limit: dailyLimit, danger: true },
            { label:"Daily Profit", current: Math.max(0, dailyTotalPnl), limit: dailyTarget, danger: false },
          ].map(bar => {
            const pct = bar.limit > 0 ? Math.min(100, (bar.current / bar.limit) * 100) : 0;
            const overLimit = pct >= 100;
            return (
              <div key={bar.label}>
                <div className="flex justify-between text-[9px] font-mono mb-1">
                  <span className="text-text-tertiary uppercase">{bar.label}</span>
                  <span className={cn("font-bold", overLimit ? (bar.danger ? "text-red-500" : "text-emerald-600") : "text-text-secondary")}>
                    {sym}{bar.current.toFixed(0)} / {sym}{bar.limit.toFixed(0)} ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 bg-background-elevated rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", bar.danger ? (pct>80?"bg-red-500":pct>50?"bg-amber-500":"bg-emerald-500") : "bg-emerald-500")}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Advanced Sizing Tab ─────────────────────────────────────────────────────
function AdvancedSizingTab({ balance, riskPct, sym }: { balance: number; riskPct: number; sym: string }) {
  const [subTab, setSubTab] = useState<"VOLATILITY"|"MONTE CARLO">("VOLATILITY");
  const [kellyWR, setKellyWR] = useState(45);
  const [kellyRR, setKellyRR] = useState(2.0);
  const kelly = (kellyWR/100) - ((1-kellyWR/100)/(kellyRR));
  const kellyPct = Math.max(0, kelly * 100);
  const halfKelly = kellyPct / 2;
  const quarterKelly = kellyPct / 4;
  const [atrMode, setAtrMode] = useState(false);
  const [atrVal, setAtrVal] = useState<number|null>(null);
  const [atrMult, setAtrMult] = useState(1.5);
  const [atrSymbol, setAtrSymbol] = useState("GBPUSD");
  const [fetchingATR, setFetchingATR] = useState(false);
  const atrStop = atrVal ? atrVal * atrMult : null;
  const [mcWinRate, setMcWinRate] = useState(45);
  const [mcRR, setMcRR] = useState(2.0);
  const [mcTrades, setMcTrades] = useState(250);
  const [mcRiskPct, setMcRiskPct] = useState(riskPct);
  const [mcResult, setMcResult] = useState<ReturnType<typeof runMonteCarlo>|null>(null);
  const [mcRunning, setMcRunning] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  async function fetchATR() {
    setFetchingATR(true);
    const v = await fetchTwelveATR(atrSymbol);
    setAtrVal(v);
    setFetchingATR(false);
  }

  function runSim() {
    setMcRunning(true);
    setTimeout(() => {
      const result = runMonteCarlo(balance, mcRiskPct, mcWinRate/100, mcRR, mcTrades, 1000);
      setMcResult(result);
      setMcRunning(false);
    }, 50);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { if (mcResult) runSim(); }, 500);
  }, [mcWinRate, mcRR, mcRiskPct]);

  const rorRisks = [0.5, 1, 1.5, 2, 2.5];
  function calcRoR(rp: number): number {
    const wr = mcWinRate / 100;
    const edgePerTrade = wr * mcRR - (1 - wr);
    if (edgePerTrade <= 0) return 1;
    const A = edgePerTrade / (wr * mcRR + (1 - wr));
    const C = 50 / rp;
    return Math.max(0, Math.min(1, Math.pow((1-A)/(1+A), C)));
  }

  const chartData = mcResult ? Array.from({ length: mcTrades + 1 }, (_, i) => {
    const obj: any = { trade: i };
    mcResult.sampleCurves.slice(0, 20).forEach((curve, j) => { obj[`c${j}`] = curve[i] ?? null; });
    const vals = mcResult.sampleCurves.map(c => c[i]).filter(v => v != null).sort((a,b)=>a-b);
    obj.median = vals[Math.floor(vals.length/2)];
    obj.worst10 = vals[Math.floor(vals.length*0.1)];
    return obj;
  }) : [];

  return (
    <div className="space-y-6">
      <div className="flex border-b border-border-slate/30">
        {(["VOLATILITY","MONTE CARLO"] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={cn("px-5 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors",
              subTab === t ? "border-b-2 border-accent text-accent" : "text-text-tertiary hover:text-text-secondary")}>
            {t}
          </button>
        ))}
      </div>

      {subTab === "VOLATILITY" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm space-y-4">
            <SectionHeader><Zap className="w-3.5 h-3.5" /> ATR-Based Sizing</SectionHeader>
            <div className="flex items-center gap-3">
              <button onClick={() => setAtrMode(false)} className={cn("px-3 py-1.5 text-[9px] font-mono uppercase border rounded transition-all", !atrMode ? "bg-accent text-white border-accent" : "border-border-slate/50 text-text-tertiary")}>Standard</button>
              <button onClick={() => setAtrMode(true)}  className={cn("px-3 py-1.5 text-[9px] font-mono uppercase border rounded transition-all",  atrMode ? "bg-accent text-white border-accent" : "border-border-slate/50 text-text-tertiary")}>ATR-Based</button>
            </div>
            {atrMode ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <FieldInput value={atrSymbol} onChange={e => setAtrSymbol(e.target.value.toUpperCase())} className="flex-1" placeholder="GBPUSD" />
                  <button onClick={fetchATR} disabled={fetchingATR} className="px-3 py-2 bg-accent/10 border border-accent/30 text-accent text-[9px] font-mono uppercase rounded hover:bg-accent/20 disabled:opacity-50">
                    {fetchingATR ? "…" : "FETCH"}
                  </button>
                </div>
                {atrVal && (
                  <>
                    <div className="flex justify-between items-center">
                      <FieldLabel>ATR Multiplier: {atrMult}×</FieldLabel>
                      <span className="text-[9px] font-mono text-accent">{atrStop?.toFixed(4)} stop</span>
                    </div>
                    <input type="range" min="0.5" max="3" step="0.5" value={atrMult} onChange={e => setAtrMult(+e.target.value)} className="w-full h-1 accent-accent cursor-pointer" />
                    <div className="bg-background-primary border border-border-slate/40 rounded-lg p-3 text-[10px] font-mono space-y-1.5 text-text-secondary">
                      <div>ATR(14): <strong className="text-text-primary">{(atrVal * 10000).toFixed(0)} pips</strong></div>
                      <div>{atrMult}× ATR stop: <strong className="text-text-primary">{(atrVal * atrMult * 10000).toFixed(0)} pips</strong></div>
                    </div>
                    <WarnBanner message="ATR-based stops adapt to current volatility. Use as a guide alongside your technical setup." level="info" />
                  </>
                )}
              </div>
            ) : (
              <p className="text-[10px] font-mono text-text-tertiary">Switch to ATR-Based mode to size positions using market volatility instead of fixed pip distance.</p>
            )}
          </div>

          <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm space-y-4">
            <SectionHeader><Shield className="w-3.5 h-3.5" /> Kelly Criterion</SectionHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Win Rate %: {kellyWR}%</FieldLabel>
                <input type="range" min="20" max="80" step="1" value={kellyWR} onChange={e => setKellyWR(+e.target.value)} className="w-full h-1 accent-accent cursor-pointer" />
              </div>
              <div>
                <FieldLabel>Avg Win/Loss Ratio: {kellyRR}</FieldLabel>
                <input type="range" min="0.5" max="5" step="0.5" value={kellyRR} onChange={e => setKellyRR(+e.target.value)} className="w-full h-1 accent-accent cursor-pointer" />
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label:"Full Kelly",    val: kellyPct,    warn: kellyPct > 5 },
                { label:"Half Kelly",    val: halfKelly,   warn: false },
                { label:"Quarter Kelly", val: quarterKelly, warn: false },
              ].map(k => (
                <div key={k.label} className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-text-tertiary w-24 uppercase">{k.label}</span>
                  <div className="flex-1 h-2 bg-background-elevated rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", k.label.includes("Full") ? "bg-red-400" : k.label.includes("Half") ? "bg-accent" : "bg-emerald-500")}
                      style={{ width: `${Math.min(100, k.val * 10)}%` }} />
                  </div>
                  <span className={cn("text-[11px] font-mono font-bold w-12 text-right", k.warn ? "text-red-500" : "text-text-primary")}>{k.val.toFixed(1)}%</span>
                </div>
              ))}
            </div>
            {kellyPct === 0 && <WarnBanner message="Negative Kelly — no mathematical edge at these stats. Check your win rate and RR." level="error" />}
            {riskPct > kellyPct && kellyPct > 0 && <WarnBanner message={`Your current risk (${riskPct}%) exceeds Full Kelly (${kellyPct.toFixed(1)}%). You are over-risking relative to your edge.`} level="error" />}
            {halfKelly > 0 && <p className="text-[9px] font-mono text-text-tertiary">Recommended: Half Kelly = <strong className="text-accent">{halfKelly.toFixed(1)}%</strong>. Most professionals use Half or Quarter Kelly.</p>}
          </div>

          <div className="lg:col-span-2 bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
            <SectionHeader><AlertTriangle className="w-3.5 h-3.5" /> Risk of Ruin (to 50% Drawdown)</SectionHeader>
            <p className="text-[9px] font-mono text-text-tertiary mt-2 mb-4">Based on {mcWinRate}% win rate, {mcRR}:1 RR. Probability of losing 50% before recovering.</p>
            <table className="w-full text-[10px] font-mono">
              <thead><tr className="text-text-tertiary border-b border-border-slate/30 uppercase text-[9px]">
                <th className="py-2 text-left font-normal">Risk %</th>
                <th className="py-2 text-left font-normal">Risk per Trade</th>
                <th className="py-2 text-left font-normal">RoR Probability</th>
                <th className="py-2 text-left font-normal">Assessment</th>
              </tr></thead>
              <tbody className="divide-y divide-border-slate/10">
                {rorRisks.map(rp => {
                  const ror = calcRoR(rp);
                  const isCurrent = Math.abs(rp - riskPct) < 0.26;
                  const label = ror < 0.01 ? "Very Safe" : ror < 0.05 ? "Safe" : ror < 0.15 ? "Moderate" : ror < 0.35 ? "Risky" : "Dangerous";
                  const cls = ror < 0.05 ? "text-emerald-600" : ror < 0.15 ? "text-amber-500" : "text-red-500";
                  return (
                    <tr key={rp} className={cn("transition-colors", isCurrent && "bg-accent/5")}>
                      <td className={cn("py-2 font-bold", isCurrent && "text-accent")}>{rp}%{isCurrent && " ◄"}</td>
                      <td className="py-2 text-text-secondary">{sym}{(balance * rp / 100).toFixed(0)}</td>
                      <td className={cn("py-2 font-bold", cls)}>{(ror * 100).toFixed(1)}%</td>
                      <td className={cn("py-2", cls)}>{label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === "MONTE CARLO" && (
        <div className="space-y-6">
          <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
            <SectionHeader><BarChart3 className="w-3.5 h-3.5" /> Simulation Parameters</SectionHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {[
                { label:`Win Rate: ${mcWinRate}%`, val: mcWinRate, set: setMcWinRate, min:30, max:70, step:1 },
                { label:`RR Ratio: ${mcRR}:1`,     val: mcRR,     set: setMcRR,     min:0.5, max:5,  step:0.5 },
                { label:`Risk %: ${mcRiskPct}%`,   val: mcRiskPct,set: setMcRiskPct,min:0.25,max:5,  step:0.25 },
              ].map(sl => (
                <div key={sl.label} className="space-y-2">
                  <FieldLabel>{sl.label}</FieldLabel>
                  <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.val} onChange={e => sl.set(+e.target.value)} className="w-full h-1 accent-accent cursor-pointer" />
                </div>
              ))}
              <div className="space-y-2">
                <FieldLabel>Trades to simulate</FieldLabel>
                <div className="flex gap-2">
                  {[100,250,500,1000].map(n => (
                    <button key={n} onClick={() => setMcTrades(n)}
                      className={cn("flex-1 py-1.5 text-[9px] font-mono border rounded transition-all", mcTrades===n ? "bg-accent text-white border-accent" : "border-border-slate/50 text-text-tertiary hover:border-accent")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={runSim} disabled={mcRunning}
              className="mt-4 w-full py-3 bg-[#0a0a0a] hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
              {mcRunning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Running 1,000 Simulations…</> : <><Zap className="w-4 h-4" /> Run Monte Carlo (1,000 simulations)</>}
            </button>
          </div>

          {mcResult && (
            <>
              <div className="bg-background-surface border border-border-slate/50 rounded-xl p-6 shadow-sm">
                <SectionHeader><Activity className="w-3.5 h-3.5" /> Equity Curves (sample of 20)</SectionHeader>
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top:5, right:10, bottom:5, left:10 }}>
                      <XAxis dataKey="trade" tick={{ fontSize:8, fontFamily:"monospace" }} label={{ value:"Trades", position:"insideBottomRight", fontSize:9 }} />
                      <YAxis tick={{ fontSize:8, fontFamily:"monospace" }} tickFormatter={v => `${sym}${Math.round(v/1000)}k`} />
                      <Tooltip formatter={(v: any) => `${sym}${Number(v).toFixed(0)}`} contentStyle={{ fontSize:10, fontFamily:"monospace" }} />
                      <ReferenceLine y={balance} stroke="#94a3b8" strokeDasharray="4 4" label={{ value:"Start", fontSize:8 }} />
                      {Array.from({ length: 20 }, (_, i) => (
                        <Line key={i} dataKey={`c${i}`} stroke="#cbd5e1" strokeWidth={0.8} dot={false} isAnimationActive={false} />
                      ))}
                      <Line dataKey="median" stroke="#00e5cc" strokeWidth={2.5} dot={false} isAnimationActive={false} name="Median" />
                      <Line dataKey="worst10" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2" isAnimationActive={false} name="Worst 10%" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-6 mt-3 text-[9px] font-mono text-text-tertiary">
                  <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-[#cbd5e1] inline-block" /> Sample curves</span>
                  <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-accent inline-block" /> Median</span>
                  <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-red-400 inline-block" /> Worst 10%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label:"Median Outcome",    val:`${sym}${Math.round(mcResult.stats.median).toLocaleString()}`,      cls:"text-accent" },
                  { label:"Best 10%",           val:`${sym}${Math.round(mcResult.stats.best10).toLocaleString()}`,      cls:"text-emerald-600" },
                  { label:"Worst 10%",          val:`${sym}${Math.round(mcResult.stats.worst10).toLocaleString()}`,     cls:"text-red-500" },
                  { label:"Prob. of Doubling", val:`${(mcResult.stats.probDouble*100).toFixed(1)}%`,                   cls:"text-emerald-600" },
                  { label:"Prob. 50% Ruin",    val:`${(mcResult.stats.probHalfRuin*100).toFixed(1)}%`,                 cls: mcResult.stats.probHalfRuin > 0.1 ? "text-red-500" : "text-emerald-600" },
                  { label:"Median Max DD",     val:`${(mcResult.stats.maxDrawdownMedian*100).toFixed(1)}%`,            cls:"text-amber-500" },
                  { label:"Avg Losing Streak", val:`${mcResult.stats.avgConsecLosses} trades`,                         cls:"text-text-primary" },
                  { label:"Worst Streak Seen", val:`${mcResult.stats.worstStreak} trades`,                             cls:"text-red-400" },
                ].map(s => (
                  <div key={s.label} className="bg-background-surface border border-border-slate/50 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-[8px] font-mono text-text-tertiary uppercase mb-2">{s.label}</p>
                    <p className={cn("text-lg font-bold font-mono", s.cls)}>{s.val}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {!mcResult && !mcRunning && (
            <div className="text-center py-12 text-text-tertiary font-mono text-sm">Set parameters and click Run Monte Carlo to see projections.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export function RiskCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>("CALCULATOR");
  const [currency, setCurrency] = useState("GBP");
  const [balance, setBalance] = useState(10000);
  const [todayEntries, setTodayEntries] = useState<any[]>([]);
  const supabase = createClient();

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? "£";

  // Shared state for cross-tab linking
  const [sharedRiskPct, setSharedRiskPct] = useState(1);
  const [sharedLots, setSharedLots] = useState(0);
  const [sharedRiskAmt, setSharedRiskAmt] = useState(balance * 0.01);
  const [sharedSymbol, setSharedSymbol] = useState("GBPUSD");
  const [sharedEntry, setSharedEntry] = useState("1.2734");
  const [sharedStop, setSharedStop] = useState("1.2684");
  const [sharedDirection, setSharedDirection] = useState<"BUY"|"SELL">("BUY");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      try {
        const res = await fetch(`/api/journal/entries?user_id=${data.user.id}`);
        const j = await res.json();
        setTodayEntries(j.entries ?? []);
      } catch {}
    });
  }, []);

  const TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id:"CALCULATOR",      icon:Percent,    label:"CALCULATOR"      },
    { id:"PORTFOLIO HEAT",  icon:Activity,   label:"PORTFOLIO HEAT"  },
    { id:"ADVANCED SIZING", icon:BarChart3,  label:"ADVANCED SIZING" },
    { id:"PROP COMPLIANCE", icon:Shield,     label:"PROP COMPLIANCE" },
    { id:"PERFORMANCE",     icon:TrendingUp, label:"📈 PERFORMANCE"   },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar — solid box style matching the current dashboard design */}
      <div className="flex bg-background-surface border border-border-slate p-1 overflow-x-auto gap-0.5">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-all",
                activeTab === t.id
                  ? "bg-accent text-background-primary font-bold"
                  : "text-text-tertiary hover:text-text-primary"
              )}>
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "CALCULATOR" && (
        <Suspense fallback={<div className="p-8 text-center font-mono text-text-tertiary text-sm">Loading calculator…</div>}>
          <CalculatorTab
            currency={currency} onCurrencyChange={setCurrency}
            balance={balance}   onBalanceChange={setBalance}
            todayEntries={todayEntries}
            onSharedUpdate={({ symbol, entry, stop, direction, riskPct, lots, riskAmt }) => {
              setSharedSymbol(symbol); setSharedEntry(entry); setSharedStop(stop);
              setSharedDirection(direction); setSharedRiskPct(riskPct);
              setSharedLots(lots); setSharedRiskAmt(riskAmt);
            }}
          />
        </Suspense>
      )}
      {activeTab === "PORTFOLIO HEAT" && (
        <PortfolioHeatTab balance={balance} currency={currency} />
      )}
      {activeTab === "ADVANCED SIZING" && (
        <AdvancedSizingTab balance={balance} riskPct={sharedRiskPct} sym={sym} />
      )}
      {activeTab === "PROP COMPLIANCE" && (
        <PropComplianceTab
          balance={balance} riskAmt={sharedRiskAmt} lots={sharedLots} sym={sym}
          symbol={sharedSymbol} direction={sharedDirection}
          entryPrice={sharedEntry} stopPrice={sharedStop}
        />
      )}
      {activeTab === "PERFORMANCE" && (
        <PerformanceTab balance={balance} sym={sym} currency={currency} />
      )}
    </div>
  );
}
