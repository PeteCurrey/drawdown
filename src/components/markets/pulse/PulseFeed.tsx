"use client";

import { useState } from "react";
import { NewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";
import { Share2, ArrowUpRight, TrendingUp } from "lucide-react";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

interface PulseFeedProps {
  news: NewsItem[];
  loading: boolean;
}

const CATEGORIES = ["All Intel", "Macro", "Equities", "Crypto", "Central Banks"];

export function PulseFeed({ news, loading }: PulseFeedProps) {
  const [activeTab, setActiveTab] = useState("All Intel");

  const filteredNews = news.filter(item => {
    if (activeTab === "All Intel") return true;
    return item.categories.some(cat => cat.toLowerCase() === activeTab.toLowerCase());
  });

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-slate pb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
              activeTab === cat 
                ? "bg-accent text-background-primary shadow-lg shadow-accent/20" 
                : "bg-background-elevated/50 text-text-tertiary hover:text-text-primary border border-border-slate hover:border-accent/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 gap-px bg-border-slate border border-border-slate">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-background-surface animate-pulse" />
          ))
        ) : filteredNews.length > 0 ? (
          filteredNews.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-background-surface p-6 md:p-10 flex flex-col md:flex-row gap-8 transition-all duration-500 hover:bg-background-elevated/80 overflow-hidden"
            >
              {/* Subtle accent line on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
              
              {/* Thumbnail (Optional) */}
              <div className="w-full md:w-48 aspect-video bg-background-elevated shrink-0 relative overflow-hidden border border-border-slate/30">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <TrendingUp className="w-8 h-8 text-accent/10" />
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <NewsSourceLogo source={item.source} className="bg-white/10 px-2 py-0.5" />
                    <span className="w-1 h-1 rounded-full bg-border-slate" />
                    <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{item.publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Share2 className="w-3.5 h-3.5 text-text-tertiary hover:text-accent cursor-pointer" />
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                  </div>
                </div>

                <h3 className="text-lg md:text-2xl font-display font-medium uppercase leading-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-3xl">
                  {item.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.categories.map(cat => (
                    <span key={cat} className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary border border-border-slate/50 px-2 py-0.5">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="p-20 bg-background-surface text-center">
            <p className="text-sm font-mono text-text-tertiary uppercase tracking-widest">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
