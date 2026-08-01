"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";
import { Share2, ArrowUpRight, TrendingUp, Building2 } from "lucide-react";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

interface PulseFeedProps {
  news: NewsItem[];
  loading: boolean;
}

const CATEGORIES = ["All Intel", "Macro", "Equities", "Crypto", "Central Banks", "Corporate Filings"];

export function PulseFeed({ news, loading }: PulseFeedProps) {
  const [activeTab, setActiveTab] = useState("All Intel");
  const [polygonNews, setPolygonNews] = useState<any[]>([]);
  const [loadingPolygon, setLoadingPolygon] = useState(false);

  useEffect(() => {
    if (activeTab === "Corporate Filings" && polygonNews.length === 0) {
      setLoadingPolygon(true);
      fetch("/api/market/earnings")
        .then(res => res.json())
        .then(data => {
          if (data.news) setPolygonNews(data.news);
        })
        .catch(err => console.error("Error loading Polygon earnings news:", err))
        .finally(() => setLoadingPolygon(false));
    }
  }, [activeTab]);

  const filteredNews = news.filter(item => {
    if (activeTab === "All Intel") return true;
    return item.categories.some(cat => cat.toLowerCase() === activeTab.toLowerCase());
  });

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-mkt-bd pb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
              activeTab === cat 
                ? "bg-mkt-ink text-white shadow-lg shadow-accent/20" 
                : "bg-[#F7F7F7]/50 text-mkt-i4 hover:text-mkt-ink border border-mkt-bd hover:border-mkt-bds/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Corporate Filings View (Polygon API) */}
      {activeTab === "Corporate Filings" ? (
        <div className="grid grid-cols-1 gap-px bg-border-slate border border-mkt-bd">
          {loadingPolygon ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-white animate-pulse" />)
          ) : polygonNews.length > 0 ? (
            polygonNews.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white p-6 md:p-8 flex flex-col md:flex-row gap-6 transition-all duration-500 hover:bg-[#F7F7F7]/80"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 border border-accent/20">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-widest">
                      {item.publisher}
                    </span>
                    <span className="text-[9px] font-mono text-mkt-i4 uppercase">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-sans font-bold uppercase group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-mkt-i2 line-clamp-2">{item.summary}</p>
                  {item.tickers && item.tickers.length > 0 && (
                    <div className="flex gap-1.5 pt-1">
                      {item.tickers.map((t: string) => (
                        <span key={t} className="text-[8px] font-mono font-bold bg-black/5 border border-black/10 px-2 py-0.5 rounded uppercase">
                          ${t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="p-12 bg-white text-center text-xs font-mono text-mkt-i4 uppercase">
              No recent corporate filings from Polygon stream.
            </div>
          )}
        </div>
      ) : (
        /* Regular News List */
        <div className="grid grid-cols-1 gap-px bg-border-slate border border-mkt-bd">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-40 bg-white animate-pulse" />
            ))
          ) : filteredNews.length > 0 ? (
            filteredNews.map((item, i) => (
              <a 
                key={i} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-white p-6 md:p-10 flex flex-col md:flex-row gap-8 transition-all duration-500 hover:bg-[#F7F7F7]/80 overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
                
                <div className="w-full md:w-48 aspect-video bg-[#F7F7F7] shrink-0 relative overflow-hidden border border-mkt-bd/30">
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
                      <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">{item.publishedAt}</span>
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Share2 className="w-3.5 h-3.5 text-mkt-i4 hover:text-accent cursor-pointer" />
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                    </div>
                  </div>

                  <h3 className="text-lg md:text-2xl font-sans font-medium uppercase leading-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-mkt-i2 leading-relaxed line-clamp-2 max-w-3xl">
                    {item.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.categories.map(cat => (
                      <span key={cat} className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 border border-mkt-bd/50 px-2 py-0.5">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="p-20 bg-white text-center">
              <p className="text-sm font-mono text-mkt-i4 uppercase tracking-widest">No articles found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
