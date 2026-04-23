"use client";

import { 
  Mail, 
  Send, 
  Settings as SettingsIcon, 
  BarChart3, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ChevronRight,
  RefreshCw,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface NewsletterDashboardProps {
  data: {
    editions: any[];
    activeSubscribers: number;
    settings: any;
    stats: any;
  };
}

export function NewsletterDashboardClient({ data }: NewsletterDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateManual = async (type: 'daily' | 'weekend') => {
    setIsGenerating(true);
    try {
      const resp = await fetch('/api/newsletter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edition_type: type })
      });
      if (resp.ok) {
        window.location.reload();
      } else {
        const errData = await resp.json();
        alert("Generation failed: " + (errData.error || resp.statusText));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInstantBroadcast = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch('/api/newsletter/test-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await resp.json();
      if (resp.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert("Broadcast failed: " + (data.error || resp.statusText));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateSettings = async (updates: any) => {
    try {
      const resp = await fetch('/api/newsletter/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, id: data.settings.id })
      });
      if (resp.ok) {
        window.location.reload();
      } else {
        const errData = await resp.json();
        alert("Failed to update settings: " + (errData.error || resp.statusText));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">The Wire Manager</h1>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest flex items-center gap-2">
             <Mail className="w-3 h-3 text-accent" /> AI Market Intelligence Distribution
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => handleGenerateManual('daily')}
             disabled={isGenerating}
             className="px-4 py-2 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center gap-2"
           >
              {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              Generate Daily
           </button>
           <button 
             onClick={handleInstantBroadcast}
             disabled={isGenerating}
             className="px-4 py-2 bg-profit text-background-primary text-[9px] font-bold uppercase tracking-widest hover:bg-profit/90 transition-premium flex items-center gap-2"
           >
              {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Instant Broadcast
           </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Column 1: Queue */}
        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-2">
              <Clock className="w-3 h-3" /> Edition Queue
           </h3>
           <div className="space-y-4">
              {data.editions.map((edition) => (
                <div key={edition.id} className="p-5 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium group">
                   <div className="flex justify-between items-start mb-4">
                      <span className={cn(
                        "text-[8px] font-mono uppercase px-2 py-0.5 border",
                        edition.edition_type === 'daily' ? "bg-accent/10 border-accent/20 text-accent" : "bg-profit/10 border-profit/20 text-profit"
                      )}>
                         {edition.edition_type}
                      </span>
                      <span className={cn(
                        "text-[8px] font-mono uppercase",
                        edition.status === 'sent' ? "text-text-tertiary" : 
                        edition.status === 'scheduled' ? "text-profit" : "text-accent"
                      )}>
                         {edition.status}
                      </span>
                   </div>
                   <h4 className="text-sm font-bold uppercase mb-1 line-clamp-1">{edition.subject_line || "Generating..."}</h4>
                   <p className="text-[10px] font-mono text-text-tertiary mb-6">
                      {new Date(edition.scheduled_send_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                   </p>
                   <Link 
                     href={`/admin/newsletter/${edition.id}`}
                     className="w-full py-2 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:border-accent transition-colors"
                   >
                      Review & Edit <ChevronRight className="w-3 h-3" />
                   </Link>
                </div>
              ))}
           </div>
        </div>

        {/* Column 2: Stats */}
        <div className="lg:col-span-5 space-y-8">
           <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-background-surface border border-border-slate">
                 <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Active Subs</p>
                 <p className="text-3xl font-display font-black text-text-primary">{data.activeSubscribers.toLocaleString()}</p>
                 <div className="mt-4 flex items-center gap-2">
                    <Users className="w-3 h-3 text-profit" />
                    <span className="text-[9px] font-mono text-profit uppercase">Sync Active</span>
                 </div>
              </div>
              <div className="p-8 bg-background-surface border border-border-slate">
                 <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Avg Open Rate</p>
                 <p className="text-3xl font-display font-black text-text-primary">{data.stats.avgOpenRate}%</p>
                 <div className="mt-4 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 text-profit" />
                    <span className="text-[9px] font-mono text-profit uppercase">Real-time Data</span>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-background-surface border border-border-slate">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-8 border-b border-border-slate pb-4">Performance Velocity</h3>
              <div className="h-48 flex items-end gap-2 px-2">
                 {data.editions.filter(e => e.status === 'sent').slice(0, 7).map((e, i) => (
                   <div key={i} className="flex-1 bg-accent/20 hover:bg-accent transition-colors relative group" style={{ height: `${e.open_rate || 5}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background-elevated border border-border-slate px-2 py-1 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         {e.open_rate || 0}% Open
                      </div>
                   </div>
                 ))}
                 {data.editions.filter(e => e.status === 'sent').length === 0 && (
                    <div className="w-full h-full flex items-center justify-center border border-dashed border-border-slate">
                       <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Waiting for first send...</p>
                    </div>
                 )}
              </div>
              <div className="flex justify-between mt-4 text-[8px] font-mono text-text-tertiary uppercase tracking-tighter">
                 <span>Latest Distributions</span>
              </div>
           </div>
        </div>

        {/* Column 3: Settings */}
        <div className="lg:col-span-3 space-y-6">
           <div className="p-8 bg-background-surface border border-border-slate space-y-8">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                 <SettingsIcon className="w-3 h-3" /> System Controls
              </h3>
              
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-bold uppercase text-text-primary">Auto-Send</p>
                       <p className="text-[8px] text-text-tertiary font-mono uppercase tracking-widest">Pilot Autonomous</p>
                    </div>
                    <div 
                      onClick={() => handleUpdateSettings({ auto_send_enabled: !data.settings.auto_send_enabled })}
                      className={cn(
                        "w-10 h-5 rounded-full p-1 transition-colors cursor-pointer",
                        data.settings.auto_send_enabled ? "bg-profit" : "bg-background-elevated"
                      )}
                    >
                       <div className={cn(
                         "w-3 h-3 rounded-full bg-white transition-transform",
                         data.settings.auto_send_enabled ? "translate-x-5" : "translate-x-0"
                       )} />
                    </div>
                 </div>

                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-bold uppercase text-text-primary">Approval Required</p>
                       <p className="text-[8px] text-text-tertiary font-mono uppercase tracking-widest">Human Gatekeeper</p>
                    </div>
                    <div 
                      onClick={() => handleUpdateSettings({ require_approval: !data.settings.require_approval })}
                      className={cn(
                        "w-10 h-5 rounded-full p-1 transition-colors cursor-pointer",
                        data.settings.require_approval ? "bg-accent" : "bg-background-elevated"
                      )}
                    >
                       <div className={cn(
                         "w-3 h-3 rounded-full bg-white transition-transform",
                         data.settings.require_approval ? "translate-x-5" : "translate-x-0"
                       )} />
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-border-slate">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono text-text-tertiary uppercase">Provider Status</span>
                    <span className="text-[9px] font-mono text-profit uppercase">Resend Connected</span>
                 </div>
                 <div className="w-full bg-background-elevated h-1">
                    <div className="bg-profit h-full w-full" />
                 </div>
              </div>

              <Link 
                href="/admin/newsletter/settings"
                className="w-full py-3 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center justify-center gap-2"
              >
                 Global Settings <ChevronRight className="w-3 h-3" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
