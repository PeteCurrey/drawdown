"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { 
  Award, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  ArrowRight,
  UserPlus,
  LogIn,
  LineChart,
  GitCompare,
  Percent
} from "lucide-react";

export default function MarketCallInstructionsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-[#FAF9F5] min-h-screen text-[#1A1A1A]">
      <TrackPageView path="/market-call" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Hero Area */}
        <div className="space-y-6 mb-16 text-center md:text-left">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase rounded"
            style={{ backgroundColor: "rgba(10, 37, 64, 0.05)", border: "1px solid var(--line-200)", color: "var(--signal-navy)" }}
          >
            <Award className="w-3.5 h-3.5" /> WEEKLY FORECAST CHALLENGE
          </span>
          
          <h1 className="text-4xl md:text-7xl font-display font-extrabold uppercase leading-none tracking-tight">
            The Weekly <br />
            <span className="text-[#0a2540]">Market Call</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#555550] max-w-3xl leading-relaxed font-sans">
            Quantify your analytical bias, test your technical instincts, and track your long-term forecasting accuracy across primary global instruments. Build a verifiable track record, climb the scoreboard rankings, and earn a free upgrade to our premium **Edge Tier Subscription** — 100% risk-free.
          </p>
        </div>

        {/* Deep Explainer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 pt-12 border-t border-[#DEDDD8]">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-[#0a2540]/5 flex items-center justify-center text-[#0a2540]">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold uppercase tracking-wide text-black">What is the Market Call Challenge?</h3>
            <p className="text-sm text-[#555550] leading-relaxed font-sans">
              The Weekly Market Call is an educational forecasting utility designed to solve a major problem retail traders face: <strong>untracked cognitive bias</strong>. 
            </p>
            <p className="text-sm text-[#555550] leading-relaxed font-sans">
              Before risking real capital in live markets, a trader must develop and prove their directional instincts. This challenge asks you to formulate and log weekly forecasts on 6 of the most highly-liquid global instruments. By isolating and committing to your bias in a structured database, you gain objective feedback on your technical reads without any monetary risk.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-[#0a2540]/5 flex items-center justify-center text-[#0a2540]">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold uppercase tracking-wide text-black">Eliminate Cognitive Drift</h3>
            <p className="text-sm text-[#555550] leading-relaxed font-sans">
              Most traders suffer from recency and hindsight biases — remembering their successful predictions while mentally discarding their failures. This distortion hinders professional growth.
            </p>
            <p className="text-sm text-[#555550] leading-relaxed font-sans">
              By participating in each weekly forecasting cycle, you build an immutable <strong>Forecasting Ledger</strong>. Over weeks and months, this logs your overall win-rate, asset-specific accuracy, and performance streaks. The resulting database lets you verify whether you have a genuine statistical edge, or if your analytical model requires refining.
            </p>
          </div>
        </div>

        {/* Step-by-Step Cycle */}
        <div className="p-8 md:p-12 border border-[#DEDDD8] bg-white mb-16">
          <h3 className="text-2xl font-display font-black uppercase tracking-wide text-black mb-10 text-center md:text-left">The Weekly Forecasting Cycle</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Seeding & Analysis",
                desc: "Every Monday morning, the reference prices of our 6 core global instruments are recorded. Study the weekly setups, review the charts, and log your directional forecasts."
              },
              {
                step: "02",
                title: "The Tuesday Lock",
                desc: "The submission ledger locks on Tuesday at 23:59 UTC. After this lock point, no further forecasts can be logged or modified. The live prices then tick dynamically throughout the week."
              },
              {
                step: "03",
                title: "Settlement & Rewards",
                desc: "On Friday close, results resolve automatically. Participants who achieve the top position on the scoreboard are upgraded to 1 Month Free of our premium £99/mo Edge Tier."
              }
            ].map((item, i) => (
              <div key={i} className="space-y-3 md:border-l md:border-[#F0F0EE] md:pl-6 first:border-0 first:pl-0">
                <span className="text-2xl font-mono font-bold text-[#F9771D]">{item.step}</span>
                <h4 className="text-lg font-display font-bold uppercase tracking-wide text-[#1A1A1A]">{item.title}</h4>
                <p className="text-xs text-[#555550] leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Instruction Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-stretch">
          
          {/* Rules Details Box */}
          <div className="lg:col-span-2 p-8 md:p-12 border border-[#DEDDD8] bg-white flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide text-[#1A1A1A]">Guidelines & Evaluation Metrics</h3>
              
              <div className="space-y-4 font-sans text-sm text-[#555550] leading-relaxed">
                <div className="flex gap-3 items-start">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-black">Strict Submission Windows:</strong> The ledger is open for entries starting Monday at 00:00 UTC and <strong className="text-black">locks on Tuesday at 23:59 UTC</strong>. No submissions are accepted outside this period.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <TrendingUp className="w-5 h-5 text-[#F9771D] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-black">Performance Points:</strong> Each accurate directional call awards <strong className="text-black">10 Points</strong>. Incorrect calls receive 0 points. If an asset closes exactly flat with its Monday reference, it resolves as 'flat'.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Percent className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-black">Accuracy Tie-breakers:</strong> When points on the weekly scoreboard are tied, the participant with the highest historical prediction accuracy across all rounds is awarded the top podium rank.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F0F0EE] pt-6 mt-8">
              <span className="text-[10px] font-mono uppercase text-[#8A8A85] tracking-widest block mb-1">// COVERED ASSETS</span>
              <p className="text-xs text-[#555550] font-sans">
                GBP/USD, EUR/USD, USD/JPY, XAU/USD (Gold), UK100 (FTSE Index), and BTC/USD (Bitcoin).
              </p>
            </div>
          </div>

          {/* Dynamic CTA Box */}
          <div className="p-8 md:p-10 border border-[#DEDDD8] bg-white flex flex-col justify-between items-center text-center">
            <div className="space-y-4 w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-display font-bold uppercase text-black">Access the Scoreboard</h4>
              <p className="text-xs text-[#555550] leading-relaxed">
                Log in or create a free educational account to build your tracking ledger, submit your forecasts, and view public leaderboard standings.
              </p>
            </div>

            <div className="w-full space-y-4 mt-8">
              {loading ? (
                <div className="py-2.5 text-xs text-[#8A8A85] font-mono uppercase tracking-wider animate-pulse">Establishing secure session...</div>
              ) : user ? (
                <Link
                  href="/dashboard/market-call"
                  className="w-full py-3 bg-black hover:bg-black/90 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-1.5"
                >
                  Enter Weekly Ledger <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup?redirect=/dashboard/market-call"
                    className="w-full py-3 bg-black hover:bg-black/90 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Create Free Account
                  </Link>
                  <Link
                    href="/login?redirect=/dashboard/market-call"
                    className="w-full py-3 border border-black hover:bg-black/5 text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Sign In to Participate
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer Panel */}
        <div className="p-8 border border-[#DEDDD8] bg-[#FAF9F5] rounded-none space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider">Educational Simulation & Regulatory Disclaimer</h5>
          </div>
          <div className="space-y-2 text-[11px] text-[#555550] leading-relaxed font-sans">
            <p>
              The Weekly Market Call forecasting challenge is strictly an educational simulation. It does not function as, and must not be confused with, a trading signal, investment advice, or trade recommendation service. The feature is 100% free to participate, does not require real-money stakes, and awards no physical or monetary compensation.
            </p>
            <p>
              To maintain the integrity of our educational mission, individual forecasts and community aggregate sentiments are kept entirely hidden until the weekly submission window is locked. This safeguards against frontrunning and ensures that displayed data cannot be exploited as an active trade-signal system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
