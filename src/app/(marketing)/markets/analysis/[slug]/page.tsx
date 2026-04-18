import { Metadata } from "next";
import { notFound } from "next/navigation";
import { expertAnalysis } from "@/data/analysis";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Calendar, Tag, ChevronLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return expertAnalysis.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = expertAnalysis.find((p) => p.slug === slug);
  if (!post) return {};

  return getMetadata({
    title: post.title,
    description: post.excerpt,
  });
}

export default async function AnalysisPostPage({ params }: Props) {
  const { slug } = await params;
  const post = expertAnalysis.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />

        <div className="max-w-4xl mx-auto">
          <Link 
            href="/markets" 
            className="flex items-center gap-2 text-[10px] font-mono uppercase text-text-tertiary hover:text-accent mb-12 group transition-colors"
          >
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Markets Hub
          </Link>

          <header className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className={cn(
                "px-2 py-0.5 text-[8px] font-mono uppercase tracking-[0.2em] border",
                post.type === 'daily' ? "text-accent border-accent/30" : "text-premium border-premium/30"
              )}>
                {post.type} Report
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {post.date}
              </span>
              {post.instrument && (
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-3 h-3" /> {post.instrument}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase leading-tight mb-8">
              {post.title}
            </h1>
            
            <p className="text-xl text-text-secondary leading-relaxed italic border-l-2 border-accent/20 pl-8">
              {post.excerpt}
            </p>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-a:text-accent prose-strong:text-text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-20 pt-12 border-t border-border-slate">
            <div className="p-12 bg-background-elevated border border-border-slate flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h4 className="text-xl font-display font-bold uppercase">Ready to trade this setup?</h4>
                <p className="text-sm text-text-secondary">Join Drawdown Pro for live institutional-grade analysis every day.</p>
              </div>
              <Link 
                href="/signup" 
                className="px-10 py-5 bg-accent text-background-primary font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors whitespace-nowrap"
              >
                Get The Edge
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Helper for conditional classes since we are in a server component
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
