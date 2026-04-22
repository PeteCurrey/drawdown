import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle, MapPin, Globe, CheckCircle2 } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ topic: string; location: string }>;
}

export async function generateStaticParams() {
  const params: { topic: string; location: string }[] = [];
  
  LEARN_TOPICS.forEach((topic) => {
    UK_LOCATIONS.forEach((location) => {
      params.push({
        topic: topic.slug,
        location: location.slug,
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, location: locationSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  const location = UK_LOCATIONS.find((l) => l.slug === locationSlug);
  
  if (!topic || !location) return {};

  return getMetadata({
    title: `${topic.title} in ${location.name} — Learn Online | Drawdown`,
    description: `Learn ${topic.title} from ${location.name} with Drawdown. Structured courses, AI tools, and UK-focused education. Start free today.`,
  });
}

export default async function LocationTopicPage({ params }: Props) {
  const { topic: topicSlug, location: locationSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  const location = UK_LOCATIONS.find((l) => l.slug === locationSlug);
  
  if (!topic || !location) notFound();

  // Custom FAQs for this location
  const locationFaqs = [
    {
      question: `Are there trading courses in ${location.name}?`,
      answer: `While there may be physical seminars in ${location.name}, they often cost thousands for a few days of training. Drawdown provides a comprehensive online alternative that you can access from anywhere in ${location.region}, covering everything from basics to advanced institutional strategies.`
    },
    {
      question: `Can I learn ${topic.title} from ${location.name}?`,
      answer: `Absolutely. Since the financial markets are global and digital, you can learn ${topic.title} perfectly well from your home in ${location.name}. Drawdown's platform is designed for UK traders, focusing on the specific regulatory and tax environment (like Spread Betting) relevant to you.`
    },
    {
      question: `How much does it cost to learn trading in ${location.name}?`,
      answer: `Traditional trading education in ${location.name} is notoriously expensive. Drawdown offers a structured 6-phase curriculum and professional-grade AI tools starting from just £49/month, making elite trading education accessible to everyone in ${location.region}.`
    },
    {
      question: `Do I need qualifications to trade from ${location.name}?`,
      answer: `No formal qualifications are required to start retail trading in the UK. However, without proper education, the risk of capital loss is high. Our mission at Drawdown is to provide the professional-standard training that traders in ${location.name} need to survive and thrive in the markets.`
    }
  ];

  const faqSchema = {
    mainEntity: locationFaqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        <TrackPageView path={`/learn-to-trade/${topicSlug}/${locationSlug}`} />
        <StructuredData type="FAQPage" data={faqSchema} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                Local Curriculum
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3 h-3" /> {location.name}, {location.region}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight text-text-primary">
              {topic.title} in <span className="text-accent">{location.name}</span> <br className="hidden md:block" />
              <span className="opacity-50">— Learn Online.</span>
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none mb-16">
              <p className="text-xl text-text-secondary leading-relaxed font-sans">
                Whether you're trading from a home office in <strong>{location.name}</strong> or catching charts on the commute, Drawdown gives you everything you need to learn {topic.title.toLowerCase()} properly — at your own pace, on your own schedule.
              </p>
              <p className="text-xl text-text-secondary leading-relaxed font-sans">
                {location.context}
              </p>
              <p className="text-xl text-text-secondary leading-relaxed font-sans">
                With Drawdown's online platform, you don't need to travel to London for quality trading education. Our entire curriculum is available online, built specifically for UK traders who demand institutional-grade intelligence without the gatekeeping.
              </p>
            </div>

            {/* Shared Topic Content Section */}
            <div className="space-y-20 py-16 border-y border-border-slate/30 mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-border-slate/30" />
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-text-tertiary">Core Educational Intelligence</h2>
                <div className="h-px flex-1 bg-border-slate/30" />
              </div>
              
              {topic.content.map((section, i) => (
                <section key={i} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-text-primary">
                    {i + 1}. {section.heading}
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-line">
                    {section.text}
                  </p>
                  {section.bullets && (
                    <ul className="space-y-4 pt-4">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex gap-4 text-text-secondary">
                          <span className="text-accent font-bold">/</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Why Learn Online Section */}
            <section className="mb-24">
              <h2 className="text-4xl font-display font-bold uppercase mb-12 text-text-primary">Why Learn Online?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-background-surface border border-border-slate">
                  <h3 className="text-xl font-bold uppercase mb-4 text-accent">Cost Efficiency</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Traditional trading courses in <strong>{location.name}</strong> typically cost £1,000 to £5,000+ for a few days of classroom training. With Drawdown, you get 6 phases of structured education and AI-powered analysis tools starting from £49/month.
                  </p>
                </div>
                <div className="p-8 bg-background-surface border border-border-slate">
                  <h3 className="text-xl font-bold uppercase mb-4 text-accent">Flexible Pace</h3>
                  <p className="text-text-secondary leading-relaxed">
                    The markets don't wait for a classroom schedule. Learning online from {location.name} allows you to study when the markets are actually moving, integrating your education into your real-life routine.
                  </p>
                </div>
              </div>
            </section>

            {/* UK Specific Benefits */}
            <section className="mb-24 p-10 bg-background-surface border border-border-slate relative overflow-hidden">
               <div className="relative z-10">
                <h2 className="text-4xl font-display font-bold uppercase mb-12 text-text-primary">Built for the UK Trader</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    "UK-regulated broker recommendations",
                    "Spread betting tax guidance",
                    "HMRC-compliant education",
                    "GBP-denominated tools",
                    "GMT/BST session coverage",
                    "Local community of UK traders"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium uppercase tracking-wider">{benefit}</span>
                    </div>
                  ))}
                </div>
               </div>
               <Globe className="absolute -bottom-12 -right-12 w-64 h-64 text-accent/5" />
            </section>

            {/* FAQ Section */}
            <section className="mb-24">
              <h2 className="text-4xl font-display font-bold uppercase mb-16 text-text-primary">FAQs for {location.name} Traders.</h2>
              <div className="space-y-12">
                {locationFaqs.map((faq, i) => (
                  <div key={i} className="space-y-4">
                    <h4 className="text-2xl font-display font-bold uppercase text-text-primary">{faq.question}</h4>
                    <p className="text-text-secondary leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Anti-Guru Mistake Section */}
            <section className="p-10 bg-loss/5 border border-loss/20 relative overflow-hidden group mb-16">
              <div className="absolute top-0 right-0 w-32 h-32 bg-loss/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-loss mb-6">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xs font-mono uppercase font-bold tracking-widest">Crucial Warning: The Guru Trap</h3>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed italic max-w-3xl">
                  Most online guides for "{topic.title}" in {location.name} are designed to sell you indicators or signal groups. At Drawdown, we teach you strategy and discipline. No shortcuts. No scams.
                </p>
              </div>
            </section>
            
            <div className="py-16 border-t border-border-slate/30">
               <h3 className="text-3xl font-display font-bold uppercase mb-8 text-text-primary">Start learning {topic.title} today — from {location.name} or anywhere in the UK.</h3>
               <Link 
                href="/signup" 
                className="inline-block px-12 py-6 bg-accent text-background-primary font-bold uppercase tracking-[0.2em] text-xs hover:invert transition-all"
               >
                Begin Phase 1 Free
               </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            <div className="p-10 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">Other Topics in {location.name}</h4>
              <div className="space-y-6">
                {LEARN_TOPICS.filter(t => t.slug !== topicSlug).slice(0, 6).map(t => (
                  <Link 
                    key={t.slug} 
                    href={`/learn-to-trade/${t.slug}/${locationSlug}`}
                    className="flex items-center justify-between group py-3 border-b border-border-slate/30"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
                      {t.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-10 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">Quick Navigation</h4>
              <div className="space-y-4">
                <Link href={`/learn-to-trade/${topicSlug}`} className="block text-xs font-bold uppercase tracking-widest text-accent hover:underline">
                  Main {topic.title} Guide
                </Link>
                <Link href="/brokers" className="block text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-accent">
                  Compare UK Brokers
                </Link>
                <Link href="/glossary" className="block text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-accent">
                  Trading Glossary
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
