import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { RefreshCw, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Subscriptions, Cancellations and Refunds | Drawdown",
  description: "Comprehensive plain-English summary of Drawdown subscription terms, automatic renewals, self-service cancellation, 7-day money-back guarantee, and refund procedures.",
  alternates: { canonical: "https://drawdown.trading/legal/subscription-and-refunds" },
});

export default function SubscriptionAndRefundsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/legal/financial-disclaimer' },
              { label: 'Subscriptions & Refunds', href: '/legal/subscription-and-refunds' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <RefreshCw size={14} />
                Billing &amp; Consumer Rights Policy
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Subscriptions, Cancellations <br />
              <span style={{ color: "var(--graphite-600)" }}>&amp; Refund Policy</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Clear, transparent rules governing your Drawdown subscription and consumer rights.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">
          
          {/* Main Highlights Card */}
          <div className="p-8 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <h2 className="text-[14px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
              At a Glance: Subscription &amp; Guarantee Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                <span><strong>Automatic Renewal:</strong> Subscriptions renew automatically until cancelled before the next billing date.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                <span><strong>Self-Service Cancellation:</strong> Cancel online anytime from Account → Billing via Stripe portal.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                <span><strong>7-Day Guarantee:</strong> Voluntary money-back guarantee on your initial paid subscription or upgrade.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                <span><strong>Immediate Access:</strong> Instant access upon checkout with no hidden lock-in periods.</span>
              </div>
            </div>
          </div>

          {/* Section 1: Billing Cycles & Automatic Renewal */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. Subscription Cycles &amp; Automatic Renewal
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown provides recurring subscription tiers (including Signal Centre, Foundation, Edge, and The Floor). Billing occurs in advance on a recurring monthly or annual schedule depending on your chosen plan.
              </p>
              <p>
                <strong>Automatic Renewal Notice:</strong> Your subscription will automatically renew at the end of each billing period for the same duration unless you cancel before your next billing date. The next billing date is displayed within your Account Settings dashboard.
              </p>
            </div>
          </section>

          {/* Section 2: Online Self-Service Cancellation */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. How to Cancel Your Subscription
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We believe cancelling your subscription should be as simple as signing up. You do not need to call us on the phone, join a Discord voice channel, or answer sales retention questions.
              </p>
              <div className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="text-[13px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                  Step-by-Step Cancellation Steps:
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-[13px]">
                  <li>Log in to your Drawdown account dashboard.</li>
                  <li>Click on your profile avatar and select <strong>Account Settings → Billing</strong>.</li>
                  <li>Click <strong>Manage Subscription / Cancel Subscription</strong> to open the secure Stripe Customer Portal.</li>
                  <li>Confirm cancellation. An immediate confirmation notice will appear on screen, and a confirmation email will be sent to your inbox.</li>
                </ol>
              </div>
              <p className="text-[13px] italic">
                Note: Cancelling stops future renewals. You retain full access to your paid tier features until the end of your current paid billing period.
              </p>
            </div>
          </section>

          {/* Section 3: 7-Day Money-Back Guarantee */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. Seven-Day Voluntary Money-Back Guarantee
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                In addition to your statutory rights, Drawdown offers a voluntary <strong>7-day money-back guarantee</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[13px]">
                <li><strong>Scope:</strong> Applies to your first initial paid subscription purchase or your first paid subscription tier upgrade.</li>
                <li><strong>Timeframe:</strong> Your request must be sent by email to <span className="text-accent">{LEGAL_CONFIG.supportEmail}</span> within 7 calendar days of the charge.</li>
                <li><strong>Method:</strong> Refunds are processed back to the original payment method via Stripe within 5–10 business days.</li>
                <li><strong>Access:</strong> Upon refund approval, paid subscription access terminates immediately.</li>
              </ul>
              <p className="text-[13px]">
                Subsequent recurring monthly or annual renewal charges are managed under our standard cancellation policy rather than being treated as new initial purchases.
              </p>
            </div>
          </section>

          {/* Section 4: Immediate Digital Access & Statutory Rights */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              4. Digital Access &amp; Statutory Rights
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown provides immediate access to digital content, market tools, and Signal Centre analysis upon purchase. At checkout, you expressly request that Drawdown begins providing services immediately.
              </p>
              <p>
                Nothing in our policies affects or limits statutory consumer rights under the UK Consumer Rights Act 2015 or Consumer Contracts Regulations 2013 where applicable.
              </p>
            </div>
          </section>

          {/* Section 5: Contacting Support */}
          <section className="space-y-4 pb-8">
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              5. Questions &amp; Support Assistance
            </h2>
            <div className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                If you have questions about a charge, need help cancelling, or wish to request a guarantee refund, contact our support team directly:
              </p>
              <p className="text-[13px] font-mono font-bold text-slate-900">
                Email: <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} className="text-accent underline">{LEGAL_CONFIG.supportEmail}</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
