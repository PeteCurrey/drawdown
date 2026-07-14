"use client";
 
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NewsItem } from "@/lib/news";
import { 
  ExternalLink, 
  RefreshCw, 
  Search,
  Clock,
  Sparkles,
  Bell,
  Newspaper,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { WatchlistManager } from "@/components/dashboard/WatchlistManager";
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

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [explainingId, setExplainingId] = useState<number | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [startIndex, setStartIndex] = useState(0);
 
  const fetchNewsFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news/feed");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
      }
    } catch (err) {
      console.error("News page error:", err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchNewsFeed();
  }, []);

  // Rotate hero every 10 seconds — same cadence as home page and dashboard widget
  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [news.length]);

  // Featured story cycles through the full pool
  const featuredItem = useMemo(() => {
    if (news.length === 0) return null;
    return news[startIndex % news.length];
  }, [news, startIndex]);
 
  const handleExplain = async (index: number, item: NewsItem) => {
    if (aiExplanations[index]) {
      setExplainingId(explainingId === index ? null : index);
      return;
    }
 
    setExplainingId(index);
    try {
      const res = await fetch("/api/ai/explain-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item })
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanations(prev => ({ ...prev, [index]: data.explanation }));
      }
    } catch (err) {
      console.error("AI Explain error:", err);
    }
  };
 
  const [activeCategory, setActiveCategory] = useState("all");
 
  const categories = [
    { id: "all", label: "All" },
    { id: "uk-markets", label: "UK Markets" },
    { id: "us-markets", label: "US Markets" },
    { id: "forex", label: "Forex" },
    { id: "crypto", label: "Crypto" },
    { id: "commodities", label: "Commodities" },
    { id: "world-economy", label: "World Economy" },
    { id: "watchlist", label: "My Watchlist", icon: Bell }
  ];
 
  const filteredNews = news.filter(item => {
    if (activeCategory === "watchlist") return false;
    const matchesSearch = search === "" || 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.source.toLowerCase().includes(search.toLowerCase());
    
    const itemCats = item.categories || [];
    const matchesCategory = activeCategory === "all" || itemCats.includes(activeCategory);
 
    return matchesSearch && matchesCategory;
  });
 
  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-700">
      <header className="space-y-4">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-black uppercase tracking-tight text-text-primary">World News Feed</h1>
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
              // Real-time financial insights from global sources
            </p>
          </div>
          <button 
            onClick={fetchNewsFeed} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-background-elevated/40 border border-border-slate/50 hover:border-accent hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest rounded-lg"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            {loading ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>
      </header>

      {/* Rotating hero card — same image rotation as home page */}
      <div className="relative overflow-hidden bg-black border border-border-slate/50 h-[320px] group">
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-background-surface/40" />
        ) : featuredItem ? (
          <AnimatePresence mode="wait">
            <motion.a
              key={featuredItem.url}
              href={featuredItem.url}
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
                style={{ backgroundImage: `url(${featuredItem.imageUrl || fallbackImage})` }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25 z-0" />

              {/* Top row */}
              <div className="relative z-10 flex justify-between items-center p-6">
                <span className="text-[9px] font-mono font-black text-white bg-accent px-2.5 py-1 uppercase tracking-wider">
                  LIVE
                </span>
                <Newspaper className="w-5 h-5 text-white/60" />
              </div>

              {/* Bottom content */}
              <div className="relative z-10 p-6 space-y-3">
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
                  {formatPubDate(featuredItem.publishedAt)} &bull; {featuredItem.source}
                </p>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-white leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {featuredItem.title}
                </h2>
                {featuredItem.excerpt && (
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-2 max-w-3xl">
                    {featuredItem.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 uppercase tracking-widest pt-1">
                  <span>Read coverage</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
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
 
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 p-4 bg-background-surface border border-border-slate/50 focus-within:border-accent/60 transition-colors rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <Search className="w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="SEARCH HEADLINES OR SOURCES..."
            className="bg-transparent border-none outline-none font-mono text-[10px] uppercase tracking-widest text-text-primary w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
 
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-border-slate/30">
          {categories.map(cat => {
            const count = news.filter(item => {
              const itemCats = item.categories || [];
              const matchesSearch = search === "" || 
                item.title.toLowerCase().includes(search.toLowerCase()) || 
                item.source.toLowerCase().includes(search.toLowerCase());
              return matchesSearch && (cat.id === "all" || itemCats.includes(cat.id));
            }).length;
 
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2",
                  activeCategory === cat.id 
                    ? "border-accent text-accent bg-accent/5" 
                    : "border-transparent text-text-tertiary hover:text-text-primary hover:border-border-slate"
                )}
              >
                {cat.label}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold",
                  activeCategory === cat.id ? "bg-accent/20" : "bg-background-elevated"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
 
      <div className="grid grid-cols-1 gap-6">
        {activeCategory === "watchlist" ? (
          <WatchlistManager />
        ) : loading && news.length === 0 ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-40 bg-background-surface animate-pulse border border-border-slate/50" />
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((item, i) => {
            const isHighImpact = /BOE|Bank of England|MPC|CPI|Inflation|Employment|Rates|Fed|FOMC/i.test(item.title);
            
            return (
              <article
                key={i}
                className={cn(
                  "group bg-background-surface border border-border-slate/50 hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden",
                  isHighImpact && "border-l-2 border-l-accent"
                )}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image panel — left side thumbnail */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative shrink-0 w-full md:w-56 h-40 md:h-auto overflow-hidden bg-neutral-900"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.imageUrl || fallbackImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    {isHighImpact && (
                      <span className="absolute top-3 left-3 text-[7px] font-mono font-black bg-accent text-background-primary px-1.5 py-0.5 uppercase tracking-wider z-10">
                        High Impact
                      </span>
                    )}
                  </a>

                  {/* Content panel */}
                  <div className="flex-grow p-6 md:p-8 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-text-tertiary flex-wrap">
                          <NewsSourceLogo source={item.source} showText={true} size="xs" />
                          <span className="w-1 h-1 bg-border-slate rounded-full" />
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>{formatPubDate(item.publishedAt)}</span>
                          </div>
                        </div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg md:text-xl font-display font-bold uppercase leading-snug hover:text-accent transition-colors block"
                        >
                          {item.title}
                        </a>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button 
                          onClick={() => handleExplain(i, item)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 border transition-all text-[10px] font-bold uppercase tracking-widest",
                            explainingId === i 
                              ? "bg-accent text-background-primary border-accent" 
                              : "bg-background-elevated/40 border-border-slate/80 hover:border-accent hover:text-accent"
                          )}
                        >
                          <Sparkles className={cn("w-3 h-3", explainingId === i && "animate-pulse")} />
                          AI Context
                        </button>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-background-elevated/40 border border-border-slate/80 hover:border-text-primary hover:text-text-primary transition-colors text-text-tertiary"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
 
                    {item.excerpt && (
                      <p className="text-text-secondary text-sm leading-relaxed max-w-4xl">
                        {item.excerpt}
                      </p>
                    )}
 
                    {/* AI Explanation Area */}
                    {explainingId === i && (
                      <div className="pt-6 border-t border-border-slate/30 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-accent/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-accent" />
                          </div>
                          <div className="space-y-3 flex-grow">
                            <p className="text-[10px] font-mono uppercase font-bold tracking-widest text-accent">AI Analysis Context</p>
                            {aiExplanations[i] ? (
                              <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
                                {aiExplanations[i].split('\n').map((para, idx) => (
                                  <p key={idx}>{para}</p>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 py-2">
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                                </div>
                                <span className="text-[10px] font-mono text-text-tertiary uppercase">Analysing the market impact...</span>
                              </div>
                            )}
                            <p className="text-[8px] font-mono text-text-tertiary italic">
                              This context is AI-generated for educational purposes. Not financial advice.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-20 text-center border border-dashed border-border-slate/80 bg-background-surface/40">
            <span className="text-xs font-mono uppercase text-text-tertiary tracking-widest">No articles found matching search criteria.</span>
          </div>
        )}
      </div>
    </div>
  );
}
