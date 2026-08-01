import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, GitCompare, Shield, Zap, Sparkles, Award, Target, FileText, CheckCircle2 } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { InteractiveCompareWidget } from "@/components/compare/InteractiveCompareWidget";

export const metadata: Metadata = {
  title: "Prop Firm Comparisons 2026 | Head-to-Head Evaluation Audits",
  description: "Interactive side-by-side prop firm comparisons for UK & global traders. Compare FTMO vs The5%ers, Funding Pips vs MyFundedFX, Topstep vs Apex Trader Funding.",
  alternates: { canonical: "https://drawdown.trading/prop-firms/compare" }
};

export const revalidate = 3600;

export default function PropFirmsComparePage() {
  const featuredBattles = [
    {
      slug: "ftmo-vs-the5ers",
      title: "FTMO vs The5%ers",
      eyebrow: "Industry Benchmark Battle",
      desc: "FTMO offers standard two-step challenges with massive 90% splits, while The5%ers offers hyper-scaling plans up to $4,000,000 with instant funding options.",
      winner: "FTMO for intraday speed; The5%ers for long-term scaling"
    },
    {
      slug: "funding-pips-vs-myfundedfx",
      title: "Funding Pips vs MyFundedFX",
      eyebrow: "Low-Cost Challenge Battle",
      desc: "Funding Pips leads on lowest entry costs from $32, whereas MyFundedFX features TradingView integration via Match-Trader and no time limits.",
      winner: "Funding Pips for entry cost; MyFundedFX for TradingView integration"
    },
    {
      slug: "topstep-vs-apex",
      title: "Topstep vs Apex Trader Funding",
      eyebrow: "Futures Prop Battle",
      desc: "Topstep is the gold standard for CME futures traders with stellar coaching, while Apex Trader Funding dominates high-volume multi-account setups.",
      winner: "Topstep for futures reputation; Apex for multi-account scaling"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TrackPageView path="/prop-firms/compare" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://drawdown.trading" },
        { name: "Prop Firms", url: "https://drawdown.trading/prop-firms" },
        { name: "Compare Prop Firms", url: "https://drawdown.trading/prop-firms/compare" }
      ]} />

      {/* 1. IMMERSIVE AMBIENT HERO SECTION */}
      <section className="relative min-h-[80vh] flex flex-col justify-center pt-32 pb-20 border-b border-white/10 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/prop-firms" className="hover:text-white transition-colors">Prop Firms</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">Compare Prop Firms</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Header */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase tracking-widest">
                <GitCompare className="w-4 h-4" />
                <span>// EVALUATION RULES & PAYOUT AUDITS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tight leading-[0.95]">
                Prop Firm Battles. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-white">Side by Side.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
                Beat evaluation traps before paying for a challenge. We compare daily loss limits, maximum trailing drawdowns, profit splits, scaling plans, and payout consistency.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#interactive-prop-compare"
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  Interactive Prop Compare Tool <Sparkles className="w-4 h-4" />
                </a>

                <Link
                  href="/store/prop-survival-kit"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                >
                  Prop Survival Kit <FileText className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>

            {/* Right Featured Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500/20 blur-[90px] group-hover:bg-purple-500/30 transition-all pointer-events-none" />
                <Link 
                  href="/prop-firms/ftmo-vs-the5ers"
                  className="relative block bg-slate-900 border border-purple-500/40 rounded-3xl p-8 shadow-2xl hover:border-purple-500 transition-all group overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-mono font-bold text-purple-400">VS</div>
                      <span className="text-purple-400 font-mono text-xs uppercase tracking-widest font-bold">Featured Battle</span>
                    </div>
                    <GitCompare className="w-5 h-5 text-purple-400" />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-sans font-black uppercase leading-tight text-white group-hover:text-purple-400 transition-colors">
                      FTMO vs The5%ers
                    </h3>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-mono text-purple-400 uppercase font-bold mb-1">Pete&apos;s Quick Take:</p>
                      <p className="text-xs text-slate-300 italic font-medium leading-relaxed m-0">
                        &quot;FTMO is the industry benchmark for intraday scalpers; The5%ers provides unmatched scaling up to $4,000,000 with real capital allocation.&quot;
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-purple-400 transition-colors">
                      <span>Read FTMO vs The5%ers Breakdown</span>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PROP COMPARE WIDGET SECTION */}
      <section id="interactive-prop-compare" className="py-20">
        <div className="container mx-auto px-6 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">// DYNAMIC PROP MATRIX</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase text-white">
              Interactive Prop Firm Comparison Tool
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Select any two prop evaluation firms to compare challenge fees, max drawdowns, daily drawdown limits, and scaling plans side-by-side.
            </p>
          </div>

          <InteractiveCompareWidget mode="propFirm" />
        </div>
      </section>

      {/* 3. FEATURED PROP BATTLES GRID */}
      <section className="py-20 bg-slate-900 border-t border-white/10">
        <div className="container mx-auto px-6 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">// PUBLISHED EVALUATION BATTLES</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase text-white">
              Prop Firm Head-to-Head Deep Dives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBattles.map((battle, idx) => (
              <div 
                key={idx}
                className="bg-slate-950 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-8 transition-all hover:-translate-y-1 flex flex-col justify-between h-[360px] relative overflow-hidden shadow-xl group"
              >
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest font-bold">{battle.eyebrow}</span>
                    <GitCompare className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-sans font-black uppercase leading-tight text-white group-hover:text-purple-400 transition-colors">
                    {battle.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {battle.desc}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-wide leading-relaxed text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    Verdict: {battle.winner}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-300 group-hover:text-purple-400 transition-colors">
                  <a href="#interactive-prop-compare" className="flex items-center gap-1.5 w-full justify-between">
                    <span>Compare Rules</span>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
