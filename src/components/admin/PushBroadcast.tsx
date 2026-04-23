"use client";

import React, { useState } from 'react';
import { Send, Bell, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PushBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSending(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/push/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: `Successfully queued for ${data.count} devices.` });
        setTitle('');
        setMessage('');
      } else {
        throw new Error(data.error || 'Failed to broadcast');
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-background-surface border border-border-slate p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border-slate pb-4">
        <h3 className="text-sm font-mono uppercase tracking-widest flex items-center gap-3">
          <Bell className="w-4 h-4 text-accent" />
          Mobile Push Broadcast
        </h3>
        <span className="text-[9px] font-mono text-text-tertiary uppercase">Target: All Active Mobile Apps</span>
      </div>

      <form onSubmit={handleBroadcast} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Notification Title</label>
          <input 
            type="text" 
            placeholder="E.G. NEW MARKET ALERT"
            className="w-full bg-background-elevated border border-border-slate p-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none text-text-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Message Body</label>
          <textarea 
            placeholder="E.G. BITCOIN HAS BROKEN $70K. CHECK YOUR INTELLIGENCE FEED FOR UPDATES."
            rows={3}
            className="w-full bg-background-elevated border border-border-slate p-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none text-text-primary resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {status && (
          <div className={cn(
            "p-4 border flex items-start gap-3 animate-in fade-in slide-in-from-top-2",
            status.type === 'success' ? "bg-profit/10 border-profit text-profit" : "bg-loss/10 border-loss text-loss"
          )}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest">{status.message}</p>
          </div>
        )}

        <button 
          type="submit"
          disabled={sending || !title || !message}
          className="w-full py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale shadow-[0_0_20px_rgba(0,194,255,0.15)]"
        >
          <Send className={cn("w-4 h-4", sending && "animate-ping")} />
          {sending ? "TRANSMITTING..." : "BROADCAST PUSH NOTIFICATION"}
        </button>
      </form>

      <div className="pt-4 border-t border-border-slate flex items-center justify-between">
        <p className="text-[8px] font-mono text-text-tertiary italic">
          Broadcasts are sent instantly to all registered iOS/Android tokens.
        </p>
        <div className="flex items-center gap-2">
           <Smartphone className="w-3 h-3 text-text-tertiary" />
           <span className="text-[9px] font-mono text-text-tertiary uppercase">Native Bridge Enabled</span>
        </div>
      </div>
    </div>
  );
};
