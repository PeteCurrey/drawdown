"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  MousePointer2, 
  TrendingUp, 
  ArrowUpRight,
  Shield,
  Calendar,
  Filter
} from "lucide-react";
import { MetricCard } from "@/components/partner/MetricCard";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { cn } from "@/lib/utils";

// Mock data for initial development
const chartData = [
  { date: "Apr 14", clicks: 45, signups: 2 },
  { date: "Apr 15", clicks: 52, signups: 4 },
  { date: "Apr 16", clicks: 38, signups: 1 },
  { date: "Apr 17", clicks: 65, signups: 5 },
  { date: "Apr 18", clicks: 48, signups: 3 },
  { date: "Apr 19", clicks: 72, signups: 6 },
  { date: "Apr 20", clicks: 88, signups: 8 },
];

export default function PartnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] block mb-2">// PARTNER VERTICAL</span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">Overview.</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-background-surface border border-border-slate text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
            <Calendar className="w-3 h-3" /> Last 7 Days
          </div>
          <button className="p-2 bg-background-surface border border-border-slate hover:border-text-tertiary transition-colors">
            <Filter className="w-4 h-4 text-text-tertiary" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Referrals"
          value="1,402"
          change="12%"
          changeType="positive"
          icon={MousePointer2}
        />
        <MetricCard 
          title="Conversion Rate"
          value="3.8%"
          change="0.5%"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard 
          title="Institutional Trust"
          value="AA"
          subValue="Rating"
          icon={Shield}
        />
        <MetricCard 
          title="Active Campaigns"
          value="4"
          icon={ArrowUpRight}
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-background-surface border border-border-slate p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-display font-bold uppercase text-text-primary">Traffic Analytics.</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Clicks</span>
            </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#4B5563" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontVariant: 'all-small-caps', letterSpacing: '0.1em' }}
              />
              <YAxis 
                stroke="#4B5563" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#08090D', 
                  border: '1px solid #1F2937',
                  borderRadius: '0px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase'
                }}
                itemStyle={{ color: '#00F0FF' }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#00F0FF" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#00F0FF', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#00F0FF', stroke: '#08090D', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Mini-Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-background-surface border border-border-slate overflow-hidden">
          <div className="p-6 border-b border-border-slate flex items-center justify-between">
            <h3 className="text-sm font-display font-bold uppercase text-text-primary">Recent Clickstream.</h3>
            <button className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-slate bg-background-elevated/30">
                  <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Date / Time</th>
                  <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Source Page</th>
                  <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/50">
                {[
                  { time: "Today, 14:22", page: "/learn/phase-1", status: "Logged" },
                  { time: "Today, 13:45", page: "/brokers/ig-markets", status: "Logged" },
                  { time: "Today, 12:10", page: "/tools/risk-calc", status: "Logged" },
                  { time: "Today, 11:30", page: "/dashboard", status: "Logged" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-text-secondary">{row.time}</td>
                    <td className="px-6 py-4 text-xs font-sans text-text-primary">{row.page}</td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-profit/10 text-profit">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background-surface border border-border-slate p-6">
            <h3 className="text-sm font-display font-bold uppercase text-text-primary mb-4">Partner Status.</h3>
            <div className="p-4 bg-background-primary border border-border-slate space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-tertiary">Account Tier</span>
                <span className="text-accent font-bold">Premium Affiliate</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-tertiary">API Status</span>
                <span className="text-profit font-bold">Optimal</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-tertiary">Integrations</span>
                <span className="text-text-primary font-bold">Linked</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-text-tertiary transition-colors">
              Manage Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
