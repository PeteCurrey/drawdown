import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Download, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  Lock, 
  ShieldCheck,
  FileText,
  Bookmark
} from "lucide-react";
import { formatGBP } from "@/data/commercial-catalogue";

export const metadata = {
  title: "Drawdown Store — Premium Playbooks & Courses",
  description: "Bespoke systematic manuals, permanent PDF downloads, and systematic mini-courses by Pete Currey.",
};

const PRODUCTS = [
  {
    id: "prop-firm-survival-kit",
    slug: "prop-firm-survival-kit",
    title: "Prop Firm Survival Kit",
    subtitle: "The Evaluation Blueprint (100 Pages)",
    description: "Decoder rules, risk calculators, and exact position sizing grids for FTC/FTMO/5ers evaluations.",
    price: 4900,
    type: "manual",
    status: "active",
    accessType: "Permanent download",
    refundPolicy: "Case-by-case review",
    memberBenefit: "Free with Annual Foundation & Edge",
    accentColor: "#C8F135",
    tags: ["Prop Risk", "Rule Decoder"],
    standaloneUrl: "/store/prop-survival-kit",
    downloadSampleUrl: "/downloads/challenge-checklist.pdf"
  },
  {
    id: "how-to-trade",
    slug: "how-to-trade",
    title: "How to Trade Manual",
    subtitle: "Institutional Framework (100 Pages)",
    description: "Session liquidity theory, order flow footprint charts, execution logic, and professional risk models.",
    price: 7900,
    type: "manual",
    status: "active",
    accessType: "Permanent download",
    refundPolicy: "Case-by-case review",
    memberBenefit: "Free with Annual Foundation & Edge",
    accentColor: "#f97316",
    tags: ["Market Structure", "Order Flow"],
    standaloneUrl: "/store/how-to-trade",
    downloadSampleUrl: "/downloads/how-to-trade-sample.pdf"
  },
  {
    id: "the-edge",
    slug: "the-edge",
    title: "The Edge Manual",
    subtitle: "Advanced Setups & Execution Playbook",
    description: "Pete's bespoke playbook covering liquidity sweeps, premium order blocks, and live execution triggers.",
    price: 5900,
    type: "manual",
    status: "active",
    accessType: "Permanent download",
    refundPolicy: "Case-by-case review",
    memberBenefit: "Free with Annual Edge",
    accentColor: "#818cf8",
    tags: ["Setups", "Execution"],
    standaloneUrl: "/store/the-edge",
    downloadSampleUrl: "/downloads/edge-manual-sample.pdf"
  },
  {
    id: "deploy-your-algo",
    slug: "deploy-your-algo",
    title: "Deploy Your Algo Mini-Course",
    subtitle: "From Pine Script to Broker Automation",
    description: "Complete curriculum mapping technical rules, script optimization, webhooks, and broker routing.",
    price: 9700,
    type: "course",
    status: "active",
    accessType: "Permanent platform access",
    refundPolicy: "Case-by-case review",
    memberBenefit: "Free with Annual Edge",
    accentColor: "#ec4899",
    tags: ["Automation", "Pine Script"],
    standaloneUrl: "/courses/deploy-your-algo",
    downloadSampleUrl: null
  }
];

const FREE_RESOURCES = [
  {
    title: "Drawdown Risk Management Guide",
    format: "PDF Document",
    size: "1.4 MB",
    downloadUrl: "/downloads/risk-management-guide.pdf",
  },
  {
    title: "30-Day Prop Evaluation Checklist",
    format: "PDF Checklist",
    size: "850 KB",
    downloadUrl: "/downloads/challenge-checklist.pdf",
  },
  {
    title: "Prop Firm Comparison Matrix",
    format: "Excel Worksheet",
    size: "230 KB",
    downloadUrl: "/downloads/prop-firm-comparison-sheet.xlsx",
  },
  {
    title: "Institutional Trade Journal Template",
    format: "Excel Template",
    size: "250 KB",
    downloadUrl: "/downloads/trading-journal-template.xlsx",
  },
];

export default function StorePage() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold uppercase tracking-widest">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-700" />
            Drawdown Store
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-sans">
            Bespoke Manuals &amp; Mini-Courses
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Enhance your trading desk with standalone manuals and systematic playbooks.
            Available as one-time permanent purchases or included with annual plans.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {PRODUCTS.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: prod.accentColor }} 
                    />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {prod.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {prod.accessType}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                    {prod.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    {prod.subtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {prod.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {prod.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and CTA */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                      Tuition / Price
                    </span>
                    <span className="text-3xl font-black font-mono text-slate-900">
                      {formatGBP(prod.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">
                      Refund Policy
                    </span>
                    <span className="text-xs text-slate-500 font-sans">
                      {prod.refundPolicy}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded text-[11px] font-sans text-amber-900 flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{prod.memberBenefit}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {prod.downloadSampleUrl ? (
                    <a 
                      href={prod.downloadSampleUrl} 
                      download
                      className="py-3 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 text-center font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Sample
                    </a>
                  ) : (
                    <div className="py-3 bg-slate-50 border border-slate-200 text-slate-400 text-center font-mono font-bold text-xs uppercase tracking-wider rounded">
                      No Sample
                    </div>
                  )}
                  <Link 
                    href={prod.standaloneUrl}
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-mono font-extrabold text-xs uppercase tracking-wider rounded text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    Get Access <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle Card */}
        <section className="bg-slate-900 text-white rounded-xl p-8 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C8F135]">
              Bundle Deal — All Three Manuals
            </span>
            <h2 className="text-3xl font-black tracking-tight font-sans">
              Complete Manual Collection
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg font-sans">
              Get the Prop Firm Survival Kit, How to Trade Manual, and The Edge Manual in one permanent PDF bundle. Save £58 compared with buying them individually.
            </p>
          </div>
          <div className="text-center shrink-0">
            <div className="text-xs font-mono text-slate-400 mb-1">
              Individual total: £187 &nbsp;·&nbsp;{" "}
              <span className="text-[#C8F135] font-bold">Save £58</span>
            </div>
            <div className="text-5xl font-black font-mono text-white mb-4">
              £129
            </div>
            <Link
              href="/store/manual-bundle"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#C8F135] text-slate-900 font-mono font-extrabold text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-colors"
            >
              Get Bundle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Free Downloads Strip */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm mb-16">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              Free PDF Downloads &amp; Worksheets
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {FREE_RESOURCES.map((item, idx) => (
              <a
                key={idx}
                href={item.downloadUrl}
                download
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-400 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {item.format} · {item.size}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors font-sans">
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 font-bold">
                  <Download className="w-3 h-3" /> Free download
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Membership CTA */}
        <section className="p-8 bg-slate-100 border border-slate-200 rounded-2xl max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-950 font-sans tracking-tight">
            Looking for complete access?
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-sans">
            Foundation and Edge memberships include specified manuals and courses as part of their annual plans. Compare memberships to find the right fit for your desk.
          </p>
          <div className="pt-2">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-slate-900 text-white font-mono font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              Compare Membership Plans <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
