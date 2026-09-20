import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Sparkles,
  FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminNewsDetailPage({ params }: Props) {
  const { id } = await params;

  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  const { data: candidate } = await supabase
    .from("news_candidates")
    .select("*")
    .eq("id", id)
    .single();

  if (!candidate) {
    notFound();
  }

  const evidence = candidate.verification_evidence || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/admin/news" 
              className="text-xs font-mono font-bold text-[#6b7280] hover:text-mkt-ink flex items-center gap-1 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3 h-3" /> Back to News Radar
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-mkt-ink">{candidate.title}</h1>
            <span className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded ${
              candidate.priority_level === 'critical' ? 'bg-red-100 text-red-800' :
              candidate.priority_level === 'high' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {candidate.priority_level} Priority
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#6b7280]">
            <span>Relevance: {candidate.relevance_score}/100</span>
            <span>·</span>
            <span>Impact: {candidate.market_impact_score}/100</span>
            <span>·</span>
            <span>Confidence: {candidate.confidence_score}/100</span>
            <span>·</span>
            <span>Discovered: {new Date(candidate.discovered_at).toLocaleString()}</span>
          </div>
        </div>

        <div>
          <Link
            href={`/admin/content/generator?newsCandidateId=${candidate.id}`}
            className="bg-mkt-ink text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-mkt-i2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-mkt-grn" /> Synthesise Editorial Draft
          </Link>
        </div>
      </header>

      {/* Verification Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verification Report & Fact Preservation
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase font-mono text-emerald-800 mb-2">Confirmed Factual Assertions</h4>
                {evidence.confirmedFacts && evidence.confirmedFacts.length > 0 ? (
                  <ul className="space-y-1.5">
                    {evidence.confirmedFacts.map((fact: string, idx: number) => (
                      <li key={idx} className="text-xs text-[#1A1A1A] flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#6b7280] italic">No primary source confirmation recorded.</p>
                )}
              </div>

              {evidence.unconfirmedClaims && evidence.unconfirmedClaims.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase font-mono text-amber-800 mb-2">Unconfirmed Assertions / Rumours</h4>
                  <ul className="space-y-1.5">
                    {evidence.unconfirmedClaims.map((claim: string, idx: number) => (
                      <li key={idx} className="text-xs text-amber-900 flex items-start gap-2 bg-amber-50/50 p-2.5 rounded border border-amber-100">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{claim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Event Raw Payload / Details */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Story Narrative & Raw Summary
            </h2>
            <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{candidate.summary}</p>
            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
              <a 
                href={candidate.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Inspect Original Source Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Entities & Scoring Reasons */}
        <div className="space-y-6">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-3">
              Identified Entities
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(candidate.entity_references || []).map((ent: string, idx: number) => (
                <span key={idx} className="text-xs bg-gray-100 text-[#374151] px-2.5 py-1 rounded font-mono">
                  {ent}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-3">
              Deterministic Scoring Reasons
            </h2>
            <ul className="space-y-2">
              {(candidate.scoring_reasons || []).map((reason: string, idx: number) => (
                <li key={idx} className="text-xs text-[#4b5563] flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
