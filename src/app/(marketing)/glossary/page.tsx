import { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Trading Glossary | Drawdown — Trade the Truth",
  description: "Comprehensive A-Z glossary of trading terms, concepts, and jargon explained in plain English. Every definition a UK trader needs, from spreads to drawdown.",
};

export default function GlossaryIndex() {
  // Group terms by first letter
  const groupedTerms = GLOSSARY_TERMS.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, typeof GLOSSARY_TERMS>);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Mock trending terms
  const trending = GLOSSARY_TERMS.slice(0, 6);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <TrackPageView path="/glossary" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 underline decoration-accent/30 underline-offset-8 decoration-2">// TERMINOLOGY DATABASE</span>
          <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 text-text-primary leading-[0.85]">
             The Market <br /> Dictionary.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl font-sans leading-relaxed">
            Every essential term, concept, and piece of jargon explained with honest, UK-focused clarity. From "Alpha" to "Zero-Day Options."
          </p>
        </div>

        {/* Search & Trending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-12">
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search the dictionary..." 
                  className="w-full bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 px-16 py-6 text-lg focus:border-border-slate/50 outline-none transition-premium font-sans uppercase tracking-wider"
                />
             </div>

             <div className="space-y-6">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-tertiary">Quick Navigation</h4>
                <nav className="flex flex-wrap gap-2 border-y border-border-slate/50/30 py-8">
                  {alphabet.map((letter) => (
                    <a 
                      key={letter} 
                      href={`#${letter}`}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center font-sans text-sm border transition-all",
                        groupedTerms[letter] 
                          ? "text-text-primary border-border-slate/50 hover:border-border-slate hover:text-accent" 
                          : "text-text-tertiary border-transparent pointer-events-none opacity-30"
                      )}
                    >
                      {letter}
                    </a>
                  ))}
                </nav>
             </div>
          </div>

          <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-8 space-y-8">
             <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">Trending Terms</h4>
             <div className="space-y-4">
                {trending.map((term) => (
                   <Link 
                     key={term.slug}
                     href={`/glossary/${term.slug}`}
                     className="flex items-center justify-between group py-2 border-b border-border-slate/50/30 last:border-0"
                   >
                      <span className="text-sm font-bold uppercase group-hover:text-accent transition-colors">{term.term}</span>
                      <ArrowRight className="w-3 h-3 text-text-tertiary group-hover:translate-x-1 transition-all" />
                   </Link>
                ))}
             </div>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="space-y-32">
          {alphabet.filter(l => groupedTerms[l]).map((letter) => (
            <section key={letter} id={letter} className="scroll-mt-32">
              <div className="flex items-center space-x-8 mb-12">
                <h2 className="text-8xl font-sans font-bold text-profit select-none leading-none">{letter}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border-slate to-transparent" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {groupedTerms[letter].map((term) => (
                  <Link 
                    key={term.slug} 
                    href={`/glossary/${term.slug}`}
                    className="group flex flex-col justify-between py-6 border-b border-border-slate/30 hover:border-border-slate transition-all"
                  >
                    <div>
                       <h3 className="text-xl font-sans font-bold uppercase mb-4 group-hover:text-accent transition-colors">{term.term}</h3>
                       <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 font-sans">
                         {term.definition}
                       </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors">Definition</span>
                       <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:translate-x-2 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
