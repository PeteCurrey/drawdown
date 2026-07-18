import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Play, Calendar, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const revalidate = 0; // Force dynamic fetching

export default async function BreakdownsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch published breakdowns
  const { data: breakdowns, error } = await supabase
    .from("weekly_breakdowns")
    .select("*")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching breakdowns:", error);
  }

  const hasBreakdowns = breakdowns && breakdowns.length > 0;
  const latestBreakdown = hasBreakdowns ? breakdowns[0] : null;
  const pastBreakdowns = hasBreakdowns ? breakdowns.slice(1) : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="border-b border-[#EDEDED] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Weekly Breakdowns</h1>
        <p className="text-sm text-[#555550] mt-2 max-w-xl">
          Actionable market prep and macro bias to start your trading week. Included with Foundation.
        </p>
      </header>

      {!hasBreakdowns ? (
        <div className="bg-white border border-[#e5e7eb] border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4">
            <Play className="w-5 h-5 text-[#9ca3af]" />
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">First weekly breakdown dropping soon</h2>
          <p className="text-sm text-[#555550] max-w-sm">
            We're preparing the first market prep video for the platform. You'll receive an email notification when it goes live.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Latest Breakdown */}
          <section>
            <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4">Latest Video</h2>
            <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
              {latestBreakdown.video_url ? (
                <div className="aspect-video w-full bg-black relative">
                  <iframe 
                    src={latestBreakdown.video_url.includes('youtube') 
                      ? latestBreakdown.video_url.replace('watch?v=', 'embed/') 
                      : latestBreakdown.video_url} 
                    className="w-full h-full border-0"
                    allowFullScreen 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full bg-[#1A1A1A] flex items-center justify-center">
                  <span className="text-white/50 text-sm font-mono">Video processing...</span>
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#F9771D]" />
                  <span className="text-xs font-mono font-bold text-[#F9771D] tracking-widest uppercase">
                    Week of {new Date(latestBreakdown.week_of).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">{latestBreakdown.title}</h3>
                
                {latestBreakdown.summary_md && (
                  <div className="prose prose-sm max-w-none text-[#555550]">
                    <ReactMarkdown>{latestBreakdown.summary_md}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Past Breakdowns */}
          {pastBreakdowns.length > 0 && (
            <section>
              <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4">Past Breakdowns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBreakdowns.map((b) => (
                  <div key={b.id} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="aspect-video w-full bg-[#1A1A1A] relative flex items-center justify-center overflow-hidden">
                      {b.video_url ? (
                         <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: `url(https://img.youtube.com/vi/${b.video_url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg)` }}></div>
                      ) : null}
                      <Play className="w-10 h-10 text-white/80 group-hover:text-white transition-colors z-10" />
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-widest mb-2">
                        {new Date(b.week_of).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h4 className="font-bold text-[#1A1A1A] text-sm leading-tight group-hover:text-[#F9771D] transition-colors">{b.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
