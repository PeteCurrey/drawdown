import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { ShieldCheck, Scale, AlertTriangle, RefreshCw, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Terms and Conditions | Drawdown",
  description: "Terms and Conditions governing the use of Drawdown trading education, quantitative market tools, Signal Centre, and subscription software.",
  alternates: { canonical: "https://drawdown.trading/terms" },
});

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/terms' },
              { label: 'Terms and Conditions', href: '/terms' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <Scale size={14} />
                Contractual Terms &amp; Subscription Agreement
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Terms and <span style={{ color: "var(--graphite-600)" }}>Conditions</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Effective Date: {LEGAL_CONFIG.effectiveDate} · Document Version: {LEGAL_CONFIG.documentVersion} · Governing Law: {LEGAL_CONFIG.governingLaw}
            </p>
          </div>
        </div>

        {/* Prominent Automatic Renewal & Cancellation Box */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <RefreshCw size={16} />
              <span>Key Subscription Summary</span>
            </div>
            <p className="text-[15px] font-sans font-semibold leading-relaxed" style={{ color: "var(--ink-950)" }}>
              Paid subscriptions renew automatically at the end of each billing period (monthly or annually) unless cancelled before the next billing date.
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              You may cancel your subscription at any time online through your Account Billing page or the Stripe Customer Portal. Our voluntary seven-day money-back guarantee applies to your first paid subscription or upgrade, in addition to your statutory rights.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-[12px] font-mono uppercase tracking-[0.05em]">
              <Link href="/legal/subscription-and-refunds" className="text-accent underline hover:opacity-80">
                Read Subscriptions &amp; Refund Policy →
              </Link>
              <Link href="/disclaimer" className="text-accent underline hover:opacity-80">
                Read Risk Disclaimer →
              </Link>
            </div>
          </div>
        </div>

        {/* Main Document Body */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">

          {/* 1. About Drawdown */}
          <section id="section-1" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. About Drawdown
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown is a trading education platform, quantitative analysis service, software provider, and market intelligence publication operated by <strong>{LEGAL_CONFIG.fullTradingEntity}</strong> ("Drawdown", "we", "us", or "our").
              </p>
              <p>
                Drawdown provides structured education, quantitative indicator models, signal analysis, trade journaling tools, market research, and subscription software. <strong>Drawdown is not a broker, investment manager, financial adviser, commodity trading adviser, or regulated trading venue.</strong>
              </p>
              <p>
                Drawdown does not execute customer trades, hold customer money or trading capital, manage investment portfolios, or provide personalised financial advice. Drawdown is not authorised or regulated by the Financial Conduct Authority (FCA) and operates strictly within publisher, technology vendor, and educational provider exemptions under UK law.
              </p>
            </div>
          </section>

          {/* 2. Eligibility */}
          <section id="section-2" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. Eligibility
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                To register an account or subscribe to Drawdown, you must be at least <strong>{LEGAL_CONFIG.minimumCustomerAge} years of age</strong> and legally capable of entering into a binding contract under applicable law.
              </p>
              <p>
                You are solely responsible for ensuring that your access to and use of Drawdown complies with all laws, rules, and regulations applicable in your jurisdiction. Drawdown reserves the right to restrict or refuse availability in specific countries or jurisdictions where provision would violate local law or regulatory requirements.
              </p>
            </div>
          </section>

          {/* 3. Account Registration and Security */}
          <section id="section-3" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. Account Registration and Security
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                You must provide accurate, current, and complete information during registration. Accounts are registered to one individual or authorised legal entity. Sharing account credentials, sub-licensing, or selling account access to third parties is strictly prohibited.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your authentication credentials and for all activities occurring under your account. You must notify Drawdown immediately at <span className="text-accent">{LEGAL_CONFIG.securityEmail}</span> if you suspect any unauthorized access or security breach.
              </p>
            </div>
          </section>

          {/* 4. Free and Paid Access */}
          <section id="section-4" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              4. Free and Paid Access Tiers
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown offers free access tiers, trial access (where offered), paid subscription tiers (including Signal Centre, Foundation, Edge, and The Floor), and one-off standalone educational products (such as downloadable guides or the Institutional Accelerator program).
              </p>
              <p>
                Feature availability varies by plan. Roadmap items, forthcoming features, or beta tools are provided for preview purposes and do not constitute guaranteed delivery commitments unless expressly agreed in writing.
              </p>
            </div>
          </section>

          {/* 5. Subscription Commencement */}
          <section id="section-5" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              5. Subscription Commencement
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Your contract with Drawdown commences upon the earliest of: completing account registration, successful authorization of payment via Stripe checkout, or accessing gated platform services. Upon completion, a confirmation email is dispatched containing your plan details and links to these Terms.
              </p>
            </div>
          </section>

          {/* 6. Monthly and Annual Billing */}
          <section id="section-6" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              6. Monthly and Annual Billing
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Subscriptions are billed in advance on a recurring monthly or annual basis, matching your selected billing cycle. Payment is processed securely via Stripe. 
              </p>
              <p>
                If a subscription payment fails, Stripe will attempt automated retries over a standard retry window. Access may be temporarily restricted following non-payment. <strong>Deleting an application, logging out, or leaving the Drawdown Discord server does not cancel your Stripe subscription.</strong>
              </p>
            </div>
          </section>

          {/* 7. Automatic Renewal */}
          <section id="section-7" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              7. Automatic Renewal &amp; Renewal Reminders
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                <strong>Automatic Renewal Notice:</strong> Paid subscriptions automatically renew at the end of each billing cycle unless you cancel before your next renewal date.
              </p>
              <p>
                For annual subscriptions and free/discounted trials converting to paid subscriptions, Drawdown will send advance email reminders prior to the renewal charge to your registered email address.
              </p>
            </div>
          </section>

          {/* 8. Cancellation */}
          <section id="section-8" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              8. Online Self-Service Cancellation
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                You may cancel your subscription at any time self-service online. No telephone calls, sales pitches, or mandatory exit surveys are required.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[13px]">
                <li>Navigate to <strong>Account Settings → Billing</strong> within the dashboard.</li>
                <li>Click <strong>Manage Subscription / Cancel Subscription</strong> to access the self-service portal.</li>
                <li>Upon cancellation, an immediate confirmation screen is displayed and a confirmation email is dispatched.</li>
              </ul>
              <p>
                Cancellation stops future automatic renewals. You retain access to your paid subscription tier through the end of your current paid billing period.
              </p>
            </div>
          </section>

          {/* 9. Seven-Day Money-Back Guarantee */}
          <section id="section-9" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              9. Seven-Day Voluntary Money-Back Guarantee
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown offers a voluntary <strong>7-day money-back guarantee</strong> on your first initial paid subscription purchase or first paid subscription tier upgrade. This guarantee operates in addition to your statutory consumer rights.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[13px]">
                <li>The request must be submitted within 7 calendar days of the initial charge by contacting <span className="text-accent">{LEGAL_CONFIG.supportEmail}</span>.</li>
                <li>Approved refunds are credited to your original payment method via Stripe (typically processing within 5–10 business days).</li>
                <li>Upon approval of a full refund under the guarantee, paid platform access terminates immediately.</li>
                <li>Subsequent recurring renewals are managed under the standard cancellation policy.</li>
              </ul>
            </div>
          </section>

          {/* 10. Digital Content and Immediate Access */}
          <section id="section-10" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              10. Immediate Digital Supply &amp; Consumer Rights
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown supplies digital content, quantitative indicators, and online software immediately upon successful checkout. At checkout, you expressly request immediate performance of the subscription service.
              </p>
              <p>
                Nothing in these Terms limits or affects statutory consumer cancellation rights under UK Consumer Contracts Regulations 2013 where applicable. Where statutory cancellation rights apply and are exercised, any refund will account for services supplied prior to cancellation.
              </p>
            </div>
          </section>

          {/* 11. Prices, Taxes and VAT */}
          <section id="section-11" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              11. Prices, Currency, and Tax Treatment
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Prices are displayed in British Pounds Sterling (GBP) unless alternative regional pricing is explicitly shown. Displayed subscription prices specify whether applicable VAT or indirect taxes are included.
              </p>
              <p>
                Educational materials discussing tax structures (such as UK Spread Betting vs CFD taxation) provide general educational context only. Drawdown does not provide personal tax advice. Users are responsible for consulting qualified tax professionals regarding their individual liabilities.
              </p>
            </div>
          </section>

          {/* 12. Price Changes */}
          <section id="section-12" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              12. Price Adjustments
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown reserves the right to modify subscription fees. Any price changes will be communicated in advance via email. Price changes do not apply retroactively and take effect only at the start of your subsequent billing renewal period. If you do not agree to a price change, you may cancel your subscription prior to the effective date.
              </p>
            </div>
          </section>

          {/* 13. Educational Content and General Market Analysis */}
          <section id="section-13" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              13. Educational Scope &amp; Impersonal Market Signals
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                All courses, articles, indicators, scanners, and Signal Centre outputs published by Drawdown represent <strong>general, non-personalised quantitative market analysis and technical indicators</strong>.
              </p>
              <p>
                Outputs are provided to all subscribers on substantially the same basis. They are calculated automatically from third-party price feeds, technical rules, and statistical risk models. <strong>They are not tailored financial recommendations, personal investment advice, or promises of trading profit.</strong> You retain 100% discretion and responsibility for every trade decision.
              </p>
            </div>
          </section>

          {/* 14. AI and Automated Tool Limitations */}
          <section id="section-14" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              14. AI Tool Scope and Limitations
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                AI features (such as the AI Trade Journal, strategy helpers, and multi-model consensus signals) process data probabilistically. AI models can experience output hallucinations, technical latency, or incomplete historical context.
              </p>
              <p>
                An "AI Consensus" represents mathematical agreement between configured model parameters, not verification by a licensed financial analyst. AI outputs must be independently reviewed before being relied upon.
              </p>
            </div>
          </section>

          {/* 15. Market Data and Third-Party Services */}
          <section id="section-15" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              15. Market Data &amp; External Broker Links
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Market data feeds (including TradingView chart embeds and third-party API quotes) are provided "as is". Outages, exchange delays, or price discrepancies between market feeds and specific broker quotes can occur.
              </p>
              <p>
                Drawdown may feature links to external regulated brokers or prop trading firms. Drawdown may receive affiliate compensation when users register via external links. Drawdown is not responsible for third-party broker accounts, execution slippage, or platform availability.
              </p>
            </div>
          </section>

          {/* 16. Intellectual Property */}
          <section id="section-16" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              16. Intellectual Property Rights
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown and its licensors retain full ownership of all platform branding, curriculum content, proprietary scoring models, codebases, graphics, videos, and documentation.
              </p>
              <p>
                <strong>User Content Ownership:</strong> You retain sole ownership of your trade journal entries, uploaded broker statements, custom strategy rules, and personal notes. You grant Drawdown only a limited, non-exclusive license to process your data solely to deliver platform features to you.
              </p>
            </div>
          </section>

          {/* 17. Acceptable Use */}
          <section id="section-17" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              17. Acceptable Use Policy
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                You agree not to: (a) share account credentials; (b) scrape, extract, or redistribute proprietary signals or curriculum materials; (c) reverse engineer platform code; (d) abuse AI endpoints; (e) engage in unlawful acts; or (f) bypass paywalls or access controls.
              </p>
            </div>
          </section>

          {/* 18. Community and Discord Conduct */}
          <section id="section-18" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              18. Community &amp; Discord Conduct
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Community members must interact respectfully. Giving illegal financial advice, soliciting broker deposits, sharing false P&amp;L graphics, or harassing other members is strictly forbidden and results in immediate community removal.
              </p>
            </div>
          </section>

          {/* 19. Suspension and Termination */}
          <section id="section-19" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              19. Suspension and Termination
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown may suspend or terminate accounts in cases of payment default, severe acceptable-use violations, security threats, or legal compulsion. Where appropriate, notice and data export opportunities will be provided prior to closure.
              </p>
            </div>
          </section>

          {/* 20. Service Availability and Changes */}
          <section id="section-20" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              20. Service Availability &amp; Modifications
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We strive for continuous uptime but do not guarantee error-free or uninterrupted operation. Maintenance updates or third-party outages may temporarily affect availability.
              </p>
            </div>
          </section>

          {/* 21. Liability */}
          <section id="section-21" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              21. Limitation of Liability
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any liability that cannot lawfully be limited under UK consumer law.
              </p>
              <p>
                Drawdown is not liable for trading losses, lost profits, or indirect damages resulting from your independent financial decisions or market movements.
              </p>
            </div>
          </section>

          {/* 22. Indemnity */}
          <section id="section-22" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              22. Indemnification
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                You agree to indemnify Drawdown against third-party claims resulting directly from your deliberate breach of these Terms, unlawful activity, or infringement of intellectual property.
              </p>
            </div>
          </section>

          {/* 23. Complaints */}
          <section id="section-23" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              23. Complaints Procedure
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                If you have a billing, technical, or service complaint, please contact <span className="text-accent">{LEGAL_CONFIG.complaintsEmail}</span>. We acknowledge complaints within 2 business days and aim to provide a substantive response within 10 business days.
              </p>
            </div>
          </section>

          {/* 24. Governing Law and Jurisdiction */}
          <section id="section-24" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              24. Governing Law &amp; Jurisdiction
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                These Terms are governed by the laws of <strong>{LEGAL_CONFIG.governingLaw}</strong>. Disputes shall be subject to the jurisdiction of the <strong>{LEGAL_CONFIG.jurisdiction}</strong>, subject to mandatory consumer protections in your country of residence.
              </p>
            </div>
          </section>

          {/* 25. Changes to the Terms */}
          <section id="section-25" className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              25. Amendments to Terms
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We may update these Terms from time to time. Material updates will be notified via email or platform banner at least 14 days before taking effect. Continued use of the platform following the effective date constitutes acceptance.
              </p>
            </div>
          </section>

          {/* 26. Contact and Service */}
          <section id="section-26" className="space-y-4 pb-8">
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              26. Contact &amp; Legal Notices
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
