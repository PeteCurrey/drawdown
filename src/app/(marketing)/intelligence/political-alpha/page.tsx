import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Scale,
  Landmark,
  Target
} from "lucide-react";
import Link from "next/link";
import { getCongressionalTrading } from "@/lib/market";
import { cn } from "@/lib/utils";

export const metadata = getMetadata({
  title: "Political Alpha Tracker — Trade Like Congress",
  description: "Monitor stock trades by members of Congress and the Senate. Real-time tracking of political financial activity for retail traders.",
  path: "/intelligence/political-alpha"
});

export default async function PoliticalAlphaLanding() {
  // Fetch real sample data
  const sampleData = await getCongressionalTrading();
  const recentTrades = sampleData.slice(0, 5);

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        
        <header className="max-w-4xl mb-24">
          <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Landmark className="w-3 h-3" /> // INTELLIGENCE HUB
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 leading-[0.9]">
            Political <br /> <span className="text-accent">Alpha.</span>
          </h1>
          <p className="text-xl text-mkt-i2 leading-relaxed font-sans max-w-2xl">
            When major policy is being drafted, the market reacts. But some react before others. We track every stock trade made by the U.S. House and Senate so you can see the flow before it hits the tape.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/signup" className="px-10 py-5 bg-mkt-ink text-white font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all flex items-center gap-2">
              Start Tracking Congress <Zap className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {[
            { title: "House & Senate", desc: "Comprehensive coverage of both chambers.", icon: Landmark },
            { title: "Policy Correlative", desc: "AI-linking of trades to active committee work.", icon: Scale },
            { title: "Zero Latency", desc: "Automated scraping of disclosure reports.", icon: Globe },
            { title: "Targeted Alerts", desc: "Follow specific reps or senators.", icon: Target },
          ].map((item, i) => (
            <div key={i} className="p-8 border border-mkt-bd bg-white hover:bg-[#F7F7F7] transition-colors">
              <item.icon className="w-6 h-6 text-accent mb-6" />
              <h3 className="text-sm font-sans font-bold uppercase mb-2 tracking-wider">{item.title}</h3>
              <p className="text-xs text-mkt-i4 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Data Preview */}
        <div className="bg-white border border-mkt-bd overflow-hidden mb-32">
          <div className="p-6 border-b border-mkt-bd bg-[#F7F7F7]/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4 text-accent" /> Recent Congressional Disclosures
              </h2>
              <p className="text-[10px] text-mkt-i4 font-mono mt-1">FOLLOW THE FLOW OF THE CAPITAL HILL</p>
            </div>
            <div className="px-3 py-1 bg-loss/10 border border-loss/20 text-red-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-loss animate-pulse" /> Live Feed Active
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/50 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-b border-mkt-bd">
                <tr>
                  <th className="px-8 py-4">Representative</th>
                  <th className="px-8 py-4">Symbol</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {recentTrades.map((trade: any, i: number) => (
                  <tr key={i} className="hover:bg-[#F7F7F7]/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-sm tracking-tight">{trade.name || 'U.S. REP'}</span>
                        <span className="text-[9px] font-mono text-mkt-i4">COMMITTEE: [PROTECTED]</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-accent">{trade.symbol}</td>
                    <td className="px-8 py-5">
                       <span className={cn(
                         "text-[10px] font-bold uppercase tracking-widest",
                         trade.transactionType === 'Purchase' ? "text-mkt-grn" : "text-red-500"
                       )}>
                         {trade.transactionType}
                       </span>
                    </td>
                    <td className="px-8 py-5 font-mono text-mkt-i2">{trade.amount}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-mkt-i4 group-hover:text-accent flex items-center justify-end gap-2 ml-auto">
                        Details <Lock className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-12 text-center bg-[#F7F7F7]/30 border-t border-mkt-bd">
             <p className="text-xs text-mkt-i4 mb-6 font-mono uppercase tracking-widest">Upgrade to Edge+ for full disclosure history and AI committee-impact analysis.</p>
             <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-mkt-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-all">
               Upgrade to Edge+ <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="max-w-3xl mx-auto text-center space-y-12 mb-32">
           <h3 className="text-3xl font-sans font-bold uppercase leading-tight">The ultimate information asymmetry.</h3>
           <p className="text-lg text-mkt-i2 leading-relaxed">
             While retail traders focus on indicators and chart patterns, the largest moves are often driven by legislative shifts. Political Alpha gives you a front-row seat to the trades of the people writing the laws. 
           </p>
           <div className="pt-12 border-t border-mkt-bd/30 flex justify-center gap-12">
              <div>
                <p className="text-3xl font-sans font-black text-accent">535</p>
                <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">TRADERS MONITORED</p>
              </div>
              <div>
                <p className="text-3xl font-sans font-black text-accent">$45M+</p>
                <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">QUARTERLY VOLUME</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
