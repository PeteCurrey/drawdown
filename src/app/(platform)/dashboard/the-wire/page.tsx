import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LiveFeed } from "@/components/dashboard/LiveFeed";

export default async function TheWirePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Simulated daily briefs
  const briefs = [
    {
      id: "brief-1",
      tag: "MORNING BRIEF",
      date: "Today 07:00 GMT",
      title: "GBP/USD Probes Key Liquidity; Eyes on PMIs",
      preview: "London open triggers fresh buy delta as price rejects key 1.2720 support level. Technical structures suggest consolidation ahead of major US sessional data releases later this afternoon.",
      status: "NEW"
    },
    {
      id: "brief-2",
      tag: "AFTERNOON BRIEF",
      date: "Yesterday 16:30 GMT",
      title: "US Session Wrap: Dollar Profit-Taking Boosts Cable",
      preview: "A short-covering rally during the New York afternoon lift session pushes GBP/USD back towards 1.2750. Volume nodes show light institutional activity.",
      status: "READ"
    },
    {
      id: "brief-3",
      tag: "MORNING BRIEF",
      date: "Yesterday 07:00 GMT",
      title: "BOE Rate Trajectory Dominates European Open",
      preview: "Central bank pricing shifts slightly hawkish following hawkish comments from policy makers, stabilizing pound pairs against early USD momentum.",
      status: "READ"
    },
    {
      id: "brief-4",
      tag: "ECONOMIC UPDATE",
      date: "20 Oct 2024",
      title: "Weekly Outlook: Central Bank Speakers & US Inflation Data",
      preview: "Macro models highlight a series of high-impact speakers from the Federal Reserve and BOE. Traders should anticipate range-bound volatility profiles.",
      status: "READ"
    }
  ];

  return (
    <div className="space-y-10">
      <header className="border-b border-[#C8CBB8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">The Wire</h1>
          <p className="text-sm text-[#555550] mt-2">
            Morning and afternoon intelligence briefs, every trading day.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18B880] animate-pulse" />
          <span className="text-xs text-[#555550] font-mono uppercase tracking-wider">Live Feed Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column: Brief list */}
        <div className="lg:col-span-7 space-y-4">
          {briefs.map((brief) => (
            <div 
              key={brief.id} 
              className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-mono text-[#555550] uppercase tracking-widest">{brief.tag}</span>
                <span className="text-[10px] text-[#555550] font-mono">{brief.date}</span>
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{brief.title}</h3>
              <p className="text-xs text-[#555550] leading-relaxed mb-4">{brief.preview}</p>
              
              <div className="flex justify-between items-center border-t border-[#C8CBB8]/40 pt-4">
                <span className="text-xs font-bold text-[#F9771D] hover:underline cursor-pointer">Read →</span>
                {brief.status === "NEW" && (
                  <span className="px-2 py-0.5 bg-[#F9771D] text-white text-[8px] font-mono font-bold uppercase">New</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Alerts Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#181818] text-white p-6 border border-[#333330] flex flex-col h-[500px]">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#333330] pb-3 mb-4">Signal Alerts</h3>
            <div className="flex-grow overflow-y-auto">
              <LiveFeed items={[
                { id: "feed-1", type: "alert", severity: "orange", source: "GBP/USD", message: "Bearish divergence on 4H RSI", time: "10m ago" },
                { id: "feed-2", type: "event", severity: "red", message: "📋 NFP data release in 2h 14m", time: "2h ago" },
                { id: "feed-3", type: "event", severity: "orange", message: "📋 BOE rate decision — tomorrow 12:00", time: "4h ago" },
                { id: "feed-4", type: "event", severity: "green", message: "📋 EUR/USD signal zone approached", time: "5h ago" },
                { id: "feed-5", type: "event", severity: "green", message: "📋 The Wire — Morning brief ready", time: "7h ago" },
              ]} />
            </div>
            <button className="w-full mt-4 py-2.5 border border-[#F9771D] text-[#F9771D] hover:bg-[#F9771D]/10 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-[4px]">
              Subscribe to SMS alerts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
