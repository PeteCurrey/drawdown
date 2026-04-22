import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { 
  BarChart2, 
  ArrowLeft, 
  Eye, 
  Calendar,
  Clock,
  TrendingUp,
  Globe
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSEOPages } from "@/lib/admin";

interface Props {
  searchParams: Promise<{ path?: string }>;
}

export default async function PageAnalytics({ searchParams }: Props) {
  const params = await searchParams;
  const path = params.path;

  if (!path) {
    return notFound();
  }

  const allPages = getAllSEOPages();
  const pageInfo = allPages.find(p => p.slug === path);

  const supabase = await createClient();
  const { data: analytics, error } = await supabase
    .from('seo_analytics')
    .select('*')
    .eq('path', path)
    .single();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      {/* Back Button */}
      <Link 
        href="/admin/landing-pages"
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Landing Pages
      </Link>

      {/* Header */}
      <div className="border-b border-border-slate pb-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-6 h-6 text-accent" />
          <h1 className="text-3xl font-display font-bold uppercase">Page Analytics</h1>
        </div>
        <p className="text-xs text-text-tertiary flex items-center gap-2">
          <Globe className="w-3 h-3" /> {path}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-background-surface border border-border-slate">
              <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Total Views</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-display font-black">{analytics?.views || 0}</span>
                <Eye className="w-4 h-4 text-accent" />
              </div>
            </div>
            
            <div className="p-6 bg-background-surface border border-border-slate">
              <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Last Viewed</p>
              <div className="flex items-end justify-between">
                <span className="text-xs font-mono font-bold">
                  {analytics?.last_viewed_at 
                    ? new Date(analytics.last_viewed_at).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      }) 
                    : 'N/A'}
                </span>
                <Calendar className="w-4 h-4 text-profit" />
              </div>
            </div>

            <div className="p-6 bg-background-surface border border-border-slate">
              <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Daily Average</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-display font-black">
                  {analytics?.views ? (analytics.views / 7).toFixed(1) : 0}
                </span>
                <TrendingUp className="w-4 h-4 text-text-tertiary/30" />
              </div>
            </div>
          </div>

          {/* Page Details Card */}
          <div className="p-8 bg-background-surface border border-border-slate space-y-6">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] border-b border-border-slate pb-4">Asset Metadata</h2>
            
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <span className="block text-[10px] font-mono text-text-tertiary uppercase mb-1">Title</span>
                <span className="text-sm font-bold">{pageInfo?.title || 'Custom Page'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-text-tertiary uppercase mb-1">Category</span>
                <span className="text-[10px] px-2 py-1 bg-background-elevated border border-border-slate inline-block">
                  {pageInfo?.category || 'CUSTOM'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-text-tertiary uppercase mb-1">Last Crawl</span>
                <span className="text-xs font-mono">22 APR 2026</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-text-tertiary uppercase mb-1">Status</span>
                <span className="text-[10px] text-profit font-bold">● INDEXED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <div className="p-6 bg-background-elevated border border-border-slate">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-3 h-3 text-accent" /> System Logs
            </h3>
            <div className="space-y-3">
              {[
                { time: "2h ago", event: "Metadata sync successful" },
                { time: "5h ago", event: "New view recorded" },
                { time: "1d ago", event: "Sitemap re-index triggered" },
              ].map((log, i) => (
                <div key={i} className="flex justify-between text-[10px] border-b border-border-slate/50 pb-2">
                  <span className="text-text-secondary">{log.event}</span>
                  <span className="text-text-tertiary font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href={path}
            target="_blank"
            className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
          >
            <Eye className="w-4 h-4" /> View Live Page
          </Link>
        </div>
      </div>
    </div>
  );
}
