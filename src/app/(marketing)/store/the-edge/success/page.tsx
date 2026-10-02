import Link from "next/link";
import { Check, Download, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — The Edge Manual | Drawdown",
  description: "Your Edge Manual PDF is on its way. Check your email for the download link.",
};

export default function TheEdgeSuccessPage() {
  return (
    <div className="min-h-screen bg-[#08090D] text-[#E4E2DD] flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-[#818cf8]/10 border border-[#818cf8]/30 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-[#818cf8]" />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#818cf8]">// ORDER CONFIRMED</p>
          <h1 className="text-3xl font-bold uppercase">Your Edge Manual is ready.</h1>
          <p className="text-[#7A7D85]">
            Check your email — your download link for <strong className="text-[#E4E2DD]">The Edge Manual</strong> is waiting. If you don't see it within a few minutes, check your spam folder.
          </p>
        </div>

        <div className="p-6 bg-[#111318] border border-[#1A1D24] rounded-xl text-left space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-[#818cf8] font-bold">// NEXT STEPS</p>
          {[
            { icon: Download, text: "Download the PDF from your email and save it to your device or print it." },
            { icon: Check, text: "Read Chapter 1 today — Understanding Liquidity. It changes how you see every chart." },
            { icon: ArrowRight, text: "Log into your Drawdown dashboard to access your download at any time and track your progress." },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <step.icon className="w-4 h-4 mt-0.5 shrink-0 text-[#818cf8]" />
              <span className="text-sm text-[#7A7D85]">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/downloads"
            className="px-6 py-3 text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#818cf8" }}
          >
            Go to Downloads
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-[#1A1D24] text-[#E4E2DD] font-mono text-sm uppercase tracking-widest rounded-xl hover:border-[#333] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
