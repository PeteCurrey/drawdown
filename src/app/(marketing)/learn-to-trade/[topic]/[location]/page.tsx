import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap, MapPin, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { StructuredData } from "@/components/StructuredData";

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

  return {
    title: `${topic.title} in ${location.name} — Learn Online | Drawdown`,
    description: `Learn ${topic.title} from ${location.name} with Drawdown. Structured courses, AI tools, and UK-focused trading education. Start your journey free today.`,
    alternates: {
      canonical: `https://drawdown.ai/learn-to-trade/${topicSlug}/${locationSlug}`,
    },
  };
}

export default async function LocationTopicPage({ params }: Props) {
  const { topic: topicSlug, location: locationSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  const location = UK_LOCATIONS.find((l) => l.slug === locationSlug);

  if (!topic || !location) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Are there trading courses in ${location.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, while there are some traditional classroom courses in ${location.name}, Drawdown offers a more flexible, professional-grade online alternative. You can access institutional-grade ${topic.title} education from anywhere in ${location.name} without the high costs of physical workshops.`
        }
      },
      {
        "@type": "Question",
        "name": `Can I learn ${topic.title} from ${location.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Absolutely. Drawdown is designed for the modern remote trader. Whether you're in the heart of ${location.name} or the surrounding area, our platform provides all the tools, data, and community support you need to master ${topic.title} online.`
        }
      },
      {
        "@type": "Question",
        "name": `How much does it cost to learn trading in ${location.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Traditional trading seminars in ${location.name} can cost between £1,000 and £5,000 for a single weekend. Drawdown provides a superior, ongoing education model starting from just £49/month, making professional-grade learning accessible to everyone in the region.`
        }
      },
      {
        "@type": "Question",
        "name": `Do I need qualifications to trade from ${location.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `No formal qualifications are required to start trading from ${location.name}. However, the markets are highly competitive. Professional-grade education and a disciplined approach to risk management are essential for long-term success as a retail trader.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <TrackPageView path={`/learn-to-trade/${topicSlug}/${locationSlug}`} />
      <StructuredData type="FAQPage" data={faqSchema} />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-12">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/learn-to-trade" className="hover:text-accent transition-colors">Learn</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/learn-to-trade/${topicSlug}`} className="hover:text-accent transition-colors">{topic.title}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mkt-ink">{location.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
             <MapPin className="w-4 h-4 text-accent" />
             <span className="text-accent font-mono text-[10px] uppercase tracking-widest">Regional Hub // {location.name}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 text-mkt-ink leading-[0.85]">
            {topic.title} in <br /> {location.name}.
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-2xl text-mkt-ink font-sans uppercase leading-tight italic border-l-4 border-mkt-bd pl-8">
                {location.context}
              </p>
              <p className="text-lg text-mkt-i2 leading-relaxed">
                While {location.name} has its own unique financial landscape, the beauty of modern markets is that your location no longer dictates your edge. By choosing to learn {topic.title} online with Drawdown, you gain access to institutional-grade tools and community intelligence that was once reserved for the square mile.
              </p>
              <p className="text-lg text-mkt-i2 leading-relaxed">
                We've built Drawdown specifically for traders in hubs like {location.name} who demand professional-level education without the archaic costs of physical classroom seminars.
              </p>
            </div>
            <div className="bg-white border border-mkt-bd p-8 space-y-6">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-mkt-grn" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">UK Compliance</span>
               </div>
               <ul className="space-y-4">
                  {[
                    "FCA Regulated Platforms",
                    "Spread Betting Tax Efficiency",
                    "GBP Denominated Analysis",
                    "London Session Focus"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs text-mkt-i2">
                       <span className="w-1 h-1 bg-accent rounded-full" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>

        {/* Shared Topic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start mb-32">
          <div className="lg:col-span-2 space-y-20">
            {topic.content.map((section, i) => (
              <section key={i} className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                  {i + 1}. {section.heading}
                </h2>
                <p className="text-mkt-i2 leading-relaxed text-lg whitespace-pre-line">
                  {section.text}
                </p>
                {section.bullets && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {section.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-4 text-mkt-i2 text-sm p-4 bg-white border border-mkt-bd/50">
                        <span className="text-accent font-bold">/</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            {/* Why Learn Online */}
            <div className="p-8 bg-white border border-mkt-bd/30 space-y-6">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">Why Learn Online?</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-mkt-bd/50">
                     <span className="text-mkt-i4">Classroom Course</span>
                     <span className="text-red-500 font-bold">£1,500+</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-mkt-bd/50">
                     <span className="text-mkt-i4">Travel & Hotel</span>
                     <span className="text-red-500 font-bold">£300+</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-accent">
                     <span>Drawdown Access</span>
                     <span>£49/mo</span>
                  </div>
               </div>
               <p className="text-[10px] text-mkt-i4 italic leading-relaxed">
                  Save over £1,700 and get lifetime access to tools that classroom courses can't provide.
               </p>
            </div>

            {/* Internal Links */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Other Topics in {location.name}</h4>
               <div className="grid grid-cols-1 gap-2">
                  {LEARN_TOPICS.filter(t => t.slug !== topicSlug).slice(0, 5).map(t => (
                    <Link 
                      key={t.slug} 
                      href={`/learn-to-trade/${t.slug}/${locationSlug}`}
                      className="text-[10px] font-mono uppercase tracking-widest text-mkt-i2 hover:text-accent transition-colors py-2 border-b border-mkt-bd/30"
                    >
                       {t.title}
                    </Link>
                  ))}
               </div>
            </div>
          </aside>
        </div>

        {/* FAQs */}
        <section className="mb-32">
           <h2 className="text-4xl font-sans font-bold uppercase mb-16 text-mkt-ink">Local FAQ: {location.name}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="space-y-4 p-8 bg-white border border-mkt-bd hover:border-mkt-bds/30 transition-all">
                   <h4 className="text-lg font-sans font-bold uppercase text-mkt-ink">{faq.name}</h4>
                   <p className="text-mkt-i2 leading-relaxed text-sm">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="p-16 bg-mkt-ink text-white relative overflow-hidden text-center">
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase leading-none">
                 Start Learning {topic.title} <br /> from {location.name} Today.
              </h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                 Start learning with Drawdown. No fluff. No gurus. Just process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                 <Link 
                   href="/signup"
                   className="px-12 py-6 bg-white text-mkt-ink text-[12px] font-bold uppercase tracking-widest hover:invert transition-all"
                 >
                    Join Drawdown Free
                 </Link>
              </div>
           </div>
           {/* Decorative background number */}
           <div className="absolute -right-20 -bottom-20 text-[300px] font-sans font-black text-white/10 select-none">
              {location.name[0]}
           </div>
        </section>
      </div>
    </main>
  );
}
