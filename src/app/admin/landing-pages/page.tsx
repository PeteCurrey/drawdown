"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Activity,
  MousePointerClick,
  Eye,
  Globe
} from "lucide-react";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  views: number;
  conversions: number;
  lastUpdated: string;
}

const MOCK_PAGES: LandingPage[] = [
  {
    id: "1",
    title: "Prop Firm Challenge Guide",
    slug: "/guides/prop-firm-challenge",
    category: "Guides",
    status: "published",
    views: 14250,
    conversions: 842,
    lastUpdated: "2026-04-18"
  },
  {
    id: "2",
    title: "Forex Broker Comparison 2026",
    slug: "/tools/forex-brokers",
    category: "Tools",
    status: "published",
    views: 8420,
    conversions: 512,
    lastUpdated: "2026-04-15"
  },
  {
    id: "3",
    title: "Risk Management Calculator Promo",
    slug: "/tools/risk-calculator",
    category: "Marketing",
    status: "draft",
    views: 0,
    conversions: 0,
    lastUpdated: "Today"
  }
];

export default function LandingPageManager() {
  const [pages] = useState<LandingPage[]>(MOCK_PAGES);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Landing Pages</h1>
          <p className="text-xs text-text-tertiary">Manage and optimize your high-converting marketing assets.</p>
        </div>
        <Link 
          href="/admin/landing-pages/builder"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </Link>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pages", value: "24", icon: Globe },
          { label: "Total Views", value: "84.2K", icon: Eye },
          { label: "Avg Conversion", value: "4.8%", icon: MousePointerClick },
          { label: "Active Tests", value: "3", icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-text-tertiary/50" />
            </div>
            <span className="text-2xl font-display font-black">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Page List */}
      <div className="bg-background-surface border border-border-slate flex flex-col">
        <div className="p-4 border-b border-border-slate flex justify-between items-center bg-background-elevated/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="SEARCH PAGES..." 
              className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] uppercase font-mono outline-none focus:border-accent"
            />
          </div>
          <button className="p-2 border border-border-slate text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
              <tr>
                <th className="px-6 py-4">Page Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Conv. Rate</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/50">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-background-elevated/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-sm tracking-tight">{page.title}</span>
                      <Link href={page.slug} className="text-[10px] font-mono text-text-tertiary hover:text-accent transition-colors">
                        {page.slug}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-background-elevated border border-border-slate text-[9px] font-mono uppercase tracking-widest text-text-secondary">
                      {page.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        page.status === 'published' ? "bg-profit" : "bg-text-tertiary"
                      )} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                        {page.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{page.views.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs text-profit">
                    {page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-text-tertiary">{page.lastUpdated}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/landing-pages/builder?id=${page.id}`}
                        className="px-3 py-1.5 border border-border-slate hover:border-accent text-[9px] font-bold uppercase tracking-widest transition-colors"
                      >
                        Edit
                      </Link>
                      <button className="p-1.5 border border-border-slate hover:border-text-primary transition-colors text-text-tertiary">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
