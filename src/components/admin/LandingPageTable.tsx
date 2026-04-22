"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Search, 
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { SEOPageInfo } from "@/lib/admin";

interface Props {
  allPages: SEOPageInfo[];
}

export function LandingPageTable({ allPages }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(allPages.map(p => p.category)))];

  const filteredPages = allPages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || p.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-background-surface border border-border-slate flex flex-col">
      <div className="p-4 border-b border-border-slate flex flex-col md:flex-row justify-between items-center gap-4 bg-background-elevated/50">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="SEARCH 900+ PAGES..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] uppercase font-mono outline-none focus:border-accent"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap",
                activeFilter === cat ? "bg-accent border-accent text-background-primary" : "border-border-slate text-text-tertiary hover:text-text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Page Title & Slug</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/50">
            {filteredPages.slice(0, 100).map((page, i) => (
              <tr key={i} className="hover:bg-background-elevated/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm tracking-tight">{page.title}</span>
                    <span className="text-[10px] font-mono text-text-tertiary">
                      {page.slug}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-background-elevated border border-border-slate text-[9px] font-mono uppercase tracking-widest text-text-secondary">
                    {page.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                    {page.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={page.slug}
                      target="_blank"
                      className="p-2 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link 
                      href={`/admin/seo/analytics?path=${page.slug}`}
                      className="p-2 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-colors"
                      title="View Analytics"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPages.length > 100 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center bg-background-elevated/20">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                    Showing first 100 of {filteredPages.length} pages. Use search to find specific assets.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
