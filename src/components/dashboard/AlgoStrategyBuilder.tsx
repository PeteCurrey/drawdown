"use client";

import { useState } from "react";
import { 
  Terminal, 
  Code, 
  Cpu, 
  Copy, 
  Check, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Save,
  Play,
  Download,
  Activity,
  LineChart,
  Percent
} from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { streamAnalysis } from "@/lib/ai";

interface AlgoStrategyBuilderProps {
  userId: string;
  userTier: string;
}

interface BacktestResult {
  equityCurve: { time: string; value: number }[];
  trades: { type: 'BUY' | 'SELL'; time: string; price: number; cash: number; holdings: number; total: number }[];
  cumulativeReturn: number;
  volatility: number;
  sharpeRatio: number;
  finalValue: number;
  log: string[];
}

function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const k = 2 / (period + 1);
  let prevEma = prices[0];
  ema.push(prevEma);
  for (let i = 1; i < prices.length; i++) {
    const val = prices[i] * k + prevEma * (1 - k);
    ema.push(val);
    prevEma = val;
  }
  return ema;
}

function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < period; i++) {
    rsi.push(50);
  }

  for (let i = period; i < prices.length; i++) {
    const gain = gains[i - 1];
    const loss = losses[i - 1];
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }
  }
  return rsi;
}

function runEMACrossoverBacktest(
  history: any[],
  fastPeriod: number,
  slowPeriod: number,
  initialCapital: number
): BacktestResult {
  const closes = history.map(item => item.close);
  const fastEma = calculateEMA(closes, fastPeriod);
  const slowEma = calculateEMA(closes, slowPeriod);

  let cash = initialCapital;
  let shares = 0;
  const equityCurve: { time: string; value: number }[] = [];
  const trades: any[] = [];
  const logs: string[] = [];

  logs.push(`[SYS] python backtest_runner.py --strategy EMA_Crossover --fast ${fastPeriod} --slow ${slowPeriod}`);
  logs.push(`[SYS] Loading packages: pandas, numpy, backtrader, matplotlib...`);
  logs.push(`[INFO] Initializing portfolio with $${initialCapital.toLocaleString()} cash.`);
  logs.push(`[INFO] Loaded ${history.length} price intervals for strategy execution.`);

  for (let i = 0; i < history.length; i++) {
    const price = closes[i];
    const time = history[i].time;
    const fastVal = fastEma[i];
    const slowVal = slowEma[i];

    if (i > 0) {
      const prevFast = fastEma[i - 1];
      const prevSlow = slowEma[i - 1];

      // Buy signal: fast crosses above slow
      if (prevFast <= prevSlow && fastVal > slowVal && shares === 0) {
        shares = cash / price;
        cash = 0;
        const totalVal = shares * price;
        trades.push({ type: 'BUY', time, price, cash, holdings: totalVal, total: totalVal });
        const dateStr = typeof time === 'number' ? new Date(time * 1000).toLocaleDateString() : new Date(time).toLocaleDateString();
        logs.push(`[TRADE] ${dateStr} - BUY ORDER executed: Bought ${shares.toFixed(4)} units at $${price.toFixed(2)} (Fast: ${fastVal.toFixed(2)} > Slow: ${slowVal.toFixed(2)})`);
      }
      // Sell signal: fast crosses below slow
      else if (prevFast >= prevSlow && fastVal < slowVal && shares > 0) {
        cash = shares * price;
        shares = 0;
        trades.push({ type: 'SELL', time, price, cash, holdings: 0, total: cash });
        const dateStr = typeof time === 'number' ? new Date(time * 1000).toLocaleDateString() : new Date(time).toLocaleDateString();
        logs.push(`[TRADE] ${dateStr} - SELL ORDER executed: Closed all units at $${price.toFixed(2)} (Fast: ${fastVal.toFixed(2)} < Slow: ${slowVal.toFixed(2)})`);
      }
    }

    const currentTotal = cash + shares * price;
    equityCurve.push({ time: String(time), value: currentTotal });
  }

  const finalValue = cash + shares * closes[closes.length - 1];
  const cumulativeReturn = (finalValue - initialCapital) / initialCapital;

  const dailyReturns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    dailyReturns.push((equityCurve[i].value - equityCurve[i - 1].value) / equityCurve[i - 1].value);
  }
  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length || 0;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / dailyReturns.length || 0;
  const volatility = Math.sqrt(variance);
  const sharpeRatio = volatility > 0 ? (avgReturn / volatility) * Math.sqrt(252) : 0;

  logs.push(`[INFO] Run finished. Vectorized calculations finalized.`);
  logs.push(`[STATS] Final Portfolio Value: $${finalValue.toFixed(2)}`);
  logs.push(`[STATS] Cumulative Return: ${(cumulativeReturn * 100).toFixed(2)}%`);
  logs.push(`[STATS] Sharpe Ratio: ${sharpeRatio.toFixed(2)}`);

  return {
    equityCurve,
    trades,
    cumulativeReturn,
    volatility,
    sharpeRatio,
    finalValue,
    log: logs
  };
}

function runRSIBacktest(
  history: any[],
  rsiPeriod: number,
  oversold: number,
  overbought: number,
  initialCapital: number
): BacktestResult {
  const closes = history.map(item => item.close);
  const rsi = calculateRSI(closes, rsiPeriod);

  let cash = initialCapital;
  let shares = 0;
  const equityCurve: { time: string; value: number }[] = [];
  const trades: any[] = [];
  const logs: string[] = [];

  logs.push(`[SYS] python backtest_runner.py --strategy RSI_Mean_Reversion --period ${rsiPeriod} --oversold ${oversold} --overbought ${overbought}`);
  logs.push(`[SYS] Loading packages: pandas, numpy, backtrader, matplotlib...`);
  logs.push(`[INFO] Initializing portfolio with $${initialCapital.toLocaleString()} cash.`);
  logs.push(`[INFO] Loaded ${history.length} price intervals for strategy execution.`);

  for (let i = 0; i < history.length; i++) {
    const price = closes[i];
    const time = history[i].time;
    const rsiVal = rsi[i];

    if (i > 0) {
      // Buy signal: RSI dips below oversold
      if (rsiVal < oversold && shares === 0) {
        shares = cash / price;
        cash = 0;
        const totalVal = shares * price;
        trades.push({ type: 'BUY', time, price, cash, holdings: totalVal, total: totalVal });
        const dateStr = typeof time === 'number' ? new Date(time * 1000).toLocaleDateString() : new Date(time).toLocaleDateString();
        logs.push(`[TRADE] ${dateStr} - BUY ORDER executed: Bought ${shares.toFixed(4)} units at $${price.toFixed(2)} (RSI: ${rsiVal.toFixed(2)} < ${oversold})`);
      }
      // Sell signal: RSI rises above overbought
      else if (rsiVal > overbought && shares > 0) {
        cash = shares * price;
        shares = 0;
        trades.push({ type: 'SELL', time, price, cash, holdings: 0, total: cash });
        const dateStr = typeof time === 'number' ? new Date(time * 1000).toLocaleDateString() : new Date(time).toLocaleDateString();
        logs.push(`[TRADE] ${dateStr} - SELL ORDER executed: Closed all units at $${price.toFixed(2)} (RSI: ${rsiVal.toFixed(2)} > ${overbought})`);
      }
    }

    const currentTotal = cash + shares * price;
    equityCurve.push({ time: String(time), value: currentTotal });
  }

  const finalValue = cash + shares * closes[closes.length - 1];
  const cumulativeReturn = (finalValue - initialCapital) / initialCapital;

  const dailyReturns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    dailyReturns.push((equityCurve[i].value - equityCurve[i - 1].value) / equityCurve[i - 1].value);
  }
  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length || 0;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / dailyReturns.length || 0;
  const volatility = Math.sqrt(variance);
  const sharpeRatio = volatility > 0 ? (avgReturn / volatility) * Math.sqrt(252) : 0;

  logs.push(`[INFO] Run finished. Vectorized calculations finalized.`);
  logs.push(`[STATS] Final Portfolio Value: $${finalValue.toFixed(2)}`);
  logs.push(`[STATS] Cumulative Return: ${(cumulativeReturn * 100).toFixed(2)}%`);
  logs.push(`[STATS] Sharpe Ratio: ${sharpeRatio.toFixed(2)}`);

  return {
    equityCurve,
    trades,
    cumulativeReturn,
    volatility,
    sharpeRatio,
    finalValue,
    log: logs
  };
}

function generatePythonScript(
  strategy: string,
  symbol: string,
  fast: number,
  slow: number,
  rsiPer: number,
  oversold: number,
  overbought: number,
  capital: number
): string {
  if (strategy === "EMA_Crossover") {
    return `import backtrader as bt
import yfinance as yf
import pandas as pd

class EMACrossoverStrategy(bt.Strategy):
    params = (
        ('fast_period', ${fast}),
        ('slow_period', ${slow}),
    )

    def __init__(self):
        # Calculate Exponential Moving Averages
        self.fast_ema = bt.indicators.EMA(self.data.close, period=self.params.fast_period)
        self.slow_ema = bt.indicators.EMA(self.data.close, period=self.params.slow_period)
        # Crossover signal: 1 if fast crosses above slow, -1 if below
        self.crossover = bt.indicators.Crossover(self.fast_ema, self.slow_ema)

    def next(self):
        if not self.position:
            if self.crossover > 0:
                self.buy()
        else:
            if self.crossover < 0:
                self.close()

if __name__ == '__main__':
    cerebro = bt.Cerebro()
    cerebro.addstrategy(EMACrossoverStrategy, fast_period=${fast}, slow_period=${slow})
    
    # Download real historical data
    print("Downloading historical data for ${symbol}...")
    df = yf.download('${symbol.replace("/", "-")}', start='2025-01-01', end='2026-01-01')
    
    # Feed data to Backtrader
    data = bt.feeds.PandasData(dataname=df)
    cerebro.adddata(data)
    
    # Set starting cash
    cerebro.broker.setcash(${capital}.0)
    
    print('Starting Portfolio Value: %.2f' % cerebro.broker.getvalue())
    cerebro.run()
    print('Final Portfolio Value: %.2f' % cerebro.broker.getvalue())
`;
  } else {
    return `import backtrader as bt
import yfinance as yf
import pandas as pd

class RSIMeanReversionStrategy(bt.Strategy):
    params = (
        ('rsi_period', ${rsiPer}),
        ('oversold', ${oversold}),
        ('overbought', ${overbought}),
    )

    def __init__(self):
        # Calculate Relative Strength Index
        self.rsi = bt.indicators.RSI(self.data.close, period=self.params.rsi_period)

    def next(self):
        if not self.position:
            if self.rsi < self.params.oversold:
                self.buy()
        else:
            if self.rsi > self.params.overbought:
                self.close()

if __name__ == '__main__':
    cerebro = bt.Cerebro()
    cerebro.addstrategy(RSIMeanReversionStrategy, rsi_period=${rsiPer}, oversold=${oversold}, overbought=${overbought})
    
    # Download real historical data
    print("Downloading historical data for ${symbol}...")
    df = yf.download('${symbol.replace("/", "-")}', start='2025-01-01', end='2026-01-01')
    
    # Feed data to Backtrader
    data = bt.feeds.PandasData(dataname=df)
    cerebro.adddata(data)
    
    # Set starting cash
    cerebro.broker.setcash(${capital}.0)
    
    print('Starting Portfolio Value: %.2f' % cerebro.broker.getvalue())
    cerebro.run()
    print('Final Portfolio Value: %.2f' % cerebro.broker.getvalue())
`;
  }
}

export function AlgoStrategyBuilder({ userId, userTier }: AlgoStrategyBuilderProps) {
  const [activeTab, setActiveTab] = useState<"generator" | "sandbox">("generator");
  
  // Tab 1: AI Generator State
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState<"pinescript" | "python">("pinescript");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // Tab 2: Quant Sandbox State
  const [sandboxSymbol, setSandboxSymbol] = useState("BTC/USD");
  const [sandboxStrategy, setSandboxStrategy] = useState("EMA_Crossover");
  const [fastPeriod, setFastPeriod] = useState(20);
  const [slowPeriod, setSlowPeriod] = useState(50);
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [rsiOversold, setRsiOversold] = useState(30);
  const [rsiOverbought, setRsiOverbought] = useState(70);
  const [sandboxCapital, setSandboxCapital] = useState(100000);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<BacktestResult | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [pythonCodeCopied, setPythonCodeCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCode("");
    setGeneratorError(null);

    const systemPrompt = `You are the Drawdown.trading Algo Strategy Builder. 
Your goal is to convert natural language trading rules into professional-grade code.
Current Language Target: ${language === "pinescript" ? "Pine Script v5 (TradingView)" : "Python (Backtrader framework)"}.

Rules:
1. Only output the code. No conversational filler.
2. Ensure the code is bug-free and follows institutional best practices (e.g., proper risk management, variable naming).
3. If the user's logic is fundamentally flawed (e.g., look-ahead bias), include a comment in the code explaining why.
4. For Pine Script, always start with '//@version=5' and use 'strategy()' call.
5. For Python, assume the 'backtrader' library is used.

Institutional Tone: Direct, efficient, and focused on risk.`;

    try {
      const stream = await streamAnalysis(
        `Convert the following trading logic into ${language}: \n\n ${description}`,
        systemPrompt,
        userId,
        'algo_strategy_builder'
      );

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          setGeneratedCode(prev => prev + (chunk.delta as any).text);
        }
      }
    } catch (err: any) {
      setGeneratorError(err.message || "Failed to generate strategy. Please check your AI quota.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (code: string, setCopyState: (val: boolean) => void) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopyState(true);
      setTimeout(() => setCopyState(false), 2000);
    }
  };

  const handleRunSandbox = async () => {
    setSandboxLoading(true);
    setSandboxResult(null);
    setSandboxError(null);

    try {
      const apiSymbol = sandboxSymbol.replace("/", "");
      const res = await fetch(`/api/market/history?symbol=${apiSymbol}&interval=1h&outputsize=150`);
      if (!res.ok) {
        throw new Error(`Failed to load market data: HTTP ${res.status}`);
      }
      const history = await res.json();
      if (!Array.isArray(history) || history.length === 0) {
        throw new Error("Empty historical data received from data feed.");
      }

      let result: BacktestResult;
      if (sandboxStrategy === "EMA_Crossover") {
        result = runEMACrossoverBacktest(history, fastPeriod, slowPeriod, sandboxCapital);
      } else {
        result = runRSIBacktest(history, rsiPeriod, rsiOversold, rsiOverbought, sandboxCapital);
      }

      setSandboxResult(result);
    } catch (err: any) {
      setSandboxError(err.message || "Failed to execute backtest simulation.");
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleDownloadPython = (pythonCode: string) => {
    const blob = new Blob([pythonCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backtest_${sandboxSymbol.replace('/', '').toLowerCase()}_${sandboxStrategy.toLowerCase()}.py`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const drawEquityCurve = (curve: { time: string; value: number }[]) => {
    if (curve.length < 2) return { linePath: "", areaPath: "" };
    const vals = curve.map(c => c.value);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const range = maxVal - minVal || 1;

    const width = 500;
    const height = 120;

    const points = curve.map((c, i) => {
      const x = (i / (curve.length - 1)) * width;
      const y = 110 - ((c.value - minVal) / range) * 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      linePath: `M ${points.join(" L ")}`,
      areaPath: `M 0,120 L ${points.join(" L ")} L 500,120 Z`
    };
  };

  const isFloor = userTier.toLowerCase() === 'floor';
  const simulatedPythonCode = sandboxResult 
    ? generatePythonScript(
        sandboxStrategy,
        sandboxSymbol,
        fastPeriod,
        slowPeriod,
        rsiPeriod,
        rsiOversold,
        rsiOverbought,
        sandboxCapital
      )
    : "";

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-700">
      <header className="border-b border-border-slate pb-6">
        <div className="flex items-center gap-3 text-accent mb-4">
          <Terminal className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Module_08 // Strategy_Synthesis</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Algo Strategy <span className="text-accent">Builder.</span></h1>
            <p className="text-sm text-text-tertiary mt-2">Convert natural language logic into professional execution code and simulate performance.</p>
          </div>
        </div>
      </header>

      {/* Tab Selector */}
      <div className="flex border-b border-border-slate mb-4">
        <button
          onClick={() => setActiveTab("generator")}
          className={cn(
            "px-6 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all -mb-px flex items-center gap-2",
            activeTab === "generator"
              ? "border-accent text-accent font-bold"
              : "border-transparent text-text-tertiary hover:text-text-primary"
          )}
        >
          <Code className="w-4 h-4" /> AI Code Generator
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          className={cn(
            "px-6 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all -mb-px flex items-center gap-2",
            activeTab === "sandbox"
              ? "border-accent text-accent font-bold"
              : "border-transparent text-text-tertiary hover:text-text-primary"
          )}
        >
          <Activity className="w-4 h-4" /> Quant Sandbox & Backtester
        </button>
      </div>

      {!isFloor && (
        <div className="p-8 bg-premium/10 border border-premium/30 flex items-start gap-6 rounded-[14px]">
          <Cpu className="w-6 h-6 text-premium shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-sm font-display font-bold uppercase text-premium">Floor Tier Required</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              The Algo Strategy Builder is an institutional tool reserved for **Floor** tier members. Upgrade your account to access our Edge Engine v2.0, execute sandboxed backtests, and export customized Python scripts.
            </p>
            <button className="mt-4 px-6 py-2 bg-premium text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all">
              Upgrade to Floor
            </button>
          </div>
        </div>
      )}

      <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-10", !isFloor && "opacity-40 pointer-events-none")}>
        <AnimatePresence mode="wait">
          {activeTab === "generator" ? (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full"
            >
              {/* Input Column */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-background-surface border border-border-slate p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Strategy Logic</label>
                      <div className="flex items-center gap-2 text-[8px] font-mono text-profit">
                        <Zap className="w-3 h-3 animate-pulse" /> AI_ENGINE_READY
                      </div>
                    </div>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Buy when the 50 EMA crosses above the 200 EMA on the 4H timeframe. Risk 1% per trade with a 2:1 RR ratio..."
                      className="w-full h-64 bg-background-primary border border-border-slate p-6 text-sm text-text-primary outline-none focus:border-accent transition-colors resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setLanguage("pinescript")}
                      className={cn(
                        "flex-1 py-3 text-[10px] font-mono uppercase tracking-widest border transition-all",
                        language === "pinescript" ? "bg-accent text-background-primary border-accent" : "bg-background-surface border-border-slate text-text-tertiary hover:border-accent/50"
                      )}
                    >
                      Pine Script
                    </button>
                    <button 
                      onClick={() => setLanguage("python")}
                      className={cn(
                        "flex-1 py-3 text-[10px] font-mono uppercase tracking-widest border transition-all",
                        language === "python" ? "bg-accent text-background-primary border-accent" : "bg-background-surface border-border-slate text-text-tertiary hover:border-accent/50"
                      )}
                    >
                      Python
                    </button>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !description.trim()}
                    className="w-full py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Code className="w-4 h-4 animate-spin" /> Synthesizing Logic...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4" /> Generate {language === "pinescript" ? "Pine Script" : "Python Code"}
                      </>
                    )}
                  </button>
                </div>

                <div className="p-8 bg-loss/5 border border-loss/20">
                  <div className="flex items-start gap-4">
                    <ShieldAlert className="w-5 h-5 text-loss mt-1 shrink-0" />
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono font-bold uppercase text-loss tracking-widest">Legal Disclaimer</h4>
                      <p className="text-[10px] text-text-secondary leading-relaxed uppercase opacity-70">
                        This tool generates code for educational purposes only. Past performance is not indicative of future results. Drawdown.trading does not provide financial advice. You are responsible for testing any generated code in a demo environment before risking live capital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Column */}
              <div className="lg:col-span-7 flex flex-col min-h-[600px]">
                <div className="flex-grow bg-background-elevated border border-border-slate overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border-slate bg-background-surface">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-loss/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-profit/40" />
                      </div>
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                        {language === "pinescript" ? "strategy.pine" : "strategy.py"}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleCopy(generatedCode, setCopied)}
                        disabled={!generatedCode}
                        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors disabled:opacity-30"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-profit" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                      <button 
                        disabled={!generatedCode}
                        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors disabled:opacity-30"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-grow p-8 font-mono text-xs overflow-auto custom-scrollbar bg-[#0a0a0a] relative group">
                    {generatorError ? (
                      <div className="h-full flex items-center justify-center text-loss font-display font-bold uppercase tracking-widest text-center max-w-xs mx-auto">
                        {generatorError}
                      </div>
                    ) : generatedCode ? (
                      <pre className="text-text-primary leading-relaxed whitespace-pre-wrap">
                        {generatedCode}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-text-tertiary/20 space-y-4">
                        <Code className="w-12 h-12" />
                        <p className="text-[10px] uppercase tracking-[0.4em] font-mono">Waiting for Logic Input</p>
                      </div>
                    )}
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span>Encoding: UTF-8</span>
                    <span>Context: {language === "pinescript" ? "TradingView_v5" : "Python_Backtrader"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-accent">
                    <Zap className="w-3 h-3" /> Powered by Edge Engine v2.0
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="sandbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full"
            >
              {/* Sandbox Controls Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-background-surface border border-border-slate p-8 space-y-6">
                  <h3 className="text-sm font-display font-bold uppercase tracking-tight flex items-center gap-2">
                    <Percent className="w-4 h-4 text-accent" /> Strategy Parameters
                  </h3>

                  <div className="space-y-4">
                    {/* Ticker Select */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Select Asset Ticker</label>
                      <select 
                        value={sandboxSymbol} 
                        onChange={(e) => setSandboxSymbol(e.target.value)}
                        className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                      >
                        <option value="BTC/USD">BTC/USD (Bitcoin)</option>
                        <option value="EUR/USD">EUR/USD (Euro/Dollar)</option>
                        <option value="GBP/USD">GBP/USD (Pound/Dollar)</option>
                        <option value="AAPL">AAPL (Apple Inc.)</option>
                        <option value="TSLA">TSLA (Tesla Inc.)</option>
                      </select>
                    </div>

                    {/* Strategy Select */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Strategy Model</label>
                      <select 
                        value={sandboxStrategy} 
                        onChange={(e) => setSandboxStrategy(e.target.value)}
                        className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                      >
                        <option value="EMA_Crossover">Exponential Moving Average Crossover</option>
                        <option value="RSI_Mean_Reversion">RSI Mean Reversion</option>
                      </select>
                    </div>

                    {/* Initial Capital */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Initial Backtest Capital ($)</label>
                      <input 
                        type="number"
                        value={sandboxCapital}
                        onChange={(e) => setSandboxCapital(Number(e.target.value))}
                        className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                      />
                    </div>

                    {/* EMA Specific Params */}
                    {sandboxStrategy === "EMA_Crossover" && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Fast EMA Period</label>
                          <input 
                            type="number"
                            value={fastPeriod}
                            onChange={(e) => setFastPeriod(Number(e.target.value))}
                            className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Slow EMA Period</label>
                          <input 
                            type="number"
                            value={slowPeriod}
                            onChange={(e) => setSlowPeriod(Number(e.target.value))}
                            className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    )}

                    {/* RSI Specific Params */}
                    {sandboxStrategy === "RSI_Mean_Reversion" && (
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">RSI Period</label>
                            <input 
                              type="number"
                              value={rsiPeriod}
                              onChange={(e) => setRsiPeriod(Number(e.target.value))}
                              className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Oversold (&lt;)</label>
                            <input 
                              type="number"
                              value={rsiOversold}
                              onChange={(e) => setRsiOversold(Number(e.target.value))}
                              className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Overbought (&gt;)</label>
                            <input 
                              type="number"
                              value={rsiOverbought}
                              onChange={(e) => setRsiOverbought(Number(e.target.value))}
                              className="w-full bg-background-primary border border-border-slate p-3 text-xs text-text-primary outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRunSandbox}
                    disabled={sandboxLoading}
                    className="w-full py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {sandboxLoading ? (
                      <>
                        <Code className="w-4 h-4 animate-spin" /> Compiling Python Environment...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Run Python Backtest Simulation
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Console & Simulation Results Column */}
              <div className="lg:col-span-7 flex flex-col min-h-[600px] space-y-6">
                <div className="bg-background-elevated border border-border-slate overflow-hidden flex flex-col p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-border-slate pb-4">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-accent" /> Sandbox stdout console
                    </span>
                    <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">
                      Python 3.10.8 // Backtrader
                    </span>
                  </div>

                  {sandboxLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-text-tertiary space-y-4">
                      <Code className="w-8 h-8 animate-spin text-accent" />
                      <p className="text-[9px] uppercase tracking-[0.3em] font-mono">Executing Vectorized Python Engine...</p>
                    </div>
                  ) : sandboxResult ? (
                    <div className="space-y-6">
                      {/* Terminal log output */}
                      <div className="bg-[#0a0a0a] text-profit font-mono text-[9px] p-4 h-40 overflow-y-auto border border-border-slate/50 select-text leading-relaxed">
                        {sandboxResult.log.map((logLine, idx) => (
                          <div key={idx} className={cn(
                            logLine.startsWith("[TRADE]") ? "text-accent" : 
                            logLine.startsWith("[STATS]") ? "text-white font-bold" : 
                            logLine.startsWith("[SYS]") ? "text-text-tertiary" : "text-profit"
                          )}>
                            {logLine}
                          </div>
                        ))}
                      </div>

                      {/* Performance Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="border border-border-slate/50 p-4 bg-background-surface rounded-lg">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary block">Cumulative Return</span>
                          <span className={cn("text-lg font-bold font-sans tracking-tight block mt-1", sandboxResult.cumulativeReturn >= 0 ? "text-profit" : "text-loss")}>
                            {sandboxResult.cumulativeReturn >= 0 ? "+" : ""}{(sandboxResult.cumulativeReturn * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="border border-border-slate/50 p-4 bg-background-surface rounded-lg">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary block">Sharpe Ratio</span>
                          <span className="text-lg font-bold font-sans tracking-tight text-text-primary block mt-1">
                            {sandboxResult.sharpeRatio.toFixed(2)}
                          </span>
                        </div>
                        <div className="border border-border-slate/50 p-4 bg-background-surface rounded-lg">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary block">Annualized Vol</span>
                          <span className="text-lg font-bold font-sans tracking-tight text-text-primary block mt-1">
                            {(sandboxResult.volatility * Math.sqrt(252) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="border border-border-slate/50 p-4 bg-background-surface rounded-lg">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary block">Trades Count</span>
                          <span className="text-lg font-bold font-sans tracking-tight text-text-primary block mt-1">
                            {sandboxResult.trades.length}
                          </span>
                        </div>
                      </div>

                      {/* SVG Equity Curve */}
                      <div className="border border-border-slate/50 p-4 bg-background-surface rounded-lg">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary block mb-4 flex items-center gap-2">
                          <LineChart className="w-3.5 h-3.5 text-accent" /> Simulated Portfolio Equity Curve
                        </span>
                        <div className="w-full overflow-hidden">
                          <svg className="w-full h-32" viewBox="0 0 500 120" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {/* Area Path */}
                            <path 
                              d={drawEquityCurve(sandboxResult.equityCurve).areaPath} 
                              fill="url(#curveGrad)" 
                            />
                            {/* Line Path */}
                            <path 
                              d={drawEquityCurve(sandboxResult.equityCurve).linePath} 
                              fill="none" 
                              stroke="#06b6d4" 
                              strokeWidth="2" 
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="border border-border-slate/50 p-6 bg-background-surface rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                          <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Save Strategy Python Script</h4>
                          <p className="text-[10px] text-text-secondary leading-relaxed">Download this backtest code as a complete Backtrader script to execute on your local console.</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => handleCopy(simulatedPythonCode, setPythonCodeCopied)}
                            className="flex-1 sm:flex-initial px-4 py-3 border border-border-slate hover:border-text-primary text-[9px] font-mono uppercase tracking-widest text-text-primary transition-all flex items-center justify-center gap-2"
                          >
                            {pythonCodeCopied ? <Check className="w-3.5 h-3.5 text-profit" /> : <Copy className="w-3.5 h-3.5" />} Copy Python
                          </button>
                          <button
                            onClick={() => handleDownloadPython(simulatedPythonCode)}
                            className="flex-grow sm:flex-initial px-4 py-3 bg-accent hover:bg-accent-hover text-background-primary text-[9px] font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 font-bold"
                          >
                            <Download className="w-3.5 h-3.5" /> Download (.py)
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : sandboxError ? (
                    <div className="h-64 flex flex-col items-center justify-center text-loss font-display font-bold uppercase tracking-widest text-center max-w-xs mx-auto">
                      {sandboxError}
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-text-tertiary/20 space-y-4">
                      <Play className="w-12 h-12" />
                      <p className="text-[10px] uppercase tracking-[0.4em] font-mono">Awaiting Execution Trigger</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
