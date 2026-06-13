"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/news";
import { ExternalLink, RefreshCw, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

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
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin text-accent")} />
        </button>
      </div>

      <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 space-y-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
        <div className="space-y-5">
          {loading ? (
            <p className="text-[10px] font-mono text-text-tertiary animate-pulse">Fetching latest headlines...</p>
          ) : (
            news.map((item, i) => {
              const isHighImpact = /BOE|Bank of England|MPC|CPI|Inflation|Employment|Rates/i.test(item.title);
              
              return (
                <div key={i} className={cn(
                  "group space-y-2 pb-5 border-b border-border-slate/30 last:border-0 last:pb-0",
                  isHighImpact && "bg-accent/[0.03] -mx-4 px-4 py-3 border-l-2 border-l-accent"
                )}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center gap-2">
                        {isHighImpact && (
                          <span className="text-[7px] font-mono bg-text-primary text-background-primary px-1 py-0.5 font-black uppercase tracking-tighter">
                            High Impact
                          </span>
                        )}
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-sans font-bold uppercase leading-tight hover:text-accent transition-colors block"
                      >
                        {item.title}
                      </a>
                    </div>
                    <ExternalLink className="w-3 h-3 text-text-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                  <div className="flex items-center gap-3 text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                    <NewsSourceLogo source={item.source} showText={true} size="xs" />
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
          className="w-full py-3 bg-background-elevated/50 border border-border-slate/50 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center justify-center gap-2 group text-text-primary"
        >
          Full News Feed <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
