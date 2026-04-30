"use server";

import { createClient } from "@/lib/supabase/server";
import { runChallengeSimulation, SimulationResult } from "@/lib/simulator/engine";
import { getAnalysis } from "@/lib/ai";
import { IndividualTrade, PropFirm } from "@/types/dashboard";
import { revalidatePath } from "next/cache";

/**
 * Runs a challenge simulation and saves the result to the database
 */
export async function runSimulationAction(
  firmId: string,
  accountSize: number,
  trades: IndividualTrade[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Fetch Firm Rules
  const { data: firm, error: firmError } = await supabase
    .from("prop_firms")
    .select("*")
    .eq("id", firmId)
    .single();

  if (firmError || !firm) throw new Error("Prop firm not found");

  // 2. Run Deterministic Simulation
  const result = runChallengeSimulation(firm as any, accountSize, trades);

  // 3. Save to Simulation Results table
  const { data: savedResult, error: saveError } = await supabase
    .from("simulation_results")
    .insert([{
      user_id: user.id,
      prop_firm_id: firmId,
      account_size: accountSize,
      result: result.result,
      risk_score: result.riskScore,
      final_balance: result.finalBalance,
      peak_balance: result.peakBalance,
      max_drawdown_reached: result.maxDrawdownReached,
      worst_daily_loss: result.maxDailyLossReached,
      trading_days: result.tradingDays,
      profit_reached: result.profitReached,
      equity_curve: result.equityCurve,
      daily_pnl: result.dailyPnL,
      trade_count: trades.length,
      simulation_date: new Date().toISOString()
    }])
    .select()
    .single();

  if (saveError) {
    console.error("Error saving simulation:", saveError);
  }

  return { ...result, id: savedResult?.id };
}

/**
 * Generates an AI Prep Plan using Claude based on simulation results
 */
export async function generateAIPrepPlan(simulationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Fetch results
  const { data: sim, error } = await supabase
    .from("simulation_results")
    .select("*, prop_firms(*)")
    .eq("id", simulationId)
    .single();

  if (error || !sim) throw new Error("Simulation results not found");

  // 2. Build AI Prompt
  const prompt = `
    You are a prop firm challenge coach. A trader just simulated a ${sim.prop_firms.name} challenge with a $${sim.account_size} account and the result was: ${sim.result.toUpperCase()}.

    STATS:
    - Final Balance: $${Number(sim.final_balance).toFixed(2)}
    - Max Drawdown Reached: $${Number(sim.max_drawdown_reached).toFixed(2)} (Limit: $${(Number(sim.account_size) * Number(sim.prop_firms.default_max_drawdown_pct) / 100).toFixed(2)})
    - Worst Daily Loss: $${Number(sim.worst_daily_loss).toFixed(2)}
    - Trading Days: ${sim.trading_days}
    - Profit Reached: $${Number(sim.profit_reached).toFixed(2)}
    - Risk Score: ${sim.risk_score}/100

    Write a personalized prep plan in 3-4 paragraphs covering:
    1) What went wrong (or right if passed).
    2) Specific risk management adjustments needed.
    3) A practical plan for their next attempt with concrete examples.

    Be direct, specific, and encouraging. Reference their actual numbers. UK English (e.g. use 'capital', 'risk management', 'discipline').
  `;

  const systemPrompt = "You are an elite prop trading mentor for Drawdown.trading. Your goal is to help traders pass institutional evaluations.";

  // 3. Get Analysis
  // Using 'backtest_coach' scope for now as it's the closest match
  const plan = await getAnalysis(prompt, systemPrompt, 'backtest_coach');

  // 4. Update Result with Plan
  await supabase
    .from("simulation_results")
    .update({ ai_prep_plan: plan })
    .eq("id", simulationId);

  return plan;
}

/**
 * Fetches existing trades for a user to use in simulation
 */
export async function getUserTradesForSimulation(accountId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("individual_trades")
    .select("*")
    .eq("user_id", user.id);

  if (accountId) {
    query = query.eq("account_id", accountId);
  }

  const { data, error } = await query.order("entry_time", { ascending: true });
  if (error) return [];
  return data;
}
