import { Shield, AlertTriangle, Activity } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function HongKongDisclaimerPage() {
  return (
    <main className="pt-28 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs 
           items={[
             { label: 'Hong Kong', href: '/hk' },
             { label: 'Regulatory Disclaimer', href: '/hk/disclaimer' }
           ]} 
        />
        
        <div className="max-w-4xl mt-12 space-y-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-warning">
               <AlertTriangle className="w-8 h-8" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">SFC ADVISORY</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-none">
              Risk <span className="text-mkt-i4">Disclosure.</span>
            </h1>
          </div>

          <div className="prose prose-invert prose-slate max-w-none space-y-12">
            <section className="space-y-6">
               <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">Not a Licensed Advisor</h2>
               <p className="text-lg text-mkt-i2 leading-relaxed">
                 Drawdown is an educational platform. We do not hold a license from the Securities and Futures Commission (SFC) of Hong Kong to provide financial advice or manage assets. All materials provided are for educational purposes and do not constitute an offer or solicitation to buy or sell any financial instrument.
               </p>
            </section>

            <section className="space-y-6">
               <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">Leveraged Trading Warning</h2>
               <p className="text-lg text-mkt-i2 leading-relaxed">
                 Trading in securities, futures, and leveraged foreign exchange involves significant risk. The market is volatile and prices can fluctuate widely. It is possible to lose more than your initial investment. You should only trade with risk capital that you can afford to lose.
               </p>
            </section>

            <section className="p-8 bg-white border border-mkt-bd flex gap-6 items-start">
               <Shield className="w-8 h-8 text-accent shrink-0" />
               <div>
                  <h3 className="font-sans font-bold uppercase mb-2">SFC Compliance</h3>
                  <p className="text-xs text-mkt-i4 leading-relaxed">We prioritize SFC-licensed brokers (Type 3 Leveraged Foreign Exchange) in our reviews and educational content for Hong Kong residents.</p>
               </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
