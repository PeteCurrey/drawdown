"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Loader2, MailQuestion } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnsubscribe = async () => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No security token was provided. Please check the link in your email footer.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to unsubscribe");
      }

      setEmail(data.email || "");
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0F111A] border border-[#1C1F2B] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Cyan top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#00C2FF]" />

      <div className="text-center space-y-6">
        <Link href="/" className="inline-block text-xl font-sans font-black tracking-tighter text-white">
          DRAWDOWN<span className="text-[#00C2FF]">.</span>
        </Link>

        {status === "idle" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-[#00C2FF]/10 rounded-full flex items-center justify-center mx-auto">
              <MailQuestion className="w-6 h-6 text-[#00C2FF]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-sans font-bold text-white uppercase tracking-tight">Unsubscribe from The Wire</h1>
              <p className="text-sm text-[#8C8B87]">
                Are you sure you want to stop receiving Pete's twice-daily market intelligence and educational emails?
              </p>
            </div>
            <button
              onClick={handleUnsubscribe}
              className="w-full py-3 bg-transparent border border-[#00C2FF] hover:bg-[#00C2FF] hover:text-[#08090D] text-[#00C2FF] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
            >
              CONFIRM UNSUBSCRIBE
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#00C2FF] animate-spin" />
            <p className="text-sm text-[#8C8B87] font-mono uppercase tracking-widest">Processing request...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-sans font-bold text-white uppercase tracking-tight">Unsubscribed</h1>
              <p className="text-sm text-[#8C8B87]">
                {email ? <span className="text-white font-medium">{email}</span> : "You"} have been successfully unsubscribed from all active mailings.
              </p>
              <p className="text-xs text-[#5C5B57] pt-2">
                You can resubscribe at any time from your account settings inside the Drawdown Terminal.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-[#161824] hover:bg-[#1E2130] text-white text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200"
            >
              Return to Platform
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-sans font-bold text-white uppercase tracking-tight">Request Failed</h1>
              <p className="text-sm text-[#8C8B87]">{errorMsg}</p>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-[#161824] hover:bg-[#1E2130] text-white text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200"
            >
              Return to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center px-6 py-20">
      <Suspense fallback={
        <div className="w-full max-w-md bg-[#0F111A] border border-[#1C1F2B] p-8 text-center">
          <Loader2 className="w-8 h-8 text-[#00C2FF] animate-spin mx-auto mb-4" />
          <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest">Loading unsubscribe forms...</p>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
