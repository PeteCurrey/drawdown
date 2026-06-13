"use client";

import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 max-w-2xl text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-profit/10 border border-profit/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-mkt-grn" />
        </div>

        <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-4">
          // PURCHASE CONFIRMED
        </p>
        <h1 className="  font-sans font-black uppercase tracking-tight leading-none mb-6">
          You're Armed. <br />
          <span className="text-mkt-ink">Now Execute.</span>
        </h1>
        <p className="text-lg text-mkt-i2 leading-relaxed mb-10">
          Your <strong className="text-mkt-ink">Prop Challenge Survival Kit</strong> is ready. Check your inbox — delivery lands within the next 2 minutes. Add <strong className="text-mkt-ink">thewire@drawdown.trading</strong> to your contacts to ensure delivery.
        </p>

        {/* What's next */}
        <div className="bg-white border border-mkt-bd p-8 text-left mb-8 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-6">// NEXT STEPS</p>
          {[
            { step: "01", text: "Download the Max-Drawdown Calculator from your email and save it to Google Drive." },
            { step: "02", text: "Print the 30-Day Evaluation Checklist and stick it to your trading desk." },
            { step: "03", text: "Read 'The Tilt Protocol' once before your evaluation. Then read it again after your first loss." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 py-4 border-b border-mkt-bd/50 last:border-none">
              <span className="text-4xl font-sans font-black text-mkt-i4/30">{item.step}</span>
              <p className="text-sm text-mkt-i2 leading-relaxed pt-2">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Upsell to Platform */}
        <div className="bg-white border border-mkt-bd/30 p-8 mb-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-4">// COMPLETE THE SETUP</p>
          <h3 className="text-2xl font-sans font-bold uppercase mb-3">Track Your Evaluation in Real-Time.</h3>
          <p className="text-sm text-mkt-i2 leading-relaxed mb-6">
            The Survival Kit handles your risk model. The <strong className="text-mkt-ink">AI Trade Journal</strong> handles your execution data. Log every trade, tag every emotion, and know exactly where your edge lives before your evaluation ends.
          </p>
          <Link href="/pricing" className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
            Start Edge Tier — 14-Day Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/prop-firms" className="px-6 py-3 border border-mkt-bd hover:border-text-primary text-mkt-i2 hover:text-mkt-ink transition-colors text-xs font-bold uppercase tracking-widest">
            Back to Prop Firm Hub
          </Link>
          <Link href="/prop-firms/quiz" className="px-6 py-3 border border-mkt-bd hover:border-text-primary text-mkt-i2 hover:text-mkt-ink transition-colors text-xs font-bold uppercase tracking-widest">
            Retake the Firm Quiz
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PropSurvivalKitSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SuccessContent />
    </Suspense>
  );
}
