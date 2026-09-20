import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Users, 
  Eye, 
  AlertTriangle 
} from "lucide-react";
import { AttributionEngine } from "@/lib/content-os/attribution";

export const dynamic = "force-dynamic";

export default async function AdminContentPerformancePage() {
  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  // Fetch attribution sessions and content performance
  const { data: sessions } = await supabase
    .from("web_attribution_sessions")
    .select("*")
    .limit(100);

  const { data: items } = await supabase
    .from("content_items")
    .select("*, content_channels(*)")
    .eq("status", "published")
    .limit(20);

  const totalSessions = sessions?.length || 0;
  const paidConversions = (sessions || []).filter(s => s.converted_paid).length;
  const totalRevenueGbp = ((sessions || []).reduce((acc, s) => acc + (s.revenue_pence || 0), 0)) / 100;

  // Fatigue detection on published titles
  const recentTitles = (items || []).map(i => i.title);
  const fatigueCheck = AttributionEngine.detectFatigue(recentTitles);

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
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Content Performance & Learning</h1>
          <p className="text-sm text-mkt-i3 mt-1">
            Tracking the feedback loop: Content → Traffic → Tool Usage → Conversions → Revenue.
          </p>
        </div>
      </header>

      {/* Fatigue Warning Alert */}
      {fatigueCheck.hasFatigue && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase font-mono block">Content Fatigue Warning</span>
            <ul className="mt-1 space-y-1">
              {fatigueCheck.warnings.map((w, idx) => (
                <li key={idx} className="text-xs text-amber-800">{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* High Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block">Attributed Sessions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-mkt-ink">{totalSessions}</span>
          </div>
        </div>
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block">Tool Usage Leads</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">{(sessions || []).filter(s => s.tool_used).length}</span>
          </div>
        </div>
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block">Paid Conversions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{paidConversions}</span>
          </div>
        </div>
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block">Attributed Revenue</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-mkt-ink">£{totalRevenueGbp.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Published Content Scorecard */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
          <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Published Content Scorecard</h2>
          <span className="text-[10px] font-mono text-[#9ca3af]">Attributed Conversions & Revenue</span>
        </div>

        <ul className="divide-y divide-[#e5e7eb]">
          {(items || []).length === 0 ? (
            <li className="p-8 text-center text-sm text-[#6b7280]">No published items tracked yet.</li>
          ) : (items || []).map((item) => (
            <li key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase bg-gray-100 px-2 py-0.5 rounded text-[#6b7280]">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#9ca3af]">Published: {new Date(item.published_at || item.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-sm text-mkt-ink truncate">{item.title}</h3>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono text-[#6b7280]">
                <div>
                  <span className="text-[9px] uppercase block text-[#9ca3af]">Traffic</span>
                  <span className="font-bold text-mkt-ink">--</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase block text-[#9ca3af]">Conversions</span>
                  <span className="font-bold text-emerald-600">--</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase block text-[#9ca3af]">Revenue</span>
                  <span className="font-bold text-mkt-ink">£0.00</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
