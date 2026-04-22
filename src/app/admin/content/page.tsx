"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Link as LinkIcon, 
  Plus, 
  Search, 
  MoreVertical,
  Globe,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Institute {
  id: string;
  name: string;
  type: 'University' | 'Central Bank' | 'Research Firm' | 'News Outlet';
  url: string;
  status: 'active' | 'broken';
  lastChecked: string;
}

const MOCK_INSTITUTES: Institute[] = [
  { id: "1", name: "Bank of England", type: "Central Bank", url: "https://www.bankofengland.co.uk", status: "active", lastChecked: "Today" },
  { id: "2", name: "London School of Economics", type: "University", url: "https://www.lse.ac.uk", status: "active", lastChecked: "Today" },
  { id: "3", name: "Bloomberg Terminal Docs", type: "Research Firm", url: "https://www.bloomberg.com/professional/support/", status: "broken", lastChecked: "Yesterday" },
  { id: "4", name: "Financial Times", type: "News Outlet", url: "https://www.ft.com", status: "active", lastChecked: "2d ago" },
];

export default function ExternalContentManager() {
  const [institutes] = useState<Institute[]>(MOCK_INSTITUTES);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Content & Institutes</h1>
          <p className="text-xs text-text-tertiary">Manage external links, educational references, and institutional data sources.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
          <Plus className="w-4 h-4" /> Add Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Total Sources</span>
            <Building2 className="w-4 h-4 text-text-tertiary/50" />
          </div>
          <span className="text-2xl font-display font-black">48</span>
        </div>
        <div className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Broken Links</span>
            <AlertCircle className="w-4 h-4 text-loss" />
          </div>
          <span className="text-2xl font-display font-black text-loss">3</span>
        </div>
        <div className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Link Health Score</span>
            <CheckCircle2 className="w-4 h-4 text-profit" />
          </div>
          <span className="text-2xl font-display font-black text-profit">94%</span>
        </div>
      </div>

      <div className="bg-background-surface border border-border-slate flex flex-col">
        <div className="p-4 border-b border-border-slate flex justify-between items-center bg-background-elevated/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="SEARCH INSTITUTES..." 
              className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] uppercase font-mono outline-none focus:border-accent"
            />
          </div>
          <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-tertiary hover:text-text-primary transition-colors">
            Run Link Health Check
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
              <tr>
                <th className="px-6 py-4">Institution Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/50">
              {institutes.map((inst) => (
                <tr key={inst.id} className="hover:bg-background-elevated/30 transition-colors group">
                  <td className="px-6 py-4 font-display font-bold text-sm tracking-tight">{inst.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono text-text-secondary">{inst.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <a href={inst.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-mono text-text-tertiary hover:text-accent transition-colors">
                      <Globe className="w-3 h-3" /> {new URL(inst.url).hostname}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        inst.status === 'active' ? "bg-profit" : "bg-loss"
                      )} />
                      <span className={cn(
                        "text-[10px] font-mono uppercase tracking-widest",
                        inst.status === 'active' ? "text-profit" : "text-loss"
                      )}>
                        {inst.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 border border-border-slate hover:border-accent text-[9px] font-bold uppercase tracking-widest transition-colors">
                        Edit
                      </button>
                      <button className="p-1.5 border border-border-slate hover:border-loss transition-colors text-text-tertiary">
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
