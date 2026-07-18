import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Video, Users, Link as LinkIcon, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  // Fetch upcoming live events
  const { data: events } = await supabase
    .from("live_events")
    .select("*")
    .order("scheduled_at", { ascending: true });

  // Fetch mentorship sessions (could be useful to see how busy the month is)
  const { data: mentorship } = await supabase
    .from("mentorship_sessions")
    .select("*, profiles(display_name)")
    .order("scheduled_at", { ascending: true });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mkt-ink">Events Manager</h1>
          <p className="text-sm text-mkt-i3 mt-2">Manage live masterclasses, Q&As, and view 1-to-1 bookings.</p>
        </div>
        <button className="bg-mkt-ink text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-mkt-i2 transition-colors">
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Events */}
        <section className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-[#e5e7eb]">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Masterclasses & Q&As</h2>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {(events || []).length === 0 ? (
              <li className="p-6 text-center text-[#6b7280] text-sm">No live events scheduled.</li>
            ) : (events || []).map(e => (
              <li key={e.id} className="p-5 hover:bg-gray-50 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#1A1A1A]">{e.title}</h3>
                    <div className="text-xs text-[#6b7280] font-mono mt-1">
                      {new Date(e.scheduled_at).toLocaleString()} · {e.duration_mins} mins
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${
                    e.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                    e.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {e.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-3 text-xs">
                  {e.meeting_url ? (
                    <a href={e.meeting_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> Meeting Link
                    </a>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Missing Link</span>
                  )}
                  {e.replay_url && (
                    <a href={e.replay_url} target="_blank" className="text-[#F9771D] hover:underline flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5" /> Replay Added
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Mentorship */}
        <section className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-[#e5e7eb]">
            <h2 className="text-xs font-bold font-mono text-[#6b7280] uppercase tracking-widest">Upcoming 1-to-1s</h2>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {(mentorship || []).filter(m => m.status === 'scheduled').length === 0 ? (
              <li className="p-6 text-center text-[#6b7280] text-sm">No upcoming 1-to-1 sessions.</li>
            ) : (mentorship || []).filter(m => m.status === 'scheduled').map(m => (
              <li key={m.id} className="p-5 flex items-start gap-4 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#6b7280]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A]">{m.profiles?.display_name || "Unknown Member"}</h3>
                  <div className="text-xs text-[#6b7280] font-mono mt-1">
                    {new Date(m.scheduled_at).toLocaleString()}
                  </div>
                  {m.meeting_url && (
                    <a href={m.meeting_url} target="_blank" className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-2">
                      <Video className="w-3 h-3" /> Join Meet
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
