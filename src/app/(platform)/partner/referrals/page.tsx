"use client";
 
import { 
  Users, 
  Download, 
  Search,
  ArrowUpRight
} from "lucide-react";
 
export default function PartnerReferralsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] block mb-2 font-bold">// REFERRAL AUDIT</span>
          <h1 className="text-4xl font-display font-black uppercase text-text-primary">Referrals.</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-background-surface border border-border-slate/85 text-[10px] font-bold uppercase tracking-widest text-text-primary hover:border-text-tertiary transition-colors rounded-lg">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
 
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-surface border border-border-slate/50 p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1 font-bold">Total Referrals</p>
          <p className="text-3xl font-display font-black text-text-primary">1,402</p>
        </div>
        <div className="bg-background-surface border border-border-slate/50 p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1 font-bold">Unique Visitors</p>
          <p className="text-3xl font-display font-black text-text-primary">824</p>
        </div>
        <div className="bg-background-surface border border-border-slate/50 p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1 font-bold">Conversion Rate</p>
          <p className="text-3xl font-display font-black text-profit">3.8%</p>
        </div>
      </div>
 
      {/* Detailed Log Table */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="p-6 border-b border-border-slate/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background-elevated/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search by ID or Page..."
              className="w-full bg-background-primary border border-border-slate/85 pl-12 pr-4 py-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors rounded-lg"
            />
          </div>
          <div className="flex items-center gap-4">
             <select className="bg-background-primary border border-border-slate/85 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary outline-none rounded-lg focus:border-accent">
                <option>All Sources</option>
                <option>Twitter</option>
                <option>YouTube</option>
             </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-slate/50 bg-background-elevated/20">
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Date</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Referrer</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Campaign</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Destination</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/30">
              {[
                { date: "2026-04-20 14:22:11", source: "Twitter", campaign: "spring_launch", dest: "/learn/phase-1", action: "Click" },
                { date: "2026-04-20 13:45:05", source: "Direct", campaign: "manual", dest: "/dashboard", action: "Click" },
                { date: "2026-04-20 12:10:55", source: "YouTube", campaign: "video_review", dest: "/tools/risk-calc", action: "Click" },
                { date: "2026-04-20 11:30:22", source: "Newsletter", campaign: "weekly_update", dest: "/dashboard", action: "Click" },
                { date: "2026-04-20 10:15:44", source: "Twitter", campaign: "spring_launch", dest: "/", action: "Click" },
                { date: "2026-04-20 09:05:12", source: "YouTube", campaign: "video_review", dest: "/brokers/ig-markets", action: "Click" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary">{row.date}</td>
                  <td className="px-6 py-4 text-xs font-sans text-text-primary">{row.source}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-tertiary uppercase">{row.campaign}</td>
                  <td className="px-6 py-4 text-xs font-sans text-accent underline flex items-center gap-2">
                    {row.dest} <ArrowUpRight className="w-3 h-3" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-profit/10 text-profit rounded-md font-bold">
                      {row.action}
                    </span>
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
