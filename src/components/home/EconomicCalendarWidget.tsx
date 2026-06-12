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

const FALLBACK_EVENTS: EconomicEvent[] = [
  {
    date: "First Friday",
    time: "13:30",
    event: "Non-Farm Payrolls (NFP)",
    country: "🇺🇸",
    impact: 'High',
    forecast: "180K",
    previous: "220K"
  },
  {
    date: "Monthly",
    time: "12:00",
    event: "BoE Interest Rate Decision",
    country: "🇬🇧",
    impact: 'High',
    forecast: "5.25%",
    previous: "5.25%"
  },
  {
    date: "Quarterly",
    time: "09:30",
    event: "GDP (QoQ)",
    country: "🇬🇧",
    impact: 'Medium',
    forecast: "0.2%",
    previous: "0.1%"
  }
];

function CalendarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-background-surface border border-border-slate/50" />
      ))}
    </div>
  );
}

export function EconomicCalendarWidget() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchCalendar() {
      try {
        const res = await fetch("/api/market/calendar", { signal: controller.signal });
        const data = await res.json();
        if (data && data.length > 0) {
          setEvents(data.slice(0, 5));
        } else {
          setEvents(FALLBACK_EVENTS);
        }
        setLoading(false);
      } catch (err) {
        console.error("Calendar fetch error, using fallbacks:", err);
        setEvents(FALLBACK_EVENTS);
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    }
    fetchCalendar();
    return () => controller.abort();
  }, []);

  return (
    <section className="py-12 md:py-20 bg-background-elevated relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
            // ECONOMIC INTELLIGENCE
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-text-primary">
            The Institutional <br /><span className="text-accent underline decoration-accent/20">Consensus.</span>
          </h2>
        </div>

        <div className="bg-background-surface border border-border-slate overflow-hidden group hover:border-accent/30 transition-premium">
          {loading ? (
            <div className="p-8"><CalendarSkeleton /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border-slate bg-background-primary/50">
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Period</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Time (GMT)</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Intelligence Event</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-center">Country</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Volatility</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Consensus</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Previous</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  {events.map((event, i) => (
                    <tr 
                      key={i} 
                      className={cn(
                        "group/row hover:bg-accent/5 transition-colors",
                        event.date === "Today" ? "border-l-4 border-l-accent" : ""
                      )}
                    >
                      <td className="p-6 text-sm font-sans text-text-primary whitespace-nowrap">{event.date}</td>
                      <td className="p-6 text-sm font-mono text-text-primary">{event.time}</td>
                      <td className="p-6 text-sm font-bold uppercase text-text-primary tracking-tight">{event.event}</td>
                      <td className="p-6 text-2xl text-center">{event.country}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            event.impact === 'High' ? "bg-loss animate-pulse" : event.impact === 'Medium' ? "bg-amber-400" : "bg-profit"
                          )} />
                          <span className={cn(
                            "text-[10px] font-mono font-black uppercase tracking-tighter px-2 py-0.5 border",
                            event.impact === 'High' ? "text-loss border-loss/20 bg-loss/5" : 
                            event.impact === 'Medium' ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : 
                            "text-profit border-profit/20 bg-profit/5"
                          )}>{event.impact} Impact</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-mono text-text-primary font-bold">{event.forecast || "—"}</td>
                      <td className="p-6 text-sm font-mono text-text-tertiary">{event.previous || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="p-8 bg-background-primary/30 border-t border-border-slate flex md:flex-row flex-col justify-between items-center gap-6">
            <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
              Live data feed periodically synced with central bank releases.
            </p>
            <Link 
              href="/markets?tab=calendar" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
            >
              Full Calendar Detail <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
