import { getNewsletterStats } from "@/lib/newsletter/admin-data";
import { createClient } from "@/lib/supabase/server";
import { Settings, Shield, Bell, Mail, Clock, Database } from "lucide-react";
import Link from "next/link";

export default async function NewsletterSettingsPage() {
  const { settings } = await getNewsletterStats();

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
      <div className="border-b border-border-slate pb-6">
        <h1 className="text-3xl font-display font-bold uppercase mb-2">Global Settings</h1>
        <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest">Configuration for The Wire Newsletter Engine</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Core Automation */}
        <section className="p-8 bg-background-surface border border-border-slate space-y-8">
           <div className="flex items-center gap-3 border-b border-border-slate pb-4">
              <Settings className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold uppercase tracking-tight">Automation & Scheduling</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs font-bold uppercase">Daily Distribution Time</p>
                       <p className="text-[10px] text-text-tertiary font-mono uppercase mt-1">Recommended: 07:00 GMT</p>
                    </div>
                    <span className="text-xs font-mono text-accent">07:00 GMT</span>
                 </div>
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs font-bold uppercase">Weekend Edition</p>
                       <p className="text-[10px] text-text-tertiary font-mono uppercase mt-1">Saturdays 09:00 GMT</p>
                    </div>
                    <span className="text-xs font-mono text-accent">09:00 GMT</span>
                 </div>
              </div>

              <div className="space-y-6 p-6 bg-background-elevated border border-border-slate">
                 <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-profit" />
                    <div>
                       <p className="text-[10px] font-bold uppercase">Safety Protocols</p>
                       <p className="text-[9px] text-text-secondary leading-relaxed mt-1">
                          When "Approval Required" is active, the system will never send an edition without human confirmation in the editor.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Resend Configuration */}
        <section className="p-8 bg-background-surface border border-border-slate space-y-8">
           <div className="flex items-center gap-3 border-b border-border-slate pb-4">
              <Database className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold uppercase tracking-tight">Provider Integration</h2>
           </div>
           
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Sender Name</label>
                    <div className="p-3 bg-background-elevated border border-border-slate text-xs font-mono uppercase">Pete @ Drawdown</div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Reply-To Email</label>
                    <div className="p-3 bg-background-elevated border border-border-slate text-xs font-mono">support@drawdown.trading</div>
                 </div>
              </div>
              
              <div className="p-4 bg-profit/5 border border-profit/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase text-profit">Resend API: Connected</span>
                 </div>
                 <span className="text-[10px] font-mono text-text-tertiary uppercase">Latency: 42ms</span>
              </div>
           </div>
        </section>
      </div>

      <div className="pt-8 flex justify-end">
         <Link 
           href="/admin/newsletter"
           className="px-8 py-4 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors"
         >
            Back to Dashboard
         </Link>
      </div>
    </div>
  );
}
