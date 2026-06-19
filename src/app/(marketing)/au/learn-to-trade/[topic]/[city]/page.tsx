import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { AU_LOCATIONS } from "@/data/seo/au-locations";
import { AU_TOPICS } from "@/data/seo/au-data";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap, MapPin, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { StructuredData } from "@/components/StructuredData";
import { createInternalSupabase } from "@/lib/supabase/server";

export const dynamicParams = true;
export const revalidate = 86400; // 24 hours - content doesn't change often

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  return [];
}

async function getAUCityData(topicSlug: string, citySlug: string) {
  let topicTitle = "";
  const localTopic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  if (localTopic) {
    topicTitle = localTopic.title;
  } else {
    try {
      const supabase = createInternalSupabase();
      const { data: page } = await supabase
        .from("seo_pages")
        .select("*")
        .eq("slug", topicSlug)
        .eq("page_type", "learn_to_trade")
        .maybeSingle();
      if (page) {
        topicTitle = page.title;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!topicTitle) return null;

  let cityName = "";
  let cityContext = "";
  let isCityValid = false;

  try {
    const supabase = createInternalSupabase();
    const { data: page } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", citySlug)
      .eq("page_type", "location")
      .maybeSingle();
    if (page) {
      cityName = page.title;
      cityContext = page.seo_description || "";
      isCityValid = true;
    }
  } catch (err) {
    console.error(err);
  }

  const localCity = AU_LOCATIONS.find((l) => l.slug === citySlug);
  if (!isCityValid && localCity) {
    cityName = localCity.name;
    cityContext = localCity.context || "";
    isCityValid = true;
  }

  if (!isCityValid) return null;

  return {
    topic: localTopic || {
      title: topicTitle,
      slug: topicSlug,
      content: [
        {
          heading: "Overview",
          text: cityContext || "",
        }
      ]
    },
    city: localCity || {
      name: cityName,
      slug: citySlug,
      context: cityContext,
    }
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, city: citySlug } = await params;
  const data = await getAUCityData(topicSlug, citySlug);
  
  if (!data) return {};

  const { topic, city } = data;

  return {
    title: `${topic.title} in ${city.name} — Learn Online | Drawdown AU`,
    description: `Learn ${topic.title} from ${city.name} with Drawdown. Structured courses, ASIC-regulated data, and Australian-focused trading education.`,
  };
}

export default async function AustralianLocationTopicPage({ params }: Props) {
  const { topic: topicSlug, city: citySlug } = await params;
  const data = await getAUCityData(topicSlug, citySlug);

  if (!data) notFound();

  const { topic, city } = data;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Are there trading courses in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, while there are some traditional courses in ${city.name}, Drawdown offers a professional-grade online alternative. You can access institutional ${topic.title} education from ${city.name} starting at A$79/month.`
        }
      },
      {
        "@type": "Question",
        "name": `Is trading ${topic.title} legal in Australia?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, trading ${topic.title} is legal and regulated by ASIC in Australia. We recommend using an AFSL-licensed broker.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <TrackPageView path={`/au/learn-to-trade/${topicSlug}/${citySlug}`} />
      <StructuredData type="FAQPage" data={faqSchema} />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-12">
          <Link href="/au" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/au/learn-to-trade" className="hover:text-accent transition-colors">Learn</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{city.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
             <MapPin className="w-4 h-4 text-accent" />
             <span className="text-accent font-mono text-[10px] uppercase tracking-widest">Australian Hub // {city.name}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 text-text-primary leading-[0.85]">
            {topic.title} in <br /> {city.name}.
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-2xl text-text-primary font-sans uppercase leading-tight italic border-l-4 border-border-slate/50 pl-8">
                {city.context}
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                As a trader in {city.name}, you have access to the ASX and a sophisticated regional market. Drawdown provides the institutional-grade ${topic.title} education you need to succeed in Australia's competitive financial landscape.
              </p>
            </div>
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-8 space-y-6">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-profit" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">ASIC Compliance</span>
               </div>
               <ul className="space-y-4">
                  {[
                    "ASIC Regulated Brokers",
                    "AUD Denominated Tools",
                    "ATO Tax Optimization",
                    "ASX Market Integration"
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
                <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight text-text-primary">
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
            <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5/30 space-y-6 text-center">
               <GraduationCap className="w-10 h-10 text-accent mx-auto" />
               <h4 className="text-xl font-sans font-bold uppercase">Master {topic.title}</h4>
               <p className="text-xs text-text-secondary leading-relaxed">
                  Join Australia's premier trading curriculum and master the business of risk properly.
               </p>
               <Link href="/au/courses" className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-[10px] block">
                  Access Curriculum
               </Link>
            </div>
          </aside>
        </div>

        {/* CTA */}
        <section className="p-16 bg-mkt-ink text-white relative overflow-hidden text-center">
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase leading-none">
                 Start Learning With Drawdown Today.
              </h2>
              <Link 
                href="/au/signup"
                className="inline-block px-12 py-6 text-text-primary text-[12px] font-bold uppercase tracking-widest hover:invert transition-all"
              >
                 Join Drawdown Free
              </Link>
           </div>
           <div className="absolute -right-20 -bottom-20 text-[300px] font-sans font-black text-white/10 select-none uppercase">
              {city.name[0]}
           </div>
        </section>
      </div>
    </main>
  );
}
