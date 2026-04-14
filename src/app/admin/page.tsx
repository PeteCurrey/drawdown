"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  BarChart4, 
  Users, 
  BookOpen, 
  Video, 
  Settings, 
  Search,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Edit,
  Trash2,
  Mail,
  Send,
  ExternalLink
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'blog' | 'users' | 'seo' | 'newsletter'>('analytics');

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <ShieldAlert className="w-8 h-8 text-accent" />
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-1">// INTERNAL COMMAND</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase">Admin Portal.</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Admin Sidebar */}
          <nav className="lg:w-64 space-y-2">
            {[
              { id: 'analytics', label: 'Analytics', icon: BarChart4 },
              { id: 'newsletter', label: 'Newsletters', icon: Mail },
              { id: 'blog', label: 'Manage Blog', icon: BookOpen },
              { id: 'users', label: 'User Directory', icon: Users },
              { id: 'seo', label: 'SEO Engine', icon: Search },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab === tab.id 
                      ? "bg-accent text-background-primary shadow-lg shadow-accent/20" 
                      : "text-text-tertiary hover:bg-background-elevated hover:text-text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            <div className="pt-8 mt-8 border-t border-border-slate/30">
              <button className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </nav>

          {/* Admin Content */}
          <div className="flex-grow space-y-8">
            {activeTab === 'analytics' && (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Total MRR", value: "£4,280", change: "+12%" },
                    { label: "Active Subs", value: "142", change: "+8" },
                    { label: "AI Calls", value: "842", change: "24h" },
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-background-surface border border-border-slate">
                      <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-2">{stat.label}</p>
                      <div className="flex items-end justify-between">
                         <p className="text-3xl font-display font-black">{stat.value}</p>
                         <span className="text-[10px] font-mono text-profit">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-background-surface border border-border-slate h-96 flex flex-col items-center justify-center space-y-4">
                   <BarChart4 className="w-8 h-8 text-text-tertiary/20" />
                   <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary opacity-30">MRR Growth Chart: Integration Ready</p>
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center bg-background-elevated border border-border-slate p-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="text" placeholder="SEARCH POSTS..." className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] uppercase font-mono outline-none focus:border-accent" />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                    <Plus className="w-4 h-4" /> Create New Post
                  </button>
                </div>

                <div className="bg-background-surface border border-border-slate overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-background-elevated/50 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-slate/50">
                      {[
                        { title: "The Myth of 100% Win Rate", status: "Published", author: "Pete" },
                        { title: "Understanding BoE Decisions", status: "Published", author: "Pete" },
                        { title: "Psychology of Drawdown", status: "Draft", author: "Admin" },
                      ].map((post, i) => (
                        <tr key={i} className="hover:bg-background-elevated/30 transition-colors">
                          <td className="px-6 py-6 font-display font-bold text-sm tracking-tight uppercase">{post.title}</td>
                          <td className="px-6 py-6">
                            <span className={cn(
                              "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                              post.status === 'Published' ? "bg-profit/5 border-profit/20 text-profit" : "bg-text-tertiary/5 border-border-slate text-text-tertiary"
                            )}>{post.status}</span>
                          </td>
                          <td className="px-6 py-6 text-xs text-text-secondary">{post.author}</td>
                          <td className="px-6 py-6 text-right">
                             <div className="flex justify-end gap-2">
                                <button className="p-2 hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="p-2 hover:text-loss transition-colors"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-background-surface border border-border-slate p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold uppercase">Community Management</h3>
                      <p className="text-xs text-text-tertiary">Monitor user performance and award mechanical integrity badges.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Manual Badge Awarding */}
                    <div className="p-6 bg-background-elevated border border-border-slate space-y-6">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Manual Awarding</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono uppercase text-text-tertiary">User Email</label>
                          <input 
                            type="text" 
                            placeholder="USER@EXAMPLE.COM" 
                            className="w-full bg-background-primary border border-border-slate p-3 text-[10px] font-mono outline-none focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono uppercase text-text-tertiary">Honorary Badge</label>
                          <select className="w-full bg-background-primary border border-border-slate p-3 text-[10px] font-mono outline-none focus:border-accent">
                            <option>Pete Approved</option>
                            <option>Survivability Master</option>
                            <option>Phase 1 Graduate</option>
                          </select>
                        </div>
                        <button className="w-full py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                          Award Badge
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                      <div className="p-4 bg-background-primary border border-border-slate flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase text-text-tertiary">Total Members</span>
                        <span className="text-lg font-display font-bold">1,482</span>
                      </div>
                      <div className="p-4 bg-background-primary border border-border-slate flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase text-text-tertiary">Edge+ Users</span>
                        <span className="text-lg font-display font-bold text-accent">142</span>
                      </div>
                      <div className="p-4 bg-background-primary border border-border-slate flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase text-text-tertiary">Newsletter Rate</span>
                        <span className="text-lg font-display font-bold text-profit">94.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-background-surface border border-border-slate p-8">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-display font-bold uppercase">Newsletter Dispatch</h3>
                      <p className="text-xs text-text-tertiary mt-1">Manage weekly roundups and community broadcasts.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                      <Send className="w-4 h-4" /> Force Dispatch Weekly
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                      { label: "Active Subs", value: "1,248" },
                      { label: "Open Rate", value: "48.2%" },
                      { label: "Click Rate", value: "12.4%" },
                      { label: "Last Send", value: "2d ago" },
                    ].map((s, i) => (
                      <div key={i} className="p-6 bg-background-elevated border border-border-slate">
                        <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-2">{s.label}</p>
                        <p className="text-xl font-display font-bold">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Recent Dispatches</h4>
                  <div className="bg-background-primary border border-border-slate overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-background-elevated/50 text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                        <tr>
                          <th className="px-6 py-4">Campaign Name</th>
                          <th className="px-6 py-4">Sent At</th>
                          <th className="px-6 py-4">Recipients</th>
                          <th className="px-6 py-4 text-right">Preview</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-slate/30 text-[11px]">
                        {[
                          { name: "Weekly Roundup: The Truth [2026-04-12]", sent: "2026-04-12 17:00", count: 1242 },
                          { name: "Market Brief: Bank of England Special", sent: "2026-04-09 09:15", count: 1210 },
                          { name: "Weekly Roundup [2026-04-05]", sent: "2026-04-05 17:00", count: 1198 },
                        ].map((send, i) => (
                          <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                            <td className="px-6 py-4 font-bold">{send.name}</td>
                            <td className="px-6 py-4 text-text-tertiary font-mono">{send.sent}</td>
                            <td className="px-6 py-4">{send.count}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-accent hover:underline flex items-center gap-1 ml-auto">
                                View <ExternalLink className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center bg-background-elevated border border-border-slate p-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold uppercase">Programmatic SEO</h3>
                    <p className="text-xs text-text-tertiary mt-2">Generate How-To, Glossary, and local landing pages at scale.</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                    <Plus className="w-4 h-4" /> Generate Pages
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-background-surface border border-border-slate flex flex-col space-y-4">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Page Type</span>
                    <h4 className="text-xl font-display font-bold uppercase">Glossary Terms (350+)</h4>
                    <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                      A-Z definitions of trading and market terminology, structured for rich snippets.
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border-slate border-dashed">
                      <span className="text-[10px] font-mono text-profit">12 Active</span>
                      <button className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">Manage</button>
                    </div>
                  </div>

                  <div className="p-8 bg-background-surface border border-border-slate flex flex-col space-y-4">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Page Type</span>
                    <h4 className="text-xl font-display font-bold uppercase">How-To Guides (120+)</h4>
                    <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                      Step-by-step guides on broker platforms, indicators, and setups.
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border-slate border-dashed">
                      <span className="text-[10px] font-mono text-profit">4 Active</span>
                      <button className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
