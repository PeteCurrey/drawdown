import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InteractiveChart } from "@/components/charts/InteractiveChart";

interface Props {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  return {
    title: `${symbol} Live Price, Chart & Analysis | Drawdown`,
    description: `Track real-time ${symbol} prices, interactive technical charts, and AI-powered market analysis. Build your trading edge with Drawdown's professional tools.`,
    openGraph: {
      images: [`/api/og?symbol=${symbol}`],
    },
  };
}

export default async function MarketPairPage({ params }: Props) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-6 pt-32 pb-24">
        <header className="mb-12 space-y-6">
          <Breadcrumbs />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-slate pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] uppercase tracking-widest">
                  Live Market
                </span>
                <span className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">
                  Real-time synchronization active
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                {symbol}.
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
                Professional analysis, high-trust technical indicators, and institutional-grade charting for {symbol}. 
                Identify the psychological levels where others fail.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="p-6 bg-background-surface border border-border-slate text-center min-w-[140px]">
                <p className="text-[10px] font-mono uppercase text-text-tertiary mb-1">Volatilty</p>
                <p className="text-xl font-display font-bold uppercase">Stable</p>
              </div>
              <div className="p-6 bg-background-surface border border-border-slate text-center min-w-[140px]">
                <p className="text-[10px] font-mono uppercase text-text-tertiary mb-1">Sentiment</p>
                <p className="text-xl font-display font-bold uppercase text-profit">Bullish</p>
              </div>
            </div>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <InteractiveChart symbol={symbol} userTier="free" />
        </section>

        <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="p-10 bg-background-elevated border border-border-slate space-y-6">
            <h3 className="text-2xl font-display font-bold uppercase">About {symbol} Trading</h3>
            <div className="prose prose-invert prose-sm text-text-secondary">
              <p>
                Trading {symbol} requires an understanding of both technical structure and the psychological barriers that drive liquidity. 
                At Drawdown, we don't just show you price; we show you the process.
              </p>
              <p>
                Our proprietary indicator sets and AI analysis are designed to identify 'exhaustion zones' and 'stop hunts' that retail traders often fall victim to.
              </p>
            </div>
          </div>

          <div className="p-10 bg-accent text-background-primary space-y-8 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-display font-bold uppercase leading-tight">
                Unlock Edge Analysis <br /> for {symbol}.
              </h3>
              <p className="text-sm font-medium leading-relaxed opacity-90 max-w-sm">
                Get Pete's specific take on this setup. Our premium AI signals identify hidden trend shifts before they hit the chart.
              </p>
              <button className="px-8 py-4 bg-background-primary text-text-primary text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                Get Early Access
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-background-primary/10 rounded-full blur-3xl group-hover:bg-background-primary/20 transition-colors" />
          </div>
        </section>
      </div>
    </div>
  );
}
