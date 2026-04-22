"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { glossaryData } from "@/data/glossary";
import { Search, ArrowRight } from "lucide-react";

export default function GlossaryIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = glossaryData.filter((term) =>
    term.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const groupedTerms = alphabet.reduce((acc, letter) => {
    const terms = filteredTerms.filter((term) =>
      term.title.toUpperCase().startsWith(letter)
    );
    if (terms.length > 0) {
      acc[letter] = terms;
    }
    return acc;
  }, {} as Record<string, typeof glossaryData>);

  return (
    <div className="bg-background-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <div className="mt-12 mb-20">
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight text-text-primary">
            Trading <span className="text-accent">Glossary.</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mb-12">
            Master the language of the markets. From basic concepts to advanced institutional terminology, our glossary covers everything you need to trade with intelligence.
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
            <input
              type="text"
              placeholder="Search terms (e.g. Drawdown, Order Block)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-surface border border-border-slate pl-12 pr-4 py-6 text-lg outline-none focus:border-accent transition-colors uppercase font-mono tracking-wider"
            />
          </div>
        </div>

        <div className="space-y-24">
          {Object.entries(groupedTerms).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
            <div key={letter} className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-border-slate/30 pt-12">
              <div className="md:col-span-1">
                <span className="text-6xl font-display font-black text-accent/20 leading-none">
                  {letter}
                </span>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {terms.sort((a, b) => a.title.localeCompare(b.title)).map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="group p-6 bg-background-surface border border-border-slate hover:border-accent transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
                        {term.title}
                      </h3>
                      <p className="text-[10px] text-text-tertiary uppercase font-mono mt-1">
                        {term.seo_description.slice(0, 40)}...
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedTerms).length === 0 && (
            <div className="text-center py-20 border border-dashed border-border-slate">
              <p className="text-text-tertiary uppercase font-mono tracking-widest">No terms found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
