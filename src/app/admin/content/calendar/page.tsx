import { createServiceRoleClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarPlannerService, type InterruptionRecommendation } from "@/lib/content-os/calendar-planner";
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContentCalendarPage() {
  const supabaseUserClient = await createClient();
  const { data: { user } } = await supabaseUserClient.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const supabase = createServiceRoleClient();

  // 1. Fetch scheduled / published content
  const { data: scheduledItems } = await supabase
    .from("content_items")
    .select("*, content_channels(*)")
    .or("status.eq.scheduled,status.eq.published")
    .order("scheduled_at", { ascending: true });

  // 2. Fetch high-priority / critical news candidates for interruption detection
  const { data: breakingCandidates } = await supabase
    .from("news_candidates")
    .select("*")
    .in("priority_level", ["critical", "high"])
    .eq("editorial_status", "new")
    .order("discovered_at", { ascending: false })
    .limit(3);

  // Generate rolling 30-day template
  const slots = CalendarPlannerService.generate30DayTemplate();

  // Assign any scheduled items to matching dates
  if (scheduledItems) {
    scheduledItems.forEach(item => {
      if (item.scheduled_at) {
        const itemDate = new Date(item.scheduled_at).toISOString().split('T')[0];
        const match = slots.find(s => s.targetDate === itemDate);
        if (match) {
          match.assignedContentItem = item;
        }
      }
    });
  }

  // Check for calendar interruptions
  const interruption: InterruptionRecommendation = breakingCandidates && breakingCandidates.length > 0 
    ? CalendarPlannerService.evaluateInterruption({
        title: breakingCandidates[0].title,
        priority: breakingCandidates[0].priority_level,
        discoveredAt: breakingCandidates[0].discovered_at
      }, slots)
    : { hasConflict: false, recommendation: 'NONE' };

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
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Rolling 30-Day Calendar</h1>
          <p className="text-sm text-mkt-i3 mt-1">Targeting 4–5 high-quality content opportunities per week across market intelligence, education, and case studies.</p>
        </div>

        <Link
          href="/admin/content/generator"
          className="bg-mkt-ink text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-mkt-i2 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-mkt-grn" />
          Plan & Draft Content
        </Link>
      </header>

      {/* Breaking News Interruption Banner */}
      {interruption.hasConflict && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Calendar Conflict Detected
              </span>
              <span className="text-xs font-bold text-amber-900">{interruption.breakingNewsTitle}</span>
            </div>
            <p className="text-xs text-amber-800 mt-1">{interruption.rationale}</p>
            <div className="flex gap-2 mt-3">
              <Link 
                href="/admin/content/news"
                className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
              >
                Review News Radar
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid View */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-[#e5e7eb] flex justify-between items-center">
          <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">30-Day Editorial Allocation Plan</h2>
          <span className="text-[10px] font-mono text-[#9ca3af] uppercase">Active Slots: {slots.length}</span>
        </div>

        <div className="divide-y divide-[#e5e7eb]">
          {slots.map((slot) => {
            const isAssigned = !!slot.assignedContentItem;
            return (
              <div 
                key={slot.slotId} 
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isAssigned ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4 min-w-[240px]">
                  <div className="w-12 text-center shrink-0">
                    <span className="text-[10px] font-bold font-mono text-[#9ca3af] uppercase block">
                      {slot.dayOfWeek.slice(0, 3)}
                    </span>
                    <span className="text-base font-bold text-mkt-ink block leading-tight">
                      {new Date(slot.targetDate).getDate()}
                    </span>
                    <span className="text-[9px] font-mono text-[#9ca3af] block">
                      {new Date(slot.targetDate).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#6b7280]">
                        {slot.suggestedTime} GMT
                      </span>
                      <span className="text-xs font-bold text-mkt-ink">
                        {slot.pillar}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#9ca3af] uppercase block mt-0.5">
                      Type: {slot.recommendedContentType}
                    </span>
                  </div>
                </div>

                <div className="flex-1 md:px-6">
                  {isAssigned ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-mkt-ink truncate">{slot.assignedContentItem?.title}</h4>
                        <div className="flex gap-2 mt-0.5 text-[9px] font-mono text-[#6b7280]">
                          <span className="uppercase text-emerald-700 font-bold">{slot.assignedContentItem?.status}</span>
                          <span>·</span>
                          <span>Channels: {(slot.assignedContentItem?.content_channels || []).map((c: any) => c.channel).join(', ') || 'All'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#9ca3af] italic">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Open Slot — Ready for scheduled evergreen or breaking intelligence</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isAssigned ? (
                    <Link
                      href={`/admin/content/${slot.assignedContentItem?.id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 rounded-lg flex items-center gap-1"
                    >
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      href={`/admin/content/generator?date=${slot.targetDate}&pillar=${encodeURIComponent(slot.pillar)}`}
                      className="text-xs font-bold text-[#4b5563] hover:text-mkt-ink px-3 py-1.5 border border-[#e5e7eb] rounded-lg hover:bg-white"
                    >
                      Fill Slot
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
