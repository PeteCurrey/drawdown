import { notFound } from "next/navigation";
import { AU_CITIES, AU_TOPICS, CITY_CONTEXT_AU, TOPIC_DISPLAY_AU } from "@/data/seo/locations-au";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, Target, ArrowRight, ShieldCheck } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { getMetadata } from "@/lib/metadata";

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  const params = [];
  for (const topic of AU_TOPICS) {
    for (const city of AU_CITIES) {
      params.push({ topic, city });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, city } = await params;
  const topicLabel = TOPIC_DISPLAY_AU[topic];
  const cityLabel = city.replace(/-/g, ' ');

  if (!topicLabel || !AU_CITIES.includes(city)) return {};

  return getMetadata({
    title: `${topicLabel} in ${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} | Drawdown Australia`,
    description: `Professional ${topicLabel} education and tools for traders in ${cityLabel}. Join the Drawdown community in Australia.`,
    path: `/au/learn-to-trade/${topic}/${city}`,
  });
}

export default async function AustralianLocationPage({ params }: Props) {
  const { topic, city } = await params;
  const topicLabel = TOPIC_DISPLAY_AU[topic];
  const cityLabel = city.replace(/-/g, ' ');
  const cityContext = CITY_CONTEXT_AU[city];

  if (!topicLabel || !cityContext) notFound();

  return (
    <RegionalProvider region="au">
      <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
        <TrackPageView path={`/au/learn-to-trade/${topic}/${city}`} />
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-12">
            <Link href="/au" className="hover:text-accent transition-colors">AU Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/au/learn-to-trade" className="hover:text-accent transition-colors">Learn</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{cityLabel}</span>
          </nav>

          {/* Header */}
          <header className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-accent font-mono text-xs uppercase tracking-widest">{cityLabel} // Australia</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-bold uppercase leading-tight mb-8">
              {topicLabel} <br />
              <span className="text-text-tertiary italic">in</span> {cityLabel}.
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl border-l-2 border-accent/30 pl-8 py-2">
              {cityContext} Drawdown provides the institutional-grade framework you need to master the markets from {cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)}.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="p-10 bg-background-surface border border-border-slate space-y-6">
              <Target className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-display font-bold uppercase">Localized Edge</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">
                We provide specific guidance for {cityLabel}-based traders, including optimization for the Asian and London session overlaps and AUD-denominated risk models.
              </p>
            </div>
            <div className="p-10 bg-background-surface border border-border-slate space-y-6">
              <ShieldCheck className="w-8 h-8 text-profit" />
              <h3 className="text-2xl font-display font-bold uppercase">ASIC Compliance</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">
                Our curriculum is built to help Australian traders navigate the ASIC-regulated landscape safely, avoiding the pitfalls of non-regulated offshore entities.
              </p>
            </div>
          </div>

          <section className="bg-background-elevated border border-border-slate p-12 md:p-20 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase">Ready to learn properly?</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Join the Drawdown community and access the same tools and education used by professional traders across Australia.
            </p>
            <div className="pt-4">
              <Link href="/signup" className="inline-flex items-center gap-4 bg-accent text-background-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-all">
                <span>Join Drawdown Australia</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </RegionalProvider>
  );
}
