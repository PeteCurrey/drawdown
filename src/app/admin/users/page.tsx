import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  MoreVertical, 
  Search, 
  Filter,
  ArrowUpRight,
  CreditCard,
  Crown,
  Handshake
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch all profiles with their basic stats
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-border-slate pb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">User Management</h1>
          <p className="text-sm text-text-tertiary">Oversee traders, partners, and administrative permissions.</p>
        </div>
        <button className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2">
           <UserPlus className="w-4 h-4" /> Add User
        </button>
      </header>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4">
        {['All Users', 'Students', 'Partners', 'Admins', 'Active Subs'].map((filter, i) => (
          <button 
            key={i} 
            className={cn(
              "px-6 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all",
              i === 0 ? "bg-background-elevated border-accent text-accent" : "border-border-slate text-text-tertiary hover:border-accent hover:text-accent"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-background-surface border border-border-slate">
        <div className="p-4 border-b border-border-slate flex justify-between items-center bg-background-elevated/30">
           <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="SEARCH BY NAME OR EMAIL..." 
                className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] font-mono outline-none focus:border-accent"
              />
           </div>
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                <tr>
                  <th className="px-8 py-5">User / Identity</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Tier</th>
                  <th className="px-8 py-5">Region</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Joined</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-background-elevated/20 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-background-elevated border border-border-slate flex items-center justify-center">
                             {user.role === 'admin' ? <Crown className="w-5 h-5 text-accent" /> : <Users className="w-5 h-5 text-text-tertiary" />}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold uppercase">{user.display_name || 'ANONYMOUS_TRADER'}</span>
                             <span className="text-[10px] font-mono text-text-tertiary truncate max-w-[150px]">{user.id}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          {user.role === 'partner' && <Handshake className="w-3 h-3 text-profit" />}
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            user.role === 'admin' ? "text-accent" : user.role === 'partner' ? "text-profit" : "text-text-secondary"
                          )}>
                             {user.role}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-2 py-1 bg-background-primary border border-border-slate text-[9px] font-mono text-text-tertiary uppercase">
                          {user.subscription_tier}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                          {user.country || 'Global'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.subscription_status === 'active' ? "bg-profit" : "bg-text-tertiary"
                          )} />
                          <span className="text-[10px] font-bold uppercase text-text-secondary">{user.subscription_status}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-[10px] text-text-tertiary">
                       {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 hover:bg-background-elevated text-text-tertiary hover:text-text-primary transition-colors">
                          <MoreVertical className="w-4 h-4" />
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
