"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  Bell,
  Search,
  Activity,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
  ChevronDown,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  searchSymbols,
  findSymbol,
  CATEGORY_LABELS,
  type CuratedSymbol,
} from "@/lib/symbols";

// ─── Types ────────────────────────────────────────────────────────────────

interface WatchlistItem {
  id: string;
  symbol: string;     // stored as displayPair, e.g. "XAU/USD"
  alerts_enabled: boolean;
  current_price?: number;
  change_percent?: number;
}

// ─── Component ───────────────────────────────────────────────────────────

export const WatchlistManager = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CuratedSymbol[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [alertingItem, setAlertingItem] = useState<WatchlistItem | null>(null);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  const supabase = createClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchActiveAlerts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await (supabase as any)
      .from("price_alerts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);
    setActiveAlerts(data || []);
  }, [supabase]);

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await (supabase as any)
        .from("user_watchlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const symbols = (data as any[]).map((item) => item.symbol);
        try {
          const priceRes = await fetch(`/api/market/prices?symbols=${symbols.join(",")}`);
          const prices = await priceRes.json();
          const combined = (data as any[]).map((item) => {
            const priceData = Array.isArray(prices)
              ? prices.find((p: any) => p.symbol === item.symbol)
              : null;
            return {
              ...item,
              current_price: priceData?.price,
              change_percent: priceData?.changePercent,
            };
          });
          setWatchlist(combined);
        } catch {
          // Price fetch failed — show watchlist without prices
          setWatchlist(data as any[]);
        }
      } else {
        setWatchlist([]);
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchWatchlist();
    fetchActiveAlerts();
  }, [fetchWatchlist, fetchActiveAlerts]);

  // ── Search / autocomplete ────────────────────────────────────────────────

  // Debounce search — 200ms to feel instant without hammering on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed.length < 1) {
        setResults([]);
        setDropdownOpen(false);
        return;
      }
      const found = searchSymbols(trimmed, 8);
      setResults(found);
      setFocusedIndex(-1);
      setDropdownOpen(found.length > 0 || trimmed.length > 0);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Watchlist mutations ──────────────────────────────────────────────────

  const addSymbol = useCallback(async (symbol: string) => {
    if (!symbol.trim()) return;
    const normalised = symbol.trim().toUpperCase();

    // Prevent duplicates
    if (watchlist.some((i) => i.symbol.toUpperCase() === normalised)) {
      setQuery("");
      setDropdownOpen(false);
      return;
    }

    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase as any)
        .from("user_watchlists")
        .insert({ user_id: user.id, symbol: normalised, alerts_enabled: true });

      if (error) throw error;
      setQuery("");
      setDropdownOpen(false);
      fetchWatchlist();
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    } finally {
      setAdding(false);
    }
  }, [supabase, watchlist, fetchWatchlist]);

  const removeFromWatchlist = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("user_watchlists")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    }
  };

  const savePriceAlert = async () => {
    if (!alertingItem || !alertPrice) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await (supabase as any)
        .from("price_alerts")
        .insert({
          user_id: user.id,
          symbol: alertingItem.symbol,
          trigger_price: parseFloat(alertPrice),
          trigger_condition: alertCondition,
        });
      if (error) throw error;
      setAlertingItem(null);
      setAlertPrice("");
      fetchActiveAlerts();
    } catch (err) {
      console.error("Error saving alert:", err);
    }
  };

  // ── Keyboard navigation ──────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen) {
      if (e.key === "Enter") { addSymbol(query); return; }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && results[focusedIndex]) {
          addSymbol(results[focusedIndex].displayPair);
        } else {
          addSymbol(query);
        }
        break;
      case "Escape":
        setDropdownOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Search input + autocomplete dropdown */}
      <div className="relative">
        <div className="flex gap-2">
          {/* Input */}
          <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-background-surface border border-border-slate focus-within:border-accent transition-colors">
            <Search className="w-4 h-4 text-text-tertiary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder='SEARCH SYMBOL OR NAME (E.G. "GOLD", "CABLE")…'
              className="bg-transparent border-none outline-none font-mono text-[10px] uppercase tracking-widest text-text-primary w-full placeholder-text-tertiary/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (results.length > 0) setDropdownOpen(true);
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setDropdownOpen(false); }}
                className="text-text-tertiary hover:text-text-primary transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* + button — fallback for exact-ticker entry */}
          <button
            onClick={() => addSymbol(query)}
            disabled={adding || !query.trim()}
            className="p-3 bg-accent text-background-primary disabled:opacity-40 hover:bg-accent-hover transition-colors"
            title="Add exact ticker"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-10 z-50 bg-background-surface border border-border-slate shadow-2xl shadow-black/40 divide-y divide-border-slate/30 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {results.length === 0 ? (
              /* No matches */
              <div className="px-4 py-4 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-text-tertiary shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                    No matches for &quot;{query}&quot;
                  </p>
                  <p className="text-[9px] text-text-tertiary/60 mt-0.5">
                    Press Enter or + to add as a raw ticker.
                  </p>
                </div>
              </div>
            ) : (
              results.map((sym, idx) => {
                const isFocused = idx === focusedIndex;
                return (
                  <button
                    key={sym.displayPair}
                    onMouseDown={(e) => {
                      // mousedown fires before blur — prevent closing before click registers
                      e.preventDefault();
                      addSymbol(sym.displayPair);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                      isFocused
                        ? "bg-accent/10 text-text-primary"
                        : "hover:bg-background-elevated/40 text-text-secondary"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-primary truncate">
                          {sym.displayPair}
                        </p>
                        <p className="text-[9px] text-text-tertiary truncate">
                          {sym.name}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border shrink-0 ml-2",
                      sym.category === "forex-major" && "border-accent/30 text-accent bg-accent/5",
                      sym.category === "forex-minor" && "border-accent/20 text-accent/70 bg-accent/3",
                      sym.category === "metals" && "border-yellow-500/30 text-yellow-500/80 bg-yellow-500/5",
                      sym.category === "energy" && "border-orange-500/30 text-orange-500/80 bg-orange-500/5",
                      sym.category === "indices" && "border-purple-500/30 text-purple-500/80 bg-purple-500/5",
                      sym.category === "crypto" && "border-blue-500/30 text-blue-500/80 bg-blue-500/5",
                    )}>
                      {CATEGORY_LABELS[sym.category]}
                    </span>
                  </button>
                );
              })
            )}

            {/* Hint row */}
            <div className="px-4 py-2 flex items-center gap-4 bg-background-elevated/20">
              <span className="text-[8px] font-mono text-text-tertiary/50 uppercase tracking-widest">
                ↑ ↓ navigate · Enter select · Esc close
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Watchlist items */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-20 text-center animate-pulse border border-dashed border-border-slate">
            <Activity className="w-6 h-6 text-text-tertiary mx-auto mb-4 animate-spin" />
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">
              Syncing with live markets...
            </p>
          </div>
        ) : watchlist.length > 0 ? (
          watchlist.map((item) => {
            const meta = findSymbol(item.symbol);
            const itemAlerts = activeAlerts.filter((a) => a.symbol === item.symbol);
            const hasPrice = typeof item.current_price === "number" && !isNaN(item.current_price);
            const pct = item.change_percent ?? 0;

            return (
              <div
                key={item.id}
                className="group bg-background-surface border border-border-slate p-5 hover:border-accent/40 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-display font-bold uppercase">
                        {item.symbol}
                      </h3>
                      {meta && (
                        <span className="text-[7px] font-mono uppercase tracking-widest text-text-tertiary border border-border-slate/40 px-1.5 py-0.5">
                          {CATEGORY_LABELS[meta.category]}
                        </span>
                      )}
                    </div>
                    {meta && (
                      <p className="text-[9px] text-text-tertiary truncate">{meta.name}</p>
                    )}
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
                      {hasPrice ? (
                        <>
                          <span className="text-text-primary font-bold">
                            {item.current_price!.toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 5,
                            })}
                          </span>
                          <span className={cn("font-bold", pct >= 0 ? "text-profit" : "text-loss")}>
                            {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
                          </span>
                        </>
                      ) : (
                        <span className="text-text-tertiary">Live price unavailable</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Active alert badges */}
                    <div className="flex flex-col items-end gap-1">
                      {itemAlerts.slice(0, 2).map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center gap-1 text-[7px] font-mono font-bold uppercase text-accent bg-accent/10 px-1.5 py-0.5 border border-accent/20"
                        >
                          {alert.trigger_condition === "above"
                            ? <ArrowUp className="w-2 h-2" />
                            : <ArrowDown className="w-2 h-2" />
                          }
                          {Number(alert.trigger_price).toLocaleString("en-GB", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 5,
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Bell — open price alert modal */}
                    <button
                      onClick={() => {
                        setAlertingItem(item);
                        setAlertPrice(
                          hasPrice
                            ? item.current_price!.toFixed(
                                item.current_price! > 100 ? 2 : 4
                              )
                            : ""
                        );
                      }}
                      className="p-2 bg-background-elevated border border-border-slate text-text-tertiary hover:text-accent hover:border-accent transition-colors"
                      title={`Set price alert on ${item.symbol}`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="p-2 bg-background-elevated border border-border-slate text-text-tertiary hover:text-loss hover:border-loss transition-colors"
                      title={`Remove ${item.symbol} from watchlist`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-16 text-center border border-dashed border-border-slate space-y-3">
            <Zap className="w-6 h-6 text-text-tertiary mx-auto opacity-40" />
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">
              Your watchlist is empty.
            </p>
            <p className="text-[9px] text-text-tertiary/60">
              Try searching &quot;gold&quot;, &quot;cable&quot;, or &quot;nasdaq&quot; above.
            </p>
          </div>
        )}
      </div>

      {/* Price alert modal */}
      {alertingItem && (
        <div className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-background-surface border border-border-slate w-full max-w-sm p-8 space-y-8 shadow-2xl shadow-black/50 relative">
            <button
              onClick={() => setAlertingItem(null)}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent mb-1">
                <Bell className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono uppercase tracking-widest">Signal_Centre_v2</span>
              </div>
              <h3 className="text-2xl font-display font-bold uppercase tracking-tight">
                Set Price Alert
              </h3>
              <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">
                {alertingItem.symbol}
                {typeof alertingItem.current_price === "number" && !isNaN(alertingItem.current_price)
                  ? ` // Current: ${alertingItem.current_price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`
                  : ""}
              </p>
            </div>

            <div className="space-y-6">
              {/* Above / Below toggle */}
              <div className="flex border border-border-slate overflow-hidden">
                <button
                  onClick={() => setAlertCondition("above")}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                    alertCondition === "above"
                      ? "bg-profit/20 text-profit border-r border-profit/30"
                      : "bg-background-elevated text-text-tertiary border-r border-border-slate hover:bg-background-elevated/80"
                  )}
                >
                  <ArrowUp className="w-3 h-3" /> Crosses Above
                </button>
                <button
                  onClick={() => setAlertCondition("below")}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                    alertCondition === "below"
                      ? "bg-loss/20 text-loss"
                      : "bg-background-elevated text-text-tertiary hover:bg-background-elevated/80"
                  )}
                >
                  <ArrowDown className="w-3 h-3" /> Drops Below
                </button>
              </div>

              {/* Trigger price */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  Trigger Price
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-background-elevated border border-border-slate p-4 text-xl font-display font-bold focus:border-accent outline-none transition-colors"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <button
                onClick={savePriceAlert}
                disabled={!alertPrice || isNaN(parseFloat(alertPrice))}
                className="w-full py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors shadow-lg disabled:opacity-40"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
