"use client";

import { useEffect, useState } from "react";
import { Clock, Globe, AlertCircle, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CalendarTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [impactFilter, setImpactFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch("/api/market/calendar");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Calendar Fetch Error:", err);
      } finally {
        setLoading(setLoading(false) as any);
      }
    }
    fetchCalendar();
  }, []);

  const filteredEvents = impactFilter === "all" 
    ? events 
    : events.filter(e => e.impact?.toLowerCase() === impactFilter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border-slate">
        <div className="space-y-1">
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight">Economic Calendar</h3>
          <p className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest leading-loose">
            Global Macro Events // Timezone: UTC (+00:00)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-background-surface border border-border-slate overflow-hidden">
            <div className="px-4 py-3 border-r border-border-slate">
              <Filter className="w-3 h-3 text-text-tertiary" />
            </div>
            <select 
              className="bg-transparent text-[10px] font-bold uppercase tracking-widest px-6 py-3 outline-none cursor-pointer hover:bg-background-elevated transition-colors"
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
            >
              <option value="all">All Impacts</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-slate/50">
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Time</th>
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Currency</th>
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Event</th>
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Impact</th>
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-right">Actual</th>
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-right">Forecast</th>
              <th className="py-6 px-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-right">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/30">
            {loading ? (
              Array(10).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-6 h-16 bg-background-surface/20" />
                </tr>
              ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, i) => (
                <tr key={i} className="group hover:bg-background-surface/40 transition-colors">
                  <td className="py-6 px-4 font-mono text-xs text-text-secondary">{event.time || "12:00"}</td>
                  <td className="py-6 px-4 text-xs font-bold font-display uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-background-elevated text-[9px] rounded-sm border border-border-slate">
                        {event.country || "GB"}
                      </span>
                      {event.currency || "GBP"}
                    </div>
                  </td>
                  <td className="py-6 px-4 text-sm font-bold uppercase tracking-tight max-w-sm">
                    {event.event}
                  </td>
                  <td className="py-6 px-4">
                    <div className={cn(
                      "w-3 h-3 rounded-full shadow-sm",
                      event.impact?.toLowerCase() === 'high' ? "bg-loss shadow-loss/20" :
                      event.impact?.toLowerCase() === 'medium' ? "bg-accent shadow-accent/20" :
                      "bg-text-tertiary/30"
                    )} />
                  </td>
                  <td className="py-6 px-4 text-xs font-mono text-right font-bold">{event.actual || "---"}</td>
                  <td className="py-6 px-4 text-xs font-mono text-right text-text-tertiary">{event.forecast || "---"}</td>
                  <td className="py-6 px-4 text-xs font-mono text-right text-text-tertiary">{event.previous || "---"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center text-xs font-mono uppercase text-text-tertiary tracking-widest">
                  No events found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-background-surface/50 border border-border-slate flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-accent opacity-50" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary max-w-md">
            Market volatility increases significantly during high impact events. Manage your risk exposure accordingly.
          </p>
        </div>
        <p className="text-[10px] font-mono uppercase text-text-tertiary">
          Data provided by Finnhub Institutional
        </p>
      </div>
    </div>
  );
}
