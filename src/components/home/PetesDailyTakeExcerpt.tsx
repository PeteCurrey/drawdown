"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRegion } from "@/components/layout/RegionalLayout";

interface Take {
  content: string;
  date: string;
}

export function PetesDailyTakeExcerpt() {
  const [take, setTake] = useState<Take | null>(null);
  const supabase = createClient();
  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;

  useEffect(() => {
    async function fetchTake() {
      // Authoritative source: daily_briefings (written by cron/daily-report)
      // daily_briefs is retained for the email newsletter cron only
      const { data } = await (supabase
        .from("daily_briefings")
        .select("macro_narrative, report_date, generated_at") as any)
        .order("report_date", { ascending: false })
        .limit(1)
        .single();

      // Only show if real content exists — never show a hardcoded fallback
      if (data && data.macro_narrative && data.macro_narrative.trim().length > 20) {
        setTake({
          content: data.macro_narrative,
          date: new Date(data.report_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        });
      }
      // If no content: return null — the section is hidden (see below)
    }
    fetchTake();
  }, []);

  // Return null (hide section) when no real brief content is available
  if (!take) return null;

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-l-4 border-accent border-y border-r border-mkt-bd p-12 relative group transition-premium hover:border-mkt-bds/30 rounded-xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold">
                // PETE'S TAKE
              </span>
              <div className="h-px w-8 bg-border-slate" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-mkt-i4">
                {take.date}
              </span>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-sans font-medium leading-relaxed italic text-mkt-ink">
                "{take.content.length > 200 ? take.content.slice(0, 200) + "..." : take.content}"
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-full">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Pete Currey</span>
                    <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">Founder, Drawdown</span>
                  </div>
                </div>

                <Link 
                  href={`${regionPrefix}/tools/briefing`} 
                  className="flex items-center gap-2 text-sm md:text-xs font-bold uppercase tracking-widest text-accent hover:underline group"
                >
                  Read Full Brief <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Abstract background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </section>
  );
}
