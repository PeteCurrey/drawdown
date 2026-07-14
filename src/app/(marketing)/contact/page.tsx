"use client";

import { useState } from "react";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Send, Mail, MessageSquare, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "./actions";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = await submitContactForm(data);
    
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        
        <header className="mb-24 max-w-3xl">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">// CONNECT</span>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
            Ask Your <br /> Questions.
          </h1>
          <p className="text-base text-text-tertiary leading-relaxed font-sans max-w-2xl">
            Whether you're stuck in a drawdown, have a question about the curriculum, or need technical support with our AI tools — we're here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Methods */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-tertiary mb-4">Channel 01 — Support</h4>
              <div className="flex items-start gap-4 p-6 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[14px]">
                <Mail className="w-5 h-5 text-profit mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-sans font-extrabold text-text-primary mb-1 tracking-tight">Email Support</p>
                  <p className="text-xs text-text-tertiary mb-3 font-sans">Response within 24 hours.</p>
                  <a href="mailto:support@drawdown.trading" className="text-[11px] font-sans font-semibold text-text-primary hover:underline underline-offset-2">support@drawdown.trading</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-tertiary mb-4">Channel 02 — Community</h4>
              <div className="flex items-start gap-4 p-6 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[14px]">
                <MessageSquare className="w-5 h-5 text-profit mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-sans font-extrabold text-text-primary mb-1 tracking-tight">Discord Hub</p>
                  <p className="text-xs text-text-tertiary mb-3 font-sans">Real-time discussion with other traders.</p>
                  <a href="https://discord.gg/drawdown" className="text-[11px] font-sans font-semibold text-text-primary hover:underline underline-offset-2">Join the Server →</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-tertiary mb-4">HQ</h4>
              <div className="flex items-start gap-4 p-6 border border-border-slate/50 rounded-[14px] bg-background-elevated/40">
                <MapPin className="w-5 h-5 text-text-tertiary mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-sans font-extrabold text-text-primary mb-1 tracking-tight">London, UK</p>
                  <p className="text-xs text-text-tertiary leading-relaxed font-sans">
                    Canary Wharf, <br />
                    E14 5AB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="p-8 md:p-12 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[14px] relative overflow-hidden">
              <div className={cn(
                "absolute inset-0  flex flex-col items-center justify-center z-20 transition-all duration-500",
                status === 'success' ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              )}>
                <CheckCircle2 className="w-16 h-16 text-profit mb-6" />
                <h3 className="text-2xl font-sans font-extrabold tracking-tight text-text-primary mb-3 text-center">Message Received.</h3>
                <p className="text-text-tertiary text-sm font-sans mb-8 text-center">We will get back to you shortly.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-[11px] font-sans font-semibold text-text-primary hover:underline underline-offset-2"
                >
                  Send Another Message
                </button>
              </div>

              <h4 className="text-2xl font-sans font-extrabold tracking-tight text-text-primary mb-10">Send a Secure Message</h4>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold text-text-secondary uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      placeholder="Jane Doe"
                      className="w-full bg-background-elevated/40 border border-border-slate/50 focus:border-border-slate/50s rounded-lg px-4 py-3 text-sm text-text-primary font-sans outline-none transition-colors placeholder:text-text-tertiary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold text-text-secondary uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required 
                      placeholder="jane@example.com"
                      className="w-full bg-background-elevated/40 border border-border-slate/50 focus:border-border-slate/50s rounded-lg px-4 py-3 text-sm text-text-primary font-sans outline-none transition-colors placeholder:text-text-tertiary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-sans font-semibold text-text-secondary uppercase tracking-wider block">Reason for Inquiry</label>
                  <select name="subject" className="w-full bg-background-elevated/40 border border-border-slate/50 focus:border-border-slate/50s rounded-lg px-4 py-3 text-sm text-text-primary font-sans outline-none transition-colors appearance-none cursor-pointer">
                    <option value="General Support">General Support</option>
                    <option value="Tier & Billing Inquiry">Tier & Billing Inquiry</option>
                    <option value="Curriculum Question">Curriculum Question</option>
                    <option value="AI Tool Technical Issue">AI Tool Technical Issue</option>
                    <option value="Corporate & Partnerships">Corporate & Partnerships</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-sans font-semibold text-text-secondary uppercase tracking-wider block">Your Message</label>
                  <textarea 
                    name="message"
                    rows={6} 
                    required 
                    placeholder="How can we help you today?"
                    className="w-full bg-background-elevated/40 border border-border-slate/50 focus:border-border-slate/50s rounded-lg px-4 py-3 text-sm text-text-primary font-sans outline-none transition-colors resize-none placeholder:text-text-tertiary"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 rounded-lg font-sans font-semibold text-sm text-white transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ backgroundColor: "#0A0A0A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
                >
                  {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Transmit Message
                      <Send className="w-4 h-4" />
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
