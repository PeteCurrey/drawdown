"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";

export function Footer() {
  const { region } = useRegion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Subscribed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Error subscribing.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe.");
    }
  };

  return (
    <footer
      className="py-16 md:py-24 select-none relative z-10 border-t"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">

        {/* 5 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Column 1: Brand + Newsletter */}
          <div className="space-y-6">
            <Link
              href={region === "uk" ? "/" : `/${region}`}
              className="font-display text-[20px] font-semibold tracking-[-0.02em] block"
              style={{ color: "var(--ink-950)" }}
            >
              Drawdown
            </Link>
            <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
              Trading education for independent traders who value truth over hype. No shortcuts. Just data.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full p-3 text-[12px] font-mono border outline-none font-sans"
                  style={{
                    backgroundColor: "var(--paper-100)",
                    borderColor: "var(--line-200)",
                    color: "var(--ink-950)",
                    borderRadius: 0,
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="px-4 py-3 border border-l-0 text-[12px] font-medium transition-colors shrink-0"
                  style={{
                    backgroundColor: "var(--signal-navy)",
                    borderColor: "var(--signal-navy)",
                    color: "#FAFAF9",
                    borderRadius: 0,
                  }}
                >
                  {status === "success" ? <Check size={14} strokeWidth={1.5} /> : <ArrowRight size={14} strokeWidth={1.5} />}
                </button>
              </div>
              {message && (
                <p className="text-[11px] font-mono" style={{ color: status === "error" ? "var(--risk-amber)" : "var(--graphite-600)" }}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.08em] mb-4" style={{ color: "var(--ink-950)" }}>
              Platform
            </h4>
            <ul className="space-y-3 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
              <li><Link href={`${regionPrefix}/courses`} className="hover:underline">Curriculum</Link></li>
              <li><Link href={`${regionPrefix}/markets`} className="hover:underline">Markets Hub</Link></li>
              <li><Link href={`${regionPrefix}/brokers`} className="hover:underline">Broker Guide</Link></li>
              <li><Link href={`${regionPrefix}/tools`} className="hover:underline">Trading Tools</Link></li>
              <li><Link href={`${regionPrefix}/pricing`} className="hover:underline">Pricing</Link></li>
              <li><Link href={`${regionPrefix}/blog`} className="hover:underline">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.08em] mb-4" style={{ color: "var(--ink-950)" }}>
              Learn
            </h4>
            <ul className="space-y-3 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
              <li><Link href={`${regionPrefix}/learn-to-trade/day-trading`} className="hover:underline">Day Trading</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade/forex-trading`} className="hover:underline">Forex Mastery</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade/risk-management`} className="hover:underline">Risk Management</Link></li>
              <li><Link href={`${regionPrefix}/learn-to-trade`} className="hover:underline">Educational Hub</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources (includes Prop Firms reachability) */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.08em] mb-4" style={{ color: "var(--ink-950)" }}>
              Resources
            </h4>
            <ul className="space-y-3 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
              <li><Link href="/prop-firms" className="hover:underline font-medium" style={{ color: "var(--ink-950)" }}>Prop Firms Hub</Link></li>
              <li><Link href="/basic" className="hover:underline">Trading Basics</Link></li>
              <li><Link href="/glossary" className="hover:underline">Glossary</Link></li>
              <li><Link href="/how-to" className="hover:underline">How-To Guides</Link></li>
              <li><Link href="/compare" className="hover:underline">Compare Brokers</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.08em] mb-4" style={{ color: "var(--ink-950)" }}>
              Company
            </h4>
            <ul className="space-y-3 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:underline">Risk Disclaimer</Link></li>
              <li><Link href="/legal/financial-disclaimer" className="hover:underline">Legal &amp; Tax Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip: copyright left, risk warning right */}
        <div className="border-t pt-8 flex flex-col lg:flex-row justify-between items-start gap-8" style={{ borderColor: "var(--line-200)" }}>

          {/* Copyright & Region Links */}
          <div className="space-y-3 shrink-0">
            <p className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              © 2026 Drawdown Trading Ltd · Chesterfield, Derbyshire, UK
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              <span className="select-none">Region:</span>
              {[
                { id: "uk", label: "UK", href: "/" },
                { id: "au", label: "AU", href: "/au" },
                { id: "us", label: "US", href: "/us" },
                { id: "sg", label: "SG", href: "/sg" },
                { id: "hk", label: "HK", href: "/hk" },
              ].map((reg) => (
                <Link
                  key={reg.id}
                  href={reg.href}
                  className="hover:underline"
                  style={{
                    color: region === reg.id || (region === "uk" && reg.id === "uk") ? "var(--ink-950)" : "var(--graphite-600)",
                    fontWeight: region === reg.id || (region === "uk" && reg.id === "uk") ? 600 : 400,
                  }}
                >
                  {reg.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Risk Warning — --risk-amber reserved EXCLUSIVELY for risk disclosures */}
          <div className="space-y-2 max-w-2xl font-sans">
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--risk-amber)" }}>
              <span className="font-semibold block mb-0.5 font-mono uppercase tracking-[0.08em]">Risk Warning:</span>
              Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment. You should not invest money that you cannot afford to lose. Past performance is not indicative of future results. Drawdown does not provide financial advice. Trade signals and quantitative tools represent analytical conclusions derived from data feeds and risk parameters; they are not guaranteed outcomes or financial recommendations.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
