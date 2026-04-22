import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  Handshake, 
  TrendingUp, 
  DollarSign, 
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminPartnersPage() {
  const supabase = await createClient();

  // Fetch partners
  const { data: partners } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'partner');

  // For this demo/first-run, we'll calculate mock stats based on partner_id references in other profiles
  const { data: allUsers } = await supabase.from('profiles').select('partner_id');

  const partnersWithStats = partners?.map(p => {
    const referrals = allUsers?.filter(u => u.partner_id === p.id).length || 0;
    return {
      ...p,
      referrals,
      earnings: referrals * 45 // Sample commission
    };
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-border-slate pb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Partner Management</h1>
          <p className="text-sm text-text-tertiary">Manage your affiliate network and institutional partnerships.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
              Invite Partner
           </button>
        </div>
      </header>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Partners", value: partners?.length || 0, icon: Handshake },
          { label: "Total Referrals", value: allUsers?.filter(u => u.partner_id).length || 0, icon: Users },
          { label: "Network Revenue", value: "$14,250", icon: DollarSign, color: "text-profit" },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-background-surface border border-border-slate flex flex-col justify-between h-36">
             <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={cn("w-5 h-5", stat.color || "text-text-tertiary/50")} />
             </div>
             <span className={cn("text-3xl font-display font-black", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Partner List */}
      <div className="bg-background-surface border border-border-slate">
        <div className="p-4 border-b border-border-slate flex justify-between items-center bg-background-elevated/30">
           <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="SEARCH PARTNERS..." 
                className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] font-mono outline-none focus:border-accent"
              />
           </div>
           <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary">
              <Filter className="w-4 h-4" /> Filter
           </button>
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                <tr>
                  <th className="px-8 py-5">Partner Name</th>
                  <th className="px-8 py-5">Tier</th>
                  <th className="px-8 py-5">Referrals</th>
                  <th className="px-8 py-5">Earnings</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {partnersWithStats?.map((partner) => (
                  <tr key={partner.id} className="hover:bg-background-elevated/20 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold uppercase">{partner.display_name || 'Unnamed Partner'}</span>
                          <span className="text-[10px] font-mono text-text-tertiary">{partner.id.slice(0, 8)}...</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-2 py-1 bg-accent/5 border border-accent/20 text-accent text-[9px] font-bold uppercase tracking-widest">
                          {partner.subscription_tier}
                       </span>
                    </td>
                    <td className="px-8 py-6 font-mono text-sm">{partner.referrals}</td>
                    <td className="px-8 py-6 font-mono text-sm text-profit">${partner.earnings.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                       <button className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent flex items-center justify-end gap-2 ml-auto">
                          Details <ExternalLink className="w-3 h-3" />
                       </button>
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
