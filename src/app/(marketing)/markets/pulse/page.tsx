"use client";

import { useEffect, useState } from "react";
import { PulseTicker } from "@/components/markets/pulse/PulseTicker";
import { PulseBarometer } from "@/components/markets/pulse/PulseBarometer";
import { PulseAssetMatrix } from "@/components/markets/pulse/PulseAssetMatrix";
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
    let active = true;

    async function getNews() {
      try {
        const res = await fetch("/api/news/feed");
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (err) {
        console.error("Failed to fetch news feed:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    getNews();
    const interval = setInterval(getNews, 60000); // Poll news feed every 60 seconds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const featuredStory = news.length > 0 ? news[0] : null;
  const feedStories = news.slice(1);

  return (
    <div className="min-h-screen bg-background-primary">
      <PulseTicker />
      <TrackPageView path="/markets/pulse" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Title */}
        <div className="mb-10">
          <Breadcrumbs />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                LIVE INTELLIGENCE ROOM
              </div>
              <h1 className="text-4xl md:text-7xl font-sans font-black uppercase tracking-tight text-mkt-ink">
                The <span className="text-accent underline decoration-accent/30 underline-offset-8">Pulse.</span>
              </h1>
            </div>
            <p className="text-sm md:text-base text-text-secondary max-w-xl font-medium leading-relaxed">
              Institutional news aggregation, central bank vitals, real-time energy desks, and cross-asset heatmaps for professional traders.
            </p>
          </div>
        </div>

        {/* 1. Top Barometer: Real-time Macro Conditions, VIX & Central Bank */}
        <PulseBarometer />

        {/* 2. Real-Time Cross-Asset Heatmap Matrix */}
        <PulseAssetMatrix />

        {/* 3. Hero Story Section */}
        <div className="mb-16">
          <PulseHero story={featuredStory} loading={loading} />
        </div>

        {/* 4. Main Content Grid (News Stream & Intelligence Sidebar Desks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed (Left) */}
          <div className="lg:col-span-8">
             <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-text-tertiary font-bold">LIVE_INTELLIGENCE_STREAM</span>
                <div className="h-px flex-grow bg-border-slate/30" />
             </div>
             <PulseFeed news={feedStories} loading={loading} />
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-10">
             <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-text-tertiary font-bold">DESK_CONTEXT</span>
                <div className="h-px flex-grow bg-border-slate/30" />
             </div>
             <PulseSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
