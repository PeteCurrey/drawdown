import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Video, Clock, Link as LinkIcon, Info } from "lucide-react";
import CalEmbed from "./CalEmbed";

export const revalidate = 0;

export default async function MentorshipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch mentorship sessions for this user
  const { data: sessions, error } = await supabase
    .from("mentorship_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_at", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
  }

  // Get current month's bounds
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const currentMonthSession = (sessions || []).find(s => {
    const d = new Date(s.scheduled_at);
    return d >= startOfMonth && d <= endOfMonth;
  });

  const upcomingSessions = (sessions || []).filter(s => new Date(s.scheduled_at) > now && s.status === 'scheduled');
  const pastSessions = (sessions || []).filter(s => new Date(s.scheduled_at) <= now || s.status === 'completed');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="border-b border-[#EDEDED] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">1-to-1 Mentorship</h1>
        <p className="text-sm text-[#555550] mt-2 max-w-xl">
          Book your monthly 45-minute Floor session. Review your journal, adjust your execution plan, and optimize your edge.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Booking Section */}
          <section className="bg-white border border-[#e5e7eb] rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-[#e5e7eb] pb-4">
              <Calendar className="w-5 h-5 text-[#1A1A1A]" />
              <h2 className="text-lg font-bold text-[#1A1A1A]">Your Monthly Session</h2>
            </div>
            
            {currentMonthSession ? (
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Session Scheduled</h3>
                    <p className="text-xs text-[#64748b]">Your session for this month is booked.</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded">
                    Confirmed
                  </span>
                </div>
                
                <div className="space-y-4 mb-6 bg-white p-4 rounded-lg border border-[#e2e8f0]">
                  <div className="flex items-center gap-3 text-sm text-[#334155]">
                    <Calendar className="w-4 h-4 shrink-0 text-[#64748b]" />
                    <span>{new Date(currentMonthSession.scheduled_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#334155]">
                    <Clock className="w-4 h-4 shrink-0 text-[#64748b]" />
                    <span>{new Date(currentMonthSession.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({currentMonthSession.duration_mins} mins)</span>
                  </div>
                  {currentMonthSession.meeting_url && (
                    <div className="flex items-center gap-3 text-sm text-[#334155]">
                      <Video className="w-4 h-4 shrink-0 text-[#64748b]" />
                      <a href={currentMonthSession.meeting_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Join Google Meet
                      </a>
                    </div>
                  )}
                </div>
                
                <p className="text-[11px] text-[#64748b] font-mono leading-relaxed">
                  Note: To reschedule, please refer to the links in your confirmation email or contact support at least 24 hours in advance.
                </p>
              </div>
            ) : (
              <div className="min-h-[500px]">
                <CalEmbed 
                  calLink="petercurrey/floor-1-to-1-45m"
                  name={user.user_metadata?.full_name || ""}
                  email={user.email || ""}
                  userId={user.id}
                />
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#1A1A1A] text-white rounded-xl p-6 shadow-md border border-[#333]">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-[#C8F135]" />
              <h3 className="font-bold text-sm">How to Prepare</h3>
            </div>
            <ul className="space-y-3 text-xs text-[#A1A1AA] font-mono leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#C8F135] shrink-0">1.</span>
                Ensure your AI Trade Journal is up to date with the past week's trades.
              </li>
              <li className="flex gap-2">
                <span className="text-[#C8F135] shrink-0">2.</span>
                Identify 1-2 specific setups or psychological hurdles you want to dissect.
              </li>
              <li className="flex gap-2">
                <span className="text-[#C8F135] shrink-0">3.</span>
                Have your charts open and ready to screen share if needed.
              </li>
            </ul>
          </div>

          <section className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-[#e5e7eb]">
              <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Past Sessions</h2>
            </div>
            {pastSessions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#9ca3af] text-xs">No past sessions recorded.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#e5e7eb]">
                {pastSessions.slice(0, 5).map((session) => (
                  <li key={session.id} className="p-4">
                    <p className="text-sm font-bold text-[#1A1A1A] mb-1">
                      {new Date(session.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {session.notes_url ? (
                      <a 
                        href={session.notes_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest mt-2"
                      >
                        <LinkIcon className="w-3 h-3" />
                        Session Notes
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#9ca3af] uppercase tracking-widest">No notes available</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
