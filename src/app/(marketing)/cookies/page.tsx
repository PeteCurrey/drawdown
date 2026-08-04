import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { Cookie, ShieldCheck, CheckCircle2, Sliders } from "lucide-react";

export const metadata = getMetadata({
  title: "Cookie Policy | Drawdown",
  description: "Drawdown Cookie Policy explaining essential, analytics, functional, and marketing cookie usage and user consent preferences under UK GDPR and PECR.",
  alternates: { canonical: "https://drawdown.trading/cookies" },
});

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/terms' },
              { label: 'Cookie Policy', href: '/cookies' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <Cookie size={14} />
                Cookie &amp; Tracking Disclosure
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Cookie <span style={{ color: "var(--graphite-600)" }}>Policy</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Last Updated: {LEGAL_CONFIG.effectiveDate} · PECR &amp; UK GDPR Compliance
            </p>
          </div>
        </div>

        {/* Document Body */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">
          
          {/* Section 1: Introduction */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. What Are Cookies?
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Cookies are small text files placed on your computer or mobile device when you visit websites. They are widely used to make websites work efficiently, remember your preferences, and provide analytics on platform usage.
              </p>
              <p>
                Under the Privacy and Electronic Communications Regulations (PECR) and UK GDPR, non-essential cookies require your explicit prior consent before being set on your device.
              </p>
            </div>
          </section>

          {/* Section 2: Cookie Categories Table */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. Categories of Cookies We Use
            </h2>
            <div className="overflow-x-auto border" style={{ borderColor: "var(--line-200)" }}>
              <table className="w-full text-[13px] text-left border-collapse">
                <thead>
                  <tr className="border-b font-mono uppercase tracking-[0.05em]" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}>
                    <th className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Category</th>
                    <th className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Purpose</th>
                    <th className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Consent Required?</th>
                    <th className="p-3">Lifespan</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--graphite-600)" }}>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Strictly Essential</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Session authentication, security tokens, and cookie preference storage.</td>
                    <td className="p-3 border-r font-mono text-[11px]" style={{ borderColor: "var(--line-200)" }}>NO (Exempt)</td>
                    <td className="p-3">Session to 1 year</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Performance &amp; Analytics</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Aggregated, anonymised traffic metrics and page loading diagnostic events.</td>
                    <td className="p-3 border-r font-mono text-[11px]" style={{ borderColor: "var(--line-200)" }}>YES (Opt-in)</td>
                    <td className="p-3">Up to 90 days</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Marketing &amp; Attribution</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Affiliate link tracking and conversion attribution metrics.</td>
                    <td className="p-3 border-r font-mono text-[11px]" style={{ borderColor: "var(--line-200)" }}>YES (Opt-in)</td>
                    <td className="p-3">30 to 90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Managing Consent */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. Managing &amp; Modifying Your Preferences
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                You can modify or withdraw your cookie consent at any time. Clicking <strong>Cookie Settings</strong> in our website footer opens the cookie preference center, allowing you to toggle analytics and marketing categories on or off.
              </p>
              <p className="text-[13px]">
                You can also configure your web browser to block or delete cookies. Note that disabling strictly essential cookies may prevent access to authenticated platform features.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
