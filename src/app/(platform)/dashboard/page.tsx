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
  Trophy,
  Wallet,
  X
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

import { MarketIntelligenceHeroCard } from "@/components/dashboard/MarketIntelligenceHeroCard";
import { InstrumentIntelligenceCard } from "@/components/dashboard/InstrumentIntelligenceCard";
import { SessionTimeline } from "@/components/dashboard/SessionTimeline";
import { INSTRUMENTS_LIST } from "@/lib/instruments";
import {
  DashboardPanel,
  DashboardPanelHeader,
  DashboardMetric,
  DashboardDataRow,
  DashboardStatus,
  DashboardBadge,
  DashboardRiskBar,
  DashboardEmptyState,
  DashboardSkeleton,
  DashboardDivider,
  DashboardActionLink,
} from "@/components/dashboard/ui/DashboardShell";
import { Shield, Activity, Calendar } from "lucide-react";


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
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState<boolean>(false);

  // Polling and live feed generation is fully managed by useMarketIntelligence hook
  // within subcomponents to prevent double-fetching and save API rate limits.

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("subscription") === "success") {
        setShowSubscriptionSuccess(true);
      }
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");

    const fetchBrief = async (supabase: any) => {
      try {
        // Authoritative source: daily_briefings (written by cron/daily-report)
        // daily_briefs is retained for the email newsletter cron only
        const { data } = await supabase
          .from('daily_briefings')
          .select('*')
          .order('report_date', { ascending: false })
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
        const supabase = createClient() as any;
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
            earnedAt: (earnedKeys.get(badge.key) as string | undefined) ?? badge.earnedAt,
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
          // No funded account — show honest empty state.
          // Do NOT fabricate account data, balance, limits, or phase.
          setAccount(null);
          setTrades([]);
          setStats([
            { label: "Win Rate (MTD)", value: "--", color: "text-[#9A9A95]", note: "No account data" },
            { label: "Max Drawdown", value: "--", color: "text-[#9A9A95]", note: "No account data" },
            { label: "Total Profit", value: "--", color: "text-[#9A9A95]", note: "No account data" },
            { label: "Current Streak", value: "--", color: "text-[#9A9A95]", note: "No account data" },
          ]);
        } else {
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
            const initialBalance = Number(fetchedTrades[fetchedTrades.length - 1].account_balance_at_entry || 0);
            if (initialBalance > 0) {
              let runningBal = initialBalance;
              let peak = initialBalance;
              let maxDDVal = 0;
              const sortedOldest = [...fetchedTrades].sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime());
              for (const t of sortedOldest) {
                runningBal += (t.net_pnl || 0);
                if (runningBal > peak) peak = runningBal;
                const dd = peak > 0 ? ((peak - runningBal) / peak) * 100 : 0;
                if (dd > maxDDVal) maxDDVal = dd;
              }
              maxDrawdown = maxDDVal;
            }
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
        }



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
      <div className="space-y-6 max-w-[1540px] mx-auto animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E6E1]">
          <div className="space-y-2">
            <DashboardSkeleton height="h-7" className="w-56" />
            <DashboardSkeleton height="h-4" className="w-80" />
          </div>
          <DashboardSkeleton height="h-8" className="w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#E8E6E1] rounded-lg p-6 space-y-4">
              <DashboardSkeleton height="h-4" className="w-36" />
              <DashboardSkeleton height="h-10" className="w-64" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#F0EEE9]">
                {[0, 1, 2, 3].map(i => <DashboardSkeleton key={i} height="h-12" />)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E6E1] rounded-lg p-6 space-y-4">
              <DashboardSkeleton height="h-4" className="w-32" />
              <DashboardSkeleton height="h-8" className="w-full" />
              <DashboardSkeleton height="h-16" className="w-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white border border-[#E8E6E1] rounded-lg p-5 space-y-3">
              <DashboardSkeleton height="h-4" className="w-28" />
              <DashboardSkeleton height="h-24" className="w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const onboarding = profile?.email_preferences?.onboarding;

  // Resolve 7 Questions & Next CTA
  const getNextAction = () => {
    // 0. Account check (Truth before features & Next Action principle)
    if (!account) {
      return {
        title: "Configure Your Trading Account",
        desc: "Connect your prop firm challenge, funded account, or personal broker to enable automated drawdown protection and real-time equity tracking.",
        href: "/dashboard/accounts",
        actionText: "Add Account",
        stage: "Stage 0: Setup"
      };
    }

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

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const currencySymbol = userCurrency === "GBP" ? "£" : userCurrency === "EUR" ? "€" : "$";

  // Account calculations
  const accountSize = Number(account?.account_size || 0);
  const currentBalance = Number(account?.current_balance || 0);
  const dailyLossLimit = Number(account?.daily_loss_limit || 0);
  const maxDrawdownLimit = Number(account?.max_drawdown_limit || 0);

  const currentDrawdownAmount = accountSize > currentBalance ? accountSize - currentBalance : 0;
  const currentDrawdownPct = accountSize > 0 && currentDrawdownAmount > 0 
    ? ((currentDrawdownAmount / accountSize) * 100) 
    : 0;

  const maxDrawdownPctLimit = accountSize > 0 && maxDrawdownLimit > 0 
    ? ((maxDrawdownLimit / accountSize) * 100).toFixed(0) 
    : "10";

  const drawdownProgressPct = maxDrawdownLimit > 0 
    ? Math.min(100, Math.round((currentDrawdownAmount / maxDrawdownLimit) * 100)) 
    : 0;

  // Real today trades & PnL
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTrades = trades.filter((t: any) => new Date(t.entry_time) >= todayStart);
  const todayPnL = todayTrades.reduce((acc: number, t: any) => acc + Number(t.net_pnl || 0), 0);
  const todayPnLPct = accountSize > 0 ? (todayPnL / accountSize) * 100 : 0;
  const dailyLossSpent = Math.abs(todayPnL < 0 ? todayPnL : 0);
  const dailyLossProgressPct = dailyLossLimit > 0 ? Math.min(100, Math.round((dailyLossSpent / dailyLossLimit) * 100)) : 0;

  // Real trade sparkline if trades exist, else subtle smooth ambient curve
  const sparklineData = (() => {
    if (!trades || trades.length < 2) {
      return {
        line: "M 0 28 Q 25 24, 45 19 T 75 14 T 100 18 T 120 10",
        area: "M 0 28 Q 25 24, 45 19 T 75 14 T 100 18 T 120 10 L 120 38 L 0 38 Z"
      };
    }
    const sorted = [...trades].sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime());
    let cum = 0;
    const cums = sorted.slice(-12).map((t) => {
      cum += Number(t.net_pnl || 0);
      return cum;
    });
    const min = Math.min(...cums);
    const max = Math.max(...cums);
    const range = max === min ? 1 : max - min;
    const pts = cums.map((val, idx) => {
      const x = (idx / (cums.length - 1)) * 120;
      const y = 32 - ((val - min) / range) * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return {
      line: `M ${pts.join(" L ")}`,
      area: `M ${pts.join(" L ")} L 120,38 L 0,38 Z`
    };
  })();

  const winRateStat = stats.find(s => s.label.includes("Win Rate"));
  const profitStat = stats.find(s => s.label.includes("Total Profit"));
  const streakStat = stats.find(s => s.label.includes("Streak"));

  return (
    <div className="space-y-6 text-[#181818]">
      
      {/* ── 1. Top Greeting Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E6E4DE]">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-[#181818]">
            Good {greeting.toLowerCase()}, {name}
          </h1>
          <p className="text-xs text-[#87877F] mt-0.5">
            Your trading environment at a glance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-[#181818] block">{formattedDate}</span>
            <span className="text-[11px] text-[#87877F]">Discipline Operating System</span>
          </div>
          <span className="h-6 w-px bg-[#E6E4DE] hidden sm:block" />
          <DashboardBadge variant="neutral" className="gap-1.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18B880] animate-pulse" />
            Active Session
          </DashboardBadge>
        </div>
      </div>

      {/* Post-Stripe Return Confirmation */}
      {showSubscriptionSuccess && (
        <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-none text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-[#181818]">Subscription Confirmed</p>
              <p className="text-[#555550] text-[11px] mt-0.5">
                Your subscription is confirmed. Your platform access will update within a few moments — refresh if features appear locked.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowSubscriptionSuccess(false);
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("subscription");
                window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
              }
            }}
            className="p-1 text-[#87877F] hover:text-[#181818] transition-colors ml-4 shrink-0"
            title="Dismiss confirmation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 2. Primary Workspace (Level 1) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Anchor: Account & Performance (7 cols) */}
        <div className="lg:col-span-7">
          <DashboardPanel elevated="md" className="h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EEECE7]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#F9771D] rounded-full" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
                    Account &amp; Performance
                  </span>
                </div>
                {account ? (
                  <Link
                    href="/dashboard/accounts"
                    className="text-[11px] font-medium text-[#87877F] hover:text-[#F9771D] transition-colors flex items-center gap-1"
                  >
                    View all accounts <ArrowUpRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/accounts"
                    className="text-[11px] font-medium text-[#F9771D] hover:underline"
                  >
                    + Add Account
                  </Link>
                )}
              </div>

              {account ? (
                <div className="space-y-5 pt-3">
                  {/* Account Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#181818]">
                        {account.account_name || "Funded Account"}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#87877F]">
                        <span>{account.prop_firms?.name || "Prop Challenge"} · {currencySymbol}{(accountSize / 1000).toFixed(0)}K</span>
                        <span className="inline-flex items-center gap-1 text-[#18B880] font-medium text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#18B880]" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Stats Row: Dominant Balance + Mini Sparkline + Right Table */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Dominant Figure & Delta */}
                    <div className="md:col-span-4">
                      <div className="text-[10px] uppercase font-semibold text-[#87877F] tracking-wider mb-1">
                        Current Equity
                      </div>
                      <div className="text-3xl sm:text-4xl font-light font-display tracking-tight text-[#181818] dd-tabular">
                        {currencySymbol}{currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={cn(
                          "text-xs font-semibold dd-tabular flex items-center gap-0.5",
                          todayPnL >= 0 ? "text-[#18B880]" : "text-[#CE6969]"
                        )}>
                          {todayPnL >= 0 ? "+ " : "- "}{Math.abs(todayPnLPct).toFixed(2)}% Today
                        </span>
                      </div>
                    </div>

                    {/* Center Subtle Embedded Sparkline */}
                    <div className="md:col-span-3 hidden md:flex items-center justify-center h-14">
                      <svg className="w-full h-12 overflow-visible" viewBox="0 0 120 40">
                        <defs>
                          <linearGradient id="accountSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F9771D" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#F9771D" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={sparklineData.area}
                          fill="url(#accountSparklineGrad)"
                        />
                        <path
                          d={sparklineData.line}
                          fill="none"
                          stroke="#F9771D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Right Financial Data Table */}
                    <div className="md:col-span-5 bg-[#F5F4F1] rounded-[6px] p-3 border border-[#EEECE7] text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[#87877F] text-[11px]">Equity</span>
                        <span className="font-semibold text-[#181818] dd-tabular">
                          {currencySymbol}{currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#87877F] text-[11px]">Balance</span>
                        <span className="font-semibold text-[#181818] dd-tabular">
                          {currencySymbol}{accountSize.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#87877F] text-[11px]">P&amp;L (Today)</span>
                        <span className={cn("font-semibold dd-tabular", todayPnL >= 0 ? "text-[#18B880]" : "text-[#CE6969]")}>
                          {todayPnL >= 0 ? "+" : ""}{currencySymbol}{todayPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#87877F] text-[11px]">Drawdown</span>
                        <span className="font-semibold text-[#474744] dd-tabular">
                          {currentDrawdownPct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-[#E6E4DE]">
                        <span className="text-[#87877F] text-[11px]">Risk Status</span>
                        <span className="font-semibold text-[#18B880] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#18B880]" />
                          Within limits
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Performance Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#EEECE7]">
                    <DashboardMetric
                      label="Win Rate (MTD)"
                      value={winRateStat?.value || "--"}
                      variant="default"
                      size="md"
                      note={winRateStat?.note || "No account data"}
                    />
                    <DashboardMetric
                      label="Max Drawdown"
                      value={maxDrawdownLimit > 0 ? `${currentDrawdownPct.toFixed(2)}%` : "--"}
                      variant="default"
                      size="md"
                      note={account ? `Limit: ${maxDrawdownPctLimit}%` : "No account data"}
                    />
                    <DashboardMetric
                      label="Total Profit"
                      value={profitStat?.value || "--"}
                      variant="default"
                      size="md"
                      note={profitStat?.note || "No account data"}
                    />
                    <DashboardMetric
                      label="Current Streak"
                      value={streakStat?.value || "--"}
                      variant="default"
                      size="md"
                      note={streakStat?.note || "No account data"}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-2">
                  <DashboardEmptyState
                    icon={<Wallet className="w-5 h-5" />}
                    title="No Funded Account Configured"
                    description="Connect your prop firm challenge, funded account, or personal broker to enable automated drawdown protection and real-time equity tracking."
                    action={{ label: "Add Account", href: "/dashboard/accounts" }}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EEECE7]">
                    {stats.map((stat, i) => (
                      <DashboardMetric
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        variant="muted"
                        size="md"
                        note={stat.note}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DashboardPanel>
        </div>

        {/* Right Anchor: Next Recommended Action (5 cols) */}
        <div className="lg:col-span-5">
          <DashboardPanel elevated="md" accent className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EEECE7]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-3.5 bg-[#F9771D] rounded-full" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
                    Next Recommended Action
                  </span>
                </div>
                <DashboardBadge variant="stage">
                  {nextAction.stage}
                </DashboardBadge>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-[#181818] leading-tight">
                  {nextAction.title}
                </h3>
                <p className="text-xs text-[#474744] leading-relaxed">
                  {nextAction.desc}
                </p>
              </div>

              <div>
                <Link
                  href={nextAction.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-semibold rounded-[6px] transition-colors shadow-xs"
                >
                  {nextAction.actionText}
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F9771D]" />
                </Link>
              </div>
            </div>

            {/* Operating System 3-Stage Mini Checklist */}
            <div className="pt-4 mt-4 border-t border-[#EEECE7] space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F] block">
                Today&apos;s OS Execution Loop
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/dashboard/prepare"
                  className={cn(
                    "p-2.5 rounded-[6px] border text-left transition-colors",
                    todayPrep ? "bg-[#F0FDF8] border-[rgba(24,184,128,0.2)]" : "bg-[#F5F4F1] border-[#E6E4DE] hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full", todayPrep ? "bg-[#18B880]" : "bg-[#D97706]")} />
                    <span className="text-[10px] font-semibold text-[#181818]">1. Prepare</span>
                  </div>
                  <span className="text-[10px] text-[#87877F] block truncate">
                    {todayPrep ? "Prepared" : "Pending"}
                  </span>
                </Link>

                <Link
                  href="/dashboard/plan"
                  className={cn(
                    "p-2.5 rounded-[6px] border text-left transition-colors",
                    activePlans.length > 0 ? "bg-[#FFF4EC] border-[rgba(249,119,29,0.22)]" : "bg-[#F5F4F1] border-[#E6E4DE] hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full", activePlans.length > 0 ? "bg-[#F9771D]" : "bg-[#BBBAB4]")} />
                    <span className="text-[10px] font-semibold text-[#181818]">2. Plan</span>
                  </div>
                  <span className="text-[10px] text-[#87877F] block truncate">
                    {activePlans.length > 0 ? `${activePlans.length} Active` : "None"}
                  </span>
                </Link>

                <Link
                  href="/dashboard/review"
                  className={cn(
                    "p-2.5 rounded-[6px] border text-left transition-colors",
                    pendingReviews.length > 0 ? "bg-[#FFFBEB] border-[rgba(217,119,6,0.2)]" : "bg-[#F0FDF8] border-[rgba(24,184,128,0.2)]"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full", pendingReviews.length > 0 ? "bg-[#D97706]" : "bg-[#18B880]")} />
                    <span className="text-[10px] font-semibold text-[#181818]">3. Review</span>
                  </div>
                  <span className="text-[10px] text-[#87877F] block truncate">
                    {pendingReviews.length > 0 ? `${pendingReviews.length} Due` : "Clear"}
                  </span>
                </Link>
              </div>
            </div>
          </DashboardPanel>
        </div>

      </div>

      {/* ── 3. Supporting Intelligence (Level 2) ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Watchlist Panel */}
        <div className="flex flex-col">
          <WatchlistSummary initialSymbols={watchlistItems} userCurrency={userCurrency} />
        </div>

        {/* Today's Briefing Panel */}
        <DashboardPanel elevated="sm" className="flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-3 bg-[#F9771D] rounded-full" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
                  Daily Intelligence Brief
                </span>
              </div>
              <Link
                href="/dashboard/the-wire"
                className="text-[11px] font-medium text-[#87877F] hover:text-[#F9771D] transition-colors"
              >
                The Wire →
              </Link>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-medium text-[#87877F] block">
                {latestBrief?.report_date || formattedDate}
              </span>
              <h4 className="text-sm font-bold text-[#181818] leading-snug line-clamp-2">
                {latestBrief?.title || latestBrief?.headline || "Market Operating Brief"}
              </h4>
              <p className="text-xs text-[#474744] leading-relaxed line-clamp-3">
                {latestBrief?.summary || latestBrief?.narrative || latestBrief?.key_takeaway || "Review macro drivers, session order flow, and volatility risks before taking positions."}
              </p>

              {/* Graphic Tag */}
              <div className="pt-2 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[6px] bg-[#EDECEA] border border-[#E6E4DE] flex items-center justify-center text-[9px] font-bold text-[#87877F]">
                  MACRO
                </div>
                <span className="text-[10px] font-semibold text-[#87877F] px-2 py-0.5 rounded-[4px] bg-[#F3F2EE] border border-[#E6E4DE]">
                  Macro &amp; FX
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#EEECE7] flex justify-end">
            <Link
              href="/dashboard/the-wire"
              className="text-[11px] font-semibold text-[#F9771D] hover:text-[#E06818] transition-colors flex items-center gap-1"
            >
              Read Briefing →
            </Link>
          </div>
        </DashboardPanel>

        {/* Stacked Col 3: Risk Status + Weekly Focus */}
        <div className="flex flex-col gap-4">
          
          {/* Risk Status Panel */}
          <DashboardPanel elevated="sm" className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#18B880]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
                  Risk Status
                </span>
              </div>
              <Link
                href="/dashboard/accounts"
                className="text-[11px] font-medium text-[#87877F] hover:text-[#F9771D] transition-colors"
              >
                View details →
              </Link>
            </div>

            <div>
              <span className="text-xs font-bold text-[#181818] block">Within limits</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#87877F]">Daily Loss</span>
                  <span className="font-semibold text-[#181818] dd-tabular">
                    {currencySymbol}{dailyLossSpent.toFixed(0)} / {currencySymbol}{dailyLossLimit.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="w-full bg-[#E6E4DE] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      dailyLossProgressPct > 75 ? "bg-[#CE6969]" : "bg-[#18B880]"
                    )}
                    style={{ width: `${Math.max(2, dailyLossProgressPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#87877F]">Max Drawdown</span>
                  <span className="font-semibold text-[#181818] dd-tabular">
                    {currencySymbol}{currentDrawdownAmount.toFixed(0)} / {currencySymbol}{maxDrawdownLimit.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="w-full bg-[#E6E4DE] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      drawdownProgressPct > 75 ? "bg-[#CE6969]" : drawdownProgressPct > 40 ? "bg-[#D97706]" : "bg-[#18B880]"
                    )}
                    style={{ width: `${Math.max(2, drawdownProgressPct)}%` }}
                  />
                </div>
              </div>
            </div>
          </DashboardPanel>

          {/* Weekly Focus Panel */}
          <DashboardPanel elevated="sm" accent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
                Weekly Improvement Focus
              </span>
              <Link
                href="/dashboard/improve"
                className="text-[11px] font-medium text-[#87877F] hover:text-[#F9771D] transition-colors"
              >
                Improve →
              </Link>
            </div>

            {activeCommitment ? (
              <div className="space-y-1">
                <DashboardBadge variant="warning">
                  {activeCommitment.category || "Rule Adherence"}
                </DashboardBadge>
                <p className="text-xs font-semibold text-[#181818] leading-snug">
                  {activeCommitment.title}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-[#474744] font-medium">No active commitment selected</p>
                <p className="text-[10px] text-[#87877F]">Formulate one in your weekly operating review.</p>
                <Link
                  href="/dashboard/improve"
                  className="inline-block text-[10px] font-semibold text-[#F9771D] hover:underline uppercase tracking-wider pt-0.5"
                >
                  Set Focus Rule →
                </Link>
              </div>
            )}

            <div className="pt-2 border-t border-[#EEECE7] grid grid-cols-4 gap-1.5">
              <Link
                href="/dashboard/prepare"
                className="p-1.5 text-center rounded-[6px] border border-[#E6E4DE] hover:bg-[#F5F4F1] transition-colors text-[10px] font-medium text-[#474744]"
              >
                Prep
              </Link>
              <Link
                href="/dashboard/plan"
                className="p-1.5 text-center rounded-[6px] border border-[#E6E4DE] hover:bg-[#F5F4F1] transition-colors text-[10px] font-medium text-[#474744]"
              >
                Plan
              </Link>
              <Link
                href="/dashboard/journal"
                className="p-1.5 text-center rounded-[6px] border border-[#E6E4DE] hover:bg-[#F5F4F1] transition-colors text-[10px] font-medium text-[#474744]"
              >
                Journal
              </Link>
              <Link
                href="/dashboard/review"
                className="p-1.5 text-center rounded-[6px] border border-[#E6E4DE] hover:bg-[#F5F4F1] transition-colors text-[10px] font-medium text-[#474744]"
              >
                Review
              </Link>
            </div>
          </DashboardPanel>

        </div>

      </div>

      {/* ── 4. Market Intelligence Workspace (Level 3) ────────────────────── */}
      <div className="pt-2 space-y-4">
        <DashboardPanel elevated="md" className="p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-[#EEECE7]">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1 h-3.5 bg-[#F9771D] rounded-full" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#F9771D]">
                  Market Intelligence Workspace
                </span>
              </div>
              <h2 className="text-lg font-bold font-display text-[#181818]">
                Directional Bias &amp; Technical Scanner
              </h2>
            </div>
            <span className="text-xs text-[#87877F]">
              Composite scoring: RSI 30% · EMA 30% · Order Flow 25% · Macro 15%
            </span>
          </div>
          
          <div className="space-y-6">
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
        </DashboardPanel>
      </div>

      {/* ── 5. Session Timeline ───────────────────────────────────────────── */}
      <SessionTimeline />

    </div>
  );
}

