import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import seoData from "@/data/seo/topics.json";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface Props {
  params: { topic: string; location: string };
}

export async function generateStaticParams() {
  const params: any[] = [];
  seoData.topics.forEach((topic) => {
    seoData.locations.forEach((location) => {
      params.push({
        topic: topic.slug,
        location: location.toLowerCase(),
      });
    });
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = seoData.topics.find((t) => t.slug === params.topic);
  const location = seoData.locations.find((l) => l.toLowerCase() === params.location);
  
  if (!topic || !location) return {};

  return getMetadata({
    title: `${topic.title} Courses in ${location} | The Honest Guide`,
    description: `Professional ${topic.title} education for traders in ${location}. Online, self-paced, and built for the UK market. No hype, just edge.`,
  });
}

export default function LocationPage({ params }: Props) {
  const topic = seoData.topics.find((t) => t.slug === params.topic);
  const location = seoData.locations.find((l) => l.toLowerCase() === params.location);
  
  if (!topic || !location) notFound();

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent font-mono text-[10px] uppercase tracking-widest mb-6">
            <MapPin className="w-3 h-3" /> {location}, UK
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-8 leading-tight">
            {topic.title} Courses <br /> in <span className="text-accent">{location}.</span>
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed mb-12 max-w-2xl font-sans">
            Whether you're trading from {location} or anywhere in the UK, Drawdown gives you the 
            structured education and AI-powered tools needed to trade {topic.title} without falling 
            for guru promises.
          </p>

          <div className="space-y-12 mb-20">
            {topic.content.map((section, i) => (
              <div key={i} className="space-y-4">
                <h2 className="text-2xl font-display font-bold uppercase">{section.heading}</h2>
                <p className="text-text-secondary leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="p-12 bg-background-surface border border-border-slate text-center">
            <h3 className="text-3xl font-display font-bold uppercase mb-4">UK-Focused Education</h3>
            <p className="text-text-secondary mb-10 max-w-xl mx-auto">
              Our {topic.title} curriculum is built by UK traders for UK traders. We focus on 
              discipline, stats, and the cold truth of the markets.
            </p>
            <Link 
              href="/signup" 
              className="inline-block px-12 py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
