"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NewsItem } from "@/lib/news";
import { ExternalLink, RefreshCw, Newspaper, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";

function formatPubDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Live";
  }
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const fetchLatestNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news/feed");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data.slice(0, 20)); // pool to rotate through
      }
    } catch (err) {
      console.error("News widget error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + 15-minute background refresh
  useEffect(() => {
    fetchLatestNews();
    const refreshInterval = setInterval(fetchLatestNews, 900000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Rotate featured story every 10 seconds — same cadence as the home page
  useEffect(() => {
    if (news.length <= 4) return;
    const rotateInterval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(rotateInterval);
  }, [news.length]);

  // Active window of 4 items cycling through the pool
  const activeItems = useMemo(() => {
    if (news.length === 0) return [];
    return Array.from({ length: Math.min(4, news.length) }, (_, i) =>
      news[(startIndex + i) % news.length]
    );
  }, [news, startIndex]);

  const featured = activeItems[0];
  const listItems = activeItems.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Market News</h4>
        <button
          onClick={fetchLatestNews}
          disabled={loading}
          className="text-text-tertiary hover:text-accent transition-colors"
          aria-label="Refresh news"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin text-accent")} />
        </button>
      </div>

      {/* Featured rotating card with image background */}
      <div className="relative overflow-hidden bg-black border border-border-slate/50 h-[220px] group">
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-background-surface/40" />
        ) : featured ? (
          <AnimatePresence mode="wait">
            <motion.a
              key={featured.url}
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col justify-between"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${featured.imageUrl || fallbackImage})` }}
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-0" />

              {/* Top row: LIVE badge + icon */}
              <div className="relative z-10 flex justify-between items-center p-4">
                <span className="text-[9px] font-mono font-black text-white bg-accent px-2 py-0.5 uppercase tracking-wider">
                  LIVE
                </span>
                <Newspaper className="w-4 h-4 text-white/60" />
              </div>

              {/* Bottom content */}
              <div className="relative z-10 p-4 space-y-2">
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
                  {formatPubDate(featured.publishedAt)} &bull; {featured.source}
                </p>
                <h3 className="text-sm font-sans font-bold text-white leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {featured.title}
                </h3>
                <div className="flex items-center gap-1 text-[9px] font-mono text-white/50 uppercase tracking-widest pt-1">
                  <span>Read coverage</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </motion.a>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
            No news available
          </div>
        )}
      </div>

      {/* Rotating list items */}
      <div className="border border-border-slate/50 bg-background-surface/40 backdrop-blur-md">
        <div className="divide-y divide-border-slate/30">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="h-3 w-20 bg-border-slate/40 rounded" />
                  <div className="h-4 w-5/6 bg-border-slate/40 rounded" />
                </div>
              ))
            : listItems.map((item, i) => {
                const isHighImpact = /BOE|Bank of England|MPC|CPI|Inflation|Employment|Rates|Fed|FOMC/i.test(item.title);
                return (
                  <AnimatePresence key={`${startIndex}-${i}`} mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group flex gap-3 p-4 hover:bg-background-elevated/40 transition-colors",
                          isHighImpact && "border-l-2 border-l-accent"
                        )}
                      >
                        {/* Small thumbnail */}
                        <div
                          className="shrink-0 w-14 h-14 bg-cover bg-center bg-border-slate/30 overflow-hidden"
                          style={{ backgroundImage: `url(${item.imageUrl || fallbackImage})` }}
                        />
                        <div className="flex-grow min-w-0 space-y-1">
                          {isHighImpact && (
                            <span className="text-[7px] font-mono bg-text-primary text-background-primary px-1 py-0.5 font-black uppercase tracking-tighter inline-block">
                              High Impact
                            </span>
                          )}
                          <p className="text-[11px] font-sans font-bold leading-tight line-clamp-2 text-text-primary group-hover:text-accent transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                            <NewsSourceLogo source={item.source} showText={true} size="xs" />
                            <span className="w-0.5 h-0.5 bg-border-slate rounded-full" />
                            <span>{formatPubDate(item.publishedAt)}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-text-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                      </a>
                    </motion.div>
                  </AnimatePresence>
                );
              })}
        </div>

        <Link
          href="/dashboard/news"
          className="w-full py-3 bg-background-elevated/30 border-t border-border-slate/50 text-[10px] font-bold uppercase tracking-widest hover:border-t-accent hover:text-accent transition-colors flex items-center justify-center gap-2 group text-text-primary"
        >
          Full News Feed <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
