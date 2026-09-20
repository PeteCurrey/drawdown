import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle, 
  Send, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Share2, 
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminContentItemDetailPage({ params }: Props) {
  const { id } = await params;

  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  const { data: item } = await supabase
    .from("content_items")
    .select("*, content_channels(*), content_assets(*)")
    .eq("id", id)
    .single();

  if (!item) {
    notFound();
  }

  // Fetch delivery history & audit logs
  const { data: auditLogs } = await supabase
    .from("content_audit_logs")
    .select("*")
    .eq("entity_id", id)
    .order("created_at", { ascending: false });

  const channelIds = (item.content_channels || []).map((c: any) => c.id);
  let deliveries: any[] = [];
  if (channelIds.length > 0) {
    const { data: delData } = await supabase
      .from("social_deliveries")
      .select("*")
      .in("content_channel_id", channelIds)
      .order("created_at", { ascending: false });
    deliveries = delData || [];
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/admin/content" 
              className="text-xs font-mono font-bold text-[#6b7280] hover:text-mkt-ink flex items-center gap-1 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Queue
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-mkt-ink">{item.title}</h1>
            <span className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded ${
              item.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
              item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
              item.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#6b7280]">
            <span>Type: {item.content_type}</span>
            <span>·</span>
            <span>Category: {item.category}</span>
            <span>·</span>
            <span>Priority: {item.priority}</span>
            {item.source_reference && (
              <>
                <span>·</span>
                <span>Source: {item.source_reference}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.status === 'draft' || item.status === 'review' ? (
            <form action={`/api/admin/content/${item.id}/approve`} method="POST">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Approve Content
              </button>
            </form>
          ) : null}

          {item.status === 'approved' ? (
            <form action={`/api/admin/content/${item.id}/publish`} method="POST">
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" /> Publish to Channels
              </button>
            </form>
          ) : null}
        </div>
      </header>

      {/* Content Body & Editorial Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Core Content / Body
            </h2>
            <div className="prose prose-sm max-w-none text-[#1A1A1A] whitespace-pre-wrap font-sans leading-relaxed">
              {item.body || "(No body text provided)"}
            </div>
          </div>

          {/* Channel Adaptations */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Channel Adaptations
            </h2>
            
            {(item.content_channels || []).length === 0 ? (
              <p className="text-xs text-[#6b7280] italic">No channel adaptations configured yet.</p>
            ) : (
              <div className="space-y-4">
                {(item.content_channels || []).map((ch: any) => (
                  <div key={ch.id} className="p-4 bg-gray-50 border border-[#e5e7eb] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono uppercase text-mkt-ink">{ch.channel}</span>
                      <span className="text-[10px] font-mono text-[#6b7280] uppercase">{ch.status}</span>
                    </div>
                    {ch.headline && <h4 className="text-xs font-bold text-mkt-ink mb-1">{ch.headline}</h4>}
                    <p className="text-xs text-[#4b5563] whitespace-pre-wrap">{ch.body}</p>
                    {ch.hashtags && ch.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-blue-600 font-mono">
                        {ch.hashtags.map((h: string, idx: number) => <span key={idx}>{h}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Assets & Audit History */}
        <div className="space-y-6">
          {/* Media Assets */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-3 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" /> Media Assets ({(item.content_assets || []).length})
            </h2>
            {(item.content_assets || []).length === 0 ? (
              <p className="text-xs text-[#9ca3af] italic">No visual assets attached.</p>
            ) : (
              <ul className="space-y-2">
                {(item.content_assets || []).map((asset: any) => (
                  <li key={asset.id} className="text-xs p-2 bg-gray-50 rounded border border-[#e5e7eb]">
                    <span className="font-bold block uppercase text-[10px] text-[#6b7280]">{asset.asset_type} ({asset.aspect_ratio || 'Auto'})</span>
                    <span className="truncate block text-blue-600">{asset.storage_url}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Delivery Receipts */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Delivery Audit Receipts
            </h2>
            {deliveries.length === 0 ? (
              <p className="text-xs text-[#9ca3af] italic">No deliveries attempted yet.</p>
            ) : (
              <ul className="space-y-2">
                {deliveries.map((del: any) => (
                  <li key={del.id} className="text-xs p-2 bg-gray-50 rounded border border-[#e5e7eb]">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="font-bold uppercase text-mkt-ink">{del.channel}</span>
                      <span className={`font-bold uppercase ${del.status === 'published' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {del.status}
                      </span>
                    </div>
                    {del.provider_post_id && (
                      <span className="text-[10px] text-[#6b7280] block font-mono mt-1 truncate">ID: {del.provider_post_id}</span>
                    )}
                    {del.failure_reason && (
                      <span className="text-[10px] text-red-600 block mt-1">{del.failure_reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> State Transition Log
            </h2>
            {(auditLogs || []).length === 0 ? (
              <p className="text-xs text-[#9ca3af] italic">No transition logs yet.</p>
            ) : (
              <ul className="divide-y divide-[#e5e7eb] text-xs">
                {(auditLogs || []).map((log: any) => (
                  <li key={log.id} className="py-2 first:pt-0 last:pb-0">
                    <div className="font-mono text-[10px] text-[#6b7280] flex justify-between">
                      <span>{log.previous_state || 'none'} → {log.new_state}</span>
                      <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {log.reason && <p className="text-[11px] text-[#4b5563] mt-0.5">{log.reason}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
