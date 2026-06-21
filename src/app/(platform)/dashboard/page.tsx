"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BadgeGrid, allBadges, type Badge } from "@/components/badges/BadgeGrid";
import { 
  Play, 
  ArrowUpRight, 
  TrendingUp, 
  AlertCircle,
  Zap,
  CheckCircle2
} from "lucide-react";
import { BrokerWidget } from "@/components/market/BrokerWidget";
import { NewsWidget } from "@/components/market/NewsWidget";
import { MarketConsensus } from "@/components/market/MarketConsensus";
import { EmotionalPnL } from "@/components/dashboard/EmotionalPnL";
import { WatchlistManager } from "@/components/dashboard/WatchlistManager";
import { AlertCentre } from "@/components/dashboard/AlertCentre";
import { PsychologyCoach } from "@/components/dashboard/PsychologyCoach";
import { createClient } from "@/lib/supabase/client";
import { phases } from "@/data/courses";
import Link from "next/link";

type SubscriptionTier = 'free' | 'foundation' | 'edge' | 'floor';

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Morning");
  const [name, setName] = useState("Trader");
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [learningCard, setLearningCard] = useState<any>(null);
  const [latestBrief, setLatestBrief] = useState<any>(null);
  const [loadingBrief, setLoadingBrief] = useState(true);
  // Subscription tier — fetched from profiles table, used to gate premium UI elements.
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  // Earned badges — fetched from user_badges and merged with the static allBadges list.
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>(allBadges);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");

    const fetchBrief = async (supabase: any) => {
      try {
        const { data } = await supabase
          .from('daily_briefs')
          .select('*')
          .order('brief_date', { ascending: false })
          .limit(1)
          .single();
        
        if (data) setLatestBrief(data);
      } catch (err) {
        // Silently fail, use fallback
      } finally {
        setLoadingBrief(false);
      }
    };

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch daily brief
        fetchBrief(supabase);


        // ── Subscription tier + display name (single profiles fetch) ──────────
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, display_name')
          .eq('id', user.id)
          .single();
        const tier = (profile as any)?.subscription_tier as SubscriptionTier | undefined;
        if (tier) setSubscriptionTier(tier);

        // Name resolution order:
        // 1. user_metadata.first_name (set by Drawdown signup form)
        // 2. user_metadata.full_name (set by OAuth providers)
        // 3. profiles.full_name (set during onboarding or profile edit)
        // 4. Fallback: "Trader" (shown until any name is available)
        const metaFirst = user.user_metadata?.first_name;
        const metaFull  = user.user_metadata?.full_name?.split(" ")[0];
        const profileName = (profile as any)?.display_name?.split(" ")[0];
        const resolvedName = metaFirst || metaFull || profileName || "Trader";
        setName(resolvedName);

        // ── User badges (real earned state from user_badges table) ──
        const { data: userBadgeRows } = await supabase
          .from('user_badges')
          .select('badge_key, awarded_at')
          .eq('user_id', user.id);

        if (userBadgeRows) {
          // Merge with the static allBadges list so every badge appears,
          // but earned/earnedAt reflects what the user has actually achieved.
          const earnedKeys = new Map(
            userBadgeRows.map((row: any) => [row.badge_key, row.awarded_at as string])
          );
          const merged: Badge[] = allBadges.map(badge => ({
            ...badge,
            earned: earnedKeys.has(badge.key),
            earnedAt: earnedKeys.get(badge.key) ?? badge.earnedAt,
          }));
          setEarnedBadges(merged);
        }

        // 1. Fetch active funded challenge account
        const { data: accounts } = await supabase
          .from('funded_accounts')
          .select('*, prop_firms(*)')
          .eq('user_id', user.id)
          .eq('account_status', 'active')
          .limit(1);

        let activeAcc: any = null;
        let fetchedTrades: any[] = [];

        if (accounts && accounts.length > 0) {
          activeAcc = accounts[0];
          // Fetch challenge trades
          const { data: indTrades } = await supabase
            .from('individual_trades')
            .select('*')
            .eq('account_id', activeAcc.id)
            .order('entry_time', { ascending: false });

          if (indTrades) {
            fetchedTrades = indTrades;
          }
        }

        // If no challenge trades, load manual trades from 'trades' table
        if (fetchedTrades.length === 0) {
          const { data: manTrades } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', user.id)
            .order('entry_time', { ascending: false });

          if (manTrades) {
            fetchedTrades = manTrades.map((t: any) => ({
              id: t.id,
              account_id: 'manual',
              user_id: t.user_id,
              instrument: t.instrument,
              direction: t.direction,
              lot_size: Number(t.position_size || 0),
              entry_price: Number(t.entry_price || 0),
              exit_price: Number(t.exit_price || 0),
              entry_time: t.entry_time,
              exit_time: t.exit_time || undefined,
              pnl: Number(t.pnl || 0),
              net_pnl: Number(t.pnl || 0),
              session: t.session === 'asian' ? 'asia' : t.session,
              account_balance_at_entry: Number(t.account_balance_at_entry || 100000)
            }));
          }
        }

        // Setup active account object (or virtual portfolio)
        if (!activeAcc) {
          activeAcc = {
            id: "manual",
            user_id: user.id,
            prop_firm_id: "",
            account_name: "Manual Trading Portfolio",
            account_size: fetchedTrades.length > 0 ? Number(fetchedTrades[fetchedTrades.length - 1].account_balance_at_entry || 100000) : 100000,
            current_balance: fetchedTrades.length > 0 ? Number(fetchedTrades[fetchedTrades.length - 1].account_balance_at_entry || 100000) + fetchedTrades.reduce((acc, curr) => acc + (curr.net_pnl || 0), 0) : 100000,
            daily_loss_limit: 5000,
            daily_loss_type: 'balance_based' as const,
            max_drawdown_limit: 10000,
            max_drawdown_type: 'static' as const,
            days_traded: new Set(fetchedTrades.map(t => new Date(t.entry_time).toDateString())).size || 0,
            account_phase: 'funded' as const,
            account_status: 'active' as const,
            currency: "USD",
            platform: 'other' as const,
            created_at: user.created_at,
            updated_at: new Date().toISOString()
          };
        }

        setAccount(activeAcc);
        setTrades(fetchedTrades);

        // 2. Statistics calculations
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const mtdTrades = fetchedTrades.filter(t => new Date(t.entry_time) >= firstDayOfMonth);
        const totalMtd = mtdTrades.length;
        const winningMtd = mtdTrades.filter(t => (t.net_pnl || 0) > 0).length;

        const winRateMtd = totalMtd > 0 ? (winningMtd / totalMtd) * 100 : 0;

        let maxDrawdown = 0;
        if (accounts && (accounts as any).length > 0) {
          const acc = (accounts as any)[0];
          if (Number(acc.current_balance) < Number(acc.account_size)) {
            maxDrawdown = ((Number(acc.account_size) - Number(acc.current_balance)) / Number(acc.account_size)) * 100;
          }
        } else if (fetchedTrades.length > 0) {
          const initialBalance = Number(fetchedTrades[fetchedTrades.length - 1].account_balance_at_entry || 100000);
          let runningBal = initialBalance;
          let peak = initialBalance;
          let maxDDVal = 0;
          const sortedOldest = [...fetchedTrades].sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime());
          for (const t of sortedOldest) {
            runningBal += (t.net_pnl || 0);
            if (runningBal > peak) peak = runningBal;
            const dd = ((peak - runningBal) / peak) * 100;
            if (dd > maxDDVal) maxDDVal = dd;
          }
          maxDrawdown = maxDDVal;
        }

        const mtdProfit = mtdTrades.reduce((sum, curr) => sum + (curr.net_pnl || 0), 0);

        let currentStreak = 0;
        let streakType: 'win' | 'loss' | null = null;
        const sortedNewest = [...fetchedTrades].sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime());
        for (const t of sortedNewest) {
          const pnlVal = t.net_pnl || 0;
          if (pnlVal === 0) continue;
          const isWin = pnlVal > 0;
          if (streakType === null) {
            streakType = isWin ? 'win' : 'loss';
            currentStreak = 1;
          } else if ((streakType === 'win' && isWin) || (streakType === 'loss' && !isWin)) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStats([
          { 
            label: "Win Rate (MTD)", 
            value: totalMtd > 0 ? `${winRateMtd.toFixed(1)}%` : "0.0%", 
            color: "text-green-600", 
            note: totalMtd > 0 ? `${winningMtd} wins / ${totalMtd} trades` : "No trades this month" 
          },
          { 
            label: "Max Drawdown", 
            value: `-${maxDrawdown.toFixed(2)}%`, 
            color: "text-red-500", 
            note: accounts && accounts.length > 0 ? "Active challenge" : "Manual logs" 
          },
          { 
            label: "Total Profit", 
            value: (mtdProfit >= 0 ? "£" : "-£") + Math.abs(mtdProfit).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
            color: mtdProfit >= 0 ? "text-green-600" : "text-red-500", 
            note: "Net P&L this month" 
          },
          { 
            label: "Current Streak", 
            value: currentStreak > 0 ? `${currentStreak} ${streakType === 'win' ? 'Wins' : 'Losses'}` : "0 Trades", 
            color: streakType === 'win' ? "text-green-600" : "text-red-500", 
            note: streakType === 'win' ? "Keep up the discipline" : streakType === 'loss' ? "Stay calm, review rules" : "No recent trades" 
          },
        ]);

        // 3. Course Progression
        const { data: progress } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id);

        let nextPh = phases[0];
        let nextModIdx = 0;
        let foundInc = false;

        for (const phase of phases) {
          for (let m = 0; m < phase.modules_list.length; m++) {
            const isCompleted = (progress as any[])?.some((p: any) => p.phase === phase.id && p.module === (m + 1) && p.completed);
            if (!isCompleted) {
              nextPh = phase;
              nextModIdx = m;
              foundInc = true;
              break;
            }
          }
          if (foundInc) break;
        }

        // Bug B — curriculum complete: show a distinct state, not the last lesson
        if (!foundInc) {
          setLearningCard({ allComplete: true });
          return;
        }

        const completedInPhase = (progress as any[])?.filter((p: any) => p.phase === nextPh.id && p.completed).length || 0;
        const phaseModulesCount = nextPh.modules_list.length;
        const phaseProgressPct = Math.round((completedInPhase / phaseModulesCount) * 100);

        // Bug A — "Start Lesson" on a fresh account: detect any prior touch on this phase
        const hasStartedPhase = (progress as any[])?.some((p: any) => p.phase === nextPh.id) ?? false;

        // Sub-step deep-link: find the last_step recorded for this specific module
        const thisModuleRow = (progress as any[])?.find(
          (p: any) => p.phase === nextPh.id && p.module === (nextModIdx + 1)
        );
        const lastStep: string | undefined = thisModuleRow?.last_step;
        const moduleUrl = `/learn/${nextPh.slug}/module-${nextModIdx + 1}`;
        const lessonUrl = lastStep && lastStep !== "notes" ? `${moduleUrl}?step=${lastStep}` : moduleUrl;

        // Bug C — phase thumbnail: surface the image from courses.ts
        setLearningCard({
          phaseName: `Phase ${nextPh.id}: ${nextPh.name}`,
          moduleTitle: nextPh.modules_list[nextModIdx],
          progress: phaseProgressPct,
          lessonUrl,
          started: hasStartedPhase,
          phaseImage: nextPh.image,
        });

      } catch (err) {
        console.error("Dashboard page data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse pt-12 pb-24 max-w-7xl mx-auto px-6">
        <div className="h-20 bg-background-elevated border border-border-slate/50 rounded-xl" />
        <div className="h-40 bg-background-elevated border border-border-slate/50 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="h-48 bg-background-elevated border border-border-slate/50 rounded-xl" />
            <div className="h-64 bg-background-elevated border border-border-slate/50 rounded-xl" />
          </div>
          <div className="space-y-10">
            <div className="h-96 bg-background-elevated border border-border-slate/50 rounded-xl" />
            <div className="h-64 bg-background-elevated border border-border-slate/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 stagger-children">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border-slate/50">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">
            // MEMBER DASHBOARD — OVERVIEW
          </p>
          <h1 className="text-3xl md:text-4xl font-sans font-black uppercase text-text-primary">
            Welcome back, {name}.
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            href="/dashboard/tools/journal"
            className="px-6 py-3 text-white font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2 rounded-lg"
            style={{ backgroundColor: "#0A0A0A" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
          >
            Log A Trade <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Daily Briefing Card ("The Wire") */}
      <div className="p-8 bg-background-surface/40 border border-border-slate/50 rounded-xl relative group overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex items-center gap-2 text-accent">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-text-secondary">The Wire — Latest Briefing</span>
            </div>
            
            {loadingBrief ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-white/5 w-3/4 rounded-sm" />
                <div className="h-4 bg-white/5 w-full rounded-sm" />
              </div>
            ) : latestBrief ? (
              <>
                <h3 className="text-2xl font-display font-bold uppercase leading-tight text-text-primary">
                  {latestBrief.content_html.split('\n')[0].replace('#', '').replace('*', '').trim() || "Market Update"}
                </h3>
                <div className="text-text-tertiary text-sm leading-relaxed prose prose-sm max-w-none line-clamp-3">
                  {latestBrief.content_text.replace(/#/g, '').slice(0, 200)}...
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-display font-bold uppercase text-text-primary">UK CPI data came in below expectations.</h3>
                <p className="text-text-tertiary text-sm leading-relaxed">
                  Inflation cooled more than forecast this morning, putting pressure on GBP. 
                  Keep an eye on the 1.2680 level for potential support. No high-impact US news until 1:30 PM.
                </p>
              </>
            )}
          </div>
          <Link 
            href="/dashboard/news"
            className="self-start md:self-center px-8 py-3 text-white rounded-lg transition-colors text-xs font-bold uppercase tracking-widest shrink-0"
            style={{ backgroundColor: "#0A0A0A" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
          >
            {latestBrief ? "Read Full Brief" : "Full Analysis"}
          </Link>
        </div>
        <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-accent/5 -rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Learning */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Continue Learning</h4>

            {/* Bug B — Curriculum complete state */}
            {learningCard?.allComplete ? (
              <div className="p-8 bg-background-surface/40 border border-border-slate/50 rounded-xl flex flex-col md:flex-row items-center gap-8 transition-all duration-300">
                <div className="w-full md:w-48 aspect-video bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-10 h-10 text-profit" />
                </div>
                <div className="flex-grow space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-profit uppercase tracking-widest">Curriculum Complete</span>
                    <h5 className="text-xl font-display font-bold uppercase mt-1 text-text-primary">You&apos;ve completed the full programme.</h5>
                  </div>
                  <p className="text-text-tertiary text-xs leading-relaxed">Every phase done. Keep the edge sharp — join a live session, connect with the community, or explore the AI tools.</p>
                  <div className="flex gap-4 flex-wrap">
                    <Link href="/dashboard/live" className="text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-text-secondary transition-colors flex items-center gap-1">
                      Live Sessions <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <Link href="/dashboard/community" className="text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-text-secondary transition-colors flex items-center gap-1">
                      Community <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <Link href="/dashboard/tools" className="text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-text-secondary transition-colors flex items-center gap-1">
                      AI Tools <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-background-surface/40 border border-border-slate/50 rounded-xl flex flex-col md:flex-row gap-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                {/* Bug C — phase thumbnail */}
                <Link
                  href={learningCard?.lessonUrl || "#"}
                  className="w-full md:w-48 aspect-video rounded-lg flex items-center justify-center group cursor-pointer overflow-hidden relative bg-neutral-100"
                >
                  {learningCard?.phaseImage && (
                    <img
                      src={learningCard.phaseImage}
                      alt="Phase thumbnail"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[#0A0A0A]/30 group-hover:bg-[#0A0A0A]/50 transition-colors z-10 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:scale-110 transition-transform shadow-lg" />
                  </div>
                </Link>
                <div className="flex-grow space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{learningCard?.phaseName}</span>
                    <h5 className="text-xl font-display font-bold uppercase mt-1 text-text-primary">{learningCard?.moduleTitle}</h5>
                  </div>
                  <div className="space-y-2">
                    {/* Bug D — "Phase Progress" not "Module Progress" */}
                    <div className="flex justify-between text-[10px] font-mono uppercase text-text-tertiary">
                      <span>Phase Progress</span>
                      <span>{learningCard?.progress ?? 0}%</span>
                    </div>
                    <div className="h-1 bg-neutral-100 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-[#0A0A0A] rounded-full transition-all duration-500" style={{ width: `${learningCard?.progress ?? 0}%` }} />
                    </div>
                  </div>
                  {/* Bug A — Start vs Resume */}
                  <Link href={learningCard?.lessonUrl || "#"} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-text-secondary transition-colors">
                    {learningCard?.started ? "Resume Lesson" : "Start Lesson"} <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 rounded-xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 p-6 hover:border-border-slate/20 transition-colors">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-3">{stat.label}</p>
                  <div className={cn("text-3xl font-sans font-black mb-2", stat.color)}>
                    {stat.value}
                  </div>
                  <p className="text-[10px] font-mono text-text-tertiary">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Intelligence / Consensus */}
          <section className="pt-4">
            {/* userTier is the single entitlement source — edge/floor unlock AI Signal Synthesis */}
            <MarketConsensus userTier={subscriptionTier} />
          </section>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="space-y-12">
          {/* AI Psychology Coach */}
          <PsychologyCoach trades={trades} account={account} />

          <BrokerWidget />
          <EmotionalPnL />
          <NewsWidget />
        </div>
      </div>

      {/* Execution Hub: Watchlist & Alerts */}
      <section className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Execution Hub</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[500px]">
          <div className="lg:col-span-1">
            <WatchlistManager />
          </div>
          <div className="lg:col-span-1">
            <AlertCentre />
          </div>
          <div className="lg:col-span-1 p-8 bg-background-surface/40 border border-border-slate/50 rounded-xl flex flex-col justify-center items-center text-center space-y-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
             <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent animate-pulse" />
             </div>
             <div className="space-y-2">
                <h5 className="text-sm font-display font-bold uppercase text-text-primary">Ready to Automate?</h5>
                <p className="text-xs text-text-tertiary leading-relaxed px-4">
                   Use the Algo Strategy Builder to convert your manual rules into professional code.
                </p>
             </div>
             <Link 
               href="/dashboard/tools/algo-builder"
               className="px-8 py-3 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
               style={{ backgroundColor: "#0A0A0A" }}
               onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
               onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
             >
                Open Algo Builder
             </Link>
          </div>
        </div>
      </section>

      {/* Achievements at Bottom */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Achievements</h4>
        <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 rounded-xl">
          {/* earnedBadges is the allBadges list merged with real user_badges data from Supabase */}
          <BadgeGrid badges={earnedBadges} />
        </div>
      </div>
    </div>
  );
}
