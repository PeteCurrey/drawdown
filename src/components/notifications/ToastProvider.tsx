"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X, AlertTriangle, TrendingUp, TrendingDown, Newspaper, Bell } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = "signal-bullish" | "signal-bearish" | "news" | "brief" | "alert" | "high-conviction";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  body: string;
  timestamp: Date;
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ToastCtx {
  addToast: (t: Omit<Toast, "id" | "timestamp">) => void;
}

const ToastContext = createContext<ToastCtx>({ addToast: () => {} });
export const useToast = () => useContext(ToastContext);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, "id" | "timestamp">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [{ ...t, id, timestamp: new Date() }, ...prev].slice(0, 5));
    // Auto-dismiss after 8 s
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 8000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast stack — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Individual Toast Card ────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { icon: any; accent: string; label: string }> = {
  "signal-bullish":  { icon: TrendingUp,    accent: "border-l-emerald-500 bg-emerald-50",  label: "New Signal" },
  "signal-bearish":  { icon: TrendingDown,  accent: "border-l-red-500 bg-red-50",          label: "New Signal" },
  "news":            { icon: Newspaper,     accent: "border-l-blue-500 bg-blue-50",        label: "Breaking News" },
  "brief":           { icon: Bell,          accent: "border-l-teal-500 bg-teal-50",        label: "Intelligence Brief" },
  "alert":           { icon: AlertTriangle, accent: "border-l-amber-500 bg-amber-50",      label: "Market Alert" },
  "high-conviction": { icon: TrendingUp,    accent: "border-l-orange-500 bg-orange-50",    label: "High-Conviction Signal" },
};

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const cfg = TOAST_CONFIG[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    // Animate in on next tick
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto w-[320px] rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-l-4 p-4 flex gap-3 items-start",
        cfg.accent,
        "transition-all duration-300",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      )}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-0.5">{cfg.label}</p>
        <p className="text-xs font-bold text-gray-900 leading-snug">{toast.title}</p>
        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{toast.body}</p>
        <p className="text-[9px] font-mono text-gray-300 mt-1.5">
          {toast.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-gray-300 hover:text-gray-600 transition-colors mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
