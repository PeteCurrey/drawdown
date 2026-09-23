import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Send,
  XCircle
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminSocialPublishingPage({ searchParams }: Props) {
  const params = await searchParams;
  const filterStatus = params.status || "all";

  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  let query = supabase
    .from("social_deliveries")
    .select("*, content_channels(*)")
    .order("created_at", { ascending: false })
    .limit(40);

  if (filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data: deliveries } = await query;

  const hasOneSocialConfigured = !!process.env.ONESOCIAL_API_KEY && process.env.ONESOCIAL_API_KEY !== 'placeholder';
  const hasInstagramChannelConfigured = !!process.env.ONESOCIAL_INSTAGRAM_CHANNEL_ID;

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
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Social Publishing Command</h1>
          <p className="text-sm text-mkt-i3 mt-1">
            Provider-agnostic publishing operations, idempotent retries, delivery receipts, and 1Social health.
          </p>
        </div>

        {/* Provider Status Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-xl shadow-sm text-xs font-mono">
            <span className="text-[#6b7280]">Provider (1Social):</span>
            {hasOneSocialConfigured ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
              </span>
            ) : (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Isolated / Boundary Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-xl shadow-sm text-xs font-mono">
            <span className="text-[#6b7280]">Target (@drawdowntrading):</span>
            {hasInstagramChannelConfigured ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Configured
              </span>
            ) : (
              <span className="text-[#6b7280] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span> Default Route
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb]">
        {['all', 'published', 'publishing', 'queued', 'unconfirmed', 'failed'].map((st) => (
          <Link
            key={st}
            href={`?status=${st}`}
            className={`px-4 py-2.5 text-xs font-bold font-mono uppercase border-b-2 transition-colors ${
              filterStatus === st
                ? "border-mkt-ink text-mkt-ink"
                : "border-transparent text-[#6b7280] hover:text-mkt-ink"
            }`}
          >
            {st}
          </Link>
        ))}
      </div>

      {/* Deliveries Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
          <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Publication Receipts & Delivery Log</h2>
          <span className="text-[10px] font-mono text-[#9ca3af]">Truth-First Receipt Verification</span>
        </div>

        <ul className="divide-y divide-[#e5e7eb]">
          {(deliveries || []).length === 0 ? (
            <li className="p-8 text-center text-sm text-[#6b7280]">No delivery attempts matching filter.</li>
          ) : (deliveries || []).map((del) => (
            <li key={del.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono uppercase text-mkt-ink">{del.channel}</span>
                  <span className="text-[10px] font-mono text-[#9ca3af]">via {del.provider}</span>
                  <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                    del.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                    del.status === 'unconfirmed' ? 'bg-amber-100 text-amber-800' :
                    del.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {del.status}
                  </span>
                </div>
                {del.provider_post_id && (
                  <span className="text-xs font-mono text-[#6b7280] block">Provider ID: {del.provider_post_id}</span>
                )}
                {del.failure_reason && (
                  <span className="text-xs text-red-600 block mt-0.5">{del.failure_reason}</span>
                )}
                <span className="text-[10px] font-mono text-[#9ca3af] block mt-1">
                  Attempted: {new Date(del.created_at).toLocaleString()}
                </span>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {del.status === 'failed' || del.status === 'unconfirmed' ? (
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Retry Safely
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
