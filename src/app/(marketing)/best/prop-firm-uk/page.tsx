import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Check, X, Shield, Info, ExternalLink } from "lucide-react";
import { propFirms } from "@/data/prop-firms";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";

export const metadata: Metadata = {
  title: "Best Prop Trading Firms for UK Traders 2026 | Drawdown",
  description: "UK traders have unique tax and regulatory considerations when choosing a prop firm. Here are the firms worth your challenge fee.",
};

export default function BestPropFirmUK() {
  const featuredFirms = propFirms.filter(f => ["the5ers", "ftmo", "funding-pips", "myfundedfx"].includes(f.id));
  const petesPick = propFirms.find(f => f.id === "the5ers");

  return (
    <div className="min-h-screen">
      {/* 1. Breadcrumb */}
      <div className="border-b border-border-slate/50/30 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/best" className="hover:text-accent transition-colors">Best</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary italic">Best Prop Firm UK</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* 2. H1 + Intro */}
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase mb-8 leading-tight">
            Best Prop Firms <span className="text-accent italic">UK</span> 2026
          </h1>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
            <p>
              Choosing a prop firm in the UK isn't just about the challenge fee. It's about regulatory transparency, payout methods (GBP stability), and understanding how HMRC views your profits. While most firms are based in the EU or UAE, we rank them based on their reliability for British traders.
            </p>
            <div className="p-6 border-l-2 border-border-slate/50 bg-accent/5 italic font-medium text-text-primary">
              "Prop firm payouts in the UK are typically treated as self-employment income, not capital gains. This means you won't benefit from CGT allowances — plan your tax liabilities accordingly."
            </div>
          </div>
        </div>

        {/* 3. Affiliate Disclosure */}
        <AffiliateDisclosure className="mb-16" />

        {/* 4. Quick Picks Table */}
        <div className="mb-24 overflow-x-auto">
          <h2 className="text-xl font-sans font-black uppercase mb-8 flex items-center gap-3">
            <span className="text-accent">//</span> UK Trader Quick Picks
          </h2>
          <table className="w-full border-collapse border border-border-slate/50">
            <thead>
              <tr className="border-b border-border-slate/50 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-left">
                <th className="p-6">Firm</th>
                <th className="p-6">UK Access</th>
                <th className="p-6">Max Funding</th>
                <th className="p-6">Profit Split</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs uppercase font-bold tracking-tight">
              {featuredFirms.map((firm) => (
                <tr key={firm.id} className="border-b border-border-slate/30 hover:bg-background-elevated/60 transition-colors">
                  <td className="p-6 flex items-center gap-4">
                    {firm.name}
                    {firm.id === "the5ers" && (
                      <span className="px-2 py-0.5 bg-mkt-ink text-white text-[8px] font-black tracking-tighter uppercase">Pete's Pick</span>
                    )}
                  </td>
                  <td className="p-6 text-profit">ACCEPTED</td>
                  <td className="p-6">{firm.maxFunding}</td>
                  <td className="p-6">{firm.profitSplit}</td>
                  <td className="p-6 text-right">
                    <a 
                      href={`/go/${firm.slug}`}
                      className="inline-flex items-center gap-2 bg-mkt-ink text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-colors"
                    >
                      Start Challenge <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Deep Dive - Pete's Pick */}
        <div className="mb-32">
          <h2 className="text-3xl font-sans font-black uppercase mb-12">Pete's Honest Recommendation</h2>
          {petesPick && (
            <div className="bg-background-elevated/40 border border-border-slate/50/30 p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-9xl font-sans font-black text-profit select-none uppercase">PICK</div>
               <div className="relative z-10 max-w-4xl">
                 <h3 className="text-4xl font-sans font-black uppercase mb-6">{petesPick.name}</h3>
                 <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                   "The5%ers is my top pick for UK traders because of their unique scaling plan. Unlike firms that prioritize churn, The5%ers want you to stay and grow into millions of dollars in management. Their payouts to UK banks are reliable and their dashboard is the cleanest in the industry."
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                   <div className="space-y-4">
                     <h4 className="text-[10px] font-mono font-black text-profit uppercase tracking-[0.2em] flex items-center gap-2">
                       <Check className="w-3 h-3" /> UK Advantages
                     </h4>
                     <ul className="space-y-3">
                       <li className="text-xs font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-profit" /> High growth scaling (up to $4M)
                       </li>
                       <li className="text-xs font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-profit" /> No consistency rules
                       </li>
                       <li className="text-xs font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-profit" /> Excellent UK payout history
                       </li>
                     </ul>
                   </div>
                   <div className="space-y-4">
                     <h4 className="text-[10px] font-mono font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                       <X className="w-3 h-3" /> Things to watch
                     </h4>
                     <ul className="space-y-3">
                       <li className="text-xs font-bold text-text-secondary uppercase tracking-tight flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-loss/30" /> Slower scaling than some "instant" firms
                       </li>
                       <li className="text-xs font-bold text-text-secondary uppercase tracking-tight flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-loss/30" /> Initial profit split starts at 50-75%
                       </li>
                     </ul>
                   </div>
                 </div>
                 <a 
                   href={`/api/market/prop-firms/redirect?id=${petesPick.slug}&source=best-prop-firm-uk`}
                   className="inline-flex items-center gap-4 bg-mkt-ink text-white px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
                 >
                   Open a Challenge With The5%ers <ExternalLink className="w-4 h-4" />
                 </a>
               </div>
            </div>
          )}
        </div>

        {/* 6. UK Specific FAQ */}
        <div className="mb-32">
          <h2 className="text-xl font-sans font-black uppercase mb-12 flex items-center gap-3">
            <span className="text-accent">//</span> UK Prop Firm FAQ
          </h2>
          <div className="max-w-3xl space-y-8">
            <div className="border-b border-border-slate/50 pb-8">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-4">Are prop firms regulated by the FCA?</h3>
              <p className="text-sm text-text-secondary leading-relaxed">No. Because you are not "investing" your own capital into the markets, but rather paying for a "service" or "challenge," prop firms fall outside the scope of traditional FCA financial regulation. This means you do not have FSCS protection if the firm goes bust.</p>
            </div>
            <div className="border-b border-border-slate/50 pb-8">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-4">How are prop firm payouts taxed in the UK?</h3>
              <p className="text-sm text-text-secondary leading-relaxed">HMRC generally views prop firm payouts as misc income or self-employment income, subject to Income Tax. Since you do not own the underlying asset, you cannot use your Capital Gains Tax allowance. We recommend keeping 20-40% of every payout for your tax bill.</p>
            </div>
            <div className="border-b border-border-slate/50 pb-8">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-4">Can I trade prop firm challenges from the UK?</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Yes, absolutely. The UK is one of the world's most active regions for prop trading. All major firms like FTMO and The5%ers actively accept UK residents.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="p-16 bg-background-elevated/40 border border-border-slate/50 text-center relative overflow-hidden mb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-sans font-black uppercase mb-6">Need More Options?</h2>
            <p className="text-sm text-text-secondary mb-12">
              Our full prop firm directory contains detailed reviews of every major firm, including their payout speeds and community trust scores.
            </p>
            <Link 
              href="/prop-firms"
              className="inline-flex items-center gap-3 bg-mkt-ink text-white px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
            >
              View All Prop Firm Reviews <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Disclosure */}
      <div className="border-t border-border-slate/50/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em] max-w-4xl leading-relaxed">
            Drawdown may earn a commission if you purchase a challenge via our links. Prop firm trading involves significant risk of losing your challenge fee. We only recommend firms we have evaluated against objective criteria. Past challenge pass rates are not indicative of your results.
          </p>
        </div>
      </div>
    </div>
  );
}
