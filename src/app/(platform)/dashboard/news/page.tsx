"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/news";
import { 
  ExternalLink, 
  RefreshCw, 
  Search,
  MessageSquare,
  Clock,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [explainingId, setExplainingId] = useState<number | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});

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
    { id: "world-economy", label: "World Economy" }
  ];

  const filteredNews = news.filter(item => {
    const matchesSearch = search === "" || 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.source.toLowerCase().includes(search.toLowerCase());
    
    // Ensure item.categories exists or fallback directly
    const itemCats = item.categories || [];
    const matchesCategory = activeCategory === "all" || itemCats.includes(activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-4">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold uppercase tracking-tight">World News Feed</h1>
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
              // Real-time financial insights from global sources
            </p>
          </div>
          <button 
            onClick={fetchNewsFeed} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-background-elevated border border-border-slate hover:border-accent hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            {loading ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 p-4 bg-background-surface border border-border-slate focus-within:border-accent transition-colors">
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
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-border-slate/50">
          {categories.map(cat => {
            // Count matching articles for this category using search constraint
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
                  "px-1.5 py-0.5 rounded-sm text-[8px] font-mono",
                  activeCategory === cat.id ? "bg-accent/20" : "bg-background-elevated"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading && news.length === 0 ? (
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-background-surface animate-pulse border border-border-slate" />
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((item, i) => (
            <article key={i} className="group bg-background-surface border border-border-slate hover:border-accent/40 transition-premium overflow-hidden">
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                      <span className="text-accent group-hover:text-accent-hover transition-colors">{item.source}</span>
                      <span className="w-1 h-1 bg-border-slate rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-2xl font-display font-bold uppercase leading-snug hover:text-accent transition-colors block"
                    >
                      {item.title}
                    </a>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button 
                      onClick={() => handleExplain(i, item)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 border transition-all text-[10px] font-bold uppercase tracking-widest",
                        explainingId === i 
                          ? "bg-accent text-background-primary border-accent" 
                          : "bg-background-elevated border-border-slate hover:border-accent hover:text-accent"
                      )}
                    >
                      <Sparkles className={cn("w-3 h-3", explainingId === i && "animate-pulse")} />
                      AI Context
                    </button>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 bg-background-elevated border border-border-slate hover:border-text-primary transition-colors text-text-tertiary hover:text-text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-text-secondary leading-relaxed max-w-4xl">
                  {item.excerpt}
                </p>

                {/* AI Explanation Area */}
                {explainingId === i && (
                  <div className="mt-8 pt-8 border-t border-border-slate/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-accent" />
                      </div>
                      <div className="space-y-4 flex-grow">
                        <p className="text-[10px] font-mono uppercase font-bold tracking-widest text-accent">AI Analysis Context</p>
                        {aiExplanations[i] ? (
                          <div className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed">
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
                            <span className="text-[10px] font-mono text-text-tertiary uppercase">Claude is analysing the market impact...</span>
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
            </article>
          ))
        ) : (
          <div className="p-20 text-center border border-dashed border-border-slate">
            <p className="text-text-tertiary font-mono text-xs uppercase tracking-widest">No matching news found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
