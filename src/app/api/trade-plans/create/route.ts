import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculatePositionSize } from "@/lib/position-sizing";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      instrument,
      direction,
      entryPrice,
      stopPrice,
      targetPrice,
      accountId,
      riskPct,
      thesis,
      invalidationCriteria,
      checklistResults,
    } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: "Trading account is required." },
        { status: 400 }
      );
    }

    // 1. Validate account ownership server-side
    const { data: account, error: accountError } = await (supabase as any)
      .from("trading_accounts")
      .select("id, user_id, current_equity, starting_balance, is_active")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "Trading account not found or access denied." },
        { status: 403 }
      );
    }

    const balance = account.current_equity || account.starting_balance || 10000;

    // 2. Perform authoritative position sizing calculation and validation
    const calcResult = calculatePositionSize({
      instrument,
      direction,
      entryPrice: Number(entryPrice),
      stopPrice: Number(stopPrice),
      targetPrice: Number(targetPrice),
      accountBalance: balance,
      riskPct: Number(riskPct),
    });

    if (!calcResult.isValid) {
      return NextResponse.json(
        {
          error: "Invalid trade plan parameters.",
          details: calcResult.errors,
        },
        { status: 400 }
      );
    }

    // 3. Persist to trade_plans
    const dirForDb = calcResult.direction === "long" ? "buy" : "sell";
    const entryZone = `${(calcResult.entryPrice * 0.999).toFixed(5)} - ${(calcResult.entryPrice * 1.001).toFixed(5)}`;

    const { data: planData, error: planError } = await (supabase as any)
      .from("trade_plans")
      .insert({
        user_id: user.id,
        account_id: account.id,
        instrument: calcResult.instrument,
        direction: dirForDb,
        entry_zone: entryZone,
        invalidation_level: calcResult.stopPrice,
        stop_loss: calcResult.stopPrice,
        proposed_size: calcResult.lots,
        target_logic: `Target RRR of ${calcResult.rewardRiskRatio}R (Target: ${calcResult.targetPrice})`,
        status: "ready",
      })
      .select("id")
      .single();

    if (planError || !planData) {
      console.error("[TradePlans:Create] Database error inserting plan:", planError);
      return NextResponse.json(
        { error: "Failed to persist trade plan to database." },
        { status: 500 }
      );
    }

    // 4. Create immutable snapshot in trade_plan_snapshots
    const snapshotData = {
      instrument: calcResult.instrument,
      direction: calcResult.direction,
      entryPrice: calcResult.entryPrice,
      stopPrice: calcResult.stopPrice,
      targetPrice: calcResult.targetPrice,
      proposedLots: calcResult.lots,
      cashRisk: calcResult.cashRisk,
      cashReward: calcResult.cashReward,
      riskPct: calcResult.riskPct,
      rewardRiskRatio: calcResult.rewardRiskRatio,
      drawdownImpactPct: calcResult.drawdownImpactPct,
      thesis: thesis || "",
      invalidationCriteria: invalidationCriteria || "",
      checklistResults: checklistResults || [],
      savedAt: new Date().toISOString(),
      accountRef: {
        id: account.id,
        balance,
      },
    };

    const { error: snapshotError } = await (supabase as any)
      .from("trade_plan_snapshots")
      .insert({
        trade_plan_id: planData.id,
        user_id: user.id,
        snapshot_data: snapshotData,
      });

    if (snapshotError) {
      console.error("[TradePlans:Create] Database error creating snapshot:", snapshotError);
      // Even if snapshot table has error, the plan was saved
    }

    return NextResponse.json({
      success: true,
      planId: planData.id,
      calculation: calcResult,
    });
  } catch (err: any) {
    console.error("[TradePlans:Create] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
