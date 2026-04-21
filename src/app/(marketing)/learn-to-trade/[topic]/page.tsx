import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle } from "lucide-react";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return LEARN_TOPICS.map((topic) => ({
    topic: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  if (!topic) return {};

  return getMetadata({
    title: topic.metaTitle,
    description: topic.metaDescription,
  });
}

export default async function TopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  if (!topic) notFound();

  const faqSchema = {
    mainEntity: topic.faqs.map((f) => ({
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
        <StructuredData type="FAQPage" data={faqSchema} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                Curriculum Hub
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                Topic: {topic.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight text-text-primary">
              Learn {topic.title} <br className="hidden md:block" />
              <span className="text-accent">— The Honest Guide.</span>
            </h1>
            
            <p className="text-xl text-text-secondary leading-relaxed mb-16 max-w-2xl font-sans">
              {topic.description}
            </p>

            <div className="space-y-20">
              {topic.content.map((section, i) => (
                <section key={i} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
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

            {/* Anti-Guru Mistake Section */}
            <section className="mt-24 p-10 bg-loss/5 border border-loss/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-loss/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-loss mb-6">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xs font-mono uppercase font-bold tracking-widest">Crucial Warning: The Guru Trap</h3>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed italic max-w-3xl">
                  Most online guides for "{topic.title}" are designed to sell you indicators or signal groups. At Drawdown, we teach you strategy and discipline. If a guide promises "guaranteed" returns or "100% win rates," it is a scam. Period.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            <div className="p-10 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">Related Intelligence</h4>
              <div className="space-y-6">
                {LEARN_TOPICS.filter(t => t.slug !== topicSlug).map(t => (
                  <Link 
                    key={t.slug} 
                    href={`/learn-to-trade/${t.slug}`}
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

            <div className="p-10 bg-accent text-background-primary relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-2xl font-display font-bold uppercase mb-4 leading-tight">Master Your Edge.</h4>
                <p className="text-sm opacity-80 leading-relaxed mb-8">
                  Ready to apply {topic.title} strategies properly? Join 2,000+ traders using Drawdown for institutional-grade tools.
                </p>
                <Link 
                  href="/signup" 
                  className="block w-full py-5 bg-background-primary text-text-primary text-center text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                >
                  Join Drawdown Pro
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </aside>
        </div>

        {/* FAQs */}
        {topic.faqs.length > 0 && (
          <div className="mt-32 max-w-4xl border-t border-border-slate pt-20">
            <h2 className="text-4xl font-display font-bold uppercase mb-16 text-text-primary">Common Questions.</h2>
            <div className="space-y-16">
              {topic.faqs.map((faq, i) => (
                <div key={i} className="space-y-4">
                  <h4 className="text-2xl font-display font-bold uppercase text-text-primary">{faq.question}</h4>
                  <p className="text-text-secondary leading-relaxed text-lg">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
