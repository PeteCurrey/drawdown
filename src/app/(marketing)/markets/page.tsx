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

function MarketsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", id);
    router.push(`/markets?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tight mb-4">
            Markets <span className="text-accent underline decoration-accent/20">Hub.</span>
          </h1>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
            Live Intelligence Room // Real-time technical consensus active
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
                  "flex items-center gap-3 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap",
                  isActive 
                    ? "bg-accent text-background-primary shadow-lg shadow-accent/20" 
                    : "bg-background-surface text-text-tertiary hover:text-text-primary border border-border-slate hover:border-accent/40"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-background-primary" : "text-accent/60")} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px] transition-premium">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "earnings" && <EarningsTab />}
          {activeTab === "scanner" && <ScannerTab />}
          {activeTab === "news" && <NewsTab />}
          {activeTab === "sentiment" && <SentimentTab />}
        </div>
      </div>
    </div>
  );
}

export default function MarketsHubPage() {
  return (
    <Suspense fallback={<div className="pt-32 px-6">Loading Markets Hub...</div>}>
      <MarketsHubContent />
    </Suspense>
  );
}
