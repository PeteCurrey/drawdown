import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";
import { getRegionalBestOfData } from "@/lib/seo/data";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return ["ca", "de", "ae", "in", "my", "ph"].map((region) => ({
    region,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  if (!REGIONS.includes(region as Region)) return {};

  const regionName = REGIONS_MAP[region as Region].label;

  return getMetadata({
    title: `Best of Trading ${regionName} — Expert Rankings & Reviews`,
    description: `The definitive rankings of the best forex brokers, trading platforms, and tools for traders in ${regionName}.`,
    path: `/${region}/best`,
    hasRegionalVariants: true,
  });
}

export default async function DynamicRegionalBestIndexPage({ params }: Props) {
  const { region: regionParam } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) {
    notFound();
  }

  const regionName = REGIONS_MAP[region].label;
  const data = getRegionalBestOfData(region);

  return (
    <RegionalProvider region={region}>
      <div className="pt-28 pb-24 min-h-screen">
        <TrackPageView path={`/${region}/best`} />
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-16 max-w-4xl">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// RANKINGS & REVIEWS</span>
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 leading-tight">
              Best of <br />
              <span className="text-accent">{regionName}.</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
              We rank the best trading gateways, software, and services for the {regionName} market. Our rankings are updated monthly to ensure you always have the most accurate intelligence.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((page) => (
              <Link 
                key={page.slug}
                href={`/${region}/best/${page.slug}`}
                className="group p-10 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 hover:border-border-slate/70 transition-premium flex flex-col justify-between h-80"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{page.eyebrow}</span>
                    <Star className="w-4 h-4 text-profit group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-3xl font-sans font-bold uppercase group-hover:text-text-primary transition-colors">{page.title}</h3>
                  <p className="text-sm text-text-tertiary mt-4 line-clamp-2">{page.metaDescription}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
                  View Rankings <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </RegionalProvider>
  );
}
