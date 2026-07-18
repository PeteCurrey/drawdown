"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WaitlistForm({ tier }: { tier: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier }),
      });
      if (!res.ok) throw new Error("Failed to join waitlist");
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An error occurred.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <CheckCircle2 className="w-10 h-10 text-mkt-grn" />
        <p className="text-sm font-sans font-semibold text-mkt-ink">You're on the list.</p>
        <p className="text-xs text-mkt-i3 font-sans">We'll email you as soon as a spot opens up.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 text-left">
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-sans font-bold uppercase tracking-wider text-mkt-ink">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="trader@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="w-full px-4 py-3 bg-mkt-gbg border border-mkt-bd rounded-lg text-sm font-sans focus:outline-none focus:border-mkt-ink transition-colors disabled:opacity-50"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-500 font-sans">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !email}
        className={cn(
          "w-full py-3 mt-2 rounded-lg text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
          "bg-mkt-ink text-white hover:bg-mkt-i2 disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {status === "loading" ? "Joining..." : "Join Waitlist"}
        {status !== "loading" && <ChevronRight className="w-3.5 h-3.5" />}
      </button>
    </form>
  );
}
