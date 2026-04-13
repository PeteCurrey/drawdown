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
  Trash2
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'blog' | 'users'>('analytics');

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
              { id: 'blog', label: 'Manage Blog', icon: BookOpen },
              { id: 'users', label: 'User Directory', icon: Users },
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
              <div className="p-20 border border-border-slate text-center space-y-6">
                 <Users className="w-12 h-12 text-text-tertiary/20 mx-auto" />
                 <h3 className="text-xl font-display font-bold uppercase text-text-tertiary">User Directory Locked.</h3>
                 <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest">Connect to master database for live directory retrieval.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
