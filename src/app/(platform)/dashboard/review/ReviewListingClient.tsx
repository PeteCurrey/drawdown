"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { CheckSquare, Clock, ArrowRight, FileText } from "lucide-react";

interface Props {
  userId: string;
}

export default function ReviewListingClient({ userId }: Props) {
  const supabase = createClient();
  const [records, setRecords] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: recordsData } = await supabase
          .from("trade_records")
          .select("id, trade_plan_id, instrument, direction, result_amount, opened_at, closed_at")
          .eq("user_id", userId)
          .order("opened_at", { ascending: false });

        const { data: reviewsData } = await supabase
          .from("trade_reviews")
          .select("trade_record_id, process_score, created_at")
          .eq("user_id", userId);

        const reviewMap: Record<string, any> = {};
        (reviewsData || []).forEach((r: any) => { reviewMap[r.trade_record_id] = r; });

        setRecords(recordsData || []);
        setReviews(reviewMap);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const pending = records.filter(r => !reviews[r.id]);
  const completed = records.filter(r => !!reviews[r.id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-[#F4F4F0] rounded-xl" />
        <div className="h-40 bg-[#F4F4F0] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#888880] mb-2">// Stage 5</p>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Process Review</h1>
        <p className="text-sm text-[#555550] mt-1">
          Evaluate plan adherence, risk discipline, and journal completeness. Outcomes are shown separately — process quality is the headline.
        </p>
      </div>

      {/* Pending Reviews */}
      {pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Reviews Due ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(record => (
              <Link
                key={record.id}
                href={`/dashboard/review/${record.id}`}
                className="flex items-center justify-between p-5 bg-white border border-amber-200/60 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">
                      Awaiting Review
                    </span>
                    {record.instrument && (
                      <span className="text-[10px] font-mono text-[#555550]">{record.instrument}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {record.direction ? record.direction.toUpperCase() : "Trade"} Record
                  </p>
                  <p className="text-xs text-[#888880]">
                    {record.opened_at ? new Date(record.opened_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Unknown date"}
                    {record.result_amount !== null && (
                      <span className={cn("ml-2 font-mono font-bold", record.result_amount >= 0 ? "text-emerald-600" : "text-red-500")}>
                        {record.result_amount >= 0 ? "+" : ""}{record.result_amount?.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#888880] group-hover:text-[#1A1A1A] transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {records.length === 0 && (
        <div className="p-10 border border-dashed border-[#EDEDED] rounded-xl text-center space-y-3">
          <FileText className="w-8 h-8 text-[#C8CBB8] mx-auto" />
          <p className="text-sm text-[#555550]">No trade records yet. Record a trade first, then return here to begin your process review.</p>
          <Link
            href="/dashboard/record"
            className="inline-block text-xs font-mono text-indigo-500 hover:underline uppercase tracking-wider"
          >
            Go to Journal →
          </Link>
        </div>
      )}

      {/* Completed Reviews */}
      {completed.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            Completed Reviews ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map(record => {
              const review = reviews[record.id];
              return (
                <Link
                  key={record.id}
                  href={`/dashboard/review/${record.id}`}
                  className="flex items-center justify-between p-5 bg-white border border-[#EDEDED] rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">
                        Reviewed
                      </span>
                      {record.instrument && (
                        <span className="text-[10px] font-mono text-[#555550]">{record.instrument}</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {record.direction ? record.direction.toUpperCase() : "Trade"} Record
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#888880]">
                      <span>
                        {record.opened_at ? new Date(record.opened_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : ""}
                      </span>
                      {review?.process_score !== undefined && (
                        <span className="font-mono font-bold text-indigo-600">
                          Process Score: {review.process_score}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#888880] group-hover:text-[#1A1A1A] transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
