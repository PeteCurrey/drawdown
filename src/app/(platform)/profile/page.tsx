"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Settings, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  Brain,
  RefreshCw,
  LogOut,
  ChevronRight,
  Loader2,
  ExternalLink,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
    setLoading(false);
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    
    const updates = {
      display_name: formData.get('display_name'),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (!error) {
      fetchProfile();
    }
    setIsUpdating(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  return (
    <div className="max-w-5xl space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate pb-8">
        <div className="flex items-center gap-2 text-accent mb-4">
          <Settings className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Identity_Config // v1.0</span>
        </div>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Profile <span className="text-accent">Settings.</span></h1>
        <p className="text-sm text-text-tertiary mt-2">Manage your institutional identity, subscription, and market preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-10">
           {/* General Settings */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
                 <User className="w-4 h-4 text-accent" />
                 <h2 className="text-sm font-display font-bold uppercase tracking-widest">Public Identity</h2>
              </div>
              <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6 bg-background-surface border border-border-slate p-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary">Display Name</label>
                    <input 
                      name="display_name" 
                      defaultValue={profile?.display_name || ''}
                      placeholder="e.g. Maverick Trader" 
                      className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary">Account Email (Immutable)</label>
                    <div className="relative">
                       <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary/50" />
                       <input 
                         disabled 
                         value={profile?.id} // Placeholder for email usually but ID used here as per schema
                         className="w-full bg-background-primary/50 border border-border-slate p-4 pl-12 text-xs font-mono text-text-tertiary cursor-not-allowed" 
                       />
                    </div>
                 </div>
                 <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="px-8 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                       {isUpdating ? 'Updating...' : 'Save Identity'}
                    </button>
                 </div>
              </form>
           </section>

           {/* Calibration Settings */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
                 <Target className="w-4 h-4 text-accent" />
                 <h2 className="text-sm font-display font-bold uppercase tracking-widest">Market Calibration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-background-surface border border-border-slate space-y-4">
                    <div className="flex items-center gap-3 text-text-tertiary">
                       <Brain className="w-4 h-4" />
                       <span className="text-[10px] font-mono uppercase tracking-widest">Experience Level</span>
                    </div>
                    <p className="text-sm font-bold uppercase">{profile?.experience_level || 'NOT_CALIBRATED'}</p>
                    <button className="text-[9px] font-bold uppercase text-accent hover:underline flex items-center gap-1">
                       Re-Calibrate <ChevronRight className="w-3 h-3" />
                    </button>
                 </div>
                 <div className="p-6 bg-background-surface border border-border-slate space-y-4">
                    <div className="flex items-center gap-3 text-text-tertiary">
                       <Globe className="w-4 h-4" />
                       <span className="text-[10px] font-mono uppercase tracking-widest">Preferred Markets</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {profile?.preferred_markets?.map((m: string) => (
                         <span key={m} className="px-2 py-0.5 bg-background-primary border border-border-slate text-[9px] font-mono text-text-tertiary uppercase">{m}</span>
                       )) || <span className="text-xs text-text-tertiary">None selected</span>}
                    </div>
                    <button className="text-[9px] font-bold uppercase text-accent hover:underline flex items-center gap-1">
                       Update focus <ChevronRight className="w-3 h-3" />
                    </button>
                 </div>
              </div>
           </section>
        </div>

        {/* Right Column: Billing & Status */}
        <div className="lg:col-span-5 space-y-8">
           {/* Subscription Card */}
           <div className="p-10 bg-background-elevated border border-border-slate relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-profit mb-4">
                       <ShieldCheck className="w-5 h-5" />
                       <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Active Membership</span>
                    </div>
                    <h3 className="text-4xl font-display font-black uppercase tracking-tight text-white">{profile?.subscription_tier}</h3>
                    <p className="text-xs text-text-tertiary uppercase font-mono tracking-widest">Next Billing: May 22, 2026</p>
                 </div>

                 <div className="space-y-4">
                    <button className="w-full py-4 bg-background-primary border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-all flex items-center justify-center gap-2">
                       <CreditCard className="w-4 h-4" /> Manage Subscription <ExternalLink className="w-3 h-3" />
                    </button>
                    <button className="w-full py-4 bg-accent/5 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent/10 transition-all">
                       Upgrade to {profile?.subscription_tier === 'foundation' ? 'Edge' : 'Floor'}
                    </button>
                 </div>
              </div>
              <ShieldCheck className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 text-profit opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           </div>

           {/* Role Card */}
           <div className="p-8 bg-background-surface border border-border-slate space-y-6">
              <div className="flex items-center gap-3 border-b border-border-slate/50 pb-4">
                 <User className="w-4 h-4 text-text-tertiary" />
                 <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Access Level</h3>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold uppercase text-accent">{profile?.role}</span>
                 {profile?.role === 'admin' && (
                    <Link href="/admin" className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[8px] font-bold uppercase tracking-widest">
                       Launch Admin Suite
                    </Link>
                 )}
              </div>
           </div>

           {/* Log Out */}
           <button 
             onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
             className="w-full py-4 border border-loss/20 bg-loss/5 text-loss text-[10px] font-bold uppercase tracking-widest hover:bg-loss hover:text-white transition-all flex items-center justify-center gap-2"
           >
              <LogOut className="w-4 h-4" /> Terminate Session
           </button>
        </div>
      </div>
    </div>
  );
}
