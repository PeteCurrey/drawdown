/**
 * src/lib/data-health.ts
 *
 * Drawdown Trading — Canonical System Health & Data Integrity Engine
 *
 * Single server-side calculation engine providing unified operational telemetry across:
 *  1. Market Data (Twelve Data / Yahoo / Screener Cache / Real-time Quotes)
 *  2. The Lobby (Lead story age, upcoming events, watchlist, draft queue)
 *  3. AI Trading Signals (Counts by timeframe, oldest active signal, expiry status)
 *  4. Scheduled Background Jobs (All 16 registered jobs, execution state, missed-run alerts)
 *  5. Content Quality & Quarantine (Unclassified records, test articles, expired published items)
 *
 * Powers /api/admin/data-health and the /admin/system/health control tower.
 */

import { createServiceRoleClient } from "./supabase/server";
import { DATASET_FRESHNESS_CONFIG, TIME_MS, evaluateComingUpEventEligibility } from "./data-freshness-policy";
import { CRON_JOB_REGISTRY, evaluateCronJobHealth, EvaluatedCronHealth } from "./cron-registry";

export type SystemHealthOverallStatus = "HEALTHY" | "DEGRADED" | "CRITICAL";

export interface MarketHealthSummary {
  status: "HEALTHY" | "DEGRADED" | "OFFLINE";
  providerStatus: {
    twelveData: { configured: boolean; keyCount: number };
    finnhub: { configured: boolean };
    yahoo: { available: boolean };
  };
  cachedSymbolsCount: number;
  oldestQuoteAgeSeconds: number | null;
  newestQuoteAgeSeconds: number | null;
  screenerCacheAgeSeconds: number | null;
}

export interface LobbyHealthSummary {
  leadStory: {
    title: string | null;
    slug: string | null;
    publishedAt: string | null;
    ageHours: number | null;
    status: "HEALTHY" | "STALE" | "EMPTY";
  };
  upcomingEventsCount: number;
  watchlistItemsCount: number;
  publishedArticlesCount: number;
  draftArticlesCount: number;
  unclassifiedArticlesCount: number;
  testArticlesQuarantinedCount: number;
}

export interface SignalsHealthSummary {
  status: "HEALTHY" | "STALE" | "EMPTY";
  totalActiveCount: number;
  byTimeframe: Record<string, number>;
  newestSignalAgeMinutes: number | null;
  oldestActiveSignalAgeMinutes: number | null;
  quarantinedTestCount: number;
}

export interface ContentQualitySummary {
  unclassifiedLobbyCount: number;
  quarantinedLobbyCount: number;
  quarantinedSignalsCount: number;
  expiredActiveSignalsCount: number;
  zeroSourceArticlesCount: number;
}

export interface FullSystemHealthPayload {
  timestamp: string;
  overallStatus: SystemHealthOverallStatus;
  marketData: MarketHealthSummary;
  lobby: LobbyHealthSummary;
  signals: SignalsHealthSummary;
  crons: {
    totalJobs: number;
    healthyCount: number;
    missedCount: number;
    failedCount: number;
    jobs: EvaluatedCronHealth[];
  };
  contentQuality: ContentQualitySummary;
}

/**
 * Calculates comprehensive system health across all production data surfaces.
 */
export async function calculateSystemHealth(): Promise<FullSystemHealthPayload> {
  const supabase = createServiceRoleClient();
  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();

  // 1. Market Data Health Calculation
  const tdKeys = [
    process.env.TWELVE_DATA_KEY,
    process.env.TWELVE_DATA_KEY_ALT,
    process.env.NEXT_PUBLIC_TWELVE_DATA_KEY,
  ].filter(Boolean);

  const fhKeys = [
    process.env.FINNHUB_API_KEY,
    process.env.FINNHUB_KEY,
  ].filter(Boolean);

  let cachedSymbolsCount = 0;
  let oldestQuoteAgeSeconds: number | null = null;
  let newestQuoteAgeSeconds: number | null = null;
  let screenerCacheAgeSeconds: number | null = null;

  try {
    const { data: priceCacheRows } = await supabase
      .from("price_cache")
      .select("symbol, updated_at")
      .limit(100);

    if (priceCacheRows && priceCacheRows.length > 0) {
      cachedSymbolsCount = priceCacheRows.length;
      const ages = priceCacheRows
        .map((r: any) => (r.updated_at ? Math.max(0, Math.floor((nowMs - new Date(r.updated_at).getTime()) / 1000)) : null))
        .filter((n: any): n is number => n !== null);

      if (ages.length > 0) {
        newestQuoteAgeSeconds = Math.min(...ages);
        oldestQuoteAgeSeconds = Math.max(...ages);
      }
    }

    const { data: screenerRow } = await supabase
      .from("market_data_cache")
      .select("updated_at")
      .eq("cache_key", "screener:public:all")
      .maybeSingle();

    if (screenerRow?.updated_at) {
      screenerCacheAgeSeconds = Math.max(0, Math.floor((nowMs - new Date(screenerRow.updated_at).getTime()) / 1000));
    }
  } catch (err) {
    console.warn("[data-health] Market cache query failed:", err);
  }

  const marketStatus: "HEALTHY" | "DEGRADED" | "OFFLINE" =
    tdKeys.length === 0
      ? "OFFLINE"
      : (screenerCacheAgeSeconds !== null && screenerCacheAgeSeconds > 900) || (newestQuoteAgeSeconds !== null && newestQuoteAgeSeconds > 1800)
      ? "DEGRADED"
      : "HEALTHY";

  // 2. Lobby Broadsheet Health Calculation
  let leadStorySummary: LobbyHealthSummary["leadStory"] = {
    title: null,
    slug: null,
    publishedAt: null,
    ageHours: null,
    status: "EMPTY",
  };
  let upcomingEventsCount = 0;
  let watchlistItemsCount = 0;
  let publishedArticlesCount = 0;
  let draftArticlesCount = 0;
  let unclassifiedArticlesCount = 0;
  let testArticlesQuarantinedCount = 0;

  try {
    // Lead story query (strict freshness)
    const { data: leadArticle } = await supabase
      .from("lobby_articles")
      .select("title, slug, published_at, is_test")
      .eq("status", "PUBLISHED")
      .neq("is_test", true)
      .eq("section", "lead")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (leadArticle?.published_at) {
      const ageHours = Math.floor((nowMs - new Date(leadArticle.published_at).getTime()) / TIME_MS.HOUR);
      leadStorySummary = {
        title: leadArticle.title,
        slug: leadArticle.slug,
        publishedAt: leadArticle.published_at,
        ageHours,
        status: ageHours <= 72 ? "HEALTHY" : "STALE",
      };
    }

    // Counts by status
    const { count: pubCount } = await supabase.from("lobby_articles").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED").neq("is_test", true);
    publishedArticlesCount = pubCount || 0;

    const { count: dftCount } = await supabase.from("lobby_articles").select("*", { count: "exact", head: true }).eq("status", "DRAFT");
    draftArticlesCount = dftCount || 0;

    const { count: uncCount } = await supabase.from("lobby_articles").select("*", { count: "exact", head: true }).eq("data_classification", "UNCLASSIFIED");
    unclassifiedArticlesCount = uncCount || 0;

    const { count: tstCount } = await supabase.from("lobby_articles").select("*", { count: "exact", head: true }).eq("is_test", true);
    testArticlesQuarantinedCount = tstCount || 0;

    // Coming Up valid future count
    const { data: comingUpArticles } = await supabase
      .from("lobby_articles")
      .select("primary_source_date, editorial_metadata")
      .eq("section", "coming_up")
      .eq("status", "PUBLISHED")
      .neq("is_test", true);

    const nowUtc = new Date();
    if (comingUpArticles) {
      upcomingEventsCount = comingUpArticles.filter((a: any) => {
        const d = a.primary_source_date || a.editorial_metadata?.event_date;
        return evaluateComingUpEventEligibility(d, nowUtc).isUpcoming;
      }).length;
    }

    // Watchlist count
    const watchlistCutoff = new Date(nowMs - DATASET_FRESHNESS_CONFIG.lobby_watchlist.maxEligibilityAgeMs).toISOString();
    const { count: wlCount } = await supabase
      .from("lobby_articles")
      .select("*", { count: "exact", head: true })
      .eq("section", "watchlist")
      .eq("status", "PUBLISHED")
      .neq("is_test", true)
      .gte("published_at", watchlistCutoff);

    watchlistItemsCount = wlCount || 0;
  } catch (err) {
    console.warn("[data-health] Lobby query failed:", err);
  }

  // 3. Signals Health Calculation
  let totalActiveCount = 0;
  const byTimeframe: Record<string, number> = { "15M": 0, "1H": 0, "4H": 0, "1D": 0 };
  let newestSignalAgeMinutes: number | null = null;
  let oldestActiveSignalAgeMinutes: number | null = null;
  let quarantinedSignalsCount = 0;
  let expiredActiveSignalsCount = 0;

  try {
    const { data: activeSignals } = await supabase
      .from("signals")
      .select("timeframe, created_at, expires_at, is_test")
      .eq("is_active", true);

    if (activeSignals && activeSignals.length > 0) {
      const nonTestSignals = activeSignals.filter((s: any) => !s.is_test);
      totalActiveCount = nonTestSignals.length;

      const agesMinutes: number[] = [];
      for (const s of nonTestSignals) {
        const tf = (s.timeframe || "1D").toUpperCase();
        byTimeframe[tf] = (byTimeframe[tf] || 0) + 1;

        if (s.created_at) {
          const ageMin = Math.floor((nowMs - new Date(s.created_at).getTime()) / (60 * 1000));
          agesMinutes.push(ageMin);
        }

        if (s.expires_at && new Date(s.expires_at).getTime() <= nowMs) {
          expiredActiveSignalsCount++;
        }
      }

      if (agesMinutes.length > 0) {
        newestSignalAgeMinutes = Math.min(...agesMinutes);
        oldestActiveSignalAgeMinutes = Math.max(...agesMinutes);
      }
    }

    const { count: tstSigCount } = await supabase.from("signals").select("*", { count: "exact", head: true }).eq("is_test", true);
    quarantinedSignalsCount = tstSigCount || 0;
  } catch (err) {
    console.warn("[data-health] Signals query failed:", err);
  }

  const signalsStatus: "HEALTHY" | "STALE" | "EMPTY" =
    totalActiveCount === 0
      ? "EMPTY"
      : expiredActiveSignalsCount > 0 || (oldestActiveSignalAgeMinutes !== null && oldestActiveSignalAgeMinutes > 2880)
      ? "STALE"
      : "HEALTHY";

  // 4. Background Cron Jobs Observability Calculation
  const evaluatedJobs: EvaluatedCronHealth[] = [];
  try {
    const { data: recentRuns } = await supabase
      .from("cron_job_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(200);

    const latestRunByJob = new Map<string, any>();
    const lastSuccessByJob = new Map<string, any>();

    if (recentRuns) {
      for (const run of recentRuns) {
        if (!latestRunByJob.has(run.job_name)) {
          latestRunByJob.set(run.job_name, run);
        }
        if (run.status === "SUCCESS" && !lastSuccessByJob.has(run.job_name)) {
          lastSuccessByJob.set(run.job_name, run);
        }
      }
    }

    for (const [jobId, jobDef] of Object.entries(CRON_JOB_REGISTRY)) {
      const latestRun = latestRunByJob.get(jobId) || null;
      const lastSuccess = lastSuccessByJob.get(jobId) || null;
      evaluatedJobs.push(evaluateCronJobHealth(jobDef, latestRun, lastSuccess, nowMs));
    }
  } catch (err) {
    console.warn("[data-health] Cron runs query failed:", err);
    for (const [jobId, jobDef] of Object.entries(CRON_JOB_REGISTRY)) {
      evaluatedJobs.push(evaluateCronJobHealth(jobDef, null, null, nowMs));
    }
  }

  const healthyCrons = evaluatedJobs.filter((j) => j.state === "OK" || j.state === "RUNNING").length;
  const missedCrons = evaluatedJobs.filter((j) => j.state === "MISSED" || j.state === "STALE").length;
  const failedCrons = evaluatedJobs.filter((j) => j.state === "FAILED").length;

  // 5. Content Quality & Quarantine Counts
  let zeroSourceArticlesCount = 0;
  try {
    const { count: noSrcCount } = await supabase
      .from("lobby_articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "PUBLISHED")
      .neq("is_test", true)
      .is("primary_source_name", null);
    zeroSourceArticlesCount = noSrcCount || 0;
  } catch (err) {}

  // Overall Status
  let overallStatus: SystemHealthOverallStatus = "HEALTHY";
  if (failedCrons > 0 || marketStatus === "OFFLINE" || expiredActiveSignalsCount > 0) {
    overallStatus = "CRITICAL";
  } else if (missedCrons > 0 || marketStatus === "DEGRADED" || leadStorySummary.status === "STALE") {
    overallStatus = "DEGRADED";
  }

  return {
    timestamp: nowIso,
    overallStatus,
    marketData: {
      status: marketStatus,
      providerStatus: {
        twelveData: { configured: tdKeys.length > 0, keyCount: tdKeys.length },
        finnhub: { configured: fhKeys.length > 0 },
        yahoo: { available: true },
      },
      cachedSymbolsCount,
      oldestQuoteAgeSeconds,
      newestQuoteAgeSeconds,
      screenerCacheAgeSeconds,
    },
    lobby: {
      leadStory: leadStorySummary,
      upcomingEventsCount,
      watchlistItemsCount,
      publishedArticlesCount,
      draftArticlesCount,
      unclassifiedArticlesCount,
      testArticlesQuarantinedCount,
    },
    signals: {
      status: signalsStatus,
      totalActiveCount,
      byTimeframe,
      newestSignalAgeMinutes,
      oldestActiveSignalAgeMinutes,
      quarantinedTestCount: quarantinedSignalsCount,
    },
    crons: {
      totalJobs: Object.keys(CRON_JOB_REGISTRY).length,
      healthyCount: healthyCrons,
      missedCount: missedCrons,
      failedCount: failedCrons,
      jobs: evaluatedJobs,
    },
    contentQuality: {
      unclassifiedLobbyCount: unclassifiedArticlesCount,
      quarantinedLobbyCount: testArticlesQuarantinedCount,
      quarantinedSignalsCount,
      expiredActiveSignalsCount,
      zeroSourceArticlesCount,
    },
  };
}
