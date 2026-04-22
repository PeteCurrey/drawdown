"use client";

import { 
  MessageSquare, 
  Users, 
  ShieldAlert, 
  Send,
  Radio,
  Settings,
  Circle,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

import { getAdminStats } from "@/lib/admin-data";

export default async function DiscordManagerPage() {
  const stats = await getAdminStats();
  const isOnline = stats.health.discord === 'connected';

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Discord Engine</h1>
          <p className="text-xs text-text-tertiary">Manage community roles, broadcast announcements, and monitor server health.</p>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-4 py-2 border",
          isOnline ? "bg-profit/10 border-profit/20 text-profit" : "bg-loss/10 border-loss/20 text-loss"
        )}>
          <span className="relative flex h-2 w-2">
            {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>}
            <span className={cn("relative inline-flex rounded-full h-2 w-2", isOnline ? "bg-profit" : "bg-loss")}></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{isOnline ? 'Bot Online' : 'Bot Offline'}</span>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: "2,482", icon: Users },
          { label: "Online Now", value: "342", icon: Circle },
          { label: "Edge+ Verified", value: "184", icon: ShieldAlert },
          { label: "Active Channels", value: "14", icon: Hash },
        ].map((stat, i) => (
           <div key={i} className="p-6 bg-background-surface border border-border-slate">
             <div className="flex justify-between items-start mb-4">
               <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
               <stat.icon className={cn("w-4 h-4", stat.label === "Online Now" ? "text-profit" : "text-text-tertiary/50")} />
             </div>
             <span className="text-2xl font-display font-black">{stat.value}</span>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Broadcast Panel */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
            <Radio className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-display font-bold uppercase">Global Broadcast</h2>
          </div>
          
          <div className="p-6 bg-background-surface border border-border-slate space-y-6">
            <p className="text-xs text-text-secondary leading-relaxed">
              Send an official announcement to the server. This will bypass channel mutes and ping the selected role.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Target Role / Channel</label>
                <select className="w-full bg-background-primary border border-border-slate p-3 text-xs outline-none focus:border-accent">
                  <option>#announcements (Ping @everyone)</option>
                  <option>#edge-plus-updates (Ping @Edge+)</option>
                  <option>#trading-floor (No Ping)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Message Payload</label>
                <textarea 
                  rows={6}
                  placeholder="Enter your announcement here. Markdown is supported."
                  className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none"
                />
              </div>

              <button className="w-full py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex justify-center items-center gap-2">
                <Send className="w-4 h-4" /> Dispatch Payload
              </button>
            </div>
          </div>
        </div>

        {/* Role Syncing & Moderation */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
            <ShieldAlert className="w-5 h-5 text-profit" />
            <h2 className="text-xl font-display font-bold uppercase">Access & Moderation</h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-background-surface border border-border-slate flex justify-between items-center group hover:border-profit/50 transition-colors">
              <div>
                <h3 className="font-bold uppercase mb-1">Stripe Role Sync</h3>
                <p className="text-xs text-text-tertiary">Forces a sync between Stripe subscriptions and Discord roles.</p>
              </div>
              <button className="px-4 py-2 border border-border-slate hover:border-profit hover:text-profit text-[9px] font-bold uppercase tracking-widest transition-colors">
                Sync Now
              </button>
            </div>

            <div className="p-6 bg-background-surface border border-border-slate flex justify-between items-center group hover:border-accent/50 transition-colors">
              <div>
                <h3 className="font-bold uppercase mb-1">Generate Invite Link</h3>
                <p className="text-xs text-text-tertiary">Create a single-use or expiring invite link.</p>
              </div>
              <button className="px-4 py-2 border border-border-slate hover:border-accent hover:text-accent text-[9px] font-bold uppercase tracking-widest transition-colors">
                Generate
              </button>
            </div>

            <div className="p-6 bg-background-surface border border-border-slate flex justify-between items-center group hover:border-loss/50 transition-colors">
              <div>
                <h3 className="font-bold uppercase mb-1 text-loss">Emergency Lockdown</h3>
                <p className="text-xs text-text-tertiary">Revokes send-message permissions for all non-admins.</p>
              </div>
              <button className="px-4 py-2 border border-loss text-loss hover:bg-loss/10 text-[9px] font-bold uppercase tracking-widest transition-colors">
                Lock Server
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
