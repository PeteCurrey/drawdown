"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Clock, Plus, Play, CheckCircle, XCircle, AlertTriangle, Loader2, Send, Zap, X } from "lucide-react";
import { 
  triggerMorningBriefAction, 
  triggerEveningWrapAction, 
  triggerBreakingNewsAction, 
  sendCustomEmailBroadcastAction 
} from "@/app/actions/admin-actions";

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
  healthMetrics?: {
    waitlistCount: number;
    floorCap: number;
    activeFloorSubs: number;
    upcomingEventsMissingUrls: number;
    isBreakdownOverdue: boolean;
  };
}

export function AdminOverviewClient({ stats, recentSends: initialSends, healthMetrics }: AdminOverviewClientProps) {
  const [recentSends, setRecentSends] = useState<EmailSend[]>(initialSends);
  const [loading, setLoading] = useState<"morning" | "evening" | "breaking" | "custom" | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [schedule, setSchedule] = useState({ morning: "", evening: "" });

  // Custom Broadcast Modal State
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customCategory, setCustomCategory] = useState("morning_brief");
  const [customHtml, setCustomHtml] = useState(
    `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">\n  <h2 style="color: #000; font-size: 20px; font-weight: bold;">Special Update from Drawdown</h2>\n  <p style="font-size: 15px; line-height: 1.6;">Good morning. Here is an important announcement regarding today's session...</p>\n  <p style="font-size: 14px; margin-top: 20px;">Protect your capital,<br/><strong>Pete Currey</strong></p>\n</div>`
  );

  useEffect(() => {
    const calcNextSchedules = () => {
      const now = new Date();
      
      const morningTarget = new Date();
      morningTarget.setUTCHours(7, 0, 0, 0);
      if (now.getUTCHours() >= 7) {
        morningTarget.setUTCDate(now.getUTCDate() + 1);
      }
      while (morningTarget.getUTCDay() === 0 || morningTarget.getUTCDay() === 6) {
        morningTarget.setUTCDate(morningTarget.getUTCDate() + 1);
      }

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

  const handleTriggerAction = async (type: "morning" | "evening" | "breaking") => {
    setLoading(type);
    setMessage(null);
    try {
      let res;
      if (type === "morning") res = await triggerMorningBriefAction();
      else if (type === "evening") res = await triggerEveningWrapAction();
      else res = await triggerBreakingNewsAction();

      if (!res.success) {
        throw new Error(res.error || "Action trigger failed.");
      }

      const titleMap = { morning: "Morning Brief", evening: "Evening Wrap", breaking: "Breaking News" };
      setMessage({
        type: "success",
        text: `Successfully triggered ${titleMap[type]}. Emails dispatched to active subscribers.`
      });

      setRecentSends(prev => [
        {
          id: res.emailSendId || Math.random().toString(),
          type: type === "morning" ? "morning_brief" : type === "evening" ? "evening_wrap" : "breaking_news",
          subject: res.subject || `The Wire — ${titleMap[type]}`,
          recipient_count: res.recipient_count ?? 1,
          status: res.status || "sent",
          sent_at: new Date().toISOString(),
          generated_at: new Date().toISOString()
        },
        ...prev.slice(0, 4)
      ]);
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

  const handleSendCustomBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject || !customHtml) return;

    setLoading("custom");
    setMessage(null);

    try {
      const res = await sendCustomEmailBroadcastAction({
        subject: customSubject,
        contentHtml: customHtml,
        category: customCategory
      });

      if (!res.success) {
        throw new Error(res.error || "Broadcast deployment failed.");
      }

      setMessage({
        type: "success",
        text: `Custom broadcast "${customSubject}" successfully deployed to ${res.recipient_count ?? 1} subscribers!`
      });

      setRecentSends(prev => [
        {
          id: res.emailSendId || Math.random().toString(),
          type: customCategory,
          subject: customSubject,
          recipient_count: res.recipient_count ?? 1,
          status: res.status || "sent",
          sent_at: new Date().toISOString(),
          generated_at: new Date().toISOString()
        },
        ...prev.slice(0, 4)
      ]);

      setShowComposeModal(false);
      setCustomSubject("");
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to deploy broadcast."
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

      {/* Service Delivery Health Metrics */}
      {healthMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-mkt-bd p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${healthMetrics.activeFloorSubs >= healthMetrics.floorCap ? 'bg-mkt-red' : 'bg-mkt-grn'}`} />
            <p className="text-[10px] text-mkt-i3 uppercase tracking-widest font-mono font-bold leading-none">Floor Subs / Cap</p>
            <p className="text-4xl font-mono font-black text-mkt-ink tracking-tight">{healthMetrics.activeFloorSubs} <span className="text-xl text-mkt-i4">/ {healthMetrics.floorCap}</span></p>
          </div>
          <div className="bg-white rounded-xl border border-mkt-bd p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${healthMetrics.waitlistCount > 0 ? 'bg-mkt-amb' : 'bg-mkt-i4'}`} />
            <p className="text-[10px] text-mkt-i3 uppercase tracking-widest font-mono font-bold leading-none">Waitlist (Unanswered)</p>
            <p className="text-4xl font-mono font-black text-mkt-ink tracking-tight">{healthMetrics.waitlistCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-mkt-bd p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${healthMetrics.isBreakdownOverdue ? 'bg-mkt-red' : 'bg-mkt-grn'}`} />
            <p className="text-[10px] text-mkt-i3 uppercase tracking-widest font-mono font-bold leading-none">Latest Breakdown</p>
            <p className={`text-xl font-bold uppercase tracking-tight ${healthMetrics.isBreakdownOverdue ? 'text-mkt-red' : 'text-mkt-grn'}`}>
              {healthMetrics.isBreakdownOverdue ? 'OVERDUE >8 DAYS' : 'ON TRACK'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-mkt-bd p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${healthMetrics.upcomingEventsMissingUrls > 0 ? 'bg-mkt-amb' : 'bg-mkt-grn'}`} />
            <p className="text-[10px] text-mkt-i3 uppercase tracking-widest font-mono font-bold leading-none">Events Missing URLs</p>
            <p className="text-4xl font-mono font-black text-mkt-ink tracking-tight">{healthMetrics.upcomingEventsMissingUrls}</p>
          </div>
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
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-mkt-bd p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center border-b border-mkt-bd pb-4 mb-4">
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

          {/* Operating Rhythm Card */}
          <div className="bg-white border border-mkt-bd p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-mkt-ink border-b border-mkt-bd pb-4 mb-4">
              Operating Rhythm
            </h3>
            <div className="prose prose-sm text-mkt-i2">
              <p><strong>Daily (M-F):</strong> 7:00am Morning Brief (Automated via Trigger), 5:30pm Evening Wrap.</p>
              <p><strong>Weekly:</strong> Record & publish the <em>Weekly Market Breakdown</em> video every Sunday.</p>
              <p><strong>Monthly:</strong> Host live <em>Q&A Masterclass</em> for Edge & Floor members.</p>
              <p><strong>Ongoing:</strong> Respond to Cal.com 1-to-1 mentorship bookings for Floor members.</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          {/* Quick Actions / Control Panel */}
          <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-mkt-ink border-b border-mkt-bd pb-4">
              // Control Panel & Email Triggers
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleTriggerAction("morning")}
                disabled={loading !== null}
                className="w-full py-3 bg-transparent border border-red-200 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {loading === "morning" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Send Morning Brief Now
              </button>

              <button
                onClick={() => handleTriggerAction("evening")}
                disabled={loading !== null}
                className="w-full py-3 bg-transparent border border-blue-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {loading === "evening" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Send Evening Wrap Now
              </button>

              <button
                onClick={() => handleTriggerAction("breaking")}
                disabled={loading !== null}
                className="w-full py-3 bg-transparent border border-amber-300 hover:border-amber-500 hover:bg-amber-500 hover:text-white text-amber-600 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {loading === "breaking" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                Send Breaking News Alert
              </button>

              <button
                onClick={() => setShowComposeModal(true)}
                disabled={loading !== null}
                className="w-full py-3 bg-mkt-grn hover:bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Compose Custom Broadcast
              </button>

              <div className="pt-2 border-t border-mkt-bd">
                <Link
                  href="/admin/blog/new"
                  className="w-full py-3 bg-mkt-ink hover:bg-mkt-i2 text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Blog Post
                </Link>
              </div>
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

      {/* Compose Custom Broadcast Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-mkt-bd rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
            <div className="p-6 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-mkt-grn" />
                <div>
                  <h3 className="text-base font-bold font-display uppercase tracking-tight">Deploy Custom Email Broadcast</h3>
                  <p className="text-xs text-neutral-400 font-mono">Send an instant broadcast to subscribers</p>
                </div>
              </div>
              <button 
                onClick={() => setShowComposeModal(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCustomBroadcast} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase font-bold text-mkt-i3 tracking-wider">Campaign Type</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-mkt-bd rounded-lg p-2.5 text-xs text-mkt-ink outline-none focus:border-mkt-ink"
                  >
                    <option value="morning_brief">Morning Brief Audience</option>
                    <option value="evening_wrap">Evening Wrap Audience</option>
                    <option value="weekly">Weekly Edition Audience</option>
                    <option value="breaking_news">Breaking News Audience</option>
                    <option value="custom">All Active Subscribers</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase font-bold text-mkt-i3 tracking-wider">Estimated Audience</label>
                  <div className="p-2.5 bg-neutral-50 border border-mkt-bd rounded-lg text-xs font-mono font-bold text-mkt-grn">
                    {stats.totalSubscribers} Active Subscriber{stats.totalSubscribers !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-mkt-i3 tracking-wider">Subject Line</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPECIAL BRIEF: US CPI Data Release Analysis"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded-lg p-3 text-xs text-mkt-ink outline-none focus:border-mkt-ink font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-mkt-i3 tracking-wider">Email Content (HTML / Text)</label>
                <textarea
                  rows={8}
                  required
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded-lg p-3 text-xs font-mono text-mkt-ink outline-none focus:border-mkt-ink resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-mkt-bd">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-5 py-2.5 text-xs font-mono font-bold text-mkt-i3 hover:text-mkt-ink transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading === "custom" || !customSubject}
                  className="px-6 py-2.5 bg-mkt-grn hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {loading === "custom" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Deploy Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
