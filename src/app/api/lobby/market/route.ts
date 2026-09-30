import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase, createServiceRoleClient } from "@/lib/supabase/server";
import { resolveUserEntitlement } from "@/lib/entitlements";
import { isSignalEligibleForProduction } from "@/lib/data-freshness-policy";
import { getLobbyArticles } from "@/lib/lobby";
import { SCREENER_INSTRUMENTS, PUBLIC_SCREENER_INSTRUMENTS, ScreenerRow } from "@/lib/screener";

export const dynamic = "force-dynamic";

// Key pulse slugs to prioritize in the market pulse strip
const PULSE_SLUGS = [
  "EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "WTIUSD", 
  "SPX", "NDX", "UKX", "BTCUSDT", "ETHUSDT"
];

interface SessionInfo {
  name: string;
  isOpen: boolean;
  timeUtc: string;
  nextSession: string;
  peakPairs: string[];
  biasSummary: {
    bullish: number;
    bearish: number;
    neutral: number;
    total: number;
  };
}

function getSessionInfo(screenerRows: ScreenerRow[]): SessionInfo {
  const now = new Date();
  const day = now.getUTCDay();
  const h = now.getUTCHours();
  const m = now.getUTCMinutes();
  const timeUtc = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`;

  const isWeekend = day === 6 || (day === 0 && h < 22) || (day === 5 && h >= 22);

  let name = "ASIAN SESSION";
  let isOpen = true;
  let nextSession = "London Session at 08:00 UTC";
  let peakPairs = ["USD/JPY", "AUD/USD", "NZD/USD", "BTC/USD"];

  if (isWeekend) {
    name = "MARKETS CLOSED";
    isOpen = false;
    nextSession = "Sunday Reopen at 22:00 UTC";
    peakPairs = ["Crypto 24/7 (BTC, ETH)"];
  } else if (h >= 8 && h < 13) {
    name = "LONDON SESSION";
    isOpen = true;
    nextSession = "New York Overlap at 13:00 UTC";
    peakPairs = ["GBP/USD", "EUR/USD", "UK100", "GER40"];
  } else if (h >= 13 && h < 17) {
    name = "LONDON / NY OVERLAP";
    isOpen = true;
    nextSession = "New York Afternoon at 17:00 UTC";
    peakPairs = ["EUR/USD", "GBP/USD", "US500", "NAS100", "XAU/USD"];
  } else if (h >= 17 && h < 22) {
    name = "NEW YORK SESSION";
    isOpen = true;
    nextSession = "Asian Session at 00:00 UTC";
    peakPairs = ["US500", "NAS100", "US30", "USD/CAD"];
  }

  let bullish = 0;
  let bearish = 0;
  let neutral = 0;

  for (const row of screenerRows) {
    if (row.bias === "BULLISH") bullish++;
    else if (row.bias === "BEARISH") bearish++;
    else neutral++;
  }

  return {
    name,
    isOpen,
    timeUtc,
    nextSession,
    peakPairs,
    biasSummary: {
      bullish,
      bearish,
      neutral,
      total: screenerRows.length,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication & Entitlements
    let userEntitlements = {
      tier: "free",
      status: "inactive",
      level: 0,
      isActive: false,
      isAdmin: false,
      hasCoreAccess: false,
      canAccessSignals: false,
      canAccessScanner: false,
      canAccessIntelligence: false,
      canAccessWatchlists: false,
      canAccessSavedScreens: false,
    };
    let userId: string | null = null;

    try {
      const authClient = await createServerSupabase();
      const { data: { user } } = await authClient.auth.getUser();
      if (user) {
        userId = user.id;
        userEntitlements = (await resolveUserEntitlement(authClient, user.id)) as any;
      }
    } catch {
      // Unauthenticated fallback
    }

    const serviceClient = createServiceRoleClient();

    // 2. Fetch Screener Data from market_data_cache
    let screenerRows: ScreenerRow[] = [];
    try {
      const { data: cacheRow } = await serviceClient
        .from("market_data_cache")
        .select("data, expires_at")
        .eq("cache_key", userEntitlements.canAccessScanner ? "screener:full:all" : "screener:public:all")
        .maybeSingle();

      if (cacheRow?.data && Array.isArray(cacheRow.data)) {
        screenerRows = cacheRow.data;
      } else {
        // Fallback: try the public cache key if full was missed
        const { data: fallbackRow } = await serviceClient
          .from("market_data_cache")
          .select("data, expires_at")
          .eq("cache_key", "screener:public:all")
          .maybeSingle();

        if (fallbackRow?.data && Array.isArray(fallbackRow.data)) {
          screenerRows = fallbackRow.data;
        }
      }
    } catch (e) {
      console.error("[lobby-market-api] Cache read error:", e);
    }

    // 3. Build Market Pulse
    let pulse: ScreenerRow[] = [];
    if (screenerRows.length > 0) {
      // Find priority instruments first
      const pulseMap = new Map(screenerRows.map(r => [r.slug, r]));
      for (const slug of PULSE_SLUGS) {
        const found = pulseMap.get(slug);
        if (found) {
          pulse.push(found);
        }
      }
      // If we need more, append other items
      for (const row of screenerRows) {
        if (!pulse.some(p => p.slug === row.slug) && pulse.length < 12) {
          pulse.push(row);
        }
      }
    }

    // 4. Fetch Active Signals
    let signals: any[] = [];
    try {
      const nowIso = new Date().toISOString();
      const { data: rawSignals } = await serviceClient
        .from("signals")
        .select("*")
        .neq("is_test", true)
        .eq("data_classification", "PRODUCTION_VERIFIED")
        .order("is_active", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

      if (rawSignals && rawSignals.length > 0) {
        const nowMs = Date.now();
        signals = rawSignals
          .filter(s => {
            // Keep active verified signals or recent signals within 7 days
            const ageMs = nowMs - new Date(s.created_at).getTime();
            return ageMs <= 7 * 24 * 60 * 60 * 1000;
          })
          .slice(0, 8)
          .map(s => {
            const isEligibleLive = isSignalEligibleForProduction(s, nowMs);
            const isFullAccess = userEntitlements.canAccessSignals;

            return {
              id: s.id,
              instrument: s.instrument,
              timeframe: s.timeframe,
              bias: s.bias,
              dcs_score: s.dcs_score || (s.confluence_score ? Math.round((s.confluence_score / 10) * 100) : null),
              confluence_score: s.confluence_score,
              entry_price: isFullAccess ? s.entry_price : null,
              stop_loss: isFullAccess ? s.stop_loss : null,
              take_profit_1: isFullAccess ? s.take_profit_1 : null,
              take_profit_2: isFullAccess ? s.take_profit_2 : null,
              take_profit_3: isFullAccess ? s.take_profit_3 : null,
              rr_ratio: isFullAccess ? s.rr_ratio : null,
              atr: isFullAccess ? s.atr : null,
              catalyst_event: s.catalyst_event,
              confluence_factors: s.confluence_factors,
              ai_consensus: isFullAccess ? s.ai_consensus : null,
              is_active: s.is_active && isEligibleLive,
              created_at: s.created_at,
              expires_at: s.expires_at,
              locked: !isFullAccess,
            };
          });
      }
    } catch (e) {
      console.error("[lobby-market-api] Signals fetch error:", e);
    }

    // 5. Fetch Editorial Intelligence Brief
    let briefArticles: any[] = [];
    try {
      briefArticles = await getLobbyArticles({ limit: 3 });
    } catch (e) {
      console.error("[lobby-market-api] Articles brief error:", e);
    }

    // 6. User Watchlist (if entitled)
    let userWatchlist: any[] = [];
    if (userId && userEntitlements.canAccessWatchlists) {
      try {
        const { data: wData } = await serviceClient
          .from("user_watchlists")
          .select("id, symbol, alerts_enabled, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (wData && wData.length > 0) {
          // Attach latest prices if available in screenerRows
          const rowMap = new Map(screenerRows.map(r => [r.displayPair, r]));
          userWatchlist = wData.map(item => {
            const screenerMatch = rowMap.get(item.symbol) || screenerRows.find(r => r.slug === item.symbol);
            return {
              ...item,
              price: screenerMatch?.price ?? null,
              changePct: screenerMatch?.changePct ?? null,
              bias: screenerMatch?.bias ?? "NEUTRAL",
            };
          });
        }
      } catch (e) {
        console.error("[lobby-market-api] Watchlist fetch error:", e);
      }
    }

    // 7. Session Activity
    const session = getSessionInfo(screenerRows);

    return NextResponse.json({
      user: {
        authenticated: !!userId,
        tier: userEntitlements.tier,
        entitlements: {
          canAccessSignals: userEntitlements.canAccessSignals,
          canAccessScanner: userEntitlements.canAccessScanner,
          canAccessWatchlists: userEntitlements.canAccessWatchlists,
          hasCoreAccess: userEntitlements.hasCoreAccess,
          canAccessSavedScreens: userEntitlements.canAccessSavedScreens,
        },
      },
      pulse,
      signals,
      screener: userEntitlements.canAccessScanner ? screenerRows : screenerRows.slice(0, 10),
      session,
      brief: briefArticles,
      watchlist: userWatchlist,
      cached_at: new Date().toISOString(),
    }, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      }
    });

  } catch (error: any) {
    console.error("[lobby-market-api] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
