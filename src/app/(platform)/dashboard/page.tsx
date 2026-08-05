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
  Target,
  Trophy
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
import { MacroPulseCard } from "@/components/dashboard/MacroPulseCard";

// ─── Custom CyberGuard Aesthetic Components ─────────────────────────────────
import { MarketIntelligenceHeroCard } from "@/components/dashboard/MarketIntelligenceHeroCard";
import { InstrumentIntelligenceCard } from "@/components/dashboard/InstrumentIntelligenceCard";
import { SessionTimeline } from "@/components/dashboard/SessionTimeline";
import { INSTRUMENTS_LIST } from "@/lib/instruments";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

type SubscriptionTier = 'free' | 'foundation' | 'edge' | 'floor';


export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Morning");
  const [name, setName] = useState("Trader");
  const [profile, setProfile] = useState<any>(null);
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
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [hasAccelerator, setHasAccelerator] = useState<boolean>(false);
  const [acceleratorWeek, setAcceleratorWeek] = useState<number>(1);

  // Redesign state: Selected Instrument + Timeframe
  const [selectedInst, setSelectedInst] = useState(INSTRUMENTS_LIST[0]);
  const [selectedInterval, setSelectedInterval] = useState("4h");

  // Workflow stages states
  const [todayPrep, setTodayPrep] = useState<any>(null);
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [activeCommitment, setActiveCommitment] = useState<any>(null);
  const [weeklyReviewDone, setWeeklyReviewDone] = useState<boolean>(false);

  // Polling and live feed generation is fully managed by useMarketIntelligence hook
  // within subcomponents to prevent double-fetching and save API rate limits.

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
          .select('subscription_tier, display_name, email_preferences, currency')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setProfile(profile);
          setUserCurrency((profile as any)?.currency || "USD");
        }
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

        // 1. Fetch today's session prep
        const todayStr = new Date().toISOString().slice(0, 10);
        const { data: prepData } = await supabase
          .from('session_preparations')
          .select('*')
          .eq('user_id', user.id)
          .eq('session_date', todayStr)
          .maybeSingle();
        setTodayPrep(prepData);

        // 2. Fetch active trade plans (draft or ready)
        const { data: plansData } = await supabase
          .from('trade_plans')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['draft', 'ready'])
          .order('created_at', { ascending: false });
        setActivePlans(plansData || []);

        // 3. Fetch trade records awaiting review
        const { data: recordsData } = await supabase
          .from('trade_records')
          .select('id, trade_plan_id, result_amount, opened_at, closed_at')
          .eq('user_id', user.id);

        const { data: reviewsData } = await supabase
          .from('trade_reviews')
          .select('trade_record_id')
          .eq('user_id', user.id);

        const reviewedIds = new Set((reviewsData || []).map((r: any) => r.trade_record_id));
        const pending = (recordsData || []).filter((r: any) => !reviewedIds.has(r.id));
        setPendingReviews(pending);

        // 4. Fetch active improvement commitment
        const { data: commitmentsData } = await supabase
          .from('improvement_commitments')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['open', 'in_progress', 'active'])
          .order('created_at', { ascending: false })
          .limit(1);
        setActiveCommitment(commitmentsData && commitmentsData.length > 0 ? commitmentsData[0] : null);

        // 5. Fetch weekly review status for this week
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0,0,0,0);
        const weekStartStr = d.toISOString().slice(0, 10);

        const { data: weeklyData } = await supabase
          .from('weekly_operating_reviews')
          .select('id')
          .eq('user_id', user.id)
          .eq('week_start', weekStartStr)
          .maybeSingle();
        setWeeklyReviewDone(!!weeklyData);

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

        // Fetch Institutional Accelerator enrolment status
        const { data: accEnrolment } = await supabase
          .from("accelerator_enrolments")
          .select("current_week")
          .eq("user_id", user.id)
          .eq("payment_status", "paid")
          .maybeSingle();

        if (accEnrolment) {
          setHasAccelerator(true);
          setAcceleratorWeek((accEnrolment as any).current_week);
        }
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

  const onboarding = profile?.email_preferences?.onboarding;

  // Resolve 7 Questions & Next CTA
  const getNextAction = () => {
    // 1. Prepare today?
    if (!todayPrep) {
      return {
        title: "Start Session Preparation",
        desc: "You have not completed your session check-in rules or verified daily risk allowance. Prepare before drafting setup plans.",
        href: "/dashboard/prepare",
        actionText: "Prepare Workspace",
        stage: "Stage 1: Prepare"
      };
    }
    // 2. Stood down?
    if (todayPrep.outcome === 'stand_down') {
      return {
        title: "Stand Down Active",
        desc: "Today's rules or account metrics advised standing down. Focus on the learning curriculum or historical studies.",
        href: "/dashboard/curriculum",
        actionText: "Open Curriculum",
        stage: "Stand Down Enforced"
      };
    }
    // 3. Draft plan?
    const draftPlan = activePlans.find(p => p.status === 'draft');
    if (draftPlan) {
      return {
        title: "Complete Draft Trade Plan",
        desc: `You have an unfinished plan for ${draftPlan.instrument}. Define execution zones and calculate invalidation spacing.`,
        href: "/dashboard/plan",
        actionText: "Complete Plan",
        stage: "Stage 2: Plan"
      };
    }
    // 4. Ready plan awaiting execution?
    const readyPlan = activePlans.find(p => p.status === 'ready');
    if (readyPlan) {
      return {
        title: "Enter Execution Boundary",
        desc: `Your plan for ${readyPlan.instrument} (${readyPlan.direction.toUpperCase()}) is active. Proceed to execute elsewhere via your broker.`,
        href: `/dashboard/plan/${readyPlan.id}/execute`,
        actionText: "Execution Portal",
        stage: "Stage 3: Execute"
      };
    }
    // 5. Open/unrecorded trades?
    // In our simplified flow, we check if any executed plans aren't recorded or if records await detail.
    // Fallback: Awaiting reviews
    if (pendingReviews.length > 0) {
      const record = pendingReviews[0];
      return {
        title: "Complete Process Review",
        desc: `Evaluate your process adherence and rule discipline for your latest trade. Outcomes are secondary.`,
        href: `/dashboard/review/${record.id}`,
        actionText: "Review Trade",
        stage: "Stage 5: Review"
      };
    }
    // 6. Weekend review?
    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    if (isWeekend && !weeklyReviewDone) {
      return {
        title: "Perform Weekly Operating Review",
        desc: "Close the loop on your week. Sign off on process consistency averages, wins, and select next week's improvement rule.",
        href: "/dashboard/weekly-review",
        actionText: "Start Weekly Review",
        stage: "Stage 7: Repeat"
      };
    }

    // Default: Check scanner
    return {
      title: "Explore Market Scanner",
      desc: "All today's operating tasks are complete. Monitor session timelines, watchlist alerts, or backtest strategies.",
      href: "/dashboard/tools/technical-scanner",
      actionText: "Open Scanner",
      stage: "Workflow Clear"
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-8 text-[#1A1A1A]">
      
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="// OPERATING SYSTEM WORKSPACE"
        title={<>Today Workspace.</>}
        description="Solve feature sprawl by giving every capability a defined role in one repeatable discipline workflow."
      />

      {/* ── Today Workspace Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Work Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Question 7: Next Action (Headline Workspace Card) */}
          <div className="p-6 bg-[#0E1015] border border-indigo-500/30 rounded-xl relative overflow-hidden text-[#E4E2DD]">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
            <div className="relative space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400">// Next Recommended Action</span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                  {nextAction.stage}
                </span>
              </div>
              <h2 className="text-2xl font-bold uppercase text-white">{nextAction.title}</h2>
              <p className="text-xs text-[#9A9A95] leading-relaxed max-w-xl">{nextAction.desc}</p>
              <div className="pt-2">
                <Link
                  href={nextAction.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-indigo-400 transition-colors"
                >
                  {nextAction.actionText} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Question 3, 4, 5: Outstanding Items & Workflow Traversal */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">// Active Workflow Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Daily Prep Status */}
              <div className="p-4 border border-[#EDEDED] rounded-xl bg-slate-50/50 space-y-2">
                <div className="text-[9px] font-mono text-[#555550] uppercase tracking-wider">1. Prepare Today</div>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", todayPrep ? "bg-emerald-500 animate-pulse" : "bg-amber-400")} />
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {todayPrep ? `Prepared (${todayPrep.outcome.toUpperCase()})` : "Not Prepared"}
                  </span>
                </div>
                <Link href="/dashboard/prepare" className="text-[10px] font-mono text-indigo-500 hover:underline block pt-1">
                  Go to Prep →
                </Link>
              </div>

              {/* Plans Created Status */}
              <div className="p-4 border border-[#EDEDED] rounded-xl bg-slate-50/50 space-y-2">
                <div className="text-[9px] font-mono text-[#555550] uppercase tracking-wider">2. Trade Plans</div>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", activePlans.length > 0 ? "bg-indigo-500" : "bg-neutral-300")} />
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {activePlans.length > 0 ? `${activePlans.length} Active Plan(s)` : "No Active Plans"}
                  </span>
                </div>
                <Link href="/dashboard/plan" className="text-[10px] font-mono text-indigo-500 hover:underline block pt-1">
                  Go to Plan →
                </Link>
              </div>

              {/* Pending Reviews Status */}
              <div className="p-4 border border-[#EDEDED] rounded-xl bg-slate-50/50 space-y-2">
                <div className="text-[9px] font-mono text-[#555550] uppercase tracking-wider">3. Process Reviews</div>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", pendingReviews.length > 0 ? "bg-amber-500" : "bg-emerald-500")} />
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {pendingReviews.length > 0 ? `${pendingReviews.length} Review(s) Due` : "All Reviews Completed"}
                  </span>
                </div>
                <Link href="/dashboard/record" className="text-[10px] font-mono text-indigo-500 hover:underline block pt-1">
                  Go to Journal →
                </Link>
              </div>
            </div>
          </div>

          {/* Question 2: Market Context (Watchlist only) */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">// Local Market Context</h3>
              <span className="text-[10px] text-text-tertiary">Watchlist Instruments Only</span>
            </div>
            <WatchlistSummary initialSymbols={watchlistItems} userCurrency={userCurrency} />
          </div>

        </div>

        {/* Sidebar Info Column (1 Col) */}
        <div className="space-y-8">
          
          {/* Question 1: Risk Snapshot */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">// Risk Snapshot</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#F0F0F0]">
                <span className="text-[#555550]">Active Account</span>
                <span className="font-bold text-[#1A1A1A]">{account?.account_name || "Demo Account"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F0F0F0]">
                <span className="text-[#555550]">Size / Balance</span>
                <span className="font-mono text-[#1A1A1A]">
                  ${account?.current_balance?.toLocaleString() || "100,000"} / ${account?.account_size?.toLocaleString() || "100,000"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F0F0F0]">
                <span className="text-[#555550]">Daily Loss Limit</span>
                <span className="font-mono text-[#1A1A1A]">-${account?.daily_loss_limit?.toLocaleString() || "5,000"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#555550]">Max Drawdown Limit</span>
                <span className="font-mono text-[#CE6969]">-${account?.max_drawdown_limit?.toLocaleString() || "10,000"}</span>
              </div>
            </div>
          </div>

          {/* Question 6: Weekly Focus */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">// Weekly Improvement Focus</h3>
            
            {activeCommitment ? (
              <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg space-y-2">
                <span className="text-[9px] font-mono bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">
                  {activeCommitment.category}
                </span>
                <p className="text-xs font-bold text-[#1A1A1A] leading-normal">{activeCommitment.title}</p>
                {activeCommitment.target_date && (
                  <p className="text-[10px] text-text-tertiary">Due: {new Date(activeCommitment.target_date).toLocaleDateString()}</p>
                )}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#EDEDED] rounded-lg text-center space-y-2">
                <p className="text-xs text-[#555550]">No active commitment. Formulate one after your next trade review.</p>
                <Link
                  href="/dashboard/improve"
                  className="inline-block text-[10px] font-mono text-indigo-500 hover:underline uppercase tracking-wider"
                >
                  Go to Improve →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Router Panel */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">// Quick Operations</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/prepare" className="p-3 border border-[#EDEDED] rounded-lg text-center hover:bg-slate-50/50 transition-colors">
                <div className="text-[10px] font-mono text-[#555550] uppercase">1. Prepare</div>
              </Link>
              <Link href="/dashboard/plan" className="p-3 border border-[#EDEDED] rounded-lg text-center hover:bg-slate-50/50 transition-colors">
                <div className="text-[10px] font-mono text-[#555550] uppercase">2. Plan</div>
              </Link>
              <Link href="/dashboard/record" className="p-3 border border-[#EDEDED] rounded-lg text-center hover:bg-slate-50/50 transition-colors">
                <div className="text-[10px] font-mono text-[#555550] uppercase">3. Record</div>
              </Link>
              <Link href="/dashboard/weekly-review" className="p-3 border border-[#EDEDED] rounded-lg text-center hover:bg-slate-50/50 transition-colors">
                <div className="text-[10px] font-mono text-[#555550] uppercase">4. Weekly</div>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Market intelligence hero & Technical Timeline elements below for scanner lookup */}
      <div className="border-t border-[#EDEDED] pt-8 space-y-8">
        <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">// Session Timeline & Market scanner</h3>
        
        <MarketIntelligenceHeroCard
          instruments={INSTRUMENTS_LIST}
          initialInstrument={INSTRUMENTS_LIST[0]}
          selectedInterval={selectedInterval}
          userCurrency={userCurrency}
          todayTradeCount={trades.filter((t: any) => {
            const entry = new Date(t.entry_time);
            const today = new Date();
            return entry.toDateString() === today.toDateString();
          }).length}
          onInstrumentChange={(inst) => setSelectedInst(inst as any)}
          onTimeframeChange={setSelectedInterval}
        />
        <InstrumentIntelligenceCard instrument={selectedInst} interval={selectedInterval} />
      </div>

      {/* Session Timeline bottom widget */}
      <SessionTimeline />

    </div>
  );
}
