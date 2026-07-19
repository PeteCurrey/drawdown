"use client";

import { 
  BarChart4, 
  TrendingUp, 
  MousePointer2, 
  Globe, 
  Search, 
  ChevronRight,
  ExternalLink,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { brokers } from "@/data/brokers";

interface MarketingClientProps {
  stats: {
    totalSEOViews: number;
    pagePerformance: any[];
    clickPerformance: any[];
  };
}

export function AdminMarketingClient({ stats }: MarketingClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Combine static and dynamic pages for the management list
  const allLandingPages = [
    ...brokers.map(b => ({
      name: `${b.name} Review`,
      path: `/brokers/${b.slug}`,
      type: 'Review',
      views: stats.pagePerformance.find(v => v.page_path === `/brokers/${b.slug}`)?.views || 0,
      clicks: stats.clickPerformance.filter(c => c.broker_id === b.id).length || 0,
    })),
    {
       name: 'Prop Firm Hub',
       path: '/prop-firms',
       type: 'Hub',
       views: stats.pagePerformance.find(v => v.page_path === '/prop-firms')?.views || 0,
       clicks: stats.clickPerformance.filter(c => c.source_page === '/prop-firms').length || 0,
    },
    {
       name: 'Best Prop Firm UK',
       path: '/best/prop-firm-uk',
       type: 'SEO',
       views: stats.pagePerformance.find(v => v.page_path === '/best/prop-firm-uk')?.views || 0,
       clicks: stats.clickPerformance.filter(c => c.source_page === '/best/prop-firm-uk').length || 0,
    },
    {
       name: 'TradingView Review UK',
       path: '/best/tradingview-review-uk',
       type: 'SEO',
       views: stats.pagePerformance.find(v => v.page_path === '/best/tradingview-review-uk')?.views || 0,
       clicks: stats.clickPerformance.filter(c => c.source_page === '/best/tradingview-review-uk').length || 0,
    }
  ];

  const filteredPages = allLandingPages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.path.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.views - a.views);

  const totalClicks = stats.clickPerformance.length;
  const avgCtr = stats.totalSEOViews > 0 ? (totalClicks / stats.totalSEOViews) * 100 : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Marketing & SEO</h1>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest flex items-center gap-2">
             <Globe className="w-3 h-3" /> Organic Performance & Affiliate Conversion
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Page Views", value: stats.totalSEOViews.toLocaleString(), sub: "Organic Reach", icon: Globe, color: "text-accent" },
          { label: "Affiliate Clicks", value: totalClicks.toLocaleString(), sub: "Total Conversions", icon: MousePointer2, color: "text-profit" },
          { label: "Average CTR", value: `${avgCtr.toFixed(2)}%`, sub: "Click-Through Rate", icon: Target, color: "text-profit" },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium">
            <div className="flex justify-between items-start mb-6">
               <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</p>
               <stat.icon className={cn("w-5 h-5 opacity-40", stat.color)} />
            </div>
            <p className="text-4xl font-display font-black mb-2">{stat.value}</p>
            <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Pages Management */}
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-bold uppercase">Landing Page Intelligence</h2>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
               <input 
                 type="text"
                 placeholder="Filter pages..."
                 className="bg-background-elevated border border-border-slate pl-10 pr-4 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-accent transition-colors w-64"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="bg-background-surface border border-border-slate overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-background-elevated/50 border-b border-border-slate">
                     <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Page Name</th>
                     <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Type</th>
                     <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Views</th>
                     <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Clicks</th>
                     <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">CTR</th>
                     <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-slate/30 font-sans">
                  {filteredPages.map((page, i) => (
                    <tr key={i} className="hover:bg-accent/5 transition-colors group">
                       <td className="px-6 py-5">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-text-primary uppercase">{page.name}</span>
                             <span className="text-[10px] text-text-tertiary font-mono">{page.path}</span>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className={cn(
                            "text-[9px] font-mono uppercase px-2 py-1 border",
                            page.type === 'Hub' ? "bg-accent/10 border-accent/20 text-accent" : "bg-profit/10 border-profit/20 text-profit"
                          )}>
                             {page.type}
                          </span>
                       </td>
                       <td className="px-6 py-5 text-sm font-bold text-text-primary">
                          {page.views.toLocaleString()}
                       </td>
                       <td className="px-6 py-5 text-sm font-bold text-text-primary">
                          {page.clicks.toLocaleString()}
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-xs font-mono font-bold text-profit">
                             {page.views > 0 ? ((page.clicks / page.views) * 100).toFixed(1) : 0}%
                          </span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <Link 
                            href={page.path}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
                          >
                             View Page <ExternalLink className="w-3 h-3" />
                          </Link>
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
