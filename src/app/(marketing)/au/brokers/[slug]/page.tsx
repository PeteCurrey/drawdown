import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { brokersAu } from "@/data/brokers-au";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brokersAu.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = brokersAu.find((b) => b.slug === slug);
  if (!broker) return {};

  return getMetadata({
    title: `${broker.name} Review — Best ASIC Broker for Australian Traders?`,
    description: `Detailed ${broker.name} review for Australian traders. We analyze ASIC regulation, raw spreads, MT4/MT5 platforms, and AUD deposit methods.`,
    path: `/au/brokers/${slug}`,
  });
}

export default async function AustralianBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = brokersAu.find((b) => b.slug === slug);

  if (!broker) notFound();

  return (
    <RegionalProvider region="au">
      <div className="pt-32 pb-24 bg-background-primary min-h-screen">
        <TrackPageView path={`/au/brokers/${slug}`} />
        <div className="container mx-auto px-6">
          <Breadcrumbs />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 bg-background-surface border border-border-slate sticky top-32">
                <div className="w-20 h-20 bg-background-elevated border border-border-slate mb-6 flex items-center justify-center">
                  <span className="text-3xl font-display font-black text-accent/20">{broker.name.charAt(0)}</span>
                </div>
                <h1 className="text-3xl font-display font-bold uppercase mb-2">{broker.name}</h1>
                <p className="text-xs text-text-tertiary uppercase font-mono tracking-widest mb-6">{broker.regulation}</p>
                
                <div className="space-y-4 pt-6 border-t border-border-slate">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Rating</span>
                    <span className="text-sm font-bold text-accent">{broker.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Min Deposit</span>
                    <span className="text-sm font-bold text-text-primary">{broker.minDeposit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Max Leverage</span>
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

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              <section className="space-y-6">
                <h2 className="text-3xl font-display font-bold uppercase">Executive Summary</h2>
                <p className="text-text-secondary leading-relaxed text-lg italic border-l-2 border-accent/30 pl-6 py-2">
                  {broker.description}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  For Australian traders, {broker.name} represents a top-tier choice for access to global financial markets. As an ASIC-regulated entity, they must adhere to strict operational standards, including the segregation of client funds and robust internal risk management.
                </p>
              </section>

              <section className="space-y-8">
                <h2 className="text-3xl font-display font-bold uppercase">ASIC Regulation & Security</h2>
                <div className="p-8 bg-profit/5 border border-profit/20 flex gap-6 items-start">
                  <ShieldCheck className="w-8 h-8 text-profit shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-bold uppercase text-sm">Regulated by ASIC</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {broker.name} holds AFSL {broker.regulation.match(/\d+/)?.[0] || ""}. This is the &quot;gold standard&quot; for Australian financial security, ensuring that your capital is protected by Australian law and held in major Australian banks.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-3xl font-display font-bold uppercase">Core Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {broker.features.map((feature: string, i: number) => (
                    <div key={i} className="p-6 bg-background-surface border border-border-slate flex gap-4 items-center">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span className="text-sm font-bold uppercase tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-3xl font-display font-bold uppercase">Platforms & Technology</h2>
                <div className="space-y-6">
                  <p className="text-text-secondary leading-relaxed">
                    {broker.name} supports a variety of institutional-grade platforms, allowing for everything from manual discretionary trading to advanced algorithmic execution.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {broker.platforms.map((platform: string) => (
                      <span key={platform} className="px-4 py-2 bg-background-elevated border border-border-slate text-[10px] font-mono font-bold uppercase tracking-widest text-text-primary">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="p-12 bg-background-elevated border border-border-slate space-y-8">
                <div className="flex items-center gap-4">
                  <Info className="w-6 h-6 text-accent" />
                  <h3 className="text-2xl font-display font-bold uppercase">The Drawdown Verdict</h3>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {broker.name} is a highly recommended partner for our Australian students. Their commitment to transparency and the regulatory safety provided by ASIC makes them a secure gateway for professional-grade trading.
                </p>
                <div className="pt-4">
                  <a 
                    href={broker.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-accent hover:underline"
                  >
                    Open Account with {broker.name} <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </RegionalProvider>
  );
}
