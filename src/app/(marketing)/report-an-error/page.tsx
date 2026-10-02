"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function ReportAnErrorPage() {
  const [pageUrl, setPageUrl] = useState("");
  const [issueType, setIssueType] = useState("factual_error");
  const [description, setDescription] = useState("");
  const [supportingSource, setSupportingSource] = useState("");
  const [complainantName, setComplainantName] = useState("");
  const [complainantEmail, setComplainantEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !pageUrl) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Report an Error", href: "/report-an-error" }]} />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            Editorial Feedback & Corrections
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Report a Content Error or Outdated Data
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Drawdown Trading is committed to 100% empirical accuracy. If you notice a factual error, broken calculator formula, or outdated broker fee schedule, please let us know below.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Error Report Submitted</h2>
            <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
              Thank you for helping us maintain research integrity. Our editorial team will triage your report within 48 business hours and update our public corrections log upon verification.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setDescription("");
              }}
              className="px-4 py-2 rounded-xl bg-background-primary border border-border-primary text-xs font-semibold text-text-primary hover:border-accent transition"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Affected Page URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://drawdown.trading/brokers/ig-markets-review"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Issue Classification
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="factual_error">Factual Error</option>
                  <option value="data_outdated">Outdated Broker Fee / Data</option>
                  <option value="methodology_clarification">Methodology Clarification</option>
                  <option value="typo">Typo or Formatting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Supporting Evidence / Source Link
                </label>
                <input
                  type="text"
                  placeholder="e.g., FCA Register link or official broker terms"
                  value={supportingSource}
                  onChange={(e) => setSupportingSource(e.target.value)}
                  className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Detailed Description of Error *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Please describe the exact statement, number, or formula issue and what the correct information should be..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background-primary border border-border-primary rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-primary/40">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  value={complainantEmail}
                  onChange={(e) => setComplainantEmail(e.target.value)}
                  className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-background-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition shadow-lg"
            >
              <Send className="w-4 h-4" />
              Submit Error Report for Triage
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
