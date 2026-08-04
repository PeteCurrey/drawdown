/**
 * Legal & Transactional Email Helpers for Drawdown.trading
 * Contracting Entity: Black & Rowan Management Group Limited t/a Drawdown
 *
 * All emails sent via Resend. These are required legal transactional emails,
 * not marketing, and therefore do not require marketing opt-in consent.
 */
import { Resend } from "resend";
import { LEGAL_CONFIG } from "@/config/legal";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_for_dev_mode");

const FROM_ADDRESS = `Drawdown <noreply@drawdown.trading>`;
const SUPPORT_EMAIL = LEGAL_CONFIG.supportEmail;
const COMPLAINTS_EMAIL = LEGAL_CONFIG.complaintsEmail;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drawdown.trading";

/** Small shared footer appended to every legal/transactional email */
const legalFooter = `
<hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px" />
<p style="font-size:12px;color:#6b7280;line-height:1.6;margin:0">
  <strong>${LEGAL_CONFIG.fullTradingEntity}</strong><br/>
  Trading address: ${LEGAL_CONFIG.tradingAddress}<br/>
  ${LEGAL_CONFIG.fcaStatus}<br/><br/>
  Questions? <a href="mailto:${SUPPORT_EMAIL}" style="color:#6b7280">${SUPPORT_EMAIL}</a> |
  Complaints: <a href="mailto:${COMPLAINTS_EMAIL}" style="color:#6b7280">${COMPLAINTS_EMAIL}</a>
</p>
`;

// ── Subscription Confirmation ──────────────────────────────────────────────

export async function sendSubscriptionConfirmation({
  to,
  name,
  tier,
  billingCycle,
  amount,
  nextBillingDate,
  immediateSupplyGranted,
  stripeCustomerId,
}: {
  to: string;
  name?: string;
  tier: string;
  billingCycle: "monthly" | "annual";
  amount: string;
  nextBillingDate: string;
  immediateSupplyGranted: boolean;
  stripeCustomerId?: string;
}) {
  const subject = `Your Drawdown ${tier} subscription is confirmed`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Welcome to Drawdown${name ? `, ${name}` : ""}!</h1>
      <p style="color:#374151;line-height:1.6">
        Your <strong>${tier}</strong> subscription has been activated.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:24px 0;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Plan</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600">${tier} (${billingCycle})</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Amount</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600">${amount}</td>
        </tr>
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Next renewal</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600">${nextBillingDate}</td>
        </tr>
      </table>

      ${immediateSupplyGranted ? `
      <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:0 4px 4px 0;margin-bottom:24px">
        <p style="margin:0;font-size:14px;color:#1e40af;line-height:1.5">
          <strong>Immediate digital access granted.</strong> You requested immediate access to digital content and have waived your 14-day cooling-off right under UK Consumer Contracts Regulations 2013. Your ${LEGAL_CONFIG.moneyBackGuaranteeDays}-day money-back guarantee still applies.
        </p>
      </div>
      ` : ""}

      <p style="color:#374151;line-height:1.6">
        Your subscription renews automatically unless you cancel.
        You can cancel at any time from your
        <a href="${SITE_URL}/dashboard/billing" style="color:#2563eb">billing settings</a>
        — no phone calls needed.
      </p>

      <p style="color:#374151;line-height:1.6">
        You have a <strong>${LEGAL_CONFIG.moneyBackGuaranteeDays}-day money-back guarantee</strong> on your first subscription payment.
        To request a refund, email <a href="mailto:${SUPPORT_EMAIL}" style="color:#2563eb">${SUPPORT_EMAIL}</a> within ${LEGAL_CONFIG.moneyBackGuaranteeDays} days of the charge.
      </p>

      <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;margin-top:8px">
        Go to Dashboard →
      </a>

      ${legalFooter}
    </div>
  `;

  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

// ── Legal Acceptance Receipt ───────────────────────────────────────────────

export async function sendLegalAcceptanceReceipt({
  to,
  name,
  documentVersion,
  acceptedAt,
  immediateSupplyRequested,
  marketingConsent,
}: {
  to: string;
  name?: string;
  documentVersion: string;
  acceptedAt: string;
  immediateSupplyRequested: boolean;
  marketingConsent: boolean;
}) {
  const subject = "Drawdown – Your terms acceptance record";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Terms & Conditions Acceptance Record</h1>
      <p style="color:#374151;line-height:1.6">
        Hi${name ? ` ${name}` : ""},<br/>
        This email confirms that you accepted the Drawdown Terms and Conditions. Keep it for your records.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:24px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Document version</td>
          <td style="padding:12px 16px;font-size:14px">${documentVersion}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Accepted at</td>
          <td style="padding:12px 16px;font-size:14px">${acceptedAt} (UTC)</td>
        </tr>
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Immediate digital supply</td>
          <td style="padding:12px 16px;font-size:14px">${immediateSupplyRequested ? "Yes – cooling-off right waived" : "No"}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Marketing emails</td>
          <td style="padding:12px 16px;font-size:14px">${marketingConsent ? "Opted in" : "Opted out"}</td>
        </tr>
      </table>

      <p style="color:#6b7280;font-size:13px;line-height:1.6">
        You can view our Terms at <a href="${SITE_URL}/terms" style="color:#2563eb">${SITE_URL}/terms</a>
        and our Privacy Policy at <a href="${SITE_URL}/privacy" style="color:#2563eb">${SITE_URL}/privacy</a>.
        To request a copy of your data or to delete your account, visit your
        <a href="${SITE_URL}/dashboard/settings" style="color:#2563eb">Account Settings</a>.
      </p>

      ${legalFooter}
    </div>
  `;

  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

// ── Annual Renewal Reminder (7 days before) ────────────────────────────────

export async function sendAnnualRenewalReminder({
  to,
  name,
  tier,
  renewalDate,
  amount,
}: {
  to: string;
  name?: string;
  tier: string;
  renewalDate: string;
  amount: string;
}) {
  const subject = `Your Drawdown annual subscription renews on ${renewalDate}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Upcoming Annual Renewal</h1>
      <p style="color:#374151;line-height:1.6">
        Hi${name ? ` ${name}` : ""},<br/>
        Your Drawdown <strong>${tier}</strong> annual subscription will renew automatically in 7 days.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:24px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Renewal date</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600">${renewalDate}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Amount</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600">${amount}</td>
        </tr>
      </table>

      <p style="color:#374151;line-height:1.6">
        If you do not wish to renew, please cancel before <strong>${renewalDate}</strong> from your
        <a href="${SITE_URL}/dashboard/billing" style="color:#2563eb">billing settings</a>.
        No phone call required.
      </p>

      ${legalFooter}
    </div>
  `;

  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

// ── Cancellation Confirmation ──────────────────────────────────────────────

export async function sendCancellationConfirmation({
  to,
  name,
  tier,
  accessEndsAt,
}: {
  to: string;
  name?: string;
  tier: string;
  accessEndsAt: string;
}) {
  const subject = "Your Drawdown subscription has been cancelled";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Subscription Cancelled</h1>
      <p style="color:#374151;line-height:1.6">
        Hi${name ? ` ${name}` : ""},<br/>
        Your Drawdown <strong>${tier}</strong> subscription has been cancelled. No further payments will be taken.
      </p>

      <p style="color:#374151;line-height:1.6">
        Your access will remain active until <strong>${accessEndsAt}</strong>.
        After that date, your account will revert to free access.
      </p>

      <p style="color:#374151;line-height:1.6">
        Changed your mind? You can resubscribe at any time from
        <a href="${SITE_URL}/pricing" style="color:#2563eb">drawdown.trading/pricing</a>.
      </p>

      ${legalFooter}
    </div>
  `;

  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

// ── Refund Confirmation ────────────────────────────────────────────────────

export async function sendRefundConfirmation({
  to,
  name,
  amount,
  reason,
  refundId,
}: {
  to: string;
  name?: string;
  amount: string;
  reason: string;
  refundId: string;
}) {
  const subject = "Drawdown – Your refund has been processed";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Refund Processed</h1>
      <p style="color:#374151;line-height:1.6">
        Hi${name ? ` ${name}` : ""},<br/>
        We have processed your refund of <strong>${amount}</strong>.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:24px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Refund ID</td>
          <td style="padding:12px 16px;font-size:14px">${refundId}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Amount</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600">${amount}</td>
        </tr>
        <tr style="background:#f9fafb">
          <td style="padding:12px 16px;font-size:14px;color:#6b7280;font-weight:500">Reason</td>
          <td style="padding:12px 16px;font-size:14px">${reason}</td>
        </tr>
      </table>

      <p style="color:#374151;line-height:1.6">
        Refunds typically appear in your account within 5–10 business days, depending on your card issuer.
        If you have not received the refund after 10 business days, please contact us at
        <a href="mailto:${SUPPORT_EMAIL}" style="color:#2563eb">${SUPPORT_EMAIL}</a>.
      </p>

      ${legalFooter}
    </div>
  `;

  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

// ── Account Deletion Confirmation ─────────────────────────────────────────

export async function sendAccountDeletionConfirmation({
  to,
  name,
  deletedAt,
}: {
  to: string;
  name?: string;
  deletedAt: string;
}) {
  const subject = "Drawdown – Your account has been deleted";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#111827">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Account Deleted</h1>
      <p style="color:#374151;line-height:1.6">
        Hi${name ? ` ${name}` : ""},<br/>
        Your Drawdown account has been permanently deleted on <strong>${deletedAt}</strong>.
      </p>

      <p style="color:#374151;line-height:1.6">
        Your personal data has been purged from our production systems. Certain data may be retained in
        encrypted backups for up to 30 days in line with our data retention policy, after which it will
        be permanently destroyed.
      </p>

      <p style="color:#374151;line-height:1.6">
        If you believe a data retention obligation (e.g. financial records under UK law) applies to any
        of your data, please contact <a href="mailto:${LEGAL_CONFIG.privacyEmail}" style="color:#2563eb">${LEGAL_CONFIG.privacyEmail}</a>.
      </p>

      <p style="color:#374151;line-height:1.6">
        You can create a new account at any time at
        <a href="${SITE_URL}" style="color:#2563eb">drawdown.trading</a>.
      </p>

      ${legalFooter}
    </div>
  `;

  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}
