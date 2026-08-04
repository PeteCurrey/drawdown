import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Guidelines | Drawdown",
  description: "Conduct expectations for Drawdown's Discord server and platform community.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Community', href: '/community-guidelines' },
              { label: 'Community Guidelines', href: '/community-guidelines' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <Users size={14} />
                Community Conduct Expectations
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Community <span style={{ color: "var(--graphite-600)" }}>Guidelines</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Effective Date: {LEGAL_CONFIG.effectiveDate} · Document Version: {LEGAL_CONFIG.documentVersion} · Governing Law: {LEGAL_CONFIG.governingLaw}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-[15px] font-sans leading-relaxed" style={{ color: "var(--ink-950)" }}>
            Drawdown's Discord server and platform community exist for members to learn, share ideas, and support one another on their trading journey. These guidelines apply to all community spaces operated by {LEGAL_CONFIG.fullTradingEntity}.
          </p>
        </div>

        {/* Main Document Body */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">

          {/* 1. Respect & Professionalism */}
          <section id="section-1" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. Respect &amp; Professionalism
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Treat every member with respect. Disagreements on trading approaches are welcome; personal attacks, harassment, threats, or discriminatory language of any kind are not. This applies equally in public channels, private messages, and voice channels.
              </p>
            </div>
          </section>

          {/* 2. No Financial Advice */}
          <section id="section-2" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. No Financial Advice
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Do not provide, solicit, or imply personalised financial, investment, or tax advice. Sharing your own trade ideas, chart analysis, or educational content is permitted provided you include appropriate risk context. Members must not represent their posts as regulated financial advice.
              </p>
              <p>
                {LEGAL_CONFIG.fcaStatus}
              </p>
            </div>
          </section>

          {/* 3. No Signal Selling or Paid Promotions */}
          <section id="section-3" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. No Signal Selling or Paid Promotions
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Promotion of third-party paid services, signal groups, prop firm referral schemes, broker affiliate links, or any commercial offer is strictly prohibited without prior written consent from Drawdown. Unsolicited direct messages promoting services will result in an immediate ban.
              </p>
            </div>
          </section>

          {/* 4. No Pump-and-Dump or Market Manipulation */}
          <section id="section-4" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              4. No Pump-and-Dump or Market Manipulation
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Discussion that constitutes, facilitates, or encourages market manipulation — including pump-and-dump schemes for any instrument — is banned. Such conduct may also constitute a criminal offence under UK law (Financial Services and Markets Act 2000, as amended).
              </p>
            </div>
          </section>

          {/* 5. Age Requirement */}
          <section id="section-5" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              5. Age Requirement
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown is restricted to individuals aged <strong>{LEGAL_CONFIG.minimumCustomerAge} or over</strong>. By participating in community spaces, you confirm you meet this requirement.
              </p>
            </div>
          </section>

          {/* 6. Accurate Representation */}
          <section id="section-6" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              6. Accurate Representation
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Members must not misrepresent their trading results, credentials, or affiliations. Posting fabricated or cherry-picked P&amp;L screenshots intended to mislead others is prohibited.
              </p>
            </div>
          </section>

          {/* 7. Confidentiality */}
          <section id="section-7" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              7. Confidentiality
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Premium course materials, member-only content, and proprietary content shared in paid channels must not be redistributed externally without written permission from Drawdown. Redistribution violates our Terms and Conditions and may constitute copyright infringement.
              </p>
            </div>
          </section>

          {/* 8. Moderator Authority */}
          <section id="section-8" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              8. Moderator Authority
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown moderators may warn, mute, kick, or permanently ban members for violations of these guidelines at their reasonable discretion. Appeals can be submitted by email to <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} className="text-accent underline hover:opacity-80">{LEGAL_CONFIG.supportEmail}</a>.
              </p>
            </div>
          </section>

          {/* 9. Illegal Content */}
          <section id="section-9" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              9. Illegal Content
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Do not post content that is illegal under the laws of England and Wales, including but not limited to: insider information relating to financial instruments, copyright-infringing content, or material that is defamatory, obscene, or harmful. We will cooperate with law enforcement where required.
              </p>
            </div>
          </section>

          {/* 10. Reporting Violations */}
          <section id="section-10" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              10. Reporting Violations
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                If you witness a breach of these guidelines, please report it to a moderator directly in Discord or email <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} className="text-accent underline hover:opacity-80">{LEGAL_CONFIG.supportEmail}</a>. Reports will be treated confidentially.
              </p>
            </div>
          </section>

          {/* 11. Changes */}
          <section id="section-11" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              11. Changes
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                These guidelines may be updated from time to time. Continued participation in Drawdown community spaces constitutes acceptance of the current guidelines. The governing Terms and Conditions remain applicable at all times: <Link href="/terms" className="text-accent underline hover:opacity-80">drawdown.trading/terms</Link>.
              </p>
            </div>
          </section>

          {/* Contact and Legal Notices */}
          <section id="section-12" className="space-y-4 pb-8">
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              12. Contact &amp; Legal Notices
            </h2>
            <div className="p-6 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <p className="text-[13px] font-mono uppercase tracking-[0.08em] text-slate-900 font-bold">
                {LEGAL_CONFIG.fullTradingEntity}
              </p>
              <p className="text-[13px]" style={{ color: "var(--graphite-600)" }}>
                Legal &amp; Business Contact: <span className="text-accent">{LEGAL_CONFIG.legalEmail}</span><br />
                Customer Support: <span className="text-accent">{LEGAL_CONFIG.supportEmail}</span><br />
                Address: {LEGAL_CONFIG.tradingAddress}
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
