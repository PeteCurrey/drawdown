import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export const metadata = getMetadata({
  title: "Risk Disclaimer",
  description: "Important risk warnings and educational disclaimer for Drawdown users.",
});

export default function DisclaimerPage() {
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <Breadcrumbs />
        
        <header className="mb-16">
          <div className="flex items-center gap-3 text-warning mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase">Risk Disclaimer</h1>
          </div>
          <p className="text-text-tertiary font-mono uppercase tracking-widest text-xs">Last Updated: April 14, 2026</p>
        </header>

        <div className="prose prose-invert prose-drawdown max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section className="p-8 bg-warning/5 border border-warning/20 space-y-4">
            <div className="flex items-center gap-2 text-warning mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-display font-bold uppercase m-0">Extremely Important: High Risk Warning</h2>
            </div>
            <p className="text-sm italic">
              Trading financial instruments, including forex, stocks, and cryptocurrencies, carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
            </p>
            <p className="text-sm font-bold border-t border-warning/10 pt-4">
              The possibility exists that you could sustain a loss of some or all of your initial investment. You should not invest money that you cannot afford to lose.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">1. Not Financial Advice</h2>
            <p>
              Drawdown is a trading education and software platform. All content provided, including courses, blog posts, AI-generated analysis, and community discussions, is for <strong>educational purposes only</strong>. 
            </p>
            <p>
              Pete (Founder) and the Drawdown team are not licensed financial advisors. We do not provide personalised investment recommendations, trade signals, or managed account services. Any trades you place are solely your responsibility.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">2. Accuracy of Information</h2>
            <p>
              While we strive to ensure that all educational content and AI tools are accurate and up-to-date, Drawdown makes no warranties regarding the completeness or accuracy of any information provided. The markets are dynamic and subject to sudden change. Past performance as logged in your Trade Journal is not indicative of future results.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">3. AI Tool Limitations</h2>
            <p>
              Our AI Trade Journal and Market Scanner are designed to assist in pattern recognition and data organization. They are algorithms, not crystal balls. They can fail, give false signals, or misinterpret data. Never rely solely on an automated tool to make a trading decision.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold uppercase text-text-primary">4. Testimonials & Performance</h2>
            <p>
              Any results, testimonials, or P&L screenshots shared within the community or on marketing pages represent individual experiences. Your results will vary depending on your starting work ethic, capital, and emotional discipline.
            </p>
          </section>

          <section className="p-8 bg-background-elevated border border-border-slate text-center">
            <p className="text-xs font-mono uppercase tracking-widest leading-relaxed">
              By using Drawdown, you acknowledge that you have read and understood these risks and agree to take full responsibility for your own financial decisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
