import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { US_CITIES, US_TOPICS, CITY_CONTEXT_US } from "@/data/seo/us-data";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap, MapPin, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { StructuredData } from "@/components/StructuredData";

interface Props {
  params: { topic: string; city: string };
}

export async function generateStaticParams() {
  const params: { topic: string; city: string }[] = [];
  
  US_TOPICS.forEach((topicSlug) => {
    US_CITIES.forEach((citySlug) => {
      params.push({
        topic: topicSlug,
        city: citySlug,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, city: citySlug } = params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  const cityName = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  if (!topic || !US_CITIES.includes(citySlug)) return {};

  return {
    title: `${topic.title} in ${cityName} — Professional Online Training | Drawdown US`,
    description: `Master ${topic.title} from ${cityName} with Drawdown. Structured courses, US-regulated data, and professional trading education tailored for the American market.`,
  };
}

export default function UnitedStatesLocationTopicPage({ params }: Props) {
  const { topic: topicSlug, city: citySlug } = params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  const cityName = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const cityContext = CITY_CONTEXT_US[citySlug];

  if (!topic || !US_CITIES.includes(citySlug)) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Are there trading courses in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, while there are traditional classroom seminars in ${cityName}, Drawdown offers a professional-grade online alternative. You can access institutional ${topic.title} education from ${cityName} starting at $79/month.`
        }
      },
      {
        "@type": "Question",
        "name": `Does the PDT rule apply to traders in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, the Pattern Day Trader (PDT) rule applies to all US-based traders, including those in ${cityName}, who trade stocks or options in a margin account with less than $25,000 equity.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20">
      <TrackPageView path={`/us/learn-to-trade/${topicSlug}/${citySlug}`} />
      <StructuredData type="FAQPage" data={faqSchema} />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-12">
          <Link href="/us" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/us/learn-to-trade" className="hover:text-accent transition-colors">Learn</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{cityName}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
             <MapPin className="w-4 h-4 text-accent" />
             <span className="text-accent font-mono text-[10px] uppercase tracking-widest">US Regional Hub // {cityName}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 text-text-primary leading-[0.85]">
            {topic.title} in <br /> {cityName}.
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-2xl text-text-primary font-display uppercase leading-tight italic border-l-4 border-accent pl-8">
                {cityContext}
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                As a trader in {cityName}, you are operating within the world's most liquid financial ecosystem. Drawdown provides the institutional-grade ${topic.title} education you need to navigate the US regulatory landscape—from SEC compliance to CFTC-registered execution.
              </p>
            </div>
            <div className="bg-background-surface border border-border-slate p-8 space-y-6">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-profit" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">US Compliance</span>
               </div>
               <ul className="space-y-4">
                  {[
                    "FINRA/SEC Regulated Brokers",
                    "USD Denominated Tools",
                    "IRS Tax Optimization",
                    "PDT Rule Guidance"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs text-text-secondary">
                       <span className="w-1 h-1 bg-accent rounded-full" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>

        {/* Topic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start mb-32">
          <div className="lg:col-span-2 space-y-20">
            {topic.content.map((section, i) => (
              <section key={i} className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-text-primary">
                  {i + 1}. {section.heading}
                </h2>
                <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-line">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            <div className="p-8 bg-background-surface border border-accent/30 space-y-6 text-center">
               <GraduationCap className="w-10 h-10 text-accent mx-auto" />
               <h4 className="text-xl font-display font-bold uppercase">Master {topic.title}</h4>
               <p className="text-xs text-text-secondary leading-relaxed">
                  Join America's premier trading curriculum and master the business of risk properly.
               </p>
               <Link href="/us/courses" className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-[10px] block">
                  Access Curriculum
               </Link>
            </div>
          </aside>
        </div>

        {/* CTA */}
        <section className="p-16 bg-accent text-background-primary relative overflow-hidden text-center">
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-none">
                 Join 20,000+ Traders <br /> Across the United States.
              </h2>
              <Link 
                href="/us/signup"
                className="inline-block px-12 py-6 bg-background-primary text-text-primary text-[12px] font-bold uppercase tracking-widest hover:invert transition-all shadow-2xl"
              >
                 Join Drawdown Free
              </Link>
           </div>
           <div className="absolute -right-20 -bottom-20 text-[300px] font-display font-black text-white/10 select-none uppercase">
              {cityName[0]}
           </div>
        </section>
      </div>
    </main>
  );
}
