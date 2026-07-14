"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TradeEntry } from "./types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getISOWeek(d: Date): string {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `W${String(weekNo).padStart(2, "0")}`;
}

export function CalendarView({ trades, onSelectTrade }: { trades: TradeEntry[]; onSelectTrade: (t: TradeEntry) => void }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(); d.setDate(1); return d;
  });
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Build day map
  const dayMap = useMemo(() => {
    const map: Record<string, TradeEntry[]> = {};
    trades.forEach(t => {
      const day = t.trading_day;
      if (!map[day]) map[day] = [];
      map[day].push(t);
    });
    return map;
  }, [trades]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    // Monday-first: (getDay() + 6) % 7
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) return null;
      const d = new Date(year, month, dayNum);
      return isoDate(d);
    });
  }, [currentMonth]);

  // Weekly P&L chart
  const weeklyData = useMemo(() => {
    const map: Record<string, { pnl: number; week: string }> = {};
    trades.filter(t => t.status === "CLOSED").forEach(t => {
      const d = new Date(t.trading_day);
      const monday = getMonday(d);
      const key = isoDate(monday);
      const week = getISOWeek(d);
      if (!map[key]) map[key] = { pnl: 0, week };
      map[key].pnl += t.pnl_amount ?? 0;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([, v]) => v);
  }, [trades]);

  const today = isoDate(new Date());
  const monthLabel = currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  function DayCell({ dateStr }: { dateStr: string }) {
    const dayTrades = dayMap[dateStr] ?? [];
    const pnl = dayTrades.filter(t => t.status === "CLOSED").reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
    const hasTrades = dayTrades.length > 0;
    const isToday = dateStr === today;
    const isExpanded = expandedDay === dateStr;
    const wins  = dayTrades.filter(t => (t.pnl_amount ?? 0) > 0).length;
    const losses = dayTrades.filter(t => (t.pnl_amount ?? 0) < 0).length;
    const bes   = dayTrades.filter(t => t.status === "CLOSED" && Math.abs(t.pnl_amount ?? 0) < 0.5).length;

    return (
      <div
        className={cn(
          "min-h-[100px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-all select-none",
          hasTrades ? "hover:border-[var(--tool-accent-border)] hover:shadow-sm" : "hover:bg-gray-50",
          isToday ? "ring-2 ring-[var(--tool-accent)] border-[var(--tool-accent-border)]" : "",
          isExpanded ? "bg-[var(--tool-accent-tint)] border-[var(--tool-accent-border)]" : "bg-white",
        )}
        onClick={() => setExpandedDay(isExpanded ? null : dateStr)}
      >
        <div className="flex items-start justify-between">
          <span className={cn("text-xs font-bold", isToday ? "text-[var(--tool-accent-text)]" : "text-gray-700")}>
            {parseInt(dateStr.split("-")[2])}
          </span>
          {hasTrades && (
            <span className={cn("text-[9px] font-black", pnl > 0 ? "text-green-600" : pnl < 0 ? "text-red-600" : "text-gray-400")}>
              {pnl > 0 ? "+" : ""}{pnl !== 0 ? `£${Math.abs(pnl).toFixed(0)}` : "BE"}
            </span>
          )}
        </div>
        {hasTrades && (
          <>
            <p className="text-[9px] text-gray-400 mt-0.5">{dayTrades.length} trade{dayTrades.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-0.5 mt-1 flex-wrap">
              {Array.from({ length: wins }).map((_, i) => <span key={`w${i}`} className="w-2 h-2 rounded-full bg-green-500 inline-block" />)}
              {Array.from({ length: losses }).map((_, i) => <span key={`l${i}`} className="w-2 h-2 rounded-full bg-red-500 inline-block" />)}
              {Array.from({ length: bes }).map((_, i) => <span key={`b${i}`} className="w-2 h-2 rounded-full bg-gray-300 inline-block" />)}
            </div>
          </>
        )}
      </div>
    );
  }

  // Inject expanded day row after the row that contains the expanded day
  const rows: Array<Array<string | null>> = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  const expandedRowIndex = expandedDay
    ? rows.findIndex(row => row.includes(expandedDay))
    : -1;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-black">{monthLabel}</h3>
        <div className="flex gap-2">
          <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d); setExpandedDay(null); }}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d); setExpandedDay(null); }}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Day of week headers ── */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(d => <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest text-gray-400 py-1">{d}</div>)}
      </div>

      {/* ── Calendar grid + inline expanded ── */}
      <div className="space-y-1">
        {rows.map((row, rowIdx) => (
          <React.Fragment key={rowIdx}>
            <div className="grid grid-cols-7 gap-1">
              {row.map((dateStr, cellIdx) =>
                dateStr ? (
                  <DayCell key={dateStr} dateStr={dateStr} />
                ) : (
                  <div key={cellIdx} className="min-h-[100px] rounded-lg bg-gray-50/50" />
                )
              )}
            </div>
            {/* Expanded day panel */}
            {expandedRowIndex === rowIdx && expandedDay && dayMap[expandedDay] && (
              <div className="bg-white border border-[var(--tool-accent-border)] rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <h4 className="text-xs font-black text-black mb-3">
                  {new Date(expandedDay + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </h4>
                <div className="space-y-2">
                  {dayMap[expandedDay].map(t => {
                    const pnl = t.pnl_amount;
                    return (
                      <div key={t.id}
                        onClick={() => onSelectTrade(t)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[var(--tool-accent-border)] hover:bg-[var(--tool-accent-tint)] cursor-pointer transition-all">
                        <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-full",
                          t.direction === "BUY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {t.direction}
                        </span>
                        <span className="font-bold text-sm text-black">{t.symbol}</span>
                        {t.setup_type && <span className="text-[10px] text-gray-400">{t.setup_type}</span>}
                        <div className="ml-auto flex items-center gap-2">
                          {pnl != null ? (
                            <span className={cn("text-sm font-black", pnl > 0 ? "text-green-600" : pnl < 0 ? "text-red-600" : "text-gray-400")}>
                              {pnl > 0 ? "+" : ""}£{Math.abs(pnl).toFixed(0)}
                            </span>
                          ) : <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">OPEN</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Weekly P&L bar chart ── */}
      {weeklyData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Weekly P&L Summary</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`£${v.toFixed(0)}`, "P&L"]} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {weeklyData.map((d, i) => <Cell key={i} fill={d.pnl >= 0 ? "#16a34a" : "#dc2626"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {trades.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="text-5xl mb-3">📅</div>
          <h3 className="text-base font-black text-black mb-1">No Trades This Month</h3>
          <p className="text-xs text-gray-400">Log your first trade to see it appear on the calendar.</p>
        </div>
      )}
    </div>
  );
}
