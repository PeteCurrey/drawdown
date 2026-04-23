"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WireSubscribeFormProps {
  source: string;
  variant?: 'inline' | 'card' | 'hero';
}

export function WireSubscribeForm({ source, variant = 'inline' }: WireSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const resp = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });

      if (resp.ok) {
        setStatus('success');
        setEmail("");
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 text-profit animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold">You're on the list.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn(
      "relative group",
      variant === 'card' && "bg-background-surface border border-border-slate p-8",
      variant === 'hero' && "max-w-md"
    )}>
      <div className="flex flex-col gap-4">
        {variant !== 'inline' && (
          <div className="space-y-2">
             <h3 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">Get The Wire.</h3>
             <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest leading-relaxed">
                Institutional market intelligence, daily at 07:00 GMT.
             </p>
          </div>
        )}
        
        <div className="relative flex items-center">
           <Mail className="absolute left-4 w-4 h-4 text-text-tertiary group-focus-within:text-accent transition-colors" />
           <input 
             type="email"
             placeholder="ENTER TRADER EMAIL..."
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full bg-background-elevated border border-border-slate pl-12 pr-32 py-4 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
           />
           <button 
             type="submit"
             disabled={status === 'loading'}
             className="absolute right-2 px-4 py-2 bg-accent text-background-primary text-[9px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center gap-2 disabled:opacity-50"
           >
              {status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : "JOIN THE WIRE"}
           </button>
        </div>
        
        {status === 'error' && (
          <p className="text-[9px] font-mono text-loss uppercase tracking-widest mt-2">
            Subscription failed. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
