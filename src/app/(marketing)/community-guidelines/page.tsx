import type { Metadata } from "next";
import { LEGAL_CONFIG } from "@/config/legal";

export const metadata: Metadata = {
  title: "Community Guidelines | Drawdown",
  description: "Conduct expectations for Drawdown's Discord server and platform community.",
};

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold mb-2">Community Guidelines</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {LEGAL_CONFIG.fullTradingEntity} — Version {LEGAL_CONFIG.documentVersion} — Effective {LEGAL_CONFIG.effectiveDate}
        </p>

        <p>
          Drawdown's Discord server and platform community exist for members to learn, share ideas, and
          support one another on their trading journey. These guidelines apply to all community spaces
          operated by {LEGAL_CONFIG.fullTradingEntity}.
        </p>

        <h2>1. Respect & Professionalism</h2>
        <p>
          Treat every member with respect. Disagreements on trading approaches are welcome; personal attacks,
          harassment, threats, or discriminatory language of any kind are not. This applies equally in public
          channels, private messages, and voice channels.
        </p>

        <h2>2. No Financial Advice</h2>
        <p>
          Do not provide, solicit, or imply personalised financial, investment, or tax advice.
          Sharing your own trade ideas, chart analysis, or educational content is permitted provided you
          include appropriate risk context. Members must not represent their posts as regulated financial advice.
        </p>
        <p>
          {LEGAL_CONFIG.fcaStatus}
        </p>

        <h2>3. No Signal Selling or Paid Promotions</h2>
        <p>
          Promotion of third-party paid services, signal groups, prop firm referral schemes, broker affiliate
          links, or any commercial offer is strictly prohibited without prior written consent from Drawdown.
          Unsolicited direct messages promoting services will result in an immediate ban.
        </p>

        <h2>4. No Pump-and-Dump or Market Manipulation</h2>
        <p>
          Discussion that constitutes, facilitates, or encourages market manipulation — including pump-and-dump
          schemes for any instrument — is banned. Such conduct may also constitute a criminal offence under
          UK law (Financial Services and Markets Act 2000, as amended).
        </p>

        <h2>5. Age Requirement</h2>
        <p>
          Drawdown is restricted to individuals aged {LEGAL_CONFIG.minimumCustomerAge} or over.
          By participating in community spaces, you confirm you meet this requirement.
        </p>

        <h2>6. Accurate Representation</h2>
        <p>
          Members must not misrepresent their trading results, credentials, or affiliations. Posting
          fabricated or cherry-picked P&L screenshots intended to mislead others is prohibited.
        </p>

        <h2>7. Confidentiality</h2>
        <p>
          Premium course materials, member-only content, and proprietary content shared in paid channels
          must not be redistributed externally without written permission from Drawdown. Redistribution
          violates our Terms and Conditions and may constitute copyright infringement.
        </p>

        <h2>8. Moderator Authority</h2>
        <p>
          Drawdown moderators may warn, mute, kick, or permanently ban members for violations of these
          guidelines at their reasonable discretion. Appeals can be submitted by email to{" "}
          <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a>.
        </p>

        <h2>9. Illegal Content</h2>
        <p>
          Do not post content that is illegal under the laws of England and Wales, including but not limited
          to: insider information relating to financial instruments, copyright-infringing content, or material
          that is defamatory, obscene, or harmful. We will cooperate with law enforcement where required.
        </p>

        <h2>10. Reporting Violations</h2>
        <p>
          If you witness a breach of these guidelines, please report it to a moderator directly in Discord
          or email{" "}<a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a>.
          Reports will be treated confidentially.
        </p>

        <h2>11. Changes</h2>
        <p>
          These guidelines may be updated from time to time. Continued participation in Drawdown community
          spaces constitutes acceptance of the current guidelines. The governing Terms and Conditions remain
          applicable at all times:{" "}
          <a href="/terms">drawdown.trading/terms</a>.
        </p>

        <hr />
        <p className="text-sm text-muted-foreground">
          {LEGAL_CONFIG.fullTradingEntity} · Trading address: {LEGAL_CONFIG.tradingAddress} ·{" "}
          Governing law: {LEGAL_CONFIG.governingLaw}.<br />
          Questions: <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a>
        </p>
      </div>
    </main>
  );
}
