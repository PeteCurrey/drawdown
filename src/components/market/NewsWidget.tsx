"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/news";
import { ExternalLink, RefreshCw, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news/feed");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data.slice(0, 5));
      }
    } catch (err) {
      console.error("News widget error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestNews();
    const interval = setInterval(fetchLatestNews, 900000); // 15 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Market News</h4>
        <button onClick={fetchLatestNews} disabled={loading} className="text-text-tertiary hover:text-accent transition-colors">
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
        </button>
      </div>

      <div className="p-8 bg-background-surface border border-border-slate space-y-6">
        <div className="space-y-5">
          {loading && news.length === 0 ? (
            <p className="text-[10px] font-mono text-text-tertiary animate-pulse">Fetching latest headlines...</p>
          ) : (
            news.map((item, i) => {
              const isHighImpact = /BOE|Bank of England|MPC|CPI|Inflation|Employment|Rates/i.test(item.title);
              const isBoE = /BOE|Bank of England|MPC/i.test(item.title);
              
              return (
                <div key={i} className={cn(
                  "group space-y-2 pb-5 border-b border-border-slate/30 last:border-0 last:pb-0",
                  isHighImpact && "bg-accent/[0.03] -mx-4 px-4 py-3 border-l-2 border-l-accent"
                )}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center gap-2">
                        {isHighImpact && (
                          <span className="text-[7px] font-mono bg-accent text-background-primary px-1 py-0.5 font-black uppercase tracking-tighter">
                            High Impact
                          </span>
                        )}
                        {isBoE && (
                          <span className="text-[7px] font-mono bg-background-elevated border border-accent/30 text-accent px-1 py-0.5 font-bold uppercase tracking-tighter">
                            BoE Specific
                          </span>
                        )}
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-display font-bold uppercase leading-tight hover:text-accent transition-colors block"
                      >
                        {item.title}
                      </a>
                    </div>
                    <ExternalLink className="w-3 h-3 text-text-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                  <div className="flex items-center gap-3 text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                    <span>{item.source}</span>
                    <span className="w-1 h-1 bg-border-slate rounded-full" />
                    <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Link 
          href="/dashboard/news" 
          className="w-full py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-text-primary transition-colors flex items-center justify-center gap-2 group"
        >
          Full News Feed <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
