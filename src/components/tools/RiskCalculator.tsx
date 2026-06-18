"use client";
 
import { useState, useEffect } from "react";
import { 
  Percent, 
  ShieldAlert, 
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Save,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
 
// Define instrument types and defaults
const INSTRUMENTS = [
  { id: "forex-major", label: "Forex Major (e.g. GBP/USD)", defaultSymbol: "GBPUSD", pipValue: 10, isForex: true },
  { id: "forex-minor", label: "Forex Minor (e.g. GBP/JPY)", defaultSymbol: "GBPJPY", pipValue: 10, isForex: true },
  { id: "gold", label: "Gold (XAU/USD)", defaultSymbol: "XAUUSD", pipValue: 10, isForex: false },
  { id: "ftse100", label: "FTSE 100", defaultSymbol: "UK100", pipValue: 10, isForex: false },
  { id: "us30", label: "US30/Dow", defaultSymbol: "US30", pipValue: 10, isForex: false },
  { id: "nas100", label: "NASDAQ/NAS100", defaultSymbol: "NAS100", pipValue: 20, isForex: false },
  { id: "spx500", label: "S&P 500/SPX", defaultSymbol: "SPX500", pipValue: 50, isForex: false },
  { id: "bitcoin", label: "Bitcoin (BTC/USD)", defaultSymbol: "BTCUSD", pipValue: 1, isForex: false },
  { id: "oil", label: "Oil (Brent/WTI)", defaultSymbol: "USOIL", pipValue: 1, isForex: false },
  { id: "custom", label: "Custom Instrument", defaultSymbol: "CUSTOM", pipValue: 10, isForex: false }
];
 
const CURRENCIES = [
  { code: "GBP", symbol: "£" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "AUD", symbol: "A$" }
];
 
export function RiskCalculator() {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<string>("1.2734");
  const [stopLoss, setStopLoss] = useState<string>("1.2684");
  const [instrumentId, setInstrumentId] = useState<string>("forex-major");
  const [symbol, setSymbol] = useState<string>("GBPUSD");
  const [accountCurrency, setAccountCurrency] = useState<string>("GBP");
  const [customPipValue, setCustomPipValue] = useState<number>(10);
  const [direction, setDirection] = useState<"Long" | "Short">("Long");
  const [dailyLossLimit, setDailyLossLimit] = useState<number>(5);
  const [currentDailyLoss, setCurrentDailyLoss] = useState<number>(0);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
 
  const supabase = createClient();
 
  useEffect(() => {
    // Check if user is logged in
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);
 
  // Update default symbol when instrument changes
  const handleInstrumentChange = (id: string) => {
    setInstrumentId(id);
    const selected = INSTRUMENTS.find(i => i.id === id);
    if (selected) {
      setSymbol(selected.defaultSymbol);
      // Update entry/SL values with sensible mock placeholders for the instrument
      if (id === "gold") {
        setEntryPrice("2345.50");
        setStopLoss("2340.50");
      } else if (id === "ftse100") {
        setEntryPrice("8000");
        setStopLoss("7950");
      } else if (id === "us30") {
        setEntryPrice("39000");
        setStopLoss("38900");
      } else if (id === "nas100") {
        setEntryPrice("18000");
        setStopLoss("17900");
      } else if (id === "spx500") {
        setEntryPrice("5100");
        setStopLoss("5080");
      } else if (id === "bitcoin") {
        setEntryPrice("67000");
        setStopLoss("66000");
      } else if (id === "oil") {
        setEntryPrice("80.00");
        setStopLoss("79.00");
      } else if (id.startsWith("forex")) {
        if (id === "forex-minor" && selected.defaultSymbol.endsWith("JPY")) {
          setEntryPrice("200.50");
          setStopLoss("200.00");
        } else {
          setEntryPrice("1.2734");
          setStopLoss("1.2684");
        }
      }
    }
  };
 
  const handleReset = () => {
    setBalance(10000);
    setRiskPercent(1);
    setEntryPrice("1.2734");
    setStopLoss("1.2684");
    setInstrumentId("forex-major");
    setSymbol("GBPUSD");
    setAccountCurrency("GBP");
    setCustomPipValue(10);
    setDirection("Long");
    setDailyLossLimit(5);
    setCurrentDailyLoss(0);
    setSaveStatus("idle");
    setSaveMessage("");
  };
 
  // Calculations
  const selectedCurrency = CURRENCIES.find(c => c.code === accountCurrency) || CURRENCIES[0];
  const selectedInstrument = INSTRUMENTS.find(i => i.id === instrumentId) || INSTRUMENTS[0];
  
  const parsedEntry = parseFloat(entryPrice) || 0;
  const parsedStopLoss = parseFloat(stopLoss) || 0;
 
  // Determine Pip/Point Value
  const pipValue = instrumentId === "custom" ? customPipValue : selectedInstrument.pipValue;
 
  // Determine multiplier for converting stop loss distance
  let multiplier = 1;
  if (instrumentId === "forex-major" || instrumentId === "forex-minor") {
    multiplier = parsedEntry > 50 ? 100 : 10000;
  } else if (instrumentId === "gold") {
    multiplier = 10;
  } else {
    multiplier = 1;
  }
 
  // Raw distance & converted distance
  const priceDistance = Math.abs(parsedEntry - parsedStopLoss);
  const stopDistancePipsOrPoints = priceDistance * multiplier;
 
  // Cash Risk Amount
  const riskAmount = balance * (riskPercent / 100);
 
  // Position Sizing
  const divisor = stopDistancePipsOrPoints * pipValue;
  const rawPositionSize = divisor > 0 ? riskAmount / divisor : 0;
 
  // Standard Lot unit multiplier
  const units = rawPositionSize * 100000;
 
  // Account Impact
  const newBalance = balance - riskAmount;
  const accountImpactPercent = (newBalance / balance) * 100;
 
  // Maximum consecutive losses
  const maxConsecutiveLosses50 = riskPercent > 0 ? Math.floor(50 / riskPercent) : 0;
  const maxConsecutiveLosses100 = riskPercent > 0 ? Math.floor(100 / riskPercent) : 0;
 
  // Daily Drawdown Warning
  const dailyLimitCash = balance * (dailyLossLimit / 100);
  const totalPotentialDailyLoss = currentDailyLoss + riskAmount;
  const dailyDrawdownBreached = totalPotentialDailyLoss > dailyLimitCash;
 
  // Save Trade Log to Supabase
  const handleSaveCalculation = async () => {
    if (!user) return;
    setSaveStatus("saving");
    setSaveMessage("");
 
    try {
      const { error } = await supabase
        .from("trade_logs")
        .insert({
          user_id: user.id,
          date: new Date().toISOString(),
          symbol: symbol.toUpperCase(),
          type: direction,
          entry_price: parsedEntry,
          exit_price: parsedStopLoss,
          pnl_amount: -riskAmount,
          pnl_percent: -riskPercent,
          strategy: "Risk Model",
          notes: `Position Size: ${rawPositionSize.toFixed(2)} ${
            selectedInstrument.isForex || instrumentId === "gold" || instrumentId === "custom"
              ? "Lots"
              : "Contracts"
          } (${Math.round(units).toLocaleString()} units). SL Distance: ${stopDistancePipsOrPoints.toFixed(
            1
          )} ${
            selectedInstrument.isForex || instrumentId === "gold" ? "Pips" : "Points"
          }. Account Balance: ${selectedCurrency.symbol}${balance.toLocaleString()}`
        } as any);
 
      if (error) throw error;
 
      setSaveStatus("success");
      setSaveMessage("Calculation saved successfully to your Trade Journal!");
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 5000);
    } catch (err: any) {
      console.error("Error saving log:", err);
      setSaveStatus("error");
      setSaveMessage(err.message || "Failed to save calculation.");
    }
  };
 
  // Validations & Warnings
  const entryEqualsSL = parsedEntry > 0 && parsedEntry === parsedStopLoss;
  const invalidDirection = 
    parsedEntry > 0 && parsedStopLoss > 0 && (
      (direction === "Long" && parsedStopLoss > parsedEntry) ||
      (direction === "Short" && parsedStopLoss < parsedEntry)
    );
  const highRiskWarning = riskPercent > 3;
  const invalidPositionSize = rawPositionSize <= 0 || isNaN(rawPositionSize);
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Input Panel (Left Column) */}
      <div className="lg:col-span-5 space-y-6 bg-background-surface border border-border-slate/50 p-6 sm:p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center border-b border-border-slate/50 pb-4 mb-4">
          <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-text-tertiary hover:text-accent transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
 
        {/* Currency & Direction Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Account Currency</label>
            <select
              value={accountCurrency}
              onChange={(e) => setAccountCurrency(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/80 p-3 text-sm font-bold text-text-primary outline-none focus:border-accent rounded-lg"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
              ))}
            </select>
          </div>
 
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Trade Direction</label>
            <div className="grid grid-cols-2 border border-border-slate/85 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setDirection("Long")}
                className={cn(
                  "py-3 text-[10px] font-mono font-bold uppercase transition-all",
                  direction === "Long" 
                    ? "bg-profit/10 text-profit border-r border-border-slate/85" 
                    : "bg-background-primary text-text-tertiary hover:text-text-secondary"
                )}
              >
                Buy (Long)
              </button>
              <button
                type="button"
                onClick={() => setDirection("Short")}
                className={cn(
                  "py-3 text-[10px] font-mono font-bold uppercase transition-all",
                  direction === "Short" 
                    ? "bg-loss/10 text-loss border-l border-border-slate/85" 
                    : "bg-background-primary text-text-tertiary hover:text-text-secondary"
                )}
              >
                Sell (Short)
              </button>
            </div>
          </div>
        </div>
 
        {/* Balance & Risk Slider */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Account Balance</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-mono">{selectedCurrency.symbol}</span>
              <input 
                type="number" 
                min="100"
                value={balance || ""}
                placeholder="10000"
                onChange={(e) => setBalance(Math.max(100, Number(e.target.value)))}
                className="w-full bg-background-primary border border-border-slate/80 p-4 pl-8 text-lg font-mono font-bold outline-none focus:border-accent text-text-primary rounded-lg"
              />
            </div>
          </div>
 
          <div className="space-y-2 bg-background-primary/30 p-4 border border-border-slate/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Risk Per Trade (%)</label>
              <span className="text-xs font-mono font-bold text-accent">{riskPercent}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="5" 
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full h-1 bg-background-elevated accent-accent appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-text-tertiary mt-2 font-bold">
              <span>0.1% Min</span>
              <span>1.0% Def</span>
              <span>5.0% Max</span>
            </div>
            <p className="text-[10px] text-text-secondary mt-2 leading-relaxed">
              * Professional traders typically risk 0.5-2% per trade.
            </p>
          </div>
        </div>
 
        {/* Instrument & Symbol */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Instrument</label>
            <select
              value={instrumentId}
              onChange={(e) => handleInstrumentChange(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/80 p-3 text-sm font-bold text-text-primary outline-none focus:border-accent rounded-lg"
            >
              {INSTRUMENTS.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.label}</option>
              ))}
            </select>
          </div>
 
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Symbol</label>
            <input 
              type="text" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-background-primary border border-border-slate/80 p-3 text-sm font-mono outline-none focus:border-accent text-text-primary font-bold rounded-lg"
            />
          </div>
        </div>
 
        {/* Custom Pip Value field */}
        {instrumentId === "custom" && (
          <div className="space-y-2 bg-accent/5 p-4 border border-accent/20 rounded-lg">
            <label className="text-[10px] font-mono uppercase tracking-widest text-accent block">Point/Pip Value per lot</label>
            <input 
              type="number" 
              value={customPipValue}
              onChange={(e) => setCustomPipValue(Number(e.target.value))}
              className="w-full bg-background-primary border border-border-slate/80 p-3 text-sm font-mono outline-none focus:border-accent text-text-primary font-bold rounded-lg"
            />
            <p className="text-[9px] text-text-secondary mt-1">Value of a 1.0 point/pip move per standard lot in your currency.</p>
          </div>
        )}
 
        {/* Entry & Stop Loss */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Entry Price</label>
            <input 
              type="number" 
              step="0.00001"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="1.2734"
              className="w-full bg-background-primary border border-border-slate/80 p-4 text-base font-mono outline-none focus:border-accent text-text-primary font-bold rounded-lg"
            />
          </div>
 
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">Stop Loss Price</label>
            <input 
              type="number" 
              step="0.00001"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="1.2684"
              className="w-full bg-background-primary border border-border-slate/80 p-4 text-base font-mono outline-none focus:border-accent text-text-primary font-bold rounded-lg"
            />
          </div>
        </div>
 
        {/* Prop Firm Drawdown settings */}
        <div className="border-t border-border-slate/50 pt-4 space-y-4">
          <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Prop Firm Constraints (Optional)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase text-text-tertiary block">Daily Limit (%)</label>
              <input 
                type="number" 
                value={dailyLossLimit}
                onChange={(e) => setDailyLossLimit(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-slate/80 p-3 text-xs font-mono outline-none focus:border-accent rounded-lg text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase text-text-tertiary block">Today's Loss Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary font-mono text-xs">{selectedCurrency.symbol}</span>
                <input 
                  type="number" 
                  value={currentDailyLoss || ""}
                  placeholder="0"
                  onChange={(e) => setCurrentDailyLoss(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate/80 p-3 pl-8 text-xs font-mono outline-none focus:border-accent rounded-lg text-text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Results Panel (Right Column) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Alerts & Warnings */}
        {entryEqualsSL && (
          <div className="p-4 bg-loss/10 border border-loss/20 text-loss rounded-xl flex items-start gap-3 shadow-[0_8px_32px_rgba(239,68,68,0.02)]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider">Stop loss must be different from entry price.</span>
          </div>
        )}
 
        {invalidDirection && (
          <div className="p-4 bg-warning/10 border border-warning/20 text-warning rounded-xl flex items-start gap-3 shadow-[0_8px_32px_rgba(245,158,11,0.02)]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider">
              {direction === "Long" 
                ? "Stop loss is above entry price — is this a short trade?" 
                : "Stop loss is below entry price — is this a long trade?"
              }
            </span>
          </div>
        )}
 
        {highRiskWarning && (
          <div className="p-4 bg-warning/15 border border-warning/30 text-warning rounded-xl flex items-start gap-3 shadow-[0_8px_32px_rgba(245,158,11,0.04)]">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-xs leading-relaxed font-semibold">
              Risk above 3% is considered high. Professional traders typically risk 0.5% - 2.0% per trade to survive losing streaks.
            </span>
          </div>
        )}
 
        {invalidPositionSize && !entryEqualsSL && (
          <div className="p-4 bg-loss/10 border border-loss/20 text-loss rounded-xl flex items-start gap-3 shadow-[0_8px_32px_rgba(239,68,68,0.02)]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-xs font-mono font-bold uppercase">Please check your entry and stop loss values.</span>
          </div>
        )}
 
        {dailyDrawdownBreached && (
          <div className="p-4 bg-loss/20 border border-loss/40 text-loss rounded-xl flex items-start gap-3 animate-pulse shadow-[0_8px_32px_rgba(239,68,68,0.05)]">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-xs font-display font-bold uppercase">This trade would breach your daily drawdown limit! ({dailyLossLimit}% limit)</span>
          </div>
        )}
 
        {/* Main Math outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Output 1: Position Size */}
          <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl flex flex-col justify-between hover:border-accent/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest font-bold">Calculated Position Size</span>
              <TrendingUp className="w-4 h-4 text-profit opacity-50" />
            </div>
            <div className="mt-8">
              {invalidPositionSize ? (
                <p className="text-2xl font-display font-black text-text-secondary">--</p>
              ) : (
                <>
                  <p className="text-3xl font-display font-black text-profit">
                    {rawPositionSize.toFixed(2)}{" "}
                    <span className="text-xs font-mono font-bold text-text-secondary uppercase">
                      {selectedInstrument.isForex || instrumentId === "gold" || instrumentId === "custom"
                        ? "Lots"
                        : "Contracts"
                      }
                    </span>
                  </p>
                  {(selectedInstrument.isForex || instrumentId === "gold" || instrumentId === "custom") && (
                    <p className="text-[10px] font-mono text-text-tertiary mt-2 uppercase font-bold">
                      {Math.round(units).toLocaleString()} UNITS
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
 
          {/* Output 2: Risk Amount */}
          <div className={cn(
            "p-6 border flex flex-col justify-between rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300",
            riskPercent < 1 
              ? "bg-profit/5 border-profit/20 hover:border-profit/50" 
              : riskPercent <= 2
              ? "bg-warning/5 border-warning/20 hover:border-warning/50"
              : "bg-loss/5 border-loss/20 hover:border-loss/50"
          )}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest font-bold">Risk Amount</span>
              <ShieldAlert className={cn(
                "w-4 h-4 opacity-50",
                riskPercent < 1 ? "text-profit" : riskPercent <= 2 ? "text-warning" : "text-loss"
              )} />
            </div>
            <div className="mt-8">
              <p className={cn(
                "text-3xl font-display font-black",
                riskPercent < 1 ? "text-profit" : riskPercent <= 2 ? "text-warning" : "text-loss"
              )}>
                {selectedCurrency.symbol}{riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] font-mono text-text-tertiary mt-2 uppercase font-bold">
                {riskPercent}% OF ACCOUNT BALANCE
              </p>
            </div>
          </div>
        </div>
 
        {/* Supporting details list */}
        <div className="bg-background-surface border border-border-slate/50 p-6 space-y-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-text-tertiary border-b border-border-slate/30 pb-2">// TRADE METRICS</h4>
          
          <div className="grid grid-cols-2 gap-y-4 text-xs font-mono">
            {/* Output 3: Stop Loss Distance */}
            <div>
              <p className="text-[9px] text-text-tertiary uppercase mb-1 font-bold">Stop Loss Distance</p>
              <p className="text-text-primary font-bold">
                {stopDistancePipsOrPoints.toFixed(1)}{" "}
                {selectedInstrument.isForex || instrumentId === "gold" ? "pips" : "points"}
              </p>
            </div>
 
            {/* Output 5: Account Impact */}
            <div>
              <p className="text-[9px] text-text-tertiary uppercase mb-1 font-bold">Loss Account Balance</p>
              <p className="text-text-primary font-bold">
                {selectedCurrency.symbol}{newBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                <span className="text-text-tertiary text-[10px]">({accountImpactPercent.toFixed(1)}%)</span>
              </p>
            </div>
 
            {/* Output 6: Buffer */}
            <div className="col-span-2">
              <p className="text-[9px] text-text-tertiary uppercase mb-1 font-bold">Longevity / Liquidation Buffer</p>
              <p className="text-text-secondary leading-relaxed">
                At {riskPercent}% risk, you can survive{" "}
                <span className="text-text-primary font-bold">{maxConsecutiveLosses50}</span> consecutive losses before drawdown reaches <span className="text-accent font-bold">50%</span>.
                Total balance liquidation takes <span className="text-loss font-bold">{maxConsecutiveLosses100}</span> losses.
              </p>
            </div>
          </div>
        </div>
 
        {/* Output 4: Potential Profit Grid */}
        <div className="bg-background-surface border border-border-slate/50 p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-text-tertiary border-b border-border-slate/30 pb-2 mb-4">// REWARD TARGETS</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { ratio: "1:1", multiplier: 1 },
              { ratio: "1:2 (Target)", multiplier: 2, highlight: true },
              { ratio: "1:3", multiplier: 3 }
            ].map(rr => (
              <div 
                key={rr.ratio}
                className={cn(
                  "p-4 border rounded-lg",
                  rr.highlight 
                    ? "bg-profit/5 border-profit/30 text-profit font-bold" 
                    : "bg-background-primary border-border-slate/50 text-text-secondary"
                )}
              >
                <p className="text-[10px] font-mono uppercase tracking-wider mb-1 font-bold">{rr.ratio} Reward</p>
                <p className="text-lg font-display font-black text-text-primary">
                  {selectedCurrency.symbol}{(riskAmount * rr.multiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            ))}
          </div>
        </div>
 
        {/* Save/Login Panel */}
        <div className="bg-background-surface border border-border-slate/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          {user ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-secondary font-medium">
                  Logged in as <span className="text-text-primary font-bold">{user.email}</span>
                </p>
                {saveStatus === "success" && (
                  <span className="text-xs text-profit flex items-center gap-1 font-bold">
                    <CheckCircle className="w-4 h-4" /> Saved!
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveCalculation}
                disabled={saveStatus === "saving" || entryEqualsSL || invalidPositionSize}
                className="w-full py-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
              >
                <Save className="w-4 h-4" /> 
                {saveStatus === "saving" ? "Saving..." : "Save Calculation to Trade Journal"}
              </button>
              {saveMessage && (
                <p className={cn(
                  "text-xs font-mono mt-1",
                  saveStatus === "success" ? "text-profit" : "text-loss"
                )}>
                  {saveMessage}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full text-center md:text-left space-y-4">
              <div className="bg-background-primary p-4 border border-dashed border-border-slate/50 text-center rounded-lg">
                <p className="text-xs text-text-secondary leading-relaxed">
                  💡 <span className="text-text-primary font-bold">Sign up free</span> to save these calculations automatically to your Trade Journal database, track your behavior over time, and build a statistical edge.
                </p>
              </div>
              <a
                href="/signup"
                className="block text-center w-full py-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] transition-all rounded-lg"
              >
                Create Free Account
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
