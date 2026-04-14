"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-24">
          
          {/* Left Column — Info */}
          <div className="lg:w-1/2 space-y-12">
            <div>
              <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">
                // GET IN TOUCH
              </span>
              <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-8">
                Connect with the <span className="text-accent">Truth.</span>
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                Have questions about the phases, subscription tiers, or our AI tools? 
                Our team of traders is here to help. No sales pitches, just answers.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-background-elevated border border-border-slate flex items-center justify-center group-hover:border-accent/40 transition-colors">
                  <Mail className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold tracking-widest mb-1">Direct Email</h4>
                  <p className="text-text-primary">support@drawdown.trade</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-background-elevated border border-border-slate flex items-center justify-center group-hover:border-accent/40 transition-colors">
                  <MessageSquare className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold tracking-widest mb-1">Community Discord</h4>
                  <p className="text-text-secondary text-sm">Join the "Floor" for direct 1-to-1 channels.</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-border-slate bg-background-elevated/30">
              <h4 className="text-xs font-mono uppercase font-bold tracking-widest mb-4">Response Times</h4>
              <p className="text-xs text-text-tertiary leading-relaxed">
                We are a team of active traders. We respond to all inquiries within 24 hours during market days (Mon-Fri).
              </p>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="lg:w-1/2 bg-background-surface border border-border-slate p-8 md:p-12 relative">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-profit/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-profit" />
                </div>
                <h3 className="text-2xl font-display font-bold uppercase">Message Received.</h3>
                <p className="text-text-secondary text-sm">We'll get back to you shortly.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Your Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-background-elevated border-b border-border-slate p-4 text-sm focus:border-accent outline-none transition-colors"
                      placeholder="TRADER NAME"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-background-elevated border-b border-border-slate p-4 text-sm focus:border-accent outline-none transition-colors"
                      placeholder="EMAIL@EXAMPLE.COM"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Subject</label>
                    <select className="w-full bg-background-elevated border-b border-border-slate p-4 text-sm focus:border-accent outline-none transition-colors appearance-none">
                      <option>General Inquiry</option>
                      <option>Account & Billing</option>
                      <option>AI Tools Access</option>
                      <option>Partnerships</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Your Message</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full bg-background-elevated border-b border-border-slate p-4 text-sm focus:border-accent outline-none transition-colors resize-none"
                      placeholder="HOW CAN WE HELP?"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Message <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
