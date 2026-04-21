"use client";

import { LinkGenerator } from "@/components/partner/LinkGenerator";

export default function PartnerLinksPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] block mb-2">// TRACKING ASSETS</span>
        <h1 className="text-4xl font-display font-bold uppercase text-text-primary">Links.</h1>
      </div>

      <div className="max-w-4xl">
        <LinkGenerator />
      </div>

      <div className="bg-background-surface border border-border-slate overflow-hidden">
        <div className="p-6 border-b border-border-slate">
          <h3 className="text-sm font-display font-bold uppercase text-text-primary">Active Tracking Endpoints.</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-slate bg-background-elevated/30">
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Channel</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Campaign</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Referrals</th>
                <th className="px-6 py-4 text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Bounce Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-slate/50">
              {[
                { channel: "Twitter / X", campaign: "spring_launch", referrals: 402, bounce: "12%" },
                { channel: "YouTube", campaign: "video_review", referrals: 89, bounce: "4%" },
                { channel: "Newsletter", campaign: "weekly_update", referrals: 156, bounce: "8%" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-text-primary">{row.channel}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary">{row.campaign}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-primary font-bold">{row.referrals}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-tertiary">{row.bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
