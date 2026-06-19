"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Clock, Plus, Play, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { triggerMorningBriefAction, triggerEveningWrapAction } from "@/app/actions/admin-actions";

interface Stats {
  totalSubscribers: number;
  emailsSentThisWeek: number;
  morningBriefsCount: number;
  blogPostsCount: number;
}

interface EmailSend {
  id: string;
  type: string;
  subject: string;
  recipient_count: number;
  status: string;
  sent_at: string | null;
  generated_at: string;
}

interface AdminOverviewClientProps {
  stats: Stats;
  recentSends: EmailSend[];
}

export function AdminOverviewClient({ stats, recentSends: initialSends }: AdminOverviewClientProps) {
  const [recentSends, setRecentSends] = useState<EmailSend[]>(initialSends);
  const [loading, setLoading] = useState<"morning" | "evening" | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [schedule, setSchedule] = useState({ morning: "", evening: "" });

  useEffect(() => {
    const calcNextSchedules = () => {
      const now = new Date();
      
      // Target morning 07:00 UTC
      const morningTarget = new Date();
      morningTarget.setUTCHours(7, 0, 0, 0);
      if (now.getUTCHours() >= 7) {
        morningTarget.setUTCDate(now.getUTCDate() + 1);
      }
      // Skip weekends if schedule is Mon-Fri
      while (morningTarget.getUTCDay() === 0 || morningTarget.getUTCDay() === 6) {
        morningTarget.setUTCDate(morningTarget.getUTCDate() + 1);
      }

      // Target evening 17:30 UTC
      const eveningTarget = new Date();
      eveningTarget.setUTCHours(17, 30, 0, 0);
      if (now.getUTCHours() > 17 || (now.getUTCHours() === 17 && now.getUTCMinutes() >= 30)) {
        eveningTarget.setUTCDate(now.getUTCDate() + 1);
      }
      while (eveningTarget.getUTCDay() === 0 || eveningTarget.getUTCDay() === 6) {
        eveningTarget.setUTCDate(eveningTarget.getUTCDate() + 1);
      }

      const formatTarget = (date: Date) => {
        const isToday = date.getUTCDate() === now.getUTCDate();
        const datePart = isToday ? "Today" : date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
        const timePart = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
        return `${datePart} at ${timePart} GMT`;
      };

      setSchedule({
        morning: formatTarget(morningTarget),
        evening: formatTarget(eveningTarget)
      });
    };

    calcNextSchedules();
    const interval = setInterval(calcNextSchedules, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerAction = async (type: "morning" | "evening") => {
    setLoading(type);
    setMessage(null);
    try {
      const res = type === "morning" 
        ? await triggerMorningBriefAction() 
        : await triggerEveningWrapAction();

      if (!res.success) {
        throw new Error(res.error || "Action trigger failed.");
      }

      setMessage({
        type: "success",
        text: `Successfully triggered ${type === "morning" ? "Morning Brief" : "Evening Wrap"}. Emails sent: ${res.recipient_count ?? 0}.`
      });

      // Fetch updated sends list after delay
      setTimeout(async () => {
        const fetchRes = await fetch("/api/admin/newsletter/send"); // or custom fetch
        // We can just add the new mock/live item locally to avoid a refresh
        setRecentSends(prev => [
          {
            id: res.emailSendId || Math.random().toString(),
            type: type === "morning" ? "morning_brief" : "evening_wrap",
            subject: type === "morning" ? "The Wire — Morning Brief" : "The Wire — Evening Wrap",
            recipient_count: res.recipient_count ?? 0,
            status: res.status || "sent",
            sent_at: new Date().toISOString(),
            generated_at: new Date().toISOString()
          },
          ...prev.slice(0, 4)
        ]);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Execution exception occurred."
      });
    } finally {
      setLoading(null);
    }
  };

  const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">SENT</span>;
      case "pending":
      case "sending":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-500/10 text-yellow-400 uppercase">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 uppercase">FAILED</span>;
    }
  };

  const getReadableType = (type: string) => {
    switch (type) {
      case "morning_brief": return "Morning Brief";
      case "evening_wrap": return "Evening Wrap";
      case "welcome": return "Welcome Onboarding";
      case "weekly": return "Weekly Edition";
      default: return type;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">The Wire Command Centre</h1>
          <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest mt-1">Email Automation & Intelligence Hub</p>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 border flex items-start gap-3 rounded-lg ${
          message.type === "success" 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
            : "bg-rose-500/5 border-rose-500/20 text-rose-400"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <div className="text-sm">{message.text}</div>
        </div>
      )}

      {/* Top Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", value: stats.totalSubscribers.toLocaleString() },
          { label: "Emails Sent (7d)", value: stats.emailsSentThisWeek.toLocaleString() },
          { label: "Morning Briefs", value: stats.morningBriefsCount.toLocaleString() },
          { label: "Blog Posts (This Mo)", value: stats.blogPostsCount.toLocaleString() }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col justify-between h-32">
            <p className="text-xs text-[#8C8B87] opacity-40 uppercase tracking-widest font-mono font-bold leading-none">{item.label}</p>
            <p className="text-4xl font-mono font-black text-[#C8F135] tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sends Table */}
        <div className="lg:col-span-2 bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C8F135]" /> Recent Email Sends
            </h3>
            <Link href="/admin/emails" className="text-[10px] font-mono uppercase tracking-widest text-[#C8F135] hover:underline">
              View History &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#8C8B87]">
              <thead>
                <tr className="border-b border-white/5 pb-2 text-[10px] uppercase font-mono tracking-wider">
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 font-semibold">Type</th>
                  <th className="py-3 font-semibold">Subject</th>
                  <th className="py-3 font-semibold">Recipients</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSends.map((send) => (
                  <tr key={send.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono">
                      {new Date(send.generated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-4 font-medium text-white">{getReadableType(send.type)}</td>
                    <td className="py-4 truncate max-w-[200px]">
                      <Link href={`/admin/emails/${send.id}`} className="hover:underline hover:text-white transition-colors">
                        {send.subject}
                      </Link>
                    </td>
                    <td className="py-4 font-mono">{send.recipient_count}</td>
                    <td className="py-4">{getStatusPill(send.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-white border-b border-white/5 pb-4">
              // Control Panel
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleTriggerAction("morning")}
                disabled={loading !== null}
                className="w-full py-3.5 bg-transparent border border-[#ef4444] hover:bg-[#ef4444] hover:text-[#08090D] text-[#ef4444] text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading === "morning" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Send Morning Brief Now
              </button>

              <button
                onClick={() => handleTriggerAction("evening")}
                disabled={loading !== null}
                className="w-full py-3.5 bg-transparent border border-[#00C2FF] hover:bg-[#00C2FF] hover:text-[#08090D] text-[#00C2FF] text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading === "evening" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Send Evening Wrap Now
              </button>

              <Link
                href="/admin/blog/new"
                className="w-full py-3.5 bg-[#C8F135] hover:bg-[#D8F155] text-[#08090D] text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                New Blog Post
              </Link>
            </div>
          </div>

          {/* Scheduled Sends */}
          <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-white border-b border-white/5 pb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C8F135]" /> Next Scheduled Crons
            </h3>
            <div className="space-y-4 font-sans text-xs">
              <div className="p-3 bg-white/5 rounded border border-white/5">
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">// Morning Market Brief</span>
                <p className="font-semibold text-white">{schedule.morning || "Calculating..."}</p>
                <span className="text-[9px] text-[#5C5B57] font-mono mt-1 block">Trigger: /api/cron/morning-brief</span>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5">
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block mb-1">// Evening Session Wrap</span>
                <p className="font-semibold text-white">{schedule.evening || "Calculating..."}</p>
                <span className="text-[9px] text-[#5C5B57] font-mono mt-1 block">Trigger: /api/cron/evening-wrap</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
