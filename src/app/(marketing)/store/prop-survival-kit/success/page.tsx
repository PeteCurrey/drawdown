"use client";

import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-2xl text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-profit/10 border border-profit/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-profit" />
        </div>

        <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-4">
          // PURCHASE CONFIRMED
        </p>
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-none mb-6">
          You're Armed. <br />
          <span className="text-text-primary">Now Execute.</span>
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-10">
          Your <strong className="text-text-primary">Prop Challenge Survival Kit</strong> is ready. Check your inbox — delivery lands within the next 2 minutes. Add <strong className="text-text-primary">thewire@drawdown.trading</strong> to your contacts to ensure delivery.
        </p>

        {/* What's next */}
        <div className="bg-background-surface border border-border-slate p-8 text-left mb-8 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-6">// NEXT STEPS</p>
          {[
            { step: "01", text: "Download the Max-Drawdown Calculator from your email and save it to Google Drive." },
            { step: "02", text: "Print the 30-Day Evaluation Checklist and stick it to your trading desk." },
            { step: "03", text: "Read 'The Tilt Protocol' once before your evaluation. Then read it again after your first loss." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 py-4 border-b border-border-slate/50 last:border-none">
              <span className="text-4xl font-display font-black text-text-tertiary/30">{item.step}</span>
              <p className="text-sm text-text-secondary leading-relaxed pt-2">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Upsell to Platform */}
        <div className="bg-background-surface border border-accent/30 p-8 mb-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-4">// COMPLETE THE SETUP</p>
          <h3 className="text-2xl font-display font-bold uppercase mb-3">Track Your Evaluation in Real-Time.</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            The Survival Kit handles your risk model. The <strong className="text-text-primary">AI Trade Journal</strong> handles your execution data. Log every trade, tag every emotion, and know exactly where your edge lives before your evaluation ends.
          </p>
          <Link href="/pricing" className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
            Start Edge Tier — 14-Day Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/prop-firms" className="px-6 py-3 border border-border-slate hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors text-xs font-bold uppercase tracking-widest">
            Back to Prop Firm Hub
          </Link>
          <Link href="/prop-firms/quiz" className="px-6 py-3 border border-border-slate hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors text-xs font-bold uppercase tracking-widest">
            Retake the Firm Quiz
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PropSurvivalKitSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-primary" />}>
      <SuccessContent />
    </Suspense>
  );
}
