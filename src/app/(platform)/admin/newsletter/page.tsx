"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Send, Edit3, Eye, Loader2, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsletterAdminPage() {
  const [subject, setSubject] = useState("The Wire: Weekly Edge (Draft)");
  const [content, setContent] = useState("<p>Pete here.</p>\n<p>It's been a wild week in the markets...</p>");
  const [audience, setAudience] = useState<"all" | "foundation" | "edge" | "floor">("all");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });

  const handleSend = async () => {
    if (!confirm(`Are you sure you want to broadcast to the ${audience.toUpperCase()} audience?`)) return;

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, audience })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: `Successfully dispatched to ${data.count} subscribers.` });
      } else {
        setStatus({ type: 'error', msg: data.error || "Failed to send broadcast." });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-4">
        <Breadcrumbs />
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-accent">Broadcast Dispatch</h1>
          <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
            Pete's Global Communication Hub
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Editor */}
          <div className="bg-background-surface border border-border-slate">
            <div className="p-4 border-b border-border-slate flex items-center gap-3 bg-background-elevated">
              <Edit3 className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-display font-bold uppercase">Compose Email</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Subject Line</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate p-4 text-sm font-display focus:border-accent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">HTML Body Content</label>
                <textarea 
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate p-4 text-[13px] font-mono leading-relaxed focus:border-accent outline-none text-text-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Settings */}
        <div className="space-y-8">
          <div className="bg-background-surface border border-border-slate">
            <div className="p-4 border-b border-border-slate bg-background-elevated flex items-center gap-3">
              <Users className="w-5 h-5 text-text-primary" />
              <h2 className="text-sm font-display font-bold uppercase">Dispatch Settings</h2>
            </div>
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Target Audience</label>
                <div className="space-y-2">
                  <button onClick={() => setAudience("all")} className={cn("w-full px-4 py-3 text-left text-xs font-mono uppercase tracking-widest border transition-all", audience === 'all' ? "border-accent text-accent bg-accent/5" : "border-border-slate text-text-tertiary")}>
                    All Active Subscribers
                  </button>
                  <button onClick={() => setAudience("foundation")} className={cn("w-full px-4 py-3 text-left text-xs font-mono uppercase tracking-widest border transition-all", audience === 'foundation' ? "border-accent text-accent bg-accent/5" : "border-border-slate text-text-tertiary")}>
                    Foundation Tier Only
                  </button>
                  <button onClick={() => setAudience("edge")} className={cn("w-full px-4 py-3 text-left text-xs font-mono uppercase tracking-widest border transition-all", audience === 'edge' ? "border-accent text-accent bg-accent/5" : "border-border-slate text-text-tertiary")}>
                    Edge Tier Only
                  </button>
                </div>
              </div>

              {status.type && (
                <div className={cn("p-4 border text-xs flex gap-3", status.type === 'success' ? "border-profit/30 bg-profit/10 text-profit" : "border-loss/30 bg-loss/10 text-loss")}>
                  {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <p className="font-mono">{status.msg}</p>
                </div>
              )}

              <button 
                onClick={handleSend}
                disabled={loading}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-background-primary transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Transmitting..." : "Broadcast Now"}
              </button>
            </div>
          </div>
          
          <div className="p-6 border border-border-slate bg-[#111318] text-center space-y-4">
            <Eye className="w-8 h-8 text-text-tertiary mx-auto" />
            <h3 className="text-xs font-display font-bold uppercase text-text-secondary">Template Preview</h3>
            <p className="text-[10px] text-text-tertiary font-mono">Your email will be wrapped in the Drawdown Master Template automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
