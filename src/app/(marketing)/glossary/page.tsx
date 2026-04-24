import { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { Search, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Trading Glossary | Drawdown — Trade the Truth",
  description: "Comprehensive A-Z glossary of trading terms, concepts, and jargon explained in plain English for UK traders.",
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

  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
      <TrackPageView path="/glossary" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="  font-display font-bold uppercase tracking-tighter">Trading Glossary</h1>
          <p className="text-text-tertiary font-mono text-sm uppercase tracking-[0.3em] max-w-2xl mx-auto">
            Every essential term, concept, and piece of jargon explained with honest, UK-focused clarity.
          </p>
        </div>

        {/* Alpha Nav */}
        <nav className="flex flex-wrap justify-center gap-2 mb-16 border-y border-border-slate py-6">
          {alphabet.map((letter) => (
            <a 
              key={letter} 
              href={`#${letter}`}
              className={`w-8 h-8 flex items-center justify-center font-mono text-xs rounded hover:bg-accent hover:text-background-primary transition-colors ${groupedTerms[letter] ? 'text-text-primary' : 'text-text-tertiary pointer-events-none'}`}
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Search (Placeholder for functionality) */}
        <div className="max-w-xl mx-auto mb-20 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search glossary terms..." 
            className="w-full bg-background-elevated border border-border-slate px-12 py-4 text-sm focus:border-accent outline-none transition-colors font-mono"
          />
        </div>

        {/* Terms Grid */}
        <div className="space-y-20">
          {alphabet.filter(l => groupedTerms[l]).map((letter) => (
            <section key={letter} id={letter} className="scroll-mt-32">
              <div className="flex items-center space-x-6 mb-8">
                <h2 className="text-6xl font-display font-bold text-accent/20 select-none">{letter}</h2>
                <div className="h-px flex-1 bg-border-slate" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTerms[letter].map((term) => (
                  <Link 
                    key={term.slug} 
                    href={`/glossary/${term.slug}`}
                    className="group bg-background-elevated border border-border-slate p-6 hover:border-accent transition-all hover:-translate-y-1"
                  >
                    <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{term.term}</h3>
                    <p className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-4">{term.definition.slice(0, 80)}...</p>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent flex items-center space-x-2">
                      <span>Define Term</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
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
