"use client";

import { useEffect, useState } from "react";
import { PulseTicker } from "@/components/markets/pulse/PulseTicker";
import { PulseHero } from "@/components/markets/pulse/PulseHero";
import { PulseFeed } from "@/components/markets/pulse/PulseFeed";
import { PulseSidebar } from "@/components/markets/pulse/PulseSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NewsItem } from "@/lib/news";
import { TrackPageView } from "@/components/admin/TrackPageView";

export default function MarketPulseHubPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      try {
        const res = await fetch("/api/news/feed");
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (err) {
        console.error("Failed to fetch news feed:", err);
      } finally {
        setLoading(false);
      }
    }
    getNews();
  }, []);

  const featuredStory = news.length > 0 ? news[0] : null;
  const feedStories = news.slice(1);

  return (
    <div className="bg-white min-h-screen">
      <PulseTicker />
      <TrackPageView path="/markets/pulse" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Breadcrumbs />
          <h1 className="text-5xl md:text-8xl font-sans font-black uppercase tracking-tight mt-8">
            The <span className="text-accent underline decoration-accent/20">Pulse.</span>
          </h1>
          <p className="text-lg text-mkt-i2 mt-4 max-w-2xl">
            Real-time institutional news aggregation and macro intelligence for professional-grade retail traders. Bookmark this room for your daily edge.
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-20">
          <PulseHero story={featuredStory} loading={loading} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Feed (Left) */}
          <div className="lg:col-span-8">
             <div className="flex items-center gap-4 mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-mkt-i4">Live_News_Flow</span>
                <div className="h-px flex-grow bg-border-slate/30" />
             </div>
             <PulseFeed news={feedStories} loading={loading} />
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-12">
             <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-mkt-i4">Market_Context</span>
                <div className="h-px flex-grow bg-border-slate/30" />
             </div>
             <PulseSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
