import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = getMetadata({
  title: "Accelerator Terms of Enrolment",
  description: "Terms and conditions for enrolling in the Drawdown Institutional Accelerator cohort.",
});

export default function AcceleratorAgreementPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-background-primary text-text-primary">
      <div className="max-w-7xl mx-auto px-6 max-w-4xl">
        <Breadcrumbs />
        
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E2B755]/10 border border-[#E2B755]/20 text-[#E2B755] text-xs font-semibold uppercase tracking-wider mb-4">
            Cohort Student Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-bold uppercase mb-4 text-text-primary">
            Accelerator Terms of Enrolment
          </h1>
          <p className="text-text-tertiary font-mono uppercase tracking-widest text-xs">
            Last Updated: August 3, 2026
          </p>
        </header>

        <div className="prose prose-drawdown max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-sans font-bold uppercase text-text-primary">
              1. Educational Scope & FCA Disclaimer
            </h2>
            <p>
              The Drawdown Institutional Accelerator (the "Program") is a 6-week intensive educational and quantitative training cohort. Drawdown Trading ("the Company") is not a financial adviser, wealth manager, or investment broker. We do not provide personalized financial, trading, tax, or investment advice.
            </p>
            <p>
              All materials, indicators, spreadsheets, Pine Script codes, central bank analysis guides, and live session contents are designed strictly for educational, research, and general information purposes. 
            </p>
            <p className="border-l-2 border-[#E2B755] pl-4 italic bg-[#E2B755]/5 py-2 pr-2 text-sm">
              <strong>FCA Warning:</strong> Financial trading carries a high degree of risk. Past performance is not indicative of future results. Leverage can magnify losses. You trade entirely at your own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-sans font-bold uppercase text-text-primary">
              2. Intellectual Property & Code Licensing
            </h2>
            <p>
              During the Program, you will gain access to proprietary software tools (including the Drawdown Strategy Backtester, AI Journaling Prompt Suite, and custom indicators) and source code (Pine Script libraries, automated alert integrations).
            </p>
            <p>
              The Company grants you a individual, non-exclusive, non-transferable, and revocable license to use these resources for personal execution only. You strictly agree <strong>NOT to</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sell, redistribute, lease, license, or sub-license the Pine Script source code or spreadsheet templates.</li>
              <li>Share cohort live webinars, recordings, or credentials with anyone outside the active cohort.</li>
              <li>Reverse engineer, disassemble, or extract raw logic from proprietary compiled components.</li>
            </ul>
            <p>
              Breach of this section results in immediate termination from the Program and revocation of all software licenses, without a refund, and may trigger legal action under UK intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-sans font-bold uppercase text-text-primary">
              3. Refund Policy
            </h2>
            <p>
              The Accelerator is a structured live cohort with limited seats and preparation overhead. As a result, refund requests are handled on a case-by-case basis at the sole discretion of Drawdown Trading Ltd. No refunds are guaranteed or implied.
            </p>
            <p>
              If you believe your circumstances merit a refund, you must submit a written request to <strong>support@drawdown.trading</strong> within 7 calendar days of cohort commencement. Drawdown Trading Ltd will review the request and respond within 5 business days. We do not issue refunds after 7 days from cohort start under any circumstances.
            </p>
            <p>
              Acceptance of a place following admissions review constitutes agreement to these terms. Accessing cohort workshop recordings, live sessions, or proprietary materials after commencement forfeit any refund eligibility.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-sans font-bold uppercase text-text-primary">
              4. Prop Firm Evaluation Rules & Software Integrations
            </h2>
            <p>
              Week 5 covers third-party proprietary trading firm challenges (such as FTMO, 5ers, Funding Pips). The Company does not guarantee that you will pass evaluations or obtain funded payouts. 
            </p>
            <p>
              Third-party prop firms are independent business entities with their own rules, terms of service, and consistency metrics. It is your sole responsibility to comply with their drawdown rules, and the Company is not liable for any account breaches, fee losses, or payout rejections arising from trading operations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-sans font-bold uppercase text-text-primary">
              5. Legal Structures & UK Taxation Disclosure
            </h2>
            <p>
              Week 5 & 6 education covers corporate tax structures (Sole Trader vs Limited Company) and allowable UK business deductions. This material is designed to provide general information on HMRC guidelines for business traders. 
            </p>
            <p>
              It is not official tax advice, legal representation, or a corporate accounting audit. We recommend consulting a chartered certified accountant (ACCA) or qualified tax specialist in your local jurisdiction regarding your personal corporation, VAT filings, and income declaration.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-sans font-bold uppercase text-text-primary">
              6. Cohort Code of Conduct & Live Session Rules
            </h2>
            <p>
              To maintain a supportive environment, all students must adhere to basic rules during live interactive sessions, community chat spaces, and review cohorts:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Zero tolerance for toxic, disruptive, or discriminatory behavior towards coaches or peers.</li>
              <li>Respecting proprietary trade queries and keeping chatrooms strictly professional.</li>
              <li>No solicitation, promotion of outside signals, or affiliate link drops.</li>
            </ul>
            <p>
              Violating the student code of conduct may result in a temporary suspension or permanent removal from the cohort group without a refund.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
