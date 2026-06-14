import { notFound } from "next/navigation";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { Metadata } from "next";
import Link from "next/link";
import { 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Gauge,
  ExternalLink
} from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARISON_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://drawdown.trading/compare/${slug}`,
    },
  };
}

// Helper to determine the comparison category
function getComparisonType(slug: string): "broker" | "propfirm" | "platform" | "generic" {
  const s = slug.toLowerCase();
  const brokerKeywords = ["ig", "pepperstone", "ibkr", "trading-212", "etoro", "xtb", "cmc", "plus500", "ic-markets", "saxo", "avatrade", "vantage", "eightcap", "spreadex", "city-index", "admiral", "broker"];
  const propFirmKeywords = ["ftmo", "5ers", "funding", "topstep", "apex", "myfundedfx", "fundednext", "prop-firm", "challenge"];
  const platformKeywords = ["tradingview", "mt4", "mt5", "ctrader", "platform", "metatrader", "charting"];

  const hasKeyword = (keywords: string[]) => keywords.some(k => s.includes(k));

  if (hasKeyword(brokerKeywords)) return "broker";
  if (hasKeyword(propFirmKeywords)) return "propfirm";
  if (hasKeyword(platformKeywords)) return "platform";
  return "generic";
}

// Mock scoring matrix generator for visualization
function getScoringModel(type: string) {
  if (type === "broker") {
    return [
      { metric: "Regulatory Safety", scoreA: 95, scoreB: 90 },
      { metric: "Trading Spreads", scoreA: 80, scoreB: 95 },
      { metric: "Platform Tools", scoreA: 90, scoreB: 85 },
      { metric: "Deposit/Withdrawal Fees", scoreA: 92, scoreB: 98 }
    ];
  } else if (type === "propfirm") {
    return [
      { metric: "Fee Value", scoreA: 85, scoreB: 95 },
      { metric: "Drawdown Freedom", scoreA: 88, scoreB: 92 },
      { metric: "Profit Split Ratio", scoreA: 90, scoreB: 90 },
      { metric: "Scaling Velocity", scoreA: 80, scoreB: 98 }
    ];
  } else {
    return [
      { metric: "Charting Engine Power", scoreA: 98, scoreB: 75 },
      { metric: "Broker Integration", scoreA: 90, scoreB: 95 },
      { metric: "Backtesting Simulator", scoreA: 85, scoreB: 80 },
      { metric: "Scripting Interface", scoreA: 95, scoreB: 90 }
    ];
  }
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) notFound();

  const compType = getComparisonType(slug);
  
  // Extract clean option names from title or slug
  const titleParts = page.title.split(" vs ");
  const optionA = titleParts[0]?.trim() || "Option A";
  const optionB = titleParts[1]?.split("—")[0]?.trim() || "Option B";

  const scoringModel = getScoringModel(compType);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <TrackPageView path={`/compare/${slug}`} />
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/compare" className="hover:text-accent transition-colors">Compare</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mkt-ink">{optionA} vs {optionB}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 mb-16">
          <div className="text-accent font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2">
            <span className="w-8 h-[1px] bg-accent" />
            {compType === "broker" && "Broker vs Broker Comparison"}
            {compType === "propfirm" && "Prop Firm vs Prop Firm Comparison"}
            {compType === "platform" && "Platform vs Platform Comparison"}
            {compType === "generic" && "Side-by-Side Comparison"}
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.9] text-mkt-ink">
            {page.title.split(" — ")[0]} <span className="text-accent italic">Compared.</span>
          </h1>
          <p className="text-lg text-mkt-i2 font-sans font-light mt-4">
            {page.metaDescription}
          </p>
        </div>

        {/* Quick Verdict */}
        <div className="mb-16 bg-white border border-mkt-bd p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-9xl font-sans font-black text-accent/5 select-none uppercase pointer-events-none">WINNER</div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 md:w-2/3">
              <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Pete&apos;s Recommended Pick
              </h3>
              <h4 className="text-3xl font-sans font-black uppercase text-mkt-ink">
                Best Choice: <span className="text-accent italic underline decoration-accent/20">{page.quickVerdict.winner}</span>
              </h4>
              <p className="text-sm text-mkt-i2 leading-relaxed italic m-0">
                &quot;{page.quickVerdict.reason}&quot;
              </p>
            </div>
            <div className="md:w-1/3 w-full flex justify-end">
              <Link 
                href={`/go/${page.quickVerdict.winner.toLowerCase().replace(/\s+/g, "-")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto text-center px-8 py-5 bg-mkt-ink text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-colors inline-flex items-center justify-center gap-2"
              >
                Get Started <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Scoring Modeler */}
        {compType !== "generic" && (
          <div className="mb-16 p-8 border border-mkt-bd bg-[#F7F7F7]/40 space-y-8">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-mkt-ink flex items-center gap-2">
              <Gauge className="w-4 h-4 text-accent" /> Custom Scoring Model
            </h3>
            <div className="space-y-6">
              {scoringModel.map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-mkt-ink uppercase font-mono tracking-tight">
                    <span>{item.metric}</span>
                    <span className="flex gap-4">
                      <span className="text-accent">{optionA}: {item.scoreA}%</span>
                      <span className="text-mkt-i4">vs</span>
                      <span className="text-mkt-grn">{optionB}: {item.scoreB}%</span>
                    </span>
                  </div>
                  <div className="h-2 bg-mkt-bd/20 flex overflow-hidden">
                    <div 
                      className="bg-accent h-full transition-all duration-1000 border-r border-white/50" 
                      style={{ width: `${item.scoreA}%` }} 
                    />
                    <div 
                      className="bg-mkt-grn h-full transition-all duration-1000" 
                      style={{ width: `${item.scoreB}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mb-20 overflow-hidden border border-mkt-bd">
          <div className="grid grid-cols-3 bg-[#F7F7F7] border-b border-mkt-bd">
            <div className="p-6 text-[9px] font-mono font-black uppercase tracking-widest text-mkt-i4">Comparison Matrix</div>
            <div className="p-6 text-center font-sans font-black uppercase tracking-widest text-accent border-x border-mkt-bd">{optionA}</div>
            <div className="p-6 text-center font-sans font-black uppercase tracking-widest text-mkt-grn">{optionB}</div>
          </div>
          {page.comparisonTable.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 border-b border-mkt-bd last:border-b-0 hover:bg-[#F7F7F7]/30 transition-colors">
              <div className="p-6 text-xs font-mono font-bold text-mkt-i2 flex items-center uppercase tracking-wider">{row.feature}</div>
              <div className="p-6 text-center text-sm font-semibold border-x border-mkt-bd text-mkt-ink flex items-center justify-center">{row.optionA}</div>
              <div className="p-6 text-center text-sm font-semibold text-mkt-ink flex items-center justify-center">{row.optionB}</div>
            </div>
          ))}
        </div>

        {/* Section Contents */}
        <div className="space-y-16 mb-20">
          {page.sections.map((section) => (
            <section key={section.title} className="border-t border-mkt-bd/40 pt-12">
              <h2 className="text-3xl font-sans font-black uppercase mb-6 text-mkt-ink tracking-tight">{section.title}</h2>
              <div className="prose prose-invert prose-slate max-w-none text-mkt-i2 text-base leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Choice Guides Side-by-Side */}
        {(page.whoShouldChooseA || page.whoShouldChooseB) && (
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {page.whoShouldChooseA && (
              <div className="bg-white border border-mkt-bd p-8">
                <h3 className="text-sm font-sans font-black mb-6 uppercase tracking-widest text-accent flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Choose {optionA} If...</span>
                </h3>
                <ul className="space-y-4">
                  {page.whoShouldChooseA.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-mkt-i2 leading-relaxed">
                      <Check className="w-4 h-4 text-mkt-grn mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {page.whoShouldChooseB && (
              <div className="bg-white border border-mkt-bd p-8">
                <h3 className="text-sm font-sans font-black mb-6 uppercase tracking-widest text-mkt-grn flex items-center gap-2">
                  <Zap className="w-4 h-4 text-mkt-grn" />
                  <span>Choose {optionB} If...</span>
                </h3>
                <ul className="space-y-4">
                  {page.whoShouldChooseB.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-mkt-i2 leading-relaxed">
                      <Check className="w-4 h-4 text-mkt-grn mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="border-t border-mkt-bd pt-20 mb-20">
            <h2 className="text-3xl font-sans font-black uppercase mb-12 flex items-center gap-4">
              <HelpCircle className="w-8 h-8 text-accent" /> Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {page.faqs.map((faq, i) => (
                <div key={i} className="border-b border-mkt-bd pb-8">
                  <h3 className="text-lg font-bold text-mkt-ink uppercase tracking-tight mb-4">{faq.question}</h3>
                  <p className="text-sm text-mkt-i2 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Double CTA */}
        <section className="bg-[#F7F7F7] border border-mkt-bd p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-sans font-black text-mkt-ink uppercase tracking-tight">Trade the right way.</h2>
          <p className="text-mkt-i2 font-mono text-xs max-w-md mx-auto uppercase tracking-wide leading-relaxed">
            Whichever option you select, remember that risk management is your only real edge in live market conditions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a 
              href={`/go/${optionA.toLowerCase().replace(/\s+/g, "-")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-mkt-ink hover:bg-accent-hover text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              Open {optionA} <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-xs font-mono text-mkt-i4 uppercase font-bold">or</span>
            <a 
              href={`/go/${optionB.toLowerCase().replace(/\s+/g, "-")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-white border border-mkt-bd text-mkt-ink text-xs font-black uppercase tracking-widest hover:border-accent transition-colors flex items-center justify-center gap-2"
            >
              Open {optionB} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
