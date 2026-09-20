import { Calendar, AlertCircle } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyComingUpEvent } from "@/types/lobby";

interface LobbyComingUpProps {
  events?: LobbyComingUpEvent[];
}

export function LobbyComingUp({ events = [] }: LobbyComingUpProps) {
  const hasEvents = events.length > 0;

  return (
    <section id="coming-up" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              COMING UP // SCHEDULED CATALYSTS & EVENTS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            CALENDAR INTEGRITY
          </span>
        </div>

        {!hasEvents ? (
          <LobbyEmptyState
            title="NO UPCOMING EDITORIAL EVENTS SCHEDULED"
            description="Drawdown macroeconomic and regulatory calendars will display major central bank rate decisions, policy updates, and scheduled firm releases once officially published."
            badge="EVENT RADAR STANDBY"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <div 
                key={i} 
                className="bg-[#FFFFFF] border border-[#DEDDD8] p-5 rounded-[2px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="font-semibold text-[#16213E] uppercase tracking-wider">
                      {ev.market_category}
                    </span>
                    <span 
                      className={`px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider font-semibold ${
                        ev.importance === 'CRITICAL' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : ev.importance === 'HIGH'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-neutral-100 text-[#4B5157]'
                      }`}
                    >
                      {ev.importance}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-[#0B0E12] tracking-tight leading-snug">
                    {ev.event_name}
                  </h3>

                  <p className="mt-2 text-xs text-[#4B5157] font-sans leading-relaxed">
                    {ev.short_explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DEDDD8]/60 flex items-center justify-between text-[11px] font-mono text-[#0B0E12]">
                  <span>{ev.date}</span>
                  <span className="text-[#4B5157]">{ev.time} UTC</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
