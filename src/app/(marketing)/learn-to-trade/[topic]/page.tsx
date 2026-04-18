import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import seoData from "@/data/seo/topics.json";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle } from "lucide-react";

interface Props {
  params: { topic: string };
}

export async function generateStaticParams() {
  return seoData.topics.map((topic) => ({
    topic: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = seoData.topics.find((t) => t.slug === topicSlug);
  if (!topic) return {};

  return getMetadata({
    title: `Learn ${topic.title} | The Honest Guide`,
    description: topic.description,
  });
}

export default async function TopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = seoData.topics.find((t) => t.slug === topicSlug);
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
            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-8 leading-tight">
              Learn {topic.title} — <br />
              <span className="text-accent">The Honest Guide.</span>
            </h1>
            
            <p className="text-xl text-text-secondary leading-relaxed mb-12 max-w-2xl font-sans">
              {topic.description}
            </p>

            <div className="space-y-16">
              {topic.content.map((section, i) => (
                <section key={i} className="space-y-6">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight">
                    {section.heading}
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {section.text}
                  </p>
                </section>
              ))}
            </div>

            {/* Anti-Guru Mistake Section */}
            <section className="mt-20 p-8 bg-loss/5 border border-loss/20">
              <div className="flex items-center gap-3 text-loss mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-xs font-mono uppercase font-bold tracking-widest">Common Guru Traps</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed italic">
                Most "[Topic]" guides online are designed to sell you indicators or signals. At Drawdown, we teach you strategy and discipline. If a guide promises 100% win rates, run the other way.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Related Topics</h4>
              <div className="space-y-4">
                {seoData.topics.filter(t => t.slug !== topicSlug).map(t => (
                  <Link 
                    key={t.slug} 
                    href={`/learn-to-trade/${t.slug}`}
                    className="flex items-center justify-between group py-2 border-b border-border-slate/30"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
                      {t.title}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-text-tertiary group-hover:text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-8 bg-background-surface border border-border-slate">
              <h4 className="text-lg font-display font-bold uppercase mb-4">Start Your Edge</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Ready to apply {topic.title} strategies properly? Join Drawdown for AI-powered journal analysis.
              </p>
              <Link 
                href="/signup" 
                className="block w-full py-4 bg-accent text-background-primary text-center text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
              >
                Join Now
              </Link>
            </div>
          </aside>
        </div>

        {/* FAQs */}
        {topic.faqs.length > 0 && (
          <div className="mt-32 max-w-4xl border-t border-border-slate pt-20">
            <h2 className="text-3xl font-display font-bold uppercase mb-12">Frequently Asked Questions</h2>
            <div className="space-y-12">
              {topic.faqs.map((faq, i) => (
                <div key={i} className="space-y-4">
                  <h4 className="text-xl font-display font-bold uppercase">{faq.question}</h4>
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
