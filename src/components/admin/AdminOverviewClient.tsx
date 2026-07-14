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
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mkt-gbg border border-mkt-gbd text-mkt-grn uppercase">SENT</span>;
      case "pending":
      case "sending":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 border border-amber-200 text-mkt-amb uppercase">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mkt-rbg border border-red-200 text-mkt-red uppercase">FAILED</span>;
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
      <div className="flex justify-between items-center border-b border-mkt-bd pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">The Wire Command Centre</h1>
          <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">Email Automation & Intelligence Hub</p>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 border flex items-start gap-3 rounded-lg ${
          message.type === "success" 
            ? "bg-mkt-gbg border-mkt-gbd text-mkt-grn" 
            : "bg-mkt-rbg border-red-200 text-mkt-red"
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
          <div key={idx} className="bg-white rounded-xl border border-mkt-bd p-6 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] text-mkt-i3 uppercase tracking-widest font-mono font-bold leading-none">{item.label}</p>
            <p className="text-4xl font-mono font-black text-mkt-grn tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sends Table */}
        <div className="lg:col-span-2 bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center border-b border-mkt-bd pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-mkt-ink flex items-center gap-2">
              <Mail className="w-4 h-4 text-mkt-grn" /> Recent Email Sends
            </h3>
            <Link href="/admin/emails" className="text-[10px] font-mono uppercase tracking-widest text-mkt-grn hover:text-mkt-i2 hover:underline">
              View History &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-mkt-i2">
              <thead>
                <tr className="border-b border-mkt-bd pb-2 text-[10px] uppercase font-mono tracking-wider text-mkt-i3">
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 font-semibold">Type</th>
                  <th className="py-3 font-semibold">Subject</th>
                  <th className="py-3 font-semibold">Recipients</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSends.map((send) => (
                  <tr key={send.id} className="border-b border-mkt-bd hover:bg-neutral-50 transition-colors">
                    <td className="py-4 font-mono text-mkt-i3">
                      {new Date(send.generated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-4 font-semibold text-mkt-ink">{getReadableType(send.type)}</td>
                    <td className="py-4 truncate max-w-[200px]">
                      <Link href={`/admin/emails/${send.id}`} className="hover:underline hover:text-mkt-ink transition-colors font-medium">
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
          <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-mkt-ink border-b border-mkt-bd pb-4">
              // Control Panel
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleTriggerAction("morning")}
                disabled={loading !== null}
                className="w-full py-3.5 bg-transparent border border-red-200 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {loading === "morning" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Send Morning Brief Now
              </button>

              <button
                onClick={() => handleTriggerAction("evening")}
                disabled={loading !== null}
                className="w-full py-3.5 bg-transparent border border-blue-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {loading === "evening" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Send Evening Wrap Now
              </button>

              <Link
                href="/admin/blog/new"
                className="w-full py-3.5 bg-mkt-ink hover:bg-mkt-i2 text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                New Blog Post
              </Link>
            </div>
          </div>

          {/* Scheduled Sends */}
          <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-mkt-ink border-b border-mkt-bd pb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-mkt-grn" /> Next Scheduled Crons
            </h3>
            <div className="space-y-4 font-sans text-xs">
              <div className="p-3 bg-neutral-50 rounded border border-mkt-bd">
                <span className="text-[10px] font-mono text-mkt-i3 uppercase tracking-wider block mb-1">// Morning Market Brief</span>
                <p className="font-semibold text-mkt-ink">{schedule.morning || "Calculating..."}</p>
                <span className="text-[9px] text-mkt-i4 font-mono mt-1 block">Trigger: /api/cron/morning-brief</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-mkt-bd">
                <span className="text-[10px] font-mono text-mkt-i3 uppercase tracking-wider block mb-1">// Evening Session Wrap</span>
                <p className="font-semibold text-mkt-ink">{schedule.evening || "Calculating..."}</p>
                <span className="text-[9px] text-mkt-i4 font-mono mt-1 block">Trigger: /api/cron/evening-wrap</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
