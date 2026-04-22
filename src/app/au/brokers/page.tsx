import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { brokersAu } from "@/data/brokers-au";
import { BrokerCard } from "@/components/brokers/BrokerCard";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShieldCheck, Info, Zap } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "Best Brokers for Australian Traders — ASIC Regulated | Drawdown",
  description: "Compare the top ASIC-regulated forex and CFD brokers in Australia. Expert reviews of Pepperstone, IC Markets, FP Markets, and more. Built for AU traders.",
  path: "/au/brokers",
});

export default function AustralianBrokersPage() {
  return (
    <RegionalProvider region="au">
      <div className="pt-32 pb-24 bg-background-primary min-h-screen">
        <TrackPageView path="/au/brokers" />
        <div className="container mx-auto px-6">
          <Breadcrumbs />
          
          <header className="mb-16 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                Market Intelligence
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                Region: Australia (ASIC)
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-8 leading-tight">
              Best Brokers for <br />
              <span className="text-accent">Australian Traders.</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed font-sans">
              Australia is home to some of the world&apos;s most reputable brokers. Our team has reviewed the leading ASIC-regulated platforms based on execution speed, spread transparency, and local AUD funding options.
            </p>
          </header>

          {/* ASIC Warning Box */}
          <div className="mb-16 p-8 bg-background-elevated border border-border-slate flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
               <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-bold uppercase tracking-tight">ASIC Regulatory Standards</h3>
               <p className="text-sm text-text-tertiary leading-relaxed">
                 All brokers listed below hold an Australian Financial Services Licence (AFSL). Under ASIC rules, retail leverage is capped at 1:30 for major forex pairs and 1:20 for minors/gold. Client funds must be held in segregated trust accounts.
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {brokersAu.map((broker, i) => (
              <BrokerCard key={broker.slug} broker={broker} index={i} region="au" />
            ))}
          </div>

          <section className="mt-24 pt-24 border-t border-border-slate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold uppercase">Why Trade with an <br /> ASIC Broker?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Zap className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold uppercase text-sm mb-1">Local AUD Accounts</h4>
                      <p className="text-xs text-text-tertiary leading-relaxed">Avoid conversion fees by funding and withdrawing in Australian Dollars via NPP, Bpay, or local bank transfer.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-profit shrink-0" />
                    <div>
                      <h4 className="font-bold uppercase text-sm mb-1">Negative Balance Protection</h4>
                      <p className="text-xs text-text-tertiary leading-relaxed">Most ASIC-regulated brokers provide negative balance protection for retail clients, ensuring you can&apos;t lose more than your account balance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-background-surface border border-border-slate space-y-6">
                <Info className="w-8 h-8 text-text-tertiary" />
                <h3 className="text-xl font-display font-bold uppercase">ATO Tax Consideration</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Trading profits in Australia are generally treated as either personal income or capital gains, depending on whether you are classified as a &quot;trader&quot; or an &quot;investor&quot; by the ATO. Always consult with a qualified Australian tax professional.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </RegionalProvider>
  );
}
