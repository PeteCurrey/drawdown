"use client";

import { NewsItem } from "@/lib/news";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface PulseHeroProps {
  story: NewsItem | null;
  loading: boolean;
}

export function PulseHero({ story, loading }: PulseHeroProps) {
  if (loading) {
    return (
      <div className="w-full aspect-[21/9] md:aspect-[24/7] bg-white animate-pulse border border-mkt-bd" />
    );
  }

  if (!story) return null;

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[24/7] border border-mkt-bd bg-white group overflow-hidden">
      {/* Background Image with Reveal */}
      <div className="absolute inset-0 z-0">
        {story.imageUrl ? (
          <Image 
            src={story.imageUrl} 
            alt={story.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 opacity-20 group-hover:opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-transparent opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background-surface via-background-surface/80 to-transparent z-10" />
      </div>

      <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-20 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-bold uppercase tracking-widest">
            {story.source}
          </span>
          <span className="flex items-center gap-1.5 text-mkt-i4 text-[10px] font-mono uppercase tracking-widest">
            <Clock className="w-3 h-3" /> {story.publishedAt}
          </span>
          <span className="flex items-center gap-1.5 text-mkt-grn text-[10px] font-mono uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3 h-3" /> Institutional Feed
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black uppercase tracking-tight leading-[0.9] group-hover:text-accent transition-colors duration-500">
          {story.title}
        </h1>

        <p className="text-sm md:text-base text-mkt-i2 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none opacity-80">
          {story.excerpt}
        </p>

        <a 
          href={story.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest group/btn"
        >
          <span className="border-b border-accent py-1">Read Full Intelligence Report</span>
          <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover/btn:translate-x-2" />
        </a>
      </div>

      {/* Aesthetic Border Highlights */}
      <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-accent/50 to-transparent" />
    </div>
  );
}
