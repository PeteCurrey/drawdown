"use client";

import { 
  Building2, 
  Handshake, 
  Users, 
  Target, 
  BarChart4, 
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Briefcase
} from "lucide-react";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="pt-12 pb-24 bg-white min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-24 text-center lg:text-left">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// PARTNERSHIPS</span>
          <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8">
            Growth Through <br className="hidden md:block" /> Integrity.
          </h1>
          <p className="text-xl text-mkt-i2 max-w-3xl leading-relaxed">
            Drawdown doesn't just host ads. We build deep integrations with brokers, prop firms, and fintech tools that share our commitment to data-driven trading and user protection.
          </p>
        </div>

        {/* Categories of Partners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Prop Firms",
              desc: "Integration with funded account providers to track student performance directly.",
              icon: Target
            },
            {
              title: "Institutional Brokers",
              desc: "Direct-to-platform trading access and execution for our active community.",
              icon: Building2
            },
            {
              title: "Fintech Tools",
              desc: "API-level connectivity with journaling, tax, and analysis software.",
              icon: BarChart4
            }
          ].map((cat, i) => (
            <div key={i} className="p-10 bg-white border border-mkt-bd flex flex-col gap-6 group hover:border-mkt-bds/30 transition-premium">
              <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-sans font-bold uppercase">{cat.title}</h3>
              <p className="text-sm text-mkt-i4 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Partner Section */}
        <div className="bg-[#F7F7F7] border border-mkt-bd p-12 md:p-24 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl md:text-5xl font-sans font-bold uppercase">The Drawdown <br /> Advantage.</h2>
               <div className="space-y-6">
                  {[
                    "Highly engaged UK-based trading audience.",
                    "Premium brand positioning (no retail hype).",
                    "Data-driven verification of student success.",
                    "Direct API integration opportunities."
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-2 h-2 bg-accent rounded-full" />
                       <span className="text-sm font-bold uppercase tracking-wide text-mkt-ink">{item}</span>
                    </div>
                  ))}
               </div>
               <div className="pt-8">
                  <button className="px-10 py-5 bg-mkt-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                     Apply to Partner
                  </button>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "Active Users", val: "2.4k+" },
                 { label: "Monthly Clicks", val: "150k" },
                 { label: "Avg. Deposit", val: "£2.5k" },
                 { label: "UK Reach", val: "90%" }
               ].map((stat, i) => (
                 <div key={i} className="p-8 border border-mkt-bd/50 bg-white/30 flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl font-sans font-black text-accent">{stat.val}</span>
                    <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">{stat.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-24 border-t border-mkt-bd/50">
           <h2 className="text-3xl md:text-5xl font-sans font-bold uppercase mb-8">Build the Future of <br /> Trading With Us.</h2>
           <p className="text-mkt-i4 mb-12 max-w-xl mx-auto uppercase font-mono tracking-widest text-xs">
             contact@drawdown.trading // partner inquiries only
           </p>
           <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:underline">
              Get in Touch <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </div>
  );
}
