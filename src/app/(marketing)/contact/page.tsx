"use client";

import { useState } from "react";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Send, Mail, MessageSquare, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Mocking the contact submission
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <header className="mb-24">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// CONNECT</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight">
            Ask Your <br /> Questions.
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed font-sans max-w-2xl">
            Whether you're stuck in a drawdown, have a question about the curriculum, or need technical support with our AI tools — we're here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Methods */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Channel 01 — Support</h4>
              <div className="flex items-start gap-4 p-6 bg-background-surface border border-border-slate">
                <Mail className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm font-display font-bold uppercase mb-1">Email Support</p>
                  <p className="text-xs text-text-secondary mb-4">Response within 24 hours.</p>
                  <a href="mailto:support@drawdown.trade" className="text-xs font-mono text-accent hover:underline">support@drawdown.trade</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Channel 02 — Community</h4>
              <div className="flex items-start gap-4 p-6 bg-background-surface border border-border-slate">
                <MessageSquare className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm font-display font-bold uppercase mb-1">Discord Hub</p>
                  <p className="text-xs text-text-secondary mb-4">Real-time discussion with other traders.</p>
                  <a href="https://discord.gg/drawdown" className="text-xs font-mono text-accent hover:underline">Join the Server →</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">HQ</h4>
              <div className="flex items-start gap-4 p-6 border border-border-slate/30">
                <MapPin className="w-5 h-5 text-text-tertiary mt-1" />
                <div>
                  <p className="text-sm font-display font-bold uppercase mb-1">London, UK</p>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Canary Wharf, <br />
                    E14 5AB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="p-8 md:p-16 bg-background-surface border border-border-slate relative overflow-hidden">
              <div className={cn(
                "absolute inset-0 bg-background-surface flex flex-col items-center justify-center z-20 transition-all duration-500",
                status === 'success' ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              )}>
                <CheckCircle2 className="w-16 h-16 text-profit mb-6" />
                <h3 className="text-3xl font-display font-bold uppercase mb-4 text-center">Message Received.</h3>
                <p className="text-text-secondary text-sm font-mono uppercase tracking-widest mb-10 text-center">We will get back to you shortly.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
                >
                  Send Another Message
                </button>
              </div>

              <h4 className="text-2xl font-display font-bold uppercase mb-12">Send a Secure Message</h4>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="ENTER NAME"
                      className="w-full bg-background-primary border-b border-border-slate focus:border-accent p-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="ENTER EMAIL"
                      className="w-full bg-background-primary border-b border-border-slate focus:border-accent p-3 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Reason for Inquiry</label>
                  <select className="w-full bg-background-primary border-b border-border-slate focus:border-accent p-3 text-sm outline-none transition-colors appearance-none cursor-pointer">
                    <option>General Support</option>
                    <option>Tier & Billing Inquiry</option>
                    <option>Curriculum Question</option>
                    <option>AI Tool Technical Issue</option>
                    <option>Corporate & Partnerships</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Your Message</label>
                  <textarea 
                    rows={6} 
                    required 
                    placeholder="WHAT IS ON YOUR MIND?"
                    className="w-full bg-background-primary border border-border-slate focus:border-accent p-4 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-6 bg-accent text-background-primary font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-colors flex items-center justify-center gap-3"
                >
                  {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Transmit Message
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
