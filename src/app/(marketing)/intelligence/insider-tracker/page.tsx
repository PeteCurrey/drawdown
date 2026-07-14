import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  ArrowRight,
  UserCheck,
  Zap,
  BarChart4,
  Lock
} from "lucide-react";
import Link from "next/link";
import { getInsiderTransactions } from "@/lib/market";

export const metadata = getMetadata({
  title: "Insider Trading Tracker — Follow the Smart Money",
  description: "Track CEO and Director stock purchases in real-time. See what the bosses are buying before the market reacts.",
  path: "/intelligence/insider-tracker"
});

export default async function InsiderTrackerLanding() {
  // Fetch real sample data (e.g. for a major tech stock)
  const sampleData = await getInsiderTransactions("NVDA");
  const recentPurchases = sampleData.slice(0, 5);

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <header className="max-w-4xl mb-24">
          <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> // INTELLIGENCE HUB
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-[0.9]">
            Shadow the <br /> <span className="text-accent">Decision Makers.</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed font-sans max-w-2xl">
            CEOs sell for many reasons, but they only buy for one: they think the price is going up. Our Insider Tracker monitors SEC filings in real-time to give you the ultimate edge.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/signup" className="px-10 py-5 bg-accent text-background-primary font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all flex items-center gap-2">
              Get Live Alerts <Zap className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: "Real-Time SEC Feeds",
              desc: "Direct integration with FinnHub and SEC Form 4 filings for zero-latency monitoring.",
              icon: Eye
            },
            {
              title: "Conviction Scoring",
              desc: "We analyze the size of the purchase relative to the executive's total net worth.",
              icon: BarChart4
            },
            {
              title: "Cluster Alerts",
              desc: "Get notified when multiple directors buy the same stock simultaneously.",
              icon: UserCheck
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-background-surface border border-border-slate hover:border-accent/50 transition-colors group">
              <feature.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold uppercase mb-4">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Data Preview (The "Hook") */}
        <div className="bg-background-surface border border-border-slate overflow-hidden mb-32">
          <div className="p-6 border-b border-border-slate bg-background-elevated/50 flex justify-between items-center">
            <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-profit" /> Recent High-Conviction Trades (Preview)
            </h2>
            <span className="text-[10px] font-mono text-text-tertiary">LIVE DATA — {new Date().toLocaleDateString()}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-primary/50 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                <tr>
                  <th className="px-8 py-4">Executive</th>
                  <th className="px-8 py-4">Symbol</th>
                  <th className="px-8 py-4">Shares</th>
                  <th className="px-8 py-4">Value</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {recentPurchases.map((trade: any, i: number) => (
                  <tr key={i} className="hover:bg-background-elevated/20 transition-colors blur-[2px] hover:blur-0 cursor-pointer">
                    <td className="px-8 py-5 font-display font-bold text-sm tracking-tight">{trade.name || 'DIRECTOR'}</td>
                    <td className="px-8 py-5 font-mono text-accent">NVDA</td>
                    <td className="px-8 py-5 font-mono">{(trade.share || 0).toLocaleString()}</td>
                    <td className="px-8 py-5 font-mono text-profit">+${((trade.share || 0) * (trade.transactionPrice || 100) / 1000).toFixed(1)}K</td>
                    <td className="px-8 py-5 text-right">
                      <Lock className="w-3 h-3 text-text-tertiary ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-12 text-center bg-gradient-to-t from-background-elevated to-transparent">
             <p className="text-sm text-text-secondary mb-6 font-medium">Join Edge+ to unlock full access to real-time insider tracking and automated alerts.</p>
             <Link href="/pricing" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
               Upgrade to Unlock <ArrowRight className="w-3 h-3" />
             </Link>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-accent p-12 md:p-20 text-center space-y-8">
          <h2 className="  font-display font-bold text-background-primary uppercase leading-tight">
            Stop Guessing. <br /> Follow the Truth.
          </h2>
          <p className="text-background-primary/80 font-mono text-sm max-w-xl mx-auto uppercase tracking-wider">
            Access professional-grade insider intelligence and build a portfolio backed by the people who know the numbers best.
          </p>
          <Link href="/signup" className="inline-flex items-center space-x-3 bg-background-primary text-text-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all">
            <span>Join Drawdown Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
