"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

interface EconomicEvent {
  date: string;
  time: string;
  event: string;
  country: string;
  impact: 'High' | 'Medium' | 'Low';
  forecast: string;
  previous: string;
}

export function EconomicCalendarWidget() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch("/api/market/calendar");
        const data = await res.json();
        setEvents(data.slice(0, 5)); // Next 5 main events
        setLoading(false);
      } catch (err) {
        console.error("Calendar fetch error:", err);
      }
    }
    fetchCalendar();
  }, []);

  return (
    <section className="py-24 bg-background-elevated relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
            // ECONOMIC CALENDAR
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase">
            Know What's Coming.
          </h2>
        </div>

        <div className="bg-background-surface border border-border-slate overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-slate bg-background-primary/50">
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Date</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Time (GMT)</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Event</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-center">Country</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Impact</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Forecast</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {events.map((event, i) => (
                  <tr 
                    key={i} 
                    className={cn(
                      "group hover:bg-white/5 transition-colors",
                      event.date === "Today" ? "border-l-4 border-l-accent" : ""
                    )}
                  >
                    <td className="p-6 text-sm font-sans text-text-primary whitespace-nowrap">{event.date}</td>
                    <td className="p-6 text-sm font-mono text-text-primary">{event.time}</td>
                    <td className="p-6 text-sm font-bold uppercase text-text-primary">{event.event}</td>
                    <td className="p-6 text-xl text-center">{event.country}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          event.impact === 'High' ? "bg-loss" : event.impact === 'Medium' ? "bg-amber-400" : "bg-profit"
                        )} />
                        <span className={cn(
                          "text-[10px] font-mono font-black uppercase",
                          event.impact === 'High' ? "text-loss" : event.impact === 'Medium' ? "text-amber-400" : "text-profit"
                        )}>{event.impact}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-mono text-text-secondary">{event.forecast || "—"}</td>
                    <td className="p-6 text-sm font-mono text-text-secondary">{event.previous || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-background-primary/30 border-t border-border-slate">
            <Link 
              href="/markets?tab=calendar" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
            >
              View Full Calendar <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
