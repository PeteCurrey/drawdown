import { BarChart4, Users, ArrowUpRight, Activity, MessageSquare, Handshake } from "lucide-react";
import { getAdminStats } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PushBroadcast } from "@/components/admin/PushBroadcast";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Platform Overview</h1>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-profit animate-pulse" /> Live Monitoring Active
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Server Status</p>
          <p className="text-xs font-bold text-profit">OPERATIONAL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Est. MRR", value: `$${stats.mrr.toLocaleString()}`, change: `+${stats.userGrowth} this mo`, icon: BarChart4 },
          { label: "Active Subs", value: stats.activeSubs.toString(), change: "Live", icon: Users },
          { label: "Partner Network", value: stats.totalPartners.toString(), change: `${stats.referralCount} Refers`, icon: Handshake },
          { label: "New Leads (7d)", value: stats.newLeads.toString(), change: "Inbox", icon: MessageSquare },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-background-surface border border-border-slate hover:border-accent/50 transition-colors flex flex-col justify-between h-40 group">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-text-tertiary/40 group-hover:text-accent transition-colors" />
            </div>
            <div className="flex items-end justify-between">
               <p className="text-2xl font-display font-black">{stat.value}</p>
               <span className="text-[9px] font-mono text-profit uppercase">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PushBroadcast />
        <div className="bg-background-surface border border-border-slate p-8">
           <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <BarChart4 className="w-8 h-8 text-accent/20 group-hover:text-accent transition-colors relative z-10" />
           <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary relative z-10 mt-4 text-center">MRR Growth Data: Syncing with Stripe Webhooks</p>
           <Link 
             href="/admin/integrations"
             className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-accent mt-6 relative z-10 hover:underline"
           >
             Manage Billing Integration <ArrowUpRight className="w-3 h-3" />
           </Link>
        </div>

        <div className="bg-background-surface border border-border-slate p-8">
           <h3 className="text-sm font-mono uppercase tracking-widest mb-8 border-b border-border-slate pb-4 flex justify-between items-center">
             System Health 
             <span className="text-[9px] text-text-tertiary">Real-time API Status</span>
           </h3>
           <div className="space-y-6">
             {Object.entries(stats.health).map(([key, status]) => (
               <div key={key} className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className={cn("w-1.5 h-1.5 rounded-full", status === 'connected' ? "bg-profit shadow-[0_0_8px_rgba(var(--profit),0.5)]" : "bg-loss")} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{key}</span>
                 </div>
                 <span className={cn("text-[9px] font-mono uppercase", status === 'connected' ? "text-profit" : "text-loss")}>
                   {status === 'connected' ? 'Operational' : 'Critical Error'}
                 </span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
