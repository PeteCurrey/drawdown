import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Radio, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Sparkles
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContentNewsPage() {
  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  // Fetch ingested news candidates
  const { data: candidates } = await supabase
    .from("news_candidates")
    .select("*")
    .order("discovered_at", { ascending: false })
    .limit(40);

  const newCount = (candidates || []).filter(c => c.editorial_status === 'new').length;
  const verifiedCount = (candidates || []).filter(c => c.verification_status === 'verified').length;
  const criticalCount = (candidates || []).filter(c => c.priority_level === 'critical' || c.priority_level === 'high').length;

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
            <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">News Radar & Verification</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-red-100 text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live Queue
            </span>
          </div>
          <p className="text-sm text-mkt-i3 mt-1">
            Detects incoming financial stories, enforces deterministic scoring, corroborates primary sources, and prepares editorial briefs.
          </p>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block">New Candidates</span>
          <span className="text-2xl font-bold text-mkt-ink mt-1 block">{newCount}</span>
        </div>
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Primary / Corroborated</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{verifiedCount}</span>
        </div>
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-red-600 uppercase tracking-wider block">High / Critical Priority</span>
          <span className="text-2xl font-bold text-red-600 mt-1 block">{criticalCount}</span>
        </div>
      </div>

      {/* Candidates Feed */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
          <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Incoming Stories Feed</h2>
          <span className="text-[10px] font-mono text-[#9ca3af]">Deduplicated & Scored Deterministically</span>
        </div>

        <ul className="divide-y divide-[#e5e7eb]">
          {(candidates || []).length === 0 ? (
            <li className="p-8 text-center text-[#6b7280] text-sm">
              No news candidates detected yet. Use the ingestion service or trigger feed scan.
            </li>
          ) : (candidates || []).map((candidate) => (
            <li key={candidate.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                    candidate.priority_level === 'critical' ? 'bg-red-100 text-red-800' :
                    candidate.priority_level === 'high' ? 'bg-amber-100 text-amber-800' :
                    candidate.priority_level === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {candidate.priority_level} Priority
                  </span>

                  <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                    candidate.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                    candidate.verification_status === 'partially_verified' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {candidate.verification_status}
                  </span>

                  <span className="text-[10px] font-mono text-[#6b7280]">
                    Score: {candidate.relevance_score}/100
                  </span>
                  <span className="text-[10px] font-mono text-[#9ca3af]">·</span>
                  <span className="text-[10px] font-mono text-[#6b7280]">
                    Source: {candidate.source}
                  </span>
                </div>

                <h3 className="font-bold text-base text-mkt-ink mb-1">
                  {candidate.title}
                </h3>
                <p className="text-xs text-[#4b5563] line-clamp-2 mb-3">
                  {candidate.summary}
                </p>

                {/* Scoring Reasons Badges */}
                {candidate.scoring_reasons && candidate.scoring_reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {candidate.scoring_reasons.map((r: string, idx: number) => (
                      <span key={idx} className="text-[10px] bg-gray-100 text-[#4b5563] px-2 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-[10px] font-mono text-[#9ca3af]">
                  <span>Discovered: {new Date(candidate.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {candidate.related_symbols && candidate.related_symbols.length > 0 && (
                    <span>Symbols: {candidate.related_symbols.join(', ')}</span>
                  )}
                  <a 
                    href={candidate.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    Original Source <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                <Link
                  href={`/admin/content/generator?newsCandidateId=${candidate.id}`}
                  className="text-xs font-bold bg-mkt-ink text-white hover:bg-mkt-i2 px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-mkt-grn" />
                  Create Draft
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
