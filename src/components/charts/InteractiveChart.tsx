"use client";

import { useState, useRef, useEffect } from "react";
import { createChart, ColorType, ISeriesApi } from "lightweight-charts";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Settings, 
  Maximize2, 
  ChevronDown, 
  BarChart2, 
  Info,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { AIChartAnalysis } from "./AIChartAnalysis";
import { TierLockOverlay } from "@/components/ui/TierLockOverlay";

interface ChartProps {
  initialData?: any[];
  symbol?: string;
  userTier?: "free" | "foundation" | "edge" | "floor";
}

export function InteractiveChart({ initialData = [], symbol = "GBPUSD", userTier = "foundation" }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isLockedByTier, setIsLockedByTier] = useState(false);
  const [indicators, setIndicators] = useState({
// ... rest of state
    ma20: true,
    ma50: true,
    ma200: true,
    rsi: true,
    bollinger: false
  });

  const [consensus, setConsensus] = useState({
    score: 65,
    verdict: "Strong Buy",
    reason: "Price is above 200 SMA and RSI shows momentum building."
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#08090D" },
        textColor: "#8C8B87",
        fontFamily: "JetBrains Mono",
      },
      grid: {
        vertLines: { color: "#1A1D24" },
        horzLines: { color: "#1A1D24" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        borderColor: "#1A1D24",
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#00E676",
      downColor: "#FF3D57",
      borderVisible: false,
      wickUpColor: "#00E676",
      wickDownColor: "#FF3D57",
    });

    // Mock data for initial load
    const data = Array.from({ length: 100 }, (_, i) => ({
      time: (Date.now() / 1000 - (100 - i) * 3600) as any,
      open: 1.2700 + Math.random() * 0.01,
      high: 1.2800 + Math.random() * 0.01,
      low: 1.2600 + Math.random() * 0.01,
      close: 1.2750 + Math.random() * 0.01,
    }));

    candlestickSeries.setData(data);
    lineSeriesRef.current = candlestickSeries;
    chartRef.current = chart;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-background-surface p-4 border border-border-slate">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-black text-text-primary">{symbol}</span>
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          </div>
          <div className="flex items-center gap-1 bg-background-elevated px-2 py-1">
            <span className="text-[10px] font-mono font-bold text-accent uppercase">1H</span>
          </div>
          <div className="h-4 w-[1px] bg-border-slate" />
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-profit">H 1.2845</span>
            <span className="text-loss">L 1.2712</span>
            <span className="text-text-secondary">C 1.2756</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-background-elevated text-text-tertiary transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-background-elevated text-text-tertiary transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative border border-border-slate bg-[#08090D] overflow-hidden">
            <div ref={chartContainerRef} className="w-full h-[500px]" />
            
            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 z-10 flex gap-4 pointer-events-none">
              {indicators.ma20 && (
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-text-tertiary uppercase">EMA 20</span>
                  <span className="text-text-primary">1.2745</span>
                </div>
              )}
              {indicators.ma50 && (
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-text-tertiary uppercase">SMA 50</span>
                  <span className="text-text-primary">1.2710</span>
                </div>
              )}
            </div>
          </div>

          {/* Indicator Verdicts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "RSI (14)", value: "58.2", status: "Neutral", color: "text-text-secondary" },
              { label: "MACD", value: "Bullish", status: "Momentum", color: "text-profit" },
              { label: "ADX", value: "24.1", status: "Trending", color: "text-accent" },
              { label: "Volatile", value: "0.12%", status: "Stable", color: "text-text-tertiary" },
            ].map((ind, i) => (
              <div key={i} className="bg-background-surface border border-border-slate p-4">
                <p className="text-[8px] font-mono uppercase text-text-tertiary mb-1">{ind.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-display font-bold uppercase">{ind.value}</span>
                  <span className={cn("text-[8px] font-mono font-black uppercase", ind.color)}>{ind.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-background-elevated border border-border-slate p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Global Consensus</span>
              <Info className="w-3 h-3 text-text-tertiary" />
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="60" fill="none" stroke="#1A1D24" strokeWidth="8" />
                  <circle 
                    cx="64" cy="64" r="60" fill="none" stroke="#00C2FF" strokeWidth="8" 
                    strokeDasharray={377} 
                    strokeDashoffset={377 * (1 - consensus.score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-display font-black text-accent">{consensus.score}%</span>
                  <span className="text-[8px] font-mono uppercase text-text-tertiary">Bullish</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className={cn(
                  "text-xl font-display font-bold uppercase",
                  consensus.score > 60 ? "text-profit" : "text-loss"
                )}>
                  {consensus.verdict}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {consensus.reason}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-border-slate space-y-4">
              <button 
                onClick={() => {
                  if (userTier === "free" || userTier === "foundation") {
                    setIsLockedByTier(true);
                  } else {
                    setIsAIAnalysisOpen(true);
                  }
                }}
                className="w-full bg-accent hover:bg-accent-hover text-background-primary py-4 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                Ask AI Analysis
              </button>
              <p className="text-[8px] text-center text-text-tertiary uppercase leading-relaxed">
                Aggregated market signals for educational reference. Not financial advice.
              </p>
            </div>
          </div>

          <div className="bg-background-surface border border-border-slate p-6 space-y-4">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Indicators Panel</h5>
            <div className="space-y-2">
              {Object.entries(indicators).map(([key, val]) => (
                <button 
                  key={key}
                  onClick={() => setIndicators(prev => ({ ...prev, [key]: !val }))}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors",
                    val ? "border-accent text-accent bg-accent/5" : "border-border-slate text-text-tertiary hover:border-text-secondary"
                  )}
                >
                  {key.replace(/([A-Z])/g, ' $1')}
                  <div className={cn("w-2 h-2 rounded-full", val ? "bg-accent shadow-[0_0_8px_rgba(0,194,255,0.5)]" : "bg-text-tertiary/20")} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Side Panel */}
      <AIChartAnalysis 
        symbol={symbol} 
        indicators={indicators} 
        isOpen={isAIAnalysisOpen} 
        onClose={() => setIsAIAnalysisOpen(false)} 
      />

      {/* Tier Gating Overlay */}
      {isLockedByTier && (
        <TierLockOverlay 
          requiredTier="edge" 
          featureName="AI Chart Intelligence" 
          description="Access deep technical insights and pattern recognition powered by Pete's AI Voice."
          className="z-[70]"
        />
      )}
    </div>
  );
}
