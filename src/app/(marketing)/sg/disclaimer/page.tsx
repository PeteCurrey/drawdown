import { Shield, AlertTriangle, Activity } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function SingaporeDisclaimerPage() {
  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs 
           items={[
             { label: 'Singapore', href: '/sg' },
             { label: 'Regulatory Disclaimer', href: '/sg/disclaimer' }
           ]} 
        />
        
        <div className="max-w-4xl mt-12 space-y-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-warning">
               <AlertTriangle className="w-8 h-8" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">MAS ADVISORY</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-none">
              Risk <span className="text-text-tertiary">Disclosure.</span>
            </h1>
          </div>

          <div className="prose prose-invert prose-invert max-w-none space-y-12">
            <section className="space-y-6">
               <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">Not a Financial Advisor</h2>
               <p className="text-lg text-text-secondary leading-relaxed">
                 Drawdown is an educational platform and software provider. We are not licensed as a financial advisor by the Monetary Authority of Singapore (MAS). The content provided is strictly for educational and informational purposes and does not constitute financial advice, investment recommendations, or an offer to sell securities.
               </p>
            </section>

            <section className="space-y-6">
               <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">High Risk Investment Warning</h2>
               <p className="text-lg text-text-secondary leading-relaxed">
                 Trading in leveraged financial instruments such as Forex and CFDs carries a high level of risk and may not be suitable for all investors. You may lose more than your initial deposit. Please ensure you fully understand the risks involved and seek independent advice if necessary.
               </p>
            </section>

            <section className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 flex gap-6 items-start">
               <Shield className="w-8 h-8 text-accent shrink-0" />
               <div>
                  <h3 className="font-sans font-bold uppercase mb-2">MAS Compliance</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">We strictly recommend MAS-regulated entities for Singaporean residents to ensure the highest level of capital protection and regulatory oversight.</p>
               </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
