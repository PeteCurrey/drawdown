import Link from "next/link";
import { Check, Download, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — Complete Manual Collection | Drawdown",
  description: "Your Drawdown Manual Bundle is ready. Check your email for download links.",
};

export default function ManualBundleSuccessPage() {
  return (
    <div className="min-h-screen bg-[#08090D] text-[#E4E2DD] flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-indigo-400" />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-indigo-400">// ORDER CONFIRMED</p>
          <h1 className="text-3xl font-bold uppercase">Your Manuals are ready.</h1>
          <p className="text-[#7A7D85]">
            Check your email — your download link for the <strong className="text-[#E4E2DD]">Complete Manual Collection</strong> is waiting. If you don't see it within a few minutes, check your spam folder.
          </p>
        </div>

        <div className="p-6 bg-[#111318] border border-[#1A1D24] rounded-xl text-left space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MANUALS UNLOCKED:</p>
          <div className="space-y-2 text-xs text-[#7A7D85]">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prop Firm Survival Kit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>How to Trade Manual</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>The Edge Manual</span>
            </div>
          </div>
          
          <hr className="border-[#1A1D24]" />
          
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#555] font-bold">// NEXT STEPS</p>
          {[
            { icon: Download, text: "Save the PDF download links from your email to your local drive or cloud storage." },
            { icon: ArrowRight, text: "Go to your Drawdown dashboard to access the interactive platform tools included." }
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <step.icon className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
              <span className="text-xs text-[#7A7D85]">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-500 text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-400 transition-colors text-center"
          >
            Access Dashboard
          </Link>
          <Link
            href="/store"
            className="px-6 py-3 border border-[#1A1D24] text-[#E4E2DD] font-mono text-sm uppercase tracking-widest rounded-xl hover:border-[#333] transition-colors text-center"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
