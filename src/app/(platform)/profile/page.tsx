"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  MessageSquare, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Plus
} from "lucide-react";
import { BadgeGrid, allBadges } from "@/components/badges/BadgeGrid";

export default function ProfilePage() {
  const [discordConnected, setDiscordConnected] = useState(false);

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// ACCOUNT COMMAND</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase">Profile.</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-background-surface border border-border-slate p-8 md:p-12 space-y-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-background-elevated border-2 border-accent flex items-center justify-center relative group">
                  <User className="w-8 h-8 text-text-tertiary group-hover:text-accent transition-colors" />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent text-background-primary flex items-center justify-center hover:bg-accent-hover transition-colors">
                     <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div>
                   <h2 className="text-2xl font-display font-bold uppercase leading-none mb-2">Pete Currey</h2>
                   <p className="text-xs font-mono uppercase tracking-widest text-text-tertiary">Member since April 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border-slate/50">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Email Address</label>
                    <div className="flex items-center justify-between py-2 border-b border-border-slate/50">
                       <span className="text-sm font-sans">pete@drawdown.trade</span>
                       <CheckCircle2 className="w-3 h-3 text-profit" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Experience Level</label>
                    <div className="flex items-center justify-between py-2 border-b border-border-slate/50">
                       <span className="text-sm font-sans uppercase font-bold text-accent">Intermediate</span>
                       <ChevronDown className="w-3 h-3 text-text-tertiary" />
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-background-surface border border-border-slate p-8 md:p-12">
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-display font-bold uppercase">Subscription.</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 bg-accent text-background-primary">Edge Tier</span>
               </div>
               
               <div className="p-6 bg-background-elevated border border-border-slate flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <CreditCard className="w-5 h-5 text-text-tertiary" />
                     <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest">Monthly Billing</span>
                        <span className="text-[10px] font-mono text-text-tertiary">Next invoice: May 12, 2026</span>
                     </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors">Manage Billing</button>
               </div>

               <div className="flex gap-4">
                  <button className="flex-grow py-4 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-text-tertiary transition-colors">Cancel Subscription</button>
                  <button className="flex-grow py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">Upgrade Tier</button>
               </div>
            </div>

            {/* Achievements */}
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-display font-bold uppercase">Achievements.</h3>
               </div>
               <BadgeGrid badges={allBadges} />
            </div>
          </div>

          {/* Social / Integration Sidebar */}
          <div className="space-y-8">
             <div className="bg-background-surface border border-border-slate p-8 space-y-8">
                <div className="flex items-center gap-3">
                   <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                   <h3 className="text-lg font-display font-bold uppercase">Integrations.</h3>
                </div>

                <div className={cn(
                  "p-6 border flex flex-col items-center text-center space-y-4",
                  discordConnected ? "bg-profit/5 border-profit/20" : "bg-background-elevated border-border-slate"
                )}>
                   <div className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-full mb-2",
                      discordConnected ? "bg-profit text-background-primary" : "bg-[#5865F2] text-white"
                   )}>
                      {discordConnected ? <CheckCircle2 className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                   </div>
                   <h4 className="text-xs font-bold uppercase tracking-widest">Discord Community</h4>
                   <p className="text-[10px] text-text-secondary leading-relaxed uppercase tracking-widest font-mono">
                      {discordConnected ? "Connected as Pete#1234" : "Unlock exclusive channels and daily strategy chats."}
                   </p>
                   <button 
                    onClick={() => setDiscordConnected(!discordConnected)}
                    className={cn(
                      "w-full py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                      discordConnected ? "border border-border-slate text-text-tertiary hover:text-loss hover:border-loss" : "bg-[#5865F2] text-white hover:opacity-90"
                    )}
                   >
                     {discordConnected ? "Disconnect Account" : <><LinkIcon className="w-3 h-3" /> Connect Discord</>}
                   </button>
                </div>

                {discordConnected && (
                  <div className="p-4 bg-background-primary border border-border-slate space-y-2">
                     <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Active Roles</p>
                     <div className="flex flex-wrap gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-accent text-accent">Edge Role</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-border-slate text-text-tertiary">Verified Member</span>
                     </div>
                  </div>
                )}
             </div>

             <div className="p-8 border border-border-slate text-center space-y-4">
                <AlertCircle className="w-6 h-6 text-text-tertiary mx-auto" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Security Check</p>
                <p className="text-[9px] text-text-tertiary leading-relaxed italic">
                  2FA is currently disabled. We recommend enabling it via your Supabase auth settings (Manage Account).
                </p>
                <button className="text-[9px] font-bold uppercase tracking-widest text-accent hover:underline">Manage Security</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
