import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = getMetadata({
  title: "Privacy Policy",
  description: "How we handle your data at Drawdown.",
});

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <Breadcrumbs />
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Privacy Policy</h1>
          <p className="text-text-tertiary font-mono uppercase tracking-widest text-xs">Last Updated: April 14, 2026</p>
        </header>

        <div className="prose prose-invert prose-drawdown max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">1. Information We Collect</h2>
            <p>
              At Drawdown, we collect information that you provide directly to us when you create an account, subscribe to our newsletter, or purchase a Tier. This includes your name, email address, and billing information (processed securely through Stripe).
            </p>
            <p>
              We also collect data through your use of our platform, including your trade journal entries (if using the AI Trade Journal) and analysis requested from our scanner tools.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">2. How We Use Your Data</h2>
            <p>
              Your data is used solely to provide and improve our educational services. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To manage your subscription and provide access to gated curriculum phases.</li>
              <li>To provide personalised AI-driven analysis of your trading behavior.</li>
              <li>To send you "The Wire" daily briefing and platform updates (you can unsubscribe at any time).</li>
              <li>To improve our tools based on aggregated, anonymized usage patterns.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">3. Data Security & Storage</h2>
            <p>
              We prioritize the security of your trading data. We use industry-standard encryption and secure cloud infrastructure (Supabase) to protect your information. We do not store your credit card details; all payments are handled by Stripe, a Tier 1 PCI-compliant payment processor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">4. Cookies & Tracking</h2>
            <p>
              We use essential cookies to maintain your login session and track platform performance. We do not use intrusive tracking or sell your data to third-party advertisers. We hate gurus, and we hate spam.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">5. Your Rights</h2>
            <p>
              Under GDPR, you have the right to access, rectify, or delete your personal data. You can export your trade journal data at any time from your profile dashboard.
            </p>
          </section>

          <section className="p-8 bg-background-elevated border border-border-slate">
            <h3 className="text-sm font-display font-bold uppercase mb-2 text-text-primary">Contact Us regarding privacy</h3>
            <p className="text-xs">
              If you have any questions about this policy, please email us at <span className="text-accent">privacy@drawdown.trade</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
