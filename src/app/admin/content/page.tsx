import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Video, 
  Map, 
  Edit3, 
  Search, 
  Plus, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Radio, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  ExternalLink
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab || "queue";

  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  let content;

  if (activeTab === "queue") {
    // 1. Fetch content items
    const { data: items } = await supabase
      .from("content_items")
      .select("*, content_channels(*)")
      .order("created_at", { ascending: false })
      .limit(30);

    const counts = {
      draft: (items || []).filter(i => i.status === 'draft').length,
      review: (items || []).filter(i => i.status === 'review').length,
      approved: (items || []).filter(i => i.status === 'approved').length,
      scheduled: (items || []).filter(i => i.status === 'scheduled').length,
      published: (items || []).filter(i => i.status === 'published').length,
    };

    content = (
      <div className="space-y-6">
        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider block">Drafts</span>
            <span className="text-2xl font-bold text-mkt-ink mt-1 block">{counts.draft}</span>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider block">In Review</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">{counts.review}</span>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">Approved</span>
            <span className="text-2xl font-bold text-blue-600 mt-1 block">{counts.approved}</span>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-mono text-purple-600 uppercase tracking-wider block">Scheduled</span>
            <span className="text-2xl font-bold text-purple-600 mt-1 block">{counts.scheduled}</span>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Published</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{counts.published}</span>
          </div>
        </div>

        {/* Content Items Table */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Drawdown Content Pipeline</h2>
            <div className="flex gap-2">
              <Link 
                href="/admin/content/calendar" 
                className="bg-white border border-[#e5e7eb] text-mkt-ink px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-gray-50"
              >
                <CalendarIcon className="w-3 h-3" /> Calendar
              </Link>
              <Link 
                href="/admin/content/news" 
                className="bg-white border border-[#e5e7eb] text-mkt-ink px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-gray-50"
              >
                <Radio className="w-3 h-3 text-red-500" /> News Radar
              </Link>
            </div>
          </div>

          <ul className="divide-y divide-[#e5e7eb]">
            {(items || []).length === 0 ? (
              <li className="p-8 text-center text-[#6b7280] text-sm">
                No content items in the pipeline yet. News radar and authoring will populate this queue.
              </li>
            ) : (items || []).map((item) => (
              <li key={item.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                      item.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'review' ? 'bg-amber-100 text-amber-800' :
                      item.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] font-mono text-[#9ca3af] uppercase">{item.content_type}</span>
                    <span className="text-[10px] font-mono text-[#9ca3af]">·</span>
                    <span className="text-[10px] font-mono text-[#9ca3af] uppercase">{item.priority} priority</span>
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-[#6b7280] mt-0.5 line-clamp-1">{item.excerpt || item.body?.slice(0, 120)}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-[#9ca3af]">
                    <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                    {item.source_type && <span>Source: {item.source_type}</span>}
                    {item.content_channels && item.content_channels.length > 0 && (
                      <span>Channels: {item.content_channels.map((c: any) => c.channel).join(', ')}</span>
                    )}
                  </div>
                </div>

                <Link 
                  href={`/admin/content/${item.id}`}
                  className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1"
                >
                  Manage <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else if (activeTab === "breakdowns") {
    const { data: breakdowns } = await supabase
      .from("weekly_breakdowns")
      .select("*")
      .order("published_at", { ascending: false });

    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
          <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Weekly Video Breakdowns</h2>
          <button className="bg-mkt-ink text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-mkt-i2">
            <Plus className="w-3 h-3" /> New Breakdown
          </button>
        </div>
        <ul className="divide-y divide-[#e5e7eb]">
          {(breakdowns || []).length === 0 ? (
            <li className="p-6 text-center text-[#6b7280] text-sm">No breakdowns published yet.</li>
          ) : (breakdowns || []).map(b => (
            <li key={b.id} className="p-4 flex items-start gap-4 hover:bg-gray-50">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-[#6b7280]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#1A1A1A] text-sm">{b.title}</h3>
                <p className="text-xs text-[#6b7280] mt-1 line-clamp-1">{b.summary_md}</p>
                <div className="flex gap-4 mt-2 text-[10px] font-mono text-[#9ca3af] uppercase tracking-widest">
                  <span>Week of: {new Date(b.week_of).toLocaleDateString()}</span>
                  <span>Tier: {b.tier_required}</span>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1">Edit</button>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (activeTab === "roadmap") {
    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center text-[#6b7280] shadow-sm">
        <Map className="w-8 h-8 mx-auto text-[#9ca3af] mb-4" />
        <h3 className="font-bold text-mkt-ink mb-2">Roadmap Editor</h3>
        <p className="text-sm">Manage public roadmap phases, statuses, and target dates.</p>
      </div>
    );
  } else if (activeTab === "corrections") {
    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center text-[#6b7280] shadow-sm">
        <Edit3 className="w-8 h-8 mx-auto text-[#9ca3af] mb-4" />
        <h3 className="font-bold text-mkt-ink mb-2">Editorial Corrections Log</h3>
        <p className="text-sm">Record and publish transparency logs for major content corrections.</p>
      </div>
    );
  } else if (activeTab === "seo") {
    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center text-[#6b7280] shadow-sm">
        <Search className="w-8 h-8 mx-auto text-[#9ca3af] mb-4" />
        <h3 className="font-bold text-mkt-ink mb-2">SEO Pages Manager</h3>
        <p className="text-sm">Manage dynamic prop firm reviews and programmatic SEO pages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Content OS</h1>
          <p className="text-sm text-mkt-i3 mt-2">Manage the Drawdown content engine, rolling calendar, news radar, and social adaptations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/content/calendar"
            className="bg-white border border-[#e5e7eb] text-mkt-ink px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <CalendarIcon className="w-4 h-4 text-purple-600" />
            Editorial Calendar
          </Link>
          <Link 
            href="/admin/content/news"
            className="bg-white border border-[#e5e7eb] text-mkt-ink px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            News Radar
          </Link>
          <Link 
            href="/admin/content/generator"
            className="bg-mkt-ink text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-mkt-i2 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-mkt-grn" />
            AI Content Engine
          </Link>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb]">
        <Link
          href="?tab=queue"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "queue"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content Queue
          </div>
        </Link>
        <Link
          href="?tab=breakdowns"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "breakdowns"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video Breakdowns
          </div>
        </Link>
        <Link
          href="?tab=roadmap"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "roadmap"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Roadmap
          </div>
        </Link>
        <Link
          href="?tab=corrections"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "corrections"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Corrections
          </div>
        </Link>
        <Link
          href="?tab=seo"
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "seo"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-[#6b7280] hover:text-[#1A1A1A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            SEO Pages
          </div>
        </Link>
      </div>

      {content}
    </div>
  );
}
