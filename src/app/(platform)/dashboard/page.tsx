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
  CheckCircle2,
  ChevronRight,
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
import { WatchlistSummary } from "@/components/dashboard/WatchlistSummary";

// ─── Custom CyberGuard Aesthetic Components ─────────────────────────────────
import { MarketIntelligenceHeroCard } from "@/components/dashboard/MarketIntelligenceHeroCard";
import { InstrumentIntelligenceCard } from "@/components/dashboard/InstrumentIntelligenceCard";
import { SessionTimeline } from "@/components/dashboard/SessionTimeline";
import { INSTRUMENTS_LIST } from "@/lib/instruments";

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
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>(allBadges);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [passedModuleIds, setPassedModuleIds] = useState<string[]>([]);
  const [watchlistItems, setWatchlistItems] = useState<string[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);

  // Redesign state: Selected Instrument + Timeframe
  const [selectedInst, setSelectedInst] = useState(INSTRUMENTS_LIST[0]);
  const [selectedInterval, setSelectedInterval] = useState("4h");

  // Polling and live feed generation is fully managed by useMarketIntelligence hook
  // within subcomponents to prevent double-fetching and save API rate limits.
  const feedItems: any[] = [];

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
      } catch (err) {} finally {
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

        fetchBrief(supabase);

        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, display_name')
          .eq('id', user.id)
          .single();
        const tier = (profile as any)?.subscription_tier as SubscriptionTier | undefined;
        if (tier) setSubscriptionTier(tier);

        const metaFirst = user.user_metadata?.first_name;
        const metaFull  = user.user_metadata?.full_name?.split(" ")[0];
        const profileName = (profile as any)?.display_name?.split(" ")[0];
        const resolvedName = metaFirst || metaFull || profileName || "Trader";
        setName(resolvedName);

        const { data: userBadgeRows } = await supabase
          .from('user_badges')
          .select('badge_key, awarded_at')
          .eq('user_id', user.id);

        if (userBadgeRows) {
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

        const { data: allCourses } = await supabase
          .from('courses' as any)
          .select(`
            id, slug, title, description, thumbnail_url, is_free_for_floor, price_gbp,
            course_modules ( id, sort_order )
          `)
          .eq('is_published', true);

        const { data: purchases } = await supabase
          .from('course_purchases' as any)
          .select('course_id, access_granted_via, purchased_at')
          .eq('user_id', user.id);

        const { data: quizAttempts } = await supabase
          .from('course_quiz_attempts' as any)
          .select('module_id, passed')
          .eq('user_id', user.id)
          .eq('passed', true);
        const passedModIds = quizAttempts?.map((a: any) => a.module_id) || [];
        setPassedModuleIds(passedModIds);

        const isFloorUser = tier === 'floor';
        const purchasedIds = purchases?.map((p: any) => p.course_id) || [];

        if (isFloorUser && purchasedIds.length === 0 && (allCourses?.filter((c: any) => c.is_free_for_floor).length || 0) > 0) {
          await (supabase as any).rpc('grant_floor_courses', { p_user_id: user.id });
          const { data: refetched } = await supabase
            .from('course_purchases' as any)
            .select('course_id, access_granted_via, purchased_at')
            .eq('user_id', user.id);
          if (refetched) {
            purchasedIds.push(...(refetched as any[]).map((p: any) => p.course_id));
          }
        }

        if (allCourses) {
          const enriched = await Promise.all((allCourses as any[]).map(async (course: any) => {
            const hasAccess = purchasedIds.includes(course.id) || (isFloorUser && course.is_free_for_floor);
            const [{ count: totalLessons }, { count: completedLessons }] = await Promise.all([
              supabase.from('course_lessons' as any).select('id', { count: 'exact', head: true }).eq('course_id', course.id),
              supabase.from('course_progress' as any).select('id', { count: 'exact', head: true }).eq('course_id', course.id).eq('user_id', user.id),
            ]);
            const pct = totalLessons ? Math.round(((completedLessons ?? 0) / totalLessons) * 100) : 0;
            const purchaseRecord = (purchases as any[])?.find((p: any) => p.course_id === course.id);
            const accessGrantedVia = purchaseRecord?.access_granted_via || (isFloorUser && course.is_free_for_floor ? 'floor_tier' : null);
            const modIds = [...(course.course_modules || [])]
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((m: any) => m.id);

            return {
              id: course.id,
              slug: course.slug,
              title: course.title,
              description: course.description,
              price_gbp: course.price_gbp,
              hasAccess,
              access_granted_via: accessGrantedVia,
              modIds,
              _totalLessons: totalLessons,
              _completedLessons: completedLessons ?? 0,
              _progress: pct,
            };
          }));
          setMyCourses(enriched);
        }

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
          const { data: indTrades } = await supabase
            .from('individual_trades')
            .select('*')
            .eq('account_id', activeAcc.id)
            .order('entry_time', { ascending: false });
          if (indTrades) fetchedTrades = indTrades;
        }

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
          { label: "Win Rate (MTD)", value: totalMtd > 0 ? `${winRateMtd.toFixed(1)}%` : "0.0%", color: "text-[#18B880]", note: totalMtd > 0 ? `${winningMtd} wins / ${totalMtd} trades` : "No trades this month" },
          { label: "Max Drawdown", value: `-${maxDrawdown.toFixed(2)}%`, color: "text-[#CE6969]", note: accounts && accounts.length > 0 ? "Active challenge" : "Manual logs" },
          { label: "Total Profit", value: (mtdProfit >= 0 ? "£" : "-£") + Math.abs(mtdProfit).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), color: mtdProfit >= 0 ? "text-[#18B880]" : "text-[#CE6969]", note: "Net P&L this month" },
          { label: "Current Streak", value: currentStreak > 0 ? `${currentStreak} ${streakType === 'win' ? 'Wins' : 'Losses'}` : "0 Trades", color: streakType === 'win' ? "text-[#18B880]" : "text-[#CE6969]", note: streakType === 'win' ? "Keep up the discipline" : "Stay calm, review rules" }
        ]);

        const { data: progress } = await supabase.from('course_progress').select('*').eq('user_id', user.id);
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

        if (!foundInc) {
          setLearningCard({ allComplete: true });
        } else {
          const completedInPhase = (progress as any[])?.filter((p: any) => p.phase === nextPh.id && p.completed).length || 0;
          const phaseModulesCount = nextPh.modules_list.length;
          const phaseProgressPct = Math.round((completedInPhase / phaseModulesCount) * 100);
          const hasStartedPhase = (progress as any[])?.some((p: any) => p.phase === nextPh.id) ?? false;
          const thisModuleRow = (progress as any[])?.find(p => p.phase === nextPh.id && p.module === (nextModIdx + 1));
          const lastStep = thisModuleRow?.last_step;
          const moduleUrl = `/learn/${nextPh.slug}/module-${nextModIdx + 1}`;
          const lessonUrl = lastStep && lastStep !== "notes" ? `${moduleUrl}?step=${lastStep}` : moduleUrl;

          setLearningCard({
            phaseName: `Phase ${nextPh.id}: ${nextPh.name}`,
            moduleTitle: nextPh.modules_list[nextModIdx],
            progress: phaseProgressPct,
            lessonUrl,
            started: hasStartedPhase,
            phaseImage: nextPh.image,
          });
        }

        // Fetch active watchlist items from user_watchlists table
        const { data: wlData } = await supabase
          .from('user_watchlists')
          .select('symbol')
          .eq('user_id', user.id);
        const symbolsToFetch = wlData && wlData.length > 0
          ? wlData.map((item: any) => item.symbol)
          : ["GBP/USD", "XAU/USD"];
        
        setWatchlistItems(symbolsToFetch);
        setWatchlistLoading(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse pt-6 max-w-7xl mx-auto">
        <div className="h-40 bg-[#181818] rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl shadow-sm" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-[#1A1A1A]">
      
      {/* HERO: Market Intelligence Card */}
      <MarketIntelligenceHeroCard
        instruments={INSTRUMENTS_LIST}
        initialInstrument={selectedInst}
        feedItems={feedItems}
        selectedInterval={selectedInterval}
        todayTradeCount={trades.filter(t => {
          const today = new Date();
          const entry = new Date(t.entry_time);
          return entry.toDateString() === today.toDateString();
        }).length}
        openAlerts={[
          { label: "Price", count: 0, color: "orange" as const },
          { label: "RSI",   count: 0, color: "red"    as const },
        ]}
        onInstrumentChange={(inst) => setSelectedInst(inst as any)}
        onTimeframeChange={setSelectedInterval}
      />

      {/* INSTRUMENT INTELLIGENCE: Technical detail card — synced to hero instrument selector */}
      <InstrumentIntelligenceCard instrument={selectedInst} interval={selectedInterval} />

      {/* PHASE 3 — Overview Dashboard Card Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Learning Progress */}
        <div className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 duration-200">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h5 className="font-semibold text-sm text-[#1A1A1A]">Curriculum</h5>
              <Link href="/dashboard/curriculum" className="text-xs text-[#555550] hover:text-[#1A1A1A]">↗</Link>
            </div>
            
            {/* Course status details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#555550]">Phase 1: Ground Zero</span>
                <span className="font-mono text-[#18B880]">8/8 ✓</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#555550]">Phase 2: Chart Reader</span>
                <span className="font-mono text-[#F9771D]">{learningCard?.progress || 0}%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="w-full h-px bg-[#F0F0F0] mb-2" />
            <div className="flex justify-between items-center text-[10px] font-mono text-[#555550]">
              <span>Active Tier</span>
              <span className="text-[#F9771D] font-bold">{subscriptionTier.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Card 2: The Wire */}
        <div className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 duration-200">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h5 className="font-semibold text-sm text-[#1A1A1A]">The Wire</h5>
              <Link href="/dashboard/the-wire" className="text-xs text-[#555550] hover:text-[#1A1A1A]">↗</Link>
            </div>
            
            <div className="space-y-1.5 text-xs text-[#555550]">
              <p className="line-clamp-3">
                {latestBrief ? latestBrief.content_text.slice(0, 120) : "Markets closed out last session with key technical structures intact. Monitor support levels closely."}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EDEDED] flex justify-between items-center text-[9px] font-mono text-[#555550]">
            <span>Last Updated</span>
            <span>{latestBrief ? new Date(latestBrief.created_at).toLocaleTimeString() : "07:00 GMT"}</span>
          </div>
        </div>

        {/* Card 3: AI Tools */}
        <div className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 duration-200">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h5 className="font-semibold text-sm text-[#1A1A1A]">AI Terminal Tools</h5>
              <Link href="/dashboard/tools" className="text-xs text-[#555550] hover:text-[#1A1A1A]">↗</Link>
            </div>
            
            <div className="space-y-1 text-xs">
              <Link href="/dashboard/journal" className="block text-[#555550] hover:text-[#1A1A1A] hover:underline">
                › AI Trade Journal (Free)
              </Link>
              <Link href="/dashboard/tools/position-sizer" className="block text-[#555550] hover:text-[#1A1A1A] hover:underline">
                › Position Sizer (Free)
              </Link>
              <Link href="/dashboard/tools/technical-scanner" className="block text-[#555550] hover:text-[#1A1A1A] hover:underline">
                › Confluence Scanner (Edge+)
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EDEDED] text-right">
            <span className="text-[10px] font-mono text-[#555550]">3 More Available →</span>
          </div>
        </div>

        {/* Card 4: Watchlist Summary */}
        <WatchlistSummary initialSymbols={watchlistItems} />

      </section>

      {/* Legacy/Detailed Content Containers - keeping data active without templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Account Stats */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Performance Analytics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#555550] mb-2">{stat.label}</p>
                  <div className={cn("text-2xl font-mono font-black mb-1", stat.color)}>
                    {stat.value}
                  </div>
                  <p className="text-[9px] font-mono text-[#555550]">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Signal Synthesis / Consensus */}
          <section className="pt-4">
            <MarketConsensus userTier={subscriptionTier} />
          </section>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-12">
          <PsychologyCoach trades={trades} account={account} />
          <NewsWidget />
          <EmotionalPnL />
          <BrokerWidget />
        </div>
      </div>

      {/* Execution Hub: Watchlist & Alerts */}
      <section className="space-y-6 pt-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Execution Hub</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WatchlistManager />
          <AlertCentre />
          
          <div className="bg-white border border-[#EDEDED] rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
             <div className="w-12 h-12 bg-[#F9771D]/10 border border-[#F9771D]/20 flex items-center justify-center rounded-xl">
                <Zap className="w-6 h-6 text-[#F9771D] animate-pulse" />
             </div>
             <div className="space-y-2">
                <h5 className="text-sm font-semibold uppercase text-[#1A1A1A]">Ready to Automate?</h5>
                <p className="text-xs text-[#555550] leading-relaxed px-4">
                   Use the Algo Strategy Builder to convert your manual rules into professional code.
                </p>
             </div>
             <Link 
               href="/dashboard/tools/algo-builder"
               className="px-8 py-3 text-white text-[10px] font-bold uppercase tracking-widest transition-colors bg-[#181818] hover:bg-[#333330] rounded-xl"
             >
                Open Algo Builder
             </Link>
          </div>
        </div>
      </section>

      {/* Achievements at Bottom */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Achievements</h4>
        <div className="p-8 bg-white border border-[#EDEDED] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <BadgeGrid badges={earnedBadges} />
        </div>
      </div>

      {/* Fixed bottom timeline widget */}
      <SessionTimeline />

    </div>
  );
}
