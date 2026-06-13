import { Metadata } from "next";
import Link from "next/link";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Learn to Trade | Professional Trading Education | Drawdown",
  description: "Master the financial markets with our structured, institutional-grade trading curriculum. From basics to advanced strategy.",
};

export default function LearnHub() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <TrackPageView path="/learn-to-trade" />
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mkt-ink">Learn</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 underline decoration-accent/30 underline-offset-8 decoration-2">// TRADING ACADEMY</span>
              <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase text-mkt-ink leading-[0.85]">
                Level <br /> Up.
              </h1>
            </div>
            <p className="text-xl text-mkt-i2 max-w-xl font-sans leading-relaxed">
              We don't sell "get rich quick" schemes. We provide a structured, institutional-grade curriculum designed to turn you into a disciplined, profitable trader.
            </p>
          </div>

          {/* Featured Course Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 blur-[100px] group-hover:bg-accent/30 transition-all" />
            <div className="relative block bg-white border border-mkt-bd/30 p-12 overflow-hidden">
               <div className="flex items-center gap-4 mb-8">
                  <GraduationCap className="w-6 h-6 text-accent" />
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">Flagship Curriculum</span>
               </div>
               
               <div className="space-y-6">
                  <h3 className="text-4xl font-sans font-bold uppercase">The Institutional Foundation</h3>
                  <p className="text-mkt-i2 text-sm leading-relaxed">
                     Our comprehensive 12-week program that covers everything from market micro-structure to advanced behavioral psychology.
                  </p>
                  <Link 
                    href="/courses"
                    className="inline-flex items-center justify-center px-8 py-4 bg-mkt-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors w-full"
                  >
                     Explore Courses
                  </Link>
               </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEARN_TOPICS.map((topic) => (
            <Link 
              key={topic.slug} 
              href={`/learn-to-trade/${topic.slug}`}
              className="group bg-white border border-mkt-bd p-10 hover:border-mkt-bds transition-premium flex flex-col justify-between h-[350px] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">Module</span>
                  <BookOpen className="w-4 h-4 text-mkt-i4 group-hover:text-accent transition-colors" />
                </div>
                <h2 className="text-3xl font-sans font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                  {topic.title}
                </h2>
                <p className="text-mkt-i2 text-xs leading-relaxed line-clamp-3 font-mono uppercase tracking-tight">
                  {topic.description}
                </p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-mkt-bd/50 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-ink group-hover:text-accent transition-colors">Start Learning</span>
                <ArrowRight className="w-4 h-4 text-mkt-i4 group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </div>

              {/* Decorative background circle */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
