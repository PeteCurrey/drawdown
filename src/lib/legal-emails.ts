/**
 * Legal / transactional email templates for Drawdown subscription events.
 *
 * Regulated context:
 *  - Operator: Black & Rowan Management Group Limited t/a Drawdown
 *  - These emails satisfy obligations under:
 *      • Consumer Contracts (Information, Cancellation and Additional Charges)
 *        Regulations 2013 (SI 2013/3134) — reg. 14 distance-contract disclosure
 *      • Consumer Rights Act 2015 — digital-content supply and cancellation
 *  - All price figures are illustrative; actual amounts must be drawn from the
 *    Stripe session/invoice object in the calling webhook handler.
 */

import { Resend } from "resend";

const FROM_ADDRESS = "Pete @ Drawdown <thewire@drawdown.trading>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://drawdown.trading";

// ─── Shared layout shell ──────────────────────────────────────────────────────

function emailShell(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Drawdown</title>
</head>
<body style="margin:0;padding:0;background:#0B0E12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0E12;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#111317;border:1px solid #1E2328;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #1E2328;">
              <span style="font-family:monospace;font-size:13px;letter-spacing:0.12em;
                           text-transform:uppercase;color:#9CA3AF;">
                DRAWDOWN
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #1E2328;">
              <p style="font-size:11px;color:#6B7280;line-height:1.7;margin:0;">
                Black &amp; Rowan Management Group Limited trading as Drawdown.<br />
                Educational platform. Not investment advice.<br />
                This email was sent because you purchased or subscribed via Drawdown.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── 1. Subscription welcome (sent on checkout.session.completed for tiers) ───

export function getSubscriptionWelcomeTemplate({
  tierLabel,
  priceString,
  immediateSupplyConsented,
  dashboardUrl,
}: {
  tierLabel: string;
  priceString: string;
  immediateSupplyConsented: boolean;
  dashboardUrl: string;
}): string {
  const cancellationBlurb = immediateSupplyConsented
    ? `<p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0 0 16px;">
        <strong style="color:#D1D5DB;">Important — Your cancellation rights:</strong>
        You requested and we have begun supplying digital content immediately.
        By doing so, you acknowledged that your 14-day right to cancel under the Consumer
        Contracts Regulations 2013 is waived once supply has commenced. This does not affect
        your statutory rights in relation to faulty or mis-described content.
      </p>`
    : `<p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0 0 16px;">
        <strong style="color:#D1D5DB;">Your right to cancel:</strong>
        You have 14 days from today to cancel this subscription without giving any reason
        and receive a full refund, provided you have not accessed the digital content.
        To cancel, email <a href="mailto:legal@drawdown.trading" style="color:#E2B755;">
        legal@drawdown.trading</a> or visit your
        <a href="${dashboardUrl}/settings" style="color:#E2B755;">account settings</a>.
      </p>`;

  const body = `
    <h1 style="font-size:20px;color:#ffffff;margin:0 0 8px;font-weight:700;">
      Subscription Confirmed
    </h1>
    <p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0 0 24px;">
      Your <strong style="color:#D1D5DB;">${tierLabel}</strong> membership
      (${priceString}) is now active.
    </p>

    <div style="background:#0B0E12;border:1px solid #1E2328;padding:20px 24px;margin:0 0 24px;">
      <p style="font-size:13px;color:#9CA3AF;margin:0 0 8px;">
        <strong style="color:#D1D5DB;">What you agreed to:</strong>
      </p>
      <ul style="font-size:13px;color:#9CA3AF;line-height:1.8;margin:0;padding-left:20px;">
        <li>Drawdown <a href="${APP_URL}/legal/terms" style="color:#E2B755;">Terms of Service</a>
            and <a href="${APP_URL}/legal/privacy" style="color:#E2B755;">Privacy Policy</a>
            (accepted at checkout).</li>
        <li>Educational platform only — not financial advice or investment management.</li>
        <li>Subscription renews automatically; cancel any time via dashboard settings.</li>
      </ul>
    </div>

    ${cancellationBlurb}

    <a href="${dashboardUrl}"
      style="display:inline-block;background:#E2B755;color:#000000;padding:14px 32px;
             text-decoration:none;font-weight:700;font-size:13px;
             text-transform:uppercase;letter-spacing:0.08em;margin:8px 0 24px;">
      Access Your Dashboard
    </a>

    <p style="font-size:12px;color:#6B7280;line-height:1.6;margin:0;">
      If you have a question about your subscription, contact
      <a href="mailto:support@drawdown.trading" style="color:#E2B755;">support@drawdown.trading</a>.
      For billing queries, visit
      <a href="${dashboardUrl}/settings/billing" style="color:#E2B755;">Billing Settings</a>.
    </p>`;

  return emailShell(body);
}

// ─── 2. Cancellation confirmation (sent on customer.subscription.deleted) ─────

export function getSubscriptionCancelledTemplate({
  tierLabel,
  accessUntil,
  dashboardUrl,
}: {
  tierLabel: string;
  accessUntil: string; // human-readable date e.g. "4 September 2026"
  dashboardUrl: string;
}): string {
  const body = `
    <h1 style="font-size:20px;color:#ffffff;margin:0 0 8px;font-weight:700;">
      Subscription Cancelled
    </h1>
    <p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0 0 24px;">
      Your <strong style="color:#D1D5DB;">${tierLabel}</strong> subscription has been cancelled.
    </p>

    <div style="background:#0B0E12;border:1px solid #1E2328;padding:20px 24px;margin:0 0 24px;">
      <p style="font-size:13px;color:#D1D5DB;margin:0 0 8px;font-weight:600;">What happens next</p>
      <ul style="font-size:13px;color:#9CA3AF;line-height:1.8;margin:0;padding-left:20px;">
        <li>Access continues until <strong style="color:#D1D5DB;">${accessUntil}</strong>.</li>
        <li>No further charges will be taken.</li>
        <li>Your account and any downloaded resources remain accessible.</li>
        <li>You can re-subscribe at any time from your dashboard.</li>
      </ul>
    </div>

    <p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0 0 24px;">
      If you believe this cancellation was made in error, or if you cancelled within
      14 days without accessing digital content and are entitled to a refund, please
      contact <a href="mailto:legal@drawdown.trading" style="color:#E2B755;">legal@drawdown.trading</a>
      within 30 days.
    </p>

    <a href="${dashboardUrl}"
      style="display:inline-block;background:#E2B755;color:#000000;padding:14px 32px;
             text-decoration:none;font-weight:700;font-size:13px;
             text-transform:uppercase;letter-spacing:0.08em;margin:8px 0 24px;">
      Visit Dashboard
    </a>`;

  return emailShell(body);
}

// ─── 3. Payment failed notice (sent on invoice.payment_failed) ────────────────

export function getPaymentFailedTemplate({
  tierLabel,
  amountString,
  updatePaymentUrl,
}: {
  tierLabel: string;
  amountString: string;
  updatePaymentUrl: string;
}): string {
  const body = `
    <h1 style="font-size:20px;color:#ffffff;margin:0 0 8px;font-weight:700;">
      Payment Failed
    </h1>
    <p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0 0 24px;">
      We were unable to collect your <strong style="color:#D1D5DB;">${tierLabel}</strong>
      subscription payment of <strong style="color:#D1D5DB;">${amountString}</strong>.
    </p>

    <div style="background:#1A0A0A;border:1px solid #3B1515;padding:20px 24px;margin:0 0 24px;">
      <p style="font-size:13px;color:#FCA5A5;margin:0 0 8px;font-weight:600;">Action required</p>
      <p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0;">
        Please update your payment details within <strong style="color:#D1D5DB;">7 days</strong>
        to avoid your membership being suspended. Stripe will automatically retry the payment
        in the meantime.
      </p>
    </div>

    <a href="${updatePaymentUrl}"
      style="display:inline-block;background:#E2B755;color:#000000;padding:14px 32px;
             text-decoration:none;font-weight:700;font-size:13px;
             text-transform:uppercase;letter-spacing:0.08em;margin:8px 0 24px;">
      Update Payment Method
    </a>

    <p style="font-size:12px;color:#6B7280;line-height:1.6;margin:0;">
      If you have already updated your card details, no further action is needed.
      Contact <a href="mailto:support@drawdown.trading" style="color:#E2B755;">support@drawdown.trading</a>
      if you need help.
    </p>`;

  return emailShell(body);
}

// ─── Dispatch helpers ─────────────────────────────────────────────────────────

export async function sendSubscriptionWelcomeEmail({
  resendKey,
  toEmail,
  tierLabel,
  priceString,
  immediateSupplyConsented,
}: {
  resendKey: string;
  toEmail: string;
  tierLabel: string;
  priceString: string;
  immediateSupplyConsented: boolean;
}): Promise<void> {
  const resend = new Resend(resendKey);
  const dashboardUrl = `${APP_URL}/dashboard`;
  const html = getSubscriptionWelcomeTemplate({
    tierLabel,
    priceString,
    immediateSupplyConsented,
    dashboardUrl,
  });
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `Your Drawdown ${tierLabel} membership is active`,
    html,
  });
}

export async function sendSubscriptionCancelledEmail({
  resendKey,
  toEmail,
  tierLabel,
  accessUntil,
}: {
  resendKey: string;
  toEmail: string;
  tierLabel: string;
  accessUntil: string;
}): Promise<void> {
  const resend = new Resend(resendKey);
  const dashboardUrl = `${APP_URL}/dashboard`;
  const html = getSubscriptionCancelledTemplate({
    tierLabel,
    accessUntil,
    dashboardUrl,
  });
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `Your Drawdown ${tierLabel} subscription has been cancelled`,
    html,
  });
}

export async function sendPaymentFailedEmail({
  resendKey,
  toEmail,
  tierLabel,
  amountString,
}: {
  resendKey: string;
  toEmail: string;
  tierLabel: string;
  amountString: string;
}): Promise<void> {
  const resend = new Resend(resendKey);
  const updatePaymentUrl = `${APP_URL}/dashboard/settings/billing`;
  const html = getPaymentFailedTemplate({
    tierLabel,
    amountString,
    updatePaymentUrl,
  });
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `Action required: Drawdown payment failed`,
    html,
  });
}
