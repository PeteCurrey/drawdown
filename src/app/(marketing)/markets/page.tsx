"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OverviewTab } from "@/components/markets/OverviewTab";
import { CalendarTab } from "@/components/markets/CalendarTab";
import { ScannerTab } from "@/components/markets/ScannerTab";
import { SentimentTab } from "@/components/markets/SentimentTab";
import { NewsTab } from "@/components/markets/NewsTab";
import { EarningsTab } from "@/components/markets/EarningsTab";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, BarChart3, Radio, Percent, Gauge } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "calendar", label: "Economic Calendar", icon: Calendar },
  { id: "earnings", label: "Earnings", icon: BarChart3 },
  { id: "scanner", label: "Market Scanner", icon: Percent },
  { id: "news", label: "Live News", icon: Radio },
  { id: "sentiment", label: "Sentiment", icon: Gauge },
];

function MarketsHubSkeleton() {
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="h-6 w-48 bg-background-surface animate-pulse mb-8" />
        <div className="mb-12">
          <div className="h-16 md:h-24 w-3/4 bg-background-surface animate-pulse mb-4" />
          <div className="h-4 w-64 bg-background-surface animate-pulse" />
        </div>
        <div className="flex gap-2 mb-12 border-b border-border-slate pb-8 overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-14 w-40 bg-background-surface animate-pulse shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[400px] bg-background-surface animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-[200px] bg-background-surface animate-pulse" />
            <div className="h-[200px] bg-background-surface animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";
  const [hasTimeout, setHasTimeout] = useState(false);

  useEffect(() => {
    // Safety timeout: If live components haven't settled in 5s, we trigger the fallback UI
    const timer = setTimeout(() => {
      setHasTimeout(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", id);
    router.push(`/markets?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <div className="mb-12">
          <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase tracking-tight mb-6 text-text-primary">
            Markets <span className="text-accent underline decoration-accent/20">Hub.</span>
          </h1>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
            Live Intelligence Room // Institutional Consensus Feed Active
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-border-slate pb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-premium relative whitespace-nowrap border",
                  isActive 
                    ? "bg-accent border-accent text-background-primary shadow-xl shadow-accent/20 translate-y-[-2px]" 
                    : "bg-background-surface text-text-tertiary hover:text-text-primary border-border-slate hover:border-accent/40"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-background-primary" : "text-accent/60")} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[700px] animate-in fade-in duration-1000">
          {hasTimeout ? (
            <div className="p-20 border border-border-slate bg-background-surface flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-background-elevated rounded-full flex items-center justify-center">
                 <Radio className="w-10 h-10 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold uppercase mb-2">Syncing Data Streams...</h3>
                <p className="text-text-secondary text-sm max-w-md mx-auto">
                  We're having trouble connecting to the live exchange feeds. We'll keep trying, but you might want to refresh the page.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="px-10 py-4 bg-accent text-background-primary font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-colors"
              >
                Refresh Room
              </button>
            </div>
          ) : (
            <>
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "calendar" && <CalendarTab />}
              {activeTab === "earnings" && <EarningsTab />}
              {activeTab === "scanner" && <ScannerTab />}
              {activeTab === "news" && <NewsTab />}
              {activeTab === "sentiment" && <SentimentTab />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketsHubPage() {
  return (
    <Suspense fallback={<MarketsHubSkeleton />}>
      <MarketsHubContent />
    </Suspense>
  );
}
