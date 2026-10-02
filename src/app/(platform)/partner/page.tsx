import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  Share2, 
  TrendingUp, 
  DollarSign, 
  Copy,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
 
export default async function PartnerPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  if (!user) redirect("/login");
 
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
 
  if (profile?.role !== 'partner' && profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 animate-in fade-in duration-700">
         <div className="p-8 bg-background-elevated/40 rounded-full border border-border-slate/50 border-dashed shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <Share2 className="w-16 h-16 text-text-tertiary opacity-30" />
         </div>
         <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl font-display font-black uppercase tracking-tight text-text-primary">Become a <span className="text-accent">Partner.</span></h1>
            <p className="text-text-secondary leading-relaxed text-sm">
               You are not currently enrolled in our Partnership Program. Join our network of elite traders and earn recurring commissions for every referral.
            </p>
         </div>
         <button className="px-10 py-5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg">
            Apply for Partnership
         </button>
      </div>
    );
  }
 
  // Fetch referrals
  const { data: referrals } = await supabase
    .from('profiles')
    .select('*')
    .eq('partner_id', user.id);
 
  const stats = [
    { label: "Total Referrals", value: referrals?.length || 0, icon: Users },
    { label: "Conversion Rate", value: "14.2%", icon: TrendingUp },
    { label: "Unpaid Earnings", value: "$1,450", icon: DollarSign, color: "text-profit" },
  ];
 
  const referralLink = `https://drawdown.trading/signup?ref=${user.id.slice(0, 8)}`;
 
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate/50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent mb-4">
            <Share2 className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Partner_Network // v4.2</span>
          </div>
          <h1 className="text-4xl font-display font-black uppercase tracking-tight text-text-primary">Partner <span className="text-accent">Portal.</span></h1>
          <p className="text-sm text-text-tertiary mt-2">Manage your referrals, track commissions, and scale your influence.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-profit/10 border border-profit/20 text-profit rounded-md font-bold text-[10px] uppercase tracking-wider">
           <ShieldCheck className="w-4 h-4" />
           <span>Active Partner</span>
        </div>
      </header>
 
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-10 bg-background-surface border border-border-slate/50 rounded-xl flex flex-col justify-between h-40 group hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
             <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={cn("w-5 h-5", stat.color || "text-text-tertiary/50")} />
             </div>
             <span className={cn("text-4xl font-display font-black text-text-primary", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Referral Link & Tools */}
        <div className="lg:col-span-7 space-y-8">
           <div className="p-10 bg-background-surface border border-border-slate/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-8">
              <div className="space-y-4">
                 <h3 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">Your Referral Engine</h3>
                 <p className="text-xs text-text-secondary leading-relaxed">
                    Share your unique link with your community. Every user who signs up through this link will be permanently tagged as your referral.
                 </p>
              </div>
              <div className="flex items-center gap-2">
                 <input 
                   type="text" 
                   readOnly 
                   value={referralLink}
                   className="flex-grow bg-background-primary border border-border-slate/80 p-4 text-xs font-mono text-text-secondary rounded-lg focus:outline-none"
                 />
                 <button className="p-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white transition-colors rounded-lg">
                    <Copy className="w-5 h-5" />
                 </button>
              </div>
           </div>
 
           <div className="p-10 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">Partner Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { title: "Social Media Kit", size: "45MB" },
                   { title: "Brand Guidelines", size: "12MB" },
                   { title: "High-Res Logos", size: "8MB" },
                   { title: "Email Templates", size: "2MB" }
                 ].map((asset, i) => (
                   <button key={i} className="p-4 border border-border-slate bg-background-surface hover:bg-neutral-50 hover:border-accent/30 transition-all flex justify-between items-center group rounded-lg">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary group-hover:text-text-primary">{asset.title}</span>
                      <span className="text-[9px] font-mono text-text-tertiary">{asset.size}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
 
        {/* Recent Activity */}
        <div className="lg:col-span-5 bg-background-surface border border-border-slate/50 rounded-xl overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
           <div className="p-6 border-b border-border-slate/50 bg-background-elevated/20">
              <h3 className="text-sm font-display font-bold uppercase tracking-widest text-text-primary">Recent Conversions</h3>
           </div>
           <div className="flex-grow overflow-y-auto max-h-[400px]">
              {referrals && referrals.length > 0 ? (
                <div className="divide-y divide-border-slate/30">
                  {referrals.map((ref) => (
                    <div key={ref.id} className="p-6 flex justify-between items-center hover:bg-background-elevated/20 transition-colors">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary">{ref.display_name || 'STUDENT_USER'}</span>
                          <span className="text-[9px] font-mono text-text-tertiary">JOINED: {new Date(ref.created_at).toLocaleDateString()}</span>
                       </div>
                       <span className="text-[10px] font-mono text-profit uppercase font-bold">Commission Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                   <AlertCircle className="w-8 h-8 text-text-tertiary mx-auto opacity-50" />
                   <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">No conversions recorded in this period.</p>
                </div>
              )}
           </div>
           <div className="p-6 border-t border-border-slate/50 bg-background-elevated/10 mt-auto">
              <button className="w-full py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 rounded-lg bg-background-surface">
                 View Full Ledger <ChevronRight className="w-4 h-4 text-accent" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
