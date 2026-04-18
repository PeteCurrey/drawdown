import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FEATURES_DATA } from '@/lib/features-data';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = FEATURES_DATA[slug];
  
  if (!feature) return { title: 'Feature Not Found' };

  return {
    title: `${feature.name} | Drawdown Platform`,
    description: feature.description,
  };
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const feature = FEATURES_DATA[slug];

  if (!feature) {
    notFound();
  }

  const Icon = feature.icon;

  return (
    <div className="bg-background-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={feature.image} 
            alt={feature.name}
            className="w-full h-full object-cover grayscale opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background-primary/0 via-background-primary/50 to-background-primary" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8 text-accent animate-in fade-in slide-in-from-left-4 duration-700">
              <Icon className="w-12 h-12" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">// PLATFORM FEATURE</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-black uppercase leading-none mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {feature.name}.
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              {feature.subtitle}
            </p>

            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <Link 
                href={feature.toolUrl}
                className="group flex items-center gap-3 px-8 py-4 bg-accent text-background-primary text-xs font-bold uppercase tracking-widest hover:bg-white transition-premium"
              >
                Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/pricing"
                className="flex items-center gap-3 px-8 py-4 border border-border-slate text-text-primary text-xs font-bold uppercase tracking-widest hover:bg-background-elevated transition-premium"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Edge Section */}
      <section className="py-24 border-y border-border-slate/30 bg-background-elevated/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                <Zap className="w-3 h-3" /> The Drawdown Edge
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase leading-tight">
                Not just another technical tool. <br />A strategic advantage.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                {feature.theEdge}
              </p>
            </div>
            <div className="p-1 w-full aspect-video bg-gradient-to-br from-border-slate to-transparent">
              <div className="w-full h-full bg-background-surface flex items-center justify-center p-8 border border-border-slate">
                <Icon className="w-32 h-32 text-accent/10" />
                <div className="absolute flex flex-col items-center">
                   <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Functional Capability Mapping</p>
                   <div className="flex gap-4">
                      <div className="w-12 h-1 bg-accent/20" />
                      <div className="w-12 h-1 bg-accent" />
                      <div className="w-12 h-1 bg-accent/20" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-xl">
              <span className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest block mb-4">// CAPABILITIES</span>
              <h2 className="text-4xl font-display font-bold uppercase">Engineered for Performance.</h2>
            </div>
            <div className="flex items-center gap-3 text-text-tertiary text-[10px] font-mono uppercase tracking-widest">
              Required Tier: <span className="text-accent border border-accent/20 px-2 py-1 bg-accent/5 font-bold">{feature.tier}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feature.capabilities.map((cap, i) => (
              <div key={i} className="group p-10 bg-background-surface border border-border-slate hover:border-accent/50 transition-premium">
                <div className="w-10 h-10 flex items-center justify-center bg-background-elevated border border-border-slate mb-8 group-hover:bg-accent group-hover:text-background-primary transition-premium">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-4 group-hover:text-accent transition-colors">
                  {cap.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier & Safety */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="bg-background-elevated border border-border-slate p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <ShieldCheck className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-display font-bold uppercase mb-6">Built to Professional Standards.</h2>
              <p className="text-text-secondary leading-relaxed mb-10">
                This feature is fully integrated with the Drawdown ecosystem, sharing data with your Trade Journal and Risk Engine to provide a seamless, risk-controlled trading workflow.
              </p>
              
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4 text-sm font-mono tracking-tighter">
                    <span className="text-profit">✔</span> SSL Encrypted Data Streams
                 </div>
                 <div className="flex items-center gap-4 text-sm font-mono tracking-tighter">
                    <span className="text-profit">✔</span> Low Latency Execution
                 </div>
                 <div className="flex items-center gap-4 text-sm font-mono tracking-tighter">
                    <span className="text-profit">✔</span> Cloud Persistence
                 </div>
              </div>

              <div className="mt-12 pt-12 border-t border-border-slate/50">
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center gap-4 text-accent font-bold uppercase tracking-widest text-xs group"
                >
                  Create Your Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
