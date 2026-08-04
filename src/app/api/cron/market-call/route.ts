import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { awardBadge } from "@/lib/gamification";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Allow sufficient time for batch scoring and updates

const SYMBOLS = [
  "GBP/USD",
  "EUR/USD",
  "USD/JPY",
  "XAU/USD",
  "UK100",
  "BTC/USD"
];

function getISOWeekDetails(date: Date) {
  const tempDate = new Date(date.getTime());
  tempDate.setUTCHours(0, 0, 0, 0);
  tempDate.setUTCDate(tempDate.getUTCDate() + 3 - (tempDate.getUTCDay() + 6) % 7);
  const week1 = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 4));
  week1.setUTCDate(week1.getUTCDate() + 3 - (week1.getUTCDay() + 6) % 7);
  const milliDiff = tempDate.getTime() - week1.getTime();
  const weekNum = 1 + Math.round(milliDiff / 604800000);
  return {
    year: tempDate.getUTCFullYear(),
    week: weekNum,
    code: tempDate.getUTCFullYear() * 100 + weekNum
  };
}

function getNextWeekRange() {
  const now = new Date();
  
  // Find next Monday
  const nextMonday = new Date(now.getTime());
  nextMonday.setUTCDate(now.getUTCDate() + ((1 + 7 - now.getUTCDay()) % 7 || 7));
  nextMonday.setUTCHours(0, 0, 0, 0);

  const lockDate = new Date(nextMonday.getTime());
  lockDate.setUTCDate(nextMonday.getUTCDate() + 1); // Tuesday
  lockDate.setUTCHours(23, 59, 59, 999);

  const endDate = new Date(nextMonday.getTime());
  endDate.setUTCDate(nextMonday.getUTCDate() + 4); // Friday
  endDate.setUTCHours(22, 0, 0, 0);

  const weekDetails = getISOWeekDetails(nextMonday);

  return {
    weekNumber: weekDetails.code,
    startDate: nextMonday,
    lockDate,
    endDate
  };
}

export async function GET(req: Request) {
  // Auth guard — must be Vercel cron or carry CRON_SECRET
  const authHeader = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized =
    isVercelCron ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // -------------------------------------------------------------
    // ACTION: create-next
    // -------------------------------------------------------------
    if (action === "create-next") {
      const { weekNumber, startDate, lockDate, endDate } = getNextWeekRange();
      
      console.log(`[cron-market-call] Creating next week: ${weekNumber}`);

      // 1. Insert week row
      const { data: week, error: weekErr } = await supabase
        .from("market_call_weeks")
        .insert({
          week_number: weekNumber,
          start_date: startDate.toISOString(),
          lock_date: lockDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "active"
        })
        .select()
        .single();

      if (weekErr) {
        if (weekErr.code === "23505") { // Unique key violation - already exists
          return NextResponse.json({ success: false, message: `Week ${weekNumber} already exists.` }, { status: 400 });
        }
        throw weekErr;
      }

      // 2. Fetch prices to populate reference prices
      const { data: prices, error: priceErr } = await supabase
        .from("price_cache")
        .select("symbol, price")
        .in("symbol", SYMBOLS);

      if (priceErr) throw priceErr;

      const priceMap = new Map<string, number>();
      prices?.forEach(p => priceMap.set(p.symbol, Number(p.price)));

      // 3. Create questions for each symbol
      const questionInserts = SYMBOLS.map(symbol => {
        const referencePrice = priceMap.get(symbol) || 1.0; // fallback if missing
        return {
          week_id: week.id,
          symbol,
          reference_price: referencePrice,
          outcome: "pending"
        };
      });

      const { error: questErr } = await supabase
        .from("market_call_questions")
        .insert(questionInserts);

      if (questErr) throw questErr;

      return NextResponse.json({
        success: true,
        action: "create-next",
        week,
        questions: questionInserts
      });
    }

    // -------------------------------------------------------------
    // ACTION: lock
    // -------------------------------------------------------------
    if (action === "lock") {
      console.log("[cron-market-call] Running lock action...");

      // Lock any active round where current time is past lock_date
      const { data: activeWeeks, error: selectErr } = await supabase
        .from("market_call_weeks")
        .select("*")
        .eq("status", "active");

      if (selectErr) throw selectErr;

      const now = new Date();
      const lockedWeeks = [];

      for (const wk of activeWeeks || []) {
        const lockTime = new Date(wk.lock_date);
        // Lock automatically if deadline passed, or force lock if triggered manually
        if (now >= lockTime || searchParams.get("force") === "true") {
          const { error: updateErr } = await supabase
            .from("market_call_weeks")
            .update({ status: "locked" })
            .eq("id", wk.id);

          if (updateErr) throw updateErr;
          lockedWeeks.push(wk.week_number);
        }
      }

      return NextResponse.json({
        success: true,
        action: "lock",
        locked_weeks: lockedWeeks
      });
    }

    // -------------------------------------------------------------
    // ACTION: resolve
    // -------------------------------------------------------------
    if (action === "resolve") {
      console.log("[cron-market-call] Running resolve action...");

      // 1. Get locked week (the round currently ending)
      const { data: week, error: weekErr } = await supabase
        .from("market_call_weeks")
        .select("*")
        .eq("status", "locked")
        .maybeSingle();

      if (weekErr) throw weekErr;
      if (!week) {
        return NextResponse.json({ success: true, message: "No locked week found to resolve." });
      }

      // 2. Get questions for this week
      const { data: questions, error: questErr } = await supabase
        .from("market_call_questions")
        .select("*")
        .eq("week_id", week.id);

      if (questErr) throw questErr;
      if (!questions || questions.length === 0) {
        throw new Error("Locked week has no questions.");
      }

      // 3. Fetch latest prices from price_cache
      const { data: prices, error: priceErr } = await supabase
        .from("price_cache")
        .select("symbol, price")
        .in("symbol", SYMBOLS);

      if (priceErr) throw priceErr;

      const priceMap = new Map<string, number>();
      prices?.forEach(p => priceMap.set(p.symbol, Number(p.price)));

      // 4. Resolve each question's outcome
      const resolvedQuestions = [];
      for (const q of questions) {
        const actualClose = priceMap.get(q.symbol);
        if (actualClose === undefined) {
          console.warn(`[cron-market-call] Price missing for ${q.symbol}, skipping question resolution.`);
          continue;
        }

        const refPrice = Number(q.reference_price);
        let outcome: "higher" | "lower" | "flat" = "flat";
        if (actualClose > refPrice) outcome = "higher";
        else if (actualClose < refPrice) outcome = "lower";

        const { data: updatedQ, error: uqErr } = await supabase
          .from("market_call_questions")
          .update({
            actual_close_price: actualClose,
            outcome
          })
          .eq("id", q.id)
          .select()
          .single();

        if (uqErr) throw uqErr;
        resolvedQuestions.push(updatedQ);
      }

      // 5. Score predictions
      const questionIds = resolvedQuestions.map(rq => rq.id);
      const { data: predictions, error: predErr } = await supabase
        .from("market_call_predictions")
        .select("*")
        .in("question_id", questionIds);

      if (predErr) throw predErr;

      const questionOutcomeMap = new Map<string, string>();
      resolvedQuestions.forEach(rq => questionOutcomeMap.set(rq.id, rq.outcome));

      for (const pred of predictions || []) {
        const actualOutcome = questionOutcomeMap.get(pred.question_id);
        if (!actualOutcome) continue;

        const isCorrect = pred.call === actualOutcome;
        const pointsAwarded = isCorrect ? 10 : 0;

        const { error: updErr } = await supabase
          .from("market_call_predictions")
          .update({
            is_correct: isCorrect,
            points_awarded: pointsAwarded
          })
          .eq("id", pred.id);

        if (updErr) throw updErr;
      }

      // 6. Update week status to resolved
      const { error: updWeekErr } = await supabase
        .from("market_call_weeks")
        .update({ status: "resolved" })
        .eq("id", week.id);

      if (updWeekErr) throw updWeekErr;

      // 7. Get weekly leaderboard to award reward to the winner
      const { data: standings, error: rpcErr } = await supabase
        .rpc("get_market_call_leaderboard", { p_week_id: week.id })
        .limit(1);

      if (rpcErr) throw rpcErr;

      let rewardSummary = null;
      if (standings && standings.length > 0) {
        const winner = standings[0];
        const winnerId = winner.user_id;

        console.log(`[cron-market-call] Winner of week ${week.week_number} is user ${winnerId} with ${winner.total_points} points.`);

        // A. Award gamification badge
        const badgeResult = await awardBadge(winnerId, "verified_caller");

        // B. Update profile subscription tier to 'edge'
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({
            subscription_tier: "edge",
            subscription_status: "active"
          })
          .eq("id", winnerId);

        rewardSummary = {
          winner_id: winnerId,
          display_name: winner.display_name,
          points: winner.total_points,
          badge_success: badgeResult.success,
          tier_upgrade_success: !profileErr
        };
      }

      return NextResponse.json({
        success: true,
        action: "resolve",
        week_resolved: week.week_number,
        questions_resolved_count: resolvedQuestions.length,
        predictions_scored_count: predictions?.length || 0,
        reward_summary: rewardSummary
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action parameter" }, { status: 400 });

  } catch (err: any) {
    console.error("[cron-market-call] Error executing cron task:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
