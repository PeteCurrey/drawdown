"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");

  return (
    <div className="pt-12 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 uppercase tracking-[0.2em]">// ACCOUNT COMMAND</span>
          <h1 className="  font-sans font-bold uppercase text-mkt-ink">Profile.</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-mkt-bd p-8 md:p-12 space-y-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-[#F7F7F7] border-2 border-mkt-bd flex items-center justify-center relative group">
                  <User className="w-8 h-8 text-mkt-i4 group-hover:text-accent transition-colors" />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-mkt-ink text-white flex items-center justify-center hover:bg-accent-hover transition-colors">
                     <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div>
                   <h2 className="text-2xl font-sans font-bold uppercase leading-none mb-2 text-mkt-ink">Pete Currey</h2>
                   <p className="text-xs font-mono uppercase tracking-widest text-mkt-i4">Member since April 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-mkt-bd/50">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Email Address</label>
                    <div className="flex items-center justify-between py-2 border-b border-mkt-bd/50">
                       <span className="text-sm font-sans text-mkt-ink">pete@drawdown.trading</span>
                       <CheckCircle2 className="w-3 h-3 text-mkt-grn" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Experience Level</label>
                    <div className="relative border-b border-mkt-bd/50 py-1">
                       <select 
                         value={experienceLevel}
                         onChange={(e) => setExperienceLevel(e.target.value)}
                         className="w-full appearance-none bg-transparent text-sm font-sans uppercase font-bold text-accent focus:outline-none cursor-pointer"
                       >
                          <option value="Beginner" className="bg-white">Beginner</option>
                          <option value="Intermediate" className="bg-white">Intermediate</option>
                          <option value="Advanced" className="bg-white">Advanced</option>
                          <option value="Professional" className="bg-white">Professional</option>
                       </select>
                       <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-mkt-i4 pointer-events-none" />
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-white border border-mkt-bd p-8 md:p-12">
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-sans font-bold uppercase text-mkt-ink">Subscription.</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 bg-mkt-ink text-white">Edge Tier</span>
               </div>
               
               <div className="p-6 bg-[#F7F7F7] border border-mkt-bd flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <CreditCard className="w-5 h-5 text-mkt-i4" />
                     <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-mkt-ink">Monthly Billing</span>
                        <span className="text-[10px] font-mono text-mkt-i4">Next invoice: May 12, 2026</span>
                     </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-mkt-i4 hover:text-mkt-ink transition-colors">Manage Billing</button>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button className="w-full py-4 bg-[#F7F7F7] border border-mkt-bd text-[10px] font-bold uppercase tracking-widest hover:border-text-tertiary transition-colors">Cancel Subscription</button>
                  <Link href="/pricing" className="w-full py-4 bg-mkt-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors text-center shadow-lg shadow-accent/10">Upgrade Tier</Link>
               </div>
            </div>

            {/* Achievements */}
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-sans font-bold uppercase">Achievements.</h3>
               </div>
               <BadgeGrid badges={allBadges} />
            </div>
          </div>

          {/* Social / Integration Sidebar */}
          <div className="space-y-8">
             <div className="bg-white border border-mkt-bd p-8 space-y-8">
                <div className="flex items-center gap-3">
                   <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                   <h3 className="text-lg font-sans font-bold uppercase">Integrations.</h3>
                </div>

                <div className={cn(
                  "p-6 border flex flex-col items-center text-center space-y-4",
                  discordConnected ? "bg-profit/5 border-profit/20" : "bg-[#F7F7F7] border-mkt-bd"
                )}>
                   <div className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-full mb-2",
                      discordConnected ? "bg-profit text-background-primary" : "bg-[#5865F2] text-mkt-ink"
                   )}>
                      {discordConnected ? <CheckCircle2 className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                   </div>
                   <h4 className="text-xs font-bold uppercase tracking-widest">Discord Community</h4>
                   <p className="text-[10px] text-mkt-i2 leading-relaxed uppercase tracking-widest font-mono">
                      {discordConnected ? "Connected as Pete#1234" : "Unlock exclusive channels and daily strategy chats."}
                   </p>
                   <button 
                    onClick={() => setDiscordConnected(!discordConnected)}
                    className={cn(
                      "w-full py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                      discordConnected ? "border border-mkt-bd text-mkt-i4 hover:text-red-500 hover:border-loss" : "bg-[#5865F2] text-mkt-ink hover:opacity-90"
                    )}
                   >
                     {discordConnected ? "Disconnect Account" : <><LinkIcon className="w-3 h-3" /> Connect Discord</>}
                   </button>
                </div>

                {discordConnected && (
                  <div className="p-4 bg-white border border-mkt-bd space-y-2">
                     <p className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4">Active Roles</p>
                     <div className="flex flex-wrap gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-mkt-bd text-accent">Edge Role</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-mkt-bd text-mkt-i4">Verified Member</span>
                     </div>
                  </div>
                )}
             </div>

             <div className="p-8 border border-mkt-bd text-center space-y-4">
                <AlertCircle className="w-6 h-6 text-mkt-i4 mx-auto" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Security Check</p>
                <p className="text-[9px] text-mkt-i4 leading-relaxed italic">
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
