import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Radio, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Activity
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminNewsSuitePage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab || "live";

  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  const { data: candidates } = await supabase
    .from("news_candidates")
    .select("*")
    .order("discovered_at", { ascending: false })
    .limit(50);

  const { data: sources } = await supabase
    .from("news_sources")
    .select("*")
    .order("priority", { ascending: true });

  const criticalAndHigh = (candidates || []).filter(c => c.priority_level === 'critical' || c.priority_level === 'high');
  const verifiedItems = (candidates || []).filter(c => c.verification_status === 'verified');
  const publishedCount = (candidates || []).filter(c => c.editorial_status === 'published').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/admin/content" 
              className="text-xs font-mono font-bold text-[#6b7280] hover:text-mkt-ink flex items-center gap-1 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3 h-3" /> Content OS
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Financial News Radar</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-red-100 text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live Radar
            </span>
          </div>
          <p className="text-sm text-mkt-i3 mt-1">
            Real-time market surveillance, event normalisation, entity clustering, and primary-source verification.
          </p>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb]">
        <Link
          href="?tab=live"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "live"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          Live Queue ({candidates?.length || 0})
        </Link>
        <Link
          href="?tab=high"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "high"
              ? "border-red-600 text-red-600"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          High Priority ({criticalAndHigh.length})
        </Link>
        <Link
          href="?tab=verification"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "verification"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          Verified ({verifiedItems.length})
        </Link>
        <Link
          href="?tab=sources"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "sources"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          Source Health ({sources?.length || 0})
        </Link>
      </div>

      {activeTab === "sources" ? (
        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Registered Ingestion Sources</h2>
            <span className="text-[10px] font-mono text-[#9ca3af]">Tier 1 - Tier 4 Trust Hierarchy</span>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {(sources || []).map((s) => (
              <li key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-mkt-ink">{s.name}</span>
                    <span className="text-[9px] font-mono uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                      {s.trust_tier}
                    </span>
                  </div>
                  <span className="text-xs text-[#6b7280] block mt-0.5">{s.domain}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-[#6b7280]">
                  <span>Type: {s.source_type}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Activity className="w-3 h-3" /> Healthy
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-[#e5e7eb]">
            {(candidates || []).length === 0 ? (
              <li className="p-8 text-center text-sm text-[#6b7280]">No stories in queue.</li>
            ) : (candidates || []).map((cand) => (
              <li key={cand.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                      cand.priority_level === 'critical' ? 'bg-red-100 text-red-800' :
                      cand.priority_level === 'high' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cand.priority_level}
                    </span>
                    <span className="text-xs font-mono text-[#6b7280]">Score: {cand.relevance_score}/100</span>
                    <span className="text-xs font-mono text-[#9ca3af]">·</span>
                    <span className="text-xs font-mono text-[#6b7280]">{cand.source}</span>
                  </div>
                  <h3 className="font-bold text-base text-mkt-ink">{cand.title}</h3>
                  <p className="text-xs text-[#4b5563] mt-1 line-clamp-2">{cand.summary}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/admin/news/${cand.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1"
                  >
                    Examine Event <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
