import { notFound } from "next/navigation";
import { brokers } from "@/data/brokers";
import { 
  ShieldCheck, 
  Star, 
  ArrowUpRight, 
  Check, 
  AlertTriangle, 
  ChevronRight,
  Globe,
  Smartphone,
  CreditCard,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";

export async function generateStaticParams() {
  return brokers.map((broker) => ({
    slug: broker.slug,
  }));
}

export default async function BrokerReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const broker = brokers.find((b) => b.slug === slug);

  if (!broker) {
    notFound();
  }

  return (
    <div className="bg-background-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Breadcrumbs />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <header>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-4">
                  <div className="text-black font-black text-3xl italic">{broker.name[0]}</div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-display font-black uppercase leading-tight">
                    {broker.name} Review
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-4 h-4", i < Math.floor(broker.rating) ? "text-accent fill-accent" : "text-text-tertiary")} />
                      ))}
                    </div>
                    <span className="text-sm font-mono text-text-secondary ml-2">Drawdown Rating: {broker.rating}/5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-2xl text-text-secondary font-display font-medium uppercase leading-relaxed">
                {broker.oneLine}
              </p>
            </header>

            <section className="space-y-8">
              <h2 className="text-2xl font-display font-bold uppercase border-b border-border-slate pb-4">Our Verdict</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-text-secondary leading-relaxed">
                  {broker.name} is a top-tier broker that we've used extensively at Drawdown. 
                  In this review, we'll break down exactly why it might (or might not) be the right home for your capital.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 bg-profit/5 border border-profit/20 rounded-xl space-y-4">
                    <p className="font-mono text-profit uppercase tracking-widest text-xs">The Positives</p>
                    {broker.pros.map((pro, i) => (
                      <div key={i} className="flex gap-3 text-sm text-text-secondary">
                        <Check className="w-5 h-5 text-profit shrink-0" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-8 bg-loss/5 border border-loss/20 rounded-xl space-y-4">
                    <p className="font-mono text-loss uppercase tracking-widest text-xs">The Considerations</p>
                    {broker.cons.map((con, i) => (
                      <div key={i} className="flex gap-3 text-sm text-text-tertiary">
                        <AlertTriangle className="w-5 h-5 text-loss shrink-0" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-display font-bold uppercase border-b border-border-slate pb-4">Fees & Spreads</h2>
              <p className="text-text-secondary leading-relaxed">
                Cost is the single biggest factor in long-term trading success. {broker.name} maintains a competitive 
                advantage with spreads starting from <span className="text-text-primary font-bold">{broker.spreads}</span>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Account Opening", value: "£0" },
                  { label: "Minimum Deposit", value: broker.minDeposit },
                  { label: "Forex Spreads", value: broker.spreads },
                ].map((fee, i) => (
                  <div key={i} className="p-6 bg-background-surface border border-border-slate">
                    <p className="text-[10px] font-mono text-text-tertiary uppercase mb-2">{fee.label}</p>
                    <p className="text-xl font-display font-bold uppercase">{fee.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-display font-bold uppercase border-b border-border-slate pb-4">Platform Experience</h2>
              <p className="text-text-secondary leading-relaxed">
                Whether you're a desktop power user or a mobile-first trader, the platform ecosystem is robust.
              </p>
              <div className="space-y-4">
                {broker.platforms.map((platform, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-background-surface border border-border-slate group hover:border-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <Zap className="w-5 h-5 text-accent" />
                      <span className="font-display font-bold uppercase">{platform}</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-tertiary uppercase">Available Now</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-32 space-y-8">
              <div className="bg-background-elevated border border-border-slate p-8 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Get Started</p>
                  <h3 className="text-2xl font-display font-bold uppercase leading-tight">
                    Ready to trade with {broker.name}?
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <a 
                    href={`/api/brokers/redirect?id=${broker.id}&source=review_sidebar`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent hover:bg-accent-hover text-background-primary py-5 px-8 text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Open Live Account <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <p className="text-[10px] text-center text-text-tertiary font-mono">
                    Min. Deposit: {broker.minDeposit} • {broker.fcaRegulated ? "FCA Regulated" : "Regulated"}
                  </p>
                </div>

                <div className="pt-8 border-t border-border-slate/50 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <ShieldCheck className="w-4 h-4 text-profit" />
                    <span>FCA Regulated & Protected</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <Globe className="w-4 h-4 text-accent" />
                    <span>Global Market Access</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <Smartphone className="w-4 h-4 text-accent" />
                    <span>Superior Mobile Apps</span>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-border-slate bg-background-surface">
                <h4 className="text-sm font-display font-bold uppercase mb-4">Need help choosing?</h4>
                <p className="text-xs text-text-tertiary leading-relaxed mb-6">
                  Not sure if {broker.name} is the right fit? Compare all our recommended brokers to find 
                  the best match for your strategy.
                </p>
                <Link href="/brokers" className="text-accent hover:underline text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  View All Brokers <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
