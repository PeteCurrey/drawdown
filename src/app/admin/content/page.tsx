import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Video, Map, Edit3, Search, Plus, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab || "breakdowns";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  let content;

  if (activeTab === "breakdowns") {
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
        <button className="mt-6 px-4 py-2 border border-[#d1d5db] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-gray-50">
          Configure Roadmap
        </button>
      </div>
    );
  } else if (activeTab === "corrections") {
    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center text-[#6b7280] shadow-sm">
        <Edit3 className="w-8 h-8 mx-auto text-[#9ca3af] mb-4" />
        <h3 className="font-bold text-mkt-ink mb-2">Editorial Corrections Log</h3>
        <p className="text-sm">Record and publish transparency logs for major content corrections.</p>
        <button className="mt-6 px-4 py-2 bg-mkt-ink text-white rounded-lg text-sm font-bold hover:bg-mkt-i2">
          Add Correction
        </button>
      </div>
    );
  } else if (activeTab === "seo") {
    content = (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center text-[#6b7280] shadow-sm">
        <Search className="w-8 h-8 mx-auto text-[#9ca3af] mb-4" />
        <h3 className="font-bold text-mkt-ink mb-2">SEO Pages Manager</h3>
        <p className="text-sm">Manage dynamic prop firm reviews and programmatic SEO pages.</p>
        <button className="mt-6 px-4 py-2 border border-[#d1d5db] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-gray-50">
          View SEO Pages
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Content Delivery</h1>
          <p className="text-sm text-mkt-i3 mt-2">Manage weekly market breakdowns, the public roadmap, and SEO content.</p>
        </div>
        <Link 
          href="/admin/content/generator"
          className="bg-mkt-ink text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-mkt-i2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-mkt-grn" />
          Content Engine
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb]">
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
            Breakdowns
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
