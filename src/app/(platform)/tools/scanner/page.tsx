"use client";

import { useSearchParams } from "next/navigation";
import { InteractiveChart } from "@/components/charts/InteractiveChart";
import { MarketConsensus } from "@/components/market/MarketConsensus";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Suspense } from "react";

import { SectorHeatmap } from "@/components/market/SectorHeatmap";
import { identifyMSS, ScannerSignal } from "@/lib/scanner";
import { MarketSector } from "@/lib/data/sectors";
import { 
  Grid3X3, 
  Zap, 
  Activity,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

type ScannerTab = 'heatmap' | 'signals' | 'consensus';

function ScannerContent() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  const [activeTab, setActiveTab] = useState<ScannerTab>('heatmap');
  const [sectors, setSectors] = useState<MarketSector[]>([]);
  const [signals, setSignals] = useState<ScannerSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectorRes, consensusRes] = await Promise.all([
          fetch('/api/market/sectors'),
          fetch('/api/market/consensus')
        ]);
        
        const sectorData = await sectorRes.json();
        setSectors(sectorData);

        // For the demo signals, we'll generate some based on recent consensus
        // In reality, this would use identifyMSS(ohlcData)
        const mockSignals: ScannerSignal[] = [
          {
            symbol: 'GBPUSD',
            type: 'MSS_BULLISH',
            time: new Date().toISOString(),
            price: 1.2642,
            strength: 'high',
            context: '1H Structural Shift: Lower-high broken after liquidity sweep.'
          },
          {
            symbol: 'FTSE:UKX',
            type: 'MSS_BEARISH',
            time: new Date().toISOString(),
            price: 7842.10,
            strength: 'medium',
            context: 'Market Structural Shift: Break of 7850 HL on 15M.'
          }
        ];
        setSignals(mockSignals);

      } catch (err) {
        console.error("Scanner fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (symbol) {
    return (
      <div className="space-y-10 pb-24 animate-in fade-in duration-700">
        <header className="space-y-4">
          <Breadcrumbs />
          <div>
            <h1 className="text-3xl font-display font-black uppercase tracking-tight text-white">
              Intelligence: {symbol}
            </h1>
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
              // Advanced technical analysis and AI intelligence for {symbol}
            </p>
          </div>
        </header>
        <InteractiveChart symbol={symbol} userTier="edge" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-4">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-black uppercase tracking-tight text-white">
              Market Radar
            </h1>
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
              // Global technical consensus and structural signals
            </p>
          </div>

          <div className="flex bg-background-surface border border-border-slate p-1">
            {[
              { id: 'heatmap', icon: Grid3X3, label: 'Sector Heatmap' },
              { id: 'signals', icon: Zap, label: 'Structural Signals' },
              { id: 'consensus', icon: Activity, label: 'Global Consensus' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ScannerTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-accent text-background-primary shadow-lg" 
                    : "text-text-tertiary hover:text-text-primary hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3 h-3" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {activeTab === 'heatmap' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectorHeatmap sectors={sectors} />
        </div>
      )}

      {activeTab === 'signals' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {signals.map((signal, i) => (
            <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/40 transition-colors">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center border",
                  signal.type === 'MSS_BULLISH' ? "border-profit/20 bg-profit/5 text-profit" : "border-loss/20 bg-loss/5 text-loss"
                )}>
                  {signal.type === 'MSS_BULLISH' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-display font-black uppercase tracking-tight">{signal.symbol}</h3>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                      signal.type === 'MSS_BULLISH' ? "border-profit/30 text-profit" : "border-loss/30 text-loss"
                    )}>
                      {signal.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">{signal.context}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-mono text-text-tertiary uppercase uppercase">Trigger Price</p>
                  <p className="text-sm font-mono font-bold">{signal.price.toFixed(4)}</p>
                </div>
                <Link 
                  href={`/tools/scanner?symbol=${signal.symbol}`}
                  className="flex-grow md:flex-grow-0 px-6 py-3 bg-background-elevated hover:bg-accent hover:text-background-primary border border-border-slate text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Analyze Context
                </Link>
              </div>
            </div>
          ))}
          <div className="p-10 border border-dashed border-border-slate text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Scanning 20+ markets for institutional block orders and structural shifts...</p>
          </div>
        </div>
      )}

      {activeTab === 'consensus' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <MarketConsensus />
        </div>
      )}
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono text-xs uppercase animate-pulse">Loading Radar...</div>}>
      <ScannerContent />
    </Suspense>
  );
}

