"use client";

import React, { useState } from "react";
import { Mail, Download, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

interface LeadMagnetProps {
  resourceId: "journal-template" | "risk-guide" | "comparison-sheet" | "challenge-checklist";
  title?: string;
  description?: string;
}

const resources = {
  "journal-template": {
    filename: "trading-journal-template.xlsx",
    label: "Trading Journal Spreadsheet (.xlsx)",
    source: "lead-magnet-journal-template"
  },
  "risk-guide": {
    filename: "risk-management-guide.pdf",
    label: "Drawdown Risk Management Guide (.pdf)",
    source: "lead-magnet-risk-guide"
  },
  "comparison-sheet": {
    filename: "prop-firm-comparison-sheet.xlsx",
    label: "Prop Firm Cheat Sheet Matrix (.xlsx)",
    source: "lead-magnet-comparison-sheet"
  },
  "challenge-checklist": {
    filename: "challenge-checklist.pdf",
    label: "30-Day Evaluation Challenge Checklist (.pdf)",
    source: "lead-magnet-challenge-checklist"
  }
};

export function LeadMagnet({ 
  resourceId, 
  title, 
  description 
}: LeadMagnetProps) {
  const resource = resources[resourceId];
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          source: resource.source,
          locale: "uk"
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        // Trigger download
        const downloadUrl = `/downloads/${resource.filename}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", resource.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="border border-mkt-bd bg-[#F7F7F7]/60 p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] select-none pointer-events-none">
        <Mail className="w-64 h-64 text-mkt-ink" />
      </div>

      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/15 border border-accent/20">
          <Download className="w-3.5 h-3.5 text-accent" />
          <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-widest">Free Trader Resource</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-2xl font-sans font-black uppercase tracking-tight text-mkt-ink">
            {title || `Download Free ${resource.label.split(" (")[0]}`}
          </h4>
          <p className="text-sm text-mkt-i2 leading-relaxed">
            {description || `Join Pete Currey's list to receive professional-grade guides, journal spreadsheets, and daily market intelligence direct to your inbox.`}
          </p>
        </div>

        {status === "success" ? (
          <div className="p-6 bg-profit/10 border border-profit/30 text-mkt-ink flex items-start gap-4 animate-in fade-in duration-500">
            <CheckCircle className="w-6 h-6 text-mkt-grn shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold uppercase tracking-tight text-sm">Download Started!</h5>
              <p className="text-xs text-mkt-i2 leading-relaxed">
                If the file didn&apos;t download automatically, <a href={`/downloads/${resource.filename}`} download className="text-accent underline font-bold">click here to download manually</a>. We&apos;ve also sent a copy to your inbox.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4">First Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full bg-white border border-mkt-bd p-4 text-xs font-mono outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full bg-white border border-mkt-bd p-4 text-xs font-mono outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-8 py-4 bg-mkt-ink hover:bg-accent-hover text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    SUBSCRIBING... <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    GET ACCESS NOW <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">
          No spam. Unsubscribe at any time. Your details are safe with us.
        </p>
      </div>
    </div>
  );
}
