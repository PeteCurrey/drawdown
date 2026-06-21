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
  LogOut,
  ChevronRight,
  Loader2,
  ExternalLink,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
 
export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
 
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
 
  const supabase = createClient();
 
  useEffect(() => {
    fetchProfile();
  }, []);
 
  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
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
    setSaveSuccess(false);
    setSaveError(null);

    const formData = new FormData(e.currentTarget);
    const updates = {
      display_name: (formData.get('display_name') as string).trim() || null,
      country:      (formData.get('country')      as string).trim() || null,
      currency:     (formData.get('currency')     as string).trim() || null,
      updated_at:   new Date().toISOString(),
    };
 
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);
 
    if (error) {
      setSaveError(error.message);
    } else {
      setSaveSuccess(true);
      // Sync local state so fields don't revert
      setProfile((prev: any) => ({ ...prev, ...updates }));
      // Auto-dismiss success banner after 4 seconds
      setTimeout(() => setSaveSuccess(false), 4000);
    }
    setIsUpdating(false);
  };
 
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsUpdatingPassword(true);
 
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;
 
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setIsUpdatingPassword(false);
      return;
    }
 
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setIsUpdatingPassword(false);
      return;
    }
 
    const { error } = await supabase.auth.updateUser({ password });
 
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess("Password updated successfully.");
      e.currentTarget.reset();
    }
    setIsUpdatingPassword(false);
  };
 
  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );
 
  return (
    <div className="max-w-5xl space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate/50 pb-8">
        <div className="flex items-center gap-2 text-accent mb-4">
          <Settings className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Identity_Config // v1.0</span>
        </div>
        <h1 className="text-4xl font-display font-black uppercase tracking-tight text-text-primary">Profile <span className="text-accent">Settings.</span></h1>
        <p className="text-sm text-text-tertiary mt-2">Manage your institutional identity, subscription, and market preferences.</p>
      </header>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-10">
           {/* General Settings */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
                 <User className="w-4 h-4 text-accent" />
                 <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-text-secondary">Public Identity</h2>
              </div>
              <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6 bg-background-surface border border-border-slate/50 p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                 {/* Display Name */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary block">Display Name</label>
                    <input
                      name="display_name"
                      key={profile?.display_name}
                      defaultValue={profile?.display_name || ''}
                      placeholder="e.g. Maverick Trader"
                      className="w-full bg-background-primary border border-border-slate/80 p-4 text-sm outline-none focus:border-accent text-text-primary rounded-lg"
                    />
                 </div>
                 {/* Email — read from auth, not profile.id */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary block">Account Email (Immutable)</label>
                    <div className="relative">
                       <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary/50" />
                       <input
                         disabled
                         value={userEmail}
                         className="w-full bg-background-primary/50 border border-border-slate/80 p-4 pl-12 text-xs font-mono text-text-tertiary cursor-not-allowed rounded-lg"
                       />
                    </div>
                 </div>
                 {/* Country */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary block">Country</label>
                    <input
                      name="country"
                      key={profile?.country}
                      defaultValue={profile?.country || ''}
                      placeholder="e.g. United Kingdom"
                      className="w-full bg-background-primary border border-border-slate/80 p-4 text-sm outline-none focus:border-accent text-text-primary rounded-lg"
                    />
                 </div>
                 {/* Currency */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary block">Base Currency</label>
                    <select
                      name="currency"
                      key={profile?.currency}
                      defaultValue={profile?.currency || 'GBP'}
                      className="w-full bg-background-primary border border-border-slate/80 p-4 text-sm outline-none focus:border-accent text-text-primary rounded-lg appearance-none"
                    >
                      <option value="GBP">GBP — British Pound</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="AUD">AUD — Australian Dollar</option>
                      <option value="CAD">CAD — Canadian Dollar</option>
                      <option value="SGD">SGD — Singapore Dollar</option>
                    </select>
                 </div>
                 {/* Save feedback */}
                 {saveError && (
                   <p className="text-xs text-loss font-mono">{saveError}</p>
                 )}
                 {saveSuccess && (
                   <p className="text-xs text-profit font-mono">✓ Profile saved successfully.</p>
                 )}
                 <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-8 py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 rounded-lg"
                    >
                       {isUpdating ? 'Saving...' : 'Save Profile'}
                    </button>
                 </div>
              </form>
           </section>
 
           {/* Security Settings */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
                 <ShieldCheck className="w-4 h-4 text-accent" />
                 <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-text-secondary">Security & Credentials</h2>
              </div>
              <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-6 bg-background-surface border border-border-slate/50 p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary block">New Password</label>
                    <input 
                      type="password"
                      name="password" 
                      required
                      placeholder="••••••••" 
                      className="w-full bg-background-primary border border-border-slate/80 p-4 text-sm outline-none focus:border-accent text-text-primary rounded-lg" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary block">Confirm Password</label>
                    <input 
                      type="password"
                      name="confirm_password" 
                      required
                      placeholder="••••••••" 
                      className="w-full bg-background-primary border border-border-slate/80 p-4 text-sm outline-none focus:border-accent text-text-primary rounded-lg" 
                    />
                 </div>
                 {passwordError && (
                    <p className="text-xs text-loss">{passwordError}</p>
                 )}
                 {passwordSuccess && (
                    <p className="text-xs text-profit">{passwordSuccess}</p>
                 )}
                 <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="px-8 py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 rounded-lg"
                    >
                       {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                 </div>
              </form>
           </section>
 
           {/* Calibration Settings */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
                 <Target className="w-4 h-4 text-accent" />
                 <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-text-secondary">Market Calibration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-3 text-text-tertiary">
                       <Brain className="w-4 h-4" />
                       <span className="text-[10px] font-mono uppercase tracking-widest">Experience Level</span>
                    </div>
                    <p className="text-sm font-bold uppercase text-text-primary">{profile?.experience_level || 'NOT_CALIBRATED'}</p>
                    <button className="text-[9px] font-bold uppercase text-accent hover:underline flex items-center gap-1">
                       Re-Calibrate <ChevronRight className="w-3 h-3" />
                    </button>
                 </div>
                 <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-3 text-text-tertiary">
                       <Globe className="w-4 h-4" />
                       <span className="text-[10px] font-mono uppercase tracking-widest">Preferred Markets</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {profile?.preferred_markets?.map((m: string) => (
                         <span key={m} className="px-2 py-0.5 bg-background-primary border border-border-slate text-[9px] font-mono text-text-tertiary uppercase rounded-md">{m}</span>
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
           <div className="p-10 bg-background-elevated/50 border border-border-slate/50 relative overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] group">
              <div className="relative z-10 space-y-8">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-profit mb-4">
                       <ShieldCheck className="w-5 h-5" />
                       <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Active Membership</span>
                    </div>
                    <h3 className="text-4xl font-display font-black uppercase tracking-tight text-text-primary">{profile?.subscription_tier}</h3>
                    <p className="text-xs text-text-tertiary uppercase font-mono tracking-widest">Next Billing: May 22, 2026</p>
                 </div>
 
                 <div className="space-y-4">
                    <button className="w-full py-4 bg-background-primary border border-border-slate/85 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-all flex items-center justify-center gap-2 rounded-lg">
                       <CreditCard className="w-4 h-4" /> Manage Subscription <ExternalLink className="w-3 h-3" />
                    </button>
                    <button className="w-full py-4 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent/20 transition-all rounded-lg">
                       Upgrade to {profile?.subscription_tier === 'foundation' ? 'Edge' : 'Floor'}
                    </button>
                 </div>
              </div>
              <ShieldCheck className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 text-profit opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           </div>
 
           {/* Role Card */}
           <div className="p-8 bg-background-surface border border-border-slate/50 rounded-xl space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 border-b border-border-slate/30 pb-4">
                 <User className="w-4 h-4 text-text-tertiary" />
                 <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Access Level</h3>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold uppercase text-accent">{profile?.role}</span>
                 {profile?.role === 'admin' && (
                    <Link href="/admin" className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[8px] font-bold uppercase tracking-widest rounded-md">
                       Launch Admin Suite
                    </Link>
                 )}
              </div>
           </div>
 
           {/* Log Out */}
           <button 
             onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
             className="w-full py-4 border border-loss/20 bg-loss/5 text-loss text-[10px] font-bold uppercase tracking-widest hover:bg-loss hover:text-white transition-all flex items-center justify-center gap-2 rounded-lg"
           >
              <LogOut className="w-4 h-4" /> Terminate Session
           </button>
        </div>
      </div>
    </div>
  );
}
