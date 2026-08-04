import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { ShieldCheck, Lock, Eye, Download, Trash2, ExternalLink, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Privacy Policy | Drawdown",
  description: "Drawdown Privacy Policy explaining how Black & Rowan Management Group Limited collects, processes, protects, and retains your data under UK GDPR.",
  alternates: { canonical: "https://drawdown.trading/privacy" },
});

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <Lock size={14} />
                UK GDPR &amp; Data Protection Compliance
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Privacy <span style={{ color: "var(--graphite-600)" }}>Policy</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Last Updated: {LEGAL_CONFIG.effectiveDate} · Document Version: {LEGAL_CONFIG.documentVersion}
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">

          {/* 1. Data Controller */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. Data Controller &amp; Contact Details
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                The Data Controller responsible for your personal data under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018 is <strong>{LEGAL_CONFIG.fullTradingEntity}</strong>.
              </p>
              <div className="p-6 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <p className="text-[13px] font-mono font-bold text-slate-900">
                  Data Privacy Contact: <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`} className="text-accent underline">{LEGAL_CONFIG.privacyEmail}</a>
                </p>
                <p className="text-[13px]">
                  Correspondence Address: {LEGAL_CONFIG.tradingAddress}
                </p>
                <p className="text-[12px] text-slate-500 italic">
                  Note: Given the scale and nature of our processing operations, Drawdown is not required to appoint a formal Data Protection Officer (DPO). All privacy queries are handled directly by our designated privacy team.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Categories of Data Collected */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. Categories of Personal Data We Process
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We collect personal data that you provide directly, data generated automatically through platform usage, and payment metadata from our secure payment processors.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[13px]">
                <li><strong>Identity &amp; Contact Data:</strong> Name, email address, country of residence, user account ID.</li>
                <li><strong>Subscription &amp; Payment Metadata:</strong> Payment status, currency, billing cycle, Stripe customer ID (raw card details are processed directly by Stripe).</li>
                <li><strong>Trading &amp; Journal Data:</strong> Trade journal logs, strategy notes, uploaded CSV statement files, risk parameters, and indicator preferences.</li>
                <li><strong>AI Analysis &amp; Prompts:</strong> Text prompts and trade metadata submitted to AI trade analysis tools.</li>
                <li><strong>Technical &amp; Session Logs:</strong> IP address (hashed where applicable), browser type, device identifiers, session timestamps, and security access logs.</li>
                <li><strong>Marketing &amp; Consent Records:</strong> Newsletter opt-ins, email preferences, cookie consent timestamps, and versioned terms acceptance records.</li>
              </ul>
            </div>
          </section>

          {/* 3. Purpose & Lawful Basis Table */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. Processing Purposes &amp; Lawful Bases Table
            </h2>
            <div className="overflow-x-auto border" style={{ borderColor: "var(--line-200)" }}>
              <table className="w-full text-[13px] text-left border-collapse">
                <thead>
                  <tr className="border-b font-mono uppercase tracking-[0.05em]" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}>
                    <th className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Processing Purpose</th>
                    <th className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Data Used</th>
                    <th className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Lawful Basis (UK GDPR)</th>
                    <th className="p-3">Key Processors</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--graphite-600)" }}>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Account Creation &amp; Authentication</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Name, email, password hash</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Contract Execution (Art 6(1)(b))</td>
                    <td className="p-3">Supabase</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Subscription Billing &amp; Invoicing</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Payment metadata, billing address</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Contract Execution (Art 6(1)(b)) &amp; Legal Obligation (Art 6(1)(c))</td>
                    <td className="p-3">Stripe</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>AI Trade Journal Analysis</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Pseudonymised journal entries &amp; setups</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Contract Execution (Art 6(1)(b))</td>
                    <td className="p-3">Anthropic, OpenAI</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Transactional Emails &amp; Security Alerts</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Email, name, delivery status</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Contract Execution (Art 6(1)(b))</td>
                    <td className="p-3">Resend</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: "var(--line-200)" }}>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Direct Marketing Updates</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Email, marketing consent record</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Consent (Art 6(1)(a))</td>
                    <td className="p-3">Resend</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r font-medium" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>Security &amp; Fraud Prevention</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>IP address, session logs, User Agent</td>
                    <td className="p-3 border-r" style={{ borderColor: "var(--line-200)" }}>Legitimate Interests (Art 6(1)(f))</td>
                    <td className="p-3">Supabase, Vercel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. AI Processing & Profiling */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              4. AI Processing, Privacy &amp; Model Safeguards
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                When you use our AI Trade Journal or Strategy tools, pseudonymised setup parameters are processed via API endpoints powered by Anthropic and OpenAI.
              </p>
              <div className="p-6 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="text-[13px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                  Our AI Data Principles:
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-[13px]">
                  <li><strong>Zero Public Model Training:</strong> Your trade journals, private strategies, and broker statements are NOT used to train public AI models.</li>
                  <li><strong>Pseudonymisation:</strong> Prompts strip personal contact identifiers before processing.</li>
                  <li><strong>No Automated Decisions with Legal Effects:</strong> AI tools provide analytical feedback only. Drawdown does not execute automated trades or make credit decisions.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. International Data Transfers */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              5. International Data Transfers
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Where third-party service providers process data outside the UK (such as US-based API endpoints), transfers are protected using UK adequacy decisions, the UK International Data Transfer Agreement (IDTA), or the UK Addendum to the EU Standard Contractual Clauses (SCCs).
              </p>
            </div>
          </section>

          {/* 6. Data Retention Schedule */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              6. Data Retention Schedule
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We retain personal data only for as long as necessary to fulfill processing purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[13px]">
                <li><strong>Active Account Data:</strong> Duration of your active account subscription.</li>
                <li><strong>Closed Account Operational Data:</strong> Purged within 30 days of confirmed account deletion.</li>
                <li><strong>Billing &amp; Financial Transaction Records:</strong> Retained for 6 years to satisfy UK statutory tax obligations.</li>
                <li><strong>Support Correspondence:</strong> Retained for 2 years following closure of the request.</li>
                <li><strong>Security &amp; IP Access Logs:</strong> Retained for up to 12 months.</li>
                <li><strong>Encrypted Backups:</strong> Rotated and deleted within a maximum 90-day cycle.</li>
              </ul>
            </div>
          </section>

          {/* 7. Individual Rights */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              7. Your Rights Under UK GDPR
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Under UK GDPR, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-[13px]">
                <li><strong>Right of Access (Subject Access Request):</strong> Request a copy of the personal data held about you.</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</li>
                <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request deletion of your account and personal data.</li>
                <li><strong>Right to Restrict Processing:</strong> Request restriction of processing under specific circumstances.</li>
                <li><strong>Right to Data Portability:</strong> Export your data in a structured, machine-readable format (JSON/CSV).</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing emails at any time via email footer links.</li>
              </ul>
              <p className="text-[13px]">
                To exercise any right, email us at <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`} className="text-accent underline">{LEGAL_CONFIG.privacyEmail}</a>. We respond to valid requests within one calendar month free of charge.
              </p>
            </div>
          </section>

          {/* 8. Data Export & Account Deletion Tools */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              8. Self-Service Data Export &amp; Account Deletion
            </h2>
            <div className="p-6 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <div className="space-y-2">
                <h3 className="text-[14px] font-mono font-bold uppercase tracking-[0.08em] flex items-center gap-2" style={{ color: "var(--ink-950)" }}>
                  <Download size={16} /> Data Export Tool
                </h3>
                <p className="text-[13px]" style={{ color: "var(--graphite-600)" }}>
                  You can download your complete account profile, trade journal logs, and saved preferences at any time from <strong>Account Settings → Data Export</strong>.
                </p>
              </div>
              <div className="space-y-2 border-t pt-4" style={{ borderColor: "var(--line-200)" }}>
                <h3 className="text-[14px] font-mono font-bold uppercase tracking-[0.08em] flex items-center gap-2" style={{ color: "var(--ink-950)" }}>
                  <Trash2 size={16} /> Account Deletion Workflow
                </h3>
                <p className="text-[13px]" style={{ color: "var(--graphite-600)" }}>
                  To permanently delete your Drawdown account and associated operational data, navigate to <strong>Account Settings → Security → Delete Account</strong> or email <span className="text-accent">{LEGAL_CONFIG.privacyEmail}</span>.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Security & Incidents */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              9. Security Controls &amp; Incident Reporting
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                We implement technical and organizational security measures including TLS encryption in transit, encrypted storage, row-level database authorization, and secret management.
              </p>
              <p className="text-[13px]">
                To report a potential security issue or vulnerability, email <span className="text-accent">{LEGAL_CONFIG.securityEmail}</span>. We commit to working constructively with responsible security researchers.
              </p>
            </div>
          </section>

          {/* 10. ICO Complaint Rights */}
          <section className="space-y-4 pb-8">
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              10. Right to Complain to the ICO
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                If you have concerns about how we handle your personal data, you have the right to lodge a complaint with the UK Information Commissioner’s Office (ICO).
              </p>
              <div className="p-4 border inline-flex items-center gap-3 text-[13px] font-mono" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <span>Official ICO Website:</span>
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-accent underline flex items-center gap-1">
                  https://ico.org.uk <ExternalLink size={12} />
                </a>
              </div>
              <p className="text-[12px] text-slate-500">
                We encourage you to contact us first so we can resolve any privacy concerns promptly.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
