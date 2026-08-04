"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Check, ShieldCheck, Sliders } from "lucide-react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  version: string;
  timestamp: string;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  version: "1.0",
  timestamp: "",
};

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check stored consent
    const stored = localStorage.getItem("drawdown_cookie_consent");
    if (!stored) {
      setIsVisible(true);
    } else {
      try {
        setPreferences(JSON.parse(stored));
      } catch {}
    }

    // Listen for custom trigger from footer "Cookie Settings" link
    const handleOpenSettings = () => {
      setShowModal(true);
    };

    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const updated: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      version: "1.0",
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("drawdown_cookie_consent", JSON.stringify(updated));
    setPreferences(updated);
    setIsVisible(false);
    setShowModal(false);

    // Dispatch global event for analytics script loaders
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: updated }));
  };

  if (!isVisible && !showModal) return null;

  return (
    <>
      {/* Initial Bottom Banner */}
      {isVisible && !showModal && (
        <div 
          className="fixed bottom-0 inset-x-0 z-[999] p-4 sm:p-6 border-t shadow-2xl transition-all duration-300"
          style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}
        >
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                <Cookie size={16} />
                <span>Cookie Privacy Preferences</span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                We use essential cookies to maintain your login session and security. With your consent, we also use performance analytics cookies to improve our platform. Non-essential cookies are blocked by default until accepted. Read our{" "}
                <Link href="/cookies" className="text-accent underline">Cookie Policy</Link> and{" "}
                <Link href="/privacy" className="text-accent underline">Privacy Policy</Link>.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => saveConsent(true, true)}
                className="px-4 py-2.5 text-[12px] font-mono font-bold uppercase tracking-[0.05em] transition-colors border"
                style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent(false, false)}
                className="px-4 py-2.5 text-[12px] font-mono font-bold uppercase tracking-[0.05em] transition-colors border"
                style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2.5 text-[12px] font-mono uppercase tracking-[0.05em] underline flex items-center gap-1"
                style={{ color: "var(--graphite-600)" }}
              >
                <Sliders size={14} /> Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-xl p-6 sm:p-8 border space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="font-display text-[22px] font-semibold">Cookie Preferences</h3>
              <p className="text-[13px]" style={{ color: "var(--graphite-600)" }}>
                Manage your granular consent settings. Changes will be saved to your device.
              </p>
            </div>

            <div className="space-y-4 text-[13px]">
              {/* Essential */}
              <div className="p-4 border space-y-1" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <div className="flex items-center justify-between font-mono font-bold uppercase tracking-[0.05em]">
                  <span>Strictly Essential</span>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200">Always Active</span>
                </div>
                <p style={{ color: "var(--graphite-600)" }}>
                  Required for core authentication, security, and storing your consent preferences. Cannot be disabled.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-4 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <div className="flex items-center justify-between font-mono font-bold uppercase tracking-[0.05em]">
                  <span>Performance &amp; Analytics</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
                <p style={{ color: "var(--graphite-600)" }}>
                  Helps us understand aggregated platform usage and route performance. No personal identification data is sold.
                </p>
              </div>

              {/* Marketing */}
              <div className="p-4 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <div className="flex items-center justify-between font-mono font-bold uppercase tracking-[0.05em]">
                  <span>Marketing &amp; Attribution</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
                <p style={{ color: "var(--graphite-600)" }}>
                  Used to track affiliate referral performance and measure campaign effectiveness.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--line-200)" }}>
              <button
                onClick={() => saveConsent(preferences.analytics, preferences.marketing)}
                className="px-5 py-2.5 text-[12px] font-mono font-bold uppercase tracking-[0.05em] border transition-colors"
                style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
