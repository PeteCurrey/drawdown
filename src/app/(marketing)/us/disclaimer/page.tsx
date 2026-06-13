import { Shield, AlertTriangle, Activity, Target } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function UnitedStatesDisclaimerPage() {
  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs 
           items={[
             { label: 'United States', href: '/us' },
             { label: 'Regulatory Disclaimer', href: '/us/disclaimer' }
           ]} 
        />
        
        <div className="max-w-4xl mt-12 space-y-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-warning">
               <AlertTriangle className="w-8 h-8" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">CFTC RULE 4.41</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-none">
              Risk <span className="text-text-tertiary">Disclosure.</span>
            </h1>
          </div>

          <div className="prose prose-invert prose-slate max-w-none space-y-12">
            <section className="p-8 border border-warning/20 space-y-6">
               <h2 className="text-xl font-sans font-bold uppercase m-0 text-warning">Mandatory CFTC Disclosure</h2>
               <p className="text-[10px] font-mono uppercase leading-relaxed text-text-secondary m-0">
                 HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS, SOME OF WHICH ARE DESCRIBED BELOW. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN. IN FACT, THERE ARE FREQUENTLY SHARP DIFFERENCES BETWEEN HYPOTHETICAL PERFORMANCE RESULTS AND THE ACTUAL RESULTS SUBSEQUENTLY ACHIEVED BY ANY PARTICULAR TRADING PROGRAM.
               </p>
               <p className="text-[10px] font-mono uppercase leading-relaxed text-text-secondary m-0">
                 ONE OF THE LIMITATIONS OF HYPOTHETICAL PERFORMANCE RESULTS IS THAT THEY ARE GENERALLY PREPARED WITH THE BENEFIT OF HINDSIGHT. IN ADDITION, HYPOTHETICAL TRADING DOES NOT INVOLVE FINANCIAL RISK, AND NO HYPOTHETICAL TRADING RECORD CAN COMPLETELY ACCOUNT FOR THE IMPACT OF FINANCIAL RISK IN ACTUAL TRADING.
               </p>
            </section>

            <section className="space-y-6">
               <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">No Income Claims</h2>
               <p className="text-lg text-text-secondary leading-relaxed">
                 Drawdown does not make any promises, guarantees, or claims regarding your potential income or success in the markets. Trading is a high-risk activity where the majority of retail participants lose money. The education provided is for informational purposes only and should not be construed as financial advice.
               </p>
            </section>

            <section className="space-y-6">
               <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">Not a Registered Advisor</h2>
               <p className="text-lg text-text-secondary leading-relaxed">
                 Drawdown is an educational platform and software provider. We are not a registered investment advisor (RIA) with the SEC or a Commodity Trading Advisor (CTA) with the CFTC. We do not manage client funds or provide specific trade signals.
               </p>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
             <div className="p-8 border border-border-slate/50 flex gap-6 items-start">
                <Shield className="w-8 h-8 text-accent shrink-0" />
                <div>
                   <h3 className="font-sans font-bold uppercase mb-2">SEC/FINRA</h3>
                   <p className="text-xs text-text-tertiary leading-relaxed">We adhere to US securities laws regarding the dissemination of educational materials on equities and options.</p>
                </div>
             </div>
             <div className="p-8 border border-border-slate/50 flex gap-6 items-start">
                <Activity className="w-8 h-8 text-accent shrink-0" />
                <div>
                   <h3 className="font-sans font-bold uppercase mb-2">CFTC/NFA</h3>
                   <p className="text-xs text-text-tertiary leading-relaxed">Our forex and futures content is strictly educational and compliant with NFA member guidelines.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
