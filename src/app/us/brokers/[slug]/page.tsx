import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { brokersUs } from "@/data/brokers-us";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brokersUs.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = brokersUs.find((b) => b.slug === slug);
  if (!broker) return {};

  return getMetadata({
    title: `${broker.name} Review — Regulated US Trading Gateway`,
    description: `Detailed ${broker.name} review for US traders. Analysis of CFTC/NFA/SEC regulation, leverage limits, and trading platforms.`,
    path: `/us/brokers/${slug}`,
  });
}

export default async function USBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = brokersUs.find((b) => b.slug === slug);

  if (!broker) notFound();

  return (
    <RegionalProvider region="us">
      <div className="pt-32 pb-24 bg-background-primary min-h-screen">
        <TrackPageView path={`/us/brokers/${slug}`} />
        <div className="container mx-auto px-6">
          <Breadcrumbs />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 bg-background-surface border border-border-slate sticky top-32">
                <h1 className="text-3xl font-display font-bold uppercase mb-2">{broker.name}</h1>
                <p className="text-xs text-text-tertiary uppercase font-mono tracking-widest mb-6">{broker.regulation}</p>
                
                <div className="space-y-4 pt-6 border-t border-border-slate">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Rating</span>
                    <span className="text-sm font-bold text-accent">{broker.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Leverage</span>
                    <span className="text-sm font-bold text-text-primary">{broker.maxLeverage}</span>
                  </div>
                </div>

                <a 
                  href={broker.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium flex items-center justify-center gap-2 mt-8"
                >
                  Visit Official Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-16">
              <section className="space-y-6">
                <h2 className="text-3xl font-display font-bold uppercase">US Market Analysis</h2>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {broker.description}
                </p>
                <div className="p-6 bg-background-elevated border border-border-slate flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-profit shrink-0" />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    This broker is fully compliant with US regulatory requirements. Your funds are protected under US jurisdiction, and the company must adhere to high standards of financial reporting and operational transparency.
                  </p>
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-3xl font-display font-bold uppercase">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {broker.features.map((feature: string) => (
                    <div key={feature} className="p-6 bg-background-surface border border-border-slate flex gap-4 items-center">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span className="text-sm font-bold uppercase tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-12 bg-background-elevated border border-border-slate space-y-8">
                <h3 className="text-2xl font-display font-bold uppercase">The Drawdown Verdict</h3>
                <p className="text-text-secondary leading-relaxed">
                  {broker.name} is a robust choice for US traders. Whether you are focused on the liquid forex markets or the diverse US equity and options space, this platform provides the institutional-grade stability we expect.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </RegionalProvider>
  );
}
