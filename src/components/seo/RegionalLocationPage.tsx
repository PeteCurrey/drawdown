import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, Target, ArrowRight, ShieldCheck } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { getMetadata } from "@/lib/metadata";

interface RegionalLocationPageProps {
  region: "au" | "us" | "sg" | "hk";
  topic: string;
  city: string;
  topicDisplay: Record<string, string>;
  cityContext: Record<string, string>;
  regulationLabel: string;
}

export function RegionalLocationPage({ 
  region, 
  topic, 
  city, 
  topicDisplay, 
  cityContext,
  regulationLabel
}: RegionalLocationPageProps) {
  const topicLabel = topicDisplay[topic];
  const cityLabel = city.replace(/-/g, ' ');
  const context = cityContext[city];

  if (!topicLabel || !context) notFound();

  const regionName = region === "au" ? "Australia" : region === "us" ? "USA" : region === "sg" ? "Singapore" : "Hong Kong";

  return (
    <RegionalProvider region={region}>
      <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
        <TrackPageView path={`/${region}/learn-to-trade/${topic}/${city}`} />
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-12">
            <Link href={`/${region}`} className="hover:text-accent transition-colors">{region.toUpperCase()} Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${region}/learn-to-trade`} className="hover:text-accent transition-colors">Learn</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{cityLabel}</span>
          </nav>

          {/* Header */}
          <header className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-accent font-mono text-xs uppercase tracking-widest">{cityLabel} // {regionName}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-bold uppercase leading-tight mb-8">
              {topicLabel} <br />
              <span className="text-text-tertiary italic">in</span> {cityLabel}.
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl border-l-2 border-accent/30 pl-8 py-2">
              {context} Drawdown provides the professional-grade framework you need to master the markets from {cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)}.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="p-10 bg-background-surface border border-border-slate space-y-6">
              <Target className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-display font-bold uppercase">Localized Edge</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">
                We provide specific guidance for {cityLabel}-based traders, including optimization for global session overlaps and localized risk models.
              </p>
            </div>
            <div className="p-10 bg-background-surface border border-border-slate space-y-6">
              <ShieldCheck className="w-8 h-8 text-profit" />
              <h3 className="text-2xl font-display font-bold uppercase">{regulationLabel} Compliance</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">
                Our curriculum is built to help {regionName} traders navigate the {regulationLabel}-regulated landscape safely, ensuring maximum capital protection.
              </p>
            </div>
          </div>

          <section className="bg-background-elevated border border-border-slate p-12 md:p-20 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase">Ready to learn properly in {cityLabel}?</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Join the Drawdown community and access the same tools and education used by professional traders across {regionName}.
            </p>
            <div className="pt-4">
              <Link href="/signup" className="inline-flex items-center gap-4 bg-accent text-background-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-all">
                <span>Join Drawdown {regionName}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </RegionalProvider>
  );
}
