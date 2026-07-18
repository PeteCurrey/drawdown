import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Video, Clock, Users, Lock } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch events
  const { data: events, error } = await supabase
    .from("live_events")
    .select("*")
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
  }

  const now = new Date();
  const upcomingEvents = (events || []).filter(e => new Date(e.scheduled_at) > now && e.status === 'scheduled');
  const pastEvents = (events || []).filter(e => new Date(e.scheduled_at) <= now || e.status === 'completed').sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="border-b border-[#EDEDED] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Live Events</h1>
        <p className="text-sm text-[#555550] mt-2 max-w-xl">
          Monthly live Q&A sessions and special masterclasses. Edge & Floor tiers only.
        </p>
      </header>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4">Upcoming Sessions</h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <Calendar className="w-8 h-8 text-[#9ca3af] mb-3" />
            <p className="text-[#555550] text-sm">No upcoming events scheduled right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.scheduled_at);
              const timeUntil = eventDate.getTime() - now.getTime();
              const minutesUntil = Math.floor(timeUntil / (1000 * 60));
              const canJoin = minutesUntil <= 15;

              return (
                <div key={event.id} className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-0.5 bg-[#F9771D]/10 text-[#F9771D] text-[10px] font-bold uppercase tracking-widest rounded">
                      {event.event_type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#6b7280] bg-gray-100 px-2 py-0.5 rounded">
                      {event.duration_mins} MINS
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex-1">{event.title}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#555550]">
                      <Calendar className="w-4 h-4" />
                      <span>{eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#555550]">
                      <Clock className="w-4 h-4" />
                      <span>{eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  
                  {canJoin && event.meeting_url ? (
                    <a 
                      href={event.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[11px] font-bold uppercase tracking-widest rounded-[4px] transition-colors flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting Now
                    </a>
                  ) : (
                    <button 
                      disabled
                      className="w-full py-2.5 bg-gray-100 text-[#9ca3af] text-[11px] font-bold uppercase tracking-widest rounded-[4px] flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Link opens 15m before start
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4">Past Sessions & Replays</h2>
        {pastEvents.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center">
            <p className="text-[#555550] text-sm">Past event replays will appear here.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
            <ul className="divide-y divide-[#e5e7eb]">
              {pastEvents.map((event) => (
                <li key={event.id} className="p-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      {event.event_type === 'q_and_a' ? <Users className="w-5 h-5 text-[#555550]" /> : <Video className="w-5 h-5 text-[#555550]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A1A1A] truncate">{event.title}</p>
                      <p className="text-xs text-[#555550] font-mono mt-0.5">
                        {new Date(event.scheduled_at).toLocaleDateString()} · {event.duration_mins} mins
                      </p>
                    </div>
                  </div>
                  {event.replay_url ? (
                    <a 
                      href={event.replay_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border border-[#d1d5db] hover:border-[#F9771D] hover:text-[#F9771D] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors whitespace-nowrap shrink-0"
                    >
                      Watch Replay
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-widest whitespace-nowrap">
                      Processing Replay...
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
