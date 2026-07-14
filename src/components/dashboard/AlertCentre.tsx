"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Mail,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ─── Alert preferences ────────────────────────────────────────────────────
// Stored in localStorage so they survive page refreshes without requiring a
// DB migration. A future user_alert_settings table can absorb these when
// cross-device persistence is needed.

const PREFS_KEY = "drawdown_alert_prefs";

interface AlertPrefs {
  emailOnTrigger: boolean;
  defaultDirection: "above" | "below";
}

const DEFAULT_PREFS: AlertPrefs = {
  emailOnTrigger: false,
  defaultDirection: "above",
};

function loadPrefs(): AlertPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: AlertPrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch { /* storage full or unavailable */ }
}

// ─── Types ────────────────────────────────────────────────────────────────

interface AlertItem {
  id: string;
  symbol: string;
  trigger_price: number;
  trigger_condition: "above" | "below";
  is_active: boolean;
  triggered_at: string | null;
}

// ─── Component ───────────────────────────────────────────────────────────

export function AlertCentre() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<AlertPrefs>(DEFAULT_PREFS);

  // Load prefs on mount (client-only)
  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const updatePref = <K extends keyof AlertPrefs>(key: K, value: AlertPrefs[K]) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    savePrefs(next);
  };

  // ── Alert data ───────────────────────────────────────────────────────────

  const fetchAlerts = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setAlerts(
          data.map((item: any) => ({
            id: item.id,
            symbol: item.symbol,
            trigger_price: Number(item.trigger_price),
            trigger_condition: item.trigger_condition,
            is_active: item.is_active,
            triggered_at: item.triggered_at,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll every 10 s — picks up triggered_at changes written by the
    // /api/cron/check-price-alerts cron job
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (alertId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);
      if (!error) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      }
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const activeCount = alerts.filter((a) => a.is_active && !a.triggered_at).length;
  const triggeredCount = alerts.filter((a) => a.triggered_at).length;

  return (
    <>
      <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 flex flex-col h-full group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">

        {/* Header */}
        <div className="p-6 border-b border-border-slate/50 flex items-center justify-between bg-background-elevated/20">
          <div className="flex items-center gap-3 text-accent">
            <Bell className="w-4 h-4" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">
              Signal_Centre_v2
            </h3>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 hover:bg-background-primary rounded transition-colors text-text-tertiary hover:text-text-primary"
            title="Alert notification settings"
            aria-label="Open alert settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Alert list */}
        <div className="flex-grow overflow-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 space-y-4 animate-pulse">
              <div className="h-10 bg-white/5 rounded" />
              <div className="h-10 bg-white/5 rounded" />
              <div className="h-10 bg-white/5 rounded" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <Bell className="w-6 h-6 text-text-tertiary mx-auto opacity-40" />
              <p className="text-[10px] font-mono uppercase text-text-tertiary">
                No alerts yet
              </p>
              <p className="text-[9px] text-text-tertiary/60 leading-relaxed uppercase">
                Use the Watchlist panel to add a symbol, then click the{" "}
                <Bell className="w-2.5 h-2.5 inline align-text-bottom" /> icon to set a
                price alert.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-slate/30">
              {alerts.map((alert) => {
                const status = alert.triggered_at
                  ? "triggered"
                  : alert.is_active
                  ? "active"
                  : "paused";

                return (
                  <div
                    key={alert.id}
                    className="p-5 space-y-3 hover:bg-background-elevated/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            status === "active"
                              ? "bg-profit animate-pulse"
                              : status === "triggered"
                              ? "bg-loss"
                              : "bg-text-tertiary"
                          )}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {alert.symbol}
                        </span>
                        {status === "triggered" && (
                          <span className="text-[7px] font-mono uppercase tracking-widest text-loss border border-loss/30 bg-loss/5 px-1.5 py-0.5">
                            Fired
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-text-tertiary hover:text-loss transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-background-primary/20 backdrop-blur-sm p-3 border border-border-slate/30">
                      <div className="flex items-center gap-2">
                        {alert.trigger_condition === "above"
                          ? <ArrowUp className="w-3 h-3 text-profit" />
                          : <ArrowDown className="w-3 h-3 text-loss" />
                        }
                        <span className="text-[9px] font-mono text-text-secondary uppercase">
                          {alert.trigger_condition === "above" ? "Crosses Above" : "Drops Below"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-text-primary">
                        {alert.trigger_price.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 5,
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                      <span>Status: {status}</span>
                      {alert.triggered_at && (
                        <span className="text-loss flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {new Date(alert.triggered_at).toLocaleTimeString("en-GB")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-accent/5 border-t border-border-slate">
          <div className="flex items-center gap-3 text-accent mb-2">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
              {activeCount > 0 ? "Active Monitoring" : "No Alerts Active"}
            </span>
          </div>
          <p className="text-[9px] text-text-secondary leading-relaxed uppercase opacity-70">
            {activeCount > 0
              ? `Monitoring ${activeCount} active alert${activeCount !== 1 ? "s" : ""}.${
                  triggeredCount > 0 ? ` ${triggeredCount} triggered.` : ""
                }`
              : alerts.length > 0
              ? "All alerts are triggered or paused."
              : "Set a price alert from the Watchlist panel above."}
          </p>
        </div>
      </div>

      {/* ── Settings Modal ──────────────────────────────────────────────────── */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-background-surface border border-border-slate w-full max-w-sm shadow-2xl shadow-black/50">

            {/* Modal header */}
            <div className="p-6 border-b border-border-slate flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-display font-bold uppercase tracking-tight">
                  Alert Settings
                </h3>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Email on trigger */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                      <p className="text-xs font-bold uppercase tracking-widest text-text-primary">
                        Email on Trigger
                      </p>
                    </div>
                    <p className="text-[9px] text-text-tertiary leading-relaxed">
                      Send an email when a price alert condition is met.
                    </p>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => updatePref("emailOnTrigger", !prefs.emailOnTrigger)}
                    className={cn(
                      "relative shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none",
                      prefs.emailOnTrigger ? "bg-accent" : "bg-background-elevated border border-border-slate"
                    )}
                    role="switch"
                    aria-checked={prefs.emailOnTrigger}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                        prefs.emailOnTrigger ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="border-t border-border-slate/50" />

              {/* Default direction */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                  <p className="text-xs font-bold uppercase tracking-widest text-text-primary">
                    Default Direction
                  </p>
                </div>
                <p className="text-[9px] text-text-tertiary leading-relaxed">
                  Pre-selected direction when you open the alert modal.
                </p>
                <div className="flex border border-border-slate overflow-hidden">
                  <button
                    onClick={() => updatePref("defaultDirection", "above")}
                    className={cn(
                      "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                      prefs.defaultDirection === "above"
                        ? "bg-profit/20 text-profit"
                        : "bg-background-elevated text-text-tertiary hover:bg-background-elevated/80"
                    )}
                  >
                    <ArrowUp className="w-3 h-3" /> Above
                  </button>
                  <button
                    onClick={() => updatePref("defaultDirection", "below")}
                    className={cn(
                      "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border-l border-border-slate",
                      prefs.defaultDirection === "below"
                        ? "bg-loss/20 text-loss"
                        : "bg-background-elevated text-text-tertiary hover:bg-background-elevated/80"
                    )}
                  >
                    <ArrowDown className="w-3 h-3" /> Below
                  </button>
                </div>
              </div>

              <div className="border-t border-border-slate/50" />

              {/* Push status — honest note */}
              <div className="flex gap-3 p-4 bg-background-elevated/40 border border-border-slate/30">
                <Info className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-primary">
                    Push Notifications
                  </p>
                  <p className="text-[9px] text-text-tertiary leading-relaxed">
                    Mobile push is in development and not yet active. Alerts
                    currently fire as in-app notifications and optionally email.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border-slate bg-background-elevated/10">
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-full py-3 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
