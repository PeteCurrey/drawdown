import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

import { 
  CATEGORY_META, 
  getCategoryInstruments, 
  MarketCategory 
} from "@/lib/markets-config";
import { TradingViewScreener } from "@/components/markets/TradingViewScreener";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { category: "forex" },
    { category: "commodities" },
    { category: "indices" },
    { category: "crypto" }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category as MarketCategory];
  if (!meta) notFound();
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://drawdown.trading/markets/${category}`
    }
  };
}

// Helpers to map category to screener type
function getScreenerType(category: MarketCategory): "forex" | "crypto_mkt" | "cfd" {
  if (category === "forex") return "forex";
  if (category === "crypto") return "crypto_mkt";
  return "cfd"; // cfd for indices and commodities
}

export default async function CategoryHubPage({ params }: PageProps) {
  const { category } = await params;
  const cat = category as MarketCategory;
  const meta = CATEGORY_META[cat];

  if (!meta) {
    notFound();
  }

  const instruments = getCategoryInstruments(cat);
  const screenerType = getScreenerType(cat);

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white min-h-screen selection:bg-[#C8F135] selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative w-full py-20 px-6 border-b border-white/5 bg-[#0A0A0A]">
        
        {/* Background gradient flares */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C8F135]/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-6">
          {/* Breadcrumb */}
          <div className="text-xs uppercase tracking-widest text-white/30 font-semibold font-sans">
            Markets / <span className="text-[#C8F135]">{cat}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Intro Content */}
            <div className="lg:col-span-5 space-y-6 max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-sans font-extrabold text-white tracking-tight leading-tight uppercase">
                {cat} Markets
              </h1>
              <p className="text-base md:text-lg text-white/70 leading-relaxed font-sans">
                {meta.intro}
              </p>
              
              <div className="pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-[#C8F135] text-black font-bold text-xs tracking-wide rounded-lg hover:opacity-95 shadow-md font-sans"
                >
                  Start Trading Category Free &rarr;
                </Link>
              </div>
            </div>

            {/* Screener Widget */}
            <div className="lg:col-span-7 w-full border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
              <TradingViewScreener screenerType={screenerType} />
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUMENTS GRID SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight leading-tight uppercase">
            All {cat} Markets
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map(inst => {
            // Extract the first sentence of the description
            const firstSentence = inst.description.split(".")[0] + ".";
            
            return (
              <Link 
                key={inst.slug} 
                href={`/markets/${inst.category}/${inst.slug}`}
                className="bg-white/[0.02] border border-white/8 rounded-xl p-6 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-64 group cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Top Row */}
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-lg font-bold text-white tracking-tight">
                      {inst.displayPair}
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#C8F135] bg-[#C8F135]/5 border border-[#C8F135]/15 px-2 py-0.5 rounded-full uppercase">
                      {inst.category}
                    </span>
                  </div>

                  {/* Description Truncated */}
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans line-clamp-3">
                    {firstSentence}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                  <span className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[9px] font-mono text-white/50 uppercase tracking-wider">
                    {inst.drawdownPhase.split("—")[0].trim()}
                  </span>
                  
                  <span className="text-xs font-bold text-[#C8F135] flex items-center gap-1.5 group-hover:underline">
                    View Chart <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="py-20 bg-[#C8F135]/5 border-y border-[#C8F135]/20 text-center select-none">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight leading-tight">
            Learn to Trade {cat} Properly
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto font-sans leading-relaxed">
            Phase-based curriculum. AI-powered tools. Honest mentorship. Start free — no card required.
          </p>
          
          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#C8F135] text-black font-bold text-base tracking-wide rounded-lg hover:opacity-95 shadow-xl shadow-[#C8F135]/5 font-sans"
            >
              Start Free on Drawdown &rarr;
            </Link>
          </div>

          <p className="text-[10px] md:text-xs text-white/30 max-w-2xl mx-auto font-sans leading-relaxed pt-4">
            <strong>Risk Disclaimer:</strong> Trading financial markets carries significant risk. This page is for educational purposes only and does not constitute financial advice.
          </p>
        </div>
      </section>

    </div>
  );
}
