import Link from "next/link";
import { getAllSEOPages } from "@/lib/admin";
import { 
  Plus, 
  Activity,
  MousePointerClick,
  Eye,
  Globe
} from "lucide-react";
import { LandingPageTable } from "@/components/admin/LandingPageTable";

export default function LandingPageManager() {
  const allPages = getAllSEOPages();

  // Simulated metrics for display
  const totalViews = allPages.length * 420; // Simulated
  const avgConv = 4.2;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Landing Pages</h1>
          <p className="text-xs text-text-tertiary">Monitoring {allPages.length} programmatic SEO assets.</p>
        </div>
        <Link 
          href="/admin/landing-pages/builder"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Custom Page
        </Link>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total SEO Pages", value: allPages.length.toString(), icon: Globe },
          { label: "Total Views (Est)", value: (totalViews / 1000).toFixed(1) + "K", icon: Eye },
          { label: "Avg Conversion", value: `${avgConv}%`, icon: MousePointerClick },
          { label: "Active Routes", value: "920+", icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-text-tertiary/50" />
            </div>
            <span className="text-2xl font-display font-black">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Page List */}
      <LandingPageTable allPages={allPages} />
    </div>
  );
}
