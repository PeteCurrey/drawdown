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
  LogIn
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
            <Award className="w-3.5 h-3.5" /> FREE WEEKLY PREDICTION GAME
          </span>
          
          <h1 className="text-4xl md:text-7xl font-display font-extrabold uppercase leading-none tracking-tight">
            The Weekly <br />
            <span className="text-[#0a2540]">Market Call</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#555550] max-w-3xl leading-relaxed font-sans">
            Test your directional bias, analyze core markets, and climb the public standings scoreboard. Every week, players compete for prestige, badges, and a free upgrade to our **Edge Tier Subscription** — without ever risking a single penny.
          </p>
        </div>

        {/* Big Step Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 pt-12 border-t border-[#DEDDD8]">
          {[
            {
              step: "01",
              title: "Pick Your bias",
              desc: "Every Monday, six major global instruments are loaded. Analyze the charts and choose whether each instrument will close Higher or Lower on Friday relative to its starting price."
            },
            {
              step: "02",
              title: "Track Live Drift",
              desc: "Once predictions lock on Tuesday midnight, watch the board tick. Your entries update in real time relative to live price-cache feeds so you can track your accuracy live."
            },
            {
              step: "03",
              title: "Claim Edge tier",
              desc: "On Friday close, results finalize. The top player with the highest score and accuracy wins the 'Verified Caller' badge and 1 Month Free of our premium Edge Tier (£99/mo)."
            }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <span className="text-3xl font-mono font-bold text-[#F9771D]">{item.step}</span>
              <h3 className="text-xl font-display font-bold uppercase tracking-wide text-[#1A1A1A]">{item.title}</h3>
              <p className="text-sm text-[#555550] leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Instruction Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-stretch">
          
          {/* Rules Details Box */}
          <div className="lg:col-span-2 p-8 md:p-12 border border-[#DEDDD8] bg-white flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide text-[#1A1A1A]">Official Rules & Resolution</h3>
              
              <div className="space-y-4 font-sans text-sm text-[#555550] leading-relaxed">
                <div className="flex gap-3 items-start">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-black">The Clock is Absolute:</strong> The game board opens on Monday 00:00 UTC and <strong className="text-black">locks on Tuesday 23:59 UTC</strong>. No entries can be registered, modified, or updated after this deadline.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <TrendingUp className="w-5 h-5 text-[#F9771D] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-black">Directional Points:</strong> Each accurate call awards <strong className="text-black">10 Points</strong>. Incorrect calls receive 0 points. If an asset closes exactly flat with its Monday reference, the outcome resolves to 'flat'.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-black">Podium Tie-breakers:</strong> In the event of a points tie, the winner is determined by highest average prediction accuracy across all historical rounds.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F0F0EE] pt-6 mt-8">
              <span className="text-[10px] font-mono uppercase text-[#8A8A85] tracking-widest block mb-1">// ASSET INDEX</span>
              <p className="text-xs text-[#555550] font-sans">
                GBP/USD, EUR/USD, USD/JPY, XAU/USD (Gold), UK100 (FTSE), and BTC/USD (Bitcoin).
              </p>
            </div>
          </div>

          {/* Dynamic CTA Box */}
          <div className="p-8 md:p-10 border border-[#DEDDD8] bg-white flex flex-col justify-between items-center text-center">
            <div className="space-y-4 w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-display font-bold uppercase text-black">Join the Scoreboard</h4>
              <p className="text-xs text-[#555550] leading-relaxed">
                Create a free account or log in to make your predictions, view the live standings podium, and claim rewards.
              </p>
            </div>

            <div className="w-full space-y-4 mt-8">
              {loading ? (
                <div className="py-2.5 text-xs text-[#8A8A85] font-mono uppercase tracking-wider animate-pulse">Syncing session...</div>
              ) : user ? (
                <Link
                  href="/dashboard/market-call"
                  className="w-full py-3 bg-black hover:bg-black/90 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-1.5"
                >
                  Enter Weekly Game <ArrowRight className="w-3.5 h-3.5" />
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
                    <LogIn className="w-4 h-4" /> Sign In to Play
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
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider">Educational Simulation Disclaimer</h5>
          </div>
          <div className="space-y-2 text-[11px] text-[#555550] leading-relaxed font-sans">
            <p>
              The Weekly Market Call prediction game is purely an educational simulation and does not function as a trading signal or financial advice service. The feature is 100% free-to-play, requires no real-money stakes, and awards no real financial compensation or cash prizes.
            </p>
            <p>
              To maintain the integrity of our educational mission, individual player picks and aggregate community directional sentiments are strictly hidden from public view until the weekly submission window is finalized. This safeguards against frontrunning and ensures that displayed data cannot be exploited as an active trade-signal system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
