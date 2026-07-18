'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  Calendar, 
  Filter, 
  Download,
  Loader2,
  PieChart,
  BarChart3,
  TrendingDown
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function RevenueDashboardPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('revenue_by_partner').select('*').order('total_revenue', { ascending: false });
      if (data) {
        setPartners(data);
        setTotalRevenue(data.reduce((sum: number, p: any) => sum + Number(p.total_revenue), 0));
      }
      setLoading(false);
    };
    fetchRevenue();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-1">Financial <span className="text-accent italic">Operations.</span></h1>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest">// Affiliate Revenue & Conversion Tracking</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last 30 Days
           </button>
           <button className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
           </button>
        </div>
      </header>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 bg-background-surface border border-border-slate relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <TrendingUp className="w-16 h-16" />
            </div>
            <p className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest mb-4">Gross Revenue</p>
            <h2 className="text-5xl font-display font-black uppercase text-profit">
               {formatCurrency(totalRevenue, 'GBP')}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-profit">
               <ArrowUpRight className="w-3 h-3" />
               <span>+14.2% from last month</span>
            </div>
         </div>

         <div className="p-8 bg-background-surface border border-border-slate relative overflow-hidden group">
            <p className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest mb-4">Avg Commission Rate</p>
            <h2 className="text-5xl font-display font-black uppercase text-text-primary">
               12.5%
            </h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-text-tertiary">
               <span>Across 8 active partners</span>
            </div>
         </div>

         <div className="p-8 bg-background-surface border border-border-slate relative overflow-hidden group">
            <p className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest mb-4">Cost Per Lead (AI)</p>
            <h2 className="text-5xl font-display font-black uppercase text-accent">
               £1.42
            </h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-profit">
               <TrendingDown className="w-3 h-3" />
               <span>-8% efficiency gain</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Partner Performance Table */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-display font-bold uppercase flex items-center gap-2">
               <BarChart3 className="w-5 h-5 text-accent" />
               Partner Performance
            </h3>
            <div className="bg-background-surface border border-border-slate overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-border-slate bg-background-elevated/50">
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Partner</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Clicks</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Conversion</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Revenue</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-right">EPC</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border-slate/50">
                     {loading ? (
                        <tr><td colSpan={5} className="p-12 text-center text-text-tertiary">Loading...</td></tr>
                     ) : partners.map((p) => {
                        const epc = p.total_clicks > 0 ? (p.total_revenue / p.total_clicks) : 0;
                        return (
                           <tr key={p.slug} className="hover:bg-background-elevated/30 transition-colors">
                              <td className="p-6">
                                 <span className="text-sm font-display font-bold uppercase">{p.partner_name}</span>
                                 <p className="text-[9px] font-mono text-text-tertiary uppercase">slug: {p.slug}</p>
                              </td>
                              <td className="p-6 text-sm font-mono">{p.total_clicks}</td>
                              <td className="p-6">
                                 <div className="flex items-center gap-2">
                                    <div className="w-12 h-1 bg-background-elevated rounded-full overflow-hidden">
                                       <div className="h-full bg-accent w-[35%]" />
                                    </div>
                                    <span className="text-[10px] font-mono">3.5%</span>
                                 </div>
                              </td>
                              <td className="p-6 text-sm font-display font-bold text-profit">{formatCurrency(p.total_revenue, 'GBP')}</td>
                              <td className="p-6 text-sm font-mono text-right text-text-secondary">{formatCurrency(epc, 'GBP')}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Sidebar: Recent Activity */}
         <div className="space-y-8">
            <h3 className="text-lg font-display font-bold uppercase flex items-center gap-2">
               <PieChart className="w-5 h-5 text-accent" />
               Latest Payouts
            </h3>
            <div className="space-y-4">
               <div className="p-8 text-center text-text-tertiary border border-border-slate bg-background-surface">
                 <p className="text-sm italic">No recent payouts to display.</p>
               </div>
            </div>

            <div className="p-8 bg-background-elevated border border-border-slate">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-4">Revenue Attribution</h4>
               <p className="text-xs text-text-secondary leading-relaxed">
                  Most revenue is currently originating from the <span className="text-accent">"Best Prop Firms for UK Traders"</span> review page, contributing to 64% of total conversions.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
