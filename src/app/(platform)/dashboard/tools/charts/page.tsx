import { InteractiveChart } from "@/components/charts/InteractiveChart";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = {
  title: "Professional Chart Analysis | Drawdown",
  description: "Advanced interactive charts with real-time technical indicators, market consensus, and AI-driven analysis for Drawdown members.",
};

export default function ChartsPage() {
  return (
    <div className="space-y-10 stagger-children">
      <header>
        <Breadcrumbs />
        <h1 className="text-3xl font-display font-bold uppercase mt-4 mb-2">Market Analysis</h1>
        <p className="text-text-secondary font-mono text-[10px] uppercase tracking-widest">// Technical Indicator Suite v2.0</p>
      </header>

      <InteractiveChart symbol="GBPUSD" />
      
      {/* Platform Note */}
      <div className="p-6 bg-background-elevated/50 border border-border-slate text-center">
        <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed">
          Drawdown uses high-performance market data feeds. <br />
          Levels and indicator readings are calculated based on exchange-direct liquidity. 
          Use for educational guidance only.
        </p>
      </div>
    </div>
  );
}
