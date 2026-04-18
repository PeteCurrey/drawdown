"use client";

import { useEffect, useState } from "react";
import { Radio, Search, ExternalLink, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsTab() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news/feed");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("News Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const filteredNews = filter === "all" 
    ? news 
    : news.filter(n => n.categories?.includes(filter));

  const categories = ["all", "forex", "stocks", "crypto", "commodities", "uk-markets", "us-markets"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-border-slate">
         <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all border",
                  filter === cat 
                    ? "bg-accent text-background-primary border-accent" 
                    : "bg-background-surface text-text-tertiary border-border-slate hover:border-accent/40"
                )}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-background-surface border border-border-slate animate-pulse" />
          ))
        ) : filteredNews.map((item, i) => (
          <a 
            key={i} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group p-8 bg-background-surface border border-border-slate hover:border-accent transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">{item.source}</span>
                <span className="text-[9px] font-mono text-text-tertiary uppercase">{item.publishedAt}</span>
              </div>
              <h3 className="text-lg font-display font-bold uppercase group-hover:text-accent transition-colors leading-tight mb-4 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-6">
                {item.excerpt}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border-slate/30">
               {item.categories.map((cat: string) => (
                 <span key={cat} className="text-[8px] font-mono uppercase text-text-tertiary flex items-center gap-1">
                   <Hash className="w-2.5 h-2.5" /> {cat.replace('-', ' ')}
                 </span>
               ))}
               <ExternalLink className="w-3.5 h-3.5 text-text-tertiary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
