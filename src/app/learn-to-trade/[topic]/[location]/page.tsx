import { UK_LOCATIONS, TRADING_TOPICS } from "@/lib/seo-locations";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Compass, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{
    topic: string;
    location: string;
  }>;
}

export async function generateStaticParams() {
  const params: { topic: string; location: string }[] = [];
  
  TRADING_TOPICS.forEach(t => {
    UK_LOCATIONS.forEach(l => {
      params.push({
        topic: t.id,
        location: l.id
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locationData = UK_LOCATIONS.find(l => l.id === resolvedParams.location);
  const topicData = TRADING_TOPICS.find(t => t.id === resolvedParams.topic);

  if (!locationData || !topicData) {
    return { title: 'Not Found' };
  }

  return {
    title: `Learn ${topicData.title} in ${locationData.name} | Drawdown Academy`,
    description: `Master ${topicData.short.toLowerCase()} with Pete's professional framework in ${locationData.name}, ${locationData.region}. Access institutional-grade trading education locally.`,
  };
}

export default async function LocationTopicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locationData = UK_LOCATIONS.find(l => l.id === resolvedParams.location);
  const topicData = TRADING_TOPICS.find(t => t.id === resolvedParams.topic);

  if (!locationData || !topicData) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-accent text-[10px] font-mono uppercase tracking-widest bg-accent/5 w-fit px-3 py-1.5 border border-accent/20">
              <MapPin className="w-3 h-3" />
              <span>Available in {locationData.name}, {locationData.region}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-[1.1]">
              Master <span className="text-accent">{topicData.short}</span> <br />
              <span className="text-text-secondary font-light">From {locationData.name}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-light max-w-xl">
              Join the growing community of traders in {locationData.region} building their edge. 
              Our comprehensive course covers the exact institutional concepts you need to succeed at {topicData.title.toLowerCase()}.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/pricing"
                className="px-8 py-4 bg-accent hover:bg-accent-hover text-background-primary transition-colors font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                Access The Academy <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-square md:aspect-[4/3] bg-background-surface border border-border-slate overflow-hidden group">
             <div className="absolute inset-0 bg-[#06070A] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 group-hover:opacity-40 transition-opacity duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent" />
             <div className="absolute bottom-8 left-8 right-8 border border-border-slate bg-background-elevated/80 backdrop-blur-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Live Module</p>
                    <p className="text-sm font-display font-bold uppercase">{topicData.title}</p>
                  </div>
                </div>
                <div className="h-2 bg-background-primary overflow-hidden">
                  <div className="w-1/3 h-full bg-accent" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Localised Core Curriculum Section */}
      <section className="bg-background-surface border-y border-border-slate py-24">
        <div className="container mx-auto px-6 max-w-6xl space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase">The {locationData.name} Edge</h2>
            <p className="text-text-secondary">
              We provide traders in {locationData.name} with the exact technical frameworks required to navigate global markets. Here is what you'll master in the {topicData.short} module.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Institutional Concepts", desc: "Move beyond retail lagging indicators. Understand liquidity pools, fair value gaps, and market manipulation." },
              { title: "Psychological Discipline", desc: "Build the emotional resilience required to execute systems flawlessly without hesitation or FOMO." },
              { title: "Risk Frameworks", desc: "Deploy professional capital preservation strategies to protect your downside while hunting asymmetrical risk/reward." }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-border-slate bg-background-primary hover:border-accent/40 transition-colors">
                <Compass className="w-8 h-8 text-accent mb-6" />
                <h3 className="text-xl font-display font-bold uppercase mb-3">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Proof/Testimonial Placeholder */}
      <section className="container mx-auto px-6 max-w-4xl text-center space-y-8">
         <h2 className="text-3xl font-display font-bold uppercase">Ready to trade from {locationData.name}?</h2>
         <p className="text-text-secondary max-w-2xl mx-auto">
            Get instant access to Pete's comprehensive {topicData.short.toLowerCase()} training, community discord, and daily market briefs.
         </p>
         <div className="pt-6">
            <Link 
              href="/dashboard"
              className="inline-flex px-12 py-5 bg-text-primary hover:bg-white text-background-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
            >
              Start Your Journey
            </Link>
         </div>
      </section>
    </div>
  );
}
