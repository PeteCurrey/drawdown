import { createInternalSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertOctagon, Info } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEmailDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createInternalSupabase();

  const { data: emailSend, error } = await supabase
    .from("email_sends")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !emailSend) {
    notFound();
  }

  const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">SENT</span>;
      case "pending":
      case "sending":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-400 uppercase">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 uppercase">FAILED</span>;
    }
  };

  const getReadableType = (type: string) => {
    switch (type) {
      case "morning_brief": return "Morning Brief";
      case "evening_wrap": return "Evening Wrap";
      case "welcome": return "Welcome Onboarding";
      case "weekly": return "Weekly Edition";
      default: return type;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/emails" className="p-1 border border-white/10 hover:border-white/20 text-[#8C8B87] hover:text-white rounded transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">Campaign Detail</h1>
              <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest mt-1">Inspection & Verification Log</p>
            </div>
          </div>
        </div>
        {getStatusPill(emailSend.status)}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* HTML Preview (Left, larger) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] font-bold">// Email HTML Preview</h3>
          <div className="bg-[#0F111A] border border-[#1C1F2B] p-2 rounded-xl h-[700px] overflow-hidden relative">
            <iframe
              srcDoc={emailSend.content_html}
              className="w-full h-full bg-[#08090D] border-0"
              title="Email Preview"
              sandbox="allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>

        {/* Dispatch Metadata (Right) */}
        <div className="space-y-6">
          <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] font-bold border-b border-white/5 pb-4">
              // Metadata
            </h3>
            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">Campaign Type</span>
                <p className="font-semibold text-white">{getReadableType(emailSend.type)}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">Subject Line</span>
                <p className="font-semibold text-white">{emailSend.subject}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">Recipients Count</span>
                <p className="font-mono text-white text-sm font-bold">{emailSend.recipient_count} subscribers</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">Generated At</span>
                <p className="font-mono text-white">
                  {new Date(emailSend.generated_at).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                </p>
              </div>
              {emailSend.sent_at && (
                <div>
                  <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">Dispatched At</span>
                  <p className="font-mono text-white">
                    {new Date(emailSend.sent_at).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                  </p>
                </div>
              )}
              {emailSend.resend_broadcast_id && (
                <div>
                  <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">Resend Broadcast ID</span>
                  <p className="font-mono text-xs text-[#00C2FF] break-all">
                    {emailSend.resend_broadcast_id}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message Section if Failed */}
          {emailSend.status === "failed" && (
            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-xl space-y-3 text-rose-400">
              <h4 className="text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" /> Dispatch Failure
              </h4>
              <p className="text-xs leading-relaxed font-sans">{emailSend.error_message || "Unknown API connection error."}</p>
              <button
                disabled
                className="w-full mt-2 py-2 bg-transparent border border-rose-500/30 text-rose-400/50 text-[10px] font-mono font-bold uppercase tracking-widest rounded cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Resend to Failed (Stub)
              </button>
            </div>
          )}

          {/* Market Data Used */}
          {emailSend.metadata && Object.keys(emailSend.metadata).length > 0 && (
            <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] font-bold border-b border-white/5 pb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#C8F135]" /> Payload Context
              </h3>
              <div className="max-h-60 overflow-y-auto font-mono text-[10px] text-[#8C8B87] bg-white/5 border border-white/5 p-4 rounded">
                <pre>{JSON.stringify(emailSend.metadata, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
