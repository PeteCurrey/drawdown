import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { ShieldCheck, Scale, Database, Search, PenTool, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Editorial Standards | Drawdown",
  description: "Our strict editorial guidelines for ensuring accuracy, objectivity, transparency, and truth in all Drawdown market analysis and publications.",
  path: "/editorial-standards",
});

export default function EditorialStandardsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/terms' },
              { label: 'Editorial Standards', href: '/editorial-standards' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <ShieldCheck size={14} />
                Publication Guidelines
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Editorial <span style={{ color: "var(--graphite-600)" }}>Standards</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              "Trade the Truth." It is not just a slogan; it is the fundamental law of Drawdown. We have zero tolerance for fabricated claims, hidden sponsorships, or retail noise.
            </p>
          </div>
        </div>

        {/* Main Document Body */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">

          {/* 1. Honest affiliate disclosure */}
          <section id="section-1" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <Scale size={24} style={{ color: "var(--signal-navy)" }} />
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                1. Honest Affiliate Disclosure
              </h2>
            </div>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We earn commissions from some of the tools and platforms we recommend — currently TradingView and FTMO, with further broker and prop firm partnerships in application. Every affiliate link is disclosed on the page it appears, and pages state clearly when a link is not an affiliate link.
              </p>
              <p>
                Commissions never determine rankings: we rank on merit, and we only recommend platforms we've personally used or thoroughly researched.
              </p>
            </div>
          </section>

          {/* 2. No fabricated performance claims */}
          <section id="section-2" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <Database size={24} style={{ color: "var(--signal-navy)" }} />
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                2. No Fabricated Performance Claims
              </h2>
            </div>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We do not publish invented win rates, backtested results we haven't run, or "typical member returns." Where live data feeds power a widget, if the feed fails, the widget hides — we never fall back to placeholder numbers. Where educational examples use hypothetical trades, they are labelled hypothetical.
              </p>
            </div>
          </section>

          {/* 3. Written by a trader, checked before publish */}
          <section id="section-3" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <Search size={24} style={{ color: "var(--signal-navy)" }} />
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                3. Written by a Trader, Checked Before Publish
              </h2>
            </div>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                All content is written by Pete Currey (founder, active trader based in Chesterfield, UK) and reviewed against primary sources — central bank statements, exchange data, broker documentation — before publishing. AI tools assist with drafting and fact-checking; final review and publish decisions are Pete's.
              </p>
            </div>
          </section>

          {/* 4. Corrections logged in public */}
          <section id="section-4" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <PenTool size={24} style={{ color: "var(--signal-navy)" }} />
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                4. Corrections Logged in Public
              </h2>
            </div>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                When we get something wrong, the article gets a timestamped correction notice at the bottom saying what changed and when. A running corrections log is maintained at <Link href="/editorial-standards/corrections" className="text-accent underline hover:opacity-80">/editorial-standards/corrections</Link>.
              </p>
            </div>
          </section>

          {/* Who writes Drawdown */}
          <section id="section-5" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              Who Writes Drawdown
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown is written by Pete Currey, founder and sole author. Pete is an active retail trader based in Chesterfield, UK, writing from lived market experience. To learn more about Pete's background, visit the <Link href="/about" className="text-accent underline hover:opacity-80">About page</Link>.
              </p>
            </div>
          </section>

          {/* Financial Disclaimer */}
          <section className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em] text-red-600">
              <AlertTriangle size={16} />
              <span>Financial Disclaimer</span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              Drawdown Trading provides educational resources and market intelligence, not financial advice. Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with foreign exchange trading and seek advice from an independent financial advisor if you have any doubts.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

