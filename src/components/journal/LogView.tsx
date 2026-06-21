"use client";

import React, { useState, useMemo } from "react";
import { Eye, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { TradeEntry } from "./types";
import { cn } from "@/lib/utils";

type SortKey = "trading_day" | "symbol" | "direction" | "entry_price" | "exit_price" | "position_size_lots" | "risk_percent" | "pnl_amount" | "rr_achieved" | "setup_type";

function ResultPill({ trade }: { trade: TradeEntry }) {
  if (trade.status === "OPEN") return <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-amber-100 text-amber-700">OPEN</span>;
  if (trade.status === "CANCELLED") return <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-gray-100 text-gray-500">CANCELLED</span>;
  const pnl = trade.pnl_amount ?? 0;
  if (Math.abs(pnl) < 0.5) return <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-gray-100 text-gray-600">BE</span>;
  if (pnl > 0) return <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-green-100 text-green-700">WIN</span>;
  return <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-red-100 text-red-700">LOSS</span>;
}

export function LogView({ trades, onSelectTrade }: { trades: TradeEntry[]; onSelectTrade: (t: TradeEntry) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("trading_day");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = useMemo(() => {
    return [...trades].sort((a, b) => {
      let av: any = a[sortKey], bv: any = b[sortKey];
      if (av == null) av = sortDir === "desc" ? -Infinity : Infinity;
      if (bv == null) bv = sortDir === "desc" ? -Infinity : Infinity;
      if (typeof av === "string" && typeof bv === "string") return sortDir === "desc" ? bv.localeCompare(av) : av.localeCompare(bv);
      return sortDir === "desc" ? (bv as number) - (av as number) : (av as number) - (bv as number);
    });
  }, [trades, sortKey, sortDir]);

  function Th({ label, sortable, col }: { label: string; sortable?: boolean; col?: SortKey }) {
    const active = col && sortKey === col;
    return (
      <th
        className={cn("pb-3 pr-4 text-left text-[9px] font-black uppercase tracking-widest whitespace-nowrap select-none",
          sortable ? "cursor-pointer hover:text-black transition-colors" : "",
          active ? "text-black" : "text-gray-400")}
        onClick={() => col && sortable && toggleSort(col)}
      >
        <span className="flex items-center gap-1">
          {label}
          {sortable && col && (
            active
              ? sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
              : <ChevronDown className="w-3 h-3 opacity-20" />
          )}
        </span>
      </th>
    );
  }

  const totalPnL = trades.filter(t => t.status === "CLOSED").reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
  const closed = trades.filter(t => t.status === "CLOSED");
  const wins = closed.filter(t => (t.pnl_amount ?? 0) > 0).length;
  const wr = closed.length ? ((wins / closed.length) * 100).toFixed(0) : null;

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Delete this trade? This cannot be undone.")) return;
    await fetch(`/api/journal/trade-entries/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="text-5xl mb-3">📋</div>
        <h3 className="text-base font-black text-black mb-1">No Trades Found</h3>
        <p className="text-xs text-gray-400">Log your first trade to see it in the log.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <Th label="Date" sortable col="trading_day" />
              <Th label="Symbol" sortable col="symbol" />
              <Th label="Dir" sortable col="direction" />
              <Th label="Entry" sortable col="entry_price" />
              <Th label="Exit" sortable col="exit_price" />
              <Th label="Size" sortable col="position_size_lots" />
              <Th label="Risk%" sortable col="risk_percent" />
              <Th label="P&L" sortable col="pnl_amount" />
              <Th label="RR" sortable col="rr_achieved" />
              <Th label="Setup" sortable col="setup_type" />
              <Th label="Result" />
              <Th label="" />
            </tr>
          </thead>
          <tbody>
            {sorted.map(t => {
              const hasRR = t.rr_achieved != null || t.rr_planned != null;
              return (
                <tr key={t.id}
                  onClick={() => onSelectTrade(t)}
                  className="border-b border-gray-50 hover:bg-[#00e5cc]/5 cursor-pointer transition-colors group">
                  <td className="py-3 pr-4 pl-4">
                    <div className="text-[10px] font-bold text-black">{new Date(t.trading_day + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
                    <div className="text-[9px] text-gray-400">{new Date(t.entry_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td className="py-3 pr-4 font-bold text-black text-xs">{t.symbol}</td>
                  <td className="py-3 pr-4">
                    <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded",
                      t.direction === "BUY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs font-mono text-gray-700">{t.entry_price.toFixed(5)}</td>
                  <td className="py-3 pr-4 text-xs font-mono text-gray-700">{t.exit_price?.toFixed(5) ?? "—"}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600">{t.position_size_lots}L</td>
                  <td className="py-3 pr-4 text-xs text-gray-600">{t.risk_percent?.toFixed(1) ?? "—"}%</td>
                  <td className="py-3 pr-4 text-xs font-bold">
                    {t.pnl_amount != null
                      ? <span className={t.pnl_amount >= 0 ? "text-green-600" : "text-red-600"}>{t.pnl_amount >= 0 ? "+" : ""}£{Math.abs(t.pnl_amount).toFixed(0)}</span>
                      : "—"}
                  </td>
                  <td className="py-3 pr-4 text-xs font-mono text-gray-600">
                    {hasRR
                      ? t.rr_achieved != null
                        ? `${t.rr_achieved.toFixed(2)}:1`
                        : `${t.rr_planned?.toFixed(2)}:1*`
                      : "—"}
                  </td>
                  <td className="py-3 pr-4 text-[10px] text-gray-500">{t.setup_type ?? "—"}</td>
                  <td className="py-3 pr-4"><ResultPill trade={t} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); onSelectTrade(t); }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => handleDelete(e, t.id)}
                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-[10px] text-gray-500">
        <span>Showing <strong className="text-black">{trades.length}</strong> trades</span>
        <span>Total P&L: <strong className={totalPnL >= 0 ? "text-green-600" : "text-red-600"}>{totalPnL >= 0 ? "+" : ""}£{Math.abs(totalPnL).toFixed(0)}</strong></span>
        {wr && <span>Win Rate: <strong className="text-black">{wr}%</strong></span>}
      </div>
    </div>
  );
}
